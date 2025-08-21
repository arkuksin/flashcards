/*
 * logic/compareWords.js
 * Pure, framework-independent diff function to compare two words/strings.
 * Returns structured ops to render aligned differences.
 *
 * Operations (from A=user to B=correct):
 *  - equal: same character
 *  - replace: substitution (different characters)
 *  - insert: extra character in user (present in A, not in B)
 *  - delete: missing character in user (present in B, not in A)
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.WordDiff = root.WordDiff || {};
    root.WordDiff.compareWords = factory().compareWords;
  }
})(typeof self !== 'undefined' ? self : this, function () {
  function stripDiacritics(s) {
    return String(s || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function normalizeForDiff(s, { caseInsensitive = true, ignoreDiacritics = true } = {}) {
    let out = String(s == null ? '' : s);
    if (ignoreDiacritics) out = stripDiacritics(out);
    if (caseInsensitive) out = out.toLowerCase();
    // Keep spaces and punctuation for alignment clarity; trimming outer spaces
    return out.trim();
  }

  function toCodePoints(str) {
    return Array.from(str);
  }

  // Levenshtein alignment with backtrace to operations
  function align(a, b) {
    const n = a.length;
    const m = b.length;
    const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
    const bt = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(null));

    for (let i = 0; i <= n; i++) { dp[i][0] = i; bt[i][0] = 'D'; }
    for (let j = 0; j <= m; j++) { dp[0][j] = j; bt[0][j] = 'I'; }
    bt[0][0] = null;

    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= m; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        const del = dp[i - 1][j] + 1; // delete from a (missing in user)
        const ins = dp[i][j - 1] + 1; // insert into a (extra in user)
        const sub = dp[i - 1][j - 1] + cost; // substitute
        let min = sub; let op = cost === 0 ? 'E' : 'R';
        if (del < min) { min = del; op = 'D'; }
        if (ins < min) { min = ins; op = 'I'; }
        dp[i][j] = min; bt[i][j] = op;
      }
    }

    // backtrace
    const ops = [];
    let i = n, j = m;
    while (i > 0 || j > 0) {
      const op = bt[i][j];
      if (op === 'E') {
        ops.push({ type: 'equal', a: a[i - 1], b: b[j - 1], ai: i - 1, bi: j - 1 });
        i--; j--;
      } else if (op === 'R') {
        ops.push({ type: 'replace', a: a[i - 1], b: b[j - 1], ai: i - 1, bi: j - 1 });
        i--; j--;
      } else if (op === 'D') {
        ops.push({ type: 'delete', a: a[i - 1], b: '', ai: i - 1, bi: j }); // missing in A
        i--;
      } else if (op === 'I') {
        ops.push({ type: 'insert', a: '', b: b[j - 1], ai: i, bi: j - 1 }); // extra in A
        j--;
      } else {
        // Shouldn't happen; fallback safety
        if (i > 0 && j > 0) {
          ops.push({ type: a[i - 1] === b[j - 1] ? 'equal' : 'replace', a: a[i - 1], b: b[j - 1], ai: i - 1, bi: j - 1 });
          i--; j--;
        } else if (i > 0) {
          ops.push({ type: 'delete', a: a[i - 1], b: '', ai: i - 1, bi: j });
          i--;
        } else {
          ops.push({ type: 'insert', a: '', b: b[j - 1], ai: i, bi: j - 1 });
          j--;
        }
      }
    }
    ops.reverse();
    // Add column index
    ops.forEach((op, idx) => { op.col = idx; });
    return ops;
  }

  function compareWords(user, correct, options = {}) {
    const { caseInsensitive = true, ignoreDiacritics = true } = options;
    const aNorm = normalizeForDiff(user, { caseInsensitive, ignoreDiacritics });
    const bNorm = normalizeForDiff(correct, { caseInsensitive, ignoreDiacritics });
    const a = toCodePoints(aNorm);
    const b = toCodePoints(bNorm);
    const ops = align(a, b);

    let substitutions = 0, insertions = 0, deletions = 0;
    for (const op of ops) {
      if (op.type === 'replace') substitutions++;
      else if (op.type === 'insert') insertions++;
      else if (op.type === 'delete') deletions++;
    }

    return {
      ops,
      a: aNorm,
      b: bNorm,
      summary: {
        substitutions,
        insertions,
        deletions,
        totalErrors: substitutions + insertions + deletions,
        lengthA: a.length,
        lengthB: b.length,
      }
    };
  }

  return { compareWords };
});
