"""02/A3 - dataset cards (.json + .md) for the four modeling datasets.

Expected values were derived independently from the data layer (build_dataset, SPEC, unit_of, get_features,
metadata `investigations`, connect_all `table_map`, outputs/assumptions.json), NOT from src/prediction/cards.py.

dataset    rows  sources (rows, psi_ids)                                   investigations (relation)
droplet    501   flex 274 [PSI-69], cfi 227 [PSI-39]                       PSI-69 FLEX, PSI-39 CFI (source_file)
gas_flame  333   acme_normal 179, acme_inverse 154 [PSI-159], CFI-G only   PSI-159 ACME CFI-G (source_file); PSI-10 absent
smoke      134   smoke 134 [PSI-101], campaign != 'ground'                 PSI-101 SAME-R (source_file), PSI-102 SAME (inferred)
solid_atm  129   bass2 129 [PSI-25]                                        PSI-25 BASS-II (source_file)

defined_rows: droplet burn_time_s 268, burn_rate_K_mm2_s 258, d_ext_mm 197, test_end 274, k_hot_mm2_s 148,
  hf_burn_time_s 147, d_ext_hot_mm 144, has_cool_flame 146; gas_flame burn_time_s 263, hot_ignition 333, ext_mode 272;
  smoke amd_um 131, dusttrak_b_mg_m3 133; solid_atm d_o2_pct 122, d_co2_pct 121, co_final_ppm 108.
labels (true/false/na): droplet burn_time_truncated 241/27/233; gas_flame burn_time_censored 88/175/70.
group_gaps: droplet {"flex.year": 50}; others {}. Only "group"-role column: droplet.year.
assumptions: droplet 6 (flex_*, cfi_*), gas_flame 8 (acme_*), smoke 4 (smoke_*), solid_atm 5 (bass2_*).
"""
import hashlib
import json
import re
import subprocess
import sys

import pandas as pd
import pytest

from conftest import OUT, REPO
from src.data_layer.metadata import connect_meta
from src.data_layer.spec import SPEC, TRACE, unit_of
from src.data_layer.store import connect_all
from src.prediction.datasets import DATASETS, LABELS, MASK, build_dataset, targets_of

from src.prediction import cards  # noqa: E402  (ImportError here = not implemented yet)

NAMES = ["droplet", "gas_flame", "smoke", "solid_atm"]
PY = sys.executable
DOI_RE = re.compile(r"^10\.\d{4,9}/\S+$")
TOP_KEYS = {"name", "title", "description", "n_rows", "content_sha256", "build_command", "sources", "investigations",
            "columns", "targets", "cv_group", "group_gaps", "labels", "assumptions", "notes"}
ROLES = {"trace", "meta", "feature", "group", "target", "mask", "label"}

ROWS = {"droplet": 501, "gas_flame": 333, "smoke": 134, "solid_atm": 129}
SOURCES = {
    "droplet": [("flex", None, 274, ["PSI-69"]), ("cfi", None, 227, ["PSI-39"])],
    "gas_flame": [("acme_normal", "experiment == 'CFI-G'", 179, ["PSI-159"]),
                  ("acme_inverse", "experiment == 'CFI-G'", 154, ["PSI-159"])],
    "smoke": [("smoke", "campaign != 'ground'", 134, ["PSI-101"])],
    "solid_atm": [("bass2", None, 129, ["PSI-25"])],
}
INVESTIGATIONS = {   # psi_id -> (acronym, doi, relation)
    "droplet": {"PSI-69": ("FLEX", "10.60555/mbq8-0451", "source_file"),
                "PSI-39": ("CFI", "10.60555/m6pj-a914", "source_file")},
    "gas_flame": {"PSI-159": ("ACME CFI-G", "10.60555/cyt1-kh64", "source_file")},
    "smoke": {"PSI-101": ("SAME-R", "10.60555/2np7-jv14", "source_file"),
              "PSI-102": ("SAME", "10.60555/gd4k-8h62", "inferred")},
    "solid_atm": {"PSI-25": ("BASS-II", "10.60555/4qc4-de67", "source_file")},
}
DEFINED = {
    "droplet": {"burn_time_s": 268, "burn_rate_K_mm2_s": 258, "d_ext_mm": 197, "test_end": 274, "k_hot_mm2_s": 148,
                "hf_burn_time_s": 147, "d_ext_hot_mm": 144, "has_cool_flame": 146},
    "gas_flame": {"burn_time_s": 263, "hot_ignition": 333, "ext_mode": 272},
    "smoke": {"amd_um": 131, "dusttrak_b_mg_m3": 133},
    "solid_atm": {"d_o2_pct": 122, "d_co2_pct": 121, "co_final_ppm": 108},
}
CENSORING = {("gas_flame", "burn_time_s"): "burn_time_censored", ("droplet", "burn_time_s"): "burn_time_truncated"}
LABEL_COUNTS = {"droplet": {"burn_time_truncated": (241, 27, 233)},
                "gas_flame": {"burn_time_censored": (88, 175, 70)}, "smoke": {}, "solid_atm": {}}
GROUP_GAPS = {"droplet": {"flex.year": 50}, "gas_flame": {}, "smoke": {}, "solid_atm": {}}
PREFIXES = {"droplet": ("flex_", "cfi_"), "gas_flame": ("acme_",), "smoke": ("smoke_",), "solid_atm": ("bass2_",)}
N_ASSUMPTIONS = {"droplet": 6, "gas_flame": 8, "smoke": 4, "solid_atm": 5}
GROUP_ONLY = {"droplet": {"year"}, "gas_flame": set(), "smoke": set(), "solid_atm": set()}
# a few pinned missing counts (missing must never be filled)
MISSING_PINS = {"droplet": {"x_co2": 227, "year": 277, "d0_mm": 91, "burn_time_truncated": 233},
                "gas_flame": {"xo2": 179, "x_fuel": 154, "ext_mode": 61, "burn_time_censored": 70},
                "smoke": {"inlet_velocity_cm_s": 22, "amd_um": 3},
                "solid_atm": {"rod_color": 75, "thickness_mm": 33, "co_final_ppm": 9}}


def _hash(df: pd.DataFrame) -> str:
    """Independent re-implementation of the contract's content_hash formula."""
    h = hashlib.sha256()
    h.update(repr((list(df.columns), [str(t) for t in df.dtypes], len(df))).encode())
    h.update(pd.util.hash_pandas_object(df, index=False).values.tobytes())
    return "sha256:" + h.hexdigest()


@pytest.fixture(scope="module")
def dfs():
    return {n: build_dataset(n) for n in NAMES}


@pytest.fixture(scope="module")
def built():
    return {n: cards.build_card(n) for n in NAMES}


@pytest.fixture(scope="module")
def assumptions():
    return json.loads((OUT / "assumptions.json").read_text(encoding="utf-8"))


# ---------------------------------------------------------------- schema
@pytest.mark.parametrize("name", NAMES)
def test_card_schema_validates(built, name):
    card = built[name]
    assert set(card) == TOP_KEYS
    assert json.loads(json.dumps(card, ensure_ascii=False)) == card       # JSON-serialisable, no tuples/numpy
    cards.DatasetCard.model_validate(card)
    assert card["name"] == name
    for k in ("title", "description"):
        assert isinstance(card[k], str) and card[k].strip()
    assert card["build_command"] == "python -m src.prediction.datasets build"
    assert isinstance(card["notes"], list) and all(isinstance(s, str) for s in card["notes"])


def test_schema_rejects_extra_and_missing_keys(built):
    from pydantic import ValidationError
    card = json.loads(json.dumps(built["smoke"]))
    with pytest.raises(ValidationError):
        cards.DatasetCard.model_validate({**card, "unexpected": 1})
    bad = dict(card)
    del bad["content_sha256"]
    with pytest.raises(ValidationError):
        cards.DatasetCard.model_validate(bad)
    with pytest.raises(ValidationError):
        cards.DatasetCard.model_validate({**card, "n_rows": "many"})


def test_card_dir():
    assert cards.CARD_DIR == REPO / "docs" / "datasets"


# ---------------------------------------------------------------- rows, hash, sources
@pytest.mark.parametrize("name", NAMES)
def test_rows_and_hash(built, dfs, name):
    card, df = built[name], dfs[name]
    assert card["n_rows"] == ROWS[name] == len(df)
    assert cards.content_hash(df) == _hash(df)
    assert card["content_sha256"] == _hash(df)
    assert re.fullmatch(r"sha256:[0-9a-f]{64}", card["content_sha256"])


def test_hash_changes_with_one_value(dfs):
    df = dfs["solid_atm"].copy()
    before = cards.content_hash(df)
    df.loc[0, "o2_init_pct"] = df.loc[0, "o2_init_pct"] + 0.01
    assert cards.content_hash(df) != before
    df2 = dfs["droplet"].copy()
    df2.loc[5, "source_row"] = df2.loc[5, "source_row"] + 1                 # trace columns are hashed too
    assert cards.content_hash(df2) != cards.content_hash(dfs["droplet"])
    df3 = dfs["smoke"].copy()
    df3["amd_um"] = df3["amd_um"].astype("float32")                          # dtype change alone changes the hash
    assert cards.content_hash(df3) != cards.content_hash(dfs["smoke"])


@pytest.mark.parametrize("name", NAMES)
def test_sources(built, dfs, name):
    got = [(s["table"], s["row_filter"], s["n_rows"], s["psi_ids"]) for s in built[name]["sources"]]
    assert got == SOURCES[name]
    df = dfs[name]
    for table, query, n, psi in got:                                          # cross-check against the data
        assert query == DATASETS[name]["sources"][table]
        assert n == int((df["source_table"] == table).sum())
        assert psi == sorted(df.loc[df["source_table"] == table, "psi_id"].unique())


# ---------------------------------------------------------------- investigations / DOIs
@pytest.mark.parametrize("name", NAMES)
def test_investigations_and_dois(built, dfs, name):
    inv = built[name]["investigations"]
    by_id = {i["psi_id"]: i for i in inv}
    assert len(by_id) == len(inv), "duplicate psi_id"
    assert set(by_id) == set(INVESTIGATIONS[name])
    meta = connect_meta().execute("SELECT psi_id, acronym, doi, doi_flag FROM investigations").df().set_index("psi_id")
    for pid, (acr, doi, rel) in INVESTIGATIONS[name].items():
        e = by_id[pid]
        assert set(e) == {"psi_id", "acronym", "doi", "doi_flag", "relation"}
        assert (e["acronym"], e["doi"], e["relation"]) == (acr, doi, rel)
        assert e["doi"] == meta.loc[pid, "doi"] and e["doi_flag"] == meta.loc[pid, "doi_flag"]
        assert DOI_RE.match(e["doi"])
    present = set(dfs[name]["psi_id"])
    assert {p for p, e in by_id.items() if e["relation"] == "source_file"} == present


def test_smoke_cites_psi102_as_inferred(built):
    tm = connect_all().execute("SELECT psi_id, \"table\" FROM table_map WHERE relation = 'inferred'").df()
    assert ("PSI-102", "smoke") in set(map(tuple, tm.values))
    inferred = [i for i in built["smoke"]["investigations"] if i["relation"] == "inferred"]
    assert [i["psi_id"] for i in inferred] == ["PSI-102"]
    for n in ("droplet", "gas_flame", "solid_atm"):
        assert not [i for i in built[n]["investigations"] if i["relation"] == "inferred"]
    # PSI-10 rows are filtered out of gas_flame (CFI-G only) -> not cited
    assert "PSI-10" not in {i["psi_id"] for i in built["gas_flame"]["investigations"]}


# ---------------------------------------------------------------- columns
def _role(name, col):
    if col in TRACE:
        return "trace"
    if col == "source_table" or col in DATASETS[name].get("extra", []):
        return "meta"
    if col in targets_of(name):
        return "target"
    if col.startswith(MASK):
        return "mask"
    if col in LABELS.get(name, []):
        return "label"
    if col in GROUP_ONLY[name]:
        return "group"
    return "feature"


@pytest.mark.parametrize("name", NAMES)
def test_columns(built, dfs, name):
    df, cols = dfs[name], built[name]["columns"]
    assert [c["name"] for c in cols] == list(df.columns)                    # each once, same order
    for c in cols:
        assert set(c) == {"name", "role", "dtype", "unit", "missing"}
        col = c["name"]
        assert c["role"] in ROLES
        assert c["role"] == _role(name, col), col
        assert c["dtype"] == str(df[col].dtype), col
        assert isinstance(c["unit"], str) and c["unit"].strip(), col
        assert c["unit"] == unit_of(col), col
        assert type(c["missing"]) is int and c["missing"] == int(df[col].isna().sum()), col
    by = {c["name"]: c for c in cols}
    for col, n in MISSING_PINS[name].items():
        assert by[col]["missing"] == n, col
    unknown = [c["name"] for c in cols if c["unit"] == "unit_unknown"]
    assert set(TRACE) <= set(unknown)                                        # unknown -> literal "unit_unknown"


def test_some_units_and_roles(built):
    by = {n: {c["name"]: c for c in built[n]["columns"]} for n in NAMES}
    assert by["droplet"]["burn_rate_K_mm2_s"]["unit"] == "mm²/s (assumed)"
    assert by["droplet"]["year"]["role"] == "group"
    assert by["droplet"]["p_atm"]["role"] == "feature"
    assert by["gas_flame"]["flame_type"]["role"] == "meta"
    assert by["gas_flame"]["day"]["role"] == "feature"
    assert by["gas_flame"]["hot_ignition"]["role"] == "target"
    assert by["smoke"]["sample_temp_c"]["unit"] == "°C"
    assert by["smoke"]["amd_um"]["unit"] == "µm"
    assert by["solid_atm"]["air_display_initial"]["unit"] == "unit_unknown (device reading)"
    assert by["solid_atm"]["pi"]["role"] == "feature"


# ---------------------------------------------------------------- targets
@pytest.mark.parametrize("name", NAMES)
def test_targets(built, dfs, name):
    df, tg = dfs[name], built[name]["targets"]
    tnames = targets_of(name)
    assert [t["name"] for t in tg] == tnames
    for t in tg:
        assert set(t) == {"name", "task", "source_tables", "subset", "defined_rows", "leakage", "censoring"}
        n = t["name"]
        tables = sorted(tb for tb in DATASETS[name]["sources"] if n in SPEC[tb]["targets"])
        assert t["source_tables"] == tables
        assert t["task"] == SPEC[tables[0]]["targets"][n]["task"]
        assert t["subset"] == {tb: SPEC[tb]["targets"][n]["subset"] for tb in tables}
        assert t["defined_rows"] == DEFINED[name][n] == int((df[MASK + n] & df[n].notna()).sum())
        spec_leak = set().union(*[SPEC[tb]["leakage"][n] for tb in tables])
        others = set(tnames) - {n}
        assert set(t["leakage"]) >= spec_leak
        assert set(t["leakage"]) >= others
        assert t["leakage"] == sorted(spec_leak | others)
        assert n not in t["leakage"]
        assert t["censoring"] == CENSORING.get((name, n))
        if t["censoring"]:
            assert t["censoring"] in df.columns


def test_cv_group_and_group_gaps(built):
    for n in NAMES:
        assert built[n]["cv_group"] == DATASETS[n]["cv_group"]
        assert built[n]["group_gaps"] == GROUP_GAPS[n]


# ---------------------------------------------------------------- labels
@pytest.mark.parametrize("name", NAMES)
def test_labels(built, dfs, name):
    labels = built[name]["labels"]
    assert [lb["name"] for lb in labels] == LABELS.get(name, [])
    for lb in labels:
        assert set(lb) == {"name", "meaning", "true", "false", "na"}
        assert isinstance(lb["meaning"], str) and lb["meaning"].strip()
        s = dfs[name][lb["name"]]
        assert (lb["true"], lb["false"], lb["na"]) == LABEL_COUNTS[name][lb["name"]]
        assert (lb["true"], lb["false"], lb["na"]) == (int(s.eq(True).sum()), int(s.eq(False).sum()),
                                                       int(s.isna().sum()))


# ---------------------------------------------------------------- assumptions
@pytest.mark.parametrize("name", NAMES)
def test_assumptions(built, assumptions, name):
    exp = [{"key": k, "text": assumptions[k]} for k in sorted(assumptions) if k.startswith(PREFIXES[name])]
    assert len(exp) == N_ASSUMPTIONS[name]
    assert built[name]["assumptions"] == exp


# ---------------------------------------------------------------- markdown + files
@pytest.mark.parametrize("name", NAMES)
def test_markdown_content(built, name):
    card = built[name]
    md = cards.render_markdown(card)
    assert isinstance(md, str)
    assert re.search(r"[çğıöşüÇĞİÖŞÜ]", md), "markdown should be Turkish"
    for s in [name, str(card["n_rows"]), card["content_sha256"]]:
        assert s in md
    for c in card["columns"]:
        assert c["name"] in md and c["unit"] in md
    for i in card["investigations"]:
        assert i["doi"] in md
    for t in card["targets"]:
        assert t["name"] in md
    for a in card["assumptions"]:
        assert a["key"] in md


@pytest.mark.parametrize("name", NAMES)
def test_committed_cards_match(built, name):
    """Drift guard: docs/datasets/<name>.json/.md are exactly what the code produces today."""
    card = built[name]
    jp, mp = cards.CARD_DIR / f"{name}.json", cards.CARD_DIR / f"{name}.md"
    assert jp.read_text(encoding="utf-8") == json.dumps(card, ensure_ascii=False, indent=2) + "\n"
    assert mp.read_text(encoding="utf-8") == cards.render_markdown(card)
    assert cards.DatasetCard.model_validate(json.loads(jp.read_text(encoding="utf-8")))


def test_write_cards_deterministic_utf8(tmp_path):
    a, b = tmp_path / "a", tmp_path / "b"
    pa, pb = cards.write_cards(a), cards.write_cards(b)
    exp = sorted(f"{n}.{ext}" for n in NAMES for ext in ("json", "md"))
    assert sorted(p.name for p in pa) == exp == sorted(p.name for p in pb)
    for name in exp:
        ba, bb = (a / name).read_bytes(), (b / name).read_bytes()
        assert ba == bb, name
        text = ba.decode("utf-8")                                              # strict UTF-8
        if name.endswith(".json"):
            assert "\\u00" not in text, "ensure_ascii=False expected"
    droplet = (a / "droplet.json").read_text(encoding="utf-8")
    assert "mm²/s" in droplet and "ç" in droplet                             # unit + Turkish assumption text intact
    assert "µm" in (a / "smoke.json").read_text(encoding="utf-8")


def test_cli_write(tmp_path):
    r = subprocess.run([PY, "-m", "src.prediction.cards", "write", str(tmp_path)], cwd=REPO,
                       capture_output=True, text=True)
    assert r.returncode == 0, r.stderr
    for n in NAMES:
        assert (tmp_path / f"{n}.json").read_bytes() == (cards.CARD_DIR / f"{n}.json").read_bytes()
        assert (tmp_path / f"{n}.md").read_bytes() == (cards.CARD_DIR / f"{n}.md").read_bytes()
