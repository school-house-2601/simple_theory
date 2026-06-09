import { test, expect } from "@playwright/test";
import { skipSplash } from "./helpers.js";

async function loginAsTestUser(page) {
  await skipSplash(page, "/login");
  await page.locator('input[name="email"]').fill("testuser2@test.com");
  await page.locator('input[name="password"]').fill("your_password");
  await page.locator('input[name="password"]').press("Enter");
  await page.waitForURL("/dashboard", { timeout: 10000 });
}

test("browse page loads with default Theory videos", async ({ page }) => {
  await skipSplash(page, "/browse");
  await expect(page.locator("h1")).toContainText("Browse Video Knowledge");
  await expect(page.locator(".video-card").first()).toBeVisible({
    timeout: 15000,
  });
});

test("clicking Guitar pill loads guitar videos", async ({ page }) => {
  await skipSplash(page, "/browse");
  await page.locator(".pill", { hasText: "Guitar" }).click();
  await expect(page.locator("h2").first()).toContainText("Guitar", {
    timeout: 15000,
  });
  await expect(page.locator(".video-card").first()).toBeVisible({
    timeout: 15000,
  });
});

test("clicking Piano pill loads piano videos", async ({ page }) => {
  await skipSplash(page, "/browse");
  await page.locator(".pill", { hasText: "Piano" }).click();
  await expect(page.locator("h2").first()).toContainText("Piano", {
    timeout: 15000,
  });
});

test("clicking Drums pill loads drum videos", async ({ page }) => {
  await skipSplash(page, "/browse");
  await page.locator(".pill", { hasText: "Drums" }).click();
  await expect(page.locator("h2").first()).toContainText("Drums", {
    timeout: 15000,
  });
});

test("saved videos tab shows empty state for guest", async ({ page }) => {
  await skipSplash(page, "/browse");
  await page.locator(".pill", { hasText: "Saved" }).click();
  await expect(page.locator("text=You haven't saved any...yet.")).toBeVisible({
    timeout: 10000,
  });
});

test("video card save button is visible", async ({ page }) => {
  await skipSplash(page, "/browse");
  await expect(page.locator(".save-btn").first()).toBeVisible({
    timeout: 15000,
  });
});
