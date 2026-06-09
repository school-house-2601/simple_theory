# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: profile.spec.js >> profile page renders correctly when logged in
- Location: tests\profile.spec.js:4:1

# Error details

```
TimeoutError: page.waitForURL: Timeout 10000ms exceeded.
=========================== logs ===========================
waiting for navigation to "/dashboard" until "load"
============================================================
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - navigation [ref=e4]:
    - generic [ref=e5]:
      - link "♫ SimpleTheory" [ref=e6] [cursor=pointer]:
        - /url: /
        - generic [ref=e7]: ♫
        - generic [ref=e8]: SimpleTheory
      - generic [ref=e9]:
        - link "Courses" [ref=e10] [cursor=pointer]:
          - /url: /selection
        - link "Browse Videos" [ref=e11] [cursor=pointer]:
          - /url: /browse
        - link "Practice" [ref=e12] [cursor=pointer]:
          - /url: /practice
    - generic [ref=e14]:
      - generic [ref=e15]: Q
      - textbox "Search theory, tabs, tutorials..." [ref=e16]
    - generic [ref=e17]:
      - link "Login" [ref=e18] [cursor=pointer]:
        - /url: /login
      - link "Sign Up" [ref=e19] [cursor=pointer]:
        - /url: /register
  - generic [ref=e21]:
    - heading "Welcome Back" [level=1] [ref=e22]
    - paragraph [ref=e23]: Continue your journey to musical mastery
    - link "Sign in with Google" [ref=e25] [cursor=pointer]:
      - /url: undefined/auth/google?redirect=%2Flogin
      - img [ref=e26]
      - generic [ref=e31]: Sign in with Google
    - generic [ref=e32]: OR CONTINUE WITH
    - generic [ref=e33]:
      - generic [ref=e34]:
        - generic [ref=e35]: Email
        - textbox "mister.musician@theory.com" [ref=e36]: testuser2@test.com
      - generic [ref=e37]:
        - generic [ref=e39]: Password
        - textbox "••••••••" [active] [ref=e40]: "12345678"
      - paragraph [ref=e41]: Failed to fetch
      - button "Sign In to SimpleTheory →" [ref=e42] [cursor=pointer]
    - paragraph [ref=e43]:
      - text: Don't have an account?
      - link "Create an account" [ref=e44] [cursor=pointer]:
        - /url: /register
  - contentinfo [ref=e45]:
    - generic [ref=e46]:
      - link "♫ SimpleTheory" [ref=e47] [cursor=pointer]:
        - /url: /
      - paragraph [ref=e48]: Master your instrument with data-driven theory and interactive practice.
    - generic [ref=e49]:
      - heading "Learning" [level=3] [ref=e50]
      - link "Courses" [ref=e51] [cursor=pointer]:
        - /url: /selection
      - link "Browse Videos" [ref=e52] [cursor=pointer]:
        - /url: /browse
      - link "Challenges" [ref=e53] [cursor=pointer]:
        - /url: /challenges
    - generic [ref=e54]:
      - heading "Account" [level=3] [ref=e55]
      - link "Login" [ref=e56] [cursor=pointer]:
        - /url: /login
      - link "Register" [ref=e57] [cursor=pointer]:
        - /url: /register
      - link "How it works" [ref=e58] [cursor=pointer]:
        - /url: /howitworks
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
> 9  |   await page.waitForURL("/dashboard", { timeout: 10000 });
     |              ^ TimeoutError: page.waitForURL: Timeout 10000ms exceeded.
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
  43 |   await page.waitForURL("/dashboard", { timeout: 10000 });
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