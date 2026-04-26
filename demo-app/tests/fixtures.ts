import { randomUUID } from "node:crypto";
import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

export function newUser() {
  const id = randomUUID().slice(0, 8);
  return {
    name: `Ada ${id}`,
    email: `ada-${id}@aicouncil.test`,
    password: "password123",
  };
}

export async function signUp(
  page: Page,
  user: { name: string; email: string; password: string }
) {
  await page.goto("/signup");
  await page.getByLabel("Name").fill(user.name);
  await page.getByLabel("Email").fill(user.email);
  await page.getByLabel("Password").fill(user.password);
  await page.getByRole("button", { name: "Sign up" }).click();
  await expect(page).toHaveURL(/\/app$/);
}

export async function logIn(
  page: Page,
  user: { email: string; password: string }
) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(user.email);
  await page.getByLabel("Password").fill(user.password);
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page).toHaveURL(/\/app$/);
}
