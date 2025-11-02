import { test, expect } from "@playwright/test";

test("single choice allows only one correct; multiple allows several; persists on reload", async ({
  page,
}) => {
  await page.goto("/");

  // --- Single choice ---
  await page.getByTestId("add-single").click();

  // Fill two options for clarity
  const single = page.locator("li").filter({ hasText: /^Q1/ });
  await single.getByLabel("Question title").fill("Pick one");
  const singleOpts = single.getByLabel("Option text");
  await singleOpts.nth(0).fill("A");
  await singleOpts.nth(1).fill("B");

  const singleMarks = single.getByLabel("Mark correct");
  await singleMarks.nth(0).check();
  await expect(singleMarks.nth(0)).toBeChecked();
  await expect(singleMarks.nth(1)).not.toBeChecked();

  // Selecting the second should uncheck the first
  await singleMarks.nth(1).check();
  await expect(singleMarks.nth(1)).toBeChecked();
  await expect(singleMarks.nth(0)).not.toBeChecked();

  // --- Multiple choice ---
  await page.getByTestId("add-multiple").click();
  const multi = page.locator("li").filter({ hasText: /^Q2/ });

  await multi.getByLabel("Question title").fill("Pick many");
  const multiOpts = multi.getByLabel("Option text");
  await multiOpts.nth(0).fill("X");
  await multiOpts.nth(1).fill("Y");

  const multiMarks = multi.getByLabel("Mark correct");
  await multiMarks.nth(0).check();
  await multiMarks.nth(1).check();
  await expect(multiMarks.nth(0)).toBeChecked();
  await expect(multiMarks.nth(1)).toBeChecked();

  // --- Persistence after reload ---
  await page.reload();

  // Re-locate after reload
  const singleAfter = page.locator("li").filter({ hasText: /^Q1/ });
  const singleMarksAfter = singleAfter.getByLabel("Mark correct");
  await expect(singleMarksAfter.nth(1)).toBeChecked();
  await expect(singleMarksAfter.nth(0)).not.toBeChecked();

  const multiAfter = page.locator("li").filter({ hasText: /^Q2/ });
  const multiMarksAfter = multiAfter.getByLabel("Mark correct");
  await expect(multiMarksAfter.nth(0)).toBeChecked();
  await expect(multiMarksAfter.nth(1)).toBeChecked();
});
