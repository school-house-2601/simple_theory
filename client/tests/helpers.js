export async function skipSplash(page, path = "/selection") {
  await page.goto(path);
  await page.waitForLoadState("networkidle");
}

export async function loginAsTestUser(page) {
  await skipSplash(page, "/login");
  await page.locator('input[name="email"]').fill("testuser2@test.com");
  await page.locator('input[name="password"]').fill("12345678");
  await page.locator('input[name="password"]').press("Enter");
  await page.waitForURL("/dashboard", { timeout: 10000 });
}
