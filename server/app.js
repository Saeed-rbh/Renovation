import express from 'express';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import multer from 'multer';
import { randomBytes, randomUUID, createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { decodeFields, encodeFields } from './values.js';
import { verifyPassword } from './passwords.js';

const sha256 = value => createHash('sha256').update(value).digest('hex');
const PUBLIC = new Set(['projects', 'services', 'operations', 'content', 'social_links', 'stats']);
const COLLECTIONS = new Set([...PUBLIC, 'messages']);
const validId = id => typeof id === 'string' && id.length > 0 && id.length <= 256 && !/[\x00-\x1f/]/.test(id);
const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);

export function createApp({ pool, dataDir, publicOrigins, production = true, distDir = fileURLToPath(new URL('../app/dist', import.meta.url)) }) {
  const app = express();
  app.set('trust proxy', 1);
  // Existing analytics, EmailJS, and externally hosted portfolio photos need
  // their original domains. Other Helmet protections remain enabled.
  app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use('/api', rateLimit({ windowMs: 60_000, limit: 180, standardHeaders: 'draft-8', legacyHeaders: false }));
  app.use('/api', (req, res, next) => {
    if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      if (req.headers['sec-fetch-site'] === 'cross-site' || (req.headers.origin && !publicOrigins.includes(req.headers.origin))) {
        return res.status(403).json({ error: 'Request origin is not allowed' });
      }
    }
    next();
  });
  app.use(express.json({ limit: '2mb' }));
  app.use('/api', async (req, res, next) => {
    try {
      const ready = await pool.query("SELECT value FROM settings WHERE key='initial-import'");
      if (!ready.rows.length) return res.status(503).json({ error: 'Verified data migration is pending' });
      next();
    } catch (error) { next(error); }
  });
  app.use('/api', async (req, res, next) => {
    try {
      const token = /(?:^|;\s*)renovation_session=([a-f0-9]{64})(?:;|$)/.exec(req.headers.cookie || '')?.[1];
      if (token) {
        const result = await pool.query(`SELECT a.id, a.email FROM sessions s JOIN accounts a ON a.id=s.account_id
          WHERE s.digest=$1 AND s.expires_at > now() AND coalesce((a.source->>'disabled')::boolean,false)=false`, [sha256(token)]);
        req.user = result.rows[0];
      }
      res.setHeader('Cache-Control', 'no-store');
      next();
    } catch (error) { next(error); }
  });
  const admin = (req, res, next) => req.user ? next() : res.status(401).json({ error: 'Admin login required' });
  const collectionGuard = (req, res, next) => {
    if (!COLLECTIONS.has(req.params.collection) || (req.params.id !== undefined && !validId(req.params.id))) return res.sendStatus(404);
    next();
  };

  app.get('/api/health', async (req, res) => {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', storage: 'postgres' });
  });
  app.get('/api/auth/me', (req, res) => res.json({ user: req.user || null }));
  app.post('/api/auth/login', rateLimit({ windowMs: 15 * 60_000, limit: 10, standardHeaders: 'draft-8', legacyHeaders: false }), async (req, res) => {
    const { email, password } = req.body || {};
    if (typeof email !== 'string' || email.length > 320 || typeof password !== 'string' || password.length > 1024) return res.status(400).json({ error: 'Invalid login' });
    const accounts = await pool.query('SELECT * FROM accounts WHERE lower(email)=lower($1)', [email.trim()]);
    const settings = await pool.query("SELECT value FROM settings WHERE key='firebase-auth-config'");
    const account = accounts.rows[0];
    const verified = account && await verifyPassword(password, account.source, settings.rows[0]?.value);
    if (!verified) return res.status(401).json({ error: 'Invalid email or password' });
    const token = randomBytes(32).toString('hex');
    await pool.query("DELETE FROM sessions WHERE expires_at <= now()");
    await pool.query("INSERT INTO sessions(digest,account_id,expires_at) VALUES($1,$2,now()+interval '12 hours')", [sha256(token), account.id]);
    res.cookie('renovation_session', token, { httpOnly: true, secure: production, sameSite: 'lax', maxAge: 12 * 60 * 60_000, path: '/' });
    res.json({ user: { id: account.id, email: account.email } });
  });
  app.post('/api/auth/logout', async (req, res) => {
    const token = /(?:^|;\s*)renovation_session=([a-f0-9]{64})(?:;|$)/.exec(req.headers.cookie || '')?.[1];
    if (token) await pool.query('DELETE FROM sessions WHERE digest=$1', [sha256(token)]);
    res.clearCookie('renovation_session', { httpOnly: true, secure: production, sameSite: 'lax', path: '/' });
    res.json({ ok: true });
  });

  async function serializeDocuments(rows) {
    const files = await pool.query('SELECT id, original_name FROM files');
    const mapping = new Map(files.rows.map(file => [file.original_name, '/media/' + file.id]));
    const rewrite = value => {
      if (Array.isArray(value)) return value.map(rewrite);
      if (isObject(value)) return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, rewrite(item)]));
      if (typeof value === 'string') {
        try {
          const url = new URL(value);
          const prefix = '/v0/b/homev-construction.firebasestorage.app/o/';
          if (url.hostname === 'firebasestorage.googleapis.com' && url.pathname.startsWith(prefix)) {
            const name = decodeURIComponent(url.pathname.slice(prefix.length));
            if (!mapping.has(name)) throw new Error('Missing migrated image');
            return mapping.get(name);
          }
          if (url.hostname === 'storage.googleapis.com' && url.pathname.startsWith('/homev-construction.firebasestorage.app/')) {
            const name = decodeURIComponent(url.pathname.slice('/homev-construction.firebasestorage.app/'.length));
            if (!mapping.has(name)) throw new Error('Missing migrated image');
            return mapping.get(name);
          }
        } catch (error) {
          if (error.message === 'Missing migrated image') throw error;
        }
      }
      return value;
    };
    return rows.map(row => ({ id: row.path.split('/').at(-1), data: rewrite(decodeFields(row.fields)) }));
  }

  app.get('/api/documents/:collection', collectionGuard, async (req, res) => {
    if (!PUBLIC.has(req.params.collection) && !req.user) return res.sendStatus(401);
    const rows = await pool.query("SELECT path,fields FROM documents WHERE split_part(path,'/',1)=$1 AND deleted_at IS NULL ORDER BY path", [req.params.collection]);
    res.json({ documents: await serializeDocuments(rows.rows.filter(row => row.path.split('/').length === 2)) });
  });
  app.get('/api/documents/:collection/:id', collectionGuard, async (req, res) => {
    if (!PUBLIC.has(req.params.collection) && !req.user) return res.sendStatus(401);
    const rows = await pool.query('SELECT path,fields FROM documents WHERE path=$1 AND deleted_at IS NULL', [req.params.collection + '/' + req.params.id]);
    res.json({ document: (await serializeDocuments(rows.rows))[0] || null });
  });

  async function mutate(req, res) {
    const docPath = req.params.collection + '/' + (req.params.id || randomBytes(15).toString('hex'));
    const creating = req.method === 'POST';
    let anonymousInitialization = false;
    let data = req.body?.data;
    if (!isObject(data)) return res.status(400).json({ error: 'Invalid document' });
    if (!req.user) {
      const counter = !creating && req.method === 'PATCH' && Object.keys(data).length === 1 &&
        ((req.params.collection === 'stats' && req.params.id === 'general' && isObject(data.visits) && data.visits.__op === 'increment' && data.visits.amount === 1) ||
         (['projects', 'services'].includes(req.params.collection) && isObject(data.views) && data.views.__op === 'increment' && data.views.amount === 1));
      const visitorInitialization = req.method === 'PUT' && docPath === 'stats/general' && Object.keys(data).length === 1 && data.visits === 1;
      if (visitorInitialization) {
        anonymousInitialization = true;
        data = { visits: { __op: 'increment', amount: 1 } };
      }
      if (creating && req.params.collection === 'messages') {
        if (typeof data.name !== 'string' || !data.name.trim() || data.name.length > 200 ||
            typeof data.message !== 'string' || !data.message.trim() || data.message.length > 15000 ||
            typeof data.email !== 'string' || data.email.length > 320 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) ||
            (data.phone !== undefined && (typeof data.phone !== 'string' || data.phone.length > 80))) return res.status(400).json({ error: 'Invalid inquiry' });
        data = { name: data.name, email: data.email, phone: data.phone || '', message: data.message, read: false, createdAt: { __op: 'serverTimestamp' } };
      } else if (!counter && !visitorInitialization) return res.sendStatus(401);
    }
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      // Serialize creates and updates too, including concurrent first visits.
      await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [docPath]);
      const result = await client.query('SELECT * FROM documents WHERE path=$1 FOR UPDATE', [docPath]);
      const previous = result.rows[0];
      if (req.method === 'PATCH' && !previous) {
        await client.query('ROLLBACK');
        return res.sendStatus(404);
      }
      if (previous && (req.user || req.params.collection === 'messages')) await client.query('INSERT INTO document_history(path,fields) VALUES($1,$2)', [docPath, previous.fields]);
      const next = encodeFields(data, previous?.fields);
      const fields = req.method === 'PATCH' || req.body?.merge || anonymousInitialization ? { ...previous?.fields, ...next } : next;
      await client.query(`INSERT INTO documents(path,fields) VALUES($1,$2)
        ON CONFLICT(path) DO UPDATE SET fields=$2,updated_at=now(),deleted_at=NULL`, [docPath, fields]);
      await client.query('COMMIT');
      res.status(creating ? 201 : 200).json({ id: docPath.split('/').at(-1) });
    } catch (error) { await client.query('ROLLBACK'); throw error; }
    finally { client.release(); }
  }
  app.post('/api/documents/:collection', collectionGuard, rateLimit({ windowMs: 60_000, limit: 12 }), mutate);
  app.put('/api/documents/:collection/:id', collectionGuard, mutate);
  app.patch('/api/documents/:collection/:id', collectionGuard, mutate);
  app.delete('/api/documents/:collection/:id', collectionGuard, admin, async (req, res) => {
    // Keep the full document so an accidental admin deletion remains recoverable.
    await pool.query('UPDATE documents SET deleted_at=now(),updated_at=now() WHERE path=$1', [req.params.collection + '/' + req.params.id]);
    res.json({ ok: true });
  });

  const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024, files: 1 } });
  app.post('/api/files', admin, upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Missing file' });
    const { buffer } = req.file;
    // Only allow raster image formats; SVG/HTML uploads must never execute.
    const contentType = buffer.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) ? 'image/png' :
      buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255 ? 'image/jpeg' :
      /^GIF8[79]a$/.test(buffer.subarray(0, 6).toString()) ? 'image/gif' :
      buffer.subarray(0, 4).toString() === 'RIFF' && buffer.subarray(8, 12).toString() === 'WEBP' ? 'image/webp' : null;
    if (!contentType) return res.status(400).json({ error: 'Choose a PNG, JPEG, GIF, or WebP image' });
    const id = randomUUID();
    const digest = sha256(buffer);
    await mkdir(path.join(dataDir, 'objects'), { recursive: true });
    await writeFile(path.join(dataDir, 'objects', digest), buffer, { flag: 'wx' }).catch(error => { if (error.code !== 'EEXIST') throw error; });
    await pool.query('INSERT INTO files(id,original_name,content_type,bytes,sha256) VALUES($1,$2,$3,$4,$5)', [id, req.file.originalname, contentType, buffer.length, digest]);
    res.json({ url: '/media/' + id });
  });
  app.get('/media/:id', async (req, res) => {
    const result = await pool.query('SELECT * FROM files WHERE id=$1', [req.params.id]);
    const file = result.rows[0];
    if (!file || !/^[a-f0-9]{64}$/.test(file.sha256)) return res.sendStatus(404);
    res.setHeader('Content-Type', file.content_type);
    res.setHeader('Content-Security-Policy', "default-src 'none'; sandbox");
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.sendFile(path.join(dataDir, 'objects', file.sha256));
  });
  app.use(express.static(distDir, { extensions: ['html'], index: false }));
  app.get('/{*route}', (req, res) => {
    if (req.path.startsWith('/api/') || req.path.startsWith('/media/')) return res.sendStatus(404);
    res.setHeader('Cache-Control', 'no-cache');
    res.sendFile(path.join(distDir, 'app-shell.html'));
  });
  app.use((error, req, res, next) => {
    console.error('Request failed:', error.code || error.name || 'Error');
    if (res.headersSent) return next(error);
    res.status(error.status && error.status < 500 ? error.status : 500).json({ error: 'Request could not be completed' });
  });
  return app;
}
