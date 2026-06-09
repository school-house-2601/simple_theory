export async function skipSplash(page, path = "/selection") {
  await page.goto(path);
  await page.waitForLoadState("networkidle");
}
