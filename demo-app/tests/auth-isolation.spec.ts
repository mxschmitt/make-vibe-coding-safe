import { test, expect } from "@playwright/test";
import { newUser, signUp } from "./fixtures";

test("users cannot see each other's todos", async ({ browser }) => {
  const alice = newUser();
  const bob = newUser();

  const aliceCtx = await browser.newContext();
  const alicePage = await aliceCtx.newPage();
  await signUp(alicePage, alice);
  await alicePage.getByLabel("New task").fill("Alice's private todo");
  await alicePage.getByRole("button", { name: "Add", exact: true }).click();
  await expect(
    alicePage.getByTestId("todo-item").filter({ hasText: "Alice's private todo" })
  ).toHaveCount(1);
  await aliceCtx.close();

  const bobCtx = await browser.newContext();
  const bobPage = await bobCtx.newPage();
  await signUp(bobPage, bob);
  await expect(bobPage.getByTestId("current-user")).toHaveText(bob.name);
  await expect(
    bobPage.getByTestId("todo-item").filter({ hasText: "Alice's private todo" })
  ).toHaveCount(0);
  await expect(bobPage.getByTestId("todo-item")).toHaveCount(4);
  await bobCtx.close();
});
