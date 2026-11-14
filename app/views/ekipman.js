/* Equipment: four data-backed insight cards (window.FF.site.cards), each with finding, number, unit, n,
 * habitat equipment implication, caveat and DOI link. No site data: a plain empty state, no crash.
 */
(function (FF) {
  var t = FF.t, num = FF.num;

  function esc(s) { return FF.ui.components.esc(s); }

  function card(c, i) {
    var doi = c.doi ? '<a href="https://doi.org/' + esc(c.doi) + '" target="_blank" rel="noopener">DOI ' + esc(c.doi) + '</a>'
      : '<span class="xs-none">' + esc(t('equipment.no_doi')) + '</span>';
    var big = (c.value === null || c.value === undefined) ? t('equipment.na') : num(c.value, 2);
    return '<article class="xs-card">'
      + '<div class="xs-head"><span class="idx">0' + (i + 1) + '</span><span class="xs-psi">' + esc(c.psi_id || '') + '</span></div>'
      + '<h3>' + esc(c.title) + '</h3>'
      + '<div class="xs-num"><span class="xs-big">' + esc(big) + '</span>'
      + '<span class="xs-unit">' + esc(c.unit || '') + '</span><span class="xs-n">n = ' + esc(c.n) + '</span></div>'
      + '<p class="xs-finding">' + esc(c.finding) + '</p>'
      + '<div class="xs-block"><b>' + esc(t('equipment.implication')) + '</b><p>' + esc(c.equipment_implication) + '</p></div>'
      + '<div class="xs-block xs-caveat"><b>' + esc(t('equipment.caveat')) + '</b><p>' + esc(c.caveat) + '</p></div>'
      + '<div class="xs-doi">' + doi + '</div>'
      + '</article>';
  }

  function render(root) {
    var U = FF.ui.components;
    var cards = (FF.site && FF.site.cards) || [];
    var body = cards.length
      ? '<div class="xs-grid">' + cards.map(card).join('') + '</div>'
      : '<p class="xs-empty">' + esc(t('equipment.empty')) + '</p>';
    root.innerHTML = '<style>' + STYLE + '</style><div class="xs-scroll">'
      + U.eyebrow(t('equipment.eyebrow')) + body + '</div>' + U.note(t('equipment.note'));
  }

  var STYLE = '.xs-scroll{flex:1 1 auto;min-height:0;overflow-y:auto;padding-right:8px}'
    + '.xs-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(380px,1fr));gap:var(--space-gutter)}'
    + '.xs-card{display:flex;flex-direction:column;gap:10px;padding:18px 20px;border-top:1px solid var(--hairline);background:linear-gradient(180deg,var(--halo),var(--halo-edge));border-radius:var(--radius-row)}'
    + '.xs-card h3{margin:0;font:inherit;font-weight:600;color:var(--ink)}'
    + '.xs-head{display:flex;justify-content:space-between;font-size:12px;letter-spacing:.08em;color:var(--ink-ghost)}'
    + '.xs-num{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap}'
    + '.xs-big{font-size:2.2em;font-weight:600;letter-spacing:-.03em;color:var(--ink);font-variant-numeric:tabular-nums}'
    + '.xs-unit,.xs-n{color:var(--ink-muted);font-size:var(--fs-label)}'
    + '.xs-finding{margin:0;color:var(--ink-soft)}'
    + '.xs-block p{margin:2px 0 0;color:var(--ink-muted);font-size:var(--fs-label);line-height:var(--lh-label)}'
    + '.xs-block b{font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:600;color:var(--ink-faint)}'
    + '.xs-caveat p{color:var(--ink-soft)}'
    + '.xs-doi{margin-top:auto;font-size:var(--fs-label)}.xs-doi a{color:var(--ink);text-underline-offset:4px}'
    + '.xs-none,.xs-empty{color:var(--ink-faint)}';

  FF.views = FF.views || {};
  FF.views.ekipman = { render: render };
})(window.FF = window.FF || {});
