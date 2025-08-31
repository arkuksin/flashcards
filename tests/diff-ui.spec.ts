import { test, expect } from '@playwright/test';

async function forceEnglishAndOpen(page) {
  await page.addInitScript(() => {
    try {
      localStorage.setItem('lang', 'en');
      localStorage.setItem('streak', '0');
      sessionStorage.setItem('streak', '0');
    } catch {}
  });
  await page.goto('/');
}

async function selectTheme(page, key: string) {
  const theme = page.getByTestId('theme-select');
  await theme.selectOption(key);
}

async function currentCorrectAnswer(page) {
  const source = await page.getByTestId('source-word').textContent();
  return await page.evaluate((src) => {
    const ds = (window as any).DATASET_EN;
    const item = ds?.WORDS?.find((x: any) => x.en === src);
    return item?.it?.[0] || '';
  }, source?.trim() || '');
}

(test as any)('shows detailed diff highlighting for wrong input', async ({ page }) => {
  await forceEnglishAndOpen(page);
  await selectTheme(page, 'greetings');

  const correct = await currentCorrectAnswer(page);
  let wrong = correct;
  if (correct.length > 1) {
    wrong = correct.slice(0, -1); // missing last char
  } else {
    wrong = correct + 'x'; // make it wrong if single-char correct
  }

  await page.getByTestId('answer').fill(wrong);
  await page.getByTestId('check').click();

  const diff = page.getByTestId('diff-feedback');
  await expect(diff).toBeVisible();
  const errorsAttr = await diff.getAttribute('data-errors');
  expect(parseInt(errorsAttr || '0', 10)).toBeGreaterThan(0);

  // Should render two sections labels
  await expect(diff).toContainText('Your answer');
  await expect(diff).toContainText('Correct answer');

  // Expect at least one highlighted op span
  const insertCount = await page.locator('[data-testid="diff-feedback"] [data-op="insert"]').count();
  const replaceCount = await page.locator('[data-testid="diff-feedback"] [data-op="replace"]').count();
  const deleteCount = await page.locator('[data-testid="diff-feedback"] [data-op="delete"]').count();
  expect(insertCount + replaceCount + deleteCount).toBeGreaterThan(0);
});
