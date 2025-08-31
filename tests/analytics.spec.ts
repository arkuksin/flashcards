import { test, expect } from '@playwright/test';
import { applyVercelBypass } from './utils';

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:4173';
const isVercel = /\.vercel\.app$/i.test(new URL(BASE_URL).host);

test.describe('Vercel Web Analytics', () => {
    test.beforeEach(async ({ context }) => {
        if (isVercel) {
            await applyVercelBypass(context, BASE_URL); // Preview-Protection umgehen (falls aktiv)
        }
    });

    test('insights script loads and window.va is defined', async ({ page, request }) => {
        if (isVercel) {
            // Full Vercel analytics test - script must load from /_vercel/insights/script.js
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
        } else {
            // Local development test - just verify the analytics stub is present
            await page.goto(BASE_URL + '/');

            // Prüfen, dass der VA-Shim im lokalen Setup vorhanden ist (aus index.html)
            const hasVA = await page.evaluate(() => typeof (window as any).va === 'function');
            expect(hasVA).toBe(true);

            // Verify the stub has expected queue behavior and can be called
            const canCallVA = await page.evaluate(() => {
                const w = window as any;
                // Test that we can call va() and it queues the call
                const initialQueueLength = w.vaq ? w.vaq.length : 0;
                w.va('test', 'event');
                return w.vaq && w.vaq.length > initialQueueLength;
            });
            expect(canCallVA).toBe(true);
        }
    });
});
