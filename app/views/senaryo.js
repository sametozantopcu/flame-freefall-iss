/* Scenario: FLEX what-if (M2). The prediction runs in the browser from the exported Ridge coefficients
 * (FF.model.predict, same arithmetic as src/prediction/flex_model.py). Inputs are limited to the training data.
 */
(function (FF) {
  var t = FF.t, num = FF.num;
  var state = null;

  function esc(s) { return FF.ui.components.esc(s); }

  function init(model) {
    var c0 = model.known_combos[0], imp = model.impute;
    state = { fuel: c0.fuel, diluent: c0.diluent, x_o2: imp.x_o2, p_atm: imp.p_atm, d0_mm: imp.d0_mm, frac: null, xvar: 'x_o2' };
  }

  function combos(model) { return model.known_combos; }
  function diluentsFor(model, fuel) {
    return model.known_combos.filter(function (c) { return c.fuel === fuel; }).map(function (c) { return c.diluent; });
  }
  /** Diluent fraction feature: He -> x_he, CO2 -> x_co2, N2 -> none (both stay 0). */
  function fracKey(d) { return d === 'He' ? 'x_he' : d === 'CO2' ? 'x_co2' : null; }

  function clamp(v, r) { return Math.min(r.max, Math.max(r.min, v)); }

  /** Inputs are clamped to the training ranges before prediction. */
  function inputRow(model) {
    var k = fracKey(state.diluent), r = model.ranges;
    var row = { d0_mm: clamp(state.d0_mm, r.d0_mm), p_atm: clamp(state.p_atm, r.p_atm), x_o2: clamp(state.x_o2, r.x_o2),
      x_he: 0, x_co2: 0, fuel: state.fuel, diluent: state.diluent };
    if (k) row[k] = clamp(state.frac === null ? model.impute[k] : state.frac, r[k]);
    return row;
  }

  function slider(id, label, unit, lo, hi, step, val, digits) {
    return '<div class="row"><label for="s-' + id + '">' + esc(label) + '</label><span class="v" id="v-' + id + '">'
      + esc(num(val, digits) + unit) + '</span></div>'
      + '<input class="ff-range" type="range" id="s-' + id + '" data-slider="' + id + '" min="' + lo + '" max="' + hi
      + '" step="' + step + '" value="' + val + '" aria-label="' + esc(label) + '">'
      + '<div class="row dim"><span>' + esc(t('scenario.range', { lo: num(lo, digits), hi: num(hi, digits) })) + '</span></div>';
  }

  function headHtml(model) {
    var U = FF.ui.components;
    var y = FF.model.predict(model, inputRow(model));
    return U.row(t('scenario.output'), y < 0 ? t('scenario.negative') : num(y, 3) + ' mm²/s', { valueInk: true, dot: true })
      + U.row(t('scenario.target'), model.target, { dim: true });
  }

  function breakdownHtml(model) {
    var U = FF.ui.components;
    var parts = FF.model.explain(model, inputRow(model));
    var h = U.row(t('scenario.intercept'), num(model.coef.intercept, 3), { dim: true });
    parts.forEach(function (p) {
      h += U.row(p.column, (p.value >= 0 ? '+' : '−') + num(Math.abs(p.value), 3), { dim: true });
    });
    return h;
  }

  /** Chart x-variables: model feature, display scale, axis label key, unit. */
  var XVARS = [
    { id: 'x_o2', scale: 100, label: 'scenario.o2', unit: '%' },
    { id: 'p_atm', scale: 1, label: 'scenario.pressure', unit: 'atm' },
    { id: 'd0_mm', scale: 1, label: 'scenario.d0', unit: 'mm' }
  ];
  function xvar() { return XVARS.filter(function (v) { return v.id === state.xvar; })[0] || XVARS[0]; }

  /** FLEX response curve: K from FF.model.predict over the training range of one input, others held at the current
   *  scenario. Nothing outside the training range; negative predictions are not drawn (chart splits there). */
  function chartHtml(model) {
    var xv = xvar(), r = model.ranges[xv.id], row = inputRow(model), curve = [], i, n = 80;
    for (i = 0; i <= n; i++) {
      var x = r.min + (r.max - r.min) * i / n, rr = {};
      Object.keys(row).forEach(function (k) { rr[k] = row[k]; });
      rr[xv.id] = x;
      curve.push([x * xv.scale, FF.model.predict(model, rr)]);
    }
    var y = FF.model.predict(model, row);
    return FF.ui.charts.response({
      curve: curve, xr: [r.min * xv.scale, r.max * xv.scale], cur: { x: row[xv.id] * xv.scale, y: y },
      xLabel: t(xv.label) + ', ' + xv.unit, yLabel: t('scenario.chart_y'),
      aria: t('scenario.chart_aria', { x: t(xv.label), fuel: state.fuel, diluent: state.diluent })
    }) + '<div class="chart-cap">' + esc(t('scenario.chart_cap', { r2: num(model.cv.fuel_diluent.r2, 3), g: model.cv.fuel_diluent.n_groups })) + '</div>';
  }

  function xOptions() {
    return FF.ui.components.options(t('scenario.chart_x'), 'xvar', XVARS.map(function (v) { return { label: t(v.label), value: v.id, on: v.id === state.xvar }; }));
  }

  function stageHtml(model) {
    var U = FF.ui.components;
    return '<div class="list" id="sc-head">' + headHtml(model) + '</div>'
      + '<div id="sc-chart">' + chartHtml(model) + '</div>'
      + '<div class="list">' + U.row(t('scenario.chart_x'), '', { dim: true }) + xOptions() + '</div>'
      + U.scroll('<div id="sc-out">' + U.rule() + breakdownHtml(model) + '</div>', 'detail');
  }

  function noteText(model) {
    var cv = model.cv, fd = cv.fuel_diluent, yr = cv.year;
    return t('scenario.note', {
      r2fd: num(fd.r2, 3), r2y: num(yr.r2, 3), n: model.n, doi: model.doi,
      gfd: fd.n_groups, gy: yr.n_groups
    });
  }

  /* ---- Material risk index (R4). Everything shown is read from the precomputed grid in FF.site.risk
   *  (Python engine output). No interpolation: input values are grid indices. Independent of the FLEX model. ---- */
  var rstate = null;

  function riskData() {
    var R = FF.site && FF.site.risk;
    return R && R.grid && R.axes && R.axes.o2_pct && R.axes.pressure_kpa && R.materials && R.materials.length
      && R.fields && R.component_keys && R.provenance ? R : null;
  }
  function nearestIdx(axis, v) {
    var best = 0, i;
    for (i = 1; i < axis.length; i++) if (Math.abs(axis[i] - v) < Math.abs(axis[best] - v)) best = i;
    return best;
  }
  function riskInit(R) {
    var iss = (R.presets || []).filter(function (p) { return p.key === 'iss'; })[0] || R.presets && R.presets[0];
    var hasPmma = R.materials.some(function (m) { return m.key === 'PMMA'; });
    rstate = {
      material: hasPmma ? 'PMMA' : R.materials[0].key,
      oi: iss ? nearestIdx(R.axes.o2_pct, iss.o2_pct) : 0,
      pi: iss ? nearestIdx(R.axes.pressure_kpa, iss.pressure_kpa) : R.axes.pressure_kpa.length - 1
    };
  }
  /** One grid cell as an object (field names from R.fields; warnings resolved to keys). */
  function riskCell(R, mat, pi, oi) {
    var a = R.grid[mat][pi][oi], c = { comp: {} };
    R.fields.forEach(function (k, i) {
      if (k.indexOf('components.') === 0) c.comp[k.slice(11)] = a[i]; else c[k] = a[i];
    });
    c.warn = (c.warnings || []).map(function (i) { return R.warning_keys[i]; });
    return c;
  }
  function materialOf(R, key) { return R.materials.filter(function (m) { return m.key === key; })[0]; }
  function provOf(R, comp) { return R.provenance.filter(function (p) { return p.component === comp; })[0]; }
  function isNum(v) { return typeof v === 'number' && isFinite(v); }

  function badgeHtml(basis) {
    return '<span class="sc-badge" data-basis="' + esc(basis) + '">' + esc(t('risk.basis.' + basis)) + '</span>';
  }
  /** Evidence line: basis badge, n, R2 (weak-fit note under 0.1, refit comparison for the spread record), DOI. */
  function metaHtml(rec) {
    var h = badgeHtml(rec.basis);
    if (isNum(rec.n)) h += '<span>n=' + esc(rec.n) + '</span>';
    if (isNum(rec.r2)) {
      var s = 'R² ' + num(rec.r2, 3) + (rec.r2 < 0.1 ? ' — ' + t('risk.comp.weak') : '');
      if (rec.feature_store_refit && rec.embedded && rec.refit_differs) {
        s += '; ' + t('risk.comp.refit', { coef: num(rec.feature_store_refit.coef, 3), n: rec.feature_store_refit.n,
          r2: num(rec.feature_store_refit.r2, 3), emb: num(rec.embedded.coef, 3) });
      }
      h += '<span>' + esc(s) + '</span>';
    }
    if (rec.doi) h += '<a href="https://doi.org/' + esc(rec.doi) + '" target="_blank" rel="noopener">DOI ' + esc(rec.doi) + '</a>';
    return h;
  }
  function noteOf(rec) {
    var p = {};
    if (rec.params && isNum(rec.params.exponent)) p.exp = num(rec.params.exponent, 2);
    return t(rec.note_key, p);
  }

  function componentsHtml(R, cell) {
    var h = '';
    R.component_keys.forEach(function (k) {
      var v = cell.comp[k], rec = provOf(R, k), w = R.weights && R.weights[k];
      h += '<div class="sc-comp" data-risk-comp="' + esc(k) + '"><div class="sc-comp-top"><span>' + esc(t('risk.comp.' + k)) + '</span>'
        + '<span class="sc-comp-val">' + (isNum(v) ? num(v, 2) : esc(t('risk.comp.nodata')))
        + (isNum(w) ? ' <span class="dim">' + esc(t('risk.comp.weight', { w: num(w, 2) })) + '</span>' : '') + '</span></div>'
        + '<div class="sc-bar" aria-hidden="true"><i style="width:' + (isNum(v) ? (Math.min(1, Math.max(0, v)) * 100).toFixed(1) : 0) + '%"></i></div>'
        + (rec ? '<div class="sc-meta">' + metaHtml(rec) + '</div><div class="sc-note">' + esc(noteOf(rec)) + '</div>' : '')
        + '</div>';
    });
    return h;
  }

  function resultHtml(R, cell, mat) {
    var idx = cell.risk_index, lvl = cell.risk_level, th = R.level_thresholds || { medium: 35, critical: 65 };
    var pips = { low: 1, medium: 2, critical: 3 }[lvl] || 0, i, pipHtml = '';
    for (i = 1; i <= 3; i++) pipHtml += '<i class="' + (i <= pips ? 'on' : '') + '"></i>';
    var h = '<div><div class="sc-sec">' + esc(t('risk.out.index')) + '</div><div class="sc-idxrow">'
      + '<span class="sc-idx" id="risk-index">' + (isNum(idx) ? num(idx, 1) : '—') + '</span>'
      + (lvl ? '<span class="sc-level" data-risk-level="' + esc(lvl) + '"><span class="sc-pips" aria-hidden="true">' + pipHtml + '</span>'
        + '<span>' + esc(t('risk.level.' + lvl)) + '</span></span>' : '')
      + '</div>'
      + '<div class="sc-meter-wrap"><div class="sc-meter" role="img" aria-label="' + esc(t('risk.out.scale')) + '"><i class="fill" style="width:'
      + (isNum(idx) ? Math.min(100, Math.max(0, idx)).toFixed(1) : 0) + '%"></i><i class="mk" style="left:' + th.medium + '%"></i><i class="mk" style="left:' + th.critical + '%"></i></div>'
      + '<div class="sc-meter-lab" aria-hidden="true"><span style="left:0">0</span><span style="left:' + th.medium + '%">' + th.medium
      + '</span><span style="left:' + th.critical + '%">' + th.critical + '</span><span style="right:0">100</span></div></div>';
    var kind = mat && mat.inert ? 'inert' : isNum(cell.margin_pct) && cell.margin_pct > 0 ? 'yes' : 'no';
    var limit = isNum(cell.threshold_o2_pct) ? num(cell.threshold_o2_pct, 1) : '—';
    var ans = kind === 'inert' ? t('risk.flammable.inert')
      : kind === 'yes' ? t('risk.flammable.yes', { margin: num(cell.margin_pct, 1), limit: limit })
        : t('risk.flammable.no', { limit: limit });
    h += '<div class="sc-flam" data-risk-flammable="' + kind + '"><div class="sc-flam-q">' + esc(t('risk.out.flammable')) + '</div>'
      + '<div class="sc-flam-a">' + esc(ans) + '</div><div class="sc-note">' + esc(t('risk.flammable.note')) + '</div></div>';
    var tags = '', inline = '';
    cell.warn.forEach(function (k) {
      if (k === 'above_threshold_low_index') return; // explained by the separate reading above, not a per-cell alarm
      if (k === 'clipped_below_reference') inline = '<div class="sc-note" data-risk-tag="' + k + '">' + esc(t('risk.warn.' + k)) + '</div>';
      else tags += '<span class="sc-tag" data-risk-tag="' + esc(k) + '">' + esc(t('risk.tag.' + k)) + '</span>';
    });
    h += inline + (tags ? '<div class="sc-tags">' + tags + '</div>' : '');
    h += U_row(t('risk.out.po2'), isNum(cell.pO2_atm) ? num(cell.pO2_atm, 3) + ' atm' : '—')
      + U_row(t('risk.out.limit'), limit + ' %');
    return h + '</div>';
  }
  function U_row(a, b) { return FF.ui.components.row(a, b, { dim: true }); }

  function riskChartHtml(R, cell, mat) {
    var ox = R.axes.o2_pct, p = R.axes.pressure_kpa[rstate.pi], curve = [], i;
    for (i = 0; i < ox.length; i++) curve.push([ox[i], R.grid[mat.key][rstate.pi][i][R.fields.indexOf('risk_index')]]);
    var th = R.level_thresholds || { medium: 35, critical: 65 }, lim = cell.threshold_o2_pct;
    var inRange = isNum(lim) && lim >= ox[0] && lim <= ox[ox.length - 1];
    var cap = t('risk.chart.cap', { mat: mat.label, p: num(p, 1) }) + ' '
      + (isNum(lim) ? (inRange ? t('risk.chart.cap_limit', { v: num(lim, 1) }) : t('risk.chart.cap_limit_out', { v: num(lim, 1) })) : '');
    return '<div class="sc-chartbox">' + FF.ui.charts.riskCurve({
      curve: curve, xr: [ox[0], ox[ox.length - 1]], cur: { x: ox[rstate.oi], y: cell.risk_index },
      levels: [{ y: th.medium, label: t('risk.chart.medium', { v: th.medium }) }, { y: th.critical, label: t('risk.chart.critical', { v: th.critical }) }],
      limit: inRange ? { x: lim, label: t('risk.chart.limit', { v: num(lim, 1) }) } : null,
      xLabel: t('risk.chart.x'), yLabel: t('risk.chart.y'),
      aria: t('risk.chart.aria', { mat: mat.label, p: num(p, 1), o: num(ox[rstate.oi], 1) })
    }) + '<div class="chart-cap">' + esc(cap) + '</div></div>';
  }

  /** Result, components and chart: everything that changes while the O2 slider moves. */
  function riskOutHtml(R) {
    var mat = materialOf(R, rstate.material), cell = riskCell(R, mat.key, rstate.pi, rstate.oi);
    return '<div class="sc-cell">' + resultHtml(R, cell, mat) + riskChartHtml(R, cell, mat) + '</div>'
      + '<div class="sc-cell sc-full"><div class="sc-sec">' + esc(t('risk.comp.head')) + '</div><div class="sc-two">' + componentsHtml(R, cell) + '</div></div>';
  }

  function riskInputsHtml(R) {
    var U = FF.ui.components, ox = R.axes.o2_pct, ps = R.axes.pressure_kpa, step = ox.length > 1 ? ox[1] - ox[0] : 1;
    var h = U.row(t('risk.in.material'), materialOf(R, rstate.material).label, { valueInk: true })
      + U.options(t('risk.in.material'), 'risk-material', R.materials.map(function (m) { return { label: m.label, value: m.key, on: m.key === rstate.material }; }))
      + U.row(t('risk.in.preset'), '', { dim: true, gap: true })
      + U.options(t('risk.in.preset'), 'risk-preset', (R.presets || []).map(function (p) {
        return { label: t('risk.preset.' + p.key) + ' · ' + num(p.o2_pct, 0) + ' %, ' + num(p.pressure_kpa, 1) + ' kPa', value: p.key, on: false };
      }))
      + U.rule()
      + '<div class="row"><label for="s-risk-o2">' + esc(t('risk.in.o2')) + '</label><span class="v" id="v-risk-o2">' + esc(num(ox[rstate.oi], 1) + ' %') + '</span></div>'
      + '<input class="ff-range" type="range" id="s-risk-o2" data-risk-o2="' + rstate.oi + '" min="0" max="' + (ox.length - 1) + '" step="1" value="' + rstate.oi
      + '" aria-label="' + esc(t('risk.in.o2')) + '">'
      + '<div class="row dim"><span>' + esc(t('risk.in.grid', { lo: num(ox[0], 0), hi: num(ox[ox.length - 1], 0), step: num(step, 1) })) + '</span></div>'
      + U.row(t('risk.in.pressure'), num(ps[rstate.pi], 1) + ' kPa', { valueInk: true, gap: true })
      + U.options(t('risk.in.pressure'), 'risk-pressure', ps.map(function (v, i) { return { label: num(v, 1), value: String(i), on: i === rstate.pi }; }));
    return '<div class="sc-cell">' + h + '</div>';
  }

  function riskOtherHtml(R) {
    var keys = ['ignition_delay', 'material_thresholds', 'weights', 'level_thresholds', 'pressure_scaling'], h = '';
    keys.forEach(function (k) {
      var rec = provOf(R, k);
      if (!rec) return;
      h += '<div class="sc-comp"><div class="sc-comp-top"><span>' + esc(t('risk.other.' + k)) + '</span></div>'
        + '<div class="sc-meta">' + metaHtml(rec) + '</div><div class="sc-note">' + esc(noteOf(rec)) + '</div></div>';
    });
    return h ? '<div class="sc-cell sc-full"><div class="sc-sec">' + esc(t('risk.other.head')) + '</div><div class="sc-two">' + h + '</div></div>' : '';
  }

  function honestyHtml(R) {
    var items = [1, 2, 3, 4, 5].map(function (i) { return '<li>' + esc(t('risk.honesty.' + i)) + '</li>'; }).join('');
    var src = R.source ? '<div class="sc-note">' + esc(t('risk.source', { author: R.source.author, pr: R.source.pr })) + '</div>' : '';
    return '<div class="sc-cell sc-full sc-honest"><div class="sc-sec">' + esc(t('risk.honesty.head')) + '</div><ul>' + items + '</ul>' + src + '</div>';
  }

  function riskPanelInner(R) {
    return '<div class="sc-sub sc-full">' + esc(t('risk.sub')) + '</div>' + riskInputsHtml(R)
      + '<div id="risk-out" style="display:contents">' + riskOutHtml(R) + '</div><!--risk-out-end-->'
      + riskOtherHtml(R) + honestyHtml(R);
  }

  function riskSectionHtml() {
    var U = FF.ui.components, R = riskData(), head = U.eyebrow(t('risk.title'));
    if (!R) return '<section class="sc-risk">' + head + '<div class="sc-sub">' + esc(t('risk.sub')) + '</div>' + U.text(t('risk.nodata')) + '</section>';
    if (!rstate) riskInit(R);
    return '<section class="sc-risk">' + head + '<div id="risk-panel" class="sc-grid">' + riskPanelInner(R) + '</div><!--risk-panel-end--></section>';
  }

  /** Wires the panel. Buttons re-render the panel; the slider only rewrites #risk-out so dragging is not interrupted. */
  function bindRisk(root) {
    var R = riskData(), host = R && root.querySelector('#risk-panel');
    if (!host) return;
    function full() { host.innerHTML = riskPanelInner(R); bindScope(); }
    function bindScope() {
      Array.prototype.forEach.call(host.querySelectorAll('[data-risk-material]'), function (b) {
        b.addEventListener('click', function () { rstate.material = b.getAttribute('data-risk-material'); full(); });
      });
      Array.prototype.forEach.call(host.querySelectorAll('[data-risk-pressure]'), function (b) {
        b.addEventListener('click', function () { rstate.pi = parseInt(b.getAttribute('data-risk-pressure'), 10); full(); });
      });
      Array.prototype.forEach.call(host.querySelectorAll('[data-risk-preset]'), function (b) {
        b.addEventListener('click', function () {
          var p = R.presets.filter(function (x) { return x.key === b.getAttribute('data-risk-preset'); })[0];
          if (!p) return;
          rstate.oi = nearestIdx(R.axes.o2_pct, p.o2_pct); rstate.pi = nearestIdx(R.axes.pressure_kpa, p.pressure_kpa); full();
        });
      });
      Array.prototype.forEach.call(host.querySelectorAll('[data-risk-o2]'), function (el) {
        el.addEventListener('input', function () {
          var v = parseInt(el.value, 10);
          if (!(v >= 0 && v < R.axes.o2_pct.length)) return;
          rstate.oi = v;
          var lab = host.querySelector('#v-risk-o2'), out = host.querySelector('#risk-out');
          if (lab) lab.textContent = num(R.axes.o2_pct[v], 1) + ' %';
          if (out) out.innerHTML = riskOutHtml(R);
        });
      });
    }
    bindScope();
  }

  /** Scoped styles for the risk panel and the scrolling page wrapper (Halo tokens; no colour, meaning by shape). */
  var RISK_CSS = '.sc-page{display:flex;flex-direction:column;gap:clamp(28px,5vh,56px);outline:none}'
    + '.scroll.sc-page{flex:none;overflow:visible;padding-right:0}@media(min-width:900px){.sc-page>.cols{flex:none;height:max(520px,calc(100vh - var(--top-h) - 150px))}}'
    + '.sc-risk{flex:none;position:relative;padding-top:clamp(16px,2.6vh,28px)}'
    + '.sc-risk::before{content:"";position:absolute;left:0;top:0;width:min(100%,1100px);height:1px;background:linear-gradient(90deg,rgba(255,255,255,.2),transparent)}'
    + '.sc-risk>.eyebrow{margin-bottom:6px}.sc-sub{font-size:clamp(13px,1.55vh,16px);color:var(--ink-faint);letter-spacing:.02em}'
    + '.sc-grid{display:grid;grid-template-columns:minmax(0,1fr);gap:clamp(18px,3vh,32px) 0;margin-top:clamp(10px,1.8vh,18px)}'
    + '@media(min-width:900px){.sc-grid{grid-template-columns:minmax(340px,520px) minmax(0,1fr);column-gap:clamp(40px,5vw,80px)}'
    + '.sc-risk .plate.sized .chart{height:clamp(200px,30vh,300px)}.sc-two{display:grid;grid-template-columns:1fr 1fr;gap:0 clamp(24px,3vw,48px)}}'
    + '.sc-grid .sc-full{grid-column:1/-1}.sc-cell{min-width:0}.sc-chartbox{margin-top:clamp(12px,2vh,22px)}'
    + '.sc-sec{font-size:12px;line-height:16px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-faint);margin-bottom:8px}'
    + '.sc-idxrow{display:flex;align-items:center;gap:8px 22px;flex-wrap:wrap}'
    + '.sc-idx{font-size:clamp(48px,8vh,76px);line-height:1;font-weight:300;letter-spacing:-.03em;font-variant-numeric:tabular-nums}'
    + '.sc-level{display:inline-flex;align-items:center;gap:10px;padding:6px 14px;border:1px solid var(--ink-faint);border-radius:999px;'
    + 'font-size:13px;font-weight:600;letter-spacing:.14em;text-transform:uppercase}'
    + '.sc-level[data-risk-level=low]{border-style:dotted}.sc-level[data-risk-level=medium]{border-style:dashed;border-color:var(--ink-soft)}'
    + '.sc-level[data-risk-level=critical]{border-style:solid;border-width:2px;border-color:var(--ink);box-shadow:var(--glow)}'
    + '.sc-pips{display:inline-flex;align-items:flex-end;gap:3px}.sc-pips i{width:5px;border:1px solid var(--ink-faint);border-radius:1px}'
    + '.sc-pips i:nth-child(1){height:8px}.sc-pips i:nth-child(2){height:12px}.sc-pips i:nth-child(3){height:16px}'
    + '.sc-pips i.on{background:var(--light);border-color:var(--light)}'
    + '.sc-meter-wrap{margin:16px 0 8px;max-width:520px}'
    + '.sc-meter{position:relative;height:6px;border-radius:3px;background:rgba(255,255,255,.1)}'
    + '.sc-meter .fill{position:absolute;left:0;top:0;bottom:0;border-radius:3px;background:var(--light);box-shadow:0 0 8px rgba(255,255,255,.45)}'
    + '.sc-meter .mk{position:absolute;top:-4px;bottom:-4px;width:1px;background:rgba(255,255,255,.55)}'
    + '.sc-meter-lab{position:relative;height:18px;margin-top:6px;font-size:12px;color:var(--ink-faint);font-variant-numeric:tabular-nums}'
    + '.sc-meter-lab span{position:absolute;top:0;transform:translateX(-50%)}.sc-meter-lab span:first-child{transform:none}.sc-meter-lab span:last-child{transform:none}'
    + '.sc-flam{margin:14px 0 8px;padding:2px 0 2px 14px;border-left:2px solid var(--light)}'
    + '.sc-flam[data-risk-flammable=no]{border-left-style:dashed;border-left-color:var(--ink-soft)}'
    + '.sc-flam[data-risk-flammable=inert]{border-left-style:dotted;border-left-color:var(--ink-soft)}'
    + '.sc-flam-q{font-size:12px;letter-spacing:.14em;text-transform:uppercase;font-weight:600;color:var(--ink-faint)}'
    + '.sc-flam-a{font-weight:600;margin:2px 0}'
    + '.sc-note{font-size:clamp(12px,1.5vh,14px);line-height:1.4;color:var(--ink-faint);margin:2px 0 6px}'
    + '.sc-tags{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 8px}'
    + '.sc-tag{font-size:12px;padding:2px 9px;border:1px solid var(--hairline);border-radius:999px;color:var(--ink-muted)}'
    + '.sc-comp{padding:8px 0 4px;border-top:1px solid var(--hairline-soft)}'
    + '.sc-comp-top{display:flex;justify-content:space-between;gap:12px}.sc-comp-val{white-space:nowrap;font-variant-numeric:tabular-nums}.sc-comp .dim{color:var(--ink-faint)}'
    + '.sc-bar{height:4px;margin:6px 0 8px;border-radius:2px;background:rgba(255,255,255,.1)}'
    + '.sc-bar i{display:block;height:100%;border-radius:2px;background:var(--light)}'
    + '.sc-meta{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 12px;font-size:clamp(12px,1.5vh,14px);color:var(--ink-muted)}'
    + '.sc-badge{font-size:11px;letter-spacing:.1em;text-transform:uppercase;font-weight:600;padding:1px 7px;border:1px solid var(--ink-soft);border-radius:4px;color:var(--ink-soft)}'
    + '.sc-badge[data-basis=data]{background:rgba(255,255,255,.14);color:var(--ink);border-color:var(--ink)}'
    + '.sc-badge[data-basis=literature]{border-style:dashed}.sc-badge[data-basis=assumption]{border-style:dotted;color:var(--ink-muted)}'
    + '.sc-badge[data-basis=mixed]{border-style:double;border-width:3px;padding:0 6px}'
    + '.sc-risk a{color:var(--ink-soft);text-decoration:underline;text-underline-offset:3px}'
    + '.sc-honest{padding-left:18px;border-left:1px solid var(--hairline)}'
    + '.sc-honest ul{margin:0 0 8px;padding-left:18px;font-size:clamp(13px,1.55vh,16px);line-height:1.5;color:var(--ink-muted)}.sc-honest li{margin:2px 0}';

  /** FLEX screen (columns + note) with the risk section appended inside one scrolling page; the honesty band stays below. */
  function wrapPage(screen, risk) {
    var i = screen.lastIndexOf('<div class="note">');
    return '<div class="scroll sc-page" id="sc-page" tabindex="0" role="region" aria-label="' + esc(t('risk.region_aria')) + '">'
      + screen.slice(0, i) + risk + '</div>' + screen.slice(i);
  }

  function render(root) {
    var U = FF.ui.components;
    var model = FF.site && FF.site.model;
    if (!model || !model.coef || !model.known_combos || !model.cv) {
      root.innerHTML = U.screen({ listLabel: t('scenario.eyebrow_list'), list: U.text(t('app.no_data')), stage: '', note: t('scenario.nodata_note') });
      return;
    }
    if (!state) init(model);
    var r = model.ranges, k = fracKey(state.diluent);
    var fuels = model.fuels;
    var list = U.row(t('scenario.fuel'), state.fuel, { valueInk: true })
      + U.options(t('scenario.fuel'), 'fuel', fuels.map(function (f) { return { label: f, value: f, on: f === state.fuel }; }))
      + U.row(t('scenario.diluent'), state.diluent, { valueInk: true, gap: true })
      + U.options(t('scenario.diluent'), 'diluent', diluentsFor(model, state.fuel).map(function (d) { return { label: d, value: d, on: d === state.diluent }; }))
      + U.rule()
      + slider('x_o2', t('scenario.o2'), '%', r.x_o2.min * 100, r.x_o2.max * 100, 0.5, state.x_o2 * 100, 1)
      + slider('p_atm', t('scenario.pressure'), ' atm', r.p_atm.min, r.p_atm.max, 0.01, state.p_atm, 2)
      + slider('d0_mm', t('scenario.d0'), ' mm', r.d0_mm.min, r.d0_mm.max, 0.01, state.d0_mm, 2);
    if (k) {
      var v = state.frac === null ? model.impute[k] : state.frac;
      list += slider('frac', t('scenario.frac', { d: state.diluent }), '%', r[k].min * 100, r[k].max * 100, 0.5, v * 100, 1);
    }
    var prevPage = root.querySelector('#sc-page'), prevScroll = prevPage ? prevPage.scrollTop : 0;
    root.innerHTML = '<style>.ff-range{width:100%;margin:2px 0 4px;accent-color:#fff;background:transparent}'
      + '.row label{color:inherit}' + RISK_CSS + '</style>'
      + wrapPage(U.screen({
        listLabel: t('scenario.eyebrow_list'), list: list,
        stageLabel: t('scenario.eyebrow_stage'), stage: stageHtml(model),
        note: noteText(model)
      }), riskSectionHtml());
    var pg = root.querySelector('#sc-page');
    if (pg && prevScroll) pg.scrollTop = prevScroll;
    bindRisk(root);
    Array.prototype.forEach.call(root.querySelectorAll('[data-fuel]'), function (b) {
      b.addEventListener('click', function () {
        state.fuel = b.getAttribute('data-fuel');
        if (diluentsFor(model, state.fuel).indexOf(state.diluent) < 0) state.diluent = diluentsFor(model, state.fuel)[0];
        state.frac = null; render(root);
      });
    });
    Array.prototype.forEach.call(root.querySelectorAll('[data-diluent]'), function (b) {
      b.addEventListener('click', function () { state.diluent = b.getAttribute('data-diluent'); state.frac = null; render(root); });
    });
    Array.prototype.forEach.call(root.querySelectorAll('[data-xvar]'), function (b) {
      b.addEventListener('click', function () { state.xvar = b.getAttribute('data-xvar'); render(root); });
    });
    Array.prototype.forEach.call(root.querySelectorAll('[data-slider]'), function (el) {
      el.addEventListener('input', function () {
        var id = el.getAttribute('data-slider'), val = parseFloat(el.value);
        var pct = id === 'x_o2' || id === 'frac';
        if (id === 'x_o2') state.x_o2 = val / 100; else if (id === 'frac') state.frac = val / 100; else state[id] = val;
        var unit = id === 'p_atm' ? ' atm' : id === 'd0_mm' ? ' mm' : '%';
        var lab = root.querySelector('#v-' + id);
        if (lab) lab.textContent = num(val, id === 'p_atm' || id === 'd0_mm' ? 2 : 1) + unit;
        root.querySelector('#sc-head').innerHTML = headHtml(model);
        root.querySelector('#sc-out').innerHTML = FF.ui.components.rule() + breakdownHtml(model);
        root.querySelector('#sc-chart').innerHTML = chartHtml(model);
      });
    });
  }

  FF.views = FF.views || {};
  FF.views.senaryo = { render: render };
})(window.FF = window.FF || {});
