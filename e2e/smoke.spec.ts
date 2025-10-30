import { test, expect } from "@playwright/test";

test("app boots and shows Builder", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Accessible Quiz Builder/i })).toBeVisible();
  await page.getByRole("link", { name: /Preview/i }).click();
  await expect(page.getByRole("heading", { name: /Preview/i })).toBeVisible();
});
