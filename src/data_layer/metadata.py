"""Metadata layer (plans/00_data_layer, step D1): raw/*/detail.json -> investigations / publications / files.

Reads raw/ only. Nothing is invented or filled: blank text -> missing, unknown date format -> error (never a silent
NaT), no zero fill. Personal data (`contacts`: e-mails, phones) is deliberately not carried over. Publications carry no
year because the source has none. Trace columns: psi_id, source_file, source_row (position in the source list; for
`files` the position in added+removed, so the key stays unique).
"""
from __future__ import annotations

import json
import os
import re
from datetime import date, datetime, timezone
from pathlib import Path

import pandas as pd

RAW_DIR = Path(__file__).resolve().parents[2] / "data_analysis" / "Nasa_data" / "raw"
DATE_FORMATS = {"mdy": "%m-%d-%Y", "dMy": "%d-%b-%Y"}      # investigation start/end vs release/submission/modified
INV_TEXT = {"acronym": "investigationAcronym", "title": "title", "objective": "objective", "approach": "approach",
            "hypothesis": "hypothesis", "research_impacts": "researchImpacts", "doi": "doi",
            "flight_program": "flightProgram", "hardware": "experimentHardware", "research_area": "researchArea",
            "sub_research_area": "subResearchArea", "license": "licenseIdentifier",
            "managing_center": "managingNasaCenter"}
INV_DATES = {"start_date": ("investigationStartDate", "mdy"), "end_date": ("investigationEndDate", "mdy"),
             "release_date": ("releaseDate", "dMy"), "submission_date": ("submissionDate", "dMy"),
             "modified_date": ("modifiedDate", "dMy")}


def _s(x):
    """Text or missing: blank/whitespace/None -> pd.NA."""
    if x is None:
        return pd.NA
    x = str(x).strip()
    return x if x else pd.NA


def _date(x, kind: str, field: str):
    x = _s(x)
    if x is pd.NA:
        return pd.NaT
    try:
        return pd.Timestamp(datetime.strptime(x, DATE_FORMATS[kind]).date())
    except ValueError as e:
        raise ValueError(f"{field}: unrecognised date {x!r} (expected {DATE_FORMATS[kind]})") from e


def _size(x, field: str):
    if x is None:
        return pd.NA
    if isinstance(x, float) and not x.is_integer():
        raise ValueError(f"{field}: non-integral size {x!r}")          # never round silently
    return int(x)


def _ms(d):
    ms = (d or {}).get("$date")
    return pd.Timestamp(datetime.fromtimestamp(ms / 1000, tz=timezone.utc).replace(tzinfo=None)) if ms is not None else pd.NaT


def _category(remote_path: str):
    parts = (remote_path or "").split("/")                              # ['', 'Home', 'psi-data', 'PSI-25', <category>, ...]
    return parts[4] if len(parts) > 5 else pd.NA


def parse_detail(obj: dict, psi_id: str, source_file: str):
    """-> (investigation: dict, publications: DataFrame, files: DataFrame). `obj` is not modified."""
    acc = obj.get("accession")
    if not acc:
        raise ValueError(f"{source_file}: missing 'accession'")
    if acc != psi_id:
        raise ValueError(f"{source_file}: accession {acc!r} does not match folder {psi_id!r}")
    trace = dict(psi_id=psi_id, source_file=source_file)
    pubs_in, added, removed = obj.get("publications") or [], obj.get("added") or [], obj.get("removed") or []

    inv = {"psi_id": psi_id, **{k: _s(obj.get(v)) for k, v in INV_TEXT.items()},
           **{k: _date(obj.get(f), kind, f) for k, (f, kind) in INV_DATES.items()},
           "version": obj.get("version"), "total_file_size": _size(obj.get("totalFileSize"), "totalFileSize"),
           "n_publications": len(pubs_in), "n_files_added": len(added), "n_files_removed": len(removed),
           "source_file": source_file, "source_row": 0}

    pubs = pd.DataFrame([{**trace, "source_row": i, "title": _s(p.get("title")), "authors": _s(p.get("authorList")),
                          "doi": _s(p.get("doi")), "pubmed_id": _s(p.get("pubMedID")),
                          "status": _s((p.get("status") or {}).get("annotationValue"))}
                         for i, p in enumerate(pubs_in)],
                        columns=["psi_id", "source_file", "source_row", "title", "authors", "doi", "pubmed_id", "status"])

    rows = []
    for i, (status, f) in enumerate([("added", f) for f in added] + [("removed", f) for f in removed]):
        name = f["file_name"]
        rows.append({**trace, "source_row": i, "file_name": name, "ext": os.path.splitext(name)[1].lower() or pd.NA,
                     "size_bytes": _size(f.get("file_size"), f"{source_file}:{name}"),
                     "category": _category(f.get("remote_path")), "subcategory": _s(f.get("subcategory")),
                     "remote_path": _s(f.get("remote_path")), "status": status,
                     "date_created": _ms(f.get("date_created")), "date_modified": _ms(f.get("date_modified"))})
    files = pd.DataFrame(rows, columns=["psi_id", "source_file", "source_row", "file_name", "ext", "size_bytes", "category",
                                        "subcategory", "remote_path", "status", "date_created", "date_modified"])
    pubs = pubs.astype({c: "string" for c in ("title", "authors", "doi", "pubmed_id", "status", "psi_id", "source_file")})
    files = files.astype({"size_bytes": "Int64", **{c: "string" for c in
                          ("file_name", "ext", "category", "subcategory", "remote_path", "status", "psi_id", "source_file")}})
    return inv, pubs, files


def load_all(raw_dir: str | Path = RAW_DIR):
    """All investigations in raw_dir (sorted by PSI number) -> (investigations, publications, files) DataFrames."""
    raw_dir = Path(raw_dir)
    paths = sorted(raw_dir.glob("PSI-*/detail.json"), key=lambda p: int(re.search(r"PSI-(\d+)", p.parent.name).group(1)))
    if not paths:
        raise FileNotFoundError(f"no PSI-*/detail.json under {raw_dir} (raw/ is not in git; see data_analysis/Nasa_data/README.md)")
    invs, pubs, files = [], [], []
    for p in paths:
        inv, pb, fl = parse_detail(json.loads(p.read_text()), p.parent.name, f"raw/{p.parent.name}/detail.json")
        invs.append(inv), pubs.append(pb), files.append(fl)
    inv_df = pd.DataFrame(invs)
    text = [c for c in inv_df.columns if c in INV_TEXT or c in ("psi_id", "source_file")]
    inv_df = inv_df.astype({**{c: "string" for c in text}, "total_file_size": "Int64"})
    for c in INV_DATES:
        inv_df[c] = pd.to_datetime(inv_df[c])
    return inv_df, pd.concat(pubs, ignore_index=True), pd.concat(files, ignore_index=True)
