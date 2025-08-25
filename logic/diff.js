(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require, root);
  } else {
    root.computeBestDiff = factory(null, root);
  }
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this), function (req, root) {
  'use strict';

  var compareFn = null;
  try {
    if (typeof module === 'object' && module.exports && typeof req === 'function') {
      var cw = req('./compareWords.js');
      if (cw && typeof cw.compareWords === 'function') compareFn = cw.compareWords;
    } else if (root && root.WordDiff && typeof root.WordDiff.compareWords === 'function') {
      compareFn = root.WordDiff.compareWords;
    }
  } catch (e) {
    if (root && root.WordDiff && typeof root.WordDiff.compareWords === 'function') {
      compareFn = root.WordDiff.compareWords;
    }
  }

  function computeBestDiff(rawInput, answers, opts) {
    try {
      if (!compareFn || !Array.isArray(answers) || answers.length === 0) return null;
      var best = null;
      for (var i = 0; i < answers.length; i++) {
        var ans = String(answers[i] == null ? '' : answers[i]);
        var d = compareFn(rawInput, ans, opts || {});
        if (!best || (d && d.summary && d.summary.totalErrors < best.summary.totalErrors)) best = d;
      }
      return best;
    } catch (e) {
      return null;
    }
  }

  return computeBestDiff;
});