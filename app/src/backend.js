// Same-origin Render API. This small adapter preserves the existing editors'
// document interfaces while removing their Firebase runtime dependency.
const API = import.meta.env.VITE_API_URL || '/api';
export const db = {};
export const auth = { currentUser: null };
export const storage = {};
const authListeners = new Set();

async function request(route, options = {}) {
  const response = await fetch(API + route, { credentials: 'same-origin', ...options,
    headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers } });
  if (!response.ok) {
    if (response.status === 401 && route !== '/auth/login') publishUser(null);
    throw new Error((await response.json().catch(() => null))?.error || `Request failed (${response.status})`);
  }
  return response.json();
}
const documentRoute = ref => '/documents/' + ref.parts.map(encodeURIComponent).join('/');
export const collection = (_db, ...parts) => ({ parts: parts.map(String), kind: 'collection' });
export const doc = (_db, ...parts) => ({ parts: parts.map(String), kind: 'document' });
export const query = (ref, ...constraints) => ({ ...ref, constraints });
export const orderBy = (field, direction = 'asc') => ({ kind: 'order', field, direction });
export const limit = count => ({ kind: 'limit', count });
export const where = (field, operator, value) => ({ kind: 'where', field, operator, value });
export const increment = amount => ({ __op: 'increment', amount });
export const serverTimestamp = () => ({ __op: 'serverTimestamp' });
function revive(value) {
  if (Array.isArray(value)) return value.map(revive);
  if (value && typeof value === 'object') {
    if (value.__timestamp) return { ...value, toDate: () => new Date(value.__timestamp) };
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, revive(item)]));
  }
  return value;
}
function snapshot(row, id) {
  return { id: row?.id || id, exists: () => !!row, data: () => row ? revive(row.data) : undefined };
}
export async function getDoc(ref) {
  return snapshot((await request(documentRoute(ref))).document, ref.parts.at(-1));
}
export async function getDocs(ref) {
  let rows = (await request(documentRoute(ref))).documents;
  const field = (data, name) => name.split('.').reduce((value, key) => value?.[key], data);
  for (const constraint of ref.constraints || []) {
    if (constraint.kind === 'order') rows.sort((a, b) => {
      const x = field(a.data, constraint.field), y = field(b.data, constraint.field);
      return (x === y ? 0 : x === undefined ? 1 : y === undefined ? -1 : x < y ? -1 : 1) * (constraint.direction === 'desc' ? -1 : 1);
    });
    if (constraint.kind === 'where') {
      if (constraint.operator !== '==') throw new Error('Unsupported query operator');
      rows = rows.filter(row => field(row.data, constraint.field) === constraint.value);
    }
    if (constraint.kind === 'limit') rows = rows.slice(0, constraint.count);
  }
  const docs = rows.map(row => snapshot(row));
  return { docs, empty: docs.length === 0, size: docs.length, forEach: callback => docs.forEach(callback) };
}
export const setDoc = (ref, data, options) => request(documentRoute(ref), { method: 'PUT', body: JSON.stringify({ data, merge: !!options?.merge }) });
export const updateDoc = (ref, data) => request(documentRoute(ref), { method: 'PATCH', body: JSON.stringify({ data }) });
export const deleteDoc = ref => request(documentRoute(ref), { method: 'DELETE' });
export async function addDoc(ref, data) {
  const result = await request(documentRoute(ref), { method: 'POST', body: JSON.stringify({ data }) });
  return doc(db, ...ref.parts, result.id);
}
export function onSnapshot(ref, callback, onError = console.error) {
  let cancelled = false;
  const refresh = async () => {
    try { const result = await getDoc(ref); if (!cancelled) callback(result); }
    catch (error) { if (!cancelled) onError(error); }
  };
  refresh();
  const timer = setInterval(refresh, 15000);
  return () => { cancelled = true; clearInterval(timer); };
}
function publishUser(user) {
  auth.currentUser = user;
  authListeners.forEach(callback => callback(user));
}
export function onAuthStateChanged(_auth, callback) {
  let active = true;
  authListeners.add(callback);
  request('/auth/me').then(result => { if (active) publishUser(result.user); }).catch(() => { if (active) callback(null); });
  return () => { active = false; authListeners.delete(callback); };
}
export async function signInWithEmailAndPassword(_auth, email, password) {
  const result = await request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  publishUser(result.user);
  return result;
}
export async function signOut() {
  await request('/auth/logout', { method: 'POST', body: '{}' });
  publishUser(null);
}

export const ref = (_storage, name) => ({ name });
export const getDownloadURL = reference => Promise.resolve(reference.url);
export function uploadBytesResumable(reference, file) {
  const xhr = new XMLHttpRequest();
  const task = { snapshot: { ref: reference, state: 'running', bytesTransferred: 0, totalBytes: file.size } };
  let progress, failed, completed;
  task.on = (_event, onProgress, onError, onComplete) => { progress = onProgress; failed = onError; completed = onComplete; };
  task.cancel = () => xhr.abort();
  xhr.open('POST', API + '/files');
  xhr.timeout = 60000;
  xhr.upload.onprogress = event => { task.snapshot.bytesTransferred = event.loaded; progress?.(task.snapshot); };
  const failure = error => { task.snapshot.state = 'error'; failed?.(error); };
  xhr.onerror = () => failure(new Error('Image upload failed'));
  xhr.ontimeout = () => failure(new Error('Image upload timed out'));
  xhr.onabort = () => failure(Object.assign(new Error('Upload cancelled'), { code: 'storage/canceled' }));
  xhr.onload = () => {
    if (xhr.status !== 200) return failure(new Error('Image upload failed; check your login and file format'));
    try {
      reference.url = JSON.parse(xhr.responseText).url;
      task.snapshot.state = 'success';
      task.snapshot.bytesTransferred = file.size;
      progress?.(task.snapshot);
      completed?.();
    } catch { failure(new Error('Invalid upload response')); }
  };
  const form = new FormData();
  form.append('file', file);
  xhr.send(form);
  return task;
}
