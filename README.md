# Italian Flashcards — 200 Words

A single‑page app to practice Italian vocabulary. By default it uses English → Italian, and you can switch to German → Italian or Russian → Italian.  
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
- Format: plain JavaScript modules (work in browser and Node) that export:
  - `WORDS`: an array of objects with the source word (en/de/ru) and Italian answers `it`.
  - `THEMES`: an array of `{ key: string, name: string, start: number, count: number }`.
- How to edit:
  - Add/change words in the appropriate file. For multiple accepted answers, use the `it` array, e.g. `["caffe", "caffè"]`.
  - Themes (`THEMES`) define windows inside `WORDS` by indexes: `start` — starting index, `count` — number of words. The `all` theme automatically spans the full array.
- Why not JSON: the app runs directly from file:// without a dev server; browsers block fetching local JSON. A JS data file is the simplest and most editable option without build or server.
- Language switch (EN/DE/RU) changes both the UI language and the card set (EN→IT, DE→IT, or RU→IT). English is the default.

## Tests
- Requires Node.js 16+.
- Run (Windows): `node tests\main.test.js`
- Run (macOS/Linux): `node tests/main.test.js`

## Notes
- In the browser, all available datasets are included; the English set (EN→IT) is used by default, and you can switch (EN ↔ DE ↔ RU).
- Unit tests in Node use the Russian dataset (`dataset-ru.js`).
- If a chosen dataset doesn’t define `THEMES`, the app automatically creates the `all` theme that covers the entire `WORDS` list.
