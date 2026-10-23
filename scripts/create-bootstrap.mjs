import { loadBackup, validateBackup } from '../server/import-backup.js';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
const directory = path.resolve(process.argv[2]);
const backup = await loadBackup(directory);
validateBackup(backup);
const sourceFiles = {};
for (const name of ['checksums.json', ...Object.keys(backup.manifest).filter(name => !name.startsWith('objects/'))]) {
  sourceFiles[name] = await readFile(path.join(directory, name), 'utf8');
}
const target = path.join(directory, 'render-bootstrap.json');
await writeFile(target, JSON.stringify({ format: 1, id: backup.id, sourceFiles }), { mode: 0o600 });
console.log('Verified Render bootstrap prepared:', target);
