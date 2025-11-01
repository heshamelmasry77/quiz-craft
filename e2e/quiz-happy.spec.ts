import { test, expect } from "@playwright/test";

async function countListItems(page, testId: string) {
  return page.locator(`[data-testid="${testId}"] > li`).count();
}

test("create → preview → refresh → restore", async ({ page }) => {
  await page.goto("/");

  await page.getByTestId("add-single").click();
  await page.getByLabel("Question title").fill("Capital of Norway?");
  const optionInputs = page.getByLabel("Option text");
  await optionInputs.nth(0).fill("Oslo");
  await optionInputs.nth(1).fill("Bergen");
  await page.getByLabel("Mark correct").first().check();

  await page.getByTestId("preview").click();
  await expect(page.getByRole("heading", { name: "Preview" })).toBeVisible();
  expect(await countListItems(page, "preview-list")).toBe(1);

  await page.reload();
  await expect(page.getByRole("heading", { name: "Preview" })).toBeVisible();
  expect(await countListItems(page, "preview-list")).toBe(1);
  await expect(page.getByText("Capital of Norway?")).toBeVisible();
  await expect(page.getByText("Oslo")).toBeVisible();
  await expect(page.getByText("Bergen")).toBeVisible();
});
