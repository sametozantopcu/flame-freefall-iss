/* Ask chat (S8). Contract: FF.mountAsk(container). Posts to /api/ask; falls back to client-side keyword
   matching over FF.site when the server is unreachable (e.g. file://). English-only constants on purpose.

   Layout: a round launcher sits at the bottom right. It opens a small, compact chat at the bottom center of the
   dashboard (the launcher turns into a close button); the conversation grows upward from the input and scrolls inside itself once it reaches its cap, so
   the no-scroll dashboard stays intact. The thread is kept per tab (sessionStorage) across sections and reloads.
   Keys: "/" opens and focuses, Esc closes, Enter sends, Shift+Enter adds a new line.
   Styles live in ui/theme.css (".chat" block, liquid glass). */
(function (FF) {
  'use strict';
  var MAX_Q = 500;
  var STORE = 'ff-ask-thread';
  var STOP = /^(the|a|an|of|and|or|to|in|on|for|is|are|what|which|how|does|do|with|by|at|from|it|this|that|be|as|about|can)$/;
  var SUGGEST = [
    'Which investigation has the highest habitat score?',
    'Is there any Moon or Mars gravity data?',
    'What does the FLEX d-squared finding say?',
    'How does oxygen affect PMMA burning in BASS-II?'
  ];
  var NOTE_LLM = 'AI-generated from the cards and investigation summaries. Prototype; not for safety decisions.';
  var NOTE_FALLBACK = 'LLM unavailable, showing the closest cards. Prototype; not for safety decisions.';
  var NOTE_STATIC = 'Live answers need the local server (python app/server.py). Showing a keyword match from the static cards.';
  var SVG_NS = 'http://www.w3.org/2000/svg';

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  // Line icons drawn with a 1.6px stroke in currentColor (24x24 grid).
  function icon(paths, cls) {
    var s = document.createElementNS(SVG_NS, 'svg');
    if (cls) s.setAttribute('class', cls);
    s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('aria-hidden', 'true'); s.setAttribute('focusable', 'false');
    paths.forEach(function (d) {
      var p = document.createElementNS(SVG_NS, 'path');
      p.setAttribute('d', d);
      s.appendChild(p);
    });
    return s;
  }
  var ICON_CHAT = ['M4.5 6.5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v6.5a3 3 0 0 1-3 3H11l-4.2 3.6c-.4.3-.9 0-.9-.4V16h0a3 3 0 0 1-1.4-2.6Z',
                   'M8.5 9.5h7', 'M8.5 12.5h4.5'];
  var ICON_CLOSE = ['M6.5 6.5l11 11', 'M17.5 6.5l-11 11'];
  var ICON_SEND = ['M12 18.5v-13', 'M6.5 11 12 5.5l5.5 5.5'];

  // Water-like refraction of what is behind the glass. Only Chromium applies SVG filters in backdrop-filter;
  // elsewhere the .liquid class is not set and the glass keeps its plain (still clear) backdrop-filter.
  function addLiquidFilter() {
    var brands = (navigator.userAgentData && navigator.userAgentData.brands) || [];
    var chromium = brands.some(function (b) { return /Chromium/.test(b.brand); });
    if (!chromium || document.getElementById('ff-liquid')) return;
    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('width', '0'); svg.setAttribute('height', '0'); svg.setAttribute('aria-hidden', 'true');
    svg.style.position = 'absolute';
    svg.innerHTML = '<filter id="ff-liquid" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">'
      + '<feTurbulence type="fractalNoise" baseFrequency="0.006 0.011" numOctaves="2" seed="11" result="n"/>'
      + '<feGaussianBlur in="n" stdDeviation="2.5" result="w"/>'
      + '<feDisplacementMap in="SourceGraphic" in2="w" scale="22" xChannelSelector="R" yChannelSelector="G"/></filter>';
    document.body.appendChild(svg);
    document.documentElement.classList.add('liquid');
  }

  function tokens(s) {
    return (String(s || '').toLowerCase().match(/[a-z0-9\-\.]+/g) || []).filter(function (t) { return t.length > 1 && !STOP.test(t); });
  }

  // Static keyword match over FF.site cards + investigations; returns {answer, sources, mode:'static'}.
  function localAnswer(q) {
    var site = FF.site || {}, qt = tokens(q), best = [];
    function score(text) {
      var low = String(text || '').toLowerCase(), s = 0;
      qt.forEach(function (t) { if (low.indexOf(t) >= 0) s += 1; });
      return s;
    }
    (site.cards || []).forEach(function (c) {
      best.push({ s: score([c.title, c.finding, c.caveat, c.id].join(' ')) + 0.1, text: c.title + ': ' + c.finding, src: { card_id: c.id, doi: c.doi } });
    });
    (site.investigations || []).forEach(function (i) {
      best.push({ s: score([i.psi_id, i.name, i.title, i.summary].join(' ')), text: i.psi_id + ' ' + i.name + ': ' + String(i.summary || i.title || '').slice(0, 300), src: { psi_id: i.psi_id, doi: i.doi } });
    });
    best.sort(function (a, b) { return b.s - a.s; });
    var top = best.filter(function (b) { return b.s >= 1; }).slice(0, 2);
    if (!top.length) top = best.slice(0, 1);
    if (!top.length) return { answer: 'Not in the data.', sources: [], mode: 'static' };
    return { answer: top.map(function (t) { return t.text; }).join('\n\n'), sources: top.map(function (t) { return t.src; }), mode: 'static' };
  }

  function ask(q) {
    if (location.protocol === 'file:' || typeof fetch !== 'function') return Promise.reject(new Error('no server'));
    var ctl = typeof AbortController === 'function' ? new AbortController() : null;
    var timer = ctl ? setTimeout(function () { ctl.abort(); }, 130000) : null;
    return fetch('/api/ask', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: q }), signal: ctl ? ctl.signal : undefined
    }).then(function (r) {
      if (timer) clearTimeout(timer);
      if (!r.ok) throw new Error('http ' + r.status);
      return r.json();
    }).then(function (j) {
      if (!j || typeof j.answer !== 'string' || !j.answer) throw new Error('bad response');
      return j;
    });
  }

  function load() {
    try { var v = JSON.parse(sessionStorage.getItem(STORE) || '[]'); return Array.isArray(v) ? v : []; } catch (e) { return []; }
  }
  function save(thread) {
    try { sessionStorage.setItem(STORE, JSON.stringify(thread.filter(function (t) { return t.res; }).slice(-30))); } catch (e) { /* storage off: keep in memory only */ }
  }

  // (server: LLM_TIMEOUT 60 s x 2 attempts + wait -> abort at 130 s)
  // The fallback answer is one long line ("LLM unavailable - ... a | b | c"); split it into readable paragraphs.
  function paragraphs(res) {
    var text = String(res.answer || '');
    if (res.mode === 'fallback') text = text.replace(/^LLM unavailable - showing closest cards\.\s*/, '').split(' | ').join('\n\n');
    var out = text.split(/\n{2,}/).map(function (s) { return s.trim(); }).filter(Boolean);
    // Fallback snippets are cut at a fixed length; mark the cut instead of ending mid-word.
    if (res.mode !== 'llm') out = out.map(function (s) { return /[.!?)\]]$/.test(s) ? s : s + '…'; });
    return out;
  }

  function sourceLink(s) {
    if (!s || !s.doi) return null;
    var a = el('a');
    a.href = 'https://doi.org/' + encodeURIComponent(s.doi).replace(/%2F/g, '/');
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.title = 'doi:' + s.doi;
    a.textContent = s.psi_id || s.card_id || 'source';
    return a;
  }

  FF.mountAsk = function (container) {
    if (document.querySelector('.chat')) return;
    container = container || document.body;
    var thread = load(), busy = false;

    // Round launcher (bottom right).
    var fab = el('button', 'chat-fab glass');
    fab.type = 'button';
    fab.setAttribute('aria-label', 'Ask the data');
    fab.setAttribute('aria-controls', 'chat-panel');
    fab.setAttribute('aria-expanded', 'false');
    fab.title = 'Ask the data (/)';
    fab.appendChild(icon(ICON_CHAT, 'i-chat'));
    fab.appendChild(icon(ICON_CLOSE, 'i-close'));
    fab.appendChild(el('span', 'new'));
    addLiquidFilter();

    // Compact chat docked to the bottom.
    var panel = el('section', 'chat glass');
    panel.id = 'chat-panel';
    panel.setAttribute('aria-label', 'Ask the data');
    panel.setAttribute('aria-hidden', 'true');

    var head = el('div', 'chat-head');
    var title = el('div', 'chat-title');
    title.appendChild(el('span', 'dot'));
    title.appendChild(el('span', null, 'Ask the data'));
    head.appendChild(title);
    var clear = el('button', 'chat-clear', 'Clear'); clear.type = 'button';
    var close = el('button', 'chat-close'); close.type = 'button';
    close.setAttribute('aria-label', 'Close chat'); close.title = 'Close (Esc)';
    close.appendChild(icon(ICON_CLOSE));
    head.appendChild(clear); head.appendChild(close);

    var list = el('div', 'chat-thread');
    list.setAttribute('aria-live', 'polite');

    var suggest = el('div', 'chat-suggest');
    SUGGEST.forEach(function (q) {
      var b = el('button', null, q); b.type = 'button';
      b.addEventListener('click', function () { submit(q); });
      suggest.appendChild(b);
    });

    var form = el('form', 'chat-form');
    var input = el('textarea');
    input.rows = 1; input.maxLength = MAX_Q;
    input.placeholder = 'Ask about the investigations or cards…';
    input.setAttribute('aria-label', 'Question');
    var send = el('button', 'chat-send'); send.type = 'submit';
    send.setAttribute('aria-label', 'Send');
    send.appendChild(icon(ICON_SEND));
    form.appendChild(input); form.appendChild(send);

    var foot = el('div', 'chat-foot');
    var footNote = el('span', null, 'Answers come only from the PSI data · prototype');
    var count = el('span', 'count');
    foot.appendChild(footNote); foot.appendChild(count);

    panel.appendChild(head);
    panel.appendChild(list);
    panel.appendChild(suggest);
    panel.appendChild(form);
    panel.appendChild(foot);
    container.appendChild(panel);
    container.appendChild(fab);

    function renderTurn(t) {
      var turn = el('div', 'chat-turn');
      turn.appendChild(el('p', 'chat-q', t.q));
      var a = el('div', 'chat-a');
      if (!t.res) {
        var w = el('div', 'chat-wait');
        w.appendChild(el('span', 'dot'));
        w.appendChild(el('span', null, location.protocol === 'file:' ? 'Searching the cards…' : 'Thinking… live answers can take up to a minute.'));
        a.appendChild(w);
      } else {
        paragraphs(t.res).forEach(function (p) { a.appendChild(el('p', t.res.mode === 'llm' ? null : 'dim', p)); });
        var links = (t.res.sources || []).map(sourceLink).filter(Boolean);
        if (links.length) {
          var src = el('div', 'chat-src');
          links.forEach(function (l) { src.appendChild(l); });
          a.appendChild(src);
        }
        var fb = t.res.reason ? 'Live model unavailable (' + String(t.res.reason).slice(0, 24) + ') \u2014 showing matching cards. Prototype; not for safety decisions.' : NOTE_FALLBACK;
        a.appendChild(el('p', 'chat-tag', t.note || (t.res.mode === 'llm' ? NOTE_LLM : fb)));
      }
      turn.appendChild(a);
      return turn;
    }

    function render() {
      list.textContent = '';
      thread.forEach(function (t) { list.appendChild(renderTurn(t)); });
      panel.classList.toggle('empty', !thread.length);
      clear.hidden = !thread.length || busy;
      list.scrollTop = list.scrollHeight;
    }

    function fit() {
      input.style.height = '';
      if (input.value) input.style.height = Math.min(input.scrollHeight, 110) + 'px';
      var n = input.value.length;
      count.textContent = n > MAX_Q - 100 ? n + ' / ' + MAX_Q : '';
      send.disabled = busy || !input.value.trim();
    }

    function isOpen() { return document.body.classList.contains('chat-open'); }
    function setOpen(on) {
      document.body.classList.toggle('chat-open', on);
      fab.setAttribute('aria-expanded', String(on));
      fab.setAttribute('aria-label', on ? 'Close chat' : 'Ask the data');
      fab.title = on ? 'Close (Esc)' : 'Ask the data (/)';
      panel.setAttribute('aria-hidden', String(!on));
      if (on) { fab.classList.remove('has-new'); fit(); list.scrollTop = list.scrollHeight; setTimeout(function () { input.focus(); }, 80); }
      else fab.focus();
    }

    function submit(q) {
      q = String(q == null ? input.value : q).trim().slice(0, MAX_Q);
      if (!q || busy) return;
      var t = { q: q, res: null };
      thread.push(t);
      busy = true; input.value = ''; fit(); render();
      ask(q).then(function (j) { t.res = j; }, function () { t.res = localAnswer(q); t.note = NOTE_STATIC; })
        .then(function () {
          busy = false; save(thread); render(); fit();
          if (!isOpen()) fab.classList.add('has-new');
        });
    }

    fab.addEventListener('click', function () { setOpen(!isOpen()); });
    close.addEventListener('click', function () { setOpen(false); });
    clear.addEventListener('click', function () { thread = []; save(thread); render(); input.focus(); });
    form.addEventListener('submit', function (e) { e.preventDefault(); submit(); });
    input.addEventListener('input', fit);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); submit(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) { e.preventDefault(); setOpen(false); return; }
      var tag = (e.target && e.target.tagName) || '';
      if (e.key === '/' && !isOpen() && !/^(INPUT|TEXTAREA|SELECT)$/.test(tag) && !(e.target && e.target.isContentEditable)
          && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault(); setOpen(true);
      }
    });

    render(); fit();
    if (/[?&]ask=open\b/.test(location.search)) setOpen(true); // demo / screenshot hook
  };
  FF._askLocal = localAnswer;
})(window.FF = window.FF || {});
