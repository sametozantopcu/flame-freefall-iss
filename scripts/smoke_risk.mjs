// R4 acceptance: material risk index panel on the Scenario screen. Usage: node scripts/smoke_risk.mjs
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';

const APP = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', 'app');
let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.error('FAIL: ' + m); } else console.log('ok: ' + m); };

function load(withSite) {
  const win = { document: { documentElement: {} }, addEventListener() {} };
  win.window = win;
  const ctx = vm.createContext(win);
  ctx.document = win.document;
  const files = (withSite ? ['data/site_data.js'] : []).concat(['config.js', 'i18n.js', 'core/physics.js', 'core/data.js', 'ui/components.js', 'ui/charts.js', 'views/senaryo.js']);
  for (const f of files) vm.runInContext(fs.readFileSync(path.join(APP, f), 'utf8'), ctx, { filename: f });
  return win.FF;
}

/** Minimal DOM stand-in: the risk panel (#risk-panel) is a scope that finds [data-x] elements in its current HTML
 *  and records their listeners; #risk-out can be rewritten in place (slider updates). */
function scope(html) {
  const s = {
    innerHTML: html, reg: {},
    querySelectorAll(sel) {
      const m = sel.match(/^\[(data-[\w-]+)\]$/); if (!m) return [];
      const re = new RegExp(m[1] + '="([^"]*)"', 'g'); const out = []; let x; s.reg[m[1]] = {};
      while ((x = re.exec(s.innerHTML))) {
        const el = { value: x[1], attrs: { [m[1]]: x[1] }, getAttribute(n) { return this.attrs[n]; }, addEventListener(ev, h) { this.h = h; (s.reg[m[1]] = s.reg[m[1]] || {})[this.attrs[m[1]]] = this; } };
        out.push(el);
      }
      return out;
    },
    querySelector(sel) {
      if (sel === '#risk-out') {
        const re = /(<div id="risk-out"[^>]*>)([\s\S]*?)(<!--risk-out-end-->)/;
        return { get innerHTML() { return s.innerHTML.match(re)[2]; }, set innerHTML(v) { s.innerHTML = s.innerHTML.replace(re, (m, a, b, c) => a + v + c); } };
      }
      return { textContent: '' };
    },
    fire(attr, value, newValue) {
      const regd = s.reg[attr] || {};
      const el = value === undefined ? Object.values(regd).pop() : regd[value];
      if (!el || !el.h) throw new Error('no handler for ' + attr + '=' + value);
      if (newValue !== undefined) el.value = String(newValue);
      el.h({});
    }
  };
  return s;
}
function root() {
  const r = {
    _html: '', host: null,
    set innerHTML(v) { r._html = v; r.host = null; }, get innerHTML() { return r._html; },
    querySelectorAll() { return []; },
    querySelector(sel) {
      if (sel !== '#risk-panel') return null;
      if (!r.host) { const m = r._html.match(/<div id="risk-panel"[^>]*>([\s\S]*?)<!--risk-panel-end-->/); if (!m) return null; r.host = scope(m[1]); }
      return r.host;
    },
    panel() { return r.querySelector('#risk-panel').innerHTML; }
  };
  return r;
}

const J = JSON.parse(fs.readFileSync(path.join(APP, 'data/site_data.json'), 'utf8'));
const R = J.risk;
const F = Object.fromEntries(R.fields.map((k, i) => [k, i]));
const cell = (mat, p, o) => R.grid[mat][R.axes.pressure_kpa.indexOf(p)][R.axes.o2_pct.indexOf(o)];
const strip = s => s.replace(/<[^>]+>/g, ' ').replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/\s+/g, ' ');
const shownIndex = html => (html.match(/id="risk-index"[^>]*>([^<]*)</) || [])[1];
const shownLevel = html => (html.match(/data-risk-level="(\w+)"/) || [])[1];

let FF = load(true), r = root();
FF.views.senaryo.render(r);
const html = r.innerHTML, panel = r.panel(), text = strip(panel);

// --- structure and honesty text
ok(html.includes('Material risk index') && text.includes('relative · heuristic · ported from PR #7'), 'title and sub-label');
ok(html.indexOf('Predicted burn rate K') < html.indexOf('Material risk index'), 'risk section sits below the FLEX section');
for (const s of ['0 = 21 % O₂ at 1 atm, 100 = 40 % O₂', 'not an absolute probability of fire', 'uncalibrated assumptions',
  'Only PMMA', 'BASS-II', 'literature values', 'Gravity and flow velocity are not inputs', 'Moon/Mars gravity is not modelled',
  'Independent of the FLEX model above', 'not for safety decisions', 'Risk engine by sametozantopcu (PR #7)'])
  ok(strip(html).includes(s), 'honesty text: ' + s);
ok(text.includes('means "as risky as Earth air", not "cannot burn"') || text.includes('as risky as Earth air'), 'permanent note: index 0 is not "cannot burn"');

// --- preset buttons and their labels
const presetKeys = R.presets.map(p => p.key);
ok(presetKeys.every(k => panel.includes('data-risk-preset="' + k + '"')), 'one button per preset');
ok(text.includes('ISS cabin') && text.includes('Exploration atmosphere'), 'preset labels from i18n');
ok(R.materials.every(m => panel.includes('data-risk-material="' + m.key + '"')), 'one button per material');

// --- default = ISS cabin + PMMA: index and level read from the grid
let c = cell('PMMA', 101.3, 21.0);
ok(shownIndex(panel) === FF.num(c[F.risk_index], 1) && Math.abs(c[F.risk_index]) < 0.5, 'ISS + PMMA index ' + shownIndex(panel) + ' == grid cell, ~0');
ok(shownLevel(panel) === 'low' && text.includes('Low'), 'ISS + PMMA level low');
ok(text.includes('Flammable at this condition?') && text.includes('Yes — O2 is +' + FF.num(c[F.margin_pct], 1) + ' pts above this material\'s limiting O2 (' + FF.num(c[F.threshold_o2_pct], 1) + ' %)'), 'ISS + PMMA: Flammable yes with margin');
ok(!text.includes('above_threshold_low_index') && !/Above threshold/i.test(text), 'above_threshold_low_index is not shown as a cell alarm');
ok(text.includes('pO2 is below the 0.21 atm reference; the index is clipped at 0'), 'clipped_below_reference inline note (ISS 101.3 kPa)');

// --- components, badges, weights, n, R2, DOI
const prov = Object.fromEntries(R.provenance.map(p => [p.component, p]));
for (const k of R.component_keys) {
  ok(panel.includes('data-risk-comp="' + k + '"'), 'component row ' + k);
  ok(panel.includes('data-basis="' + prov[k].basis + '"'), 'basis badge for ' + k + ' = ' + prov[k].basis);
  ok(text.includes('×' + FF.num(R.weights[k], 2)), 'weight shown for ' + k);
}
ok(text.includes('n=333') && text.includes('n=175'), 'n shown for data components');
ok(text.includes('R² ' + FF.num(prov.duration.r2, 3)), 'duration R2 shown');
ok(panel.includes('href="https://doi.org/' + prov.spread.doi + '"') && panel.includes('href="https://doi.org/' + prov.ignition.doi + '"'), 'DOI links');
ok(text.includes('R² 0.044 — weak fit') && text.includes('0.319') && text.includes('n=66'), 'spread: weak fit with feature-store refit');
for (const p of R.provenance) ok(FF.t(p.note_key) !== p.note_key, 'i18n note exists: ' + p.note_key);
ok(R.provenance.some(p => p.basis === 'mixed') && panel.includes('data-basis="mixed"'), 'mixed badge rendered');

// --- chart
ok(/<svg class="chart"/.test(panel) && panel.includes('class="lit risk-curve"'), 'risk curve chart drawn');
const d = (panel.match(/class="lit risk-curve"[^>]*d="([^"]+)"/) || panel.match(/class="lit risk-curve" d="([^"]+)"/) || [])[1] || '';
const npts = (d.match(/[ML]/g) || []).length;
ok(npts === 51, 'curve has 51 grid points (got ' + npts + ')');
ok(text.includes('35') && text.includes('65') && /limiting O2/i.test(text), 'chart level lines and limit label');

// --- ceiling preset + PMMA -> critical
r.host.fire('data-risk-preset', 'ceiling');
let p2 = r.panel(); c = cell('PMMA', 101.3, 40.0);
ok(shownIndex(p2) === FF.num(c[F.risk_index], 1) && shownLevel(p2) === 'critical' && strip(p2).includes('Critical'), 'ceiling + PMMA critical (' + shownIndex(p2) + ')');

// --- inert material
r.host.fire('data-risk-material', 'Inert');
p2 = r.panel(); c = cell('Inert', 101.3, 40.0);
ok(shownIndex(p2) === FF.num(c[F.risk_index], 1) && Number(shownIndex(p2)) === 0, 'Inert index 0');
ok(strip(p2).includes('Inert') && p2.includes('data-risk-tag="inert_material"'), 'Inert label + inert tag');
ok(!/Yes — O2 is/.test(strip(p2)), 'Inert is not reported as flammable');

// --- every material at several grid points: shown index == grid cell, exactly
let checked = 0, bad = 0;
const pIdxs = [0, 2, 6, 13];
for (const m of R.materials) {
  r.host.fire('data-risk-material', m.key);
  for (const pi of pIdxs) {
    r.host.fire('data-risk-pressure', String(pi));
    for (const oi of [0, 12, 20, 30, 50]) {
      r.host.fire('data-risk-o2', undefined, oi);
      const h = r.panel(), g = R.grid[m.key][pi][oi];
      checked++;
      if (shownIndex(h) !== FF.num(g[F.risk_index], 1) || shownLevel(h) !== g[F.risk_level]) bad++;
      const t = strip(h), margin = g[F.margin_pct];
      const should = m.inert ? 'Inert' : margin > 0 ? 'Yes — O2 is +' + FF.num(margin, 1) + ' pts' : 'Below the limiting O2';
      if (!t.includes(should)) { bad++; console.error('reading mismatch', m.key, pi, oi, should); }
      for (const k of R.component_keys) {
        const v = g[R.fields.indexOf('components.' + k)];
        if (!t.includes(FF.num(v, 2))) { bad++; console.error('component mismatch', m.key, pi, oi, k); }
      }
    }
  }
}
ok(bad === 0, 'screen == grid for ' + checked + ' cells, all materials (mismatches: ' + bad + ')');

// --- slider and pressure snap to axis values only
r.host.fire('data-risk-material', 'PMMA');
FF.views.senaryo.render(r);
ok(/data-risk-o2/.test(r.panel()) && r.panel().includes('max="' + (R.axes.o2_pct.length - 1) + '"') && r.panel().includes('step="1"'), 'O2 slider is an index over the 51 axis values (step 1, no interpolation)');
ok(R.axes.pressure_kpa.every((v, i) => r.panel().includes('data-risk-pressure="' + i + '"')), 'pressure options = the 14 axis values');

// --- missing risk data: panel falls, FLEX works
{
  const base = root(); FF.views.senaryo.render(base);
  const cut = base.innerHTML.indexOf('<section class="sc-risk');
  const savedRisk = FF.site.risk; delete FF.site.risk;
  const r2 = root();
  try { FF.views.senaryo.render(r2); } catch (e) { ok(false, 'crash without FF.site.risk: ' + e.message); }
  FF.site.risk = savedRisk;
  ok(strip(r2.innerHTML).includes('Risk data not built — run scripts/build_site_data.py'), 'no risk data: message');
  ok(r2.innerHTML.includes('mm²/s') && r2.innerHTML.includes('Predicted burn rate K'), 'FLEX still renders without risk data');
  ok(cut > 0 && r2.innerHTML.slice(0, r2.innerHTML.indexOf('<section class="sc-risk')) === base.innerHTML.slice(0, cut), 'FLEX markup identical with and without risk data');
  ok(!r2.innerHTML.includes('id="risk-index"'), 'no panel numbers without data');
}

// --- no FF.site at all
{
  const FF0 = load(false), x = root();
  try { FF0.views.senaryo.render(x); ok(x.innerHTML.includes('Data not built: run scripts/build_site_data.py'), 'no FF.site: message, no crash'); }
  catch (e) { ok(false, 'crash without FF.site: ' + e.message); }
}
console.log(fails ? fails + ' FAILED' : 'ALL PASSED');
process.exit(fails ? 1 : 0);
