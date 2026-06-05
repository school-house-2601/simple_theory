import { test, expect } from "@playwright/test";
import { skipSplash } from "./helpers.js";

test("homepage loads correctly", async ({ page }) => {
  await skipSplash(page, "/selection");
  await expect(page).toHaveTitle(/Simple Theory/);
});

test("can navigate to browse page", async ({ page }) => {
  await skipSplash(page, "/browse");
  await expect(page).toHaveURL(/.*browse/);
  await expect(page.locator("h1")).toContainText("Browse Video Knowledge");
});

test("can navigate to courses page", async ({ page }) => {
  await skipSplash(page, "/selection");
  await expect(page).toHaveURL(/.*selection/);
});
