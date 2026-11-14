"""Data cards for the modeling datasets (plans/02_m2_prediction, step A3).

    python -m src.prediction.cards write [out_dir]          # default docs/datasets/ (committed documentation)

A card is generated from the data, never hand-written: units (spec.unit_of), roles, missing counts, targets with their
subsets / leakage / censoring label, investigations with DOIs (metadata layer, plus the inferred PSI-102 link for smoke),
the relevant EDA assumptions (outputs/assumptions.json, by key prefix) and a content hash of the dataset. The committed
cards must equal what this module produces (a test guards the drift).
"""
from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path
from typing import Literal, Optional

import pandas as pd
from pydantic import BaseModel, ConfigDict

from src.data_layer import metadata
from src.data_layer.spec import SPEC, TRACE, unit_of
from src.data_layer.store import REPO, connect, connect_all
from src.prediction.datasets import DATASETS, LABELS, MASK, build_dataset, targets_of

CARD_DIR = REPO / "docs" / "datasets"
ASSUMPTIONS = REPO / "data_analysis" / "Nasa_data" / "analysis" / "outputs" / "assumptions.json"
BUILD_COMMAND = "python -m src.prediction.datasets build"
PREFIXES = {"droplet": ("flex_", "cfi_"), "gas_flame": ("acme_",), "smoke": ("smoke_",), "solid_atm": ("bass2_",)}
CENSORING = {("gas_flame", "burn_time_s"): "burn_time_censored", ("droplet", "burn_time_s"): "burn_time_truncated"}
TEXT = {
    "droplet": ("Damlacık yanması (FLEX + CFI)",
                "ISS'te serbest damlacık yanma deneyleri: FLEX (PSI-69, metanol/heptan) ve CFI (PSI-39, dodekan/farnesan karışımları). "
                "Girdiler başlangıç çapı, basınç ve ortam bileşimi; hedefler yanma süresi, yanma hızı sabiti K, sönme çapı ve test sonu."),
    "gas_flame": ("Gaz alevi tutuşma ve sönme (ACME CFI-G)",
                  "ACME CFI-G (PSI-159) normal ve ters etilen alevleri: tutuşma, yanma süresi ve sönme biçimi."),
    "smoke": ("Mikrogravite dumanı (SAME / SAME-R uçuş)",
              "Isıtılan malzemelerden çıkan duman parçacıkları (yalnızca uçuş testleri): ortalama çap ve DustTrak kütle derişimi."),
    "solid_atm": ("Katı malzeme yanmasında atmosfer değişimi (BASS-II)",
                  "BASS-II (PSI-25) testlerinde yanma boyunca O2/CO2 değişimi ve son CO derişimi."),
}
NOTES = {
    "droplet": ["FLEX ve CFI hedefleri birleştirilmedi: FLEX burn_rate_K_mm2_s ile CFI k_hot_mm2_s ayrı sütunlar (yakıtlar kesişmiyor, "
                "tanımlar farklı); birleştirmek bir modelleme kararıdır.",
                "CFI'de x_co2 ölçülmemiş/raporlanmamış: boş bırakıldı, 0 değildir.",
                "FLEX year 50 testte kaynakta boş; doldurulmadı (CV anahtarı fuel × diluent)."],
    "gas_flame": ["Normal alevde xo2_init (ortam O2) ile ters alevde xo2 (oksitleyici akımındaki O2) farklı büyüklükler: ayrı sütunlar.",
                  "Test günü numaraları iki alev türünde de 1'den başlar; CV grubu flame_type × day.",
                  "PSI-10 Flame Design satırları hedef içermediği için yok (yalnızca CFI-G).",
                  "Burn time alt kümesi dışında ext_mode'u bilinen 9 satır var (1 'No' + FT, 8 'flash' + SE); sansür bayrakları orada NA."],
    "smoke": ["Yalnızca uçuş (SAME + SAME-R): zemin testlerinin eşlemesi doğrulanmadığı için çıkarıldı.",
              "SAME uçuş satırları PSI-101 çalışma kitabında; PSI-102 (SAME) ile bağı kampanya adından çıkarımdır.",
              "Malzeme her modelde feature olarak kalmalı (Simpson paradoksu: ısıtıcı sıcaklığı ile çap ilişkisi malzeme içinde ters döner)."],
    "solid_atm": ["Negatif CO değerleri düzeltilmedi; co_final_ppm hedefinin alt kümesi co_negative_flag satırlarını dışarıda bırakır.",
                  "d_o2_pct alt kümesi O2 anomalisi işaretli satırları dışarıda bırakır (filtre sütunları sette yok).",
                  "PI (araştırmacı) ve malzeme iç içe; CV grubu pi."],
}
LABEL_MEANING = {
    "burn_time_censored": "ext_mode == 'FT' (akış kesildi): yanma süresi sağdan sansürlü. Yalnızca burn_time satırlarında ve sonlanma "
                          "biçimi biliniyorsa dolu; bilinmiyorsa NA.",
    "burn_time_truncated": "test_end != 'Completion' (sönme/bozulma): yanma süresi kesilmiş. Yalnızca FLEX burn_time satırlarında; "
                           "CFI'de test_end yok → NA.",
}


class _M(BaseModel):
    model_config = ConfigDict(extra="forbid")


class Source(_M):
    table: str
    row_filter: Optional[str]
    n_rows: int
    psi_ids: list[str]


class Investigation(_M):
    psi_id: str
    acronym: Optional[str]
    doi: str
    doi_flag: str
    relation: Literal["source_file", "inferred"]


class Column(_M):
    name: str
    role: Literal["trace", "meta", "feature", "group", "target", "mask", "label"]
    dtype: str
    unit: str
    missing: int


class Target(_M):
    name: str
    task: str
    source_tables: list[str]
    subset: dict[str, str]
    defined_rows: int
    leakage: list[str]
    censoring: Optional[str]


class Label(_M):
    name: str
    meaning: str
    true: int
    false: int
    na: int


class Assumption(_M):
    key: str
    text: str


class DatasetCard(_M):
    name: str
    title: str
    description: str
    n_rows: int
    content_sha256: str
    build_command: str
    sources: list[Source]
    investigations: list[Investigation]
    columns: list[Column]
    targets: list[Target]
    cv_group: list[str]
    group_gaps: dict[str, int]
    labels: list[Label]
    assumptions: list[Assumption]
    notes: list[str]


def content_hash(df: pd.DataFrame) -> str:
    h = hashlib.sha256()
    h.update(repr((list(df.columns), [str(t) for t in df.dtypes], len(df))).encode())
    h.update(pd.util.hash_pandas_object(df, index=False).values.tobytes())
    return "sha256:" + h.hexdigest()


def _psi_key(p: str) -> int:
    return int(p.split("-")[1])


def _role(name: str, col: str) -> str:
    cfg = DATASETS[name]
    if col in TRACE:
        return "trace"
    if col == "source_table" or col in cfg.get("extra", []):
        return "meta"
    if col in targets_of(name):
        return "target"
    if col.startswith(MASK):
        return "mask"
    if col in LABELS.get(name, []):
        return "label"
    feats = {c for t in cfg["sources"] for c in SPEC[t]["num"] + SPEC[t]["cat"]}
    groups = {c for t in cfg["sources"] for c in SPEC[t]["groups"]}
    return "group" if col in groups and col not in feats else "feature"


def build_card(name: str, con=None) -> dict:
    df = build_dataset(name, con)
    cfg = DATASETS[name]
    sources = [dict(table=t, row_filter=q, n_rows=int((df.source_table == t).sum()),
                    psi_ids=sorted(df.loc[df.source_table == t, "psi_id"].unique().tolist(), key=_psi_key))
               for t, q in cfg["sources"].items()]

    meta = metadata.connect_meta()
    inv = meta.execute("SELECT psi_id, acronym, doi, doi_flag FROM investigations").df().set_index("psi_id")
    rel = {p: "source_file" for s in sources for p in s["psi_ids"]}
    tm = connect_all().execute("SELECT psi_id, \"table\" FROM table_map WHERE relation = 'inferred'").fetchall()
    for p, t in tm:
        if t in cfg["sources"] and p not in rel:
            rel[p] = "inferred"
    investigations = [dict(psi_id=p, acronym=None if pd.isna(inv.loc[p, "acronym"]) else str(inv.loc[p, "acronym"]),
                           doi=str(inv.loc[p, "doi"]), doi_flag=str(inv.loc[p, "doi_flag"]), relation=r)
                      for p, r in sorted(rel.items(), key=lambda kv: (_psi_key(kv[0]), kv[1]))]

    columns = [dict(name=c, role=_role(name, c), dtype=str(df[c].dtype), unit=unit_of(c), missing=int(df[c].isna().sum()))
               for c in df.columns]
    tnames = targets_of(name)
    targets = []
    for t in tnames:
        tabs = sorted(tb for tb in cfg["sources"] if t in SPEC[tb]["targets"])
        leak = set().union(*[set(SPEC[tb]["leakage"][t]) for tb in tabs]) | (set(tnames) - {t})
        targets.append(dict(name=t, task=SPEC[tabs[0]]["targets"][t]["task"], source_tables=tabs,
                            subset={tb: SPEC[tb]["targets"][t]["subset"] for tb in tabs},
                            defined_rows=int((df[MASK + t] & df[t].notna()).sum()), leakage=sorted(leak),
                            censoring=CENSORING.get((name, t))))
    gaps = {}
    for t in cfg["sources"]:
        part = df[df.source_table == t]
        for g in SPEC[t]["groups"]:
            n = int(part[g].isna().sum())
            if g not in cfg["cv_group"] and n:
                gaps[f"{t}.{g}"] = n
    labels = []
    for lab in LABELS.get(name, []):
        s = df[lab]
        labels.append(dict(name=lab, meaning=LABEL_MEANING[lab], true=int((s == True).sum()),  # noqa: E712
                           false=int((s == False).sum()), na=int(s.isna().sum())))  # noqa: E712
    a = json.loads(ASSUMPTIONS.read_text())
    assumptions = [dict(key=k, text=a[k]) for k in sorted(a) if k.startswith(PREFIXES[name])]

    card = dict(name=name, title=TEXT[name][0], description=TEXT[name][1], n_rows=len(df), content_sha256=content_hash(df),
                build_command=BUILD_COMMAND, sources=sources, investigations=investigations, columns=columns, targets=targets,
                cv_group=list(cfg["cv_group"]), group_gaps=gaps, labels=labels, assumptions=assumptions, notes=NOTES[name])
    DatasetCard.model_validate(card)
    return card


def render_markdown(card: dict) -> str:
    L = [f"# {card['title']}", "", card["description"], "",
         f"- **Veri seti:** `{card['name']}` · **Satır:** {card['n_rows']} · **İçerik hash'i:** `{card['content_sha256']}`",
         f"- **Üretme komutu:** `{card['build_command']}` (çıktı `data/modeling/{card['name']}.parquet` ve `.csv`, aynı içerik)",
         f"- **CV grubu:** {' × '.join(card['cv_group'])}", ""]
    L += ["## Kaynaklar", "", "| Tablo | Satır filtresi | Satır | psi_id |", "|---|---|---|---|"]
    L += [f"| `{s['table']}` | {('`' + s['row_filter'] + '`') if s['row_filter'] else '—'} | {s['n_rows']} | {', '.join(s['psi_ids'])} |"
          for s in card["sources"]]
    L += ["", "## Atıf (investigation DOI'leri)", "", "| psi_id | Kısaltma | DOI | Bağ |", "|---|---|---|---|"]
    L += [f"| {i['psi_id']} | {i['acronym'] or '—'} | {i['doi']} | {'kaynak dosya' if i['relation'] == 'source_file' else 'çıkarım'} |"
          for i in card["investigations"]]
    L += ["", "## Hedefler", "", "| Hedef | Görev | Tanımlı satır | Alt küme | Sansür etiketi |", "|---|---|---|---|---|"]
    for t in card["targets"]:
        sub = "; ".join(f"{k}: `{v}`" for k, v in t["subset"].items())
        L.append(f"| `{t['name']}` | {t['task']} | {t['defined_rows']} | {sub} | {('`' + t['censoring'] + '`') if t['censoring'] else '—'} |")
    L += ["", "### Sızıntı (feature olarak KULLANILMAZ)", ""]
    L += [f"- `{t['name']}`: " + ", ".join(f"`{c}`" for c in t["leakage"]) for t in card["targets"]]
    if card["labels"]:
        L += ["", "## Sansür etiketleri", "", "| Etiket | Anlam | True | False | NA |", "|---|---|---|---|---|"]
        L += [f"| `{b['name']}` | {b['meaning']} | {b['true']} | {b['false']} | {b['na']} |" for b in card["labels"]]
    L += ["", "## Sütunlar", "", "| Sütun | Rol | dtype | Birim | Eksik |", "|---|---|---|---|---|"]
    L += [f"| `{c['name']}` | {c['role']} | {c['dtype']} | {c['unit']} | {c['missing']} |" for c in card["columns"]]
    if card["group_gaps"]:
        L += ["", "**Grup sütunu boşlukları (doldurulmadı):** " + ", ".join(f"`{k}` {v}" for k, v in card["group_gaps"].items())]
    L += ["", "## Varsayımlar (EDA)", ""] + [f"- **{a['key']}:** {a['text']}" for a in card["assumptions"]]
    L += ["", "## Notlar", ""] + [f"- {n}" for n in card["notes"]]
    return "\n".join(L) + "\n"


def write_cards(out_dir: str | Path = CARD_DIR) -> list[Path]:
    out = Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)
    con = connect()
    paths = []
    for name in DATASETS:
        card = build_card(name, con)
        (out / f"{name}.json").write_text(json.dumps(card, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        (out / f"{name}.md").write_text(render_markdown(card), encoding="utf-8")
        paths += [out / f"{name}.json", out / f"{name}.md"]
    return paths


if __name__ == "__main__":
    if len(sys.argv) < 2 or sys.argv[1] != "write":
        sys.exit("usage: python -m src.prediction.cards write [out_dir]")
    for p in write_cards(*sys.argv[2:3]):
        print(f"wrote {p}")
