(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    // CommonJS / Node
    module.exports = factory(require, root);
  } else {
    // Browser: attach to window/global
    root.checkAnswer = factory(null, root);
  }
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this), function (req, root) {
  'use strict';

  // Resolve Utils (normalize, stripDiacritics)
  var Utils;
  try {
    if (typeof module === 'object' && module.exports && typeof req === 'function') {
      // This file is in logic/, so utils is ./utils.js
      Utils = req('./utils.js');
    } else {
      Utils = (root && root.Utils) ? root.Utils : {};
    }
  } catch (e) {
    Utils = (root && root.Utils) ? root.Utils : {};
  }

  // Pure function: checks if input matches any accepted answer under selected accent strictness
  function checkAnswer(input, acceptedAnswers, opts) {
    var strictAccents = !!(opts && opts.strictAccents);
    var normInput = strictAccents
      ? Utils.normalize(input)
      : Utils.normalize(Utils.stripDiacritics(input));

    if (!Array.isArray(acceptedAnswers) || acceptedAnswers.length === 0) return false;

    for (var i = 0; i < acceptedAnswers.length; i++) {
      var ans = String(acceptedAnswers[i] == null ? '' : acceptedAnswers[i]);
      var normTarget = strictAccents
        ? Utils.normalize(ans)
        : Utils.normalize(Utils.stripDiacritics(ans));
      if (normInput === normTarget) return true;
    }
    return false;
  }

  return checkAnswer;
});
