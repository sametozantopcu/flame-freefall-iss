/* Keşif: 24 deneyin listesi ve seçili deneyin ana nesnesi.
 * Işıklı öğe: Olson yanabilirlik eğrisi (şimdilik yalnızca BASS-II için).
 */
(function (FF) {
  var C = FF.config, D = FF.data, P = FF.physics, t = FF.t, num = FF.num;
  var state = { psi: C.DEFAULT_EXPERIMENT };

  function listHtml() {
    var U = FF.ui.components;
    var max = Math.max.apply(null, D.EXPERIMENTS.map(function (e) { return e.rows || 0; }));
    var rows = '';
    D.EXPERIMENTS.forEach(function (e) {
      // Oran çizgisi log ölçekli: 2 satır ile 1194 satır yan yana okunabilsin.
      var bar = e.rows ? Math.log(e.rows + 1) / Math.log(max + 1) : undefined;
      rows += U.rowButton(e.name, e.rows === null ? '—' : String(e.rows),
        { selected: e.psi === state.psi, dataKey: 'psi', dataValue: e.psi, bar: bar });
    });
    // 24 deney iki sütuna akar (önce sol sütun dolar), böylece liste ekran yüksekliğine sığar.
    return U.row(t('kesif.count', { n: D.EXPERIMENTS.length }), t('kesif.rows')) + U.rule()
      + U.grid2(rows, D.EXPERIMENTS.length, true);
  }

  function stageHtml(e) {
    var U = FF.ui.components, CH = FF.ui.charts;
    var head = U.row(e.name, e.psi) + U.text(e.title, { dim: true }) + U.rule();
    if (e.psi !== C.CHART_EXPERIMENT) {
      return '<div class="list">' + head
        + U.row(t('kesif.table_rows'), e.rows === null ? t('kesif.no_table') : String(e.rows))
        + U.text(t('kesif.no_chart'), { dim: true }) + '</div>';
    }
    var range = D.o2Range();
    var chart = CH.limitCurve({
      histogram: D.o2Histogram(),
      aria: t('kesif.chart_aria', {
        name: e.name, n: D.BASS2_TESTS.length,
        u: num(P.mostDangerousVelocity(C.R_REF_CM)), o2: num(P.minimumLimit())
      })
    });
    // Ayrıntılar iki sütunlu ızgarada: grafiğe daha çok yükseklik kalsın.
    return chart + '<div class="list">' + head + U.grid2(
      U.row(t('kesif.test'), String(D.BASS2_TESTS.length))
      + U.row(t('kesif.o2_initial'), t('kesif.o2_range', { lo: num(range[0]), hi: num(range[1]) }))
      + U.row(t('kesif.period'), t('kesif.period_value'))
      + U.row(t('kesif.hardware'), C.BASS2_HARDWARE)
      + U.row(t('kesif.investigators'), String(C.BASS2_INVESTIGATORS)), 5)
      + '</div>';
  }

  function render(root) {
    var e = D.EXPERIMENTS.filter(function (x) { return x.psi === state.psi; })[0];
    root.innerHTML = FF.ui.components.screen({
      listLabel: t('kesif.eyebrow_list'), list: listHtml(), listClass: 'wide',
      stageLabel: t(e.psi === C.CHART_EXPERIMENT ? 'kesif.eyebrow_chart' : 'kesif.eyebrow_detail'), stage: stageHtml(e),
      note: t('kesif.note')
    });
    Array.prototype.forEach.call(root.querySelectorAll('[data-psi]'), function (b) {
      b.addEventListener('click', function () { state.psi = b.getAttribute('data-psi'); render(root); });
    });
  }

  FF.views = FF.views || {};
  FF.views.kesif = { render: render };
})(window.FF = window.FF || {});
