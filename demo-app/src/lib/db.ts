import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const DB_PATH = process.env.DATABASE_PATH ?? join(process.cwd(), "data", "app.db");

mkdirSync(dirname(DB_PATH), { recursive: true });

declare global {
  var __db: Database.Database | undefined;
}

function init(db: Database.Database) {
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS todos (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id);
  `);
}

export const db = globalThis.__db ?? new Database(DB_PATH);
if (!globalThis.__db) {
  init(db);
  globalThis.__db = db;
}

export type UserRow = {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  created_at: number;
};

export type TodoRow = {
  id: string;
  user_id: string;
  title: string;
  completed: number;
  created_at: number;
};
