"""Cached data/model access and the scenario state shared between pages.

Cache keys are file signatures (mtime + size): when the team adds or updates
data/processed/bass2_clean.csv or models/*.joblib, the app picks up the new
files on the next interaction without a restart.
"""
from __future__ import annotations

import streamlit as st

from app import config as C
from app.core import data as D
from app.core import models as M
from app.core.risk import Scenario
from app.i18n import t


@st.cache_data(show_spinner=False)
def _data(signature: str) -> D.DataBundle:
    return D.load(C.DATA_PATH)


@st.cache_resource(show_spinner=False)
def _model(data_sig: str, models_sig: str, _df) -> tuple[M.ModelBundle, list[tuple[str, dict]]]:
    return M.resolve(_df)


def data() -> D.DataBundle:
    # The cache content is language-independent; only the wait message follows the active language.
    with st.spinner(t("spinner.data")):
        return _data(D.file_signature(C.DATA_PATH))


def model() -> tuple[M.ModelBundle, list[tuple[str, dict]]]:
    b = data()
    with st.spinner(t("spinner.model")):
        return _model(b.signature, M.dir_signature(), b.df)


def refresh() -> None:
    _data.clear()
    _model.clear()


def scenario() -> Scenario:
    if "scenario" not in st.session_state:
        st.session_state.scenario = Scenario()
    return st.session_state.scenario


# --------------------------------------------------------------------------- #
# Widget values that survive page changes
# Streamlit deletes the keys of widgets that are not rendered; these helpers
# keep the values in a persistent dictionary and restore them on return.
# --------------------------------------------------------------------------- #
def bind(key: str, default):
    store = st.session_state.setdefault("_persist", {})
    if key not in st.session_state:
        st.session_state[key] = store.get(key, default)
    return key


def save(*keys: str) -> None:
    store = st.session_state.setdefault("_persist", {})
    for k in keys:
        if k in st.session_state:
            store[k] = st.session_state[k]
