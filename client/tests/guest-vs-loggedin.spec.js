import { test, expect } from "@playwright/test";
import { skipSplash } from "./helpers.js";

test("guest sees login and signup buttons in navbar", async ({ page }) => {
  await skipSplash(page, "/selection");
  await expect(page.locator(".login-link")).toBeVisible();
  await expect(page.locator(".signup-btn")).toBeVisible();
});

test("guest cannot access dashboard", async ({ page }) => {
  await skipSplash(page, "/dashboard");
  await expect(page).not.toHaveURL("/dashboard");
});

test("guest sees sign in nudge on lesson progress", async ({ page }) => {
  await skipSplash(page, "/lessons");
  await expect(page).toHaveURL(/.*login/, { timeout: 10000 });
});

test("avatar shows login link for guest", async ({ page }) => {
  await skipSplash(page, "/selection");
  await expect(page.locator(".login-link")).toBeVisible();
});
