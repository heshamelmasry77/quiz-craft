import { test, expect } from "@playwright/test";

test("clear quiz shows confirm modal; cancel keeps data; confirm wipes data and persistence", async ({
  page,
}) => {
  await page.goto("/");

  // Add a question so we have something to clear
  await page.getByTestId("add-single").click();

  // 1) Open modal
  await page.getByTestId("clear-quiz").click();
  const dialog = page.getByRole("dialog", { name: "Clear quiz?" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText("This cannot be undone")).toBeVisible();

  // 2) Cancel → data should remain
  await dialog.getByTestId("modal-cancel").click();
  await expect(dialog).toBeHidden();
  // We still have 1 question card on the page
  await expect(page.getByText(/^Q1$/)).toBeVisible();

  // 3) Confirm → data should be cleared
  await page.getByTestId("clear-quiz").click();
  await expect(page.getByRole("dialog", { name: "Clear quiz?" })).toBeVisible();
  await page.getByTestId("modal-confirm").click();
  await expect(page.getByRole("dialog", { name: "Clear quiz?" })).toBeHidden();

  // Builder should show empty state
  await expect(page.getByText("No questions yet.", { exact: false })).toBeVisible();

  // 4) Persistence check: after reload, still empty
  await page.reload();
  await expect(page.getByText("No questions yet.", { exact: false })).toBeVisible();
});
