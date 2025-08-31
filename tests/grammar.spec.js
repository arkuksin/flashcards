// @ts-check
const { test, expect } = require('@playwright/test');

async function selectLang(page, code) {
  await page.selectOption('[data-testid="lang-select"]', code);
}

async function ensureAtLeastOneExercise(page) {
  const progress = page.locator('[data-testid="progress"]');
  await expect(progress).toHaveAttribute('data-total');
}

test.describe('Grammar — Comparatives & Superlatives', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(baseURL + '/grammar.html');
    await ensureAtLeastOneExercise(page);
  });

  test('Fill-in mode: can answer correctly using computed form', async ({ page }) => {
    await selectLang(page, 'en');
    await page.selectOption('[data-testid="mode-select"]', 'fill');
    const base = await page.locator('[data-testid="base-word"]').textContent();
    const prompt = await page.locator('[data-testid="prompt"]').textContent();
    // Compute expected using in-page logic
    const expected = await page.evaluate(([b, p]) => {
      const [pos, comp, sup] = window.GrammarComparatives.enForms(b);
      return p.includes('comparative') ? comp : sup;
    }, [base, prompt]);
    await page.fill('[data-testid="answer"]', expected);
    await page.click('[data-testid="check"]');
    await expect(page.locator('[data-testid="feedback"]').first()).toHaveAttribute('data-correct', 'true');
  });

  test('Multiple choice: picks the correct option', async ({ page }) => {
    await selectLang(page, 'en');
    await page.selectOption('[data-testid="mode-select"]', 'mc');
    // Wait for MC container and at least one option to be attached
    await page.locator('[data-testid="mc-container"]').waitFor({ state: 'attached', timeout: 15000 });
    await page.locator('[data-testid^="option-"]').first().waitFor({ state: 'attached', timeout: 15000 });
    const base = await page.locator('[data-testid="base-word"]').textContent();
    const prompt = await page.locator('[data-testid="prompt"]').textContent();
    const expected = await page.evaluate(([b, p]) => {
      const [pos, comp, sup] = window.GrammarComparatives.enForms(b);
      return p.includes('comparative') ? comp : sup;
    }, [base, prompt]);
    const count = await page.locator('[data-testid^="option-"]').count();
    let clicked = false;
    for (let i = 0; i < count; i++) {
      const opt = page.locator(`[data-testid="option-${i}"]`);
      const txt = (await opt.textContent()) || '';
      const label = txt.replace(/^\s*\d+\.\s*/, '').trim();
      if (label === expected) {
        await opt.click();
        clicked = true;
        break;
      }
    }
    expect(clicked).toBeTruthy();
    await expect(page.locator('[data-testid="feedback"]').first()).toHaveAttribute('data-correct', 'true');
  });

  test('Drag & drop mode: assigns values correctly and checks', async ({ page }) => {
    await selectLang(page, 'en');
    await page.selectOption('[data-testid="mode-select"]', 'dnd');
    const base = await page.locator('[data-testid="base-word"]').textContent();
    // Compute all forms
    const forms = await page.evaluate((b) => window.GrammarComparatives.enForms(b), base);
    const mapping = { positive: forms[0], comparative: forms[1], superlative: forms[2] };
    // Assign values by clicking each value then the right slot
    const values = await page.locator('[data-testid^="dnd-value-"]').allTextContents();
    for (const key of ['positive', 'comparative', 'superlative']) {
      const val = mapping[key];
      // find token index
      const idx = values.findIndex(v => v.trim() === val);
      // requery locator because DOM may change on click
      await page.locator(`[data-testid="dnd-value-${idx}"]`).click();
      await page.locator(`[data-testid="dnd-slot-${key}"]`).click();
    }
    await page.click('[data-testid="check"]');
    await expect(page.locator('[data-testid="feedback"]').first()).toHaveAttribute('data-correct', 'true');
  });
});


test.describe('Grammar — Italian accent handling', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(baseURL + '/grammar.html');
    await page.selectOption('[data-testid="lang-select"]', 'it');
    await page.selectOption('[data-testid="mode-select"]', 'fill');
  });

  test('Fill-in accepts missing accents when strict is OFF (Italian)', async ({ page }) => {
    // Ensure strict toggle is OFF
    const strict = page.locator('[data-testid="strict-toggle"]');
    if (await strict.isChecked()) await strict.click();

    const base = (await page.locator('[data-testid="base-word"]').textContent()).trim();
    const prompt = (await page.locator('[data-testid="prompt"]').textContent()).trim();

    const answerNoAccents = await page.evaluate(([b, p]) => {
      const [pos, comp, sup] = window.GrammarComparatives.itForms(b);
      const expected = p.includes('comparative') ? comp : sup;
      // strip accents
      return expected.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }, [base, prompt]);

    await page.fill('[data-testid="answer"]', answerNoAccents);
    await page.click('[data-testid="check"]');
    await expect(page.locator('[data-testid="feedback"]').first()).toHaveAttribute('data-correct', 'true');
  });

  test('Fill-in rejects missing accents when strict is ON (Italian)', async ({ page }) => {
    // Ensure strict toggle is ON
    const strict = page.locator('[data-testid="strict-toggle"]');
    if (!(await strict.isChecked())) await strict.click();

    const base = (await page.locator('[data-testid="base-word"]').textContent()).trim();
    const prompt = (await page.locator('[data-testid="prompt"]').textContent()).trim();

    const answerNoAccents = await page.evaluate(([b, p]) => {
      const [pos, comp, sup] = window.GrammarComparatives.itForms(b);
      const expected = p.includes('comparative') ? comp : sup;
      return expected.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }, [base, prompt]);

    await page.fill('[data-testid="answer"]', answerNoAccents);
    await page.click('[data-testid="check"]');
    await expect(page.locator('[data-testid="feedback"]').first()).toHaveAttribute('data-correct', 'false');
  });
});


// Shortcuts tests for Grammar UI
const { test: test2, expect: expect2 } = require('@playwright/test');

test2.describe('Grammar — Shortcuts', () => {
  test2.beforeEach(async ({ page, baseURL }) => {
    await page.goto(baseURL + '/grammar.html');
  });

  test2('Fill-in: Enter checks answer and second Enter advances', async ({ page }) => {
    await page.selectOption('[data-testid="lang-select"]', 'en');
    await page.selectOption('[data-testid="mode-select"]', 'fill');
    const base = (await page.locator('[data-testid="base-word"]').textContent()).trim();
    const prompt = (await page.locator('[data-testid="prompt"]').textContent()).trim();
    const expected = await page.evaluate(([b, p]) => {
      const [pos, comp, sup] = window.GrammarComparatives.enForms(b);
      return p.includes('comparative') ? comp : sup;
    }, [base, prompt]);

    await page.fill('[data-testid="answer"]', expected);
    await page.keyboard.press('Enter');
    await expect2(page.locator('[data-testid="feedback"]').first()).toHaveAttribute('data-correct', 'true');

    const idxBefore = Number(await page.locator('[data-testid="progress"]').getAttribute('data-index'));
    await page.keyboard.press('Enter');
    const idxAfter = Number(await page.locator('[data-testid="progress"]').getAttribute('data-index'));
    expect2(idxAfter).toBe((idxBefore % Number(await page.locator('[data-testid="progress"]').getAttribute('data-total'))) + 1);
  });

  test2('Multiple-choice: number key selects correct option', async ({ page }) => {
    await page.selectOption('[data-testid="lang-select"]', 'en');
    await page.selectOption('[data-testid="mode-select"]', 'mc');
    // Wait for MC container and at least one option to be attached
    await page.locator('[data-testid="mc-container"]').waitFor({ state: 'attached', timeout: 15000 });
    await page.locator('[data-testid^="option-"]').first().waitFor({ state: 'attached', timeout: 15000 });
    await expect2(page.locator('[data-testid="base-word"]')).toBeVisible();
    const base = (await page.locator('[data-testid="base-word"]').textContent()).trim();
    const prompt = (await page.locator('[data-testid="prompt"]').textContent()).trim();
    const expected = await page.evaluate(([b, p]) => {
      const [pos, comp, sup] = window.GrammarComparatives.enForms(b);
      return p.includes('comparative') ? comp : sup;
    }, [base, prompt]);

    const opts = await page.locator('[data-testid^="option-"]').allTextContents();
    const idx = opts.findIndex(t => t.replace(/^\s*\d+\.\s*/, '').trim() === expected);

    // Blur any focused <select> to ensure window-level keydown receives the digit
    await page.locator('[data-testid="base-word"]').click();

    // Press the corresponding number (1-based)
    await page.keyboard.press(String(idx + 1));
    await expect2(page.locator('[data-testid="feedback"]').first()).toHaveAttribute('data-correct', 'true');
  });

  test2('Drag & drop: Enter triggers check after mapping', async ({ page }) => {
    await page.selectOption('[data-testid="lang-select"]', 'en');
    await page.selectOption('[data-testid="mode-select"]', 'dnd');
    const base = (await page.locator('[data-testid="base-word"]').textContent()).trim();
    const forms = await page.evaluate((b) => window.GrammarComparatives.enForms(b), base);
    const mapping = { positive: forms[0], comparative: forms[1], superlative: forms[2] };
    const values = await page.locator('[data-testid^="dnd-value-"]').allTextContents();

    for (const key of ['positive', 'comparative', 'superlative']) {
      const val = mapping[key];
      const i = values.findIndex(v => v.trim() === val);
      await page.locator(`[data-testid="dnd-value-${i}"]`).click();
      await page.locator(`[data-testid="dnd-slot-${key}"]`).click();
    }

    await page.keyboard.press('Enter');
    await expect2(page.locator('[data-testid="feedback"]').first()).toHaveAttribute('data-correct', 'true');
  });
});
