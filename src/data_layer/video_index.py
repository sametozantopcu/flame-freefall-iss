"""Video list (plans/00_data_layer, step E1): which files of `files` are videos. Lists only; downloads nothing.

Pure pandas, no network code (a test blocks sockets and inspects this file's imports).
Rules (decided against the real data, see plans/00_data_layer/PLAN.md E1):
- direct videos: .mp4 .ts .avi .mov  (.ts is ACME's main format: vlc-record-...-<test id>.ts; the plan's list lacked it)
- video archives: a .zip whose NAME contains 'video' or 'movie' (not 'avi': 'avionics_package.zip' is no video);
  other zips are data or image sequences and are not listed
- only status == 'added' (removed files can no longer be downloaded)
"""
from __future__ import annotations

import os
import re

import pandas as pd

VIDEO_EXTS = {".mp4", ".ts", ".avi", ".mov"}
ARCHIVE_RE = re.compile(r"video|movie", re.IGNORECASE)
COLUMNS = ["psi_id", "file_name", "ext", "kind", "size_bytes", "remote_path", "date_created", "source_file", "source_row"]


def classify_video(file_name: str, ext: str | None = None) -> str | None:
    """'video', 'video_archive' or None. `ext` defaults to the file name's extension; case-insensitive."""
    ext = (ext if isinstance(ext, str) and ext else os.path.splitext(file_name)[1]).lower()
    if ext in VIDEO_EXTS:
        return "video"
    if ext == ".zip" and ARCHIVE_RE.search(file_name):
        return "video_archive"
    return None


def videos_from_files(files: pd.DataFrame) -> pd.DataFrame:
    """Video rows of a `files` table (metadata.parse_detail / meta/files.parquet), deterministic order, input untouched."""
    f = files[files["status"] == "added"]
    kind = pd.Series([classify_video(n, e) for n, e in zip(f["file_name"], f["ext"])], index=f.index, dtype="object")
    out = f.loc[kind.notna()].assign(kind=kind[kind.notna()])
    out = out.reindex(columns=COLUMNS)
    num = out["psi_id"].str.extract(r"(\d+)")[0].astype(int)
    return out.assign(_n=num).sort_values(["_n", "file_name"]).drop(columns="_n").reset_index(drop=True)


def list_videos(con=None) -> pd.DataFrame:
    """Videos from the committed metadata export (works without raw/). `con`: a connection that has the `files` view."""
    if con is None:
        from .metadata import connect_meta
        con = connect_meta()
    return videos_from_files(con.execute("SELECT * FROM files").df())
