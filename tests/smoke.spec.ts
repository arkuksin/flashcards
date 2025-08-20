import { test, expect } from '@playwright/test';

// Smoke tests are intentionally minimal and robust.

// 1) Homepage loads and shows the main heading
(test as any)('homepage loads and shows main heading', async ({ page }) => {
  await page.goto('/');
  const h1 = page.getByRole('heading', { level: 1 });
  await expect(h1).toBeVisible();
  await expect(h1).toHaveText(/\S/); // non-empty
});

// 2) Language switch (i18n) to DE shows translated string and sets html lang
(test as any)('language switch to DE updates title and lang', async ({ page }) => {
  await page.addInitScript(() => {
    try { localStorage.setItem('lang', 'en'); } catch {}
  });
  await page.goto('/');

  const flagDe = page.getByTestId('flag-de');
  await flagDe.click();

  // Wait for translated title
  const deTitle = 'Italienische Karten — 300 Wörter';
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(deTitle);

  // html lang should be set to de
  const htmlLang = await page.evaluate(() => document.documentElement.lang);
  expect(htmlLang).toBe('de');
});

// 3) Critical route loads (Impressum page) and shows a key element/text
(test as any)('impressum page loads and contains expected text', async ({ page }) => {
  const resp = await page.goto('/impressum.html');
  expect(resp && resp.ok()).toBeTruthy();
  await expect(page.locator('body')).toContainText(/Impressum/i);
});
