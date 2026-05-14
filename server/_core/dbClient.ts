/**
 * Drizzle DB client for one-shot CLI scripts (ingest, ai:rewrite, ai:images,
 * auto-publish). Differs from server/db.ts in that this returns a plain
 * Drizzle instance + a `close()` so a script can exit cleanly.
 *
 * The long-lived Express server keeps using server/db.ts (with its lazy
 * pool + null-safe wrappers).
 */
import "dotenv/config";
import { drizzle, MySql2Database } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

let _pool: mysql.Pool | null = null;
let _db: MySql2Database | null = null;

export function getCliDb(): MySql2Database {
  if (_db) return _db;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required");
  _pool = mysql.createPool({
    uri: url,
    ssl: { rejectUnauthorized: true },
    connectionLimit: 4,
  });
  _db = drizzle(_pool);
  return _db;
}

export async function closeCliDb(): Promise<void> {
  if (_pool) {
    await _pool.end();
    _pool = null;
    _db = null;
  }
}
