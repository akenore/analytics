// ─── SQLite Database Helper ──────────────────────────────────────────────────
// Provides a singleton SQLite connection for storing daily analytics data.
// Database is stored locally at ./data/analytics.db (or SQLITE_PATH env var).
//
// To set up, install better-sqlite3:
//   bun add better-sqlite3
//   bun add -d @types/better-sqlite3
//
// Then run the schema:
//   Import and call initializeDatabase() on server startup.

import { existsSync, mkdirSync, readFileSync } from "fs";
import { join, dirname } from "path";

// Note: Uncomment the lines below after installing better-sqlite3
// import Database from "better-sqlite3";

const DB_PATH = process.env.SQLITE_PATH || "./data/analytics.db";

/**
 * Get a singleton database connection.
 * Creates the data directory and database file if they don't exist.
 */
export function getDatabase() {
  // Ensure the data directory exists
  const dir = dirname(DB_PATH);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  // Uncomment after installing better-sqlite3:
  // const db = new Database(DB_PATH);
  // db.pragma("journal_mode = WAL"); // Better concurrent read performance
  // db.pragma("foreign_keys = ON");
  // return db;

  console.log("[DB] SQLite would connect to:", DB_PATH);
  return null;
}

/**
 * Initialize the database schema from schema.sql.
 * Call this once on server startup or during a setup script.
 */
export function initializeDatabase() {
  const db = getDatabase();
  if (!db) return;

  const schemaPath = join(process.cwd(), "lib", "schema.sql");
  if (existsSync(schemaPath)) {
    const schema = readFileSync(schemaPath, "utf-8");
    // Uncomment after installing better-sqlite3:
    // db.exec(schema);
    console.log("[DB] Schema initialized from", schemaPath);
  }
}
