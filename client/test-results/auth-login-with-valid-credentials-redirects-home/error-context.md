# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.js >> login with valid credentials redirects home
- Location: tests\auth.spec.js:28:1

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected: "http://localhost:5173/dashboard"
Received: "http://localhost:5173/login"

Call log:
  - Expect "toHaveURL" with timeout 10000ms
    18 × unexpected value "http://localhost:5173/login"

```

```yaml
- navigation:
  - link "♫ SimpleTheory":
    - /url: /
  - link "Courses":
    - /url: /selection
  - link "Browse Videos":
    - /url: /browse
  - link "Practice":
    - /url: /practice
  - text: Q
  - textbox "Search theory, tabs, tutorials..."
  - link "Login":
    - /url: /login
  - link "Sign Up":
    - /url: /register
- heading "Welcome Back" [level=1]
- paragraph: Continue your journey to musical mastery
- link "Sign in with Google":
  - /url: undefined/auth/google?redirect=%2Flogin
  - img
  - text: Sign in with Google
- text: OR CONTINUE WITH Email
- textbox "mister.musician@theory.com": testuser2@test.com
- text: Password
- textbox "••••••••": "12345678"
- paragraph: Failed to fetch
- button "Sign In to SimpleTheory →"
- paragraph:
  - text: Don't have an account?
  - link "Create an account":
    - /url: /register
- contentinfo:
  - link "♫ SimpleTheory":
    - /url: /
  - paragraph: Master your instrument with data-driven theory and interactive practice.
  - heading "Learning" [level=3]
  - link "Courses":
    - /url: /selection
  - link "Browse Videos":
    - /url: /browse
  - link "Challenges":
    - /url: /challenges
  - heading "Account" [level=3]
  - link "Login":
    - /url: /login
  - link "Register":
    - /url: /register
  - link "How it works":
    - /url: /howitworks
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | import { skipSplash } from "./helpers.js";
  3  | 
  4  | test("login page renders correctly", async ({ page }) => {
  5  |   await skipSplash(page, "/login");
  6  |   await expect(page.locator(".login-form h1")).toContainText("Welcome Back");
  7  |   await expect(page.locator('input[name="email"]')).toBeVisible();
  8  |   await expect(page.locator('input[name="password"]')).toBeVisible();
  9  |   await expect(page.locator('button[type="submit"]')).toBeVisible();
  10 | });
  11 | 
  12 | test("login with wrong password shows error", async ({ page }) => {
  13 |   await skipSplash(page, "/login");
  14 |   await page.locator('input[name="email"]').fill("fake@email.com");
  15 |   await page.locator('input[name="password"]').fill("wrongpassword");
  16 |   await page.locator('button[type="submit"]').click();
  17 |   await page.waitForTimeout(2000); // wait for async login to fail
  18 |   await expect(page.locator(".error-message")).toBeVisible({ timeout: 10000 });
  19 | });
  20 | 
  21 | test("register page renders correctly", async ({ page }) => {
  22 |   await skipSplash(page, "/register");
  23 |   await expect(page.locator('input[name="fullname"]')).toBeVisible();
  24 |   await expect(page.locator('input[name="email"]')).toBeVisible();
  25 |   await expect(page.locator('input[name="password"]')).toBeVisible();
  26 | });
  27 | 
  28 | test("login with valid credentials redirects home", async ({ page }) => {
  29 |   await skipSplash(page, "/login");
  30 |   await page.waitForLoadState("networkidle");
  31 |   await page.locator('input[name="email"]').fill("testuser2@test.com");
  32 |   await page.locator('input[name="password"]').fill("12345678");
  33 |   await page.locator('input[name="password"]').press("Enter");
> 34 |   await expect(page).toHaveURL("/dashboard", { timeout: 10000 });
     |                      ^ Error: expect(page).toHaveURL(expected) failed
  35 | });
  36 | 
```