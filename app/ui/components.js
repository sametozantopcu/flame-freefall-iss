/* Halo bileşenleri: HTML metni üreten küçük fonksiyonlar (repodaki app/ui/components.py'nin karşılığı).
 * Yalnızca düz satırlar var: kart, rozet, ikon yok. Süsleme ışıkla yapılır (nokta, solan çizgi, köşe işareti).
 */
(function (FF) {
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /** Bir satır. opts: dim (ayrıntı satırı), gap (üstte boşluk), valueInk (değer de parlak),
   *  dot (başlığın önünde nabız atan ışıklı nokta). */
  function row(title, value, opts) {
    opts = opts || {};
    var cls = 'row' + (opts.dim ? ' dim' : '') + (opts.gap ? ' gap' : '');
    var v = value === undefined || value === null || value === '' ? ''
      : '<span' + (opts.dim || opts.valueInk ? '' : ' class="v"') + '>' + esc(value) + '</span>';
    var dot = opts.dot ? '<i class="dot" aria-hidden="true"></i>' : '';
    return '<div class="' + cls + '"><span>' + dot + esc(title) + '</span>' + v + '</div>';
  }

  /** Dokunulabilir satır. data-* öznitelikleri görünümün olay dinleyicisi için.
   *  opts.bar: 0..1 ise değerin solunda ince oran çizgisi çizilir. */
  function rowButton(title, value, opts) {
    opts = opts || {};
    var cls = 'row' + (opts.selected ? ' hl' : ' dim');
    var bar = typeof opts.bar === 'number'
      ? '<i class="bar" style="--w:' + opts.bar.toFixed(3) + '" aria-hidden="true"></i>' : '';
    return '<button type="button" class="' + cls + '" aria-pressed="' + (opts.selected ? 'true' : 'false') + '"'
      + ' data-' + opts.dataKey + '="' + esc(opts.dataValue) + '">'
      + '<span>' + esc(title) + '</span><span class="val">' + bar + esc(value) + '</span></button>';
  }

  /** Tek metin satırı. opts.index: başlığın önünde soluk sıra numarası ("01"). */
  function text(s, opts) {
    opts = opts || {};
    var idx = opts.index ? '<span class="idx">' + esc(opts.index) + '</span>' : '';
    return '<div class="row' + (opts.dim ? ' dim' : '') + '"><span>' + idx + esc(s) + '</span></div>';
  }

  function rule() { return '<div class="rule"></div>'; }

  /** Küçük üst etiket: büyük harf, aralıklı, önünde kısa çizgi. */
  function eyebrow(s) { return '<div class="eyebrow">' + esc(s) + '</div>'; }

  /** Satır içi seçenekler, ray üzerinde noktalarla. items: [{label, value, on}] */
  function options(ariaLabel, dataKey, items) {
    return '<div class="options" role="group" aria-label="' + esc(ariaLabel) + '">'
      + items.map(function (it) {
        return '<button type="button" aria-pressed="' + (it.on ? 'true' : 'false') + '" data-' + dataKey + '="' + esc(it.value) + '">'
          + '<span>' + esc(it.label) + '</span></button>';
      }).join('') + '</div>';
  }

  function note(s) {
    return '<div class="note">' + eyebrow(FF.t('note.label')) + '<span class="text">' + esc(s) + '</span></div>';
  }

  /** Grafik plakası: köşe işaretli alan. ar (en/boy) verilirse sahnede kalan alanı doldurur
   *  ve grafik bu oranı koruyarak sığabildiği en büyük boyuta gelir. */
  function plate(html, ar) {
    if (!ar) return '<div class="plate">' + html + '</div>';
    return '<div class="plate-fit"><div class="plate fill" style="--ar:' + ar.toFixed(4) + '">' + html + '</div></div>';
  }

  /** İki sütunlu satır ızgarası. down: sütun sütun akar (önce sol sütun dolar). */
  function grid2(html, count, down) {
    return '<div class="grid2' + (down ? ' cols-down' : '') + '"'
      + (down ? ' style="--rows:' + Math.ceil(count / 2) + '"' : '') + '>' + html + '</div>';
  }

  /** İki sütunlu ekran: solda satırlar, sağda ana nesne; altta dürüstlük bandı.
   *  o: {list, stage, note, listLabel, stageLabel, stageClass, listClass} */
  function screen(o) {
    return '<div class="cols"><div class="list' + (o.listClass ? ' ' + o.listClass : '') + '">'
      + (o.listLabel ? eyebrow(o.listLabel) : '') + o.list + '</div>'
      + '<div class="stage' + (o.stageClass ? ' ' + o.stageClass : '') + '">'
      + (o.stageLabel ? eyebrow(o.stageLabel) : '') + o.stage + '</div></div>'
      + note(o.note);
  }

  FF.ui = FF.ui || {};
  FF.ui.components = {
    esc: esc, row: row, rowButton: rowButton, text: text, rule: rule, eyebrow: eyebrow,
    options: options, note: note, plate: plate, grid2: grid2, screen: screen
  };
})(window.FF = window.FF || {});
