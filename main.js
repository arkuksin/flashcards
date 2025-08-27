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

// Lightweight POS detection based on Italian answers
function detectPosItalian(answers) {
  try {
    const irregularVerbs = new Set([
      "essere","avere","stare","andare","venire","fare","dire","dare",
      "potere","volere","dovere","sapere","uscire","rimanere","tenere","bere","piacere"
    ]);
    const knownAdjectives = new Set([
      // colors and common adjectives present in datasets
      "bianco","nero","rosso","blu","azzurro","verde","giallo","arancione","rosa","viola","marrone","grigio",
      "beige","scuro","chiaro","celeste","cremisi","turchese",
      "caro","economico","caldo","freddo"
    ]);
    const tokens = answers
      .flatMap((ans) => String(ans || "").split(/[\/,|]/).map((s) => s.trim()).filter(Boolean))
      .flatMap((ans) => ans.split(/\s+/).map((s) => normalize(stripDiacritics(s))))
      .filter(Boolean);

    // Verb: any token looks like an infinitive or is irregular
    if (tokens.some((t) => /(are|ere|ire)$/.test(t) || irregularVerbs.has(t))) return "verb";

    // Adjective: token in known set
    if (tokens.some((t) => knownAdjectives.has(t))) return "adj";

    // If any answer contains spaces (phrases), do not force as noun
    const hasPhrase = answers.some((a) => /\s/.test(String(a || "")));
    if (hasPhrase) return null;

    // Default to noun for single-token non-verb non-adjective entries
    return "noun";
  } catch (e) {
    return null;
  }
}

function classifyEntry(entry) {
  if (!entry || !Array.isArray(entry.it)) return null;
  return detectPosItalian(entry.it);
}

// ==== I18N strings for EN, RU, DE, FR UI ====
const I18N = {
  en: {
    title: "Italian Flashcards — 300 Words",
    subtitle: "Type the Italian translation and click the card. Enter — check, click again — next.",
    langLabel: "Language:",
    themeLabel: "Theme:",
    posLabel: "Part of speech:",
    posAll: "All",
    posNouns: "Nouns",
    posVerbs: "Verbs",
    posAdjectives: "Adjectives",
    scoreLabel: "Score: ",
    attemptsLabel: "Attempts: ",
    accuracyLabel: "Accuracy: ",
    streakLabel: "Streak: ",
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
    posLabel: "Часть речи:",
    posAll: "Все",
    posNouns: "Существительные",
    posVerbs: "Глаголы",
    posAdjectives: "Прилагательные",
    scoreLabel: "Очки: ",
    attemptsLabel: "Попытки: ",
    accuracyLabel: "Точность: ",
    streakLabel: "Серия: ",
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
    posLabel: "Wortart:",
    posAll: "Alle",
    posNouns: "Substantive",
    posVerbs: "Verben",
    posAdjectives: "Adjektive",
    scoreLabel: "Punkte: ",
    attemptsLabel: "Versuche: ",
    accuracyLabel: "Genauigkeit: ",
    streakLabel: "Serie: ",
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
    posLabel: "Catégorie :",
    posAll: "Tous",
    posNouns: "Noms",
    posVerbs: "Verbes",
    posAdjectives: "Adjectifs",
    scoreLabel: "Score : ",
    attemptsLabel: "Essais : ",
    accuracyLabel: "Précision : ",
    streakLabel: "Série : ",
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

const FLAG_ICONS = {
  en: { src: "https://twemoji.maxcdn.com/v/latest/svg/1f1ec-1f1e7.svg", label: "English" },
  de: { src: "https://twemoji.maxcdn.com/v/latest/svg/1f1e9-1f1ea.svg", label: "Deutsch" },
  ru: { src: "https://twemoji.maxcdn.com/v/latest/svg/1f1f7-1f1fa.svg", label: "Русский" },
  fr: { src: "https://twemoji.maxcdn.com/v/latest/svg/1f1eb-1f1f7.svg", label: "Français" }
};

function App() {
  const detectInitialLang = () => {
    try {
      const saved = (typeof window !== "undefined" && window.localStorage) ? window.localStorage.getItem("lang") : null;
      if (saved && ["en","de","ru","fr"].includes(saved)) {
        if (saved === "de" && !DS_DE) return "en";
        if (saved === "ru" && !DS_RU) return "en";
        if (saved === "fr" && !DS_FR) return "en";
        return saved;
      }
      const nav = (typeof navigator !== "undefined" && navigator.language) ? navigator.language.slice(0,2).toLowerCase() : "";
      if (["en","de","ru","fr"].includes(nav)) {
        if (nav === "de" && !DS_DE) return "en";
        if (nav === "ru" && !DS_RU) return "en";
        if (nav === "fr" && !DS_FR) return "en";
        return nav;
      }
    } catch (e) {}
    return "en";
  };
  const [lang, setLang] = React.useState(detectInitialLang);
  const t = I18N[lang] || I18N.en;
  React.useEffect(() => { try { if (typeof window !== "undefined" && window.localStorage) { window.localStorage.setItem("lang", lang); } } catch(e) {} }, [lang]);
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
  const [posFilter, setPosFilter] = React.useState("all"); // all | nouns | verbs | adjectives
  React.useEffect(() => { setThemeKey("all"); }, [lang]);
  const poolIndices = React.useMemo(() => {
    const th = THEMES_LOCAL.find((x) => x.key === themeKey) || THEMES_LOCAL[0];
    const base = (th.key === "all") ? [...Array(WORDS_LOCAL.length).keys()] : (() => {
      const arr = []; for (let i = th.start; i < th.start + th.count; i++) arr.push(i); return arr;
    })();
    // Apply POS filter
    const mapPos = { nouns: "noun", verbs: "verb", adjectives: "adj" };
    if (posFilter === "all") return base;
    const filtered = base.filter((i) => classifyEntry(WORDS_LOCAL[i]) === mapPos[posFilter]);
    return filtered.length > 0 ? filtered : base; // fallback if empty
  }, [themeKey, THEMES_LOCAL, WORDS_LOCAL, posFilter]);

  const [order, setOrder] = React.useState(() => shuffle(poolIndices));
  const [idx, setIdx] = React.useState(0);
  const [input, setInput] = React.useState("");
  const [checked, setChecked] = React.useState(false);
  const [isCorrect, setIsCorrect] = React.useState(false);
  const [points, setPoints] = React.useState(0);
  const [attempts, setAttempts] = React.useState(0);
  const [strictAccents, setStrictAccents] = React.useState(false);

  // Diff state for wrong answers (structured, rendered near input)
  const [diffResult, setDiffResult] = React.useState(null);

  // Localized texts for diff highlight area (visible labels and count), based on current language
  const DIFF_I18N = React.useMemo(() => {
    const map = {
      en: {
        yourAnswer: "Your answer",
        correctAnswer: "Correct answer",
        lettersWrong: (n) => `${n} ${n === 1 ? "letter was wrong" : "letters were wrong"}`
      },
      de: {
        yourAnswer: "Deine Antwort",
        correctAnswer: "Richtige Antwort",
        lettersWrong: (n) => `${n} ${n === 1 ? "Buchstabe war falsch" : "Buchstaben waren falsch"}`
      },
      ru: {
        yourAnswer: "Ваш ответ",
        correctAnswer: "Правильный ответ",
        lettersWrong: (n) => {
          const mod10 = n % 10;
          const mod100 = n % 100;
          if (mod10 === 1 && mod100 !== 11) return `${n} буква была неверной`;
          if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} буквы были неверны`;
          return `${n} букв были неверны`;
        }
      },
      fr: {
        yourAnswer: "Votre réponse",
        correctAnswer: "Bonne réponse",
        lettersWrong: (n) => `${n} ${n === 1 ? "lettre était incorrecte" : "lettres étaient incorrectes"}`
      }
    };
    return map[lang] || map.en;
  }, [lang]);

  // Compute best diff against accepted answers (fewest errors)
  const computeBestDiff = React.useCallback((rawInput, answers, opts) => {
    try {
      const cmp = (window && window.WordDiff && typeof window.WordDiff.compareWords === 'function')
        ? window.WordDiff.compareWords
        : null;
      if (!cmp || !Array.isArray(answers) || answers.length === 0) return null;
      let best = null;
      for (const ans of answers) {
        const d = cmp(rawInput, String(ans || ''), opts);
        if (!best || d.summary.totalErrors < best.summary.totalErrors) best = d;
      }
      return best;
    } catch (e) {
      return null;
    }
  }, []);

  // Streak state with persistence (localStorage → sessionStorage → memory)
  const loadStreak = () => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const v = window.localStorage.getItem("streak");
        if (v !== null) return Math.max(0, parseInt(v, 10) || 0);
      }
    } catch (e) {}
    try {
      if (typeof window !== "undefined" && window.sessionStorage) {
        const v = window.sessionStorage.getItem("streak");
        if (v !== null) return Math.max(0, parseInt(v, 10) || 0);
      }
    } catch (e) {}
    return 0;
  };
  const [streak, setStreak] = React.useState(loadStreak);
  const lastCelebratedRef = React.useRef(0);
  const celebrateTimeoutRef = React.useRef(null);
  const [celebrateMsg, setCelebrateMsg] = React.useState("");
  const [showCelebrate, setShowCelebrate] = React.useState(false);

  const persistStreak = React.useCallback((val) => {
    const s = String(Math.max(0, val|0));
    try { if (typeof window !== "undefined" && window.localStorage) window.localStorage.setItem("streak", s); } catch(e) {}
    try { if (typeof window !== "undefined" && window.sessionStorage) window.sessionStorage.setItem("streak", s); } catch(e) {}
  }, []);

  React.useEffect(() => { persistStreak(streak); }, [streak, persistStreak]);

  function triggerCelebration(n) {
    if (!n || n % 10 !== 0) return;
    if (lastCelebratedRef.current === n) return; // guard against double trigger
    lastCelebratedRef.current = n;
    setCelebrateMsg(`Congrats! ${n} correct in a row!`);
    setShowCelebrate(true);
    if (celebrateTimeoutRef.current) { clearTimeout(celebrateTimeoutRef.current); }
    celebrateTimeoutRef.current = setTimeout(() => {
      setShowCelebrate(false);
    }, 2500);
  }

  React.useEffect(() => {
    return () => {
      if (celebrateTimeoutRef.current) { clearTimeout(celebrateTimeoutRef.current); }
    };
  }, []);

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
    setIsCorrect(ok);
    setChecked(true);
    setAttempts((a) => a + 1);
    if (ok) {
      setPoints((p) => p + 1);
      setDiffResult(null);
      setStreak((s) => {
        const next = s + 1;
        triggerCelebration(next);
        return next;
      });
    } else {
      // Compute best diff against first accepted answer(s)
      const best = computeBestDiff(input, acceptedAnswers, { caseInsensitive: true, ignoreDiacritics: !strictAccents });
      setDiffResult(best);
      setStreak(0);
      lastCelebratedRef.current = 0; // allow future celebrations at 10,20,... after a reset
    }
  }

  function nextCard() {
    const next = idx + 1;
    if (next >= order.length) { setOrder(shuffle(poolIndices)); setIdx(0); }
    else { setIdx(next); }
    setInput(""); setChecked(false); setIsCorrect(false); setDiffResult(null); inputRef.current?.focus();
  }

  const skipCard = () => { setAttempts((a) => a + 1); setDiffResult(null); nextCard(); };
  const reveal = () => { setInput(acceptedAnswers[0] || ""); setChecked(true); setIsCorrect(false); setAttempts((a) => a + 1); setStreak(0); lastCelebratedRef.current = 0; setDiffResult(null); };
  const reshuffle = () => { setOrder(shuffle(poolIndices)); setIdx(0); setInput(""); setChecked(false); setIsCorrect(false); setPoints(0); setAttempts(0); setDiffResult(null); };
  const resetStats = () => { setIdx(0); setInput(""); setChecked(false); setIsCorrect(false); setPoints(0); setAttempts(0); setDiffResult(null); inputRef.current?.focus(); };

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
        React.createElement("header", { className: "mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between", "data-testid": "header" },
          React.createElement("div", null,
            React.createElement("h1", { className: "text-2xl sm:text-3xl font-bold tracking-tight" }, t.title),
            React.createElement("p", { className: "text-sm text-slate-600" }, t.subtitle),
            React.createElement("div", { className: "mt-2 flex flex-wrap items-center gap-3" },
              React.createElement("label", { className: "text-xs text-slate-600" }, t.langLabel),
              // Flag buttons (extra option)
              React.createElement(
                "div",
                { className: "flex items-center gap-1", "data-testid": "lang-flags" },
                [
                  { code: "en", available: !!DS_EN },
                  { code: "de", available: !!DS_DE },
                  { code: "ru", available: !!DS_RU },
                  { code: "fr", available: !!DS_FR }
                ]
                  .filter((x) => x.available)
                  .map((opt) => React.createElement(
                    "button",
                    {
                      key: opt.code,
                      type: "button",
                      onClick: () => setLang(opt.code),
                      className: `px-1.5 py-1 rounded-full border ${lang === opt.code ? "border-sky-500 bg-sky-50" : "border-slate-300 bg-white hover:bg-slate-50"}`,
                      title: `${FLAG_ICONS[opt.code].label} → IT`,
                      "aria-label": `${FLAG_ICONS[opt.code].label} → IT`,
                      "aria-pressed": lang === opt.code,
                      "data-testid": `flag-${opt.code}`
                    },
                    React.createElement("img", {
                      src: FLAG_ICONS[opt.code].src,
                      alt: `${FLAG_ICONS[opt.code].label} flag`,
                      className: "h-4 w-6 object-cover rounded-sm pointer-events-none",
                      loading: "lazy",
                      decoding: "async"
                    })
                  ))
              ),
              // Fallback select (accessible)
              React.createElement(
                "select",
                {
                  value: lang,
                  onChange: (e) => setLang(e.target.value),
                  className: "text-sm rounded-lg border border-slate-300 px-2 py-1 bg-white",
                  "data-testid": "lang-select"
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
                  className: "text-sm rounded-lg border border-slate-300 px-2 py-1 bg-white",
                  "data-testid": "theme-select"
                },
                THEMES_LOCAL.map((th) => React.createElement("option", { key: th.key, value: th.key }, th.name))
              ),
              React.createElement("label", { className: "text-xs text-slate-600" }, t.posLabel),
              React.createElement(
                "select",
                {
                  value: posFilter,
                  onChange: (e) => setPosFilter(e.target.value),
                  className: "text-sm rounded-lg border border-slate-300 px-2 py-1 bg-white",
                  "data-testid": "pos-select"
                },
                [
                  React.createElement("option", { key: "all", value: "all" }, t.posAll),
                  React.createElement("option", { key: "nouns", value: "nouns" }, t.posNouns),
                  React.createElement("option", { key: "verbs", value: "verbs" }, t.posVerbs),
                  React.createElement("option", { key: "adjectives", value: "adjectives" }, t.posAdjectives)
                ]
              )
            )
          ),
          React.createElement("div", { className: "flex gap-3 text-sm" },
            React.createElement("div", { className: "bg-white rounded-xl shadow px-3 py-2", "data-testid": "score", "data-value": String(points) }, t.scoreLabel, React.createElement("b", null, points)),
            React.createElement("div", { className: "bg-white rounded-xl shadow px-3 py-2", "data-testid": "attempts", "data-value": String(attempts) }, t.attemptsLabel, React.createElement("b", null, attempts)),
            React.createElement("div", { className: "bg-white rounded-xl shadow px-3 py-2", "data-testid": "accuracy", "data-value": String(accuracy) }, t.accuracyLabel, React.createElement("b", null, accuracy), "%"),
            React.createElement("div", { className: "bg-white rounded-xl shadow px-3 py-2", "data-testid": "streak", "data-value": String(streak), role: "status", "aria-live": "polite" }, t.streakLabel, React.createElement("b", null, streak))
          )
        ),
        // Celebration toast (non-blocking)
        React.createElement("div", { className: "fixed top-4 left-0 right-0 flex justify-center pointer-events-none z-50" },
          showCelebrate && React.createElement(
            "div",
            { className: "pointer-events-none bg-white border border-sky-300 rounded-2xl shadow-lg px-4 py-3 text-sky-900 flex items-center gap-2",
              role: "status", "aria-live": "polite", "aria-atomic": "true", "data-testid": "celebration" },
            React.createElement("span", { className: "text-2xl animate-bounce", "aria-hidden": "true" }, "🎉"),
            React.createElement("span", null, celebrateMsg),
            React.createElement("span", { className: "text-2xl animate-bounce", "aria-hidden": "true" }, "🎉")
          )
        ),
        React.createElement("main", { className: "flex flex-col gap-4" },
          React.createElement("div", {
            className: `select-none cursor-pointer rounded-3xl p-8 shadow-lg transition border ${
              checked ? (isCorrect ? "bg-green-50 border-green-300" : "bg-rose-50 border-rose-300")
                      : "bg-white border-slate-200 hover:shadow-xl"
            }`,
            onClick: onCardClick, role: "button", tabIndex: 0, onKeyDown: (e) => e.key === "Enter" && onCardClick(),
            "data-testid": "card",
            "data-checked": checked ? "true" : "false",
            "data-correct": checked ? (isCorrect ? "true" : "false") : "false"
          },
            React.createElement("div", { className: "text-slate-500 text-xs uppercase tracking-widest mb-2" }, t.sourceLabel),
            React.createElement("div", { className: "text-3xl sm:text-4xl font-semibold", "data-testid": "source-word" }, sourceWord),
            React.createElement("div", { className: "mt-4 text-slate-500 text-sm" }, checked ? t.clickHintChecked : t.clickHintUnchecked),
            checked && React.createElement("div", { className: "mt-4", "data-testid": "feedback", "data-correct": isCorrect ? "true" : "false" },
              isCorrect
                ? React.createElement("div", { className: "text-green-700 font-medium" }, t.correct)
                : React.createElement("div", { className: "text-rose-700 font-medium" },
                    t.correctAnswerLabel, React.createElement("span", { className: "underline", "data-testid": "correct-answer" }, acceptedAnswers[0]),
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
              autoComplete: "off",
              "data-testid": "answer-input"
            }),
            React.createElement("div", { className: "mt-3 flex flex-wrap gap-2" },
              React.createElement("button", { onClick: checkAnswer, className: "px-4 py-2 rounded-xl bg-sky-600 text-white hover:bg-sky-700 active:translate-y-px", "data-testid": "btn-check" }, t.btnCheck),
              React.createElement("button", { onClick: nextCard, className: "px-4 py-2 rounded-xl bg-slate-800 text-white hover:bg-slate-900 active:translate-y-px", "data-testid": "btn-next" }, t.btnNext),
              React.createElement("button", { onClick: skipCard, className: "px-4 py-2 rounded-xl bg-amber-500 text-white hover:bg-amber-600 active:translate-y-px", "data-testid": "btn-skip" }, t.btnSkip),
              React.createElement("button", { onClick: reveal, className: "px-4 py-2 rounded-xl bg-rose-500 text-white hover:bg-rose-600 active:translate-y-px", "data-testid": "btn-reveal" }, t.btnReveal),
              React.createElement("button", { onClick: reshuffle, className: "px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 active:translate-y-px", "data-testid": "btn-reshuffle" }, t.btnReshuffle),
              React.createElement("button", { onClick: resetStats, className: "px-4 py-2 rounded-xl bg-slate-200 text-slate-800 hover:bg-slate-300 active:translate-y-px", "data-testid": "btn-reset" }, t.btnReset)
            ),
            (checked && !isCorrect && diffResult) ? React.createElement("div", { className: "mt-4", "data-testid": "diff-feedback", role: "status", "aria-live": "polite", "data-errors": String(diffResult.summary.totalErrors) },
              React.createElement("div", { className: "text-slate-700 text-sm mb-2" }, DIFF_I18N.lettersWrong(diffResult.summary.totalErrors)),
              React.createElement("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-3" },
                React.createElement("div", { className: "text-xs text-slate-500 mb-1" }, DIFF_I18N.yourAnswer),
                React.createElement("div", { className: "font-mono text-base flex flex-wrap gap-1" },
                  diffResult.ops.map((op) => {
                    const pos = (op.col || 0) + 1;
                    if (op.type === 'equal') {
                      return React.createElement("span", { key: `u-${pos}`, className: "text-green-700 transition-colors", "data-op": op.type, "data-pos": String(pos), "aria-label": `Position ${pos}: correct '${op.a}'` }, op.a);
                    }
                    if (op.type === 'replace') {
                      return React.createElement("span", { key: `u-${pos}`, className: "text-rose-800 underline decoration-rose-500 decoration-2 rounded px-0.5 transition-colors", "data-op": op.type, "data-pos": String(pos), "aria-label": `Position ${pos}: expected '${op.b}', got '${op.a}'` }, op.a);
                    }
                    if (op.type === 'delete') {
                      return React.createElement("span", { key: `u-${pos}`, className: "text-rose-800 line-through decoration-rose-500 decoration-2 rounded px-0.5 transition-colors", "data-op": op.type, "data-pos": String(pos), "aria-label": `Position ${pos}: extra '${op.a}'` }, op.a);
                    }
                    // insert (missing in user)
                    return React.createElement("span", { key: `u-${pos}`, className: "text-slate-500 bg-slate-200/70 rounded px-1 transition-colors", "data-op": op.type, "data-pos": String(pos), "aria-label": `Position ${pos}: missing '${op.b}'` }, "▯");
                  })
                ),
                React.createElement("div", { className: "text-xs text-slate-500 mt-3 mb-1" }, "Correct answer"),
                React.createElement("div", { className: "font-mono text-base flex flex-wrap gap-1" },
                  diffResult.ops.map((op) => {
                    const pos = (op.col || 0) + 1;
                    if (op.type === 'equal') {
                      return React.createElement("span", { key: `c-${pos}`, className: "text-slate-900 transition-colors", "data-op": op.type, "data-pos": String(pos), "aria-label": `Position ${pos}: '${op.b}'` }, op.b);
                    }
                    if (op.type === 'replace') {
                      return React.createElement("span", { key: `c-${pos}`, className: "bg-emerald-50 text-emerald-800 rounded px-1 shadow-sm transition-colors", "data-op": op.type, "data-pos": String(pos), "aria-label": `Position ${pos}: should be '${op.b}' not '${op.a}'` }, op.b);
                    }
                    if (op.type === 'insert') {
                      return React.createElement("span", { key: `c-${pos}`, className: "bg-emerald-50 text-emerald-800 rounded px-1 shadow-sm transition-colors", "data-op": op.type, "data-pos": String(pos), "aria-label": `Position ${pos}: missing '${op.b}'` }, op.b);
                    }
                    // delete (extra in user) -> placeholder to keep alignment
                    return React.createElement("span", { key: `c-${pos}`, className: "opacity-0 select-none", "data-op": op.type, "data-pos": String(pos), "aria-hidden": "true" }, ".");
                  })
                )
              )
            ) : null,
            React.createElement("div", { className: "mt-4 flex items-center gap-2 text-sm" },
              React.createElement("input", { id: "strict", type: "checkbox", checked: strictAccents, onChange: (e) => setStrictAccents(e.target.checked), className: "h-4 w-4", "data-testid": "strict-toggle" }),
              React.createElement("label", { htmlFor: "strict", className: "select-none cursor-pointer" }, t.strictLabel)
            )
          ),
          React.createElement("div", { className: "text-center text-sm text-slate-600", "data-testid": "counter", "data-index": String(idx + 1), "data-total": String(order.length) }, t.counter(idx + 1, order.length))
        ),
        React.createElement("footer", { className: "mt-8 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2" },
          React.createElement("div", null, t.tips),
          React.createElement("div", null, React.createElement("a", { href: "impressum-datenschutz.html", className: "underline hover:no-underline text-slate-600" }, "Impressum"))
        )
      )
    )
  );
}

// Try to optionally load Vercel Analytics React component when a module resolver is available (e.g., Node/testing environments)
let AnalyticsComponent = null;
try {
  if (typeof require === "function") {
    const va = require("@vercel/analytics/react");
    if (va && (va.Analytics || va.default)) {
      AnalyticsComponent = va.Analytics || va.default;
    }
  }
} catch (e) {
  // Ignore if the package is not installed; index.html already includes web analytics script for browser
}

if (typeof document !== "undefined" && typeof ReactDOM !== "undefined") {
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(
    React.createElement(
      React.Fragment,
      null,
      React.createElement(App),
      AnalyticsComponent ? React.createElement(AnalyticsComponent) : null
    )
  );
}

// Export pure utilities and data for Node.js tests
if (typeof module !== "undefined" && module.exports) {
  module.exports = { WORDS, THEMES, stripDiacritics, normalize, shuffle };
}
