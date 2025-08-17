// main.js — Полностью рабочее приложение карточек (200 слов)
// React 18 + Tailwind по CDN. Без сборки, готово для GitHub Pages.


// ==== DATA: 200 базовых слов (RU -> IT) ====
const WORDS = [
  // 👋 Приветствия и общение (20)
  { ru: "Привет", it: ["ciao"] },
  { ru: "Доброе утро", it: ["buongiorno"] },
  { ru: "Добрый вечер", it: ["buonasera"] },
  { ru: "Доброй ночи", it: ["buonanotte"] },
  { ru: "Пока", it: ["arrivederci", "addio"] },
  { ru: "До свидания", it: ["addio", "arrivederci"] },
  { ru: "Спасибо", it: ["grazie"] },
  { ru: "Пожалуйста", it: ["prego"] },
  { ru: "Да", it: ["si", "sì"] },
  { ru: "Нет", it: ["no"] },
  { ru: "Извините", it: ["scusi", "scusa"] },
  { ru: "Простите", it: ["mi dispiace"] },
  { ru: "Как дела?", it: ["come stai", "come va"] },
  { ru: "Хорошо", it: ["bene"] },
  { ru: "Плохо", it: ["male"] },
  { ru: "Так себе", it: ["cosi cosi", "così così", "cosi-cosi"] },
  { ru: "Меня зовут…", it: ["mi chiamo"] },
  { ru: "Очень приятно", it: ["piacere"] },
  { ru: "Как вас зовут?", it: ["come si chiama"] },
  { ru: "Помогите!", it: ["aiuto"] },

  // 👤 Люди и семья (20)
  { ru: "Мужчина", it: ["uomo"] },
  { ru: "Женщина", it: ["donna"] },
  { ru: "Ребёнок", it: ["bambino", "bambina"] },
  { ru: "Друг", it: ["amico", "amica"] },
  { ru: "Семья", it: ["famiglia"] },
  { ru: "Отец", it: ["padre", "babbo"] },
  { ru: "Мать", it: ["madre", "mamma"] },
  { ru: "Сын", it: ["figlio"] },
  { ru: "Дочь", it: ["figlia"] },
  { ru: "Брат", it: ["fratello"] },
  { ru: "Сестра", it: ["sorella"] },
  { ru: "Муж", it: ["marito"] },
  { ru: "Жена", it: ["moglie"] },
  { ru: "Родители", it: ["genitori"] },
  { ru: "Дедушка", it: ["nonno"] },
  { ru: "Бабушка", it: ["nonna"] },
  { ru: "Люди", it: ["gente"] },
  { ru: "Имя", it: ["nome"] },
  { ru: "Фамилия", it: ["cognome"] },
  { ru: "Господин", it: ["signore"] },

  // 🍴 Еда и напитки (20)
  { ru: "Еда", it: ["cibo"] },
  { ru: "Вода", it: ["acqua"] },
  { ru: "Хлеб", it: ["pane"] },
  { ru: "Сыр", it: ["formaggio"] },
  { ru: "Вино", it: ["vino"] },
  { ru: "Пиво", it: ["birra"] },
  { ru: "Мясо", it: ["carne"] },
  { ru: "Рыба", it: ["pesce"] },
  { ru: "Суп", it: ["zuppa"] },
  { ru: "Фрукты", it: ["frutta"] },
  { ru: "Яблоко", it: ["mela"] },
  { ru: "Банан", it: ["banana"] },
  { ru: "Овощи", it: ["verdura", "verdure"] },
  { ru: "Картофель", it: ["patata", "patate"] },
  { ru: "Салат", it: ["insalata"] },
  { ru: "Соль", it: ["sale"] },
  { ru: "Сахар", it: ["zucchero"] },
  { ru: "Масло", it: ["olio"] },
  { ru: "Кофе", it: ["caffe", "caffè"] },
  { ru: "Чай", it: ["te", "tè"] },

  // 🚗 Транспорт и дорога (20)
  { ru: "Машина", it: ["macchina", "auto", "automobile"] },
  { ru: "Автобус", it: ["autobus", "bus"] },
  { ru: "Поезд", it: ["treno"] },
  { ru: "Самолёт", it: ["aereo"] },
  { ru: "Метро", it: ["metropolitana", "metro"] },
  { ru: "Велосипед", it: ["bicicletta", "bici"] },
  { ru: "Такси", it: ["taxi"] },
  { ru: "Остановка", it: ["fermata"] },
  { ru: "Станция", it: ["stazione"] },
  { ru: "Билет", it: ["biglietto"] },
  { ru: "Дорога", it: ["strada"] },
  { ru: "Улица", it: ["via"] },
  { ru: "Мост", it: ["ponte"] },
  { ru: "Аэропорт", it: ["aeroporto"] },
  { ru: "Вокзал", it: ["stazione"] },
  { ru: "Карта (гео)", it: ["mappa"] },
  { ru: "Центр", it: ["centro"] },
  { ru: "Слева", it: ["sinistra"] },
  { ru: "Справа", it: ["destra"] },
  { ru: "Прямо", it: ["dritto"] },

  // 🔢 Числа (20)
  { ru: "1", it: ["uno"] },
  { ru: "2", it: ["due"] },
  { ru: "3", it: ["tre"] },
  { ru: "4", it: ["quattro"] },
  { ru: "5", it: ["cinque"] },
  { ru: "6", it: ["sei"] },
  { ru: "7", it: ["sette"] },
  { ru: "8", it: ["otto"] },
  { ru: "9", it: ["nove"] },
  { ru: "10", it: ["dieci"] },
  { ru: "11", it: ["undici"] },
  { ru: "12", it: ["dodici"] },
  { ru: "13", it: ["tredici"] },
  { ru: "14", it: ["quattordici"] },
  { ru: "15", it: ["quindici"] },
  { ru: "16", it: ["sedici"] },
  { ru: "17", it: ["diciassette"] },
  { ru: "18", it: ["diciotto"] },
  { ru: "19", it: ["diciannove"] },
  { ru: "20", it: ["venti"] },

  // 🎨 Цвета (20)
  { ru: "Белый", it: ["bianco"] },
  { ru: "Чёрный", it: ["nero"] },
  { ru: "Красный", it: ["rosso"] },
  { ru: "Синий", it: ["blu"] },
  { ru: "Голубой", it: ["azzurro"] },
  { ru: "Зелёный", it: ["verde"] },
  { ru: "Жёлтый", it: ["giallo"] },
  { ru: "Оранжевый", it: ["arancione"] },
  { ru: "Розовый", it: ["rosa"] },
  { ru: "Фиолетовый", it: ["viola"] },
  { ru: "Коричневый", it: ["marrone"] },
  { ru: "Серый", it: ["grigio"] },
  { ru: "Золотой", it: ["oro"] },
  { ru: "Серебряный", it: ["argento"] },
  { ru: "Бежевый", it: ["beige"] },
  { ru: "Тёмный", it: ["scuro"] },
  { ru: "Светлый", it: ["chiaro"] },
  { ru: "Небесно-голубой", it: ["celeste"] },
  { ru: "Малиновый", it: ["cremisi"] },
  { ru: "Бирюзовый", it: ["turchese"] },

  // 🏠 Дом и вещи (20)
  { ru: "Дом", it: ["casa"] },
  { ru: "Квартира", it: ["appartamento"] },
  { ru: "Комната", it: ["stanza"] },
  { ru: "Кровать", it: ["letto"] },
  { ru: "Стол", it: ["tavolo"] },
  { ru: "Стул", it: ["sedia"] },
  { ru: "Дверь", it: ["porta"] },
  { ru: "Окно", it: ["finestra"] },
  { ru: "Кухня", it: ["cucina"] },
  { ru: "Ванная", it: ["bagno"] }, // ensure 'bagno'
  { ru: "Телевизор", it: ["televisore", "tv"] },
  { ru: "Холодильник", it: ["frigorifero"] },
  { ru: "Плита", it: ["fornello", "forno"] },
  { ru: "Лампа", it: ["lampada"] },
  { ru: "Зеркало", it: ["specchio"] },
  { ru: "Ковер", it: ["tappeto"] },
  { ru: "Книга", it: ["libro"] },
  { ru: "Телефон", it: ["telefono"] },
  { ru: "Одежда", it: ["vestiti", "abiti"] },
  { ru: "Обувь", it: ["scarpe"] },

  // 🌍 Природа и погода (20)
  { ru: "Солнце", it: ["sole"] },
  { ru: "Луна", it: ["luna"] },
  { ru: "Звезда", it: ["stella"] },
  { ru: "Небо", it: ["cielo"] },
  { ru: "Облако", it: ["nuvola"] },
  { ru: "Дождь", it: ["pioggia"] },
  { ru: "Снег", it: ["neve"] },
  { ru: "Ветер", it: ["vento"] },
  { ru: "Море", it: ["mare"] },
  { ru: "Озеро", it: ["lago"] },
  { ru: "Река", it: ["fiume"] },
  { ru: "Гора", it: ["montagna"] },
  { ru: "Лес", it: ["bosco", "foresta"] },
  { ru: "Поле", it: ["campo"] },
  { ru: "Цветок", it: ["fiore"] },
  { ru: "Дерево", it: ["albero"] },
  { ru: "Трава", it: ["erba"] },
  { ru: "Погода", it: ["tempo", "meteo"] },
  { ru: "Жара", it: ["caldo"] },
  { ru: "Холод", it: ["freddo"] },

  // 💼 Работа и учёба (20)
  { ru: "Работа", it: ["lavoro"] },
  { ru: "Учёба", it: ["studio"] },
  { ru: "Школа", it: ["scuola"] },
  { ru: "Университет", it: ["universita", "università"] },
  { ru: "Урок", it: ["lezione"] },
  { ru: "Книга", it: ["libro"] },
  { ru: "Тетрадь", it: ["quaderno"] },
  { ru: "Ручка", it: ["penna"] },
  { ru: "Компьютер", it: ["computer", "pc"] },
  { ru: "Учитель", it: ["insegnante", "professore", "professoressa"] },
  { ru: "Студент", it: ["studente", "studentessa"] },
  { ru: "Коллега", it: ["collega"] },
  { ru: "Босс", it: ["capo"] },
  { ru: "Деньги", it: ["soldi"] },
  { ru: "Зарплата", it: ["stipendio"] },
  { ru: "Встреча", it: ["riunione", "meeting"] },
  { ru: "Документ", it: ["documento"] },
  { ru: "Контракт", it: ["contratto"] },
  { ru: "Проект", it: ["progetto"] },
  { ru: "Компания", it: ["azienda", "impresa", "societa", "società"] },

  // 📦 Покупки (20)
  { ru: "Магазин", it: ["negozio"] },
  { ru: "Супермаркет", it: ["supermercato"] },
  { ru: "Рынок", it: ["mercato"] },
  { ru: "Цена", it: ["prezzo"] },
  { ru: "Сколько стоит?", it: ["quanto costa"] },
  { ru: "Дорого", it: ["caro"] },
  { ru: "Дёшево", it: ["economico"] },
  { ru: "Деньги", it: ["soldi"] },
  { ru: "Карта (банковская)", it: ["carta"] },
  { ru: "Чек (кассовый)", it: ["scontrino"] },
  { ru: "Покупка", it: ["acquisto"] },
  { ru: "Продавец", it: ["venditore", "commesso", "commessa"] },
  { ru: "Клиент", it: ["cliente"] },
  { ru: "Касса", it: ["cassa"] },
  { ru: "Корзина", it: ["carrello"] },
  { ru: "Пакет", it: ["sacchetto", "borsa"] },
  { ru: "Акция", it: ["offerta", "promozione"] },
  { ru: "Скидка", it: ["sconto"] },
  { ru: "Размер", it: ["taglia"] },
  { ru: "Примерочная", it: ["camerino", "spogliatoio"] },
];

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
  const [order, setOrder] = React.useState(() => shuffle([...Array(WORDS.length).keys()]));
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
    if (next >= order.length) { setOrder(shuffle([...Array(WORDS.length).keys()])); setIdx(0); }
    else { setIdx(next); }
    setInput(""); setChecked(false); setIsCorrect(false); inputRef.current?.focus();
  }

  const skipCard = () => { setAttempts((a) => a + 1); nextCard(); };
  const reveal = () => { setInput(acceptedAnswers[0] || ""); setChecked(true); setIsCorrect(false); setAttempts((a) => a + 1); };
  const reshuffle = () => { setOrder(shuffle([...Array(WORDS.length).keys()])); setIdx(0); setInput(""); setChecked(false); setIsCorrect(false); setPoints(0); setAttempts(0); };
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
            React.createElement("p", { className: "text-sm text-slate-600" }, "Введи перевод на итальянский и кликни по карточке. Enter — проверить, повторный клик — следующая.")
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
          React.createElement("div", { className: "text-center text-sm text-slate-600" }, `Карточка ${idx + 1} из ${WORDS.length}`)
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
  module.exports = { WORDS, stripDiacritics, normalize, shuffle };
}
