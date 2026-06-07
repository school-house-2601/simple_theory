import { test, expect } from "@playwright/test";
import { skipSplash } from "./helpers.js";

test("login page renders correctly", async ({ page }) => {
  await skipSplash(page, "/login");
  await expect(page.locator(".login-form h1")).toContainText("Welcome Back");
  await expect(page.locator('input[name="email"]')).toBeVisible();
  await expect(page.locator('input[name="password"]')).toBeVisible();
  await expect(page.locator('button[type="submit"]')).toBeVisible();
});

test("login with wrong password shows error", async ({ page }) => {
  await skipSplash(page, "/login");
  await page.locator('input[name="email"]').fill("fake@email.com");
  await page.locator('input[name="password"]').fill("wrongpassword");
  await page.locator('button[type="submit"]').click();
  await page.waitForTimeout(2000); // wait for async login to fail
  await expect(page.locator(".error-message")).toBeVisible({ timeout: 10000 });
});

test("register page renders correctly", async ({ page }) => {
  await skipSplash(page, "/register");
  await expect(page.locator('input[name="fullname"]')).toBeVisible();
  await expect(page.locator('input[name="email"]')).toBeVisible();
  await expect(page.locator('input[name="password"]')).toBeVisible();
});

test("login with valid credentials redirects home", async ({ page }) => {
  await skipSplash(page, "/login");
  await page.waitForLoadState("networkidle");
  await page.locator('input[name="email"]').fill("testuser2@test.com");
  await page.locator('input[name="password"]').fill("12345678");
  await page.locator('input[name="password"]').press("Enter");
  await expect(page).toHaveURL("/dashboard", { timeout: 10000 });
});
