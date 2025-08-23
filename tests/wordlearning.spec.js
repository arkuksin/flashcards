// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Word Learning regression', () => {
  test('loads, can reveal answer, attempts increment, and nav to Grammar works', async ({ page, baseURL }) => {
    await page.goto(baseURL + '/index.html');
    await expect(page.locator('[data-testid="header"]')).toBeVisible();
    const attemptsBefore = await page.locator('[data-testid="attempts"]').getAttribute('data-value');
    await page.click('[data-testid="btn-reveal"]');
    await expect(page.locator('[data-testid="feedback"]')).toBeVisible();
    const attemptsAfter = await page.locator('[data-testid="attempts"]').getAttribute('data-value');
    expect(Number(attemptsAfter)).toBe(Number(attemptsBefore) + 1);
    // Navigate to Grammar via top navigation
    await page.click('a:has-text("Comparatives & Superlatives")');
    await expect(page).toHaveURL(/.*\/grammar\.html$/);
    await expect(page.locator('[data-testid="progress"]').first()).toBeVisible();
  });
});
