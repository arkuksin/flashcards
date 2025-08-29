// utils/confetti.js — tiny helper around canvas-confetti (CDN)
// Exposes window.confettiBurst() which fires a subtle celebratory burst.
(function () {
  try {
    var hasConfetti = typeof window !== 'undefined' && typeof window.confetti === 'function';
    window.confettiBurst = function (opts) {
      if (!hasConfetti) return;
      var count = (opts && opts.count) || 80;
      var spread = (opts && opts.spread) || 60;
      var startVelocity = (opts && opts.startVelocity) || 45;
      var decay = (opts && opts.decay) || 0.92;
      var scalar = (opts && opts.scalar) || 0.9;
      var origin = (opts && opts.origin) || { y: 0.35 };
      window.confetti({
        particleCount: count,
        spread: spread,
        startVelocity: startVelocity,
        decay: decay,
        scalar: scalar,
        origin: origin
      });
    };
  } catch (e) {
    // no-op if confetti is unavailable
  }
})();
