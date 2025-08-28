(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require, root);
  } else {
    root.GameState = factory(null, root);
  }
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this), function (req, root) {
  'use strict';

  // Resolve Utils for shuffle; keep usage minimal and pure
  var Utils;
  try {
    if (typeof module === 'object' && module.exports && typeof req === 'function') {
      Utils = req('./utils.js');
    } else {
      Utils = (root && root.Utils) ? root.Utils : {};
    }
  } catch (e) {
    Utils = (root && root.Utils) ? root.Utils : {};
  }

  function clone(state) { return Object.assign({}, state); }

  function getInitialState(order, strictAccents) {
    return {
      order: Array.isArray(order) ? order.slice() : [],
      idx: 0,
      input: '',
      checked: false,
      isCorrect: false,
      points: 0,
      attempts: 0,
      strictAccents: !!strictAccents,
      streak: 0,
      diffResult: null,
    };
  }

  function nextCard(state, opts) {
    var s = clone(state);
    var pool = (opts && Array.isArray(opts.poolIndices)) ? opts.poolIndices : s.order;
    var next = s.idx + 1;
    if (next >= s.order.length) {
      s.order = Utils && typeof Utils.shuffle === 'function' ? Utils.shuffle(pool) : (pool.slice ? pool.slice() : []);
      s.idx = 0;
    } else {
      s.idx = next;
    }
    s.input = '';
    s.checked = false;
    s.isCorrect = false;
    s.diffResult = null;
    return s;
  }

  function skipCard(state, opts) {
    var s = clone(state);
    s.attempts = (s.attempts|0) + 1;
    s.diffResult = null;
    return nextCard(s, opts);
  }

  function reveal(state, opts) {
    var s = clone(state);
    var answers = (opts && Array.isArray(opts.acceptedAnswers)) ? opts.acceptedAnswers : [];
    s.input = String((answers[0] == null ? '' : answers[0]));
    s.checked = true;
    s.isCorrect = false;
    s.attempts = (s.attempts|0) + 1;
    s.streak = 0;
    s.diffResult = null;
    return s;
  }

  function reshuffle(state, opts) {
    var s = clone(state);
    var pool = (opts && Array.isArray(opts.poolIndices)) ? opts.poolIndices : s.order;
    s.order = Utils && typeof Utils.shuffle === 'function' ? Utils.shuffle(pool) : (pool.slice ? pool.slice() : []);
    s.idx = 0;
    s.input = '';
    s.checked = false;
    s.isCorrect = false;
    s.points = 0;
    s.attempts = 0;
    s.diffResult = null;
    return s;
  }

  function resetStats(state) {
    var s = clone(state);
    s.idx = 0;
    s.input = '';
    s.checked = false;
    s.isCorrect = false;
    s.points = 0;
    s.attempts = 0;
    s.diffResult = null;
    return s;
  }

  function applyCheckResult(state, result) {
    var s = clone(state);
    var ok = !!(result && result.ok);
    s.checked = true;
    s.isCorrect = ok;
    s.attempts = (s.attempts|0) + 1;
    if (ok) {
      s.points = (s.points|0) + 1;
      s.diffResult = null;
      s.streak = (s.streak|0) + 1;
    } else {
      s.diffResult = result ? (result.diffResult || null) : null;
      s.streak = 0;
    }
    return s;
  }

  return {
    getInitialState: getInitialState,
    nextCard: nextCard,
    skipCard: skipCard,
    reveal: reveal,
    reshuffle: reshuffle,
    resetStats: resetStats,
    applyCheckResult: applyCheckResult,
  };
});