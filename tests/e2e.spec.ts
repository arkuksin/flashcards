import { test, expect } from '@playwright/test';

// Utilities to stabilize tests
async function forceEnglishAndOpen(page) {
  await page.addInitScript(() => {
    try {
      localStorage.setItem('lang', 'en');
    } catch {}
  });
  await page.goto('/');
}

async function selectTheme(page, key: string) {
  const theme = page.getByTestId('theme-select');
  await theme.selectOption(key);
}

async function getCounter(page) {
  const el = page.getByTestId('counter');
  await expect(el).toBeVisible();
  return {
    index: parseInt(await el.getAttribute('data-index') || '0', 10),
    total: parseInt(await el.getAttribute('data-total') || '0', 10),
  };
}

async function getScore(page) {
  const score = page.getByTestId('score');
  const attempts = page.getByTestId('attempts');
  return {
    points: parseInt(await score.getAttribute('data-value') || '0', 10),
    attempts: parseInt(await attempts.getAttribute('data-value') || '0', 10),
  };
}

async function currentCorrectAnswer(page) {
  const source = await page.getByTestId('source-word').textContent();
  return await page.evaluate((src) => {
    const ds = (window as any).DATASET_EN;
    const item = ds?.WORDS?.find((x: any) => x.en === src);
    return item?.it?.[0] || '';
  }, source?.trim() || '');
}

// 1) Page loads and shows the first card
(test as any)('page loads and shows first card', async ({ page }) => {
  await forceEnglishAndOpen(page);
  await selectTheme(page, 'greetings');
  const { index, total } = await getCounter(page);
  expect(index).toBe(1);
  expect(total).toBeGreaterThan(1);
  await expect(page.getByTestId('source-word')).toHaveText(/\S/);
});

// 2) Typing the correct Italian word increases the score and shows positive feedback
(test as any)('correct answer increases score and shows positive feedback', async ({ page }) => {
  await forceEnglishAndOpen(page);
  await selectTheme(page, 'greetings');
  const initial = await getScore(page);
  const answer = await currentCorrectAnswer(page);
  await page.getByTestId('answer-input').fill(answer);
  await page.getByTestId('btn-check').click();
  await expect(page.getByTestId('feedback')).toBeVisible();
  await expect(page.getByTestId('feedback')).toHaveAttribute('data-correct', 'true');
  const after = await getScore(page);
  expect(after.points).toBe(initial.points + 1);
  expect(after.attempts).toBe(initial.attempts + 1);
});

// 3) Typing a wrong answer does not increase score and shows the correct solution
(test as any)('wrong answer does not increase score and shows solution', async ({ page }) => {
  await forceEnglishAndOpen(page);
  await selectTheme(page, 'greetings');
  const initial = await getScore(page);
  await page.getByTestId('answer-input').fill('zzzznotananswer');
  await page.getByTestId('btn-check').click();
  await expect(page.getByTestId('feedback')).toHaveAttribute('data-correct', 'false');
  await expect(page.getByTestId('correct-answer')).toHaveText(/\S/);
  const after = await getScore(page);
  expect(after.points).toBe(initial.points);
  expect(after.attempts).toBe(initial.attempts + 1);
});

// 4) Keyboard shortcuts work: Enter check, ArrowRight next, Esc clear input
(test as any)('keyboard shortcuts: Enter, ArrowRight, Esc', async ({ page }) => {
  await forceEnglishAndOpen(page);
  await selectTheme(page, 'greetings');

  // Type and press Enter to check
  await page.getByTestId('answer-input').fill('totallywrong');
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('card')).toHaveAttribute('data-checked', 'true');

  // ArrowRight to go next
  const before = await getCounter(page);
  await page.keyboard.press('ArrowRight');
  const after = await getCounter(page);
  expect(after.index).toBe((before.index % after.total) + 1);

  // Esc to clear input
  await page.getByTestId('answer-input').fill('some text');
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('answer-input')).toHaveValue('');
});

// 5) Shuffle/Reset resets counters and card order (index to 1)
(test as any)('reshuffle resets counters and index', async ({ page }) => {
  await forceEnglishAndOpen(page);
  await selectTheme(page, 'greetings');

  // Do some attempts
  await page.getByTestId('answer-input').fill('x');
  await page.getByTestId('btn-check').click();
  await page.getByTestId('btn-next').click();

  // Reshuffle
  await page.getByTestId('btn-reshuffle').click();
  await expect(page.getByTestId('score')).toHaveAttribute('data-value', '0');
  await expect(page.getByTestId('attempts')).toHaveAttribute('data-value', '0');
  await expect(page.getByTestId('counter')).toHaveAttribute('data-index', '1');
});

// 6) After the last card, the deck cycles back to the first one
(test as any)('deck cycles after last card', async ({ page }) => {
  await forceEnglishAndOpen(page);
  await selectTheme(page, 'greetings');
  const { total } = await getCounter(page);

  for (let i = 0; i < total; i++) {
    await page.getByTestId('btn-next').click();
  }
  await expect(page.getByTestId('counter')).toHaveAttribute('data-index', '1');
});
