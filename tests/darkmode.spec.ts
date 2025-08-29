import { test, expect } from '@playwright/test';

// Helper: read computed background color of an element specified by selector
async function getBg(page, selector) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    return el ? getComputedStyle(el).backgroundColor : null;
  }, selector);
}

// 1) Toggle & persistence
// Use light baseline; set localStorage theme=light before navigation
// Then toggle to dark, verify html has .dark and background changes on a visible card, reload persists; toggle back and persist.

test.describe('Dark mode — toggle & persistence', () => {
  test.use({ colorScheme: 'light' });

  test('toggle switches dark class and persists across reloads', async ({ page, baseURL }) => {
    await page.addInitScript(() => {
      try {
        if (!localStorage.getItem('theme')) localStorage.setItem('theme', 'light');
      } catch {}
    });

    await page.goto(baseURL ?? '/');

    const html = page.locator('html');
    await expect(html).not.toHaveClass(/\bdark\b/);

    // Toggle on
    await page.getByTestId('theme-toggle').click();
    await expect.poll(async () => await page.evaluate(() => document.documentElement.className)).toMatch(/\bdark\b/);

    // Verify persistence flag and presence of dark class token on a main surface
    const lsDark = await page.evaluate(() => localStorage.getItem('theme'));
    expect(lsDark).toBe('dark');
    await expect(page.getByTestId('card')).toHaveAttribute('class', /dark:bg-white\/10/);

    // Reload and ensure persistence
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await expect.poll(async () => await page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(true);
    const lsDarkAfterReload = await page.evaluate(() => localStorage.getItem('theme'));
    expect(lsDarkAfterReload).toBe('dark');

    // Toggle off and verify persistence
    await page.getByTestId('theme-toggle').click();
    await expect.poll(async () => await page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(false);
    const lsLight = await page.evaluate(() => localStorage.getItem('theme'));
    expect(lsLight).toBe('light');

    // Reload and ensure stays light
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await expect.poll(async () => await page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(false);
    const lsLightAfterReload = await page.evaluate(() => localStorage.getItem('theme'));
    expect(lsLightAfterReload).toBe('light');
  });
});

// 2) System preference fallback
// When there is no saved theme, the app should respect prefers-color-scheme

test.describe('Dark mode — system preference fallback (by colorScheme)', () => {
  test.describe('prefers dark', () => {
    test.use({ colorScheme: 'dark' });
    test('starts with html.dark when no saved theme', async ({ page, baseURL }) => {
      await page.addInitScript(() => { try { localStorage.removeItem('theme'); } catch {} });
      await page.goto(baseURL ?? '/');
      await expect(page.locator('html')).toHaveClass(/\bdark\b/);
    });
  });

  test.describe('prefers light', () => {
    test.use({ colorScheme: 'light' });
    test('starts without html.dark when no saved theme', async ({ page, baseURL }) => {
      await page.addInitScript(() => { try { localStorage.removeItem('theme'); } catch {} });
      await page.goto(baseURL ?? '/');
      await expect(page.locator('html')).not.toHaveClass(/\bdark\b/);
    });
  });
});
