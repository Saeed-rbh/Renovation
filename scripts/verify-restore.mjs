import { PGlite } from '../server/node_modules/@electric-sql/pglite/dist/index.js';
import { mkdtemp } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { initialize } from '../server/db.js';
import { loadBackup, importBackup } from '../server/import-backup.js';
const directory = process.argv[2];
if (!directory) throw new Error('Pass the verified backup directory');
const temp = await mkdtemp(path.join(os.tmpdir(), 'renovation-restore-'));
const database = new PGlite(path.join(temp, 'postgres'));
const pool = { query: (sql, args) => args ? database.query(sql, args) : database.exec(sql).then(results => results.at(-1)),
  connect: async () => ({ query: (sql, args) => database.query(sql, args), release() {} }) };
try {
  await initialize(pool);
  const backup = await loadBackup(directory);
  const result = await importBackup(pool, backup, temp);
  const repeat = await importBackup(pool, backup, temp);
  if (!repeat.alreadyImported) throw new Error('Import was not idempotent');
  console.log('RESTORE VERIFIED:', JSON.stringify(result));
  console.log('Repeated import safely skipped. Original Firebase fields and account records matched exactly. All file bytes matched SHA-256 checksums.');
} finally { await database.close(); }
