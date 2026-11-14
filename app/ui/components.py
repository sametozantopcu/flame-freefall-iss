"""Yeniden kullanılabilir arayüz bileşenleri (HTML + Streamlit)."""
from __future__ import annotations

import html

import streamlit as st

from app.i18n import t
from app.ui import theme as T


def _icon(status: str, small: bool = False) -> str:
    color = T.STATUS.get(status, T.MUTED)
    fg = "#ffffff" if status in ("critical", "good", "info") else "#0b0b0b"
    cls = "ff-icon sm" if small else "ff-icon"
    return f'<span class="{cls}" style="background:{color};color:{fg}">{T.STATUS_ICON.get(status, "i")}</span>'


def header(eyebrow: str, title: str, subtitle: str, badges: list[str] | None = None) -> None:
    b = "".join(badges or [])
    st.markdown(
        f'<div class="ff-head"><div><div class="eyebrow">{eyebrow}</div><h1>{title}</h1>'
        f'<p>{subtitle}</p></div><div style="display:flex;gap:8px;flex-wrap:wrap">{b}</div></div>',
        unsafe_allow_html=True,
    )


def badge(text: str, color: str = T.MUTED) -> str:
    return f'<span class="ff-badge"><span class="dot" style="background:{color}"></span>{html.escape(text)}</span>'


def data_badge(bundle) -> str:
    if bundle.is_real:
        return badge(t("badge.real", n=len(bundle.df)), T.STATUS["good"])
    return badge(t("badge.sim", n=len(bundle.df)), T.STATUS["warning"])


def model_name(model) -> str:
    return t("model.surrogate_name") if model.source == "surrogate" else model.name


def model_badge(model) -> str:
    if model.source == "trained":
        return badge(t("badge.model", name=model.name), T.STATUS["good"])
    return badge(t("badge.surrogate"), T.STATUS["warning"])


def kpi(label: str, value: str, unit: str = "", sub: str = "", status: str | None = None,
        status_text: str = "") -> None:
    bar = f'<div class="bar" style="background:{T.STATUS[status]}"></div>' if status else ""
    st_line = (f'<div class="st">{_icon(status, small=True)}{html.escape(status_text)}</div>'
               if status and status_text else "")
    st.markdown(
        f'<div class="ff-kpi">{bar}<div class="lbl">{label}</div>'
        f'<div class="val">{value}<small>{unit}</small></div>'
        f'<div class="sub">{sub}</div>{st_line}</div>',
        unsafe_allow_html=True,
    )


def banner(level: str, status: str, score: float) -> None:
    st.markdown(
        f'<div class="ff-banner" style="border-left:4px solid {T.STATUS[status]}">{_icon(status)}'
        f'<div><div class="lvl">{t("level." + level)}</div><div class="msg">{t("level." + level + ".msg")}</div></div>'
        f'<div class="score"><b>{score:.0f}</b><span>{t("banner.score")}</span></div></div>',
        unsafe_allow_html=True,
    )


def insight(ins) -> None:
    """risk.Insight (anahtar + parametre) nesnesini aktif dilde çizer."""
    title = t(f"ins.{ins.key}.title", **ins.params)
    body = t(f"ins.{ins.key}.body", **ins.params)
    st.markdown(
        f'<div class="ff-insight">{_icon(ins.level, small=True)}<div><div class="t">{html.escape(title)}</div>'
        f'<div class="b">{html.escape(body)}</div></div><div class="src">{t("src." + ins.source)}</div></div>',
        unsafe_allow_html=True,
    )


def warnings(msgs) -> None:
    """(anahtar, parametre) uyarı listesini aktif dilde gösterir."""
    for key, params in msgs:
        st.warning(t(key, **params), icon=":material/warning:")


def section(text: str) -> None:
    st.markdown(f'<div class="ff-section">{text}</div>', unsafe_allow_html=True)


def status_for(value: float, caution: float, critical: float) -> tuple[str, str]:
    if value != value:  # NaN
        return "info", t("st.no_data")
    if value >= critical:
        return "critical", t("st.critical")
    if value >= caution:
        return "warning", t("st.approaching")
    return "good", t("st.below")
