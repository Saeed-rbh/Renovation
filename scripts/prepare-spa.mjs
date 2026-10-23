import { copyFile } from 'node:fs/promises';
await copyFile(new URL('../app/dist/index.html', import.meta.url), new URL('../app/dist/app-shell.html', import.meta.url));
