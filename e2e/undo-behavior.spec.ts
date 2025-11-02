// e2e/undo-behavior.spec.ts
import { test, expect } from "@playwright/test";

test("undo restores removed question, but does not revert typed text", async ({ page }) => {
  await page.goto("/");

  // Add a question
  await page.getByTestId("add-single").click();
  const q1 = page.locator("li").filter({ hasText: /^Q1/ });
  await expect(q1).toBeVisible();

  // Type a title (non-structural)
  await q1.getByLabel("Question title").fill("My first title");
  await expect(q1.getByLabel("Question title")).toHaveValue("My first title");

  // Remove the QUESTION
  await q1.getByRole("button", { name: "Remove", exact: true }).click();
  await expect(page.getByText(/^Q1$/)).toHaveCount(0);

  // Undo → question should come back with the same typed title
  await page.getByRole("button", { name: "Undo" }).click();
  await expect(page.getByText(/^Q1$/)).toBeVisible();
  await expect(page.getByLabel("Question title")).toHaveValue("My first title");

  // Option structural undo check:
  await q1.getByRole("button", { name: "+ Add option" }).click();
  await expect(q1.getByLabel("Option text")).toHaveCount(3);

  await page.getByRole("button", { name: "Undo" }).click();
  await expect(q1.getByLabel("Option text")).toHaveCount(2);
});
