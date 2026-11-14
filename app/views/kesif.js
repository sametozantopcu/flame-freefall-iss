/* Explore: 24 PSI investigations ranked by habitat relevance (M1), with the score breakdown.
 * The score is an assumption-based ranking, not a measurement; assumptions are read from meta.score_assumptions.
 */
(function (FF) {
  var t = FF.t, num = FF.num;
  var state = { psi: null };

  function esc(s) { return FF.ui.components.esc(s); }
  function isNum(v) { return v !== null && v !== undefined && !isNaN(v); }
  function range(r, unit, d) { return r ? num(r.min, d === undefined ? 1 : d) + '–' + num(r.max, d === undefined ? 1 : d) + ' ' + unit : t('explore.na'); }
  function list(a, max) {
    if (!a || !a.length) return t('explore.na');
    return a.length > max ? a.slice(0, max).join(', ') + ' +' + (a.length - max) : a.join(', ');
  }

  function assumptionsText(m) {
    var a = m.score_assumptions, h = a.habitat;
    var w = Object.keys(a.weights).map(function (k) { return t('explore.comp.' + k) + ' ' + Math.round(a.weights[k] * 100) + '%'; }).join(', ');
    return t('explore.note', {
      weights: w, o2: h.o2_pct[0] + '–' + h.o2_pct[1], p: h.pressure_kpa[0] + '–' + h.pressure_kpa[1],
      flow: h.low_flow_cm_s[1], min: a.min_known
    });
  }

  function listHtml(invs, m) {
    var U = FF.ui.components, rows = '';
    invs.forEach(function (e) {
      var scored = isNum(e.score);
      rows += U.rowButton(String(e.rank).padStart(2, '0') + '  ' + e.name, scored ? num(e.score, 1) : t('explore.not_scorable_short'),
        { selected: e.psi_id === state.psi, dataKey: 'psi', dataValue: e.psi_id, bar: scored ? e.score / 100 : undefined });
    });
    return U.row(t('explore.count', { n: invs.length }), t('explore.score')) + U.rule() + rows;
  }

  function stageHtml(e, m) {
    var U = FF.ui.components, env = e.envelope || {};
    var scored = isNum(e.score);
    var h = U.row(e.name, e.psi_id) + U.text(e.title, { dim: true }) + U.rule();
    if (scored) {
      var contrib = FF.data.contributions(e, m.score_assumptions.weights);
      h += U.row(t('explore.score_label'), num(e.score, 1) + ' / 100', { valueInk: true })
        + U.row(t('explore.known', { k: e.n_components_known, n: Object.keys(contrib).length }), '', { dim: true })
        + U.text(e.rationale, { dim: true });
      if (e.n_components_known < m.score_assumptions.min_known) h += U.text(t('explore.low_conf', { min: m.score_assumptions.min_known }), { dim: true });
      h += U.rule();
      Object.keys(contrib).forEach(function (k) {
        var c = e.components[k];
        h += U.row(t('explore.comp.' + k), contrib[k] === null ? t('explore.no_data')
          : '+' + num(contrib[k], 1) + ' pts · ' + Math.round(c * 100) + '%', { dim: true });
      });
    } else {
      h += U.row(t('explore.score_label'), t('explore.not_scorable'), { valueInk: true })
        + U.text(e.rationale, { dim: true });
      Object.keys(m.score_assumptions.weights).forEach(function (k) {
        h += U.row(t('explore.comp.' + k), t('explore.no_data'), { dim: true });
      });
    }
    h += U.rule()
      + U.row(t('explore.env_o2'), env.o2_pct ? num(env.o2_pct.min, 1) + '–' + num(env.o2_pct.max, 1) + '%' : t('explore.na'), { dim: true })
      + U.row(t('explore.env_pressure'), range(env.pressure_atm, 'atm', 2), { dim: true })
      + U.row(t('explore.env_flow'), range(env.flow_cm_s, 'cm/s'), { dim: true })
      + U.row(t('explore.env_fuels'), list(env.fuels, 4), { dim: true })
      + U.row(t('explore.env_gravity'), list(env.gravity, 3), { dim: true })
      + U.row(t('explore.env_rows'), isNum(env.n_rows) ? String(env.n_rows) : t('explore.na'), { dim: true })
      + U.rule();
    h += e.doi
      ? '<div class="row dim"><span>' + esc(t('explore.doi')) + '</span><span><a href="https://doi.org/' + esc(e.doi)
        + '" target="_blank" rel="noopener">' + esc(e.doi) + '</a></span></div>'
      : U.row(t('explore.doi'), t('explore.na'), { dim: true });
    h += U.text(e.summary || t('explore.na'), { dim: true });
    return '<div class="list" style="overflow:auto;max-height:100%">' + h + '</div>';
  }

  function render(root) {
    var U = FF.ui.components;
    var s = FF.site;
    if (!s || !s.investigations || !s.meta) {
      root.innerHTML = U.screen({ listLabel: t('explore.eyebrow_list'), list: U.text(t('app.no_data')), stage: '', note: t('explore.nodata_note') });
      return;
    }
    var invs = FF.data.investigations(), m = s.meta;
    if (!state.psi || !invs.some(function (x) { return x.psi_id === state.psi; })) state.psi = invs[0].psi_id;
    var e = invs.filter(function (x) { return x.psi_id === state.psi; })[0];
    root.innerHTML = U.screen({
      listLabel: t('explore.eyebrow_list'), list: listHtml(invs, m), listClass: 'wide',
      stageLabel: t('explore.eyebrow_detail'), stage: stageHtml(e, m),
      note: assumptionsText(m)
    });
    Array.prototype.forEach.call(root.querySelectorAll('[data-psi]'), function (b) {
      b.addEventListener('click', function () { state.psi = b.getAttribute('data-psi'); render(root); });
    });
  }

  FF.views = FF.views || {};
  FF.views.kesif = { render: render };
})(window.FF = window.FF || {});
