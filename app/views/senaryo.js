/* Scenario: FLEX what-if (M2). The prediction runs in the browser from the exported Ridge coefficients
 * (FF.model.predict, same arithmetic as src/prediction/flex_model.py). Inputs are limited to the training data.
 */
(function (FF) {
  var t = FF.t, num = FF.num;
  var state = null;

  function esc(s) { return FF.ui.components.esc(s); }

  function init(model) {
    var c0 = model.known_combos[0], imp = model.impute;
    state = { fuel: c0.fuel, diluent: c0.diluent, x_o2: imp.x_o2, p_atm: imp.p_atm, d0_mm: imp.d0_mm, frac: null };
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

  function outputHtml(model) {
    var U = FF.ui.components;
    var y = FF.model.predict(model, inputRow(model));
    var parts = FF.model.explain(model, inputRow(model));
    var h = U.row(t('scenario.output'), y < 0 ? t('scenario.negative') : num(y, 3) + ' mm²/s', { valueInk: true, dot: true })
      + U.row(t('scenario.target'), model.target, { dim: true });
    h += U.rule() + U.row(t('scenario.intercept'), num(model.coef.intercept, 3), { dim: true });
    parts.forEach(function (p) {
      h += U.row(p.column, (p.value >= 0 ? '+' : '−') + num(Math.abs(p.value), 3), { dim: true });
    });
    return h;
  }

  function noteText(model) {
    var cv = model.cv, fd = cv.fuel_diluent, yr = cv.year;
    return t('scenario.note', {
      r2fd: num(fd.r2, 3), r2y: num(yr.r2, 3), n: model.n, doi: model.doi,
      gfd: fd.n_groups, gy: yr.n_groups
    });
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
    root.innerHTML = '<style>.ff-range{width:100%;margin:2px 0 4px;accent-color:#fff;background:transparent}'
      + '.row label{color:inherit}</style>'
      + U.screen({
        listLabel: t('scenario.eyebrow_list'), list: list,
        stageLabel: t('scenario.eyebrow_stage'), stage: '<div class="list" id="sc-out">' + outputHtml(model) + '</div>',
        note: noteText(model)
      });
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
    Array.prototype.forEach.call(root.querySelectorAll('[data-slider]'), function (el) {
      el.addEventListener('input', function () {
        var id = el.getAttribute('data-slider'), val = parseFloat(el.value);
        var pct = id === 'x_o2' || id === 'frac';
        if (id === 'x_o2') state.x_o2 = val / 100; else if (id === 'frac') state.frac = val / 100; else state[id] = val;
        var unit = id === 'p_atm' ? ' atm' : id === 'd0_mm' ? ' mm' : '%';
        var lab = root.querySelector('#v-' + id);
        if (lab) lab.textContent = num(val, id === 'p_atm' || id === 'd0_mm' ? 2 : 1) + unit;
        root.querySelector('#sc-out').innerHTML = outputHtml(model);
      });
    });
  }

  FF.views = FF.views || {};
  FF.views.senaryo = { render: render };
})(window.FF = window.FF || {});
