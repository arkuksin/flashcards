import { defineConfig, devices } from '@playwright/test';

const DEFAULT_BASE_URL = 'http://127.0.0.1:4173';
const envBase = process.env.PLAYWRIGHT_BASE_URL || process.env.BASE_URL;
const baseURL = envBase || DEFAULT_BASE_URL;
// Hint for IDE/tsserver; Playwright nutzt intern esbuild, aber das hilft IntelliJ:
process.env.TS_NODE_PROJECT = 'tsconfig.playwright.json';


export default defineConfig({
  testDir: 'tests',
  testMatch: /.*\.spec\.(ts|tsx|js)/,
  fullyParallel: true,
  retries: 0,
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: { width: 1280, height: 800 },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: envBase
    ? undefined
    : {
        command: 'npx http-server -p 4173 -a 127.0.0.1 -c-1 .',
        url: DEFAULT_BASE_URL,
        reuseExistingServer: true,
        timeout: 60_000,
      },
});
