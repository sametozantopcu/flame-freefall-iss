/* Giriş noktası (repodaki app/streamlit_app.py'nin karşılığı): bölümleri çizer ve
 * adres çubuğundaki #bölüm değerine göre ilgili görünümü çalıştırır.
 * Adresler İngilizce (#explore, #scenario, #equipment, #live); eski Türkçe adresler de çalışır.
 * Giriş animasyonu (.enter) yalnızca bölüm değişince oynar; ekran içindeki seçimlerde oynamaz.
 */
(function (FF) {
  // [adres, görünüm] — görünüm adları dosya adlarıyla aynı (views/kesif.js ...).
  var PAGES = [['explore', 'kesif'], ['scenario', 'senaryo'], ['equipment', 'ekipman'], ['live', 'canli']];
  var shown = null, enterTimer = null;

  function current() {
    var id = (location.hash || '').replace('#', '');
    for (var i = 0; i < PAGES.length; i++) {
      if (PAGES[i][0] === id || PAGES[i][1] === id) return PAGES[i];
    }
    return PAGES[0];
  }

  function render() {
    var page = current(), view = page[1];
    var root = document.getElementById('view');
    var keep = location.search; // ?lang=tr gibi ayarlar bölüm bağlantılarında korunur
    document.title = FF.t('app.title') + ' · ' + FF.t('nav.' + view);
    document.getElementById('nav').innerHTML = PAGES.map(function (p, i) {
      return '<a href="' + keep + '#' + p[0] + '"' + (p[1] === view ? ' aria-current="page"' : '') + '>'
        + '<span class="n">0' + (i + 1) + '</span>' + FF.t('nav.' + p[1]) + '</a>';
    }).join('');

    if (view !== shown) {
      root.classList.add('enter');
      clearTimeout(enterTimer);
      enterTimer = setTimeout(function () { root.classList.remove('enter'); }, 1900);
      shown = view;
    }
    FF.views[view].render(root);
  }

  window.addEventListener('hashchange', render);
  document.getElementById('nav').setAttribute('aria-label', FF.t('nav.label'));
  document.getElementById('brand-name').textContent = FF.t('app.title');
  document.getElementById('brand-sub').textContent = FF.t('app.event');
  render();
})(window.FF = window.FF || {});
