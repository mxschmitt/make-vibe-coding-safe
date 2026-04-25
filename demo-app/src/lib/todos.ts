import { randomUUID } from "node:crypto";
import { db, type TodoRow } from "./db";

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
};

const SEEDS = [
  "Watch Max's Playwright talk on May 13",
  "Visit the SF Marriott Marquis",
  "Try Slidev for my next talk",
  "Add Playwright tests before vibe-coding more features",
];

function toTodo(row: TodoRow): Todo {
  return {
    id: row.id,
    title: row.title,
    completed: !!row.completed,
    createdAt: row.created_at,
  };
}

export function seedDefaultTodos(userId: string) {
  const insert = db.prepare(
    `INSERT INTO todos (id, user_id, title, completed, created_at)
     VALUES (?, ?, ?, 0, ?)`
  );
  const now = Date.now();
  SEEDS.forEach((title, i) => {
    insert.run(randomUUID(), userId, title, now + i);
  });
}

export function listTodos(userId: string): Todo[] {
  const rows = db
    .prepare<[string], TodoRow>(
      "SELECT * FROM todos WHERE user_id = ? ORDER BY created_at ASC"
    )
    .all(userId);
  return rows.map(toTodo);
}

export function createTodo(userId: string, title: string): Todo {
  const id = randomUUID();
  const now = Date.now();
  db.prepare(
    `INSERT INTO todos (id, user_id, title, completed, created_at)
     VALUES (?, ?, ?, 0, ?)`
  ).run(id, userId, title, now);
  return { id, title, completed: false, createdAt: now };
}

export function toggleTodo(userId: string, id: string): void {
  db.prepare(
    `UPDATE todos SET completed = 1 - completed WHERE id = ? AND user_id = ?`
  ).run(id, userId);
}

export function deleteTodo(userId: string, id: string): void {
  db.prepare(`DELETE FROM todos WHERE id = ? AND user_id = ?`).run(id, userId);
}

export function clearCompleted(userId: string): void {
  db.prepare(`DELETE FROM todos WHERE user_id = ? AND completed = 1`).run(userId);
}
