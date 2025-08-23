(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.GrammarComparatives = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Utilities
  const isVowel = (ch) => /[aeiou]/i.test(ch);
  const endsWithConsonantVowelConsonant = (w) => {
    if (w.length < 3) return false;
    const a = w.toLowerCase();
    const c1 = a[a.length-3], v = a[a.length-2], c2 = a[a.length-1];
    return !isVowel(c1) && isVowel(v) && !isVowel(c2) && /[a-z]/.test(c1+v+c2);
  };

  // English rules (basic + irregulars)
  const EN_IRREGULAR = {
    'good': ['better', 'best'],
    'bad': ['worse', 'worst'],
    'far': ['farther', 'farthest'],
    'little': ['less', 'least'],
    'many': ['more', 'most'],
    'much': ['more', 'most']
  };

  function enForms(adj) {
    const base = String(adj || '').toLowerCase();
    if (EN_IRREGULAR[base]) return [base, EN_IRREGULAR[base][0], EN_IRREGULAR[base][1]];
    // y -> ier/iest (happy)
    if (/[^aeiou]y$/.test(base)) {
      return [base, base.slice(0, -1) + 'ier', base.slice(0, -1) + 'iest'];
    }
    // CVC doubling (big -> bigger)
    if (endsWithConsonantVowelConsonant(base) && !/[wxy]$/.test(base)) {
      const last = base[base.length-1];
      return [base, base + last + 'er', base + last + 'est'];
    }
    // short words ending with e (nice -> nicer)
    if (/e$/.test(base)) {
      return [base, base + 'r', base + 'st'];
    }
    // 1-2 syllables heuristic: if <= 5 letters -> -er/-est else more/most
    if (base.length <= 5) {
      return [base, base + 'er', base + 'est'];
    }
    return [base, 'more ' + base, 'most ' + base];
  }

  // German (irregulars + default productive pattern: -er, am -sten; simplified)
  const DE_IRREGULAR = {
    'gut': ['besser', 'am besten'],
    'gern': ['lieber', 'am liebsten'],
    'hoch': ['höher', 'am höchsten'],
    'nah': ['näher', 'am nächsten'],
    'viel': ['mehr', 'am meisten']
  };
  function deForms(adj) {
    const base = String(adj || '').toLowerCase();
    if (DE_IRREGULAR[base]) return [base, DE_IRREGULAR[base][0], DE_IRREGULAR[base][1]];
    let comp = base + 'er';
    let sup = 'am ' + base + (/(s|ß|z|x|sch)$/.test(base) ? 'testen' : 'sten'); // rough rule for s-sounds
    return [base, comp, sup];
  }

  // Italian (periphrastic comparative/superlative is broadly acceptable)
  function itForms(adj) {
    const base = String(adj || '').toLowerCase();
    return [base, 'più ' + base, 'il più ' + base];
  }

  // Russian (periphrastic forms that are always valid)
  function ruForms(adj) {
    const base = String(adj || '').toLowerCase();
    return [base, 'более ' + base, 'самый ' + base];
  }

  const FORMERS = { en: enForms, de: deForms, it: itForms, ru: ruForms };

  // Exercise generation
  // modes: 'mc' (multiple-choice), 'fill' (fill-in), 'dnd' (drag-drop)
  function makeItem(lang, positive) {
    const former = FORMERS[lang] || FORMERS.en;
    const [pos, comp, sup] = former(positive);
    return { lang, pos, comp, sup };
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function makeMultipleChoiceQuestion(item) {
    // Ask either for comparative or superlative
    const askComp = Math.random() < 0.5;
    const questionType = askComp ? 'comparative' : 'superlative';
    const prompt = askComp
      ? `Choose the comparative form of "${item.pos}"`
      : `Choose the superlative form of "${item.pos}"`;
    const correct = askComp ? item.comp : item.sup;
    // Generate distractors from other forms
    const pool = shuffle([item.pos, item.comp, item.sup]);
    const options = shuffle([correct, ...pool.filter(x => x !== correct)]).slice(0, 4);
    if (!options.includes(correct)) options[Math.floor(Math.random()*options.length)] = correct;
    return { mode: 'mc', questionType, prompt, options, correct, item };
  }

  function makeFillInQuestion(item) {
    const askComp = Math.random() < 0.5;
    const questionType = askComp ? 'comparative' : 'superlative';
    const prompt = askComp
      ? `Type the comparative form of "${item.pos}"`
      : `Type the superlative form of "${item.pos}"`;
    const correct = askComp ? item.comp : item.sup;
    return { mode: 'fill', questionType, prompt, correct, item };
  }

  function makeDnDQuestion(item) {
    // User must drag pos/comp/sup to matching slots
    const labels = shuffle(['positive', 'comparative', 'superlative']);
    const values = shuffle([item.pos, item.comp, item.sup]);
    const slots = ['positive', 'comparative', 'superlative'];
    const mapping = { positive: item.pos, comparative: item.comp, superlative: item.sup };
    return { mode: 'dnd', prompt: `Drag each form of "${item.pos}" into the correct slot`, labels, values, slots, mapping, item };
  }

  function makeExercise(lang, positive, mode) {
    const item = makeItem(lang, positive);
    if (mode === 'mc') return makeMultipleChoiceQuestion(item);
    if (mode === 'fill') return makeFillInQuestion(item);
    return makeDnDQuestion(item);
  }

  function makeExerciseSet(lang, positives, modes) {
    const ms = Array.isArray(modes) && modes.length ? modes : ['mc', 'fill', 'dnd'];
    return positives.map((p, i) => makeExercise(lang, p, ms[i % ms.length]));
  }

  function validateAnswer(q, answer) {
    if (!q) return { correct: false };
    if (q.mode === 'mc') {
      return { correct: String(answer).toLowerCase().trim() === q.correct.toLowerCase().trim(), expected: q.correct };
    }
    if (q.mode === 'fill') {
      const a = String(answer||'').toLowerCase().trim();
      const ok = a === q.correct.toLowerCase().trim();
      return { correct: ok, expected: q.correct };
    }
    // dnd: answer is object { positive: value, comparative: value, superlative: value }
    const exp = q.mapping;
    const got = answer || {};
    const ok = ['positive', 'comparative', 'superlative'].every(k => (got[k]||'').toLowerCase().trim() === exp[k].toLowerCase().trim());
    return { correct: ok, expected: exp };
  }

  return {
    enForms, deForms, itForms, ruForms,
    makeItem, makeExercise, makeExerciseSet, validateAnswer,
  };
}));
