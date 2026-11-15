/* Hareket: kaydırınca bir kez beliren öğeler ([data-reveal]) ve sayarak gelen sayılar ([data-count]).
 * Yalnızca sınıf ekler; görünüm theme.css içindedir (.js öneki + prefers-reduced-motion: no-preference).
 * IntersectionObserver yoksa ya da hareket azaltma açıksa her şey hemen görünür; içerik asla gizli kalmaz.
 */
(function (FF) {
  var ENTER_MS = 1900, COUNT_MS = 700;
  var io = null, started = false;

  function reduced() {
    return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /** Text of a count-up at progress p (0..1). Keeps sign, decimals and suffix; p >= 1 returns finalText as is.
   *  Text that does not start with a number is returned unchanged. */
  function countText(finalText, p) {
    var s = String(finalText), m = /^([−-]?)(\d+)(?:\.(\d+))?([\s\S]*)$/.exec(s);
    if (!m || !(p < 1)) return s;
    var digits = m[3] ? m[3].length : 0;
    var target = parseFloat(m[2] + (m[3] ? '.' + m[3] : ''));
    var q = Math.max(0, p), eased = 1 - Math.pow(1 - q, 3);
    var v = (target * eased).toFixed(digits);
    return (parseFloat(v) === 0 ? '' : m[1]) + v + m[4]; // no "-0.00" while the count is still at zero
  }

  function count(el) {
    var final = el.textContent, t0 = null;
    if (reduced() || typeof window.requestAnimationFrame !== 'function' || countText(final, 0) === final) return;
    function step(now) {
      if (t0 === null) t0 = now;
      var p = (now - t0) / COUNT_MS;
      el.textContent = countText(final, p);
      if (p < 1) window.requestAnimationFrame(step);
    }
    el.textContent = countText(final, 0);
    window.requestAnimationFrame(step);
  }

  function show(el, animate) {
    el.classList.add('in');
    if (!animate) return;
    if (el.hasAttribute && el.hasAttribute('data-enter')) {
      el.classList.add('enter');
      setTimeout(function () { el.classList.remove('enter'); }, ENTER_MS);
    }
    if (el.hasAttribute && el.hasAttribute('data-count')) count(el);
    if (el.querySelectorAll) Array.prototype.forEach.call(el.querySelectorAll('[data-count]'), count);
  }

  /** Watches every [data-reveal] under root; each one is shown once and then forgotten. */
  function init(root) {
    started = true;
    var els = Array.prototype.slice.call(root.querySelectorAll('[data-reveal]'));
    if (typeof IntersectionObserver === 'undefined') {
      els.forEach(function (el) { show(el, false); });
      return;
    }
    if (!io) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          show(e.target, !reduced());
        });
      }, { rootMargin: '0px', threshold: 0.01 }); // no bottom band: items at the very end of the page must still appear
    }
    els.forEach(function (el) { if (!el.classList.contains('in')) io.observe(el); });
  }

  // Safety net: if app.js failed before init, nothing may stay hidden.
  if (typeof window.addEventListener === 'function') {
    window.addEventListener('load', function () {
      if (started || typeof document === 'undefined' || !document.querySelectorAll) return;
      Array.prototype.forEach.call(document.querySelectorAll('[data-reveal]'), function (el) { el.classList.add('in'); });
    });
  }

  FF.motion = { countText: countText, init: init };
})(window.FF = window.FF || {});
