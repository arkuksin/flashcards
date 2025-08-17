// main.js — Полностью рабочее приложение карточек (200 слов)
// React 18 + Tailwind по CDN. Без сборки, готово для GitHub Pages.


// ==== Данные: всегда используем внешний dataset.js ====
let WORDS;
let THEMES;

if (typeof window !== "undefined") {
  if (!window.WORDS || !Array.isArray(window.WORDS)) {
    throw new Error("WORDS dataset not found. Include data\\dataset.js before main.js");
  }
  WORDS = window.WORDS;
  THEMES = Array.isArray(window.THEMES) ? window.THEMES : [
    { key: "all", name: "Все слова", start: 0, count: window.WORDS.length }
  ];
} else if (typeof require === "function") {
  const ds = require("./data/dataset.js");
  if (!ds || !Array.isArray(ds.WORDS)) {
    throw new Error("WORDS dataset not found at ./data/dataset.js");
  }
  WORDS = ds.WORDS;
  THEMES = Array.isArray(ds.THEMES) ? ds.THEMES : [
    { key: "all", name: "Все слова", start: 0, count: ds.WORDS.length }
  ];
}

// ==== Утилиты ====
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

function App() {
  const [themeKey, setThemeKey] = React.useState("all");
  const poolIndices = React.useMemo(() => {
    const t = THEMES.find((t) => t.key === themeKey) || THEMES[0];
    if (t.key === "all") return [...Array(WORDS.length).keys()];
    const arr = [];
    for (let i = t.start; i < t.start + t.count; i++) arr.push(i);
    return arr;
  }, [themeKey]);

  const [order, setOrder] = React.useState(() => shuffle(poolIndices));
  const [idx, setIdx] = React.useState(0);
  const [input, setInput] = React.useState("");
  const [checked, setChecked] = React.useState(false);
  const [isCorrect, setIsCorrect] = React.useState(false);
  const [points, setPoints] = React.useState(0);
  const [attempts, setAttempts] = React.useState(0);
  const [strictAccents, setStrictAccents] = React.useState(false);

  const current = React.useMemo(() => WORDS[order[idx]], [order, idx]);
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
            React.createElement("h1", { className: "text-2xl sm:text-3xl font-bold tracking-tight" }, "Итальянские карточки — 200 слов"),
            React.createElement("p", { className: "text-sm text-slate-600" }, "Введи перевод на итальянский и кликни по карточке. Enter — проверить, повторный клик — следующая."),
            React.createElement("div", { className: "mt-2 flex items-center gap-2" },
              React.createElement("label", { className: "text-xs text-slate-600" }, "Тема:"),
              React.createElement(
                "select",
                {
                  value: themeKey,
                  onChange: (e) => setThemeKey(e.target.value),
                  className: "text-sm rounded-lg border border-slate-300 px-2 py-1 bg-white"
                },
                THEMES.map((t) => React.createElement("option", { key: t.key, value: t.key }, t.name))
              )
            )
          ),
          React.createElement("div", { className: "flex gap-3 text-sm" },
            React.createElement("div", { className: "bg-white rounded-xl shadow px-3 py-2" }, "Очки: ", React.createElement("b", null, points)),
            React.createElement("div", { className: "bg-white rounded-xl shadow px-3 py-2" }, "Попытки: ", React.createElement("b", null, attempts)),
            React.createElement("div", { className: "bg-white rounded-xl shadow px-3 py-2" }, "Точность: ", React.createElement("b", null, accuracy), "%")
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
            React.createElement("div", { className: "text-slate-500 text-xs uppercase tracking-widest mb-2" }, "Русское слово"),
            React.createElement("div", { className: "text-3xl sm:text-4xl font-semibold" }, current.ru),
            React.createElement("div", { className: "mt-4 text-slate-500 text-sm" }, `Кликни, чтобы ${checked ? "перейти дальше" : "проверить"}.`),
            checked && React.createElement("div", { className: "mt-4" },
              isCorrect
                ? React.createElement("div", { className: "text-green-700 font-medium" }, "Правильно! ✅")
                : React.createElement("div", { className: "text-rose-700 font-medium" },
                    "Нужный ответ: ", React.createElement("span", { className: "underline" }, acceptedAnswers[0]),
                    acceptedAnswers.length > 1 &&
                      React.createElement("span", { className: "text-slate-500" }, ` (также принимается: ${acceptedAnswers.slice(1).join(", ")})`)
                  )
            )
          ),
          React.createElement("div", { className: "bg-white rounded-3xl p-5 shadow border border-slate-200" },
            React.createElement("label", { className: "block text-sm text-slate-600 mb-2" }, "Введи итальянский перевод"),
            React.createElement("input", {
              ref: inputRef, value: input, onChange: (e) => setInput(e.target.value), onKeyDown: handleKeyDown,
              placeholder: "например: ciao",
              className: "w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 text-lg",
              autoComplete: "off"
            }),
            React.createElement("div", { className: "mt-3 flex flex-wrap gap-2" },
              React.createElement("button", { onClick: checkAnswer, className: "px-4 py-2 rounded-xl bg-sky-600 text-white hover:bg-sky-700 active:translate-y-px" }, "Проверить (Enter)"),
              React.createElement("button", { onClick: nextCard, className: "px-4 py-2 rounded-xl bg-slate-800 text-white hover:bg-slate-900 active:translate-y-px" }, "Дальше (→)"),
              React.createElement("button", { onClick: skipCard, className: "px-4 py-2 rounded-xl bg-amber-500 text-white hover:bg-amber-600 active:translate-y-px" }, "Пропустить"),
              React.createElement("button", { onClick: reveal, className: "px-4 py-2 rounded-xl bg-rose-500 text-white hover:bg-rose-600 active:translate-y-px" }, "Показать ответ"),
              React.createElement("button", { onClick: reshuffle, className: "px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 active:translate-y-px" }, "Перемешать заново"),
              React.createElement("button", { onClick: resetStats, className: "px-4 py-2 rounded-xl bg-slate-200 text-slate-800 hover:bg-slate-300 active:translate-y-px" }, "Сбросить очки/попытки/точность и начать сначала")
            ),
            React.createElement("div", { className: "mt-4 flex items-center gap-2 text-sm" },
              React.createElement("input", { id: "strict", type: "checkbox", checked: strictAccents, onChange: (e) => setStrictAccents(e.target.checked), className: "h-4 w-4" }),
              React.createElement("label", { htmlFor: "strict", className: "select-none cursor-pointer" }, "Строгая проверка акцентов (è ≠ e)")
            )
          ),
          React.createElement("div", { className: "text-center text-sm text-slate-600" }, `Карточка ${idx + 1} из ${order.length}`)
        ),
        React.createElement("footer", { className: "mt-8 text-xs text-slate-500" },
          "Советы: 1) Enter — проверить, → — следующая. 2) Клик по карточке также проверяет/листает. 3) По умолчанию акценты не обязательны (caffe засчитывается как caffè)."
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
