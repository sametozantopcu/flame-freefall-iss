/* Canlı: FlameSense okumaları. Şimdilik config.LIVE_SAMPLE içindeki ÖRNEK değerleri gösterir.
 * Işıklı öğe: halka. Işıklı pay, oksijenin sönme sınırının ne kadar üstünde olduğudur.
 */
(function (FF) {
  var C = FF.config, P = FF.physics, t = FF.t, num = FF.num;

  function render(root) {
    var U = FF.ui.components, CH = FF.ui.charts;
    var s = C.LIVE_SAMPLE;
    var limit = P.limitVsVelocity(s.flow_cm_s, C.R_REF_CM);
    var margin = s.o2_pct - limit;
    var band = C.GOLDILOCKS_CM_S;
    var inBand = s.flow_cm_s >= band[0] && s.flow_cm_s <= band[1];

    var list = U.row(t(margin > 0 ? 'canli.calm' : 'canli.over'), s.connected ? '' : t('canli.sample'), { dot: true })
      + U.rule()
      + U.row(t('canli.o2'), t('unit.pct', { v: num(s.o2_pct) }))
      + U.row(t('canli.co'), t('unit.ppm', { v: s.co_ppm }))
      + U.row(t('canli.co2'), t('unit.pct', { v: num(s.co2_pct, 2) }))
      + U.row(t('canli.flow'), t('unit.cm_s', { v: num(s.flow_cm_s) }))
      + U.row(t('canli.pressure'), t('unit.kpa', { v: num(s.pressure_kpa) }))
      + U.row(t('canli.ir'), t('unit.c', { v: s.ir_max_c }))
      + U.rule()
      + U.row(t('canli.limit'), t('unit.pct', { v: num(limit) }))
      + U.row(t('canli.margin'), t('unit.pts', { v: num(Math.max(margin, 0)) }))
      + U.row(t('canli.band'), t(inBand ? 'canli.band_in' : 'canli.band_out', { lo: band[0], hi: band[1] }))
      + U.rule()
      + U.row(t('canli.device'), t(s.connected ? 'canli.connected' : 'canli.disconnected'));

    var stage = CH.ring({
      share: margin / s.o2_pct,
      value: (margin >= 0 ? '+' : '−') + num(Math.abs(margin)),
      unit: t('canli.ring_unit'),
      aria: t('canli.ring_aria', { o2: num(s.o2_pct), margin: num(margin) })
    });

    root.innerHTML = U.screen({
      listLabel: t('canli.eyebrow_list'), list: list,
      stageLabel: t('canli.eyebrow_ring'), stage: stage, stageClass: 'center',
      note: t('canli.note', { u: num(s.flow_cm_s) })
    });
  }

  FF.views = FF.views || {};
  FF.views.canli = { render: render };
})(window.FF = window.FF || {});
