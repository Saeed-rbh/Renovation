#!/usr/bin/env python3
"""Read-only authenticated export. Run in the project's authorized Cloud Shell.

Never prints account data, password hashes, tokens, or document contents.
Retains Firestore's native typed values and exact storage object generations.
"""
import base64
import collections
import datetime
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
import tarfile
import time
import urllib.error
import urllib.parse
import urllib.request

PROJECT = 'homev-construction'
BUCKET = 'homev-construction.firebasestorage.app'

def main():
    os.umask(0o077)
    stamp = datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%SZ')
    destination = Path(sys.argv[1] if len(sys.argv) > 1 else f'renovation-backup-{stamp}')
    destination.mkdir(exist_ok=False)
    token = subprocess.check_output(['gcloud', 'auth', 'print-access-token'], text=True).strip()

    def request(url, body=None, raw=False):
        data = None if body is None else json.dumps(body).encode()
        for attempt in range(5):
            req = urllib.request.Request(url, data=data, headers={
                'Authorization': f'Bearer {token}', 'Content-Type': 'application/json',
                'x-goog-user-project': PROJECT})
            try:
                with urllib.request.urlopen(req, timeout=120) as response:
                    result = response.read()
                return result if raw else json.loads(result or b'{}')
            except urllib.error.HTTPError as error:
                if error.code in (429, 500, 502, 503, 504) and attempt < 4:
                    time.sleep(2 ** attempt)
                    continue
                raise RuntimeError(f'Backup read failed (HTTP {error.code}) for {url.split("?")[0]}') from None

    def save(name, data):
        path = destination / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')

    read_time = datetime.datetime.now(datetime.timezone.utc).isoformat().replace('+00:00', 'Z')
    documents = []
    collections_seen = []

    def walk(parent):
        page = ''
        while True:
            result = request(f'https://firestore.googleapis.com/v1/{parent}:listCollectionIds',
                             {'pageSize': 100, 'pageToken': page, 'readTime': read_time})
            for collection in result.get('collectionIds', []):
                collection_path = parent + '/' + urllib.parse.quote(collection, safe='')
                collections_seen.append(collection_path)
                next_page = ''
                while True:
                    params = urllib.parse.urlencode({'pageSize': 100, 'pageToken': next_page,
                                                     'readTime': read_time, 'showMissing': 'true'})
                    batch = request(f'https://firestore.googleapis.com/v1/{collection_path}?{params}')
                    for document in batch.get('documents', []):
                        # Missing ancestors still need traversal to find subcollections.
                        if 'createTime' in document:
                            documents.append(document)
                        walk(document['name'])
                    next_page = batch.get('nextPageToken', '')
                    if not next_page:
                        break
            page = result.get('nextPageToken', '')
            if not page:
                break

    databases = request(f'https://firestore.googleapis.com/v1/projects/{PROJECT}/databases')
    save('firestore-databases.json', databases)
    for database in databases.get('databases', []):
        walk(database['name'] + '/documents')
    save('firestore.json', {'readTime': read_time, 'documents': documents,
                            'collections': collections_seen})
    print(f'Firestore: {len(documents)} documents, {len(collections_seen)} collections', flush=True)

    users, page = [], ''
    while True:
        params = urllib.parse.urlencode({'maxResults': 1000, 'nextPageToken': page})
        batch = request(f'https://identitytoolkit.googleapis.com/v1/projects/{PROJECT}/accounts:batchGet?{params}')
        users.extend(batch.get('users', []))
        page = batch.get('nextPageToken', '')
        if not page:
            break
    save('auth-users.json', {'users': users})
    config = request(f'https://identitytoolkit.googleapis.com/admin/v2/projects/{PROJECT}/config')
    save('auth-config.json', config)
    hash_config = config.get('signIn', {}).get('hashConfig') or config.get('signIn', {}).get('email', {}).get('hashConfig')
    print(f'Authentication: {len(users)} users; hash configuration present: {bool(hash_config)}', flush=True)

    save('storage-bucket.json', request(f'https://storage.googleapis.com/storage/v1/b/{BUCKET}'))
    objects, page = [], ''
    while True:
        query = urllib.parse.urlencode({'maxResults': 1000, 'pageToken': page})
        batch = request(f'https://storage.googleapis.com/storage/v1/b/{BUCKET}/o?{query}')
        for obj in batch.get('items', []):
            name = urllib.parse.quote(obj['name'], safe='')
            generation = obj['generation']
            blob = request(f'https://storage.googleapis.com/storage/v1/b/{BUCKET}/o/{name}?alt=media&generation={generation}', raw=True)
            if len(blob) != int(obj['size']):
                raise RuntimeError('Storage object size mismatch')
            if obj.get('md5Hash') and base64.b64encode(hashlib.md5(blob).digest()).decode() != obj['md5Hash']:
                raise RuntimeError('Storage object checksum mismatch')
            digest = hashlib.sha256(blob).hexdigest()
            path = destination / 'objects' / digest
            path.parent.mkdir(exist_ok=True)
            path.write_bytes(blob)
            objects.append({'metadata': obj, 'file': f'objects/{digest}', 'sha256': digest})
        page = batch.get('nextPageToken', '')
        if not page:
            break
    save('storage.json', {'bucket': BUCKET, 'objects': objects})
    print(f'Storage: {len(objects)} files, {sum(int(o["metadata"]["size"]) for o in objects)} bytes; checksums verified', flush=True)

    # Preserve deployed security rules as part of the rollback material.
    releases = request(f'https://firebaserules.googleapis.com/v1/projects/{PROJECT}/releases?pageSize=100')
    if releases.get('nextPageToken'):
        raise RuntimeError('Rules releases pagination requires an extended export')
    save('rules-releases.json', releases)
    for release in releases.get('releases', []):
        ruleset = request('https://firebaserules.googleapis.com/v1/' + release['rulesetName'])
        save('rules/' + release['rulesetName'].split('/')[-1] + '.json', ruleset)

    counts = collections.Counter(d['name'].split('/documents/', 1)[1].rsplit('/', 1)[0] for d in documents)
    save('summary.json', {'project': PROJECT, 'readTime': read_time, 'documentCount': len(documents),
                          'collectionCounts': dict(sorted(counts.items())), 'userCount': len(users),
                          'fileCount': len(objects), 'storageBytes': sum(int(o['metadata']['size']) for o in objects),
                          'hashConfigPresent': bool(hash_config)})
    checksums = {str(p.relative_to(destination)): hashlib.sha256(p.read_bytes()).hexdigest()
                 for p in sorted(destination.rglob('*')) if p.is_file()}
    save('checksums.json', checksums)
    archive = destination.with_suffix('.tar.gz')
    with tarfile.open(archive, 'w:gz') as output:
        output.add(destination, arcname=destination.name)
    archive.with_suffix('.gz.sha256').write_text(hashlib.sha256(archive.read_bytes()).hexdigest() + '  ' + archive.name + '\n')
    print('BACKUP COMPLETE: ' + str(archive), flush=True)

if __name__ == '__main__':
    main()
