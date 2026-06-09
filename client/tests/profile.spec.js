import { test, expect } from "@playwright/test";
import { skipSplash } from "./helpers.js";

test("profile page renders correctly when logged in", async ({ page }) => {
  await skipSplash(page, "/login");
  await page.locator('input[name="email"]').fill("testuser2@test.com");
  await page.locator('input[name="password"]').fill("12345678");
  await page.locator('input[name="password"]').press("Enter");
  await page.waitForURL("/dashboard", { timeout: 10000 });
  await page.goto("/profile");
  await page.waitForLoadState("networkidle");
  await expect(page.locator(".profile-banner")).toBeVisible();
  await expect(page.locator(".pcard").first()).toBeVisible();
  await expect(page.locator("text=Account Information")).toBeVisible();
  await expect(page.locator("text=Profile Photo")).toBeVisible();
  await expect(page.locator("text=Password & Security")).toBeVisible();
  await expect(page.locator("text=Appearance")).toBeVisible();
});

test("dark mode toggle works on profile page", async ({ page }) => {
  await skipSplash(page, "/login");
  await page.locator('input[name="email"]').fill("testuser2@test.com");
  await page.locator('input[name="password"]').fill("12345678");
  await page.locator('input[name="password"]').press("Enter");
  await page.waitForURL("/dashboard", { timeout: 10000 });
  await page.goto("/profile");
  await page.waitForLoadState("networkidle");
  // Enable light mode
  await page.locator('button[aria-label="Enable light mode"]').click();
  const bodyClass = await page.evaluate(() => document.body.className);
  expect(bodyClass).toContain("light-mode");
  // Switch back to dark mode
  await page.locator('button[aria-label="Enable dark mode"]').click();
  const bodyClassAfter = await page.evaluate(() => document.body.className);
  expect(bodyClassAfter).not.toContain("light-mode");
});

test("lesson progress bar shows for logged in users", async ({ page }) => {
  await skipSplash(page, "/login");
  await page.locator('input[name="email"]').fill("testuser2@test.com");
  await page.locator('input[name="password"]').fill("12345678");
  await page.locator('input[name="password"]').press("Enter");
  await page.waitForURL("/dashboard", { timeout: 10000 });
  await page.goto("/selection");
  await page.waitForLoadState("networkidle");
  await page.locator("button", { hasText: "Start Learning" }).first().click();
  await page.waitForLoadState("networkidle");
  await expect(page.locator(".progress-bar-bg").first()).toBeVisible({
    timeout: 10000,
  });
});
