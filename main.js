// main.js — Fully working flashcards app (200 words)
// React 18 + Tailwind via CDN. No build; ready for GitHub Pages.


// ==== Data: EN default dataset (browser), optional RU/DE; RU used for Node tests ====
let WORDS; // Node export (RU)
let THEMES; // Node export (RU)
let DS_EN;
let DS_RU;
let DS_DE;
let DS_FR;

if (typeof window !== "undefined") {
  if (!window.DATASET_EN || !Array.isArray(window.DATASET_EN.WORDS)) {
    throw new Error("EN dataset not found. Include data\\dataset-en.js before main.js");
  }
  DS_EN = window.DATASET_EN;
  DS_RU = (window.DATASET_RU && Array.isArray(window.DATASET_RU.WORDS)) ? window.DATASET_RU : null;
  DS_DE = (window.DATASET_DE && Array.isArray(window.DATASET_DE.WORDS)) ? window.DATASET_DE : null;
  DS_FR = (window.DATASET_FR && Array.isArray(window.DATASET_FR.WORDS)) ? window.DATASET_FR : null;
} else if (typeof require === "function") {
  const ds = require("./data/dataset-ru.js");
  if (!ds || !Array.isArray(ds.WORDS)) {
    throw new Error("WORDS dataset not found at ./data/dataset-ru.js");
  }
  WORDS = ds.WORDS;
  THEMES = Array.isArray(ds.THEMES) ? ds.THEMES : [
    { key: "all", name: "Все слова", start: 0, count: ds.WORDS.length }
  ];
}

// ==== Utilities ====
const stripDiacritics = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const normalize = (s) =>
  stripDiacritics(String(s || "").toLowerCase())
    .replace(/[!?.,;:¿¡/\\()\[\]{}'\"`´’‛“”„–—-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ==== I18N strings for EN, RU, DE, FR UI ====
const I18N = {
  en: {
    title: "Italian Flashcards — 300 Words",
    subtitle: "Type the Italian translation and click the card. Enter — check, click again — next.",
    langLabel: "Language:",
    themeLabel: "Theme:",
    scoreLabel: "Score: ",
    attemptsLabel: "Attempts: ",
    accuracyLabel: "Accuracy: ",
    sourceLabel: "English word",
    clickHintUnchecked: "Click to check.",
    clickHintChecked: "Click to go next.",
    correct: "Correct! ✅",
    correctAnswerLabel: "Correct answer: ",
    alsoAcceptedPrefix: " (also accepted: ",
    alsoAcceptedSuffix: ")",
    inputLabel: "Enter the Italian translation",
    placeholder: "e.g.: ciao",
    btnCheck: "Check (Enter)",
    btnNext: "Next (→)",
    btnSkip: "Skip",
    btnReveal: "Reveal",
    btnReshuffle: "Reshuffle",
    btnReset: "Reset score/attempts/accuracy and restart",
    strictLabel: "Strict accent check (è ≠ e)",
    counter: (i, n) => `Card ${i} of ${n}`,
    tips: "Tips: 1) Enter — check, → — next. 2) Clicking the card also checks/advances. 3) Accents are optional by default (caffe counts as caffè)."
  },
  ru: {
    title: "Итальянские карточки — 300 слов",
    subtitle: "Введи перевод на итальянский и кликни по карточке. Enter — проверить, повторный клик — следующая.",
    langLabel: "Язык:",
    themeLabel: "Тема:",
    scoreLabel: "Очки: ",
    attemptsLabel: "Попытки: ",
    accuracyLabel: "Точность: ",
    sourceLabel: "Русское слово",
    clickHintUnchecked: "Кликни, чтобы проверить.",
    clickHintChecked: "Кликни, чтобы перейти дальше.",
    correct: "Правильно! ✅",
    correctAnswerLabel: "Нужный ответ: ",
    alsoAcceptedPrefix: " (также принимается: ",
    alsoAcceptedSuffix: ")",
    inputLabel: "Введи итальянский перевод",
    placeholder: "например: ciao",
    btnCheck: "Проверить (Enter)",
    btnNext: "Дальше (→)",
    btnSkip: "Пропустить",
    btnReveal: "Показать ответ",
    btnReshuffle: "Перемешать заново",
    btnReset: "Сбросить очки/попытки/точность и начать сначала",
    strictLabel: "Строгая проверка акцентов (è ≠ e)",
    counter: (i, n) => `Карточка ${i} из ${n}`,
    tips: "Советы: 1) Enter — проверить, → — следующая. 2) Клик по карточке также проверяет/листает. 3) По умолчанию акценты не обязательны (caffe засчитывается как caffè)."
  },
  de: {
    title: "Italienische Karten — 300 Wörter",
    subtitle: "Gib die italienische Übersetzung ein und klicke auf die Karte. Enter — prüfen, erneuter Klick — nächste.",
    langLabel: "Sprache:",
    themeLabel: "Thema:",
    scoreLabel: "Punkte: ",
    attemptsLabel: "Versuche: ",
    accuracyLabel: "Genauigkeit: ",
    sourceLabel: "Deutsches Wort",
    clickHintUnchecked: "Klicke, um zu prüfen.",
    clickHintChecked: "Klicke, um weiterzugehen.",
    correct: "Richtig! ✅",
    correctAnswerLabel: "Richtige Antwort: ",
    alsoAcceptedPrefix: " (auch akzeptiert: ",
    alsoAcceptedSuffix: ")",
    inputLabel: "Gib die italienische Übersetzung ein",
    placeholder: "z. B.: ciao",
    btnCheck: "Prüfen (Enter)",
    btnNext: "Weiter (→)",
    btnSkip: "Überspringen",
    btnReveal: "Antwort zeigen",
    btnReshuffle: "Neu mischen",
    btnReset: "Punkte/Versuche/Genauigkeit zurücksetzen und neu starten",
    strictLabel: "Strenge Akzentprüfung (è ≠ e)",
    counter: (i, n) => `Karte ${i} von ${n}`,
    tips: "Tipps: 1) Enter — prüfen, → — nächste. 2) Klick auf die Karte prüft/blättert. 3) Standardmäßig sind Akzente optional (caffe zählt als caffè)."
  },
  fr: {
    title: "Cartes italiennes — 300 mots",
    subtitle: "Tapez la traduction italienne et cliquez sur la carte. Entrée — vérifier, cliquer encore — suivant.",
    langLabel: "Langue :",
    themeLabel: "Thème :",
    scoreLabel: "Score : ",
    attemptsLabel: "Essais : ",
    accuracyLabel: "Précision : ",
    sourceLabel: "Mot français",
    clickHintUnchecked: "Cliquez pour vérifier.",
    clickHintChecked: "Cliquez pour continuer.",
    correct: "Correct ! ✅",
    correctAnswerLabel: "Bonne réponse : ",
    alsoAcceptedPrefix: " (aussi accepté : ",
    alsoAcceptedSuffix: ")",
    inputLabel: "Entrez la traduction italienne",
    placeholder: "par ex. : ciao",
    btnCheck: "Vérifier (Entrée)",
    btnNext: "Suivant (→)",
    btnSkip: "Passer",
    btnReveal: "Révéler",
    btnReshuffle: "Mélanger",
    btnReset: "Réinitialiser score/essais/précision et recommencer",
    strictLabel: "Vérification stricte des accents (è ≠ e)",
    counter: (i, n) => `Carte ${i} sur ${n}`,
    tips: "Astuces : 1) Entrée — vérifier, → — suivant. 2) Cliquer sur la carte vérifie/avance. 3) Par défaut, les accents sont optionnels (caffe compte comme caffè)."
  }
};

function App() {
  const [lang, setLang] = React.useState("en");
  const t = I18N[lang] || I18N.en;
  const DATA = React.useMemo(() => {
    if (lang === "en" && DS_EN) return DS_EN;
    if (lang === "de" && DS_DE) return DS_DE;
    if (lang === "ru" && DS_RU) return DS_RU;
    if (lang === "fr" && DS_FR) return DS_FR;
    // fallback order: EN -> DE -> RU -> FR (whichever exists)
    return DS_EN || DS_DE || DS_RU || DS_FR;
  }, [lang]);
  const WORDS_LOCAL = DATA.WORDS;
  const THEMES_LOCAL = React.useMemo(() => {
    if (Array.isArray(DATA.THEMES)) return DATA.THEMES;
    // Stable fallback theme when dataset doesn't provide THEMES (e.g., FR)
    const name = (lang === "ru" ? "Все слова" : (lang === "de" ? "Alle Wörter" : (lang === "fr" ? "Tous les mots" : "All words")));
    return [{ key: "all", name, start: 0, count: WORDS_LOCAL.length }];
  }, [DATA.THEMES, lang, WORDS_LOCAL.length]);
  React.useEffect(() => { if (typeof document !== "undefined") { document.title = t.title; document.documentElement.lang = lang; } }, [lang, t.title]);
  const [themeKey, setThemeKey] = React.useState("all");
  React.useEffect(() => { setThemeKey("all"); }, [lang]);
  const poolIndices = React.useMemo(() => {
    const th = THEMES_LOCAL.find((x) => x.key === themeKey) || THEMES_LOCAL[0];
    if (th.key === "all") return [...Array(WORDS_LOCAL.length).keys()];
    const arr = [];
    for (let i = th.start; i < th.start + th.count; i++) arr.push(i);
    return arr;
  }, [themeKey, THEMES_LOCAL, WORDS_LOCAL]);

  const [order, setOrder] = React.useState(() => shuffle(poolIndices));
  const [idx, setIdx] = React.useState(0);
  const [input, setInput] = React.useState("");
  const [checked, setChecked] = React.useState(false);
  const [isCorrect, setIsCorrect] = React.useState(false);
  const [points, setPoints] = React.useState(0);
  const [attempts, setAttempts] = React.useState(0);
  const [strictAccents, setStrictAccents] = React.useState(false);

  const current = React.useMemo(() => WORDS_LOCAL[order[idx]], [order, idx, WORDS_LOCAL]);
  const inputRef = React.useRef(null);

  React.useEffect(() => { inputRef.current?.focus(); }, [idx]);

  // Reset deck and stats when theme changes
  React.useEffect(() => {
    setOrder(shuffle(poolIndices));
    setIdx(0);
    setInput("");
    setChecked(false);
    setIsCorrect(false);
    setPoints(0);
    setAttempts(0);
    inputRef.current?.focus();
  }, [poolIndices]);

  const sourceWord = (current && (current[lang] || current.en || current.de || current.ru || current.fr)) || "";
  const acceptedAnswers = React.useMemo(() => {
    const raw = current.it.flatMap((ans) => String(ans).split(/[\/|,]/).map((s) => s.trim()).filter(Boolean));
    return Array.from(new Set(raw));
  }, [current]);

  function checkAnswer() {
    if (checked) return;
    const user = strictAccents ? normalize(input) : normalize(stripDiacritics(input));
    const ok = acceptedAnswers.some((ans) => {
      const normTarget = strictAccents ? normalize(ans) : normalize(stripDiacritics(ans));
      return user === normTarget;
    });
    setIsCorrect(ok); setChecked(true); setAttempts((a) => a + 1); if (ok) setPoints((p) => p + 1);
  }

  function nextCard() {
    const next = idx + 1;
    if (next >= order.length) { setOrder(shuffle(poolIndices)); setIdx(0); }
    else { setIdx(next); }
    setInput(""); setChecked(false); setIsCorrect(false); inputRef.current?.focus();
  }

  const skipCard = () => { setAttempts((a) => a + 1); nextCard(); };
  const reveal = () => { setInput(acceptedAnswers[0] || ""); setChecked(true); setIsCorrect(false); setAttempts((a) => a + 1); };
  const reshuffle = () => { setOrder(shuffle(poolIndices)); setIdx(0); setInput(""); setChecked(false); setIsCorrect(false); setPoints(0); setAttempts(0); };
  const resetStats = () => { setIdx(0); setInput(""); setChecked(false); setIsCorrect(false); setPoints(0); setAttempts(0); inputRef.current?.focus(); };

  function onCardClick() {
    if (!checked) { if (!input.trim()) return inputRef.current?.focus(); checkAnswer(); }
    else nextCard();
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") { !checked ? checkAnswer() : nextCard(); }
    if (e.key === "Escape") setInput("");
    if (e.key === "ArrowRight") nextCard();
  }

  const accuracy = attempts ? Math.round((points / attempts) * 100) : 0;

  return (
    React.createElement("div", { className: "min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center py-8 px-4" },
      React.createElement("div", { className: "w-full max-w-3xl" },
        React.createElement("header", { className: "mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between" },
          React.createElement("div", null,
            React.createElement("h1", { className: "text-2xl sm:text-3xl font-bold tracking-tight" }, t.title),
            React.createElement("p", { className: "text-sm text-slate-600" }, t.subtitle),
            React.createElement("div", { className: "mt-2 flex flex-wrap items-center gap-3" },
              React.createElement("label", { className: "text-xs text-slate-600" }, t.langLabel),
              React.createElement(
                "select",
                {
                  value: lang,
                  onChange: (e) => setLang(e.target.value),
                  className: "text-sm rounded-lg border border-slate-300 px-2 py-1 bg-white"
                },
                [
                  React.createElement("option", { key: "en", value: "en" }, "EN → IT"),
                  DS_DE && React.createElement("option", { key: "de", value: "de" }, "DE → IT"),
                  DS_RU && React.createElement("option", { key: "ru", value: "ru" }, "RU → IT"),
                  DS_FR && React.createElement("option", { key: "fr", value: "fr" }, "FR → IT")
                ].filter(Boolean)
              ),
              React.createElement("label", { className: "text-xs text-slate-600" }, t.themeLabel),
              React.createElement(
                "select",
                {
                  value: themeKey,
                  onChange: (e) => setThemeKey(e.target.value),
                  className: "text-sm rounded-lg border border-slate-300 px-2 py-1 bg-white"
                },
                THEMES_LOCAL.map((th) => React.createElement("option", { key: th.key, value: th.key }, th.name))
              )
            )
          ),
          React.createElement("div", { className: "flex gap-3 text-sm" },
            React.createElement("div", { className: "bg-white rounded-xl shadow px-3 py-2" }, t.scoreLabel, React.createElement("b", null, points)),
            React.createElement("div", { className: "bg-white rounded-xl shadow px-3 py-2" }, t.attemptsLabel, React.createElement("b", null, attempts)),
            React.createElement("div", { className: "bg-white rounded-xl shadow px-3 py-2" }, t.accuracyLabel, React.createElement("b", null, accuracy), "%")
          )
        ),
        React.createElement("main", { className: "flex flex-col gap-4" },
          React.createElement("div", {
            className: `select-none cursor-pointer rounded-3xl p-8 shadow-lg transition border ${
              checked ? (isCorrect ? "bg-green-50 border-green-300" : "bg-rose-50 border-rose-300")
                      : "bg-white border-slate-200 hover:shadow-xl"
            }`,
            onClick: onCardClick, role: "button", tabIndex: 0, onKeyDown: (e) => e.key === "Enter" && onCardClick()
          },
            React.createElement("div", { className: "text-slate-500 text-xs uppercase tracking-widest mb-2" }, t.sourceLabel),
            React.createElement("div", { className: "text-3xl sm:text-4xl font-semibold" }, sourceWord),
            React.createElement("div", { className: "mt-4 text-slate-500 text-sm" }, checked ? t.clickHintChecked : t.clickHintUnchecked),
            checked && React.createElement("div", { className: "mt-4" },
              isCorrect
                ? React.createElement("div", { className: "text-green-700 font-medium" }, t.correct)
                : React.createElement("div", { className: "text-rose-700 font-medium" },
                    t.correctAnswerLabel, React.createElement("span", { className: "underline" }, acceptedAnswers[0]),
                    acceptedAnswers.length > 1 &&
                      React.createElement("span", { className: "text-slate-500" }, `${t.alsoAcceptedPrefix}${acceptedAnswers.slice(1).join(", ")}${t.alsoAcceptedSuffix}`)
                  )
            )
          ),
          React.createElement("div", { className: "bg-white rounded-3xl p-5 shadow border border-slate-200" },
            React.createElement("label", { className: "block text-sm text-slate-600 mb-2" }, t.inputLabel),
            React.createElement("input", {
              ref: inputRef, value: input, onChange: (e) => setInput(e.target.value), onKeyDown: handleKeyDown,
              placeholder: t.placeholder,
              className: "w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 text-lg",
              autoComplete: "off"
            }),
            React.createElement("div", { className: "mt-3 flex flex-wrap gap-2" },
              React.createElement("button", { onClick: checkAnswer, className: "px-4 py-2 rounded-xl bg-sky-600 text-white hover:bg-sky-700 active:translate-y-px" }, t.btnCheck),
              React.createElement("button", { onClick: nextCard, className: "px-4 py-2 rounded-xl bg-slate-800 text-white hover:bg-slate-900 active:translate-y-px" }, t.btnNext),
              React.createElement("button", { onClick: skipCard, className: "px-4 py-2 rounded-xl bg-amber-500 text-white hover:bg-amber-600 active:translate-y-px" }, t.btnSkip),
              React.createElement("button", { onClick: reveal, className: "px-4 py-2 rounded-xl bg-rose-500 text-white hover:bg-rose-600 active:translate-y-px" }, t.btnReveal),
              React.createElement("button", { onClick: reshuffle, className: "px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 active:translate-y-px" }, t.btnReshuffle),
              React.createElement("button", { onClick: resetStats, className: "px-4 py-2 rounded-xl bg-slate-200 text-slate-800 hover:bg-slate-300 active:translate-y-px" }, t.btnReset)
            ),
            React.createElement("div", { className: "mt-4 flex items-center gap-2 text-sm" },
              React.createElement("input", { id: "strict", type: "checkbox", checked: strictAccents, onChange: (e) => setStrictAccents(e.target.checked), className: "h-4 w-4" }),
              React.createElement("label", { htmlFor: "strict", className: "select-none cursor-pointer" }, t.strictLabel)
            )
          ),
          React.createElement("div", { className: "text-center text-sm text-slate-600" }, t.counter(idx + 1, order.length))
        ),
        React.createElement("footer", { className: "mt-8 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2" },
          React.createElement("div", null, t.tips),
          React.createElement("div", null, React.createElement("a", { href: "impressum-datenschutz.html", className: "underline hover:no-underline text-slate-600" }, "Impressum"))
        )
      )
    )
  );
}

if (typeof document !== "undefined" && typeof ReactDOM !== "undefined") {
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(React.createElement(App));
}

// Export pure utilities and data for Node.js tests
if (typeof module !== "undefined" && module.exports) {
  module.exports = { WORDS, THEMES, stripDiacritics, normalize, shuffle };
}
