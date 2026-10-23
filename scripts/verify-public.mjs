import { isDeepStrictEqual } from 'node:util';
import { loadBackup, fileId, digest } from '../server/import-backup.js';
import { decodeFields } from '../server/values.js';

const [directory, origin] = process.argv.slice(2);
if (!directory || !origin?.startsWith('https://')) throw new Error('Pass a backup directory and HTTPS site URL');
const backup = await loadBackup(directory);
const media = new Map(backup.storage.objects.map(o => [o.metadata.name, '/media/' + fileId(backup.storage.bucket, o.metadata.name)]));
function rewrite(value) {
  if (Array.isArray(value)) return value.map(rewrite);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, rewrite(v)]));
  if (typeof value === 'string') {
    let url;
    try { url = new URL(value); } catch { return value; }
    const prefix = '/v0/b/' + backup.storage.bucket + '/o/';
    if (url.hostname === 'firebasestorage.googleapis.com' && url.pathname.startsWith(prefix)) return media.get(decodeURIComponent(url.pathname.slice(prefix.length))) || value;
    const storagePrefix = '/' + backup.storage.bucket + '/';
    if (url.hostname === 'storage.googleapis.com' && url.pathname.startsWith(storagePrefix)) return media.get(decodeURIComponent(url.pathname.slice(storagePrefix.length))) || value;
  }
  return value;
}
for (const collection of ['projects', 'services', 'operations', 'content', 'social_links']) {
  const response = await fetch(origin + '/api/documents/' + collection);
  if (!response.ok) throw new Error('Public collection unavailable: ' + collection);
  const { documents } = await response.json();
  const expected = backup.firestore.documents.filter(d => d.name.split('/documents/')[1].split('/')[0] === collection);
  if (documents.length !== expected.length) throw new Error('Collection count mismatch: ' + collection);
  for (const record of expected) {
    const actual = documents.find(d => d.id === record.name.split('/').at(-1))?.data;
    const wanted = rewrite(decodeFields(record.fields));
    // Page views legitimately grow while the preview is being checked.
    if (['projects', 'services'].includes(collection)) {
      if (Number(actual?.views || 0) < Number(wanted.views || 0)) throw new Error('Lost view count');
      delete actual?.views;
      delete wanted.views;
    }
    if (!isDeepStrictEqual(actual, wanted)) throw new Error('Public content mismatch: ' + collection);
  }
  console.log('Verified public content:', collection, documents.length);
}
if ((await fetch(origin + '/api/documents/messages')).status !== 401) throw new Error('Private inquiries were exposed');
if ((await (await fetch(origin + '/api/auth/me')).json()).user !== null) throw new Error('Unexpected anonymous session');
let next = 0, verified = 0;
await Promise.all(Array.from({ length: 6 }, async () => {
  while (next < backup.storage.objects.length) {
    const object = backup.storage.objects[next++];
    const response = await fetch(origin + media.get(object.metadata.name), { signal: AbortSignal.timeout(90_000) });
    if (!response.ok) throw new Error('Migrated media unavailable');
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length !== Number(object.metadata.size) || digest(bytes) !== object.sha256) throw new Error('Migrated media checksum mismatch');
    verified++;
  }
}));
console.log('Verified production file bytes:', verified, '; private inquiries require admin login.');
