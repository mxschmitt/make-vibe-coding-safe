import { test, expect } from "@playwright/test";
import { newUser, signUp } from "./fixtures";

test("delete a todo removes it from the list", async ({ page }) => {
  await signUp(page, newUser());

  const items = page.getByTestId("todo-item");
  const before = await items.count();

  await page.getByLabel("New task").fill("Temporary todo");
  await page.getByRole("button", { name: "Add", exact: true }).click();
  await expect(items).toHaveCount(before + 1);

  await page
    .getByRole("button", { name: 'Delete "Temporary todo"' })
    .click();

  await expect(items).toHaveCount(before);
  await expect(
    items.filter({ hasText: "Temporary todo" })
  ).toHaveCount(0);
});
