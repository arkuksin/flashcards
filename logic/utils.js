(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    // CommonJS / Node
    module.exports = factory();
  } else {
    // Browser: attach to window (or globalThis)
    var existing = root.Utils || {};
    var created = factory();
    // Preserve anything that may already exist under Utils
    root.Utils = Object.assign({}, existing, created);
  }
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this), function () {
  'use strict';

  // Remove diacritics by using NFD normalization and stripping combining marks
  function stripDiacritics(s) {
    return String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  // Normalize a user-entered string: lowercase, strip diacritics, remove punctuation, collapse spaces
  function normalize(s) {
    return stripDiacritics(String(s || '').toLowerCase())
      .replace(/[!?.,;:¿¡\/\\()\[\]{}'\"`´’‛“”„–—-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Fisher–Yates shuffle that returns a new array (does not mutate the input)
  function shuffle(array) {
    var a = Array.isArray(array) ? array.slice() : [];
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  return {
    stripDiacritics: stripDiacritics,
    normalize: normalize,
    shuffle: shuffle
  };
});
