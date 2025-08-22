# Italian Flashcards — 300 Words

A single‑page app to practice Italian vocabulary. By default it uses English → Italian, and you can switch to German → Italian, Russian → Italian, or French → Italian.  
React 18 + Tailwind via CDN, no build step. Works locally and on GitHub Pages.

## Quick start
Open `index.html` in your browser.

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

## Tests
- Requires Node.js 16+.
- Run (Windows): `node tests\main.test.js`
- Run (macOS/Linux): `node tests/main.test.js`

## Notes
- In the browser, all available datasets are included; the English set (EN→IT) is used by default, and you can switch (EN ↔ DE ↔ RU ↔ FR).
- Unit tests in Node use the Russian dataset (`dataset-ru.js`).
- If a chosen dataset doesn’t define `THEMES`, the app automatically creates the `all` theme that covers the entire `WORDS` list.


## End-to-end tests (Playwright)
The project includes Playwright E2E tests that exercise the main flashcard flow.

- Prerequisites: Node.js 20 (recommended) or 16+.
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
