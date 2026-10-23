import { createHash } from 'node:crypto';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { isDeepStrictEqual } from 'node:util';

export const digest = bytes => createHash('sha256').update(bytes).digest('hex');
export const fileId = (bucket, name) => digest(bucket + '/' + name);

export async function loadBackup(directory) {
  const manifest = JSON.parse(await readFile(path.join(directory, 'checksums.json'), 'utf8'));
  for (const [name, checksum] of Object.entries(manifest)) {
    const file = path.resolve(directory, name);
    if (!file.startsWith(path.resolve(directory) + path.sep)) throw new Error('Unsafe backup path');
    if (digest(await readFile(file)) !== checksum) throw new Error('Backup checksum mismatch: ' + name);
  }
  const load = async name => JSON.parse(await readFile(path.join(directory, name + '.json'), 'utf8'));
  const [firestore, users, configuration, storage, summary] = await Promise.all([
    load('firestore'), load('auth-users'), load('auth-config'), load('storage'), load('summary')
  ]);
  return { firestore, users, configuration, storage, summary, manifest, id: digest(JSON.stringify(manifest)), directory };
}

export function validateBackup(backup) {
  if (backup.summary.project !== 'homev-construction' || backup.storage.bucket !== 'homev-construction.firebasestorage.app') throw new Error('Unexpected source project');
  if (backup.firestore.documents.length !== backup.summary.documentCount ||
      backup.users.users.length !== backup.summary.userCount || backup.storage.objects.length !== backup.summary.fileCount) throw new Error('Backup counts do not match');
  const paths = new Set();
  for (const document of backup.firestore.documents) {
    const prefix = 'projects/homev-construction/databases/(default)/documents/';
    if (!document.name.startsWith(prefix)) throw new Error('Unexpected source database');
    const docPath = document.name.slice(prefix.length);
    if (paths.has(docPath) || !docPath || docPath.split('/').length % 2) throw new Error('Invalid or duplicate document path');
    paths.add(docPath);
  }
  const hashes = backup.configuration.signIn?.hashConfig;
  if (!hashes || hashes.algorithm !== 'SCRYPT' || !hashes.signerKey) throw new Error('Password migration configuration is incomplete');
  for (const account of backup.users.users) {
    if (!account.localId || !account.email) throw new Error('An account requires additional migration support');
    if (!account.disabled && (!account.passwordHash || account.mfaInfo?.length || Number(account.version || 0) !== 0)) throw new Error('An enabled account requires additional login migration support');
  }
  const names = new Set();
  for (const object of backup.storage.objects) {
    if (names.has(object.metadata.name) || !/^[a-f0-9]{64}$/.test(object.sha256) || object.file !== 'objects/' + object.sha256) throw new Error('Invalid storage manifest');
    names.add(object.metadata.name);
  }
  // Every file in the application's source bucket must have a local copy.
  const serialized = JSON.stringify(backup.firestore.documents);
  for (const match of serialized.matchAll(/https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/homev-construction\.firebasestorage\.app\/o\/([^?"\\]+)[^"\\]*/g)) {
    if (!names.has(decodeURIComponent(match[1]))) throw new Error('A referenced image is missing from the backup');
  }
}

export async function importBackup(pool, backup, dataDir, { download = false } = {}) {
  validateBackup(backup);
  const marker = await pool.query("SELECT value FROM settings WHERE key='initial-import'");
  if (marker.rows.length) {
    if (marker.rows[0].value.id !== backup.id) throw new Error('A different backup was already imported; refusing to overwrite live data');
    return { alreadyImported: true, ...marker.rows[0].value };
  }
  const counts = await pool.query('SELECT (SELECT count(*) FROM documents)::int AS documents, (SELECT count(*) FROM accounts)::int AS accounts, (SELECT count(*) FROM files)::int AS files');
  if (Object.values(counts.rows[0]).some(Number)) throw new Error('Initial migration requires an empty target; refusing to replace data');
  await mkdir(path.join(dataDir, 'objects'), { recursive: true });
  let index = 0;
  const objects = backup.storage.objects;
  async function copyObjects() {
    while (index < objects.length) {
      const object = objects[index++];
      const destination = path.join(dataDir, 'objects', object.sha256);
      const existing = await readFile(destination).catch(error => { if (error.code !== 'ENOENT') throw error; return null; });
      if (existing && digest(existing) === object.sha256) continue;
      let bytes;
      if (!download) bytes = await readFile(path.join(backup.directory, object.file));
      else if (Number(object.metadata.size) === 0) bytes = Buffer.alloc(0);
      else {
        const token = object.metadata.metadata?.firebaseStorageDownloadTokens?.split(',')[0];
        if (!token) throw new Error('An object requires an authenticated transfer; refusing to skip it');
        const url = `https://firebasestorage.googleapis.com/v0/b/${backup.storage.bucket}/o/${encodeURIComponent(object.metadata.name)}?alt=media&token=${encodeURIComponent(token)}`;
        for (let attempt = 0; attempt < 4; attempt++) {
          try {
            const response = await fetch(url, { signal: AbortSignal.timeout(90_000) });
            if (!response.ok) throw new Error('Source image transfer failed');
            bytes = Buffer.from(await response.arrayBuffer());
            break;
          } catch (error) {
            if (attempt === 3) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * 2 ** attempt));
          }
        }
      }
      if (digest(bytes) !== object.sha256 || bytes.length !== Number(object.metadata.size)) throw new Error('Copied image does not match verified backup');
      await writeFile(destination, bytes, { mode: 0o600 });
    }
  }
  await Promise.all(Array.from({ length: 5 }, copyObjects));
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('LOCK TABLE documents,accounts,files,settings IN EXCLUSIVE MODE');
    const again = await client.query('SELECT (SELECT count(*) FROM documents)::int AS documents, (SELECT count(*) FROM accounts)::int AS accounts, (SELECT count(*) FROM files)::int AS files');
    if (Object.values(again.rows[0]).some(Number)) throw new Error('Target changed during migration');
    for (const document of backup.firestore.documents) {
      await client.query('INSERT INTO documents(path,fields,source,created_at,updated_at) VALUES($1,$2,$3,$4,$5)', [document.name.split('/documents/')[1], document.fields || {}, document, document.createTime, document.updateTime]);
    }
    for (const account of backup.users.users) await client.query('INSERT INTO accounts(id,email,source) VALUES($1,$2,$3)', [account.localId, account.email, account]);
    for (const object of objects) await client.query('INSERT INTO files(id,original_name,content_type,bytes,sha256,source) VALUES($1,$2,$3,$4,$5,$6)', [fileId(backup.storage.bucket, object.metadata.name), object.metadata.name, object.metadata.contentType || 'application/octet-stream', object.metadata.size, object.sha256, object.metadata]);
    await client.query('INSERT INTO settings(key,value) VALUES($1,$2)', ['firebase-auth-config', backup.configuration]);
    // Compare every source field and account, not just row counts, before commit.
    const restoredDocuments = await client.query('SELECT path,source FROM documents ORDER BY path');
    const expectedDocuments = [...backup.firestore.documents].sort((a, b) => a.name.localeCompare(b.name));
    const originalByPath = new Map(expectedDocuments.map(document => [document.name.split('/documents/')[1], document]));
    if (restoredDocuments.rows.length !== originalByPath.size || restoredDocuments.rows.some(row => !isDeepStrictEqual(row.source, originalByPath.get(row.path)))) throw new Error('Document restore verification failed');
    const restoredAccounts = await client.query('SELECT id,source FROM accounts');
    const originalById = new Map(backup.users.users.map(account => [account.localId, account]));
    if (restoredAccounts.rows.length !== originalById.size || restoredAccounts.rows.some(row => !isDeepStrictEqual(row.source, originalById.get(row.id)))) throw new Error('Account restore verification failed');
    const restoredFiles = await client.query('SELECT original_name,sha256,source FROM files');
    const originalByName = new Map(objects.map(object => [object.metadata.name, object]));
    if (restoredFiles.rows.length !== objects.length || restoredFiles.rows.some(row => row.sha256 !== originalByName.get(row.original_name)?.sha256 ||
      !isDeepStrictEqual(row.source, originalByName.get(row.original_name)?.metadata))) throw new Error('File manifest restore verification failed');
    const result = { id: backup.id, readTime: backup.summary.readTime, documents: backup.summary.documentCount, accounts: backup.summary.userCount, files: backup.summary.fileCount, verifiedAt: new Date().toISOString() };
    await client.query('INSERT INTO settings(key,value) VALUES($1,$2)', ['initial-import', result]);
    await client.query('COMMIT');
    return result;
  } catch (error) { await client.query('ROLLBACK'); throw error; }
  finally { client.release(); }
}
