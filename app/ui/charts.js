/* Grafikler: SVG metni üreten fonksiyonlar (repodaki app/ui/charts.py'nin karşılığı).
 *
 * Halo kuralları: ekranda tek ışıklı öğe, geometrik (çizgi, nokta, halka), renk yok.
 * Işık iki kez çizilir: altta yumuşak kopyalar, üstte keskin biçim. SVG filtresi yerine
 * artan kalınlıkta, düşük opaklıkta kopyalar kullanılıyor; her tarayıcıda aynı görünür.
 *
 * Süslemeler (ışıklı öğeden hep daha soluk): kesikli ızgara, eğrinin üstünden yükselen ışık,
 * yardımcı kesikli çizgiler, taralı fark alanı, kadran işaretleri.
 */
(function (FF) {
  var C = FF.config, P = FF.physics, t = FF.t, num = FF.num;
  var esc = function (s) { return FF.ui.components.esc(s); };
  var plate = function (s, ar, sized) { return FF.ui.components.plate(s, ar, sized); };

  // U-eğrisi grafiğinin alanı (viewBox 760 x 480)
  var G = { x0: 70, x1: 640, y0: 20, y1: 420, histX: 680, histPerTest: 4 };

  function px(u) { return G.x0 + u * (G.x1 - G.x0) / C.CHART.U_MAX; }
  function py(o2) { return G.y0 + (C.CHART.O2_MAX - o2) * (G.y1 - G.y0) / (C.CHART.O2_MAX - C.CHART.O2_MIN); }
  function f(v) { return v.toFixed(1); }

  /** Işıklı biçim: layers = [[kalınlık, opaklık], ...] yumuşak kopyalar, sonra keskin çizgi. */
  function lit(make, sharp, layers) {
    return layers.map(function (l) { return make('stroke-width:' + l[0] + ';opacity:' + l[1]); }).join('')
      + make('stroke-width:' + sharp);
  }

  function line(cls, x1, y1, x2, y2, st) {
    return '<line class="' + cls + '" x1="' + f(x1) + '" y1="' + f(y1) + '" x2="' + f(x2) + '" y2="' + f(y2) + '"'
      + (st ? ' style="' + st + '"' : '') + '></line>';
  }

  function circle(cls, cx, cy, r, st) {
    return '<circle class="' + cls + '" cx="' + f(cx) + '" cy="' + f(cy) + '" r="' + r + '"'
      + (st ? ' style="' + st + '"' : '') + '></circle>';
  }

  /** Işıklı nokta: yumuşak halkalar ve keskin çekirdek. */
  function litDot(cx, cy, r, halos) {
    return halos.map(function (h) { return circle('lit-fill', cx, cy, h[0], 'opacity:' + h[1]); }).join('')
      + circle('lit-fill', cx, cy, r);
  }

  /** Dikey ışık gradyanı: üstte görünmez, altta op opaklıkta. */
  function riseGradient(id, op) {
    return '<linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1">'
      + '<stop offset="0" stop-color="#fff" stop-opacity="0"></stop>'
      + '<stop offset="1" stop-color="#fff" stop-opacity="' + op + '"></stop></linearGradient>';
  }

  function curvePath() {
    var pts = [], u;
    for (u = 0; u < 2.2; u += 0.05) pts.push(u);
    for (u = 2.2; u < C.CHART.U_MAX; u += 0.5) pts.push(u);
    pts.push(C.CHART.U_MAX);
    return 'M' + pts.map(function (v) { return f(px(v)) + ' ' + f(py(P.limitVsVelocity(v, C.R_REF_CM))); }).join(' L');
  }

  /** Eğrinin üstündeki alan ("yanar" bölgesi); eğriden yukarı solan ışıkla doldurulur. */
  function aboveArea(d, gradId) {
    return '<path d="' + d + ' L' + G.x1 + ' ' + G.y0 + ' L' + G.x0 + ' ' + G.y0 + ' Z" fill="url(#' + gradId + ')"></path>';
  }

  function axes() {
    var s = '';
    [14, 16, 18, 20, 22].forEach(function (v) {
      s += line('grid', G.x0, py(v), G.x1, py(v));
      s += '<text class="end" x="' + (G.x0 - 16) + '" y="' + f(py(v) + 6) + '">' + v + '</text>';
    });
    s += line('axis', G.x0, G.y1, G.x1, G.y1);
    [0, 5, 10, 15, 20].forEach(function (v) {
      s += line('tick', px(v), G.y1, px(v), G.y1 + 6);
      s += '<text class="mid" x="' + f(px(v)) + '" y="' + (G.y1 + 30) + '">' + v + '</text>';
    });
    s += '<text class="mid" x="' + f((G.x0 + G.x1) / 2) + '" y="' + (G.y1 + 58) + '">' + esc(t('chart.flow_axis')) + '</text>';
    s += '<text x="' + G.x0 + '" y="14">' + esc(t('chart.o2_axis')) + '</text>';
    return s;
  }

  function svgOpen(w, h, aria) {
    return '<svg class="chart" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(aria) + '">';
  }

  /** Keşif: ışıklı öğe Olson eğrisinin kendisi. histogram: [[o2, adet], ...] */
  function limitCurve(opts) {
    var d = curvePath();
    var uMin = P.mostDangerousVelocity(C.R_REF_CM), o2Min = P.minimumLimit();
    var mx = px(uMin), my = py(o2Min);
    var total = 0;
    var marks = opts.histogram.map(function (h) {
      total += h[1];
      return 'M' + G.histX + ' ' + f(py(h[0])) + 'h' + (h[1] * G.histPerTest);
    }).join('');
    return plate(svgOpen(760, 486, opts.aria)
      + '<defs>' + riseGradient('ff-above-k', 0.075) + '</defs>'
      + aboveArea(d, 'ff-above-k') + axes()
      + '<text class="mid" x="400" y="190">' + esc(t('chart.burns')) + '</text>'
      + '<text class="mid" x="400" y="407">' + esc(t('chart.dies')) + '</text>'
      + line('axis', G.histX - 12, G.y0, G.histX - 12, G.y1)
      + '<path class="marks" d="' + marks + '"></path>'
      + '<text x="' + G.histX + '" y="' + (G.y1 + 30) + '">' + esc(t('chart.tests', { n: total })) + '</text>'
      + line('guide', mx, my, mx, G.y1) + line('guide', G.x0, my, mx, my)
      + lit(function (st) { return '<path class="lit draw" pathLength="1" d="' + d + '" style="' + st + '"></path>'; }, 3, [[18, 0.05], [10, 0.1], [6, 0.18]])
      + litDot(mx, my, 4.5, [[16, 0.05], [9, 0.14]])
      + '<text class="ink" x="' + f(mx + 18) + '" y="' + f(my - 36) + '">'
      + esc(t('chart.min_label', { o2: num(o2Min), u: num(uMin) })) + '</text>'
      + '</svg>', 760 / 486);
  }

  /** Senaryo: eğri soluk bir referans; ışıklı öğe senaryo noktası. */
  function scenarioPoint(opts) {
    var x = px(opts.u), y = py(opts.o2), yl = py(opts.limit);
    var endLimit = P.limitVsVelocity(C.CHART.U_MAX, C.R_REF_CM);
    var d = curvePath();
    var labelY = Math.abs(y - yl) < 30 ? Math.min(y, yl) - 22 : (y + yl) / 2 + 6;
    var labelRight = x < G.x1 - 150;
    return plate(svgOpen(760, 486, opts.aria)
      + '<defs>' + riseGradient('ff-above-s', 0.045) + '</defs>'
      + aboveArea(d, 'ff-above-s') + axes()
      + '<path class="ref" d="' + d + '"></path>'
      + '<text x="' + (G.x1 + 8) + '" y="' + f(py(endLimit) - 6) + '">' + esc(t('chart.limit')) + '</text>'
      + line('guide', G.x0, y, x, y) + line('guide', x, Math.max(y, yl), x, G.y1)
      + line('drop', x, y, x, yl, 'stroke:rgba(255,255,255,0.6);stroke-width:1.5')
      + circle('lit-fill', x, yl, 3.5, 'opacity:0.6')
      + '<text class="ink' + (labelRight ? '' : ' end') + '" x="' + f(labelRight ? x + 16 : x - 16) + '" y="' + f(labelY) + '">'
      + esc(opts.marginLabel) + '</text>'
      + circle('pulse', x, y, 7)
      + litDot(x, y, 7, [[70, 0.02], [40, 0.035], [18, 0.07], [12, 0.14]])
      + '</svg>', 760 / 486);
  }


  /* ---- Gerçek veri grafikleri (S6'da kaldırılan mock grafiklerin yerine) ----------------------------------------- */

  /** Güzel eksen adımı: aralığı 4-6 aralığa böler. */
  function niceTicks(lo, hi) {
    var span = hi - lo || 1, raw = span / 5, pow = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10));
    var step = [1, 2, 2.5, 5, 10].map(function (m) { return m * pow; }).filter(function (v) { return v >= raw; })[0];
    var out = [], v = Math.ceil(lo / step - 1e-9) * step;
    for (; v <= hi + step * 1e-9; v += step) out.push(+v.toPrecision(10));
    return { ticks: out, step: step };
  }
  function decimals(step) { return step >= 1 ? 0 : Math.min(4, Math.ceil(-Math.log(step) / Math.LN10 - 1e-9)); }

  /** Ortak çerçeve: verilen veri sınırlarından eksen ölçekleri ve ızgara. W x H viewBox, sol/alt boşluk eksen yazısı için. */
  function frame(b, xl, yl) {
    var W = 760, H = 310, M = { l: 78, r: 24, t: 30, b: 62 };
    var xt = niceTicks(b.x0, b.x1), yt = niceTicks(b.y0, b.y1);
    var X0 = Math.min(b.x0, xt.ticks[0]), X1 = Math.max(b.x1, xt.ticks[xt.ticks.length - 1]);
    var Y0 = Math.min(b.y0, yt.ticks[0]), Y1 = Math.max(b.y1, yt.ticks[yt.ticks.length - 1]);
    var fx = function (v) { return M.l + (v - X0) / ((X1 - X0) || 1) * (W - M.l - M.r); };
    var fy = function (v) { return H - M.b - (v - Y0) / ((Y1 - Y0) || 1) * (H - M.t - M.b); };
    var s = '', dx = decimals(xt.step), dy = decimals(yt.step);
    yt.ticks.forEach(function (v) {
      s += line('grid', M.l, fy(v), W - M.r, fy(v)) + '<text class="end" x="' + (M.l - 12) + '" y="' + f(fy(v) + 6) + '">' + v.toFixed(dy) + '</text>';
    });
    s += line('axis', M.l, H - M.b, W - M.r, H - M.b);
    xt.ticks.forEach(function (v) {
      s += line('tick', fx(v), H - M.b, fx(v), H - M.b + 6) + '<text class="mid" x="' + f(fx(v)) + '" y="' + (H - M.b + 28) + '">' + v.toFixed(dx) + '</text>';
    });
    s += '<text class="mid" x="' + f((M.l + W - M.r) / 2) + '" y="' + (H - 8) + '">' + esc(xl) + '</text>'
      + '<text x="' + M.l + '" y="14">' + esc(yl) + '</text>';
    return { W: W, H: H, M: M, fx: fx, fy: fy, axes: s, X0: X0, X1: X1, Y0: Y0, Y1: Y1 };
  }

  /** Keşif: ölçülmüş noktalar (Feature Store). Işıklı öğe: noktalar. Referans çizgisi varsa açıkça etiketli ve soluk.
   *  ser: site.series[psi]; seçili nokta yok (yalnızca veriyi gösterir). */
  function measured(ser, aria) {
    var pts = ser.points, b = { x0: Infinity, x1: -Infinity, y0: Infinity, y1: -Infinity };
    pts.forEach(function (p) { b.x0 = Math.min(b.x0, p[0]); b.x1 = Math.max(b.x1, p[0]); b.y0 = Math.min(b.y0, p[1]); b.y1 = Math.max(b.y1, p[1]); });
    var ref = ser.reference && ser.reference.kind === 'identity';
    if (ref) { var lo = Math.min(b.x0, b.y0), hi = Math.max(b.x1, b.y1); b.x0 = b.y0 = lo; b.x1 = b.y1 = hi; }
    var F = frame(b, ser.x.label + ', ' + ser.x.unit, ser.y.label + ', ' + ser.y.unit), dots = '';
    pts.forEach(function (p) { dots += '<circle class="lit-fill" cx="' + f(F.fx(p[0])) + '" cy="' + f(F.fy(p[1])) + '" r="3.4" style="opacity:0.55"></circle>'; });
    return plate(svgOpen(F.W, F.H, aria) + F.axes
      + (ref ? line('guide', F.fx(F.X0), F.fy(F.X0), F.fx(F.X1), F.fy(F.X1))
        + '<text class="end" x="' + f(F.fx(F.X1) - 6) + '" y="' + f(F.fy(F.X1) - 12) + '">' + esc(ser.reference.label) + '</text>' : '')
      + dots + '</svg>', F.W / F.H, true);
  }

  /** Senaryo: FLEX Ridge tepki eğrisi. curve: [[x, y], ...] yalnızca eğitim aralığında; y < 0 noktalar çizilmez
   *  (parçalara ayrılır). cur: {x, y} seçili nokta (y >= 0 ise işaretlenir). */
  function response(o) {
    var b = { x0: o.xr[0], x1: o.xr[1], y0: 0, y1: 0 };
    o.curve.forEach(function (p) { if (p[1] >= 0) b.y1 = Math.max(b.y1, p[1]); });
    if (o.cur && o.cur.y >= 0) b.y1 = Math.max(b.y1, o.cur.y);
    if (!(b.y1 > 0)) b.y1 = 1;
    b.y1 *= 1.08;
    var F = frame(b, o.xLabel, o.yLabel), segs = [], seg = [];
    o.curve.forEach(function (p) {
      if (p[1] >= 0) seg.push(p); else { if (seg.length) segs.push(seg); seg = []; }
    });
    if (seg.length) segs.push(seg);
    var d = segs.map(function (sg) { return 'M' + sg.map(function (p) { return f(F.fx(p[0])) + ' ' + f(F.fy(p[1])); }).join(' L'); }).join(' ');
    var out = F.axes;
    if (d) out += lit(function (st) { return '<path class="lit" d="' + d + '" style="' + st + '"></path>'; }, 3, [[14, 0.05], [8, 0.1], [5, 0.18]]);
    if (o.cur && o.cur.y >= 0) {
      var x = F.fx(o.cur.x), y = F.fy(o.cur.y);
      out += line('guide', F.M.l, y, x, y) + line('guide', x, y, x, F.H - F.M.b)
        + circle('pulse', x, y, 6) + litDot(x, y, 6, [[26, 0.05], [14, 0.12]]);
    }
    return plate(svgOpen(F.W, F.H, o.aria) + out + '</svg>', F.W / F.H, true);
  }

  /** Ekipman: iki çizgi. Işıklı olan mikro yerçekimi; Dünya aynı ışığın ikinci hali (opacity-alt).
   *  İki sınır arasındaki fark taralı bir alanla ve altındaki parantezle gösterilir. */
  function limitLines(opts) {
    var X0 = 0, X1 = 720, W = 10, h = W / 2;
    var x = function (o2) { return X0 + o2 * (X1 - X0) / opts.air; };
    var yE = 70, yM = 170, xE = x(opts.earth), xM = x(opts.microg);
    function bar(yy, label, value, o2, alt, layers) {
      var mk = function (st) { return line('lit', X0 + h, yy, x(o2) - h, yy, st); };
      var ink = alt ? '' : ' class="ink"', inkEnd = alt ? ' class="end"' : ' class="ink end"';
      return '<text' + ink + ' x="' + X0 + '" y="' + (yy - 22) + '">' + esc(label) + '</text>'
        + '<text' + inkEnd + ' x="' + X1 + '" y="' + (yy - 22) + '">' + esc(value) + '</text>'
        + line('dim', X0 + h, yy, X1 - h, yy, 'stroke-width:' + W + ';stroke-linecap:round')
        + '<g' + (alt ? ' class="alt"' : '') + '>' + lit(mk, W, layers) + '</g>';
    }
    var ticks = '';
    [0, 5, 10, 15, 20].forEach(function (v) { ticks += line('tick', x(v), 262, x(v), 270); });
    return plate(svgOpen(720, 300, opts.aria)
      + '<defs><pattern id="ff-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">'
      + '<line x1="0" y1="0" x2="0" y2="7" stroke="#fff" stroke-opacity="0.16" stroke-width="1"></line></pattern></defs>'
      + '<rect x="' + f(xM) + '" y="' + (yE + h + 4) + '" width="' + f(xE - xM) + '" height="' + (yM - yE - W - 8) + '" fill="url(#ff-hatch)"></rect>'
      + line('guide', xE, yE + h, xE, 222) + line('guide', xM, yM + h, xM, 222)
      + bar(yE, t('ekipman.earth'), t('unit.pct', { v: num(opts.earth) }), opts.earth, true, [[22, 0.06], [16, 0.12]])
      + bar(yM, t('ekipman.microg'), t('unit.pct', { v: num(opts.microg) }), opts.microg, false, [[26, 0.06], [18, 0.12]])
      + line('drop', xM, 222, xE, 222, 'stroke:rgba(255,255,255,0.6)')
      + '<text class="ink mid" x="' + f((xM + xE) / 2) + '" y="246">' + esc(opts.gapLabel) + '</text>'
      + line('axis', X0, 262, X1, 262) + ticks + line('tick', X1, 262, X1, 270)
      + '<text x="' + X0 + '" y="294">0</text>'
      + '<text class="end" x="' + X1 + '" y="294">' + esc(t('ekipman.air', { v: opts.air })) + '</text>'
      + '</svg>');
  }

  /** Canlı: halka (LitShape, ilerleme). share = ışıklı pay (0..1); ışık halkanın sonunda (tepede).
   *  Işığın kuyruğu conic-gradient ile solar; kadran işaretleri ve yazı SVG'de. */
  function ring(opts) {
    var share = Math.max(0, Math.min(1, opts.share));
    var start = ((1 - share) * 360).toFixed(1) + 'deg';
    var arcs = share > 0
      ? '<div class="arc glow" style="--s:' + start + '" aria-hidden="true"></div><div class="arc" style="--s:' + start + '" aria-hidden="true"></div>'
      : '<div class="arc off" aria-hidden="true"></div>';
    var ticks = '', i, a, r1;
    for (i = 0; i < 60; i++) {
      a = i * Math.PI / 30;
      r1 = i % 5 === 0 ? 120 : 126;
      ticks += line(i % 5 === 0 ? 'axis' : 'edge-soft',
        160 + r1 * Math.sin(a), 160 - r1 * Math.cos(a), 160 + 132 * Math.sin(a), 160 - 132 * Math.cos(a));
    }
    return '<div class="ring-wrap"><div class="halo" aria-hidden="true"></div>' + arcs
      + svgOpen(320, 320, opts.aria)
      + ticks
      + circle('edge-soft', 160, 160, 108)
      + (share > 0 ? litDot(160, 8, 7, [[16, 0.08], [11, 0.18]]) : '')
      + '<text class="ink mid" x="160" y="178" style="font-size:60px;font-weight:300;letter-spacing:-0.03em">' + esc(opts.value) + '</text>'
      + '<text class="small mid" x="160" y="212">' + esc(FF.upper(opts.unit)) + '</text>'
      + '</svg></div>';
  }

  FF.ui = FF.ui || {};
  FF.ui.charts = { measured: measured, response: response, limitCurve: limitCurve, scenarioPoint: scenarioPoint, limitLines: limitLines, ring: ring };
})(window.FF = window.FF || {});
