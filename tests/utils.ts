import { BrowserContext } from '@playwright/test';

export async function applyVercelBypass(context: BrowserContext, baseUrl: string) {
    const token = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
    if (!token || !baseUrl) return;
    const { host } = new URL(baseUrl);
    await context.addCookies([{
        name: 'vercel-protection-bypass',
        value: token,
        domain: host,
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'Lax'
    }]);
}
