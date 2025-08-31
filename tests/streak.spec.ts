import { test, expect } from '@playwright/test';

// Local helpers (duplicated to keep tests independent)
async function forceEnglishAndOpen(page) {
  await page.addInitScript(() => {
    try {
      localStorage.setItem('lang', 'en');
      // Ensure a clean slate for streak tests
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

(test as any)('celebrates at 10-correct streak with toast and counter', async ({ page }) => {
  await forceEnglishAndOpen(page);
  // Use a known theme from existing tests
  await selectTheme(page, 'greetings');

  const streakEl = page.getByTestId('streak');
  await expect(streakEl).toBeVisible();
  await expect(streakEl).toHaveAttribute('data-value', '0');

  for (let i = 1; i <= 10; i++) {
    const answer = await currentCorrectAnswer(page);
    await page.getByTestId('answer').fill(answer);
    await page.getByTestId('check').click();

    // Streak should update immediately after checking
    await expect(streakEl).toHaveAttribute('data-value', String(i));

    // Celebration should not appear before 10
    if (i < 10) {
      await expect(page.getByTestId('celebration')).toHaveCount(0);
      // Go to next card for the next correct answer
      await page.getByTestId('next').click();
    } else {
      // At 10, celebration toast must appear with correct message
      const toast = page.getByTestId('celebration');
      await expect(toast).toBeVisible();
      await expect(toast).toContainText('Congrats! 10 correct in a row!');
      // After assertion, user still can proceed
      await page.getByTestId('next').click();
    }
  }
});
