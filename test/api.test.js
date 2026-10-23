import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { mkdtemp, writeFile, mkdir, readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { PGlite } from '../server/node_modules/@electric-sql/pglite/dist/index.js';
import { initialize } from '../server/db.js';
import { createApp } from '../server/app.js';
import { importBackup, digest } from '../server/import-backup.js';

test('restore is exact and non-destructive; admin data, uploads and writes require authentication', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'renovation-test-'));
  const database = new PGlite();
  const pool = { query: (sql, args) => args ? database.query(sql, args) : database.exec(sql).then(results => results.at(-1)),
    connect: async () => ({ query: (sql, args) => database.query(sql, args), release() {} }) };
  await initialize(pool);
  const png = Buffer.from('89504e470d0a1a0a00000000', 'hex');
  const checksum = digest(png);
  await mkdir(path.join(directory, 'objects'));
  await writeFile(path.join(directory, 'objects', checksum), png);
  const makeDocument = (name, fields) => ({ name: 'projects/homev-construction/databases/(default)/documents/' + name, fields,
    createTime: '2026-01-01T00:00:00Z', updateTime: '2026-01-01T00:00:00Z' });
  const backup = { id: 'fixture', directory, summary: { project: 'homev-construction', documentCount: 3, userCount: 1, fileCount: 1 },
    firestore: { documents: [makeDocument('projects/original-id', { title: { stringValue: 'Existing Project' }, views: { integerValue: '17' } }),
      makeDocument('messages/private-id', { name: { stringValue: 'Private inquiry' } }), makeDocument('stats/general', { visits: { integerValue: '99' } })] },
    users: { users: [{ localId: 'original-user-id', email: 'admin@example.test', salt: '42xEC+ixf3L2lw==',
      passwordHash: 'lSrfV15cpx95/sZS2W9c9Kp6i/LVgQNDNC/qzrCnh1SAyZvqmZqAjTdn3aoItz+VHjoZilo78198JAdRuid5lQ==' }] },
    configuration: { signIn: { hashConfig: { algorithm: 'SCRYPT', signerKey: 'jxspr8Ki0RYycVU8zykbdLGjFQ3McFUH0uiiTvC8pVMXAn210wjLNmdZJzxUECKbm0QsEmYUSDzZvpjeJ9WmXA==', saltSeparator: 'Bw==', rounds: 8, memoryCost: 14 } } },
    storage: { bucket: 'homev-construction.firebasestorage.app', objects: [{ file: 'objects/' + checksum, sha256: checksum,
      metadata: { name: 'uploads/photo.png', contentType: 'image/png', size: String(png.length) } }] } };
  const result = await importBackup(pool, backup, path.join(directory, 'restored'));
  assert.equal(result.documents, 3);
  assert.equal(result.accounts, 1);
  assert.equal(result.files, 1);
  assert.deepEqual(await readFile(path.join(directory, 'restored/objects', checksum)), png);
  await pool.query("UPDATE documents SET fields=jsonb_set(fields,'{title,stringValue}','\"Edited after import\"') WHERE path='projects/original-id'");
  assert.equal((await importBackup(pool, backup, directory)).alreadyImported, true);
  await assert.rejects(importBackup(pool, { ...backup, id: 'different' }, directory), /refusing to overwrite/);

  const app = createApp({ pool, dataDir: path.join(directory, 'restored'), publicOrigins: ['http://localhost'], production: false });
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const origin = 'http://127.0.0.1:' + server.address().port;
  const send = (url, method = 'GET', body, cookie, requestOrigin = 'http://localhost') => fetch(origin + url, {
    method, headers: { 'Content-Type': 'application/json', Origin: requestOrigin, ...(cookie ? { Cookie: cookie } : {}) },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}) });
  try {
    const publicProjects = await (await send('/api/documents/projects')).json();
    assert.equal(publicProjects.documents[0].id, 'original-id');
    assert.equal(publicProjects.documents[0].data.title, 'Edited after import');
    assert.equal((await send('/api/documents/messages')).status, 401);
    assert.equal((await send('/api/documents/projects/original-id', 'PUT', { data: { title: 'Attacker' } })).status, 401);
    assert.equal((await send('/api/files', 'POST', {})).status, 401);
    assert.equal((await send('/api/documents/stats/general', 'PATCH', { data: { visits: { __op: 'increment', amount: 1 } } })).status, 200);
    assert.equal((await (await send('/api/documents/stats/general')).json()).document.data.visits, 100);
    const message = { data: { name: 'Prospect', email: 'prospect@example.test', message: 'New inquiry', read: true } };
    assert.equal((await send('/api/documents/messages', 'POST', message, undefined, 'https://attacker.test')).status, 403);
    assert.equal((await send('/api/documents/messages', 'POST', message)).status, 201);
    assert.equal((await send('/api/auth/login', 'POST', { email: 'admin@example.test', password: 'incorrect' })).status, 401);
    const login = await send('/api/auth/login', 'POST', { email: 'admin@example.test', password: 'user1password' });
    assert.equal(login.status, 200);
    const cookie = login.headers.get('set-cookie').split(';')[0];
    assert.match(login.headers.get('set-cookie'), /HttpOnly/);
    const inbox = await (await send('/api/documents/messages', 'GET', undefined, cookie)).json();
    assert.equal(inbox.documents.length, 2);
    assert.equal(inbox.documents.find(doc => doc.data.name === 'Prospect').data.read, false);
    assert.equal((await send('/api/documents/projects/original-id', 'DELETE', undefined, cookie)).status, 200);
    assert.equal((await (await send('/api/documents/projects')).json()).documents.length, 0);
    assert.equal((await pool.query("SELECT count(*)::int AS n FROM documents WHERE path='projects/original-id' AND deleted_at IS NOT NULL")).rows[0].n, 1);
    await send('/api/auth/logout', 'POST', {}, cookie);
    assert.equal((await send('/api/documents/messages', 'GET', undefined, cookie)).status, 401);
  } finally {
    await new Promise(resolve => server.close(resolve));
    await database.close();
  }
});
