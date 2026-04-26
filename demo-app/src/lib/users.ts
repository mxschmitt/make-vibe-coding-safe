import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { getDb, type UserRow } from "./db";

export async function createUser(input: {
  email: string;
  name: string;
  password: string;
}): Promise<{ id: string; email: string; name: string }> {
  const existing = getDb()
    .prepare<[string], UserRow>("SELECT * FROM users WHERE email = ?")
    .get(input.email.toLowerCase());
  if (existing) {
    throw new Error("EMAIL_TAKEN");
  }
  const id = randomUUID();
  const password_hash = await bcrypt.hash(input.password, 10);
  getDb()
    .prepare(
      `INSERT INTO users (id, email, name, password_hash, created_at)
     VALUES (?, ?, ?, ?, ?)`
    )
    .run(id, input.email.toLowerCase(), input.name.trim(), password_hash, Date.now());
  return { id, email: input.email.toLowerCase(), name: input.name.trim() };
}

export async function verifyUser(
  email: string,
  password: string
): Promise<{ id: string; email: string; name: string } | null> {
  const row = getDb()
    .prepare<[string], UserRow>("SELECT * FROM users WHERE email = ?")
    .get(email.toLowerCase());
  if (!row) return null;
  const ok = await bcrypt.compare(password, row.password_hash);
  if (!ok) return null;
  return { id: row.id, email: row.email, name: row.name };
}

export function getUserById(id: string): { id: string; email: string; name: string } | null {
  const row = getDb()
    .prepare<[string], UserRow>("SELECT * FROM users WHERE id = ?")
    .get(id);
  if (!row) return null;
  return { id: row.id, email: row.email, name: row.name };
}
