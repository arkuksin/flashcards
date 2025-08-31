// grammar.js — UI for Grammar: Comparatives & Superlatives
(function () {
  const { useState, useEffect, useMemo, useRef } = React;

  const LANGS = [
    { code: 'en', label: 'English' },
    { code: 'de', label: 'Deutsch' },
    { code: 'it', label: 'Italiano' },
    { code: 'ru', label: 'Русский' },
  ];

  // UI translations for Grammar page
  const I18N = {
    en: {
      title: 'Grammar — Comparatives & Superlatives',
      subtitle: 'Practice forming comparative and superlative forms with instant feedback.',
      langLabel: 'Language:',
      modeLabel: 'Mode:',
      modeFill: 'Fill-in',
      modeMC: 'Multiple choice',
      modeDnD: 'Drag & drop',
      strictLabel: 'Strict accent check (è ≠ e)',
      scoreLabel: 'Score: ',
      attemptsLabel: 'Attempts: ',
      baseLabel: 'Base adjective',
      correct: 'Correct! ✅',
      correctAnswerLabel: 'Correct answer: ',
      dndTryAgain: 'Check mapping and try again.',
      btnCheck: 'Check (Enter)',
      btnNext: 'Next (→)',
      btnSkip: 'Skip',
      answerPlaceholder: 'Type your answer',
      slotLabel: { positive: 'Positive', comparative: 'Comparative', superlative: 'Superlative' },
      progress: (i, n) => `Exercise ${i} of ${n}`,
    },
    de: {
      title: 'Grammatik — Komparativ & Superlativ',
      subtitle: 'Übe die Bildung von Komparativ und Superlativ mit sofortigem Feedback.',
      langLabel: 'Sprache:',
      modeLabel: 'Modus:',
      modeFill: 'Eingabe',
      modeMC: 'Mehrfachauswahl',
      modeDnD: 'Ziehen & Ablegen',
      strictLabel: 'Strenge Akzentprüfung (è ≠ e)',
      scoreLabel: 'Punkte: ',
      attemptsLabel: 'Versuche: ',
      baseLabel: 'Grundform',
      correct: 'Richtig! ✅',
      correctAnswerLabel: 'Richtige Antwort: ',
      dndTryAgain: 'Zuordnung prüfen und erneut versuchen.',
      btnCheck: 'Prüfen (Enter)',
      btnNext: 'Weiter (→)',
      btnSkip: 'Überspringen',
      answerPlaceholder: 'Antwort eingeben',
      slotLabel: { positive: 'Positiv', comparative: 'Komparativ', superlative: 'Superlativ' },
      progress: (i, n) => `Übung ${i} von ${n}`,
    },
    it: {
      title: 'Grammatica — Comparativi e Superlativi',
      subtitle: 'Esercitati a formare comparativo e superlativo con feedback immediato.',
      langLabel: 'Lingua:',
      modeLabel: 'Modalità:',
      modeFill: 'Inserimento',
      modeMC: 'Scelta multipla',
      modeDnD: 'Trascina e rilascia',
      strictLabel: 'Controllo rigoroso degli accenti (è ≠ e)',
      scoreLabel: 'Punti: ',
      attemptsLabel: 'Tentativi: ',
      baseLabel: 'Aggettivo base',
      correct: 'Corretto! ✅',
      correctAnswerLabel: 'Risposta corretta: ',
      dndTryAgain: 'Controlla l’abbinamento e riprova.',
      btnCheck: 'Controlla (Invio)',
      btnNext: 'Avanti (→)',
      btnSkip: 'Salta',
      answerPlaceholder: 'Scrivi la risposta',
      slotLabel: { positive: 'Positivo', comparative: 'Comparativo', superlative: 'Superlativo' },
      progress: (i, n) => `Esercizio ${i} di ${n}`,
    },
    ru: {
      title: 'Грамматика — Сравнительные и превосходные степени',
      subtitle: 'Практика образования сравнительной и превосходной степеней с мгновенной обратной связью.',
      langLabel: 'Язык:',
      modeLabel: 'Режим:',
      modeFill: 'Ввод',
      modeMC: 'Выбор',
      modeDnD: 'Перетаскивание',
      strictLabel: 'Строгая проверка акцентов (è ≠ e)',
      scoreLabel: 'Очки: ',
      attemptsLabel: 'Попытки: ',
      baseLabel: 'Базовое прилагательное',
      correct: 'Правильно! ✅',
      correctAnswerLabel: 'Правильный ответ: ',
      dndTryAgain: 'Проверьте соответствие и попробуйте ещё раз.',
      btnCheck: 'Проверить (Enter)',
      btnNext: 'Дальше (→)',
      btnSkip: 'Пропустить',
      answerPlaceholder: 'Введите ответ',
      slotLabel: { positive: 'Положительная', comparative: 'Сравнительная', superlative: 'Превосходная' },
      progress: (i, n) => `Упражнение ${i} из ${n}`,
    },
  };

  function getDataset(lang) {
    if (lang === 'en' && Array.isArray(window.GRAMMAR_ADJECTIVES_EN)) return window.GRAMMAR_ADJECTIVES_EN;
    if (lang === 'de' && Array.isArray(window.GRAMMAR_ADJECTIVES_DE)) return window.GRAMMAR_ADJECTIVES_DE;
    if (lang === 'it' && Array.isArray(window.GRAMMAR_ADJECTIVES_IT)) return window.GRAMMAR_ADJECTIVES_IT;
    if (lang === 'ru' && Array.isArray(window.GRAMMAR_ADJECTIVES_RU)) return window.GRAMMAR_ADJECTIVES_RU;
    return window.GRAMMAR_ADJECTIVES_EN || [];
  }

  function shuffle(array) {
    const a = array.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Accent utilities (same approach as main.js)
  function stripDiacritics(s) {
    try {
      return String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    } catch (e) {
      return String(s || '');
    }
  }
  function normalize(s) {
    return stripDiacritics(String(s || '').toLowerCase()).replace(/\s+/g, ' ').trim();
  }

  function ProgressBar({ index, total }) {
    const pct = Math.min(100, Math.round(((index + 1) / total) * 100));
    return React.createElement('div', { className: 'w-full bg-slate-200 rounded-full h-2' },
      React.createElement('div', { className: 'bg-sky-500 h-2 rounded-full transition-all', style: { width: pct + '%' } })
    );
  }

  function App() {
    // Persist last selected language
    const detectLang = () => {
      try { const v = localStorage.getItem('grammar-lang'); if (v && ['en','de','it','ru'].includes(v)) return v; } catch(e) {}
      return 'en';
    };
    const [lang, setLang] = useState(detectLang);
    useEffect(() => { try { localStorage.setItem('grammar-lang', lang); } catch(e) {} }, [lang]);

    const t = I18N[lang] || I18N.en;
    useEffect(() => {
      try {
        if (typeof document !== 'undefined') {
          document.title = t.title;
          if (document.documentElement) document.documentElement.lang = lang;
        }
      } catch (e) {}
    }, [lang, t.title]);

    // Mode: mc | fill | dnd (default to 'mc' to stabilize initial render in tests)
    const [mode, setMode] = useState('mc');

    // Accent strictness (only meaningful for Italian answers)
    const [strictAccents, setStrictAccents] = useState(() => {
      try { return localStorage.getItem('grammar-strict-accents') === '1'; } catch(e) { return false; }
    });
    useEffect(() => { try { localStorage.setItem('grammar-strict-accents', strictAccents ? '1' : '0'); } catch(e) {} }, [strictAccents]);

    // Build exercise sequence from adjectives
    const adjectives = useMemo(() => getDataset(lang).slice(0, 100), [lang]);
    const sequence = useMemo(() => shuffle(adjectives), [adjectives]);

    const [idx, setIdx] = useState(0);
    const total = sequence.length || 0;

    // Current question
    const formsAPI = window.GrammarComparatives;
    const currentItem = useMemo(() => {
      const base = sequence[idx] || '';
      return (formsAPI && formsAPI.makeItem) ? formsAPI.makeItem(lang, base) : { lang, pos: base, comp: '', sup: '' };
    }, [sequence, idx, lang]);

    // For MC/Fill, prebuild a question with stable askComp across renders
    const [question, setQuestion] = useState(null);
    useEffect(() => {
      if (!formsAPI) return;
      setQuestion(formsAPI.makeExercise(lang, currentItem.pos, mode));
    }, [formsAPI, lang, currentItem.pos, mode]);

    const [input, setInput] = useState('');
    const [checked, setChecked] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [points, setPoints] = useState(0);
    const [attempts, setAttempts] = useState(0);

    // DnD state: selected value token and slot mappings
    const [dndSelection, setDndSelection] = useState(null);
    const [dndMap, setDndMap] = useState({ positive: '', comparative: '', superlative: '' });

    useEffect(() => {
      // reset state when idx or mode or lang changes
      setInput('');
      setChecked(false);
      setIsCorrect(false);
      setDndSelection(null);
      setDndMap({ positive: '', comparative: '', superlative: '' });
    }, [idx, mode, lang]);

    function check() {
      if (!formsAPI || !question) return;
      let result;
      if (mode === 'mc') {
        // mc handled on click; nothing to do here
        return;
      } else if (mode === 'fill') {
        if (lang === 'it' && !strictAccents) {
          const user = normalize(input);
          const target = normalize(question.correct);
          result = { correct: user === target, expected: question.correct };
        } else {
          result = formsAPI.validateAnswer(question, input);
        }
      } else {
        result = formsAPI.validateAnswer(question, dndMap);
      }
      setChecked(true);
      setAttempts(a => a + 1);
      setIsCorrect(result.correct);
      if (result.correct) setPoints(p => p + 1);
    }

    function next() {
      setIdx(i => (i + 1) % total);
    }

    function skip() {
      setAttempts(a => a + 1);
      setIdx(i => (i + 1) % total);
      setChecked(false); setIsCorrect(false);
    }

    function reshuffle() {
      // reshuffle sequence by resetting adjectives memo dependency via lang flip trick
      setIdx(0);
    }

    // Keyboard shortcuts
    useEffect(() => {
      function onKeyDown(e) {
        try {
          const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
          const inInput = tag === 'input' || tag === 'textarea' || e.isComposing;
          if (e.altKey || e.ctrlKey || e.metaKey) return;
          if (e.key === 'Enter') {
            if (mode === 'fill' || mode === 'dnd') {
              if (!checked) { check(); } else { next(); }
              e.preventDefault();
            }
            return;
          }
          if (e.key === 'ArrowRight') {
            next();
            e.preventDefault();
            return;
          }
          if (e.key === 'Escape') {
            if (mode === 'fill') {
              setInput('');
              e.preventDefault();
            }
            return;
          }
          // MC numeric selection 1..4
          if (mode === 'mc' && !checked && !inInput) {
            const num = parseInt(e.key, 10);
            if (!isNaN(num) && question && Array.isArray(question.options)) {
              const idx = num - 1;
              if (idx >= 0 && idx < question.options.length) {
                onOptionClick(question.options[idx]);
                e.preventDefault();
              }
            }
          }
        } catch (_) {}
      }
      window.addEventListener('keydown', onKeyDown);
      return () => window.removeEventListener('keydown', onKeyDown);
    }, [mode, checked, question, input, dndMap, strictAccents]);

    // MC option click handler
    function onOptionClick(opt) {
      if (!formsAPI || !question || checked) return;
      const res = formsAPI.validateAnswer(question, opt);
      setChecked(true);
      setAttempts(a => a + 1);
      setIsCorrect(res.correct);
      if (res.correct) setPoints(p => p + 1);
    }

    // DnD: choose a value, then click a slot to assign
    function pickValue(val) { setDndSelection(val); }
    function placeTo(slot) {
      if (!dndSelection) return;
      setDndMap(m => ({ ...m, [slot]: dndSelection }));
      setDndSelection(null);
    }

    const header = React.createElement('header', { className: 'mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between' },
      React.createElement('div', null,
        React.createElement('h1', { className: 'text-2xl sm:text-3xl font-bold tracking-tight' }, t.title),
        React.createElement('p', { className: 'text-sm text-slate-600' }, t.subtitle)
      ),
      React.createElement('div', { className: 'flex gap-3 text-sm' },
        React.createElement('div', { className: 'bg-white rounded-xl shadow px-3 py-2', 'data-testid': 'points', 'data-value': String(points) }, t.scoreLabel, React.createElement('b', null, points)),
        React.createElement('div', { className: 'bg-white rounded-xl shadow px-3 py-2', 'data-testid': 'attempts', 'data-value': String(attempts) }, t.attemptsLabel, React.createElement('b', null, attempts))
      )
    );

    const controls = React.createElement('div', { className: 'mt-2 flex flex-wrap items-center gap-3' },
      React.createElement('label', { className: 'text-xs text-slate-600' }, t.langLabel),
      React.createElement('select', {
        value: lang, onChange: (e) => setLang(e.target.value), className: 'text-sm rounded-lg border border-slate-300 px-2 py-1 bg-white', 'data-testid': 'lang-select'
      }, LANGS.map(l => React.createElement('option', { key: l.code, value: l.code }, l.label))),
      React.createElement('label', { className: 'text-xs text-slate-600' }, t.modeLabel),
      React.createElement('select', {
        value: mode, onChange: (e) => setMode(e.target.value), className: 'text-sm rounded-lg border border-slate-300 px-2 py-1 bg-white', 'data-testid': 'mode-select'
      }, [
        React.createElement('option', { key: 'fill', value: 'fill' }, t.modeFill),
        React.createElement('option', { key: 'mc', value: 'mc' }, t.modeMC),
        React.createElement('option', { key: 'dnd', value: 'dnd' }, t.modeDnD),
      ]),
      // Strict accents toggle (mainly for Italian)
      React.createElement('span', { className: 'text-slate-300 select-none' }, '•'),
      React.createElement('input', { id: 'g-strict', type: 'checkbox', checked: strictAccents, onChange: (e) => setStrictAccents(e.target.checked), className: 'h-4 w-4', 'data-testid': 'strict-toggle' }),
      React.createElement('label', { htmlFor: 'g-strict', className: 'select-none cursor-pointer text-sm' }, t.strictLabel)
    );

    const prompt = question ? question.prompt : '';

    function renderExercise() {
      if (!question) return null;
      if (mode === 'mc') {
        return React.createElement('div', { className: 'bg-white rounded-3xl p-5 shadow border border-slate-200', 'data-testid': 'mc-container' },
          React.createElement('div', { className: 'text-slate-500 text-xs uppercase tracking-widest mb-2' }, t.baseLabel),
          React.createElement('div', { className: 'text-3xl sm:text-4xl font-semibold', 'data-testid': 'base-word' }, currentItem.pos),
          React.createElement('div', { className: 'mt-2 text-slate-700', 'data-testid': 'prompt' }, prompt),
          React.createElement('div', { className: 'mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2' },
            question.options.map((opt, i) => React.createElement('button', {
              key: 'opt-' + i,
              className: 'px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-left',
              onClick: () => onOptionClick(opt),
              disabled: checked,
              'data-testid': 'option-' + i,
              'data-correct': checked && opt === question.correct ? 'true' : 'false'
            }, (i + 1) + '. ' + opt))
          ),
          checked && React.createElement('div', { className: 'mt-4', 'data-testid': 'feedback', 'data-correct': isCorrect ? 'true' : 'false' },
            isCorrect ? React.createElement('div', { className: 'text-green-700 font-medium' }, t.correct)
                      : React.createElement('div', { className: 'text-rose-700 font-medium' }, t.correctAnswerLabel, React.createElement('span', { className: 'underline' }, question.correct))
          ),
          React.createElement('div', { className: 'mt-3 flex flex-wrap gap-2' },
            React.createElement('button', { onClick: next, className: 'px-4 py-2 rounded-xl bg-slate-800 text-white hover:bg-slate-900 active:translate-y-px', 'data-testid': 'btn-next' }, t.btnNext),
            React.createElement('button', { onClick: skip, className: 'px-4 py-2 rounded-xl bg-amber-500 text-white hover:bg-amber-600 active:translate-y-px', 'data-testid': 'btn-skip' }, t.btnSkip)
          )
        );
      }
      if (mode === 'fill') {
        return React.createElement('div', { className: 'bg-white rounded-3xl p-5 shadow border border-slate-200' },
          React.createElement('div', { className: 'text-slate-500 text-xs uppercase tracking-widest mb-2' }, t.baseLabel),
          React.createElement('div', { className: 'text-3xl sm:text-4xl font-semibold', 'data-testid': 'base-word' }, currentItem.pos),
          React.createElement('div', { className: 'mt-2 text-slate-700', 'data-testid': 'prompt' }, prompt),
          React.createElement('input', {
            value: input, onChange: (e) => setInput(e.target.value), placeholder: t.answerPlaceholder,
            className: 'w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 text-lg',
            'data-testid': 'answer'
          }),
          React.createElement('div', { className: 'mt-3 flex flex-wrap gap-2' },
            React.createElement('button', { onClick: check, className: 'px-4 py-2 rounded-xl bg-sky-600 text-white hover:bg-sky-700 active:translate-y-px', 'data-testid': 'check' }, t.btnCheck),
            React.createElement('button', { onClick: next, className: 'px-4 py-2 rounded-xl bg-slate-800 text-white hover:bg-slate-900 active:translate-y-px', 'data-testid': 'btn-next' }, t.btnNext),
            React.createElement('button', { onClick: skip, className: 'px-4 py-2 rounded-xl bg-amber-500 text-white hover:bg-amber-600 active:translate-y-px', 'data-testid': 'btn-skip' }, t.btnSkip)
          ),
          checked && React.createElement('div', { className: 'mt-4', 'data-testid': 'feedback', 'data-correct': isCorrect ? 'true' : 'false' },
            isCorrect ? React.createElement('div', { className: 'text-green-700 font-medium' }, t.correct)
                      : React.createElement('div', { className: 'text-rose-700 font-medium' }, t.correctAnswerLabel, React.createElement('span', { className: 'underline' }, question.correct))
          )
        );
      }
      // dnd
      const values = question.values || [];
      const slots = ['positive','comparative','superlative'];
      return React.createElement('div', { className: 'bg-white rounded-3xl p-5 shadow border border-slate-200' },
        React.createElement('div', { className: 'text-slate-500 text-xs uppercase tracking-widest mb-2' }, t.baseLabel),
        React.createElement('div', { className: 'text-3xl sm:text-4xl font-semibold', 'data-testid': 'base-word' }, currentItem.pos),
        React.createElement('div', { className: 'mt-2 text-slate-700', 'data-testid': 'prompt' }, question.prompt),
        React.createElement('div', { className: 'mt-4 flex flex-wrap gap-2' },
          values.map((v, i) => React.createElement('button', {
            key: 'val-' + i,
            onClick: () => pickValue(v),
            className: 'px-3 py-1 rounded-full border border-slate-300 bg-white hover:bg-slate-50',
            'data-testid': 'dnd-value-' + i
          }, v))
        ),
        React.createElement('div', { className: 'mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3' },
          slots.map((s) => React.createElement('div', { key: s, className: 'rounded-xl border border-slate-300 bg-slate-50 p-3' },
            React.createElement('div', { className: 'text-xs uppercase text-slate-500 mb-1'}, (t.slotLabel && t.slotLabel[s]) ? t.slotLabel[s] : s),
            React.createElement('button', {
              onClick: () => placeTo(s),
              className: 'w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-left',
              'data-testid': 'dnd-slot-' + s
            }, dndMap[s] || '▯')
          ))
        ),
        React.createElement('div', { className: 'mt-3 flex flex-wrap gap-2' },
          React.createElement('button', { onClick: check, className: 'px-4 py-2 rounded-xl bg-sky-600 text-white hover:bg-sky-700 active:translate-y-px', 'data-testid': 'check' }, t.btnCheck),
          React.createElement('button', { onClick: next, className: 'px-4 py-2 rounded-xl bg-slate-800 text-white hover:bg-slate-900 active:translate-y-px', 'data-testid': 'btn-next' }, t.btnNext),
          React.createElement('button', { onClick: skip, className: 'px-4 py-2 rounded-xl bg-amber-500 text-white hover:bg-amber-600 active:translate-y-px', 'data-testid': 'btn-skip' }, t.btnSkip)
        ),
        checked && React.createElement('div', { className: 'mt-4', 'data-testid': 'feedback', 'data-correct': isCorrect ? 'true' : 'false' },
          isCorrect ? React.createElement('div', { className: 'text-green-700 font-medium' }, t.correct)
                    : React.createElement('div', { className: 'text-rose-700 font-medium' }, t.dndTryAgain)
        )
      );
    }

    return React.createElement('div', { className: 'min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center py-8 px-4' },
      React.createElement('div', { className: 'w-full max-w-3xl' },
        header,
        controls,
        React.createElement('main', { className: 'mt-4 flex flex-col gap-4' }, renderExercise()),
        React.createElement('div', { className: 'text-center text-sm text-slate-600', 'data-testid': 'progress', 'data-index': String(idx + 1), 'data-total': String(total) }, t.progress(idx + 1, total)),
        React.createElement('div', { className: 'mt-2' }, React.createElement(ProgressBar, { index: idx, total }))
      )
    );
  }

  if (typeof document !== 'undefined' && typeof ReactDOM !== 'undefined') {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(App));
  }
})();
