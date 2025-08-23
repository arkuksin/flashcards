# Project Guidelines — Italian Flashcards

Project overview:
- A static single‑page app to practice 300 Italian words. React 18 + Tailwind via CDN; no build tooling.
- Runs directly from file://, from a simple static server, or via GitHub Pages / Vercel.
- E2E tests are implemented with Playwright; a CI workflow runs them against Vercel Preview deployments.

Repository layout (top‑level):
- index.html — entry point (includes React + Tailwind via CDN)
- main.js — app bootstrap
- logic\ — UI state, rendering and helpers
- data\ — datasets and themes (JS modules exporting WORDS and THEMES)
- assets\ — icons and static assets
- tests\ — Playwright specs (*.spec.ts) and a Node unit test (main.test.js)
- playwright.config.ts — Playwright config; auto‑starts a local static server on 127.0.0.1:4173 unless BASE_URL is provided
- .github\workflows\e2e-on-vercel-preview.yml — CI job that runs E2E tests on Vercel Preview URLs
- .junie\guidelines.md — this file

How to run locally:
- Easiest: open index.html in a browser (no server required).
- Static server (recommended for E2E):
  - Install deps: npm ci
  - Start server: npm run serve (serves at http://127.0.0.1:4173)

Tests:
- Prerequisites: Node.js 20 (recommended) or 16+.
- Install browsers for Playwright (first run): npx playwright install
- Unit test (Node):
  - Windows (PowerShell): node tests\main.test.js
- E2E tests (Playwright):
  - Run locally (starts http-server automatically):
    - npx playwright test
    - or npm run test:e2e
  - View report: npx playwright show-report (or npm run playwright:report)
  - Run against a deployed site instead of local server (PowerShell):
    - $env:BASE_URL = 'https://your-domain.example'
    - npx playwright test
    - Remove-Item Env:BASE_URL

CI/CD notes:
- e2e-on-vercel-preview.yml extracts the Vercel Preview URL and runs Playwright against it.
- The status check appears as: "E2E on Vercel Preview / e2e". Configure it as a required check for the main branch in GitHub settings.
- Merging to main triggers only Vercel Production; E2E is not executed against Production by default.

Conventions for Junie (assistant tasks):
- Minimal changes: prefer the smallest code edits necessary to satisfy the issue.
- OS/terminal: This environment uses Windows/PowerShell. Use backslashes (\\) in paths and PowerShell syntax for env vars.
- No build step: keep browser code compatible with running from file:// or a simple static server. Avoid Node/bundler‑only features in client code.
- When modifying logic, data, or user‑visible behavior:
  - Run Playwright E2E tests locally (npx playwright test) before submitting.
  - If relevant to datasets or scoring, also run node tests\main.test.js.
- Ports/URLs: Local E2E assumes http://127.0.0.1:4173. Override with BASE_URL or PLAYWRIGHT_BASE_URL if needed.

Coding style:
- Keep code simple and framework‑agnostic beyond React 18 via CDN.
- Prefer small pure functions in logic\; keep DOM operations centralized.
- Data files are plain JS modules (no JSON fetches).
