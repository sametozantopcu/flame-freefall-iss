/* Senaryo: oksijen ve akış seçilir; Olson sınırına göre pay hesaplanır.
 * Işıklı öğe: senaryo noktası. Değer, satırın altındaki seçeneklere dokununca yerinde değişir.
 */
(function (FF) {
  var C = FF.config, D = FF.data, P = FF.physics, t = FF.t, num = FF.num;
  var state = { o2: C.DEFAULT_O2, u: C.DEFAULT_FLOW };

  function evaluate() {
    var a = P.strainRate(state.u, C.R_REF_CM);
    var limit = P.olsonLimit(a);
    return { limit: limit, margin: state.o2 - limit, regime: P.regime(a) };
  }

  function render(root) {
    var U = FF.ui.components, CH = FF.ui.charts;
    var r = evaluate();
    var burns = r.margin > 0;

    var list = U.row(t('senaryo.o2'), t('unit.pct', { v: num(state.o2) }), { valueInk: true })
      + U.options(t('senaryo.o2_options'), 'o2', C.O2_OPTIONS.map(function (v) {
        return { label: String(v), value: v, on: v === state.o2 };
      }))
      + U.row(t('senaryo.flow'), t('unit.cm_s', { v: num(state.u) }), { valueInk: true, gap: true })
      + U.options(t('senaryo.flow_options'), 'u', C.FLOW_OPTIONS.map(function (v) {
        return { label: num(v, v < 1 ? 1 : 0), value: v, on: v === state.u };
      }))
      + U.row(t('senaryo.radius'), t('senaryo.radius_value', { v: num(C.R_REF_CM, 3) }), { dim: true, gap: true })
      + U.rule()
      + U.row(t(burns ? 'senaryo.burns' : 'senaryo.dies'),
        t('unit.pts', { v: (burns ? '+' : '−') + num(Math.abs(r.margin)) }), { valueInk: true })
      + U.row(t('senaryo.limit'), t('unit.pct', { v: num(r.limit) }), { dim: true })
      + U.row(t('senaryo.regime'), t('regime.' + r.regime), { dim: true })
      + U.rule()
      + U.row(t('senaryo.nearest'), t('senaryo.nearest_source'))
      + D.nearestByO2(state.o2, C.NEAREST_COUNT).map(function (x) {
        return U.row(x.test + ' · ' + x.pi, t('unit.pct', { v: num(x.o2) }), { dim: true });
      }).join('');

    var chart = CH.scenarioPoint({
      o2: state.o2, u: state.u, limit: r.limit,
      marginLabel: t('unit.pts', { v: (burns ? '+' : '−') + num(Math.abs(r.margin)) }),
      aria: t('senaryo.chart_aria', { o2: num(state.o2), u: num(state.u), limit: num(r.limit) })
    });

    root.innerHTML = U.screen({
      listLabel: t('senaryo.eyebrow_list'), list: list,
      stageLabel: t('senaryo.eyebrow_chart'), stage: chart,
      note: t('senaryo.note')
    });
    Array.prototype.forEach.call(root.querySelectorAll('[data-o2]'), function (b) {
      b.addEventListener('click', function () { state.o2 = parseFloat(b.getAttribute('data-o2')); render(root); });
    });
    Array.prototype.forEach.call(root.querySelectorAll('[data-u]'), function (b) {
      b.addEventListener('click', function () { state.u = parseFloat(b.getAttribute('data-u')); render(root); });
    });
  }

  FF.views = FF.views || {};
  FF.views.senaryo = { render: render };
})(window.FF = window.FF || {});
