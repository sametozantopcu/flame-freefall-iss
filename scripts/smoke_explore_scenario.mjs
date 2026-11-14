// S6 acceptance: Explore + Scenario on real site data. Usage: node scripts/smoke_explore_scenario.mjs
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const APP = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', 'app');
let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.error('FAIL: ' + m); } else console.log('ok: ' + m); };

function load(withSite) {
  const win = { document: { documentElement: {} }, addEventListener() {} };
  win.window = win;
  const ctx = vm.createContext(win);
  ctx.document = win.document;
  const files = (withSite ? ['data/site_data.js'] : []).concat(['config.js', 'i18n.js', 'core/physics.js', 'core/data.js', 'ui/components.js', 'ui/charts.js', 'views/kesif.js', 'views/senaryo.js']);
  for (const f of files) vm.runInContext(fs.readFileSync(path.join(APP, f), 'utf8'), ctx, { filename: f });
  return win.FF;
}
const root = () => ({ innerHTML: '', querySelectorAll() { return []; }, querySelector() { return null; } });
const J = JSON.parse(fs.readFileSync(path.join(APP, 'data/site_data.json'), 'utf8'));

// --- Explore
let FF = load(true), r = root();
FF.views.kesif.render(r);
const nrows = (r.innerHTML.match(/data-psi="/g) || []).length;
ok(nrows === 24, 'explore lists 24 investigations (got ' + nrows + ')');
ok(r.innerHTML.includes('score is an assumption'), 'explore shows score-assumption note');
ok(r.innerHTML.includes('O₂ 17–35%') && r.innerHTML.includes('56–101 kPa'), 'explore reads habitat ranges from meta');
const invs = FF.data.investigations();
const firstNull = invs.findIndex(i => i.score === null);
ok(firstNull > 0 && invs.slice(firstNull).every(i => i.score === null), 'null scores sorted last');
const minK = J.meta.score_assumptions.min_known;
const well = invs.filter(i => i.score !== null).map(i => i.score);
ok(well.every((s, i) => i === 0 || well[i - 1] >= s), 'well-documented scored sorted descending');
const seq = invs.map(i => i.score_status === 'scored' ? 0 : i.score_status === 'low_confidence' ? 1 : 2);
ok(invs.every(i => ['scored', 'low_confidence', 'not_scorable'].includes(i.score_status)), 'score_status is one of three states');
ok(invs.every(i => (i.score_status === 'scored') === (i.score !== null) && (i.score_status !== 'scored' || i.n_components_known >= minK)), 'only scored rows carry a score');
const lowInv = invs.find(i => i.score_status === 'low_confidence');
if (lowInv) {
  let h2; const r4 = { innerHTML: '', querySelector() { return null; },
    querySelectorAll(sel) { return sel === '[data-psi]' ? [{ getAttribute: () => lowInv.psi_id, addEventListener(e, h) { h2 = h; } }] : []; } };
  FF.views.kesif.render(r4); h2();
  ok(r4.innerHTML.includes('Low confidence — only ' + lowInv.n_components_known + ' of 6'), 'low-confidence label shown');
  ok(!/100\.0/.test(r4.innerHTML), 'no misleading 100.0 for low confidence');
}
ok(seq.every((v, i) => i === 0 || seq[i - 1] <= v), 'order: well-documented, low-confidence, not scorable');
for (const inv of invs) {
  const c = FF.data.contributions(inv, J.meta.score_assumptions.weights);
  const sum = Object.values(c).reduce((a, v) => a + (v === null ? 0 : v), 0);
  if (inv.score !== null) { if (Math.abs(sum - inv.score) > 1e-6) ok(false, 'contrib sum ' + inv.psi_id); }
  else if (inv.score_status === 'not_scorable' && Object.values(c).some(v => v !== null)) ok(false, 'not-scorable has contributions ' + inv.psi_id);
}
ok(true, 'component contributions sum to score');
const nullInv = invs[invs.length - 1];
FF.views.kesif.render(r); // selected = first; check a null one through click simulation
let handler;
const r3 = { innerHTML: '', querySelector() { return null; },
  querySelectorAll(sel) { return sel === '[data-psi]' ? [{ getAttribute: () => nullInv.psi_id, addEventListener(e, h) { handler = h; } }] : []; } };
FF.views.kesif.render(r3); handler(); // click -> rerender with null investigation selected
ok(r3.innerHTML.includes('Not scorable: insufficient condition data'), 'null score shown as not scorable');
ok(!/Habitat relevance score<\/span><span[^>]*>0/.test(r3.innerHTML), 'null score never shown as 0');
ok(r3.innerHTML.includes('no data'), 'missing components labelled no data');
FF.views.kesif.render(r); 
ok(/href="https:\/\/doi\.org\//.test(r.innerHTML) || !invs[0].doi, 'DOI link rendered');

// --- Model parity with Python predict
const rows = [
  { d0_mm: 3.0, p_atm: 1.0, x_o2: 0.21, x_he: 0, x_co2: 0, fuel: 'Heptane', diluent: 'N2' },
  { d0_mm: 2.2, p_atm: 0.5, x_o2: 0.3, x_he: 0.4, x_co2: 0, fuel: 'Methanol', diluent: 'He' },
  { d0_mm: 4.5, p_atm: 2.5, x_o2: 0.15, x_he: 0, x_co2: 0.6, fuel: 'Methanol', diluent: 'CO2' },
  { d0_mm: null, p_atm: 1.0, x_o2: null, x_he: 0, x_co2: 0.1, fuel: 'Heptane', diluent: 'CO2' }
];
const py = JSON.parse(execFileSync(process.env.PY || 'python3', ['-c',
  'import json,sys;sys.path.insert(0,".");from src.prediction.flex_model import predict;' +
  'd=json.load(open("app/data/site_data.json"));print(json.dumps(predict(d["model"],json.loads(sys.argv[1])).tolist()))',
  JSON.stringify(rows)], { cwd: path.join(APP, '..') }).toString());
rows.forEach((row, i) => {
  const js = FF.model.predict(FF.site.model, row);
  ok(Math.abs(js - py[i]) < 1e-6, 'JS predict == Python predict row ' + i + ' (' + js.toFixed(6) + ')');
});

// --- Scenario
const s = root();
FF.views.senaryo.render(s);
const cv = FF.site.model.cv;
ok(s.innerHTML.includes(FF.num(cv.fuel_diluent.r2, 3)) && s.innerHTML.includes(FF.num(cv.year.r2, 3)), 'scenario shows CV R2 from model.cv');
ok(s.innerHTML.includes('Valid only for fuel/diluent combinations present in the training data'), 'scenario honesty: valid combos');
ok(s.innerHTML.includes('Moon/Mars gravity effects are not modelled'), 'scenario honesty: no partial gravity');
ok(s.innerHTML.includes(FF.site.model.doi) && s.innerHTML.includes('n = ' + FF.site.model.n), 'scenario shows DOI and n');
ok(s.innerHTML.includes('mm²/s'), 'scenario shows K output');
const m = FF.site.model.ranges;
ok(s.innerHTML.includes('min="' + m.p_atm.min + '"') && s.innerHTML.includes('max="' + m.d0_mm.max + '"'), 'sliders bounded by model.ranges');

// negative / out-of-range handling: extreme state must be clamped; negative prediction shows text, no number
{
  const mod = JSON.parse(JSON.stringify(FF.site.model));
  ok(mod.ranges.p_atm.min > 0, 'pressure slider lower bound is above 0 atm (' + mod.ranges.p_atm.min.toFixed(3) + ')');
  mod.coef.intercept = -1e6; // force a negative prediction
  const saved = FF.site.model; FF.site.model = mod;
  const sn = root(); FF.views.senaryo.render(sn);
  FF.site.model = saved;
  ok(sn.innerHTML.includes("outside the model's valid range") || sn.innerHTML.includes('outside the model&#39;s valid range') || sn.innerHTML.includes('outside the model&#039;s valid range'), 'negative prediction shows "outside the model\'s valid range"');
  ok(!/-\d[\d.,]*\s*mm²\/s/.test(sn.innerHTML) && !/−\d[\d.,]*\s*mm²\/s/.test(sn.innerHTML), 'negative burn rate never shown as number');
}

// --- Charts on real data
{
  const pick = (psi) => { let h; const rr = { innerHTML: '', querySelector() { return null; },
    querySelectorAll(sel) { return sel === '[data-psi]' ? [{ getAttribute: () => psi, addEventListener(e, f) { h = f; } }] : []; } };
    FF.views.kesif.render(rr); h(); return rr.innerHTML; };
  const ser = J.series;
  ok(Object.keys(ser).length >= 3, 'site_data has measured series (' + Object.keys(ser).join(', ') + ')');
  for (const [psi, sr] of Object.entries(ser)) {
    ok(sr.points.every(p => p.slice(0, 2).every(v => typeof v === 'number' && isFinite(v))) && sr.n_plotted === sr.points.length && sr.n_plotted <= sr.n_total, 'series ' + psi + ' has only finite measured points (' + sr.n_plotted + ' of ' + sr.n_total + ')');
    const html = pick(psi);
    const dots = (html.match(/class="lit-fill"/g) || []).length;
    ok(dots === sr.n_plotted, 'explore chart ' + psi + ' draws one dot per measured point (' + dots + ')');
    ok(html.includes('not zero-filled') && html.includes(sr.source_files[0].split('/').pop()), 'explore chart ' + psi + ' states source and missing-value rule');
  }
  const noSer = invs.find(i => !ser[i.psi_id]);
  ok(pick(noSer.psi_id).includes('No plottable series in the data layer'), 'investigation without series shows "no plottable series" note');
  ok(!/class="lit-fill"/.test(pick(noSer.psi_id)), 'no invented curve without a series');
  ok(ser['PSI-25'].reference && pick('PSI-25').includes('reference: no O2 change'), 'reference line is labelled as reference');
  const sc = root(); FF.views.senaryo.render(sc);
  ok(/<svg class="chart"/.test(sc.innerHTML) && sc.innerHTML.includes('class="lit"'), 'scenario draws the FLEX response curve');
  ok(sc.innerHTML.includes('Ridge model, group-CV R² ' + FF.num(cv.fuel_diluent.r2, 3)), 'scenario chart note shows group-CV R2');
  ok(sc.innerHTML.includes('Predicted burn rate K, mm²/s') && sc.innerHTML.includes('Oxygen, %'), 'scenario chart has axis labels with units');
  const mod = JSON.parse(JSON.stringify(FF.site.model)); mod.coef.intercept = -1e6;
  const saved = FF.site.model; FF.site.model = mod; const sn2 = root(); FF.views.senaryo.render(sn2); FF.site.model = saved;
  ok(!sn2.innerHTML.includes('class="lit"'), 'all-negative curve draws no line (negative region not drawn)');
}

// --- No data: must not crash
const FF0 = load(false);
for (const v of ['kesif', 'senaryo']) {
  const x = root();
  try { FF0.views[v].render(x); ok(x.innerHTML.includes('Data not built: run scripts/build_site_data.py'), v + ' without FF.site shows message'); }
  catch (e) { ok(false, v + ' crashed without FF.site: ' + e.message); }
}
console.log(fails ? fails + ' FAILED' : 'ALL PASSED');
process.exit(fails ? 1 : 0);
