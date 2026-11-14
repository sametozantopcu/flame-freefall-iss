/* Arayüz metinleri. core/ metin üretmez; anahtar ya da kod döndürür, metin burada bulunur.
 * Yalnız İngilizce (en); dil seçimi yok.
 * Halo sesi: cümle düzeni, kısa, ünlem ve emoji yok.
 */
(function (FF) {
  var TEXTS = {
    en: {
      'app.title': 'Flame in Freefall',
      'app.event': 'Challenge 2026',
      'note.label': 'Honesty and limits',
      'nav.label': 'Sections',
      'nav.kesif': 'Explore',
      'nav.senaryo': 'Scenario',
      'nav.ekipman': 'Equipment',
      'nav.canli': 'Live',

      'unit.pct': '{v}%',
      'unit.cm_s': '{v} cm/s',
      'unit.ppm': '{v} ppm',
      'unit.kpa': '{v} kPa',
      'unit.c': '{v} °C',
      'unit.pts': '{v} pts',
      'unit.s': '{v} s',

      'chart.o2_axis': 'O₂, %',
      'chart.flow_axis': 'Flow, cm/s',
      'chart.burns': 'Burns',
      'chart.dies': 'Extinguishes',
      'chart.limit': 'Limit',
      'chart.tests': '{n} tests',
      'chart.min_label': '{o2}% · {u} cm/s',

      'kesif.eyebrow_list': 'PSI database',
      'kesif.eyebrow_chart': 'Olson flammability limit',
      'kesif.eyebrow_detail': 'Experiment',
      'kesif.count': '{n} experiments',
      'kesif.rows': 'Table rows',
      'kesif.test': 'Tests',
      'kesif.o2_initial': 'Initial O₂',
      'kesif.o2_range': '{lo}–{hi}%',
      'kesif.period': 'Period',
      'kesif.period_value': 'Feb–Aug 2014',
      'kesif.hardware': 'Hardware',
      'kesif.investigators': 'Investigators',
      'kesif.table_rows': 'Table rows',
      'kesif.no_table': 'No experiment table',
      'kesif.no_chart': 'No chart for this experiment yet.',
      'kesif.chart_aria': 'Olson flammability limit for {name}: the limit falls to {o2}% oxygen at {u} cm/s flow. On the right, the initial oxygen distribution of {n} tests.',
      'kesif.note': 'The curve is the Olson model, not a measurement; it is drawn for a rod with a 0.318 cm radius. Table rows do not always equal the number of tests. Four experiments have no table.',

      'senaryo.eyebrow_list': 'Conditions',
      'senaryo.eyebrow_chart': 'Scenario point',
      'senaryo.o2': 'Oxygen',
      'senaryo.o2_options': 'Oxygen options',
      'senaryo.flow': 'Flow',
      'senaryo.flow_options': 'Flow options',
      'senaryo.radius': 'Rod radius',
      'senaryo.radius_value': '{v} cm',
      'senaryo.burns': 'Burns',
      'senaryo.dies': 'Extinguishes',
      'senaryo.limit': 'Limit',
      'senaryo.regime': 'Regime',
      'regime.quiescent': 'Quiescent',
      'regime.radiative': 'Radiative branch',
      'regime.blowoff': 'Blowoff branch',
      'senaryo.nearest': 'Nearest tests',
      'senaryo.nearest_source': 'BASS-II',
      'senaryo.chart_aria': 'Scenario point: {o2}% oxygen, {u} cm/s flow. Olson limit {limit}%.',
      'senaryo.note': 'This is not a model prediction; the limit comes from the Olson formula and holds for rod-shaped PMMA. There is no prediction interval yet. Nearest tests are matched on oxygen only.',

      'ekipman.eyebrow_list': 'Findings',
      'ekipman.f1': 'Flames live on less oxygen',
      'ekipman.f1_earth': 'Earth, PMMA',
      'ekipman.f1_microg': 'Microgravity, BASS-II',
      'ekipman.f2': 'Ignition comes late',
      'ekipman.f2_std': 'Standard igniter time',
      'ekipman.f2_max': 'Longest delay in BASS-II',
      'ekipman.f3': 'A light breeze is the most dangerous',
      'ekipman.f3_band': 'Flow where flames hold on best',
      'ekipman.f3_band_value': '{lo}–{hi} cm/s',
      'ekipman.f3_min': 'Bottom of the Olson curve',
      'ekipman.f4': 'Near-limit flames make more CO',
      'ekipman.f4_ratio': 'Compared with Earth',
      'ekipman.f4_ratio_value': 'about {v}×',
      'ekipman.f4_sat': 'CO sensor saturation',
      'ekipman.device': 'FlameSense',
      'ekipman.device_state': 'Concept',
      'ekipman.device_text': 'Tracks O₂, CO, CO₂, particulates, flow, pressure and infrared temperature together.',
      'ekipman.chart_title': 'Extinction limit, O₂',
      'ekipman.earth': 'Earth',
      'ekipman.microg': 'Microgravity',
      'ekipman.air': 'Air, {v}%',
      'ekipman.chart_aria': 'Extinction limit comparison: {earth}% oxygen on Earth, {microg}% oxygen in microgravity. Air is {air}%.',
      'ekipman.takeaway': 'Within the {v}-point band that Earth tests call safe, flames keep burning in space.',
      'ekipman.note': 'Findings come from the BASS-II summary report and apply to PMMA only. The other 23 experiments are not on this screen yet. FlameSense is a concept, not a built device.',

      'canli.eyebrow_list': 'FlameSense readings',
      'canli.eyebrow_ring': 'Distance to extinction limit',
      'canli.calm': 'Calm',
      'canli.over': 'Below the limit',
      'canli.sample': 'Sample',
      'canli.o2': 'O₂',
      'canli.co': 'CO',
      'canli.co2': 'CO₂',
      'canli.flow': 'Flow',
      'canli.pressure': 'Pressure',
      'canli.ir': 'Infrared, max',
      'canli.limit': 'Extinction limit',
      'canli.margin': 'Above the limit',
      'canli.band': 'Flow band',
      'canli.band_in': 'within {lo}–{hi} cm/s',
      'canli.band_out': 'outside {lo}–{hi} cm/s',
      'canli.device': 'FlameSense',
      'canli.connected': 'Connected',
      'canli.disconnected': 'Not connected',
      'canli.ring_unit': 'points',
      'canli.ring_aria': 'Oxygen {o2}%; {margin} points above the extinction limit. The lit part of the ring shows this margin.',
      'canli.note': 'Values are samples; no device is connected. The extinction limit is computed from the Olson formula for {u} cm/s flow and rod-shaped PMMA. The longer the light, the more easily the flame lives.'
    }
  };

  // English only (MVP decision). No ?lang switch.
  FF.lang = 'en';
  document.documentElement.lang = FF.lang;

  /** Anahtarın metni; {ad} yer tutucuları params ile dolar. */
  FF.t = function (key, params) {
    var s = (TEXTS[FF.lang] || {})[key];
    if (s === undefined) return key;
    return s.replace(/\{(\w+)\}/g, function (m, k) { return params && params[k] !== undefined ? params[k] : m; });
  };

  /** Sayı biçimi: dile göre ondalık ayırıcı (dot). */
  FF.num = function (v, digits) {
    return Number(v).toFixed(digits === undefined ? 1 : digits);
  };

  /** Upper-case helper. */
  FF.upper = function (s) { return String(s).toLocaleUpperCase(FF.lang); };
})(window.FF = window.FF || {});
