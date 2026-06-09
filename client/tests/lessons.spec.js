import { test, expect } from "@playwright/test";
import { skipSplash, loginAsTestUser } from "./helpers.js";

test("novice lesson page loads correctly", async ({ page }) => {
  await loginAsTestUser(page);
  await page.goto("/selection");
  await page.waitForLoadState("networkidle");
  await page.locator("button", { hasText: "Start Learning" }).first().click();
  await page.waitForLoadState("networkidle");
  await expect(page.locator("h2").first()).toContainText("Novice Curriculum", {
    timeout: 10000,
  });
});

test("lesson cards render on novice page", async ({ page }) => {
  await loginAsTestUser(page);
  await page.goto("/selection");
  await page.waitForLoadState("networkidle");
  await page.locator("button", { hasText: "Start Learning" }).first().click();
  await expect(page.locator(".lesson-card").first()).toBeVisible({
    timeout: 10000,
  });
});

test("resource cards render on novice page", async ({ page }) => {
  await loginAsTestUser(page);
  await page.goto("/selection");
  await page.waitForLoadState("networkidle");
  await page.locator("button", { hasText: "Start Learning" }).first().click();
  await expect(page.locator(".resource-card").first()).toBeVisible({
    timeout: 10000,
  });
});

test("guest sees login nudge on lesson cards", async ({ page }) => {
  await skipSplash(page, "/lessons");
  await expect(page).toHaveURL(/.*login/, { timeout: 10000 });
});

test("guest sees locked resource button", async ({ page }) => {
  await skipSplash(page, "/lessons");
  await expect(page).toHaveURL(/.*login/, { timeout: 10000 });
});
