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
      'nav.canli': 'FlameSense',

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
      'app.no_data': 'Data not built: run scripts/build_site_data.py',
      'explore.eyebrow_list': 'Habitat relevance ranking',
      'explore.eyebrow_detail': 'Investigation',
      'explore.count': '{n} investigations',
      'explore.score': 'Score',
      'explore.score_label': 'Habitat relevance score',
      'explore.known': '{k} of {n} components known',
      'explore.not_scorable': 'Not scorable: insufficient condition data',
      'explore.low_conf': 'Low confidence: fewer than {min} components known, so it is ranked below better-documented investigations.',
      'explore.low_conf_short': 'low confidence',
      'explore.low_conf_label': 'Low confidence — only {k} of {n} condition components known',
      'explore.low_conf_note': 'No headline score is shown: fewer than {min} components are known, so any number would be misleading.',
      'explore.known_list': 'Known components',
      'explore.not_scorable_short': 'not scorable',
      'explore.no_data': 'no data',
      'explore.na': 'n/a',
      'explore.comp.o2_overlap': 'O₂ range overlap',
      'explore.comp.pressure_overlap': 'Pressure overlap',
      'explore.comp.low_flow_overlap': 'Low-flow overlap',
      'explore.comp.has_flight': 'Microgravity flight data',
      'explore.comp.has_solid': 'Solid material data',
      'explore.comp.data_volume': 'Data volume',
      'explore.env_o2': 'O₂ studied',
      'explore.env_pressure': 'Pressure studied',
      'explore.env_flow': 'Flow studied',
      'explore.env_fuels': 'Fuels and materials',
      'explore.env_gravity': 'Gravity',
      'explore.env_rows': 'Table rows',
      'explore.doi': 'DOI',
      'explore.note': 'The score is an assumption, not a measurement. Weights: {weights}. Habitat ranges: O₂ {o2}%, pressure {p} kPa, flow up to {flow} cm/s. Unknown components are left out and the weights renormalised over the known ones (at least {min} needed); missing data is never counted as 0. There is no partial-gravity data: Moon and Mars gravity effects are not modelled.',
      'explore.nodata_note': 'Explore needs the built site data. Run scripts/build_site_data.py, then reload.',
      'scenario.eyebrow_list': 'Conditions',
      'scenario.eyebrow_stage': 'FLEX burn rate prediction',
      'scenario.fuel': 'Fuel',
      'scenario.diluent': 'Diluent',
      'scenario.o2': 'Oxygen',
      'scenario.pressure': 'Pressure',
      'scenario.d0': 'Initial droplet diameter',
      'scenario.frac': '{d} fraction',
      'scenario.range': 'Training range {lo} to {hi}',
      'scenario.output': 'Predicted burn rate K',
      'scenario.target': 'Target',
      'scenario.negative': 'outside the model\'s valid range',
      'scenario.intercept': 'Intercept',
      'scenario.note': 'Out-of-group cross-validated R²: {r2fd} across fuel×diluent groups ({gfd} groups), {r2y} across year groups ({gy} groups); n = {n}. Valid only for fuel/diluent combinations present in the training data. No partial-gravity data: Moon/Mars gravity effects are not modelled. Source: DOI {doi}.',
      'scenario.nodata_note': 'Scenario needs the built site data. Run scripts/build_site_data.py, then reload.',
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

      'equipment.eyebrow': 'Habitat equipment insights from PSI data',
      'equipment.implication': 'Equipment implication',
      'equipment.caveat': 'Limits and caveats',
      'equipment.no_doi': 'No DOI recorded',
      'equipment.na': 'n/a',
      'equipment.empty': 'No insight data loaded (data/site_data.js is missing).',
      'equipment.note': 'Each card is computed from NASA Physical Sciences Informatics (PSI) records and cites its DOI. Small samples and mixed conditions limit every number; read the caveat before using a card for design decisions.',

      'flamesense.tag': 'Concept — designed, not built',
      'flamesense.title': 'FlameSense',
      'flamesense.lead': 'A palm-sized fire-safety sensor box for a habitat. It exists as a 3D model only. No hardware has been built and no measurements exist.',
      'flamesense.dims': 'Enclosure',
      'flamesense.mcu': 'Microcontroller',
      'flamesense.ionization': 'Ionization channel',
      'flamesense.ionization_value': 'Concept only',
      'flamesense.sense_h': 'What it is planned to sense',
      'flamesense.sense_text': 'Air enters through a grille, passes a dust filter and a duct, and flows past the gas and flow sensors before leaving through the particulate sensor. The aim is to watch the air before and during a fire.',
      'flamesense.air_path': 'The lid carries an OLED, three status LEDs (Normal, Pre-fire, Fire), a buzzer and a thermal array.',
      'flamesense.guide_h': 'How the PSI findings guide the design',
      'flamesense.guide1': 'O₂ and CO₂ sensors are both included because the PMMA burns in BASS-II show their changes track each other; a mismatch can flag a sensor fault.',
      'flamesense.guide2': 'The particulate channel is planned to record material alongside particle size, since the smoke data show the trend reverses if material is ignored.',
      'flamesense.guide3': 'Ignition at cabin-like O₂ was only partial in the ACME data, so the plan treats ignition as possible but uncertain.',
      'flamesense.next_h': 'Planned next steps',
      'flamesense.next1': 'Order parts and build one bench prototype from the 3D model.',
      'flamesense.next2': 'Calibrate each sensor against a reference before any claim is made.',
      'flamesense.next3': 'Define alarm thresholds from the PSI-based insight cards, then test them on the bench.',
      'flamesense.cap_assembled': 'Closed enclosure (3D render)',
      'flamesense.cap_internal': 'Lid removed, labelled internal view (3D render)',
      'flamesense.cap_detail': 'Mainboard, cables and sensors close-up (3D render)',
      'flamesense.cap_exploded': 'Exploded view (3D render)',
      'flamesense.alt_assembled': 'Render of the closed FlameSense enclosure: white case with an orange stripe and a dark front panel',
      'flamesense.alt_internal': 'Render of the FlameSense enclosure with the lid removed, showing labelled sensors and the air path',
      'flamesense.alt_detail': 'Close-up render of the FlameSense mainboard, cables and sensors',
      'flamesense.alt_exploded': 'Exploded-view render of the FlameSense enclosure and its parts',
      'flamesense.note': 'FlameSense is a concept. The images are 3D renders of a design, not photographs of a device. Nothing here is a sensor reading, and no software or hardware has been tested.'
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
