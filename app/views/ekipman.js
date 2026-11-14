/* Ekipman: yangın güvenliği ekipmanı için bulgular. Kart yok; her bulgu numaralı bir satır grubu.
 * Işıklı öğe: mikro yerçekimi sönme sınırı çizgisi (Dünya çizgisi aynı ışığın soluk hali).
 */
(function (FF) {
  var C = FF.config, P = FF.physics, t = FF.t, num = FF.num;

  function render(root) {
    var U = FF.ui.components, CH = FF.ui.charts;
    var dim = { dim: true };

    var list = U.text(t('ekipman.f1'), { index: '01' })
      + U.row(t('ekipman.f1_earth'), t('unit.pct', { v: num(C.EARTH_PMMA_LOI_PCT) }), dim)
      + U.row(t('ekipman.f1_microg'), t('unit.pct', { v: num(C.MICROG_PMMA_LIMIT_PCT) }), dim)
      + U.rule()
      + U.text(t('ekipman.f2'), { index: '02' })
      + U.row(t('ekipman.f2_std'), t('unit.s', { v: C.STD6001_IGNITION_S }), dim)
      + U.row(t('ekipman.f2_max'), t('unit.s', { v: C.BASS2_MAX_IGNITION_S }), dim)
      + U.rule()
      + U.text(t('ekipman.f3'), { index: '03' })
      + U.row(t('ekipman.f3_band'), t('ekipman.f3_band_value', { lo: C.GOLDILOCKS_CM_S[0], hi: C.GOLDILOCKS_CM_S[1] }), dim)
      + U.row(t('ekipman.f3_min'), t('unit.cm_s', { v: num(P.mostDangerousVelocity(C.R_REF_CM)) }), dim)
      + U.rule()
      + U.text(t('ekipman.f4'), { index: '04' })
      + U.row(t('ekipman.f4_ratio'), t('ekipman.f4_ratio_value', { v: C.CO_MAX_ENHANCEMENT }), dim)
      + U.row(t('ekipman.f4_sat'), t('unit.ppm', { v: C.CO_SENSOR_SAT_PPM }), dim);

    var gap = C.EARTH_PMMA_LOI_PCT - C.MICROG_PMMA_LIMIT_PCT;
    var stage = CH.limitLines({
      earth: C.EARTH_PMMA_LOI_PCT, microg: C.MICROG_PMMA_LIMIT_PCT, air: C.AIR_O2_PCT,
      gapLabel: t('unit.pts', { v: num(gap) }),
      aria: t('ekipman.chart_aria', { earth: num(C.EARTH_PMMA_LOI_PCT), microg: num(C.MICROG_PMMA_LIMIT_PCT), air: C.AIR_O2_PCT })
    }) + '<div class="list takeaway">' + U.text(t('ekipman.takeaway', { v: num(gap) })) + '</div>'
      // FlameSense satırları sahnede: sol sütun ekran yüksekliğine sığsın.
      + '<div class="list">' + U.rule()
      + U.row(t('ekipman.device'), t('ekipman.device_state'))
      + U.text(t('ekipman.device_text'), dim) + '</div>';

    root.innerHTML = U.screen({
      listLabel: t('ekipman.eyebrow_list'), list: list,
      stageLabel: t('ekipman.chart_title'), stage: stage,
      note: t('ekipman.note')
    });
  }

  FF.views = FF.views || {};
  FF.views.ekipman = { render: render };
})(window.FF = window.FF || {});
