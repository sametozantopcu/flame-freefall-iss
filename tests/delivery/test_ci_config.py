"""06/A1 - the CI workflow: one job, every plan's requirements, marked tests excluded, no secrets."""
import configparser
import re
from pathlib import Path

import pytest
import yaml

REPO = Path(__file__).resolve().parents[2]
WF = REPO / ".github" / "workflows" / "tests.yml"
EXCLUDED = {"needs_raw", "slow", "live"}


@pytest.fixture(scope="module")
def wf():
    assert WF.is_file(), "missing .github/workflows/tests.yml"
    return yaml.safe_load(WF.read_text())


def _steps(wf):
    (job,) = wf["jobs"].values()
    return job["steps"]


def _runs(wf) -> str:
    return "\n".join(s.get("run", "") for s in _steps(wf))


def test_triggers_and_single_job(wf):
    on = wf.get("on", wf.get(True))                       # YAML 1.1 reads a bare `on:` key as True
    assert set(on) >= {"push", "pull_request"}
    assert len(wf["jobs"]) == 1
    (job,) = wf["jobs"].values()
    assert job["runs-on"] == "ubuntu-latest" and job.get("timeout-minutes", 0) > 0


def test_python_version_matches_local_env(wf):
    py = [s for s in _steps(wf) if str(s.get("uses", "")).startswith("actions/setup-python")]
    assert len(py) == 1 and str(py[0]["with"]["python-version"]) == "3.11"
    assert any(str(s.get("uses", "")).startswith("actions/checkout") for s in _steps(wf))


def test_installs_every_plan_requirements_file(wf):
    plans = sorted(p.relative_to(REPO).as_posix() for p in REPO.glob("plans/*/requirements.txt"))
    assert len(plans) == 7
    install = _runs(wf)
    if "plans/*/requirements.txt" in install:              # the glob form covers every file, present and future
        assert re.search(r"pip install .*plans/\*/requirements\.txt", install)
    else:
        missing = [p for p in plans if p not in install]
        assert not missing, f"CI does not install: {missing}"


def test_marked_tests_are_excluded_and_markers_registered(wf):
    m = re.search(r'pytest\b.*-m\s+"([^"]+)"', _runs(wf))
    assert m, "pytest is not run with a -m filter"
    expr = m.group(1)
    for mark in EXCLUDED:
        assert re.search(rf"\bnot {mark}\b", expr), f"{mark} is not excluded: {expr!r}"
    cfg = configparser.ConfigParser()
    cfg.read(REPO / "pytest.ini")
    registered = {l.split(":")[0].strip() for l in cfg["pytest"]["markers"].strip().splitlines()}
    assert EXCLUDED <= registered
    assert re.search(r"pytest tests\b", _runs(wf))


def test_no_secrets_in_ci():
    text = WF.read_text()
    assert not re.search(r"secrets\.|API_KEY|LLM_", text), "CI must not need secrets (LLM is mocked in tests)"


def test_first_green_run_is_recorded():
    """The acceptance of 06/A1 includes a real green run, recorded with its link, commit and test summary."""
    ev = REPO / "docs" / "evidence" / "ci_first_green.md"
    assert ev.is_file()
    text = ev.read_text()
    assert "**Sonuç:** success" in text
    assert re.search(r"https://github\.com/[\w.-]+/[\w.-]+/actions/runs/\d+", text)
    assert re.search(r"`[0-9a-f]{40}`", text)
    assert re.search(r"\d+ passed, \d+ skipped", text) and " failed" not in text
