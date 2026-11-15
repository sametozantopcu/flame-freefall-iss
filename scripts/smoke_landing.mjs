// LP1/LP3/LP4/LP5 acceptance: single-page landing (skeleton, FF.app, hero, motion, CSS guards).
// Run: node scripts/smoke_landing.mjs   (exit 1 on failure, prints ALL PASSED on success)
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';

const APP = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', 'app');
const site = JSON.parse(fs.readFileSync(path.join(APP, 'data/site_data.json'), 'utf8'));
let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('FAIL: ' + m); } else console.log('ok: ' + m); };
const read = f => fs.readFileSync(path.join(APP, f), 'utf8');
const attempt = (m, fn) => { try { fn(); } catch (e) { ok(false, m + ' threw: ' + e.message); } };

// Expected numbers derived from the real site data.
const N_INV = site.investigations.length, N_FLEX = site.model.cv.fuel_diluent.n, N_CARDS = site.cards.length;

/* ---------- 1. index.html skeleton ---------- */
const html = read('index.html');
const headM = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
const head = headM ? headM[1] : '';
const inline = [...head.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
ok(inline.some(s => /document\.documentElement\.classList\.add\(\s*['"]js['"]\s*\)/.test(s)), 'head inline script adds js class');
ok(/<a\s+class="skip"\s+href="#main"/.test(html), 'skip link');
ok(/<main\s+id="main"/.test(html), 'main#main');
ok(/<header\s+class="top"/.test(html), 'header.top');
const heroM = html.match(/<section\s+id="top"\s+class="hero"[^>]*>([\s\S]*?)<\/section>/);
ok(!!heroM, 'hero section#top.hero');
ok(heroM && (heroM[1].match(/<h1[\s>]/g) || []).length === 1, 'hero has exactly one h1');
ok((html.match(/<h1[\s>]/g) || []).length === 1, 'page has exactly one h1');
const want = [['explore', 'kesif'], ['scenario', 'senaryo'], ['equipment', 'ekipman'], ['live', 'canli']];
const secs = [...html.matchAll(/<section\b([^>]*)>([\s\S]*?)<\/section>/g)]
  .map(m => ({ attrs: m[1], body: m[2], id: (m[1].match(/\bid="([^"]*)"/) || [])[1] }))
  .filter(s => s.id && s.id !== 'top');
ok(secs.map(s => s.id).join(',') === want.map(w => w[0]).join(','), 'four sections in order: ' + secs.map(s => s.id).join(','));
want.forEach(([id, view], i) => {
  const s = secs[i];
  if (!s || s.id !== id) { ok(false, 'section ' + id + ' missing at position ' + i); return; }
  ok(/\bclass="[^"]*\bsec\b[^"]*"/.test(s.attrs), id + ' has class sec');
  ok(new RegExp('\\bdata-view="' + view + '"').test(s.attrs), id + ' data-view=' + view);
  const lb = (s.attrs.match(/\baria-labelledby="([^"]+)"/) || [])[1];
  ok(!!lb && new RegExp('<h2\\b[^>]*\\bid="' + lb + '"').test(s.body), id + ' aria-labelledby -> inner h2 (' + lb + ')');
  ok(/<div\b[^>]*\bclass="[^"]*\bview\b[^"]*"/.test(s.body), id + ' contains div.view');
});
const iMotion = html.search(/<script[^>]*\bsrc="[^"]*ui\/motion\.js[^"]*"/);
const iApp = html.search(/<script[^>]*\bsrc="[^"]*\bapp\.js[^"]*"/);
ok(iMotion >= 0 && iApp >= 0 && iMotion < iApp, 'ui/motion.js loaded before app.js');

/* ---------- vm loader ---------- */
function load(files, { withIO = false } = {}) {
  const win = {
    addEventListener() {},
    location: { hash: '', search: '' },
    document: { documentElement: { classList: { add() {} } }, getElementById: () => null, querySelectorAll: () => [], addEventListener() {} },
  };
  win.window = win;
  const ctx = vm.createContext(win);
  ctx.document = win.document;
  for (const f of files) {
    try { vm.runInContext(read(f), ctx, { filename: f }); }
    catch (e) { ok(false, 'loading ' + f + ' threw: ' + e.message); }
  }
  return win.FF || {};
}
const ALL = ['data/site_data.js', 'config.js', 'i18n.js', 'core/physics.js', 'core/data.js', 'ui/components.js', 'ui/charts.js',
  'views/kesif.js', 'views/senaryo.js', 'views/ekipman.js', 'views/canli.js', 'ui/motion.js', 'app.js'];
const FF = load(ALL);

/* ---------- 2. FF.app ---------- */
const A = FF.app;
ok(!!A, 'FF.app defined without DOM');
if (A) {
  attempt('SECTIONS', () => {
    ok(Array.isArray(A.SECTIONS) && A.SECTIONS.length === 4, 'SECTIONS has 4 entries');
    want.forEach(([id, view], i) => ok(A.SECTIONS && A.SECTIONS[i] && A.SECTIONS[i].id === id && A.SECTIONS[i].view === view, 'SECTIONS[' + i + '] = ' + id + '/' + view));
  });
  attempt('resolveHash', () => {
    const cases = [['#explore', 'explore'], ['#scenario', 'scenario'], ['#equipment', 'equipment'], ['#live', 'live'],
      ['#kesif', 'explore'], ['#senaryo', 'scenario'], ['#ekipman', 'equipment'], ['#canli', 'live'],
      ['#top', 'top'], ['', null], ['#nope', null], [undefined, null]];
    for (const [h, exp] of cases) ok(A.resolveHash(h) === exp, 'resolveHash(' + JSON.stringify(h) + ') === ' + exp + ' (got ' + A.resolveHash(h) + ')');
  });
  attempt('navHtml', () => {
    const n = A.navHtml('scenario');
    const hrefs = [...n.matchAll(/href="(#[^"]*)"/g)].map(m => m[1]);
    ok(hrefs.length === 4 && ['#explore', '#scenario', '#equipment', '#live'].every(h => hrefs.includes(h)), 'navHtml has exactly four anchors: ' + hrefs.join(','));
    ok((n.match(/aria-current="true"/g) || []).length === 1, 'navHtml(scenario) exactly one aria-current');
    const anchors = [...n.matchAll(/<a\b[^>]*>/g)].map(m => m[0]);
    const cur = anchors.filter(a => /aria-current="true"/.test(a));
    ok(cur.length === 1 && /href="#scenario"/.test(cur[0]), 'aria-current only on scenario link');
    ok(!/aria-current/.test(A.navHtml(null)), 'navHtml(null) has no aria-current');
  });
  attempt('heroStats', () => {
    const hs = A.heroStats(FF.site);
    ok(Array.isArray(hs) && hs.length === 3, 'heroStats(site) has 3 items');
    const vals = (hs || []).map(x => String(x.value));
    ok(vals[0] === String(N_INV), 'hero stat investigations = ' + N_INV + ' (got ' + vals[0] + ')');
    ok(vals[1] === String(N_FLEX), 'hero stat FLEX n = ' + N_FLEX + ' (got ' + vals[1] + ')');
    ok(vals[2] === String(N_CARDS), 'hero stat cards = ' + N_CARDS + ' (got ' + vals[2] + ')');
    ok((hs || []).every(x => typeof x.label === 'string' && x.label.trim().length > 0), 'hero stats all have non-empty label');
    for (const bad of [undefined, {}]) {
      const r = A.heroStats(bad);
      ok(Array.isArray(r) && r.length === 0, 'heroStats(' + JSON.stringify(bad) + ') -> []');
    }
    const one = A.heroStats({ investigations: site.investigations });
    ok(Array.isArray(one) && one.length === 1 && String(one[0].value) === String(N_INV), 'heroStats with only investigations -> 1 item');
    ok(Array.isArray(one) && one.every(x => x.value !== 0 && x.value !== '0'), 'no zero-filled values on partial site');
  });
}

/* ---------- 3. i18n hero keys ---------- */
ok(typeof FF.t === 'function', 'FF.t defined');
if (typeof FF.t === 'function') {
  for (const k of ['hero.title', 'hero.lead', 'hero.cta_explore', 'hero.cta_ask']) {
    const v = FF.t(k);
    ok(typeof v === 'string' && v.trim().length > 0 && v !== k, 'i18n key ' + k + ' = ' + JSON.stringify(v));
  }
}

/* ---------- 4. FF.motion.countText ---------- */
const M = FF.motion;
ok(!!M, 'FF.motion defined');
if (M) {
  attempt('countText', () => {
    const c = M.countText;
    ok(c('24', 1) === '24', "countText('24',1) === '24'");
    const z = c('24', 0);
    ok(/^\d/.test(z) && (z !== '24' || false), "countText('24',0) starts with number, not final (got " + z + ')');
    const h = c('24', 0.5);
    ok(/^\d+$/.test(h) && +h >= 0 && +h <= 24, "countText('24',0.5) integer in 0..24 (got " + h + ')');
    const d = c('2.13', 0.5);
    ok(/^\d+\.\d{2}$/.test(d) && +d <= 2.13, "countText('2.13',0.5) two decimals (got " + d + ')');
    const p = c('58.8%', 0.5);
    ok(/^\d+\.\d%$/.test(p) && parseFloat(p) <= 58.8, "countText('58.8%',0.5) one decimal + % (got " + p + ')');
    ok(c('n/a', 0.3) === 'n/a', "countText('n/a',0.3) === 'n/a'");
    ok(c('n/a', 0) === 'n/a', "countText('n/a',0) === 'n/a'");
    ok(c('−0.80', 1) === '−0.80', 'countText(U+2212 minus, 1) unchanged');
    const m = c('-0.80', 0.5);
    ok(/^-\d+\.\d{2}$/.test(m), "countText('-0.80',0.5) keeps sign and 2 decimals (got " + m + ')');
    const m2 = c('−0.80', 0.5);
    ok(/^[−-]\d+\.\d{2}$/.test(m2), 'countText(U+2212 -0.80, 0.5) keeps a minus sign (got ' + m2 + ')');
    ok(c('24', 1.5) === '24' && c('58.8%', 2) === '58.8%', 'p > 1 returns finalText');
  });
  /* ---------- 5. motion.init without IntersectionObserver ---------- */
  attempt('motion.init', () => {
    ok(typeof IntersectionObserver === 'undefined' || true, 'precondition');
    const mk = () => { const o = { added: [], classList: { add(...c) { o.added.push(...c); } } }; return o; };
    const items = [mk(), mk(), mk()];
    const root = { querySelectorAll: sel => (sel === '[data-reveal]' ? items : []), querySelector: () => null };
    M.init(root);
    items.forEach((it, i) => ok(it.added.includes('in'), 'init without IO: item ' + i + ' got class in'));
  });
}

/* ---------- 6. theme.css guards ---------- */
const css = read('ui/theme.css').replace(/\/\*[\s\S]*?\*\//g, '');
const decls = []; // { prop, value, chain: [preludes outer->inner] }
{
  const stack = []; let buf = '';
  const flush = () => {
    const t = buf.trim(); buf = '';
    const i = t.indexOf(':');
    if (t && i > 0) decls.push({ prop: t.slice(0, i).trim().toLowerCase(), value: t.slice(i + 1).trim(), chain: stack.slice() });
  };
  for (const ch of css) {
    if (ch === '{') { stack.push(buf.trim().replace(/\s+/g, ' ')); buf = ''; }
    else if (ch === '}') { flush(); stack.pop(); }
    else if (ch === ';') flush();
    else buf += ch;
  }
  ok(stack.length === 0, 'theme.css braces balanced');
}
const norm = s => s.replace(/\s+/g, ' ').toLowerCase();
const inSupports = d => d.chain.some(p => /^@supports/i.test(p) && /animation-timeline\s*:\s*scroll\(\s*\)/i.test(norm(p)));
const inNoPref = d => d.chain.some(p => /^@media/i.test(p) && /prefers-reduced-motion\s*:\s*no-preference/i.test(norm(p)));
const tl = decls.filter(d => d.prop === 'animation-timeline');
ok(tl.every(inSupports), 'every animation-timeline declaration is inside @supports (animation-timeline: scroll()) [' + tl.length + ' found]');
const sb = decls.filter(d => d.prop === 'scroll-behavior' && /smooth/.test(d.value));
ok(sb.every(inNoPref), 'scroll-behavior: smooth only inside prefers-reduced-motion: no-preference [' + sb.length + ' found]');
const rev = decls.filter(d => d.prop === 'opacity' && /^0(\.0+)?$/.test(d.value) && /\[data-reveal\]/.test(d.chain[d.chain.length - 1] || ''));
ok(rev.length >= 1, 'at least one [data-reveal] rule with opacity: 0 (found ' + rev.length + ')');
ok(rev.every(d => inNoPref(d)), 'hidden [data-reveal] rules are inside prefers-reduced-motion: no-preference');
ok(rev.every(d => d.chain[d.chain.length - 1].split(',').every(s => s.trim().startsWith('.js'))), 'hidden [data-reveal] selectors all start with .js');

console.log(fails ? 'FAILED ' + fails : 'ALL PASSED');
process.exit(fails ? 1 : 0);
