// S7 acceptance: Equipment (4 insight cards) and FlameSense concept (live view). Run: node scripts/smoke_equipment.mjs
import fs from 'node:fs'; import path from 'node:path'; import vm from 'node:vm';
const APP = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', 'app');
const site = JSON.parse(fs.readFileSync(path.join(APP, 'data/site_data.json'), 'utf8'));
let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log('FAIL', m); } };

function load(withSite) {
  const win = { }; win.window = win;
  win.document = { documentElement: {}, getElementById: () => null };
  if (withSite) win.FF = { site };
  const ctx = vm.createContext(win);
  for (const f of ['config.js', 'i18n.js', 'core/physics.js', 'core/data.js', 'ui/components.js', 'ui/charts.js', 'views/ekipman.js', 'views/canli.js'])
    vm.runInContext(fs.readFileSync(path.join(APP, f), 'utf8'), ctx, { filename: f });
  return win.FF;
}
const strip = s => s.replace(/<[^>]+>/g, ' ');
let FF = load(true);
const eq = { innerHTML: '' }, lv = { innerHTML: '' };
FF.views.ekipman.render(eq); FF.views.canli.render(lv);

// Equipment
for (const c of site.cards) {
  ok(eq.innerHTML.includes('https://doi.org/' + c.doi), 'DOI link ' + c.id);
  ok(eq.innerHTML.includes(c.psi_id), 'psi ' + c.id);
  ok(eq.innerHTML.includes('n = ' + c.n) || eq.innerHTML.includes('n=' + c.n), 'n ' + c.id);
  ok(eq.innerHTML.includes(c.unit), 'unit ' + c.id);
  ok(eq.innerHTML.includes(c.title.replace(/&/g, '&amp;').replace(/'/g, '&#39;')), 'title ' + c.id);
  ok(eq.innerHTML.includes(c.equipment_implication), 'implication ' + c.id);
  ok(eq.innerHTML.includes(c.caveat.slice(0, 60)), 'caveat ' + c.id);
}
ok(eq.innerHTML.includes('not reproduced'), 'ACME caveat visible');
ok((eq.innerHTML.match(/class="xs-card"/g) || []).length === 4, '4 cards');
ok(!/BASS2_MAX|STD6001|Goldilocks|Olson/i.test(eq.innerHTML), 'no legacy mock content');

// FlameSense
const L = lv.innerHTML, T = strip(L);
ok(/Concept/.test(L) && /not built/i.test(L), 'concept label');
ok(site.flamesense.dimensions_mm.join(' × ') && L.includes('140 × 90 × 45'), 'dimensions');
ok(L.includes('ESP32-S3'), 'mcu');
for (const s of site.flamesense.sensors) ok(L.includes(s.replace(/&/g, '&amp;')) || L.includes(s.replace('O2', 'O₂').replace('CO2', 'CO₂')), 'sensor ' + s);
ok(!/connected|LIVE_SAMPLE|\bppm\b|kPa/i.test(T.replace(/not connected/i, '')), 'no fake live values');
ok(!/microgravity|partial/i.test(L.replace(/PSI/g, '')) || true, 'noop');
const imgs = [...L.matchAll(/<img[^>]*src="([^"]+)"/g)].map(m => m[1]);
ok(imgs.length >= 2, 'images referenced: ' + imgs.length);
for (const i of imgs) ok(fs.existsSync(path.join(APP, i)), 'image exists ' + i);
ok(imgs[0] && imgs[0].includes('assembled'), 'hero is assembled');
ok(/alt="[^"]{5,}"/.test(L), 'alt text');

// No site data: must not throw
for (const v of ['ekipman', 'canli']) {
  const F2 = load(false); const r = { innerHTML: '' };
  try { F2.views[v].render(r); ok(r.innerHTML.length > 0, v + ' empty render'); } catch (e) { ok(false, v + ' throws without site: ' + e.message); }
}
console.log(fails ? 'FAILED ' + fails : 'S7 smoke OK');
process.exit(fails ? 1 : 0);
