import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { pool, initialize } from './db.js';
import { createApp } from './app.js';
import { bootstrap } from './bootstrap.js';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL must be configured');
const dataDir = path.resolve(process.env.DATA_DIR || './server/data');
await mkdir(path.join(dataDir, 'objects'), { recursive: true });
await initialize();
await bootstrap(pool, dataDir, process.env.BOOTSTRAP_FILE);
const publicOrigins = (process.env.PUBLIC_ORIGINS || '').split(',').map(value => value.trim()).filter(Boolean);
if (process.env.NODE_ENV === 'production' && !publicOrigins.length) throw new Error('PUBLIC_ORIGINS must be configured');
const app = createApp({ pool, dataDir, publicOrigins, production: process.env.NODE_ENV === 'production' });
const server = app.listen(process.env.PORT || 8080, '0.0.0.0', () => console.log('Renovation server ready'));
process.on('SIGTERM', () => server.close(() => pool.end()));
