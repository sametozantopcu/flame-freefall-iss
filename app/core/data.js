/* Data access and FLEX prediction (UI independent, produces no UI text).
 * All content comes from window.FF.site (built by scripts/build_site_data.py); nothing is hardcoded here.
 * Missing values stay null; they are never replaced with 0.
 */
(function (FF) {
  function site() { return FF.site || null; }

  /** Investigations in rank order; scorable first, null scores last. */
  function investigations() {
    var s = site();
    if (!s || !s.investigations) return [];
    return s.investigations.slice().sort(function (a, b) {
      var an = a.score === null || a.score === undefined, bn = b.score === null || b.score === undefined;
      if (an !== bn) return an ? 1 : -1;
      return (a.rank - b.rank) || (a.psi_id < b.psi_id ? -1 : 1);
    });
  }

  /**
   * Score contribution in points per component: 100 * w_i * c_i / sum(w_known).
   * Unknown components (null) give null (no data), never 0. Sum of known points equals the score.
   */
  function contributions(inv, weights) {
    var known = 0, out = {};
    Object.keys(weights).forEach(function (k) {
      if (inv.components[k] !== null && inv.components[k] !== undefined) known += weights[k];
    });
    Object.keys(weights).forEach(function (k) {
      var c = inv.components[k];
      out[k] = (c === null || c === undefined || !known) ? null : 100 * weights[k] * c / known;
    });
    return out;
  }

  /** FLEX Ridge prediction from the export alone: standardize numerics, one-hot categoricals, linear sum.
   *  Same arithmetic as src/prediction/flex_model.py predict(). Missing numerics use model.impute. */
  function predict(model, row) {
    var c = model.coef, s = c.intercept;
    for (var i = 0; i < c.columns.length; i++) {
      var name = c.columns[i];
      if (c.kind[i] === 'num') {
        var v = row[name];
        if (v === null || v === undefined || (typeof v === 'number' && isNaN(v))) v = model.impute[name];
        s += c.coef[i] * (v - c.mean[i]) / c.scale[i];
      } else {
        var p = name.split('='), col = p[0], val = p.slice(1).join('=');
        s += c.coef[i] * (String(row[col]) === val ? 1 : 0);
      }
    }
    return s;
  }

  /** Per-column contribution to the prediction (intercept excluded); sums with intercept to predict(). */
  function explain(model, row) {
    var c = model.coef, out = [];
    for (var i = 0; i < c.columns.length; i++) {
      var name = c.columns[i], t;
      if (c.kind[i] === 'num') {
        var v = row[name];
        if (v === null || v === undefined || (typeof v === 'number' && isNaN(v))) v = model.impute[name];
        t = c.coef[i] * (v - c.mean[i]) / c.scale[i];
      } else {
        var p = name.split('=');
        t = c.coef[i] * (String(row[p[0]]) === p.slice(1).join('=') ? 1 : 0);
      }
      out.push({ column: name, value: t });
    }
    return out;
  }

  FF.data = { site: site, investigations: investigations, contributions: contributions };
  FF.model = { predict: predict, explain: explain };
})(window.FF = window.FF || {});
