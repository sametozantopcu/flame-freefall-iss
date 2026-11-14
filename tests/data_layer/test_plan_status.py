"""00/F3 - the data-layer plan is consistent (same checker as 06/A3, restricted to plan 00)."""
import sys
from pathlib import Path

from conftest import REPO

sys.path.insert(0, str(REPO / "tests"))
import plancheck as pc  # noqa: E402


def test_plan_00_is_consistent():
    plans = REPO / "plans"
    problems = pc.check_plan(plans / "00_data_layer" / "PLAN.md", pc.parse_readme(plans))
    assert not problems, pc.format_problems(problems)
