import { test, expect } from "@playwright/test";
import { newUser, signUp } from "./fixtures";

const SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

test("konami code reveals the AI Council banner", async ({ page }) => {
  await signUp(page, newUser());

  await expect(page.getByTestId("konami-banner")).toHaveCount(0);

  for (const key of SEQUENCE) {
    await page.keyboard.press(key);
  }

  const banner = page.getByTestId("konami-banner");
  await expect(banner).toBeVisible();
  await expect(banner).toContainText("AI Council SF 2026");
});
