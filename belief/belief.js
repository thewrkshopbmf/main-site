/* The Belief Project ("I Believe. Help My Unbelief."). One script for every tool page; the page is chosen by <body data-bp>.
   Everything a person enters stays in this browser tab (sessionStorage) and is never sent to a server.
   The only network call is the optional 7-day email sign-up, which sends an email address, optional first name
   and, if he took the assessment, his top theme. Never answers, notes or prayers.
   Content comes from /belief/belief-data.js (built from scripts/belief/belief-data.mjs). */
(function () {
  'use strict';
  var B = window.TWS_BELIEF;
  if (!B) return;
  var T = B.themes, PAGES = B.pages;
  var KEY = 'tws.belief.v1';
  var PATH_KEY = 'tws.belief.path.v1';
  var page = document.body.getAttribute('data-bp');

  /* ---------- helpers ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function track(name) { try { if (window.gtag) window.gtag('event', name); } catch (e) {} }
  function bible(ref) { return 'https://www.biblegateway.com/passage/?search=' + encodeURIComponent(ref.replace(/–/g, '-')) + '&version=NIV'; }
  function refLinks(refs) { return refs.split(';').map(function (r) { r = r.trim(); return '<a href="' + bible(r) + '" target="_blank" rel="noopener">' + esc(r) + '</a>'; }).join('; '); }
  function load() { try { return JSON.parse(sessionStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } }
  var st = load();
  function save() { try { sessionStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  function param(name) { try { return new URLSearchParams(location.search).get(name); } catch (e) { return null; } }
  function $(id) { return document.getElementById(id); }
  function focusTop(el) { var h = el.querySelector('h2, .pt-legend'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); } el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }

  function copyText(text, feedbackEl) {
    function done(msg) { if (feedbackEl) feedbackEl.textContent = msg; }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { done('Copied.'); }, fallback);
    } else fallback();
    function fallback() {
      try {
        var t = document.createElement('textarea');
        t.value = text; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
        document.body.appendChild(t); t.select();
        var ok = document.execCommand('copy'); t.remove();
        done(ok ? 'Copied.' : 'Copy isn’t available in this browser. Use Print / save PDF instead.');
      } catch (e) { done('Copy isn’t available in this browser. Use Print / save PDF instead.'); }
    }
  }

  // Print: open every <details> first; optionally print only the generated output.
  function printPage(onlyOutput) {
    if (onlyOutput) document.body.classList.add('bp-print-only-output');
    window.print();
    setTimeout(function () { document.body.classList.remove('bp-print-only-output'); }, 500);
  }
  window.addEventListener('beforeprint', function () { document.querySelectorAll('details').forEach(function (d) { d.open = true; }); });
  document.addEventListener('click', function (e) {
    var p = e.target.closest('[data-print]');
    if (p) { e.preventDefault(); printPage(p.getAttribute('data-print') === 'output'); }
  });

  function themeOptions(selected) {
    return Object.keys(T).map(function (k) { return '<option value="' + k + '"' + (k === selected ? ' selected' : '') + '>' + esc(T[k].name) + '</option>'; }).join('');
  }

  /* ---------- optional 7-day email path ---------- */
  function planHtml(theme) {
    if (st.emailed) return '<div class="pt-plan pt-no-print"><p class="pt-plan-msg is-ok" role="status">' + esc(st.emailed) + '</p></div>';
    var themeLine = theme && T[theme] ? ' On Day 1 we’ll add a short note on your starting theme, ' + esc(T[theme].name) + '.' : '';
    return '<section class="pt-plan pt-no-print" aria-labelledby="bpPlanTitle">' +
      '<span class="pt-eyebrow">Free · 7 days</span>' +
      '<h3 class="pt-h3" id="bpPlanTitle">Get the seven-day path by email</h3>' +
      '<p>One short email each morning for a week: the day’s passage, a reflection and one manageable step.' + themeLine + ' Stop anytime.</p>' +
      '<form id="bpPlanForm" novalidate>' +
        '<div class="pt-plan-row">' +
          '<div class="pt-field"><label for="bpPlanName">First name <span class="pt-optional">(optional)</span></label><input id="bpPlanName" type="text" autocomplete="given-name" maxlength="60"></div>' +
          '<div class="pt-field"><label for="bpPlanEmail">Email</label><input id="bpPlanEmail" type="email" autocomplete="email" required></div>' +
        '</div>' +
        '<div class="pt-hp" aria-hidden="true"><label for="bpPlanCompany">Company</label><input id="bpPlanCompany" type="text" tabindex="-1" autocomplete="off"></div>' +
        '<label class="pt-check" for="bpPlanDaily"><input id="bpPlanDaily" type="checkbox"><span>Also send me The Daily: one Scripture, one hard question and one step, every weekday morning.</span></label>' +
        '<button class="pt-btn pt-btn--ember" type="submit" id="bpPlanBtn">Send me the seven days</button>' +
        '<p class="pt-small pt-muted" style="margin-top:.8rem">Your answers, notes and prayers are never sent. We keep only your email, first name' + (themeLine ? ' and starting theme' : '') + ' to send the seven days.</p>' +
      '</form>' +
      '<p class="pt-plan-msg" id="bpPlanMsg" role="status" aria-live="polite"></p>' +
    '</section>';
  }
  function postJson(url, data) {
    return fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      .then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (body) {
          if (!r.ok || body.ok === false) throw new Error(body.error || 'Something went wrong. Please try again.');
          return body;
        });
      });
  }
  document.addEventListener('submit', function (e) {
    if (e.target.id !== 'bpPlanForm') return;
    e.preventDefault();
    var msg = $('bpPlanMsg');
    var email = $('bpPlanEmail').value.trim();
    var name = $('bpPlanName').value.trim();
    var wantsDaily = $('bpPlanDaily').checked;
    msg.className = 'pt-plan-msg';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      msg.textContent = 'Please enter a valid email address.'; msg.classList.add('is-error'); $('bpPlanEmail').focus(); return;
    }
    var btn = $('bpPlanBtn');
    btn.disabled = true; btn.textContent = 'Sending…';
    postJson('/reflection/belief-send', { email: email, first_name: name, theme: (st.primary && T[st.primary]) ? st.primary : 'general', company: $('bpPlanCompany').value })
      .then(function () {
        track('belief_plan_signup');
        var note = 'Sent. Check your inbox for a welcome email. Day 1 arrives tomorrow morning.';
        if (!wantsDaily) return note;
        return postJson('/email/subscribe', { email: email, first_name: name, source: 'belief', company: '' })
          .then(function (r) {
            track('belief_daily_signup');
            return r && r.status === 'active' ? note + ' You’re already on The Daily list.' : note + ' We also sent a separate email to confirm The Daily.';
          })
          .catch(function () { return note + ' The Daily sign-up didn’t go through, but you can sign up on any Daily page.'; });
      })
      .then(function (text) {
        st.emailed = text; save();
        $('bpPlanForm').hidden = true;
        msg.textContent = text; msg.classList.add('is-ok');
      })
      .catch(function (err) {
        msg.textContent = err.message; msg.classList.add('is-error');
        btn.disabled = false; btn.textContent = 'Send me the seven days';
      });
  });

  /* ---------- Step 1: Belief Under Pressure ---------- */
  function assessment() {
    var app = $('bpAssess');
    var Q = B.questions, N = Q.length;
    var a = st.assess || (st.assess = { stage: 'intro', step: 0, answers: {} });

    function answered() { return Object.keys(a.answers).length; }
    function profile() {
      var groups = {};
      Object.keys(T).forEach(function (k) { groups[k] = []; });
      Q.forEach(function (q, i) { var v = a.answers[i]; if (v != null && v !== 'x') groups[q[0]].push(Number(v)); });
      return Object.keys(groups).filter(function (k) { return groups[k].length >= 3; })
        .map(function (k, idx) { var arr = groups[k]; return { k: k, n: arr.length, mean: arr.reduce(function (x, y) { return x + y; }, 0) / arr.length, idx: idx }; })
        .sort(function (x, y) { return y.mean - x.mean || x.idx - y.idx; });
    }

    function render(focus) {
      if (a.stage === 'intro') {
        var resume = answered() > 0;
        app.innerHTML =
          '<h2 class="pt-h2">Before you begin</h2>' +
          '<p>Think about the <strong>last 30 days</strong>. For each statement, choose how often it described your experience. There are 24 statements across six themes: uncertainty, disappointment, control, approval, obedience and prayer. It takes about 7–10 minutes.</p>' +
          '<p class="pt-muted">You can skip any question. Your results describe what you reported. They are not a faith score, a spiritual diagnosis, or a comparison with anyone else.</p>' +
          '<div class="pt-actions">' +
            '<button type="button" class="pt-btn pt-btn--ember" data-a="start">' + (resume ? 'Continue where I left off' : 'Begin') + '</button>' +
            (resume ? '<button type="button" class="pt-btn pt-btn--ghost" data-a="restart">Start over</button>' : '') +
          '</div>';
      } else if (a.stage === 'q') {
        var q = Q[a.step], cur = a.answers[a.step];
        app.innerHTML =
          '<div class="pt-tool-top"><span class="pt-count">Question ' + (a.step + 1) + ' of ' + N + '</span><span class="pt-count">' + answered() + ' answered</span></div>' +
          '<div class="pt-track" aria-hidden="true"><div style="width:' + Math.round((a.step) / N * 100) + '%"></div></div>' +
          '<span class="bp-theme-tag">' + esc(T[q[0]].name) + '</span>' +
          '<fieldset class="pt-fieldset"><legend class="pt-legend">' + esc(q[1]) + '</legend>' +
            B.frequency.map(function (label, v) {
              return '<button type="button" class="pt-option" data-a="answer" data-v="' + v + '" aria-pressed="' + (String(cur) === String(v)) + '">' + esc(label) + '</button>';
            }).join('') +
          '</fieldset>' +
          '<div class="pt-actions" style="align-items:center">' +
            '<button type="button" class="pt-btn pt-btn--ghost" data-a="back">' + (a.step === 0 ? 'Back' : '← Back') + '</button>' +
            '<button type="button" class="bp-skip" data-a="skip">Prefer not to answer</button>' +
            (answered() >= 3 ? '<button type="button" class="bp-skip" data-a="finish" style="margin-left:auto">See my results now</button>' : '') +
          '</div>';
      } else {
        results();
      }
      save();
      if (focus) focusTop(app);
    }

    function results() {
      var ranked = profile();
      if (!ranked.length) {
        app.innerHTML = '<h2 class="pt-h2">Almost there</h2><p>Answer at least three questions within one theme to see a reflection. Skipping is always allowed.</p>' +
          '<div class="pt-actions"><button type="button" class="pt-btn pt-btn--ember" data-a="review">Go back to the questions</button></div>';
        return;
      }
      var top = ranked[0].k;
      if (st.primary !== top) { st.primary = top; }
      var html = '<div class="bp-output">' +
        '<span class="pt-eyebrow">Your reflection</span>' +
        '<h2 class="pt-h2">Your trust under pressure profile</h2>' +
        '<p class="pt-muted">These describe how often you reported particular experiences. They are not a faith score, a spiritual diagnosis, or a comparison with other people.</p>';
      html += ranked.map(function (r, i) {
        var t = T[r.k];
        var label = r.mean >= 2 ? 'Frequently reported' : r.mean >= 1 ? 'Sometimes reported' : 'Less frequently reported';
        return '<div class="bp-result' + (i === 0 ? ' is-top' : '') + '">' +
          '<h3>' + esc(t.name) + ': ' + label + '<span>' + r.n + ' of 4 answered</span></h3>' +
          '<div class="pt-bar" role="img" aria-label="' + esc(t.name) + ': ' + label + '"><div style="width:' + Math.max(3, Math.round(r.mean / 3 * 100)) + '%"></div></div>' +
          '<p><em>' + esc(t.prayer) + '</em></p>' +
          '<p><strong>Practice:</strong> ' + esc(t.practice) + '</p>' +
          '<p class="pt-small pt-muted">Scripture: ' + refLinks(t.verse) + (t.related ? ' · Related: <a href="' + t.related.href + '">' + esc(t.related.text) + '</a>' : '') + '</p>' +
        '</div>';
      }).join('');
      html += '<div class="bp-start">' +
          '<span class="pt-label" style="color:#d6ad61">A suggested place to begin</span>' +
          '<h3 class="pt-h3">' + esc(T[top].name) + '</h3>' +
          '<p>This is the most frequently reported theme among those with enough answers, not necessarily your deepest issue.</p>' +
          '<div class="pt-actions pt-no-print">' +
            '<a class="pt-btn pt-btn--ember" href="' + PAGES.diagnostic + '?scenario=' + B.themeScenario[top] + '">Explore what may be underneath →</a>' +
            '<a class="pt-btn pt-btn--ghost" href="' + PAGES.prayer + '?theme=' + top + '">Pray about this theme</a>' +
          '</div>' +
        '</div>' +
        '<div class="pt-actions pt-no-print">' +
          '<button type="button" class="pt-btn pt-btn--ghost" data-print="output">Print my profile</button>' +
          '<button type="button" class="pt-btn pt-btn--ghost" data-a="review">Review my answers</button>' +
          '<button type="button" class="pt-btn pt-btn--ghost" data-a="restart">Start over</button>' +
        '</div>' +
      '</div>' + planHtml(top);
      app.innerHTML = html;
    }

    app.addEventListener('click', function (e) {
      var b = e.target.closest('[data-a]');
      if (!b) return;
      var act = b.getAttribute('data-a');
      if (act === 'start') { if (!answered()) track('belief_assessment_start'); a.stage = 'q'; if (a.step >= N) a.step = 0; render(true); }
      else if (act === 'restart') { a.stage = 'intro'; a.step = 0; a.answers = {}; delete st.primary; render(true); }
      else if (act === 'answer' || act === 'skip') {
        a.answers[a.step] = act === 'skip' ? 'x' : Number(b.getAttribute('data-v'));
        if (act === 'answer') b.setAttribute('aria-pressed', 'true');
        setTimeout(function () {
          if (a.step < N - 1) { a.step++; render(true); } else { a.stage = 'done'; track('belief_assessment_finish'); render(true); }
        }, act === 'answer' ? 180 : 0);
      }
      else if (act === 'back') { if (a.step === 0) a.stage = 'intro'; else a.step--; render(true); }
      else if (act === 'finish') { a.stage = 'done'; track('belief_assessment_finish'); render(true); }
      else if (act === 'review') { a.stage = 'q'; a.step = 0; render(true); }
    });
    render(false);
  }

  /* ---------- Step 2: Hidden Trust Diagnostic ---------- */
  function diagnostic() {
    var app = $('bpDiag');
    var S = B.scenarios;
    var d = st.diag || (st.diag = { scenario: 'waiting', branch: '', facts: '', meaning: '', desire: '', action: '' });
    var fromUrl = param('scenario');
    if (fromUrl && S[fromUrl] && fromUrl !== d.scenario) { d.scenario = fromUrl; d.branch = ''; }

    var FIELDS = [
      ['facts', 'What are the observable facts?', 'What happened, without adding conclusions? (Optional)'],
      ['meaning', 'What interpretation are you tempted to make?', 'What story might you be telling yourself about God, yourself, or someone else? (Optional)'],
      ['desire', 'What matters most to you in this situation?', 'Relief, justice, safety, belonging, dignity, an answer, clarity… (Optional)'],
      ['action', 'What could one faithful response look like?', 'One small, wise step, not an outcome you must guarantee. (Optional)']
    ];

    function summaryText() {
      var s = S[d.scenario];
      return [
        'HIDDEN TRUST REFLECTION · TheWrkShop.com',
        'Situation: ' + s.label,
        'Initial response: ' + (s.opts[d.branch] || 'Not selected'),
        'Reflection: ' + (d.branch ? B.followups[d.branch].text : 'Consider your first response without rushing to judge it.'),
        'Facts: ' + (d.facts.trim() || '(not provided)'),
        'Interpretation: ' + (d.meaning.trim() || '(not provided)'),
        'What matters: ' + (d.desire.trim() || '(not provided)'),
        'Faithful next step: ' + (d.action.trim() || '(not provided)'),
        '',
        'These notes are prompts for prayer, not a diagnosis.'
      ].join('\n');
    }

    function followHtml() {
      if (!d.branch) return '<p class="pt-muted pt-small">Choose a response to reveal a more specific reflection.</p>';
      var f = B.followups[d.branch];
      return '<div class="pt-callout"><p><strong>Consider this:</strong> ' + esc(f.text) + '</p><p class="pt-small">Scripture to explore: ' + refLinks(f.refs) + '</p></div>';
    }

    function render() {
      var s = S[d.scenario];
      app.innerHTML =
        '<div class="bp-print-hide">' +
        '<div class="pt-field"><label for="bpScenario">Choose a situation</label><select id="bpScenario">' +
          Object.keys(S).map(function (k) { return '<option value="' + k + '"' + (k === d.scenario ? ' selected' : '') + '>' + esc(S[k].label) + '</option>'; }).join('') +
        '</select></div>' +
        '<p class="pt-quote" id="bpScenarioIntro">' + esc(s.intro) + '</p>' +
        '<fieldset class="pt-fieldset"><legend class="pt-legend" style="font-size:1.05rem">What is your strongest initial response?</legend>' +
          Object.keys(s.opts).map(function (k) {
            return '<label class="pt-option"><input type="radio" name="bpBranch" value="' + k + '"' + (k === d.branch ? ' checked' : '') + '><span>' + esc(s.opts[k]) + '</span></label>';
          }).join('') +
        '</fieldset>' +
        '<div class="bp-followup" id="bpFollow" aria-live="polite">' + followHtml() + '</div>' +
        FIELDS.map(function (f) {
          return '<div class="pt-field"><label for="bp_' + f[0] + '">' + esc(f[1]) + '</label><textarea id="bp_' + f[0] + '" data-field="' + f[0] + '" placeholder="' + esc(f[2]) + '">' + esc(d[f[0]]) + '</textarea></div>';
        }).join('') +
        '<div class="pt-actions">' +
          '<button type="button" class="pt-btn pt-btn--ember" data-a="pray">Bring this reflection to prayer →</button>' +
          '<button type="button" class="pt-btn pt-btn--ghost" data-a="summary">View reflection summary</button>' +
        '</div>' +
        '</div>' +
        '<div id="bpDiagOut"></div>' +
        '<p class="pt-small pt-muted pt-no-print" style="margin-top:1.5rem">Next in Step 2: <a href="' + PAGES.gap + '">Belief and Practice</a>, six convictions and how they shape your choices.</p>';
    }

    app.addEventListener('change', function (e) {
      if (e.target.id === 'bpScenario') { d.scenario = e.target.value; d.branch = ''; save(); render(); $('bpScenario').focus(); }
      else if (e.target.name === 'bpBranch') { d.branch = e.target.value; save(); $('bpFollow').innerHTML = followHtml(); }
    });
    app.addEventListener('input', function (e) {
      var f = e.target.getAttribute('data-field');
      if (f) { d[f] = e.target.value.slice(0, 2000); save(); }
    });
    app.addEventListener('click', function (e) {
      var b = e.target.closest('[data-a]');
      if (!b) return;
      var act = b.getAttribute('data-a');
      if (act === 'pray') {
        track('belief_diagnostic_to_prayer');
        st.prayerPrefill = { theme: S[d.scenario].theme, context: (d.facts.trim() || d.meaning.trim()), step: d.action.trim() };
        save();
        location.href = PAGES.prayer;
      } else if (act === 'summary') {
        track('belief_diagnostic_summary');
        var out = $('bpDiagOut');
        out.innerHTML = '<div class="bp-output"><h2 class="pt-h3" style="margin-top:1.75rem">Your reflection summary</h2>' +
          '<pre class="bp-summary">' + esc(summaryText()) + '</pre>' +
          '<div class="pt-actions pt-no-print"><button type="button" class="pt-btn" data-a="copy">Copy reflection</button><button type="button" class="pt-btn pt-btn--ghost" data-print="output">Print</button></div>' +
          '<p class="pt-feedback pt-no-print" id="bpDiagFb" aria-live="polite"></p></div>';
        focusTop(out);
      } else if (act === 'copy') {
        copyText(summaryText(), $('bpDiagFb'));
      }
    });
    render();
    save();
  }

  /* ---------- Step 2: Belief and Practice ---------- */
  function gap() {
    var app = $('bpGap');
    var g = st.gap || (st.gap = {});
    var C = B.convictions;
    function sel(id, label, opts, val) {
      return '<div class="pt-field"><label for="' + id + '">' + label + '</label><select id="' + id + '" data-g="' + id + '"><option value="">Choose an answer</option>' +
        opts.map(function (o, v) { return '<option value="' + v + '"' + (String(val) === String(v) ? ' selected' : '') + '>' + esc(o) + '</option>'; }).join('') + '</select></div>';
    }
    app.innerHTML = '<div class="bp-print-hide">' + C.map(function (c, i) {
      var t = T[c[1]];
      return '<div class="bp-gap-row"><p class="pt-legend">' + (i + 1) + '. ' + esc(c[0]) + '</p>' +
        '<p class="pt-small pt-muted" style="margin:0">' + esc(t.name) + ' · ' + refLinks(t.verse) + '</p>' +
        '<div class="bp-pair">' + sel('conv' + i, 'How strongly do you affirm this?', B.affirm, g['conv' + i]) + sel('prac' + i, 'How consistently has it shaped your recent choices?', B.practice, g['prac' + i]) + '</div></div>';
    }).join('') +
      '<div class="pt-actions"><button type="button" class="pt-btn pt-btn--ember" data-a="go">Explore my reflections</button></div><p class="pt-error" id="bpGapErr" aria-live="polite"></p></div>' +
      '<div id="bpGapOut"></div>';

    app.addEventListener('change', function (e) { var k = e.target.getAttribute('data-g'); if (k) { g[k] = e.target.value; save(); } });
    app.addEventListener('click', function (e) {
      if (!e.target.closest('[data-a="go"]')) return;
      var arr = [];
      C.forEach(function (c, i) {
        var x = g['conv' + i], y = g['prac' + i];
        if (x != null && x !== '' && y != null && y !== '') arr.push({ k: c[1], q: c[0], d: Number(x) - Number(y), i: i });
      });
      if (!arr.length) { $('bpGapErr').textContent = 'Choose both answers for at least one statement.'; return; }
      $('bpGapErr').textContent = '';
      track('belief_gap_finish');
      arr.sort(function (x, y) { return y.d - x.d || x.i - y.i; });
      var out = $('bpGapOut');
      out.innerHTML = '<div class="bp-output"><span class="pt-eyebrow" style="margin-top:1.75rem">Your reflection</span><h2 class="pt-h2">Conviction and practice</h2>' +
        '<p class="pt-muted">These are subjective answers on different scales. Differences are prompts for prayer and discussion, not measured spiritual gaps.</p>' +
        arr.map(function (x, i) {
          var msg = x.d >= 2 ? 'You reported strong conviction alongside less consistent practice. Consider what pressures make this difficult.'
            : x.d > 0 ? 'You reported some difference between conviction and practice.'
            : 'Your answers didn’t show a gap between conviction and practice here.';
          return '<div class="bp-result' + (i === 0 && x.d > 0 ? ' is-top' : '') + '"><h3>' + esc(T[x.k].name) + '</h3><p class="pt-small pt-muted" style="margin-top:0">' + esc(x.q) + '</p><p>' + msg + '</p><p class="pt-small pt-muted">' + refLinks(T[x.k].verse) + '</p></div>';
        }).join('') +
        '<div class="pt-actions pt-no-print"><a class="pt-btn pt-btn--ember" href="' + PAGES.prayer + '?theme=' + arr[0].k + '">Pray about ' + esc(T[arr[0].k].name.toLowerCase()) + ' →</a>' +
        '<button type="button" class="pt-btn pt-btn--ghost" data-print="output">Print</button></div></div>';
      focusTop(out);
    });
  }

  /* ---------- Step 3: Prayer ---------- */
  function prayer() {
    var app = $('bpPrayer');
    var pre = st.prayerPrefill || {};
    var theme = (param('theme') && T[param('theme')]) ? param('theme') : (pre.theme && T[pre.theme]) ? pre.theme : (st.primary || 'uncertainty');
    var text = '';

    app.innerHTML =
      '<div class="bp-print-hide">' +
      '<div class="pt-field"><label for="bpTheme">Choose a theme</label><select id="bpTheme">' + themeOptions(theme) + '</select></div>' +
      '<div class="pt-field"><label for="bpCtx">What situation would you like to name? <span class="pt-optional">(optional)</span></label><textarea id="bpCtx" placeholder="Use general language if you prefer privacy.">' + esc(pre.context || '') + '</textarea></div>' +
      '<div class="pt-field"><label for="bpStep">What is one faithful step? <span class="pt-optional">(optional)</span></label><textarea id="bpStep" placeholder="For example: ask for help, tell the truth, seek counsel, or pray honestly.">' + esc(pre.step || '') + '</textarea></div>' +
      '<div class="pt-actions"><button type="button" class="pt-btn pt-btn--ember" data-a="write">Write my prayer</button></div>' +
      '</div>' +
      '<div id="bpPrayerOut"></div>';
    if (pre.context || pre.step) { delete st.prayerPrefill; save(); }

    function build() {
      var t = T[$('bpTheme').value] || T.uncertainty;
      var ctx = $('bpCtx').value.trim(), step = $('bpStep').value.trim();
      return 'Heavenly Father,\n\n' +
        'I come to You honestly. You are faithful and worthy of trust, yet I recognize that I need Your help. ' + t.prayer + '\n\n' +
        (ctx ? 'I bring this situation before You: ' + ctx + '\n\n' : '') +
        'Lord, I believe; help my unbelief. Teach me to distinguish what You have promised from what I have hoped for, and help me respond with humility, wisdom, and courage.\n\n' +
        (step ? 'Help me take this next faithful step: ' + step + '\n\n' : '') +
        'Whether circumstances change quickly, slowly, or differently than I desire, draw me closer to Christ. Help me seek support where I need it and keep returning to You in prayer.\n\n' +
        'In Jesus’ name, Amen.';
    }

    app.addEventListener('click', function (e) {
      var b = e.target.closest('[data-a]');
      if (!b) return;
      var act = b.getAttribute('data-a');
      if (act === 'write') {
        track('belief_prayer_written');
        text = build();
        var t = T[$('bpTheme').value];
        var out = $('bpPrayerOut');
        out.innerHTML = '<div class="bp-output"><h2 class="pt-h3" style="margin-top:1.75rem">Your prayer</h2>' +
          '<div class="bp-prayer">' + esc(text) + '</div>' +
          '<p class="pt-small" style="margin-top:.9rem"><strong>Scripture for reflection:</strong> ' + refLinks(t.verse) + '</p>' +
          '<div class="pt-actions pt-no-print"><button type="button" class="pt-btn" data-a="copy">Copy prayer</button><button type="button" class="pt-btn pt-btn--ghost" data-print="output">Print prayer</button></div>' +
          '<p class="pt-feedback pt-no-print" id="bpPrayerFb" aria-live="polite"></p>' +
          '<p class="pt-no-print" style="margin-top:1.25rem">Next: <a href="' + PAGES.path + '">Faith in Practice, seven days</a> of one passage and one step.</p></div>';
        focusTop(out);
      } else if (act === 'copy') {
        copyText(text + '\n\nScripture for reflection: ' + T[$('bpTheme').value].verse, $('bpPrayerFb'));
      }
    });
  }

  /* ---------- Step 4: Seven-day path ---------- */
  function path() {
    var done = {};
    try { done = JSON.parse(localStorage.getItem(PATH_KEY) || '{}') || {}; } catch (e) {}
    var boxes = document.querySelectorAll('#bpDays input[data-day]');
    function progress() {
      var n = 0; boxes.forEach(function (b) { if (b.checked) n++; });
      $('bpDaysProgress').textContent = n ? n + ' of 7 days done' + (n === 7 ? '. Well done. Keep abiding.' : '.') : 'Check off each day as you go. This saves only on this device.';
    }
    boxes.forEach(function (b) {
      b.checked = !!done[b.getAttribute('data-day')];
      b.addEventListener('change', function () {
        done[b.getAttribute('data-day')] = b.checked;
        try { localStorage.setItem(PATH_KEY, JSON.stringify(done)); } catch (e) {}
        progress();
      });
    });
    progress();
    $('bpPlan').innerHTML = planHtml(st.primary);
    if (location.hash === '#email') setTimeout(function () { var p = $('bpPlan'); if (p) p.scrollIntoView({ block: 'start' }); }, 50);
  }

  var run = { assessment: assessment, diagnostic: diagnostic, gap: gap, prayer: prayer, path: path }[page];
  if (run) run();
})();
