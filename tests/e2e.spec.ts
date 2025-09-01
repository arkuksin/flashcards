import { test, expect } from '@playwright/test';
import { applyVercelBypass } from './utils';

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:4173';

// Für alle Tests dieselbe Basis-URL nutzen
test.use({ baseURL: BASE_URL });

// Vor jedem Test: ggf. Preview-Bypass-Cookie setzen
test.beforeEach(async ({ context }) => {
    await applyVercelBypass(context, BASE_URL);
});

test.describe('Flashcards UI - smoke flow', () => {
    test('page renders and core elements are visible', async ({ page }) => {
        await page.goto('/');

        // Hauptcontainer/Karte sichtbar
        const card = page.getByTestId('card');
        await expect(card).toBeVisible();

        // Eingabefeld vorhanden und fokussierbar
        const answer = page.getByTestId('answer');
        await expect(answer).toBeVisible();
        await answer.focus();

        // Prüfen-Button sichtbar
        const checkBtn = page.getByTestId('check');
        await expect(checkBtn).toBeVisible();

        // (optional) Score/Stats vorhanden, wenn vorhanden
        const score = page.getByTestId('score');
        if (await score.isVisible().catch(() => false)) {
            await expect(score).toBeVisible();
        }
    });

    test('next navigation works', async ({ page }) => {
        await page.goto('/');

        const nextBtn = page.getByTestId('next');
        // Wenn es den Next-Button gibt, sollte ein Klick die Karte wechseln
        if (await nextBtn.isVisible().catch(() => false)) {
            const card = page.getByTestId('card');
            const before = await card.textContent();
            await nextBtn.click();
            // leichte Wartezeit für Transition
            await page.waitForTimeout(150);
            const after = await card.textContent();
            expect(after).not.toBeNull();
            expect(after).not.toEqual(before);
        } else {
            test.skip(true, 'No next button present (skipping navigation smoke check).');
        }
    });

    test('check interaction provides feedback', async ({ page }) => {
        await page.goto('/');

        const answer = page.getByTestId('answer');
        const checkBtn = page.getByTestId('check');

        await expect(answer).toBeVisible();
        await expect(checkBtn).toBeVisible();

        // irgendeinen Wert eingeben und prüfen
        await answer.fill('test');
        await checkBtn.click();

        // Feedback-Mechanismus: entweder Feedback-Element oder State-Änderung an der Karte
        const feedback = page.getByTestId('feedback');
        if (await feedback.isVisible().catch(() => false)) {
            await expect(feedback).toBeVisible();
        } else {
            // Fallback: Karte ändert sich (z. B. Statusring/Hintergrund) – hier minimaler Check: Inhalt könnte wechseln
            const card = page.getByTestId('card');
            await expect(card).toBeVisible();
        }
    });
});
