"""E1 - video list: right files, nothing downloaded, deterministic, numbers pinned against the committed metadata."""
import ast
import copy
import json
import socket
from pathlib import Path

import pandas as pd
import pytest

from conftest import REPO
from src.data_layer import metadata, video_index
from src.data_layer.video_index import classify_video, list_videos, videos_from_files

FIX = REPO / "tests" / "fixtures" / "detail_PSI-25.json"
DIRECT_PER_PSI = {"PSI-10": 317, "PSI-23": 290, "PSI-25": 296, "PSI-26": 114, "PSI-39": 246,
                  "PSI-101": 8, "PSI-102": 2, "PSI-107": 19, "PSI-159": 337}
ARCHIVE_PER_PSI = {"PSI-25": 113, "PSI-39": 27, "PSI-107": 1}


@pytest.mark.parametrize("name,ext,expect", [
    ("a.mp4", ".mp4", "video"), ("vlc-record-21301J4.ts", ".ts", "video"), ("v.avi", ".avi", "video"),
    ("m.mov", ".mov", "video"), ("A.MP4", ".MP4", "video"), ("A.TS", None, "video"), ("x.Mp4", "", "video"),
    ("BASS_TEST_B1 original videos.zip", ".zip", "video_archive"), ("Movie_files.ZIP", ".ZIP", "video_archive"),
    ("PSI-23_Engineering Documents_ACME_drawings_avionics_package.zip", ".zip", None),   # 'avi' trap
    ("19115B2_ACME_Converted images.zip", ".zip", None), ("data_run1.zip", ".zip", None),
    ("table.csv", ".csv", None), ("report.pdf", ".pdf", None), ("sheet.xlsx", ".xlsx", None), ("noext", None, None),
    ("video_notes.pdf", ".pdf", None), ("movie.txt", ".txt", None),                      # the word alone is not enough
])
def test_classify(name, ext, expect):
    assert classify_video(name, ext) == expect


def _fixture_files():
    obj = json.loads(FIX.read_text())
    return metadata.parse_detail(obj, "PSI-25", "raw/PSI-25/detail.json")[2]


def test_list():
    """Acceptance: the fixture's video is listed, and nothing touches the network."""
    files = _fixture_files()
    real_connect, real_cc = socket.socket.connect, socket.create_connection

    def boom(*a, **k):
        raise AssertionError("network access attempted")
    socket.socket.connect, socket.create_connection = boom, boom
    try:
        v = videos_from_files(files)
        v2 = list_videos()
    finally:
        socket.socket.connect, socket.create_connection = real_connect, real_cc
    assert len(v) == 1 and v.file_name.iloc[0].endswith("TEST_B1.mp4") and v.kind.iloc[0] == "video"
    assert v.size_bytes.iloc[0] == 5803980 and v.psi_id.iloc[0] == "PSI-25"
    assert set(files.file_name) - set(v.file_name)                       # xlsx/pdf/jpg/zip/docx are not listed
    assert len(v2) == 1770


def test_module_has_no_network_imports():
    tree = ast.parse(Path(video_index.__file__).read_text())
    mods = {a.name.split(".")[0] for n in ast.walk(tree) if isinstance(n, ast.Import) for a in n.names}
    mods |= {n.module.split(".")[0] for n in ast.walk(tree) if isinstance(n, ast.ImportFrom) and n.module and n.level == 0}
    assert not mods & {"requests", "urllib", "http", "socket", "httpx", "aiohttp", "urllib3", "ftplib"}, mods


def test_removed_and_other_files_excluded():
    files = _fixture_files()
    assert (files.status == "removed").sum() == 2
    extra = files.iloc[[0]].copy()
    extra["status"] = "removed"
    extra["file_name"] = "gone.mp4"
    both = pd.concat([files, extra], ignore_index=True)
    assert "gone.mp4" not in set(videos_from_files(both).file_name)
    zips = files.iloc[[0]].assign(file_name="PSI-25_Raw Data_x original videos.zip", ext=".zip")
    assert videos_from_files(pd.concat([files, zips], ignore_index=True)).kind.tolist().count("video_archive") == 1


def test_input_not_mutated_and_deterministic():
    files = _fixture_files()
    before = files.copy(deep=True)
    a = videos_from_files(files)
    pd.testing.assert_frame_equal(files, before)
    pd.testing.assert_frame_equal(a, videos_from_files(files.sample(frac=1, random_state=0)))   # input order irrelevant


def test_order_is_independent_of_input_order_on_many_rows():
    """The fixture has a single video, so shuffling it proves nothing; use the real (multi-investigation) files table."""
    f = metadata.connect_meta().execute("SELECT * FROM files").df()
    a = videos_from_files(f)
    assert len(a) == 1770
    pd.testing.assert_frame_equal(a, videos_from_files(f.sample(frac=1, random_state=0)))
    pd.testing.assert_frame_equal(a, videos_from_files(f.iloc[::-1]))
    assert a.psi_id.drop_duplicates().tolist() == ["PSI-10", "PSI-23", "PSI-25", "PSI-26", "PSI-39",
                                                    "PSI-101", "PSI-102", "PSI-107", "PSI-159"]   # numeric, not alphabetic


# ----------------------------------------------------- real numbers (committed meta/, no raw/ needed)
@pytest.fixture(scope="module")
def real():
    return list_videos()


def test_real_counts(real):
    assert len(real) == 1770 and list(real.columns) == video_index.COLUMNS
    d = real[real.kind == "video"]
    assert len(d) == 1629 and d.ext.value_counts().to_dict() == {".mp4": 855, ".ts": 773, ".avi": 1}
    assert d.groupby("psi_id").size().to_dict() == DIRECT_PER_PSI
    a = real[real.kind == "video_archive"]
    assert len(a) == 141 and a.groupby("psi_id").size().to_dict() == ARCHIVE_PER_PSI and (a.ext == ".zip").all()
    assert set(real.psi_id) == set(DIRECT_PER_PSI)                       # archives add no new investigation


def test_real_quality(real):
    assert real.remote_path.is_unique and real.remote_path.notna().all()
    assert real.size_bytes.notna().all() and (real.size_bytes > 0).all()
    assert round(real[real.kind == "video"].size_bytes.sum() / 1e9, 1) == 341.7
    assert round(real[real.kind == "video_archive"].size_bytes.sum() / 1e9, 1) == 39.1
    nums = real.psi_id.str.extract(r"(\d+)")[0].astype(int).tolist()
    assert nums == sorted(nums)
    assert not real.file_name.str.contains("avionics", case=False).any()


def test_real_none_removed_and_investigations_without_videos(real):
    con = metadata.connect_meta()
    removed = {r[0] for r in con.execute("SELECT remote_path FROM files WHERE status = 'removed'").fetchall()}
    assert not set(real.remote_path) & removed
    all_inv = {r[0] for r in con.execute("SELECT psi_id FROM investigations").fetchall()}
    none = all_inv - set(real.psi_id)
    assert len(none) == 15 and {"PSI-69", "PSI-68", "PSI-98", "PSI-99", "PSI-100"} <= none     # FLEX, SAFFIRE: no videos listed


def test_works_from_any_cwd(monkeypatch, tmp_path, real):
    monkeypatch.chdir(tmp_path)
    pd.testing.assert_frame_equal(list_videos(), real)
