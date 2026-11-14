"""FLAME·FREEFALL — microgravity fire-safety decision-support system.

Run it (from the project root):
    streamlit run app/streamlit_app.py
"""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

import streamlit as st  # noqa: E402

st.set_page_config(page_title="FLAME·FREEFALL", page_icon="🔥", layout="wide",
                   initial_sidebar_state="expanded")

from app.i18n import LANGUAGES, t  # noqa: E402
from app.ui import components as UI  # noqa: E402
from app.ui import state, theme  # noqa: E402

theme.inject()

# --------------------------------------------------------------------------- #
# Language selector — at the top of the left menu. All text, including page
# titles, is read from this value; it can be shared via the ?lang=tr URL parameter.
# --------------------------------------------------------------------------- #
with st.sidebar:
    st.segmented_control(
        "Language", list(LANGUAGES), key="lang", default="en", required=True,
        format_func=lambda code: LANGUAGES[code], bind="query-params", persist_state="session",
        width="stretch",
    )

pages = {
    "ops": [
        st.Page("views/mission.py", title=t("page.mission"), icon=":material/rocket_launch:", default=True),
        st.Page("views/procedures.py", title=t("page.procedures"), icon=":material/fire_extinguisher:"),
    ],
    "analysis": [
        st.Page("views/flammability.py", title=t("page.flammability"), icon=":material/show_chart:"),
        st.Page("views/archive.py", title=t("page.archive"), icon=":material/database:"),
        st.Page("views/ai.py", title=t("page.ai"), icon=":material/psychology:"),
    ],
    "system": [
        st.Page("views/system.py", title=t("page.system"), icon=":material/settings_input_component:"),
    ],
}
# The built-in menu is hidden because it would be drawn above the language
# selector; the menu is rendered below with the same st.Page objects (same URLs).
nav = st.navigation(pages, position="hidden")

with st.sidebar:
    for section, items in pages.items():
        st.caption(t(f"nav.{section}"))
        for page in items:
            st.page_link(page, width="stretch")
    st.divider()
    st.markdown(
        '<div style="padding:4px 0 12px"><div style="font:700 1.15rem/1.1 system-ui;color:#f0efec">'
        'FLAME<span style="color:#d95926">·</span>FREEFALL</div>'
        '<div style="font:11px/1.5 ui-monospace,Consolas,monospace;color:#898781;letter-spacing:.08em">'
        'BASS-II · PSI-25 · ISS MSG</div></div>', unsafe_allow_html=True)
    bundle = state.data()
    model, _ = state.model()
    st.markdown(UI.data_badge(bundle) + "<div style='height:6px'></div>" + UI.model_badge(model),
                unsafe_allow_html=True)
    if not bundle.is_real:
        st.caption(t("sidebar.csv_hint"))
    if st.button(t("sidebar.refresh"), icon=":material/refresh:", width="stretch"):
        state.refresh()
        st.rerun()
    st.caption("NASA Space Apps 2026 · Flame in Freefall")

nav.run()
