"""06/A3 - every plan is consistent (tests/plancheck.py, rules R1-R9), and each rule is proven by a mutation test:
the real plans being clean proves nothing on its own, so every rule is broken in a temporary copy and must be caught."""
import re
import shutil
import sys
from datetime import date
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))       # tests/ -> plancheck
import plancheck as pc  # noqa: E402

PLANS = Path(__file__).resolve().parents[2] / "plans"


def test_all_plans_are_consistent():
    problems = pc.check_all(PLANS)
    assert not problems, pc.format_problems(problems)


def test_every_plan_folder_is_checked():
    folders = sorted(p.parent.name for p in PLANS.glob("[0-9][0-9]_*/PLAN.md"))
    assert len(folders) == 7 and set(pc.parse_readme(PLANS)) == set(folders)


# ---------------------------------------------------------------- mutations: (file, transform, expected rule)
def _sub(pattern, repl, count=1, flags=re.M):
    def f(text):
        new, n = re.subn(pattern, repl, text, count=count, flags=flags)
        assert n, f"mutation pattern not found: {pattern}"
        return new
    return f


def _drop_first_evidence(text):
    lines = text.split("\n")
    k = next(i for i, l in enumerate(lines) if l.startswith("  ✔ "))
    return "\n".join(lines[:k] + lines[k + 1:])


def _first_open(text):
    """ID of the first open step: mutations must not depend on how far a plan has progressed."""
    return re.search(r"^- \[ \] \*\*([A-Z]\d+)\*\*", text, re.M).group(1)


def _bump_progress(text):
    m = re.search(r"^(- \*\*İlerleme:\*\* )(\d+)( / \d+)", text, re.M)
    return text[:m.start()] + f"{m.group(1)}{int(m.group(2)) + 1}{m.group(3)}" + text[m.end():]


def _bump_readme(folder):
    def f(text):
        m = re.search(rf"(\[{folder}\].*\| )(\d+) / (\d+) \|", text)
        return text[:m.start()] + f"{m.group(1)}{m.group(2)} / {int(m.group(3)) + 1} |" + text[m.end():]
    return f


def _evidence_under_open(text):
    sid = _first_open(text)
    return re.sub(rf"^(- \[ \] \*\*{sid}\*\*.*)$", r"\1\n  ✔ 2026-11-14 · pytest · 1 passed", text, count=1, flags=re.M)


def _drop_line_of_open(label):
    def f(text):
        sid = _first_open(text)
        return re.sub(rf"^(- \[ \] \*\*{sid}\*\*[^\n]*\n(?:(?!- |## ).*\n)*?)  - {label}:[^\n]*\n", r"\1", text,
                      count=1, flags=re.M)
    return f


def _next_step(to):
    return _sub(r"^(- \*\*Sıradaki adım:\*\* )[A-Z]\d+", rf"\g<1>{to}")


MUTATIONS = [
    ("R1 durum sayısı", "01_m1_discovery/PLAN.md", _bump_progress, "R1"),
    ("R1 README sayısı", "README.md", _bump_readme("02_m2_prediction"), "R1"),
    ("R2 kanıt satırı silindi", "00_data_layer/PLAN.md", _drop_first_evidence, "R2"),
    ("R2 kanıt 2 parçalı", "00_data_layer/PLAN.md", _sub(r"^(  ✔ \d{4}-\d{2}-\d{2} · [^·\n]+?) · .*$", r"\1"), "R2"),
    ("R2 gelecek tarih", "00_data_layer/PLAN.md", _sub(r"^  ✔ \d{4}-\d{2}-\d{2}", "  ✔ 2099-01-01"), "R2"),
    ("R2 geçersiz tarih", "00_data_layer/PLAN.md", _sub(r"^  ✔ \d{4}-\d{2}-\d{2}", "  ✔ 2026-13-45"), "R2"),
    ("R3 açık adımda kanıt", "01_m1_discovery/PLAN.md", _evidence_under_open, "R3"),
    ("R4 iptal nedeni boş", "04_flamesense/PLAN.md", _sub(r"(\*\*İPTAL \(\d{4}-\d{2}-\d{2}\):\*\*) .*$", r"\1"), "R4"),
    ("R4 İPTAL işareti yok", "04_flamesense/PLAN.md", _sub(r"~~ — \*\*İPTAL \(\d{4}-\d{2}-\d{2}\):\*\*", "~~ —"), "R4"),
    ("R5 tekrar eden ID", "01_m1_discovery/PLAN.md", _sub(r"^- \[ \] \*\*A4\*\*", "- [ ] **A1**"), "R5"),
    ("R5 faz harfi uyuşmuyor", "06_delivery/PLAN.md", _sub(r"^- \[ \] \*\*D6\*\*", "- [ ] **C9**"), "R5"),
    ("R6 Test satırı yok", "01_m1_discovery/PLAN.md", _drop_line_of_open("Test"), "R6"),
    ("R6 Kabul satırı yok", "03_m3_equipment/PLAN.md", _drop_line_of_open("Kabul"), "R6"),
    ("R7 README satırı silindi", "README.md", _sub(r"^\| 03 \|.*\n", ""), "R7"),
    ("R7 bağlantı yanlış klasöre", "README.md", _sub(r"\(03_m3_equipment/PLAN\.md\)", "(03_m3_equipmentX/PLAN.md)"), "R7"),
    ("R8 sıradaki adım yok olan ID", "02_m2_prediction/PLAN.md", _next_step("Z9"), "R8"),
    ("R8 sıradaki adım iptal edilmiş", "02_m2_prediction/PLAN.md", _next_step("D5"), "R8"),
    ("R9 son güncelleme gelecekte", "03_m3_equipment/PLAN.md",
     _sub(r"^(- \*\*Son güncelleme:\*\* )\S+", r"\g<1>2099-01-01"), "R9"),
]


@pytest.mark.parametrize("name,rel,mutate,rule", MUTATIONS, ids=[m[0] for m in MUTATIONS])
def test_each_rule_catches_its_violation(tmp_path, name, rel, mutate, rule):
    copy = shutil.copytree(PLANS, tmp_path / "plans")
    target = copy / rel
    target.write_text(mutate(target.read_text()))
    problems = pc.check_all(copy)
    assert any(p.rule == rule for p in problems), f"{name}: {rule} not reported; got {[str(p) for p in problems]}"


def test_struck_steps_are_not_counted(tmp_path):
    """Un-striking a cancelled step must change the totals (so struck steps really are excluded today)."""
    copy = shutil.copytree(PLANS, tmp_path / "plans")
    assert not [p for p in pc.check_all(copy) if p.rule == "R1"]          # clean before the mutation
    f = copy / "04_flamesense/PLAN.md"
    t = f.read_text()
    line = next(l for l in t.split("\n") if l.startswith("- ~~[ ] **A1**"))
    f.write_text(t.replace(line, "- [ ] **A1** reopened\n  - Test: x\n  - Kabul: y", 1))
    assert any(p.rule == "R1" and "04_flamesense" in str(p) for p in pc.check_all(copy))


def test_completed_plan_needs_a_dash_as_next_step(tmp_path):
    copy = shutil.copytree(PLANS, tmp_path / "plans")
    f = copy / "00_data_layer/PLAN.md"
    t = f.read_text()
    if re.search(r"^- \*\*Sıradaki adım:\*\* —", t, re.M):              # 00 is complete: a step id there is an error
        f.write_text(re.sub(r"^(- \*\*Sıradaki adım:\*\* )—", r"\1F3", t, count=1, flags=re.M))
        assert any(p.rule == "R8" for p in pc.check_all(copy))
    else:
        pytest.fail("plan 00 should be complete (22/22) once F3 is ticked")


def test_today_is_a_parameter():
    assert not pc.check_all(PLANS, today=date.today())
    assert any(p.rule in {"R2", "R9"} for p in pc.check_all(PLANS, today=date(2020, 1, 1)))
