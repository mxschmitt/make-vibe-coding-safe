import { test, expect } from "@playwright/test";
import { newUser } from "./fixtures";

test("critical path: sign up, manage todos, filter, log out", async ({ page }) => {
  const user = newUser();

  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Make your todos"
  );
  await page.getByRole("link", { name: "Sign up" }).click();

  await page.getByLabel("Name").fill(user.name);
  await page.getByLabel("Email").fill(user.email);
  await page.getByLabel("Password").fill(user.password);
  await page.getByRole("button", { name: "Sign up" }).click();

  await expect(page).toHaveURL(/\/app$/);
  await expect(page.getByTestId("current-user")).toHaveText(user.name);

  const items = page.getByTestId("todo-item");
  await expect(items).toHaveCount(4);
  await expect(items.first()).toContainText("Watch Max's Playwright talk");

  await page.getByLabel("New task").fill("Write more tests");
  await page.getByRole("button", { name: "Add", exact: true }).click();
  await expect(items).toHaveCount(5);
  const newRow = items.filter({ hasText: "Write more tests" });
  await expect(newRow).toHaveAttribute("data-completed", "false");

  await newRow
    .getByRole("button", { name: /Mark "Write more tests" as completed/ })
    .click();
  await expect(newRow).toHaveAttribute("data-completed", "true");

  await page.getByRole("link", { name: "Active" }).click();
  await expect(items).toHaveCount(4);

  await page.getByRole("link", { name: "Completed" }).click();
  await expect(items).toHaveCount(1);
  await expect(items.first()).toContainText("Write more tests");

  await page.getByRole("link", { name: "All" }).click();
  await expect(items).toHaveCount(5);

  await page.getByRole("button", { name: "Clear completed" }).click();
  await expect(items).toHaveCount(4);
  await expect(
    page.getByTestId("todo-item").filter({ hasText: "Write more tests" })
  ).toHaveCount(0);

  await page.getByRole("button", { name: "Log out" }).click();
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("link", { name: "Log in" })).toBeVisible();
});
