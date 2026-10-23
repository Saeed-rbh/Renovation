import { loadBackup, validateBackup } from '../server/import-backup.js';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
const directory = path.resolve(process.argv[2]);
const backup = await loadBackup(directory);
validateBackup(backup);
const sourceFiles = {};
for (const name of ['checksums.json', ...Object.keys(backup.manifest).filter(name => !name.startsWith('objects/'))]) {
  sourceFiles[name] = await readFile(path.join(directory, name), 'utf8');
}
const target = path.join(directory, 'render-bootstrap.json');
const payload = JSON.stringify({ format: 1, id: backup.id, sourceFiles });
await writeFile(target, JSON.stringify({ encoding: 'gzip-base64', data: gzipSync(payload).toString('base64') }), { mode: 0o600 });
console.log('Verified Render bootstrap prepared:', target);
