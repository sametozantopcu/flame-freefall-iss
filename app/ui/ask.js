/* Ask box (S8). Contract: FF.mountAsk(container). Posts to /api/ask; falls back to client-side keyword
   matching over FF.site when the server is unreachable (e.g. file://). English-only constants on purpose. */
(function (FF) {
  'use strict';
  var MAX_Q = 500;
  var STOP = /^(the|a|an|of|and|or|to|in|on|for|is|are|what|which|how|does|do|with|by|at|from|it|this|that|be|as|about|can)$/;

  var CSS = '.ff-ask{margin:var(--space-gutter,24px) auto;max-width:880px;padding:var(--space-item,16px);' +
    'border:1px solid var(--hairline,rgba(255,255,255,.13));border-radius:var(--radius-row,8px);' +
    'background:var(--halo,rgba(255,255,255,.07));color:var(--ink,#fff);font-family:var(--font-sans,system-ui,sans-serif)}' +
    '.ff-ask *{box-sizing:border-box}' +
    '.ff-ask-label{font-size:var(--fs-label,13px);color:var(--ink-muted,rgba(255,255,255,.55));letter-spacing:.08em;text-transform:uppercase;margin:0 0 8px}' +
    '.ff-ask-row{display:flex;gap:8px}' +
    '.ff-ask input{flex:1;min-width:0;padding:10px 12px;background:var(--ground-lift,#0a0a0b);color:var(--ink,#fff);' +
    'border:1px solid var(--hairline,rgba(255,255,255,.13));border-radius:var(--radius-row,8px);font:inherit}' +
    '.ff-ask input:focus{outline:none;border-color:var(--ink-faint,rgba(255,255,255,.4))}' +
    '.ff-ask button{padding:10px 16px;background:var(--light,#f5f5f7);color:#000;border:0;border-radius:var(--radius-row,8px);font:inherit;cursor:pointer}' +
    '.ff-ask button:disabled{opacity:.5;cursor:default}' +
    '.ff-ask-out{margin-top:12px;line-height:1.45;color:var(--ink-soft,rgba(255,255,255,.7));white-space:pre-wrap}' +
    '.ff-ask-tag{margin-top:8px;font-size:var(--fs-label,12px);color:var(--ink-faint,rgba(255,255,255,.4))}' +
    '.ff-ask-src a{color:var(--ink,#fff);margin-right:12px}' +
    '.ff-ask-err{color:var(--ink-muted,rgba(255,255,255,.55))}';

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
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

  function doiLink(src) {
    if (!src || !src.doi) return null;
    var a = el('a', null, (src.psi_id || src.card_id || 'source') + ' - doi:' + src.doi);
    a.href = 'https://doi.org/' + encodeURIComponent(src.doi).replace(/%2F/g, '/');
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    return a;
  }

  function ask(q) {
    if (location.protocol === 'file:' || typeof fetch !== 'function') return Promise.reject(new Error('no server'));
    var ctl = typeof AbortController === 'function' ? new AbortController() : null;
    var timer = ctl ? setTimeout(function () { ctl.abort(); }, 100000) : null;
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

  FF.mountAsk = function (container) {
    if (!container || container.querySelector('.ff-ask')) return;
    if (!document.getElementById('ff-ask-style')) {
      var st = el('style'); st.id = 'ff-ask-style'; st.textContent = CSS; document.head.appendChild(st);
    }
    var box = el('section', 'ff-ask');
    box.setAttribute('aria-label', 'Ask the data');
    var input = el('input'); input.type = 'text'; input.maxLength = MAX_Q;
    input.placeholder = 'Ask about the investigations or cards...'; input.setAttribute('aria-label', 'Question');
    var btn = el('button', null, 'Ask'); btn.type = 'button';
    var row = el('div', 'ff-ask-row'); row.appendChild(input); row.appendChild(btn);
    var out = el('div', 'ff-ask-out'); out.setAttribute('aria-live', 'polite');
    var src = el('div', 'ff-ask-src'), tag = el('div', 'ff-ask-tag');
    box.appendChild(el('div', 'ff-ask-label', 'Ask'));
    box.appendChild(row); box.appendChild(out); box.appendChild(src); box.appendChild(tag);
    container.appendChild(box);

    function show(res, note) {
      out.className = 'ff-ask-out'; out.textContent = res.answer;
      src.textContent = '';
      (res.sources || []).forEach(function (s) { var a = doiLink(s); if (a) src.appendChild(a); });
      tag.textContent = note || (res.mode === 'llm' ? 'AI-generated from the cards below — prototype. Not for safety decisions.' :
        'LLM unavailable — showing closest cards. Prototype; not for safety decisions.');
    }

    function submit() {
      var q = input.value.trim();
      if (!q) { out.className = 'ff-ask-out ff-ask-err'; out.textContent = 'Type a question first.'; return; }
      if (q.length > MAX_Q) q = q.slice(0, MAX_Q);
      btn.disabled = true; out.className = 'ff-ask-out'; out.textContent = 'Thinking… (live answers can take up to a minute)'; src.textContent = ''; tag.textContent = '';
      ask(q).then(function (j) { show(j); }, function () {
        show(localAnswer(q), 'Live answers need the local server (python app/server.py). Showing a keyword match from the static cards — prototype.');
      }).then(function () { btn.disabled = false; });
    }
    btn.addEventListener('click', submit);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') submit(); });
  };
  FF._askLocal = localAnswer;
})(window.FF = window.FF || {});
