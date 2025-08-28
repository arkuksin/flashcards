# Italian Flashcards — 300 Words

A single‑page app to practice Italian vocabulary. By default it uses English → Italian, and you can switch to German → Italian, Russian → Italian, or French → Italian.  
React 18 + Tailwind via CDN, no build step. Works locally and on GitHub Pages.

## Quick start
- Word Learning: open `index.html` in your browser.
- Grammar — Comparatives & Superlatives: open `grammar.html` in your browser.

## Grammar — Comparatives & Superlatives
A new learning area alongside Word Learning focused on adjective degrees.

- Languages: English, Deutsch, Italiano, Русский.
- Content: 100 core adjectives per language (positives). Comparative and superlative forms are generated at runtime using language‑specific rules (with irregulars where applicable).
- Modes:
  - Multiple choice — choose the correct form.
  - Fill‑in — type the correct form.
  - Drag & drop — assign positive/comparative/superlative to the correct slots (click‑to‑assign for accessibility).
- UX: instant feedback on mistakes, highlighted corrections, progress indicator, responsive UI.
- Navigation: switch between sections via the top navigation (Word Learning ↔ Grammar).
- Extensible: the module is designed to be extended with more grammar topics (e.g., verb tenses) by adding logic and datasets under `logic\grammar` and `data\grammar`.

### Shortcuts (Grammar)
- Enter: Check answer (Fill-in, Drag & drop). If already checked, advances to the next exercise.
- → (ArrowRight): Next exercise.
- Esc: Clear input (Fill-in mode).
- 1–4: Choose the corresponding option in Multiple choice (options are numbered 1., 2., 3., 4.).
- Italian Fill-in: Use the “Strict accent check (è ≠ e)” toggle to require exact accents; when OFF, answers are accepted without accents.

## GitHub Pages
Commit the files to your repository (branch `main`, at the repository root). Enable Settings → Pages → Deploy from branch → `main` / root.

## Controls
- Enter — check your answer.
- → — go to the next card.
- Skip — counts as an attempt and moves on.
- Reveal — shows the correct answer and counts as an attempt.
- Reshuffle — shuffles the deck and resets score/attempts.
- Reset score/attempts/accuracy and restart — fully resets stats and returns to the first card of the current order.
- Theme — choose All words or a specific theme (e.g., Greetings, Food…). The deck and stats will update for the selected theme.
- Strict accent check (è ≠ e) — toggle to require exact accents; off by default (caffe counts as caffè).

## Data
- Words and themes live in separate files:
  - `data\dataset-en.js` — English → Italian (objects `{ en: string, it: string[] }`).
  - `data\dataset-de.js` — German → Italian (objects `{ de: string, it: string[] }`).
  - `data\dataset-ru.js` — Russian → Italian (objects `{ ru: string, it: string[] }`).
  - `data\dataset-fr.js` — French → Italian (objects `{ fr: string, it: string[] }`).
- Format: plain JavaScript modules (work in browser and Node) that export:
  - `WORDS`: an array of objects with the source word (en/de/ru/fr) and Italian answers `it`.
  - `THEMES`: an array of `{ key: string, name: string, start: number, count: number }`.
- How to edit:
  - Add/change words in the appropriate file. For multiple accepted answers, use the `it` array, e.g. `["caffe", "caffè"]`.
  - Themes (`THEMES`) define windows inside `WORDS` by indexes: `start` — starting index, `count` — number of words. The `all` theme automatically spans the full array.
- Why not JSON: the app runs directly from file:// without a dev server; browsers block fetching local JSON. A JS data file is the simplest and most editable option without build or server.
- Language switch (EN/DE/RU/FR) changes both the UI language and the card set (EN→IT, DE→IT, RU→IT, or FR→IT). English is the default.

### Available themes
The app provides these themes (names are localized per chosen UI language):
- All words — the entire deck
- Greetings & conversation (20)
- People & family (20)
- Food & drinks (20)
- Transport & travel (20)
- Numbers (20)
- Colors (20)
- Home & things (20)
- Nature & weather (20)
- Work & study (20)
- Shopping (20)
- Time & Calendar (20)
- Body & Health (20)
- School & Education (20)
- City & Places (20)
- Leisure & Hobbies (20)

Note: If a chosen dataset doesn’t define THEMES, the app automatically creates the All words theme covering all available words.

## Color system (Tailwind CDN)
A small palette is centralized via CSS variables in `index.html` and minimal helper utilities:

- CSS variables (in :root):
  - `--color-primary: #0284c7` (sky-600)
  - `--color-secondary: #1e293b` (slate-800)
  - `--color-bg: #f8fafc` (slate-50)
  - `--color-surface: #ffffff` (white)
  - `--color-success: #16a34a` (green-600)
  - `--color-error: #e11d48` (rose-600)

- Utility helpers (global):
  - Backgrounds: `bg-bg`, `bg-surface`, `bg-primary`, `bg-secondary`, `bg-success`, `bg-error`
  - Text: `text-primary`, `text-secondary`, `text-success`, `text-error`
  - Gradient source color: `from-primary` (works with Tailwind gradients, e.g., `bg-gradient-to-br from-primary to-indigo-600`).

How to change the palette:
- Edit the variable values inside `<style> :root { ... } </style>` in `index.html`.
- Components use the helpers above, so colors update automatically. The top header uses a soft gradient: `bg-gradient-to-br from-primary to-indigo-600`.

Note: Grammar page uses the default Tailwind palette; you can copy the same `<style>` block to `grammar.html` if you want consistent theming there as well.

## Tests
Unit tests (Node.js):
- Requires Node.js 16+.
- Run all unit tests: `npm run test:unit`
- Run individually:
  - Windows: `node tests\main.test.js` and `node tests\grammar.logic.test.js`
  - macOS/Linux: `node tests/main.test.js` and `node tests/grammar.logic.test.js`

For End-to-end tests (Playwright), see the section below (requires Node.js 18+).

## Notes
- In the browser, all available datasets are included; the English set (EN→IT) is used by default, and you can switch (EN ↔ DE ↔ RU ↔ FR).
- Unit tests in Node use the Russian dataset (`dataset-ru.js`).
- If a chosen dataset doesn’t define `THEMES`, the app automatically creates the `all` theme that covers the entire `WORDS` list.


## End-to-end tests (Playwright)
The project includes Playwright E2E tests that exercise the main flashcard flow.

- Prerequisites: Node.js 18+ (20+ recommended).
- Install dependencies: `npm ci` (or `npm i`)
- Install Playwright browsers: `npx playwright install`
- Run tests locally (a static server will be started automatically at http://127.0.0.1:4173):
  - `npx playwright test`
- View the HTML report after a run:
  - `npx playwright show-report`
- Run against production instead of local (override base URL):
  - PowerShell (Windows):
    - `$env:BASE_URL = 'https://your-domain.example'`
    - `npx playwright test`
    - `Remove-Item Env:BASE_URL`
  - macOS/Linux:
    - `BASE_URL=https://your-domain.example npx playwright test`

CI/CD:
- E2E on Preview: The workflow .github/workflows/e2e-on-vercel-preview.yml runs Playwright E2E tests automatically when a Vercel Preview deployment succeeds. This occurs when:
  - A Pull Request is opened or updated; or
  - A non-main branch receives a push (branch previews must be enabled in Vercel).
  It extracts the Preview URL and runs tests against it. The job name is "e2e"; the status check will appear in PRs as: E2E on Vercel Preview / e2e.
- Production deploys: Merging to main triggers only Vercel Production deployment (managed by Vercel). No Playwright tests run on Production.
- Branch protection: In GitHub Settings → Branches → Branch protection rules for main, add a required status check named "E2E on Vercel Preview / e2e" and disallow bypass. With this setting, PRs cannot be merged unless the E2E check passes.
