import pg from 'pg';
export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 8 });

export async function initialize(database = pool) {
  await database.query(`
    CREATE TABLE IF NOT EXISTS documents (
      path text PRIMARY KEY, fields jsonb NOT NULL,
      source jsonb, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
      deleted_at timestamptz
    );
    CREATE TABLE IF NOT EXISTS accounts (id text PRIMARY KEY, email text UNIQUE NOT NULL, source jsonb NOT NULL);
    CREATE TABLE IF NOT EXISTS settings (key text PRIMARY KEY, value jsonb NOT NULL);
    CREATE TABLE IF NOT EXISTS sessions (digest text PRIMARY KEY, account_id text NOT NULL REFERENCES accounts(id), expires_at timestamptz NOT NULL);
    CREATE TABLE IF NOT EXISTS files (id text PRIMARY KEY, original_name text NOT NULL, content_type text NOT NULL,
      bytes bigint NOT NULL, sha256 text NOT NULL, source jsonb);
    CREATE TABLE IF NOT EXISTS document_history (id bigserial PRIMARY KEY, path text NOT NULL, fields jsonb NOT NULL,
      archived_at timestamptz NOT NULL DEFAULT now());
  `);
}
