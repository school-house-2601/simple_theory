# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: profile.spec.js >> lesson progress bar shows for logged in users
- Location: tests\profile.spec.js:38:1

# Error details

```
Error: page.waitForURL: Target page, context or browser has been closed
=========================== logs ===========================
waiting for navigation to "/dashboard" until "load"
============================================================
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | import { skipSplash } from "./helpers.js";
  3  | 
  4  | test("profile page renders correctly when logged in", async ({ page }) => {
  5  |   await skipSplash(page, "/login");
  6  |   await page.locator('input[name="email"]').fill("testuser2@test.com");
  7  |   await page.locator('input[name="password"]').fill("12345678");
  8  |   await page.locator('input[name="password"]').press("Enter");
  9  |   await page.waitForURL("/dashboard", { timeout: 10000 });
  10 |   await page.goto("/profile");
  11 |   await page.waitForLoadState("networkidle");
  12 |   await expect(page.locator(".profile-banner")).toBeVisible();
  13 |   await expect(page.locator(".pcard").first()).toBeVisible();
  14 |   await expect(page.locator("text=Account Information")).toBeVisible();
  15 |   await expect(page.locator("text=Profile Photo")).toBeVisible();
  16 |   await expect(page.locator("text=Password & Security")).toBeVisible();
  17 |   await expect(page.locator("text=Appearance")).toBeVisible();
  18 | });
  19 | 
  20 | test("dark mode toggle works on profile page", async ({ page }) => {
  21 |   await skipSplash(page, "/login");
  22 |   await page.locator('input[name="email"]').fill("testuser2@test.com");
  23 |   await page.locator('input[name="password"]').fill("12345678");
  24 |   await page.locator('input[name="password"]').press("Enter");
  25 |   await page.waitForURL("/dashboard", { timeout: 10000 });
  26 |   await page.goto("/profile");
  27 |   await page.waitForLoadState("networkidle");
  28 |   // Enable light mode
  29 |   await page.locator('button[aria-label="Enable light mode"]').click();
  30 |   const bodyClass = await page.evaluate(() => document.body.className);
  31 |   expect(bodyClass).toContain("light-mode");
  32 |   // Switch back to dark mode
  33 |   await page.locator('button[aria-label="Enable dark mode"]').click();
  34 |   const bodyClassAfter = await page.evaluate(() => document.body.className);
  35 |   expect(bodyClassAfter).not.toContain("light-mode");
  36 | });
  37 | 
  38 | test("lesson progress bar shows for logged in users", async ({ page }) => {
  39 |   await skipSplash(page, "/login");
  40 |   await page.locator('input[name="email"]').fill("testuser2@test.com");
  41 |   await page.locator('input[name="password"]').fill("12345678");
  42 |   await page.locator('input[name="password"]').press("Enter");
> 43 |   await page.waitForURL("/dashboard", { timeout: 10000 });
     |              ^ Error: page.waitForURL: Target page, context or browser has been closed
  44 |   await page.goto("/selection");
  45 |   await page.waitForLoadState("networkidle");
  46 |   await page.locator("button", { hasText: "Start Learning" }).first().click();
  47 |   await page.waitForLoadState("networkidle");
  48 |   await expect(page.locator(".progress-bar-bg").first()).toBeVisible({
  49 |     timeout: 10000,
  50 |   });
  51 | });
  52 | 
```