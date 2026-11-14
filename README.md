# Flame in Freefall

**NASA Space Apps Challenge 2026 · "Flame in Freefall"**

A dark-themed web demo that explores NASA Physical Sciences Informatics (PSI) combustion experiments (24 investigations) for lunar and Martian habitat fire safety. It ranks investigations by habitat relevance, predicts FLEX droplet burning rate for known fuel/diluent combinations, and turns data findings into equipment insights. Visitors can also ask an LLM questions grounded in the site's cards. This is a prototype.

Screens: Explore (M1), Scenario (M2), Equipment (M3), and the FlameSense concept (no device was built).

## Quick start

```bash
git clone https://github.com/sametozantopcu/flame-freefall-iss.git
cd flame-freefall-iss
pip install -r requirements.txt
python scripts/build_site_data.py        # writes app/data/site_data.json and site_data.js
python app/server.py --port 8000         # then open http://127.0.0.1:8000/
```

For LLM answers put `API_KEY` in a root `.env` file (read server-side only, never sent to the browser). Without a key the site falls back to the static cards.

The build script reads the cleaned tables in `data_analysis/Nasa_data/analysis/data/`; the raw PSI data (`raw/`, `csv/`, ~8 GB) is not in git, see [data_analysis/Nasa_data/README.md](data_analysis/Nasa_data/README.md).

## Tests

```bash
python -m pytest tests -m "not needs_raw and not slow and not live" -q
node scripts/smoke_explore_scenario.mjs
node scripts/smoke_equipment.mjs
```

CI (`.github/workflows/tests.yml`) runs the same commands. Validation is always group-based (GroupKFold).

## Limits

- No partial-gravity (lunar/Mars g) data exists; only flight (microgravity) and ground (1 g). No partial-g prediction is claimed. Habitat relevance is based on atmosphere overlap (O2, pressure, flow), not gravity.
- The model is valid only for fuel/diluent combinations present in FLEX (heptane/methanol with N2/CO2/He). Out-of-group GroupKFold scores: fuel x diluent R2 about 0.37 (6 groups, n=258), year R2 about 0.57 (3 groups). Small n, high variance.
- The habitat score is a prioritization aid, not a safety certification.
- Missing values are kept as null, never filled with 0.
- FlameSense is a concept only.
- The live LLM answer depends on the EVREN endpoint responding; if it does not respond, the question box falls back to the static cards.

## Documents

| Document | Content |
|---|---|
| [MVP_SPEC.md](MVP_SPEC.md) | Single source of truth for scope (Turkish) |
| [Architecture.md](Architecture.md) | Short architecture and data flow (Turkish) |
| [plans/mvp/PLAN.md](plans/mvp/PLAN.md) | Implementation steps and progress |
| [CLAUDE.md](CLAUDE.md) | Working rules for the team and Claude |
| [data_analysis/Nasa_data/analysis/REPORT.md](data_analysis/Nasa_data/analysis/REPORT.md) | Exploratory data analysis report |

## Data source and attribution

All data come from [NASA PSI](https://psi.nasa.gov). Each investigation must be cited with its own DOI (PSI terms of use). DOIs as listed in `meta.source_dois` of `app/data/site_data.json`:

| PSI id | Investigation | DOI |
|---|---|---|
| PSI-10 | ACME/Flame Design | `10.60555/w4zy-bt45` |
| PSI-20 | ACME BRE | `10.60555/vb93-3y72` |
| PSI-21 | ACME CLD Flame | `10.60555/23e1-9950` |
| PSI-22 | ACME E-FIELD Flames | `10.60555/se5a-8c73` |
| PSI-23 | ACME s-Flame | `10.60555/k57n-p030` |
| PSI-25 | BASS-II | `10.60555/4qc4-de67` |
| PSI-26 | BASS | `10.60555/58h4-dy80` |
| PSI-39 | CFI | `10.60555/m6pj-a914` |
| PSI-47 | DAFT / DAFT-2 | `10.60555/ztgj-d202` |
| PSI-60 | Computational and Experimental Analysis of SPICE Data Sets | `10.60555/mzjm-yv57` |
| PSI-62 | Concurrent Flame Spread Modeling using Flamelet Generated... | `10.60555/e9xp-ex83` |
| PSI-68 | FLEX-2 | `10.60555/byp8-h018` |
| PSI-69 | FLEX | `10.60555/mbq8-0451` |
| PSI-98 | SAFFIRE-I | `10.60555/0t15-1z43` |
| PSI-99 | SAFFIRE-II | `10.60555/2chp-m469` |
| PSI-100 | SAFFIRE-III | `10.60555/040q-4h36` |
| PSI-101 | SAME-R | `10.60555/2np7-jv14` |
| PSI-102 | SAME | `10.60555/gd4k-8h62` |
| PSI-106 | SLICE | `10.60555/pm12-rg61` |
| PSI-107 | SPICE | `10.60555/9kbh-e962` |
| PSI-115 | Utilization of the Smoke Aerosol Measurement Experiment D... | `10.60555/q0v5-1v28` |
| PSI-117 | Effect of External Thermo-Convective Perturbation on Cool... | `10.60555/gz0q-b577` |
| PSI-142 | Quantitative Studies of Cool Flame Transitions at Radiati... | `10.60555/80qf-vj95` |
| PSI-159 | ACME CFI-G | `10.60555/cyt1-kh64` |
