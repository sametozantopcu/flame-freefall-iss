/* Giriş noktası (statik site, tek sayfa): dört görünümü kendi bölümüne bir kez çizer.
 * Gezinme çapa bağlantılarıyladır (#explore, #scenario, #equipment, #live); eski Türkçe adresler de çalışır.
 * Etkin bölüm kaydırmaya göre işaretlenir. Hareket ui/motion.js içindedir.
 * FF.app saf fonksiyonları DOM olmadan da tanımlanır (scripts/smoke_landing.mjs).
 */
(function (FF) {
  // [adres, görünüm] — görünüm adları dosya adlarıyla aynı (views/kesif.js ...).
  var SECTIONS = [
    { id: 'explore', view: 'kesif' }, { id: 'scenario', view: 'senaryo' },
    { id: 'equipment', view: 'ekipman' }, { id: 'live', view: 'canli' }
  ];
  // Kaydırınca tek tek beliren öğeler; yalnız bir kez çizilen görünümlerde (yeniden çizimde sınıf kaybolmasın).
  var REVEAL = { ekipman: '.xs-card, .note', canli: '.fs-tag, .fs-hero, .fs-sense, .fs-more > .fs-fig, .fs-cols > div, .note' };
  var COUNT = { ekipman: '.xs-big' };

  /** '#scenario' or legacy '#senaryo' -> 'scenario'; '#top' -> 'top'; unknown or empty -> null. */
  function resolveHash(hash) {
    var id = String(hash || '').replace(/^#/, '');
    if (id === 'top') return 'top';
    for (var i = 0; i < SECTIONS.length; i++) {
      if (SECTIONS[i].id === id || SECTIONS[i].view === id) return SECTIONS[i].id;
    }
    return null;
  }

  function navHtml(activeId) {
    return SECTIONS.map(function (s, i) {
      return '<a href="#' + s.id + '"' + (s.id === activeId ? ' aria-current="true"' : '') + '>'
        + '<span class="n">0' + (i + 1) + '</span>' + FF.t('nav.' + s.view) + '</a>';
    }).join('');
  }

  /** Hero numbers, read from site data only. A missing field drops its item; nothing is shown as 0. */
  function heroStats(site) {
    var out = [];
    function add(v, key) { if (typeof v === 'number' && isFinite(v)) out.push({ value: v, label: FF.t(key) }); }
    if (!site) return out;
    add(site.investigations && site.investigations.length, 'hero.stat_investigations');
    add(site.model && site.model.cv && site.model.cv.fuel_diluent && site.model.cv.fuel_diluent.n, 'hero.stat_tests');
    add(site.cards && site.cards.length, 'hero.stat_findings');
    return out.filter(function (s) { return s.value > 0; });
  }

  FF.app = { SECTIONS: SECTIONS, resolveHash: resolveHash, navHtml: navHtml, heroStats: heroStats };

  var main = document.getElementById && document.getElementById('main');
  if (!main) return;

  var nav = document.getElementById('nav'), top = document.querySelector('.top');
  var each = function (list, fn) { Array.prototype.forEach.call(list, fn); };

  function setActive(id) {
    each(nav.querySelectorAll('a'), function (a) {
      if (a.getAttribute('href') === '#' + id) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }

  /** Scrolls to a section and moves keyboard focus there. */
  function go(id, instant) {
    var el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView(instant ? { behavior: 'instant', block: 'start' } : { block: 'start' });
    if (el.focus) el.focus({ preventScroll: true });
  }

  function measure() { document.documentElement.style.setProperty('--top-h', top.offsetHeight + 'px'); }

  // Metinler
  each(document.querySelectorAll('[data-t]'), function (el) { el.textContent = FF.t(el.getAttribute('data-t')); });
  nav.setAttribute('aria-label', FF.t('nav.label'));
  document.getElementById('brand-name').textContent = FF.t('app.title');
  document.getElementById('brand-sub').textContent = FF.t('app.event');
  document.getElementById('brand-team').textContent = FF.t('app.team');
  nav.innerHTML = navHtml(null);

  // Hero sayıları
  var stats = heroStats(FF.site), statsEl = document.getElementById('hero-stats');
  var esc = FF.ui.components.esc;
  statsEl.innerHTML = stats.map(function (s) {
    return '<div class="hero-stat"><span class="hero-num" data-count>' + esc(s.value) + '</span><span class="hero-lab">' + esc(s.label) + '</span></div>';
  }).join('');
  if (!stats.length) statsEl.hidden = true;

  // Görünümler: her biri kendi bölümüne. Biri hata verse de diğerleri çizilir.
  SECTIONS.forEach(function (s) {
    var root = document.querySelector('#' + s.id + ' .view');
    try { FF.views[s.view].render(root); } catch (e) { root.textContent = FF.t('app.no_data'); if (window.console) console.error(e); }
    if (REVEAL[s.view]) {
      var row = 0, lastTop = null;
      each(root.querySelectorAll(REVEAL[s.view]), function (el) {
        var y = el.offsetTop; // öğeler aynı satırdaysa sırayla gecikir
        row = y === lastTop ? row + 1 : 0; lastTop = y;
        el.setAttribute('data-reveal', '');
        el.style.setProperty('--i', row);
      });
    }
    if (COUNT[s.view]) each(root.querySelectorAll(COUNT[s.view]), function (el) { el.setAttribute('data-count', ''); });
  });

  measure();
  window.addEventListener('resize', measure);

  // Etkin bölüm: ekranın ortasından geçen bölüm.
  if (typeof IntersectionObserver !== 'undefined') {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) setActive(e.target.id);
      });
    }, { rootMargin: '-45% 0px -54% 0px' });
    each(main.children, function (s) { if (s.id) spy.observe(s); });
  }

  // Çapa gezinmesi: kaydır ve odağı bölüme ver. Eski adresler yeni kimliğe çevrilir.
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest && ev.target.closest('a[href^="#"]');
    var id = a && resolveHash(a.getAttribute('href'));
    if (!id || ev.defaultPrevented || ev.button || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
    ev.preventDefault();
    history.pushState(null, '', location.search + '#' + id);
    go(id);
  });
  function fromHash(instant) {
    var id = resolveHash(location.hash);
    if (!id) return;
    if ('#' + id !== location.hash) history.replaceState(null, '', location.search + '#' + id);
    go(id, instant);
  }
  // Back/forward between pushState entries fires hashchange; returning to the entry without a hash goes to the top.
  window.addEventListener('hashchange', function () {
    if (!location.hash) go('top'); else fromHash(false);
  });

  // Connection point for the assistant panel (S8): ui/ask.js sets FF.mountAsk; absent file is harmless.
  if (typeof FF.mountAsk === 'function') {
    FF.mountAsk(document.getElementById('ask') || document.body);
    var ask = document.getElementById('hero-ask'), fab = document.querySelector('.chat-fab');
    if (ask && fab) { ask.hidden = false; ask.addEventListener('click', function () { fab.click(); }); }
  }

  if (FF.motion && FF.motion.init) FF.motion.init(document);
  // Görünümler çizildikten sonra sayfa uzar; adresteki bölüme şimdi gidilir.
  fromHash(true);
})(window.FF = window.FF || {});
