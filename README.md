# Renovation

Landing page for a Toronto renovation company built with React and Vite. See the `app` directory for source code.

## Render migration

The `codex/render-migration` branch replaces Firebase document storage, image
storage, and admin authentication with a same-origin Node API, Render Postgres,
and a persistent image disk. Existing Firebase password hashes are verified
locally, so account passwords do not need to be reset. EmailJS continues to
deliver the existing inquiry notifications.

`render.yaml` defines a $7/month web service, a $6/month database with 1 GB
allocated storage, and a 1 GB persistent disk ($0.25/month). Database storage,
custom domains beyond the included allowance, taxes, and usage can add charges.
The database blocks external connections. Do not use an expiring free database
or an ephemeral filesystem for the migrated data.

### Back up and validate before deployment

Run `scripts/export_firebase.py` in an authorized Cloud Shell for the existing
`homev-construction` project. It performs read-only exports of all Firestore
documents, account records/hash settings, uploaded files, and deployed rules.
Keep the resulting archive and checksum locally, outside Git. The `backups/`
directory is ignored. Backup files contain private inquiries and account hashes.

After downloading and verifying the archive, extract it and run:

```
npm ci --prefix server
node scripts/verify-restore.mjs backups/renovation-backup-<timestamp>
node scripts/create-bootstrap.mjs backups/renovation-backup-<timestamp>
```

The restore check uses an isolated embedded Postgres database. It compares every
original document and account, verifies every image checksum, and checks that a
repeat import cannot replace changed live data. No source Firebase data is edited.

### Import into Render

Create the Blueprint in the HomeEV_Construction workspace. Add the verified
`render-bootstrap.json` as a **secret file**, and set `BOOTSTRAP_FILE` to its
path (normally `/etc/secrets/render-bootstrap.json`). Never commit this file.
The initial import copies each original image using its existing download token,
checks its SHA-256 against the local backup, then restores documents, accounts,
and metadata in a transaction. It refuses a nonempty target and never seeds
default data. An import marker makes subsequent starts idempotent. After a
verified import, remove the bootstrap secret file and `BOOTSTRAP_FILE` setting.

Keep Firebase intact until the preview, inquiry delivery, admin login, image
uploads, and all record/file counts have been checked. Take a final source
snapshot and reconcile changes before switching the domain. Keep the original
source and local archive available for rollback; do not delete either as part
of deployment. Paid Postgres recovery and persistent-disk snapshots complement
the downloaded migration backup.

Admin edits retain revision history, and deletion is soft so accidental edits
and deletions remain recoverable. Only the public website collections are
readable without an admin session; messages, account hashes, and configuration
remain private. There is no public import or account-creation endpoint.

Run migration and access-control checks with `node --test test/*.test.js`.
