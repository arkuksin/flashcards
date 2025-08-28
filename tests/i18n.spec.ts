import { test, expect } from '@playwright/test';

// Helper to force a clean starting state
async function openWithEnglishAndReset(page) {
  await page.addInitScript(() => {
    try {
      localStorage.setItem('lang', 'en');
      localStorage.setItem('streak', '0');
      sessionStorage.setItem('streak', '0');
    } catch {}
  });
  await page.goto('/');
}

const locales = {
  en: {
    title: 'Italian Flashcards — 300 Words',
    langLabel: 'Language:',
    themeLabel: 'Theme:',
    scoreLabel: 'Score: ',
    attemptsLabel: 'Attempts: ',
    accuracyLabel: 'Accuracy: ',
    streakLabel: 'Streak: ',
    sourceLabel: 'English word',
    placeholder: 'e.g.: ciao',
    strictLabel: 'Strict accent check (è ≠ e)',
    counterKeyword: 'Card',
  },
  de: {
    title: 'Italienische Karten — 300 Wörter',
    langLabel: 'Sprache:',
    themeLabel: 'Thema:',
    scoreLabel: 'Punkte: ',
    attemptsLabel: 'Versuche: ',
    accuracyLabel: 'Genauigkeit: ',
    streakLabel: 'Serie: ',
    sourceLabel: 'Deutsches Wort',
    placeholder: 'z. B.: ciao',
    strictLabel: 'Strenge Akzentprüfung (è ≠ e)',
    counterKeyword: 'Karte',
  },
  ru: {
    title: 'Итальянские карточки — 300 слов',
    langLabel: 'Язык:',
    themeLabel: 'Тема:',
    scoreLabel: 'Очки: ',
    attemptsLabel: 'Попытки: ',
    accuracyLabel: 'Точность: ',
    streakLabel: 'Серия: ',
    sourceLabel: 'Русское слово',
    placeholder: 'например: ciao',
    strictLabel: 'Строгая проверка акцентов (è ≠ e)',
    counterKeyword: 'Карточка',
  },
  fr: {
    title: 'Cartes italiennes — 300 mots',
    langLabel: 'Langue :',
    themeLabel: 'Thème :',
    scoreLabel: 'Score : ',
    attemptsLabel: 'Essais : ',
    accuracyLabel: 'Précision : ',
    streakLabel: 'Série : ',
    sourceLabel: 'Mot français',
    placeholder: 'par ex. : ciao',
    strictLabel: 'Vérification stricte des accents (è ≠ e)',
    counterKeyword: 'Carte',
  },
};

(test as any)('UI translates correctly across EN, DE, RU, FR', async ({ page }) => {
  await openWithEnglishAndReset(page);

  // Ensure header and flags UI are present before interacting
  const header = page.getByTestId('header');
  await header.waitFor();
  await page.getByTestId('lang-flags').waitFor();

  for (const code of Object.keys(locales) as Array<keyof typeof locales>) {
    const t = locales[code];

    // Switch language via flag button
    const flag = page.getByTestId(`flag-${code}`);
    await expect(flag).toBeVisible();
    await flag.click();

    // Now the translated heading should be present (within header)
    const heading = header.getByRole('heading', { level: 1 });
    await expect(heading).toHaveText(t.title);

    // Header labels contain translated text
    await expect(header).toContainText(t.langLabel);
    await expect(header).toContainText(t.themeLabel);

    // Score/Attempts/Accuracy/Streak labels are shown in the corresponding boxes
    await expect(page.getByTestId('score')).toContainText(t.scoreLabel);
    await expect(page.getByTestId('attempts')).toContainText(t.attemptsLabel);
    await expect(page.getByTestId('accuracy')).toContainText(t.accuracyLabel);
    await expect(page.getByTestId('streak')).toContainText(t.streakLabel);

    // Card contains source label text
    await expect(page.getByTestId('card')).toContainText(t.sourceLabel);

    // Input placeholder is translated
    await expect(page.getByTestId('answer-input')).toHaveAttribute('placeholder', t.placeholder);

    // Strict accents label
    await expect(page.locator('label[for="strict"]')).toHaveText(t.strictLabel);

    // Counter keyword present
    await expect(page.getByTestId('counter')).toContainText(t.counterKeyword);

    // Active flag is pressed
    await expect(flag).toHaveAttribute('aria-pressed', 'true');
  }
});
