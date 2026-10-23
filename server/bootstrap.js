import { readFile } from 'node:fs/promises';
import { digest, importBackup } from './import-backup.js';
import { gunzipSync } from 'node:zlib';

export async function bootstrap(pool, dataDir, filename) {
  if (!filename) return;
  const bundle = JSON.parse(await readFile(filename, 'utf8'));
  const payload = bundle.encoding === 'gzip-base64' ? JSON.parse(gunzipSync(Buffer.from(bundle.data, 'base64'), { maxOutputLength: 4 * 1024 * 1024 }).toString()) : bundle;
  if (payload.format !== 1) throw new Error('Unexpected bootstrap format');
  const manifest = JSON.parse(payload.sourceFiles['checksums.json']);
  if (digest(JSON.stringify(manifest)) !== payload.id) throw new Error('Bootstrap manifest checksum mismatch');
  for (const [name, checksum] of Object.entries(manifest)) {
    if (!name.startsWith('objects/') && digest(payload.sourceFiles[name] || '') !== checksum) throw new Error('Bootstrap file checksum mismatch');
  }
  const parse = name => JSON.parse(payload.sourceFiles[name + '.json']);
  const result = await importBackup(pool, { id: payload.id, manifest, firestore: parse('firestore'),
    users: parse('auth-users'), configuration: parse('auth-config'), storage: parse('storage'), summary: parse('summary') }, dataDir, { download: true });
  console.log('Verified migration:', JSON.stringify(result));
}
