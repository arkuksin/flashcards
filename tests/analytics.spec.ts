import { test, expect } from '@playwright/test';
import { applyVercelBypass } from './utils';

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:4173';
const isVercel = /\.vercel\.app$/i.test(new URL(BASE_URL).host);

test.describe('Vercel Web Analytics', () => {
    // Lokal existiert das Insights-Script nicht → nur auf Vercel prüfen
    test.skip(!isVercel, 'Analytics endpoint exists only on Vercel deploys.');

    test.beforeEach(async ({ context }) => {
        await applyVercelBypass(context, BASE_URL); // Preview-Protection umgehen (falls aktiv)
    });

    test('insights script loads and window.va is defined', async ({ page, request }) => {
        // Preflight: Stelle sicher, dass die Insights-Datei dort erreichbar ist
        const resp = await request.get(`${BASE_URL}/_vercel/insights/script.js`);
        test.skip(!resp.ok(), 'Insights script not reachable on target BASE_URL');

        await page.goto(BASE_URL + '/');

        // Warten bis das Script vom Browser geladen wurde
        const scriptResp = await page.waitForResponse(r =>
            r.url().includes('/_vercel/insights/script.js') && r.ok()
        );
        expect(scriptResp.ok()).toBeTruthy();

        // Prüfen, dass der VA-Shim vorhanden ist
        const hasVA = await page.evaluate(() => typeof (window as any).va === 'function');
        expect(hasVA).toBe(true);
    });
});
