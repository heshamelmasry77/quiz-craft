import { test, expect } from "@playwright/test";

test("preview is blocked by validation until errors are fixed", async ({ page }) => {
  await page.goto("/");

  // Add one empty single-choice question
  await page.getByTestId("add-single").click();

  // Try to preview -> should show validation and stay on builder
  await page.getByTestId("preview").click();
  await expect(page.getByRole("heading", { name: "Accessible Quiz Builder" })).toBeVisible();

  // Get all error checks from the alert banner to avoid strict-mode collisions
  const banner = page.getByRole("alert");
  console.log(await banner.innerHTML());
  await expect(banner.getByText("Title is required")).toBeVisible();
  await expect(banner.getByText("Option text is required")).toHaveCount(2);
  await expect(banner.getByText("Mark at least one option as correct")).toBeVisible();
  //
  // // Fix errors
  await page.getByLabel("Question title").fill("Capital of Norway?");
  const optionInputs = page.getByLabel("Option text");
  await optionInputs.nth(0).fill("Oslo");
  await optionInputs.nth(1).fill("Bergen");
  await page.getByLabel("Mark correct").first().check();

  // // Now preview should navigate
  await page.getByTestId("preview").click();
  await expect(page.getByRole("heading", { name: "Preview" })).toBeVisible();
  await expect(page.getByText("Capital of Norway?")).toBeVisible();
  await expect(page.getByText("Oslo")).toBeVisible();
  await expect(page.getByText("Bergen")).toBeVisible();
});
