import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

declare global {
  var __db: Database.Database | undefined;
}

function init(database: Database.Database) {
  database.pragma("journal_mode = WAL");
  database.pragma("foreign_keys = ON");
  database.exec(`
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

function open(): Database.Database {
  const dbPath =
    process.env.DATABASE_PATH ?? join(process.cwd(), "data", "app.db");
  mkdirSync(dirname(dbPath), { recursive: true });
  const database = new Database(dbPath);
  init(database);
  return database;
}

export function getDb(): Database.Database {
  if (!globalThis.__db) {
    globalThis.__db = open();
  }
  return globalThis.__db;
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
