import { test, expect } from '@playwright/test';
import { applyVercelBypass } from './utils';

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:4173';

test.beforeEach(async ({ context }) => {
    await applyVercelBypass(context, BASE_URL);
});

const isVercel = /\.vercel\.app$/i.test(new URL(BASE_URL).host);

test.describe('Vercel Analytics', () => {
    test.skip(!isVercel, 'Analytics endpoint exists only on Vercel deploys.');

    test('vercel analytics loads', async ({ page, request }) => {
        // Preflight: Stelle sicher, dass das Script auf dem Ziel existiert
        const head = await request.get(`${BASE_URL}/_vercel/insights/script.js`);
        test.skip(!head.ok(), 'Insights script not reachable on target BASE_URL');

        await page.goto(BASE_URL + '/');

        const resp = await page.waitForResponse(r =>
            r.url().includes('/_vercel/insights/script.js') && r.ok(),
        );
        expect(resp.ok()).toBeTruthy();

        const hasVA = await page.evaluate(() => typeof (window as any).va === 'function');
        expect(hasVA).toBe(true);
    });
});
