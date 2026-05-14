import { test } from "@playwright/test";
import { newUser, signUp } from "./fixtures";

test("seed", async ({ page }) => {
  const user = newUser();
  await signUp(page, user);
  await page.getByLabel("New task").fill("Buy groceries");
  await page.getByRole("button", { name: "Add", exact: true }).click();
});
