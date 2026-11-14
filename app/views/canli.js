/* FlameSense (nav item "live"): concept page. A designed, NOT built device: renders, design facts, plan.
 * No live values, no sample stream, no device status. Facts come from window.FF.site.flamesense when present.
 */
(function (FF) {
  var t = FF.t;

  function esc(s) { return FF.ui.components.esc(s); }
  function sub(s) { return String(s).replace('CO2', 'CO₂').replace('O2', 'O₂'); }

  function fig(src, alt, cap, cls) {
    return '<figure class="fs-fig ' + (cls || '') + '"><img src="' + esc(src) + '" alt="' + esc(alt)
      + '" loading="lazy" decoding="async"><figcaption>' + esc(cap) + '</figcaption></figure>';
  }

  function render(root) {
    var U = FF.ui.components;
    var fs = (FF.site && FF.site.flamesense) || {};
    var dims = fs.dimensions_mm ? fs.dimensions_mm.join(' × ') : '140 × 90 × 45';
    var mcu = fs.mcu || 'ESP32-S3';
    var sensors = (fs.sensors && fs.sensors.length) ? fs.sensors.map(sub)
      : ['O₂ (LuminOx)', 'CO', 'CO₂ (SCD41)', 'hot-wire flow', 'particulate (SPS30)', 'thermal array (MLX90640)'];
    var W = 'assets/flamesense_box/web/';

    var sensorList = '<ul class="fs-list">' + sensors.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>';
    var steps = ['next1', 'next2', 'next3'].map(function (k) { return '<li>' + esc(t('flamesense.' + k)) + '</li>'; }).join('');
    var guides = ['guide1', 'guide2', 'guide3'].map(function (k) { return '<li>' + esc(t('flamesense.' + k)) + '</li>'; }).join('');

    root.innerHTML = '<style>' + STYLE + '</style><div class="fs-scroll">'
      + '<div class="fs-tag" role="status"><i class="dot" aria-hidden="true"></i>' + esc(t('flamesense.tag')) + '</div>'
      + '<section class="fs-hero">'
      + fig(W + 'render_assembled.jpg', t('flamesense.alt_assembled'), t('flamesense.cap_assembled'), 'fs-hero-fig')
      + '<div class="fs-intro"><h2>' + esc(t('flamesense.title')) + '</h2><p>' + esc(t('flamesense.lead')) + '</p>'
      + U.row(t('flamesense.dims'), dims + ' mm') + U.row(t('flamesense.mcu'), mcu)
      + U.row(t('flamesense.ionization'), t('flamesense.ionization_value')) + '</div></section>'
      + '<section class="fs-sense">'
      + '<div><div class="fs-h">' + esc(t('flamesense.sense_h')) + '</div><p>' + esc(t('flamesense.sense_text')) + '</p>' + sensorList
      + '<p class="fs-dim">' + esc(t('flamesense.air_path')) + '</p></div>'
      + fig(W + 'render_internal.jpg', t('flamesense.alt_internal'), t('flamesense.cap_internal'))
      + '</section>'
      + '<section class="fs-more">'
      + fig(W + 'render_detail.jpg', t('flamesense.alt_detail'), t('flamesense.cap_detail'))
      + fig(W + 'render_exploded.jpg', t('flamesense.alt_exploded'), t('flamesense.cap_exploded'))
      + fig(W + 'render_top.jpg', t('flamesense.alt_top'), t('flamesense.cap_top'))
      + '</section>'
      + '<section class="fs-cols"><div><div class="fs-h">' + esc(t('flamesense.guide_h')) + '</div><ul class="fs-list">' + guides + '</ul></div>'
      + '<div><div class="fs-h">' + esc(t('flamesense.next_h')) + '</div><ul class="fs-list">' + steps + '</ul></div></section>'
      + '</div>' + U.note(t('flamesense.note'));
  }

  var STYLE = '.fs-scroll{flex:1 1 auto;min-height:0;overflow-y:auto;padding-right:8px;display:flex;flex-direction:column;gap:calc(var(--gap-main) * 1.2)}'
    + '.fs-tag{align-self:flex-start;display:inline-flex;align-items:center;gap:10px;padding:6px 14px;border:1px solid var(--rule);border-radius:999px;font-size:12px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--ink)}'
    + '.fs-tag .dot{position:static;display:inline-block}'
    + '.fs-hero{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(280px,1fr);gap:var(--space-gutter);align-items:center}'
    + '.fs-sense{display:grid;grid-template-columns:minmax(280px,1fr) minmax(0,1.3fr);gap:var(--space-gutter);align-items:center}'
    + '.fs-more{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:var(--space-gutter)}'
    + '.fs-cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:var(--space-gutter)}'
    + '.fs-fig{margin:0;display:flex;flex-direction:column;gap:8px}'
    + '.fs-fig img{width:100%;height:auto;display:block;border-radius:var(--radius-row);border:1px solid var(--hairline)}'
    + '.fs-fig figcaption{font-size:var(--fs-label);color:var(--ink-faint)}'
    + '.fs-intro h2{margin:0 0 8px;font:inherit;font-size:1.5em;font-weight:600;letter-spacing:-.02em}'
    + '.fs-intro p,.fs-sense p{margin:0 0 10px;color:var(--ink-soft)}'
    + '.fs-dim{color:var(--ink-muted)!important;font-size:var(--fs-label)}'
    + '.fs-h{font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:600;color:var(--ink-faint);margin-bottom:8px}'
    + '.fs-list{margin:0 0 10px;padding-left:18px;color:var(--ink-soft)}.fs-list li{margin:3px 0}'
    + '@media (max-width:899px){.fs-hero,.fs-sense{grid-template-columns:1fr}}';

  FF.views = FF.views || {};
  FF.views.canli = { render: render };
})(window.FF = window.FF || {});
