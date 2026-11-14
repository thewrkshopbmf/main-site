/* TheWrkShop Formation Engine V3.1
   One study file drives three experiences: Interactive Daily, Happy 4-3-2-1, and Facilitator + Breakouts.
   Study content lives in /studies/formation-engine/content/*.txt (see TEMPLATE.txt).
   Privacy: notes stay in this browser. They are saved on the device only if the reader turns that on. */
(function () {
  'use strict';

  var CONTENT = '/studies/formation-engine/content/';
  var STORE_KEEP = 'fe-keep-notes', STORE_NOTES = 'fe-notes-v1';
  var app = document.getElementById('fe-app');
  if (!app) return;

  /* ---------- helpers ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function $(id) { return document.getElementById(id); }
  function p(t) { return '<p>' + esc(t) + '</p>'; }
  function bgLink(ref, label) {
    var url = 'https://www.biblegateway.com/passage/?search=' + encodeURIComponent(String(ref).replace(/[–—]/g, '-')) + '&version=NIV';
    return '<a href="' + url + '" target="_blank" rel="noopener">' + esc(label || ref) + '</a>';
  }
  function store(fn) { try { return fn(); } catch (e) { return null; } }

  /* ---------- study file parser ---------- */
  function parse(text) {
    var out = { lists: {}, group: {} }, sec = null;
    text.split(/\r?\n/).forEach(function (raw) {
      var line = raw.trim();
      if (!line || line.charAt(0) === '#') return;
      var head = line.match(/^\[([a-z0-9_-]+)\]$/i);
      if (head) { sec = head[1].toLowerCase(); if (sec !== 'group') out.lists[sec] = out.lists[sec] || []; return; }
      if (line.indexOf('- ') === 0 && sec && sec !== 'group') {
        out.lists[sec].push(line.slice(2).split(' | ').map(function (s) { return s.trim(); }));
        return;
      }
      var kv = line.match(/^([a-z0-9_]+)\s*:\s*(.*)$/i);
      if (kv) { var k = kv[1].toLowerCase(), v = kv[2].trim(); if (sec === 'group') out.group[k] = v; else out[k] = v; }
    });
    return out;
  }
  var REQUIRED = ['id', 'title', 'anchor', 'verse', 'truth', 'tension', 'action', 'prayer'];
  function toStudy(pz, file) {
    var L = pz.lists, problems = [];
    REQUIRED.forEach(function (k) { if (!pz[k]) problems.push('missing "' + k + ':"'); });
    ['choices', 'scriptures', 'practices', 'questions', 'deeper'].forEach(function (k) { if (!L[k] || !L[k].length) problems.push('empty [' + k + ']'); });
    return {
      file: file, problems: problems,
      id: pz.id || file.replace(/\.txt$/, ''), title: pz.title || file, subtitle: pz.subtitle || '',
      anchor: pz.anchor || '', verse: pz.verse || '', version: pz.version || 'NIV',
      truth: pz.truth || '', tension: pz.tension || '', wound: pz.wound || '', action: pz.action || '',
      prayer: pz.prayer || '', icebreaker: pz.icebreaker || '',
      choices: (L.choices || []).map(function (a) { return { label: a[0], reflection: a[1] || '' }; }),
      scriptures: (L.scriptures || []).map(function (a) { return { ref: a[0], focus: a[1] || '', ask: a[2] || '' }; }),
      practices: (L.practices || []).map(function (a) { return a.join(' | '); }),
      questions: (L.questions || []).map(function (a) { return a.join(' | '); }),
      deeper: (L.deeper || []).map(function (a) { return a.join(' | '); }),
      group: pz.group || {}
    };
  }
  function parseIcebreakers(text) {
    var pz = parse(text);
    return (pz.lists.icebreakers || []).map(function (a, i) {
      return {
        id: 'ib' + i, title: a[0], type: (a[1] || 'light').toLowerCase(),
        stages: (a[2] || 'any').toLowerCase().split(/\s*,\s*/), format: (a[3] || 'both').toLowerCase(),
        minutes: parseInt(a[4], 10) || 4, prompt: a[5] || a[0]
      };
    });
  }
  function fetchText(url) { return fetch(url, { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw new Error(url + ' (' + r.status + ')'); return r.text(); }); }

  /* ---------- state ---------- */
  var qs = new URLSearchParams(location.search);
  var S = {
    studies: [], study: null, icebreakers: [],
    mode: ['daily', '4321', 'group'].indexOf(qs.get('mode')) > -1 ? qs.get('mode') : 'daily',
    view: qs.get('view') === 'participant' ? 'participant' : 'leader',
    step: 0, notes: {}, choices: {}, keep: false, focusNext: false
  };
  var MODE_NAMES = { daily: 'Interactive Daily', '4321': 'Happy 4-3-2-1', group: 'Facilitator + Breakouts' };

  /* notes: notes[studyId][mode][key] = { label, text, order } */
  function bucket(mode) {
    var sid = S.study.id; S.notes[sid] = S.notes[sid] || {}; S.notes[sid][mode || S.mode] = S.notes[sid][mode || S.mode] || {};
    return S.notes[sid][mode || S.mode];
  }
  function choiceKey() { return S.study.id + ':' + S.mode; }
  function persist() {
    if (!S.keep) return;
    store(function () { localStorage.setItem(STORE_NOTES, JSON.stringify({ notes: S.notes, choices: S.choices })); });
  }
  function loadSaved() {
    S.keep = store(function () { return localStorage.getItem(STORE_KEEP) === '1'; }) || false;
    if (!S.keep) return;
    var d = store(function () { return JSON.parse(localStorage.getItem(STORE_NOTES) || '{}'); }) || {};
    S.notes = d.notes || {}; S.choices = d.choices || {};
  }
  function setKeep(on) {
    S.keep = on;
    if (on) { store(function () { localStorage.setItem(STORE_KEEP, '1'); }); persist(); }
    else store(function () { localStorage.removeItem(STORE_KEEP); localStorage.removeItem(STORE_NOTES); });
  }
  function noteBox(key, label, order) {
    var b = bucket(), cur = b[key] ? b[key].text : '';
    return '<label class="fe-label" for="fe-note-' + esc(key) + '">' + esc(label) + '</label>' +
      '<textarea class="fe-note" id="fe-note-' + esc(key) + '" data-key="' + esc(key) + '" data-label="' + esc(label) + '" data-order="' + (order || 0) + '" placeholder="Private reflection (optional). Only you can see this.">' + esc(cur) + '</textarea>';
  }
  function wireNotes() {
    app.querySelectorAll('.fe-note').forEach(function (t) {
      t.addEventListener('input', function () {
        var b = bucket();
        if (t.value.trim()) b[t.dataset.key] = { label: t.dataset.label, text: t.value, order: +t.dataset.order };
        else delete b[t.dataset.key];
        persist();
      });
    });
  }

  /* ---------- shared blocks ---------- */
  function verseBlock() {
    var s = S.study;
    return '<blockquote class="fe-verse"><p>' + esc(s.verse) + '</p><cite>' + esc(s.anchor) + ' (' + esc(s.version) + ') · ' + bgLink(s.anchor, 'Read in context') + '</cite></blockquote>';
  }
  function woundBlock() {
    if (!S.study.wound) return '';
    return '<div class="fe-callout fe-callout--wound"><strong>The wound beneath the wound</strong>' + p(S.study.wound) + '</div>';
  }
  function progress(i, n) { return '<div class="fe-progress" aria-hidden="true"><div style="width:' + ((i + 1) / n * 100) + '%"></div></div>'; }
  function stepNav(i, n, lastLabel) {
    return '<div class="fe-nav"><button type="button" class="pt-btn pt-btn--ghost" data-nav="-1"' + (i === 0 ? ' disabled' : '') + '>← Back</button>' +
      '<span class="fe-count">Step ' + (i + 1) + ' of ' + n + '</span>' +
      (i < n - 1 ? '<button type="button" class="pt-btn pt-btn--ember" data-nav="1">' + esc(i === n - 2 ? (lastLabel || 'Finish and review') : 'Continue →') + '</button>' : '<span></span>') + '</div>';
  }
  function card(eyebrow, title, body) {
    return '<div class="fe-card"><span class="pt-eyebrow">' + esc(eyebrow) + '</span><h2 class="pt-h2 fe-step-title" tabindex="-1">' + esc(title) + '</h2>' + body + '</div>';
  }

  /* ---------- review + export ---------- */
  function orderedNotes() {
    var b = bucket();
    return Object.keys(b).map(function (k) { return b[k]; }).sort(function (a, c) { return a.order - c.order; });
  }
  function reviewBody() {
    var list = orderedNotes(), ch = S.choices[choiceKey()];
    var out = '';
    if (S.mode === 'daily' && Number.isInteger(ch) && S.study.choices[ch]) out += '<div class="fe-review-item"><strong>Closest to my experience</strong>' + p(S.study.choices[ch].label) + '</div>';
    out += list.length ? list.map(function (n) { return '<div class="fe-review-item"><strong>' + esc(n.label) + '</strong>' + p(n.text) + '</div>'; }).join('')
      : '<p class="pt-muted">You haven’t written any reflections in this mode. That’s fine; reflection is always optional.</p>';
    out += '<div class="fe-callout"><strong>Your next step</strong>' + p(S.study.action) + '</div>';
    out += '<div class="fe-callout fe-callout--prayer"><strong>Pray</strong>' + p(S.study.prayer) + '</div>';
    out += '<div class="fe-actions"><button type="button" class="pt-btn" data-act="export">Export my reflections (.txt)</button><button type="button" class="pt-btn pt-btn--ghost" data-act="restart">Start over</button></div>';
    out += '<p class="pt-small pt-muted">Your notes stay private unless you export or share them yourself.</p>';
    return out;
  }
  function exportNotes() {
    var s = S.study, lines = ['TheWrkShop · Formation reflection', 'Study: ' + s.title + ' (' + s.anchor + ')', 'Mode: ' + MODE_NAMES[S.mode], 'Date: ' + new Date().toLocaleDateString(), ''];
    var ch = S.choices[choiceKey()];
    if (S.mode === 'daily' && Number.isInteger(ch) && s.choices[ch]) lines.push('Closest to my experience:', s.choices[ch].label, '');
    orderedNotes().forEach(function (n) { lines.push(n.label, n.text, ''); });
    lines.push('Next step: ' + s.action, '', 'thewrkshop.com');
    var url = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' }));
    var a = document.createElement('a'); a.href = url; a.download = 'thewrkshop-' + s.id + '-' + S.mode + '-reflections.txt';
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }
  function restart() {
    if (!confirm('Start over and clear your reflections for this study in ' + MODE_NAMES[S.mode] + '?')) return;
    if (S.notes[S.study.id]) delete S.notes[S.study.id][S.mode];
    delete S.choices[choiceKey()];
    persist(); S.step = 0; S.focusNext = true; render();
  }

  /* ---------- Interactive Daily ---------- */
  function renderDaily() {
    var s = S.study, steps = ['Connect', 'Discover', 'Discern', 'Go Deeper', 'Respond', 'Review'], i = S.step, body = '';
    if (i === 0) body = p('Think of a recent moment when this theme showed up in your life.') + '<div class="fe-callout">' + esc(s.tension) + '</div>' + noteBox('connect', 'What happened?', 1);
    if (i === 1) body = verseBlock() + '<div class="fe-callout"><strong>Notice</strong>' + p(s.truth) + '</div>' + noteBox('discover', 'What does this passage reveal about Jesus or His call?', 2);
    if (i === 2) {
      var ch = S.choices[choiceKey()];
      body = p('Choose the response closest to your experience. This is a reflection prompt, not a diagnosis.') +
        '<div class="fe-choices">' + s.choices.map(function (c, n) { return '<button type="button" class="fe-choice" data-choice="' + n + '" aria-pressed="' + (ch === n) + '">' + esc(c.label) + '</button>'; }).join('') + '</div>' +
        (Number.isInteger(ch) && s.choices[ch] ? '<div class="fe-callout"><strong>Go deeper</strong>' + p(s.choices[ch].reflection) + '</div>' + noteBox('discern', 'What is your honest response?', 3) : '');
    }
    if (i === 3) body = '<ol class="fe-list">' + s.deeper.map(function (q) { return '<li>' + esc(q) + '</li>'; }).join('') + '</ol>' + woundBlock() + noteBox('deeper', 'Which question reaches beneath your first answer?', 4);
    if (i === 4) body = '<div class="fe-callout"><strong>This week</strong>' + p(s.action) + '</div>' + noteBox('respond', 'What is one specific, safe step you will take, and when?', 5) + '<details class="fe-details"><summary>Closing prayer</summary>' + p(s.prayer) + '</details>';
    if (i === 5) body = reviewBody();
    return progress(i, steps.length) + card('Interactive Daily · ' + steps[i], steps[i], body) + stepNav(i, steps.length);
  }

  /* ---------- Happy 4-3-2-1 ---------- */
  function render4321() {
    var s = S.study, steps = ['4 · Scriptures', '3 · Practices', '2 · Questions', 'Go Deeper', '1 · Response', 'Review'], i = S.step, body = '';
    if (i === 0) body = s.scriptures.map(function (x, n) {
      return '<details class="fe-details"' + (n === 0 ? ' open' : '') + '><summary>' + (n + 1) + '. ' + esc(x.ref) + '</summary>' + p(x.focus) + '<div class="fe-callout"><strong>Discover</strong>' + p(x.ask) + '</div><p class="pt-small">' + bgLink(x.ref, 'Read ' + x.ref + ' (NIV)') + '</p></details>';
    }).join('') + noteBox('scriptures', 'What truth is standing out?', 1);
    if (i === 1) body = '<ol class="fe-list">' + s.practices.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol>' + noteBox('practices', 'Which practice is most needed this week?', 2);
    if (i === 2) body = s.questions.map(function (q, n) { return noteBox('q' + n, q, 3 + n); }).join('');
    if (i === 3) body = '<ol class="fe-list">' + s.deeper.map(function (q) { return '<li>' + esc(q) + '</li>'; }).join('') + '</ol>' + p('Read ' + s.anchor + ' again. Consider what Christ is inviting you to believe and practice.') + woundBlock() + noteBox('deeper', 'What is beneath your first answer?', 6);
    if (i === 4) body = '<div class="fe-callout"><strong>One faithful response</strong>' + p(s.action) + '</div>' + noteBox('response', 'Name one faithful next step, and when you will take it.', 7) + '<div class="fe-callout fe-callout--prayer"><strong>Pray</strong>' + p(s.prayer) + '</div>';
    if (i === 5) body = reviewBody();
    return progress(i, steps.length) + card('Happy 4-3-2-1 · ' + steps[i], steps[i], body) + stepNav(i, steps.length);
  }

  /* ---------- Group: stages, planning and timing ---------- */
  var STAGES = {
    ice: { name: 'Icebreaker', role: 'Host', weight: 0, min: 2,
      guide: 'Model a short, light answer first. Keep it moving; nobody needs to go deep here. Passing is always welcome.' },
    welcome: { name: 'Welcome + agreements', role: 'Host', weight: 4, min: 2,
      guide: 'Welcome everyone and set the agreements: share voluntarily, pass anytime, don’t repeat another man’s story. Confidentiality has limits when someone is at risk of harm. Then open with a low-pressure question.',
      prompt: function (s) { return s.group.opening || ('Where does this theme show up in ordinary life? ' + s.tension); } },
    discover: { name: 'Read + Discover', role: 'Scripture reader', weight: 8, min: 4, verse: true,
      guide: 'Have the passage read aloud twice, with a short pause between readings. Ask the men to notice what the text says before interpreting their own experience.',
      prompt: function (s) { return s.group.discover || ('What do we actually see in ' + s.anchor + '? What does it reveal about Christ or His gospel?'); },
      note: 'What stands out to me in the passage' },
    b1: { name: 'Breakout 1 · Discern', role: 'Question guide', weight: 10, min: 5, breakout: true,
      guide: 'Send men into groups of 3–4 (in Google Meet, open breakout rooms and paste the question into the chat). 60 seconds of silent reflection, then each man may speak for up to 90 seconds. Passing is always welcome.',
      prompt: function (s) { return s.group.breakout1 || s.questions[0] || s.tension; },
      note: 'One insight I want to remember' },
    reconvene: { name: 'Reconvene', role: 'Host', weight: 4, min: 2,
      guide: 'Bring the groups back. Invite one insight per group. Insights about Jesus and the passage, never another man’s personal disclosure.',
      prompt: function (s) { return s.group.report || 'Share one insight about Jesus, not another participant’s personal story.'; } },
    b2: { name: 'Breakout 2 · Go Deeper', role: 'Listener', weight: 10, min: 5, breakout: true, deeper: true,
      guide: 'Ask one follow-up at a time. Don’t fix, preach at, or pressure anyone. Ask “What in the passage leads you there?” before moving to advice or application. Make room for silence.',
      prompt: function (s) { return s.group.breakout2 || ((s.deeper[0] || '') + ' ' + (s.deeper[1] || '')); },
      note: 'What I am learning (private)' },
    respond: { name: 'Respond + pray', role: 'Prayer lead', weight: 6, min: 3, prayer: true,
      guide: 'Give everyone quiet time to name an action privately. Invite optional sharing of next steps, then pray. Don’t collect confidential details.',
      prompt: function (s) { return 'What would following Jesus look like this week? ' + s.action; },
      note: 'My next faithful step (not shared automatically)' },
    send: { name: 'Send', role: 'Host', weight: 3, min: 2,
      guide: 'Close on time. Offer optional partner prayer and remind the men of the next gathering.',
      prompt: function (s) { return s.group.closing || 'Each man names one next step privately. Go in peace.'; } }
  };
  var FULL = ['welcome', 'discover', 'b1', 'reconvene', 'b2', 'respond', 'send'];
  var SHORT = ['welcome', 'discover', 'b1', 'respond', 'send'];

  var G = {
    total: 45, start: '', iceOn: false, iceMin: 6, iceStage: 'first', iceFormat: 'video', iceId: '',
    stages: [], minutes: [], extra: [], i: 0, seconds: 0, running: false, interval: null, chimed: false, notice: ''
  };

  function allocate(keys, total) {
    var w = keys.map(function (k) { return STAGES[k].weight; }), sum = w.reduce(function (a, b) { return a + b; }, 0);
    var raw = w.map(function (x) { return x * total / sum; });
    var mins = raw.map(Math.floor), left = total - mins.reduce(function (a, b) { return a + b; }, 0);
    raw.map(function (x, n) { return { n: n, f: x - Math.floor(x) }; }).sort(function (a, b) { return b.f - a.f; })
      .slice(0, left).forEach(function (o) { mins[o.n]++; });
    keys.forEach(function (k, n) { // enforce minimums, taking from the largest stage
      while (mins[n] < STAGES[k].min) {
        var big = -1; mins.forEach(function (m, j) { if (j !== n && m > STAGES[keys[j]].min && (big < 0 || m > mins[big])) big = j; });
        if (big < 0) break; mins[big]--; mins[n]++;
      }
    });
    return mins;
  }
  function buildPlan() {
    var ice = G.iceOn ? Math.max(2, Math.min(10, G.iceMin)) : 0;
    var avail = G.total - ice;
    var keys = avail >= 40 ? FULL.slice() : SHORT.slice();
    var mins = allocate(keys, avail);
    if (ice) { keys.unshift('ice'); mins.unshift(ice); }
    G.stages = keys; G.minutes = mins; G.extra = keys.map(function () { return 0; }); G.i = Math.min(G.i, keys.length - 1);
    G.notice = ''; resetTimer();
  }
  function sum(a) { return a.reduce(function (x, y) { return x + y; }, 0); }
  function planTotal() { return sum(G.minutes) + sum(G.extra); }
  function offsetOf(n) { return sum(G.minutes.slice(0, n)) + sum(G.extra.slice(0, n)); }
  function adjust(n, d) {
    var k = G.stages[n];
    if (d < 0 && G.minutes[n] - 1 < STAGES[k].min) { G.notice = STAGES[k].name + ' can’t go below ' + STAGES[k].min + ' minutes.'; return; }
    // find a partner among stages not yet finished (current or later), excluding n
    var partner = -1;
    G.minutes.forEach(function (m, j) {
      if (j === n || j < G.i) return;
      if (d > 0 && m - 1 < STAGES[G.stages[j]].min) return;
      if (partner < 0) { partner = j; return; }
      if (d > 0 ? m > G.minutes[partner] : (STAGES[G.stages[j]].breakout && !STAGES[G.stages[partner]].breakout) || m < G.minutes[partner]) partner = j;
    });
    if (partner < 0) { G.notice = 'No other stage has time to ' + (d > 0 ? 'give' : 'take') + '. Raise the total length instead.'; return; }
    G.minutes[n] += d; G.minutes[partner] -= d;
    G.notice = (d > 0 ? 'Added 1 minute to ' : 'Took 1 minute from ') + STAGES[k].name + (d > 0 ? ', from ' : ', gave it to ') + STAGES[G.stages[partner]].name + '.';
    if (n === G.i) G.seconds += d * 60;
    if (partner === G.i) G.seconds -= d * 60;
  }
  function trimRemaining(over) {
    var need = over, guard = 200;
    while (need > 0 && guard--) {
      var big = -1;
      G.minutes.forEach(function (m, j) { if (j >= G.i && m > STAGES[G.stages[j]].min && (big < 0 || m - STAGES[G.stages[j]].min > G.minutes[big] - STAGES[G.stages[big]].min)) big = j; });
      if (big < 0) break;
      G.minutes[big]--; need--;
      if (big === G.i) G.seconds -= 60;
    }
    G.notice = need > 0 ? 'Trimmed ' + (over - need) + ' of ' + over + ' minutes. You may run about ' + need + ' minute' + (need === 1 ? '' : 's') + ' long.' : 'Trimmed ' + over + ' minute' + (over === 1 ? '' : 's') + ' from the remaining stages. You’re back on schedule.';
  }
  function clockAt(offsetMin) {
    if (!G.start) return '';
    var parts = G.start.split(':'), d = new Date(); d.setHours(+parts[0], +parts[1] + offsetMin, 0, 0);
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }

  /* timer */
  function fmt(sec) { var a = Math.abs(sec); return (sec < 0 ? '+' : '') + String(Math.floor(a / 60)).padStart(2, '0') + ':' + String(a % 60).padStart(2, '0'); }
  function resetTimer() { clearInterval(G.interval); G.running = false; G.chimed = false; G.seconds = (G.minutes[G.i] || 0) * 60; paintTimer(); }
  function chime() {
    store(function () {
      var C = window.AudioContext || window.webkitAudioContext; if (!C) return;
      var ctx = new C(), o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = 660; g.gain.setValueAtTime(0.0001, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.05); g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
      o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 1.25);
    });
  }
  function tick() {
    G.seconds--;
    if (G.seconds === 0 && !G.chimed) { G.chimed = true; chime(); }
    paintTimer();
  }
  function toggleTimer() {
    if (G.running) { clearInterval(G.interval); G.running = false; }
    else { G.interval = setInterval(tick, 1000); G.running = true; }
    paintTimer();
  }
  function paintTimer() {
    var t = $('fe-timer'); if (!t) return;
    t.textContent = fmt(G.seconds);
    t.classList.toggle('is-over', G.seconds < 0);
    var st = $('fe-timer-status');
    if (st) st.textContent = G.seconds < 0 ? 'Over by ' + fmt(-G.seconds).replace(/^0/, '') + '. Invite a final thought, then move on.' : G.seconds === 0 ? 'Time is up. Invite a final thought before moving on.' : '';
    var b = $('fe-timer-toggle'); if (b) b.textContent = G.running ? 'Pause' : (G.seconds === (G.minutes[G.i] || 0) * 60 ? 'Start timer' : 'Resume');
  }
  function goStage(n) {
    var overMin = G.seconds < 0 ? Math.ceil(-G.seconds / 60) : 0;
    var forward = n > G.i;
    if (forward && overMin) G.extra[G.i] = Math.max(G.extra[G.i] || 0, overMin);
    G.i = Math.max(0, Math.min(G.stages.length - 1, n));
    resetTimer();
    G.notice = '';
    G.pendingTrim = forward && overMin >= 1 ? overMin : 0;
    S.focusNext = true; render();
  }

  /* icebreakers */
  function iceOptions() {
    var list = S.icebreakers.filter(function (x) {
      var okStage = x.stages.indexOf('any') > -1 || x.stages.indexOf(G.iceStage) > -1;
      var okFormat = x.format === 'both' || x.format === G.iceFormat;
      return okStage && okFormat;
    });
    if (S.study.icebreaker) list.unshift({ id: 'study', title: 'From this study', type: 'theme', prompt: S.study.icebreaker });
    return list;
  }
  function currentIce() {
    var opts = iceOptions();
    var all = (S.study.icebreaker ? [{ id: 'study', title: 'From this study', type: 'theme', prompt: S.study.icebreaker }] : []).concat(S.icebreakers);
    return all.filter(function (x) { return x.id === G.iceId; })[0] || opts[0] || null;
  }
  function stagePrompt(k) {
    if (k === 'ice') { var ic = currentIce(); return ic ? ic.prompt : 'Go around and share your name and one good thing from your week.'; }
    return STAGES[k].prompt(S.study);
  }
  function participantLink() {
    var u = new URL(location.href);
    u.search = ''; u.hash = '';
    u.searchParams.set('study', S.study.id); u.searchParams.set('mode', 'group'); u.searchParams.set('view', 'participant');
    u.searchParams.set('stages', G.stages.join(','));
    if (G.stages.indexOf('ice') > -1) u.searchParams.set('ice', (currentIce() || {}).id || '');
    return u.toString();
  }

  /* ---------- Group: leader view ---------- */
  function renderLeader() {
    var s = S.study, k = G.stages[G.i], st = STAGES[k], offs = 0;
    var totals = [30, 45, 60, 75, 90];
    var setup = '<details class="fe-card fe-setup" ' + (G.setupOpen !== false ? 'open' : '') + '><summary><span class="pt-eyebrow">Plan this gathering</span><strong>' + G.total + ' minutes' + (G.start ? ' · starts ' + clockAt(0) : '') + (G.iceOn ? ' · icebreaker on' : '') + '</strong></summary>' +
      '<div class="fe-grid">' +
      '<div><label class="fe-label" for="fe-total">Total session length</label><select id="fe-total">' + totals.map(function (t) { return '<option value="' + t + '"' + (G.total === t ? ' selected' : '') + '>' + t + ' minutes</option>'; }).join('') + '<option value="custom"' + (totals.indexOf(G.total) < 0 ? ' selected' : '') + '>Custom…</option></select>' +
      '<div' + (totals.indexOf(G.total) < 0 ? '' : ' hidden') + ' id="fe-custom-wrap"><label class="fe-label" for="fe-custom">Custom minutes (20–120)</label><input id="fe-custom" type="number" min="20" max="120" step="5" value="' + G.total + '"></div></div>' +
      '<div><label class="fe-label" for="fe-start">Start time (optional)</label><input id="fe-start" type="time" value="' + esc(G.start) + '"></div>' +
      '<div><label class="fe-check"><input type="checkbox" id="fe-ice-on"' + (G.iceOn ? ' checked' : '') + '> Include an icebreaker</label>' +
      '<div' + (G.iceOn ? '' : ' hidden') + '><label class="fe-label" for="fe-ice-min">Icebreaker minutes</label><select id="fe-ice-min">' + [2, 3, 4, 5, 6, 7, 8, 9, 10].map(function (m) { return '<option' + (G.iceMin === m ? ' selected' : '') + '>' + m + '</option>'; }).join('') + '</select></div></div>' +
      '<div' + (G.iceOn ? '' : ' hidden') + '><label class="fe-label" for="fe-ice-stage">This group is…</label><select id="fe-ice-stage"><option value="first"' + (G.iceStage === 'first' ? ' selected' : '') + '>Meeting for the first time</option><option value="established"' + (G.iceStage === 'established' ? ' selected' : '') + '>Established</option><option value="returning"' + (G.iceStage === 'returning' ? ' selected' : '') + '>Returning after a break</option></select>' +
      '<label class="fe-label" for="fe-ice-format">Meeting</label><select id="fe-ice-format"><option value="video"' + (G.iceFormat === 'video' ? ' selected' : '') + '>On video (Google Meet)</option><option value="in-person"' + (G.iceFormat === 'in-person' ? ' selected' : '') + '>In person</option></select></div>' +
      '</div>' +
      '<p class="pt-small pt-muted">Sessions under 40 minutes (after the icebreaker) use one breakout instead of two, so no stage gets squeezed. Breakouts never go below 5 minutes.</p>' +
      '<h3 class="pt-h3">Run of show</h3><ol class="fe-plan">' + G.stages.map(function (key, n) {
        var row = '<li class="' + (n === G.i ? 'is-current' : n < G.i ? 'is-done' : '') + '"><span class="fe-plan-time">' + (G.start ? clockAt(offs) : '') + '</span><span class="fe-plan-name"><button type="button" class="fe-linkbtn" data-go="' + n + '">' + esc(STAGES[key].name) + '</button><small>' + esc(STAGES[key].role) + '</small></span>' +
          '<span class="fe-plan-adj"><button type="button" class="fe-mini" data-adj="' + n + '" data-d="-1" aria-label="One minute less for ' + esc(STAGES[key].name) + '">−</button><b>' + G.minutes[n] + ' min' + (G.extra[n] ? ' <em class="fe-over">+' + G.extra[n] + '</em>' : '') + '</b><button type="button" class="fe-mini" data-adj="' + n + '" data-d="1" aria-label="One minute more for ' + esc(STAGES[key].name) + '">+</button></span></li>';
        offs += G.minutes[n] + (G.extra[n] || 0); return row;
      }).join('') + '<li class="fe-plan-total"><span class="fe-plan-time">' + (G.start ? clockAt(offs) : '') + '</span><span class="fe-plan-name">End</span><span class="fe-plan-adj"><b>' + planTotal() + ' min</b></span></li></ol>' +
      '<div class="fe-actions"><button type="button" class="pt-btn" data-act="copy-link">Copy participant link</button><span class="pt-small pt-muted" id="fe-copy-status" role="status"></span></div>' +
      '<p class="pt-small pt-muted">Paste the participant link into the Meet chat or a group text. The men see the prompts and a private notes space, never this facilitator console. Set the plan first: the link carries the stages.</p>' +
      '</details>';

    var trim = G.pendingTrim ? '<div class="fe-banner" role="status">The last stage ran about ' + G.pendingTrim + ' minute' + (G.pendingTrim === 1 ? '' : 's') + ' over. <button type="button" class="pt-btn pt-btn--ember" data-act="trim">Trim the remaining stages to finish on time</button> <button type="button" class="pt-btn pt-btn--ghost" data-act="keep">Keep the plan</button></div>' : '';
    var notice = G.notice ? '<p class="fe-notice" role="status">' + esc(G.notice) + '</p>' : '';

    var extra = '';
    if (k === 'ice') {
      var opts = iceOptions(), cur = currentIce();
      extra = '<label class="fe-label" for="fe-ice-pick">Choose an icebreaker</label><div class="fe-row"><select id="fe-ice-pick">' + opts.map(function (x) { return '<option value="' + esc(x.id) + '"' + (cur && x.id === cur.id ? ' selected' : '') + '>' + esc(x.title) + ' (' + esc(x.type) + ')</option>'; }).join('') + '</select><button type="button" class="pt-btn pt-btn--ghost" data-act="shuffle">Shuffle</button></div>';
    }
    if (st.verse) extra += verseBlock();
    if (st.deeper) extra += '<details class="fe-details"><summary>Go Deeper questions</summary><ol class="fe-list">' + s.deeper.map(function (q) { return '<li>' + esc(q) + '</li>'; }).join('') + '</ol>' + woundBlock() + '</details>';
    if (st.prayer) extra += '<div class="fe-callout fe-callout--prayer"><strong>Closing prayer</strong>' + p(s.prayer) + '</div>';

    var consoleCard = '<div class="fe-card fe-console"><span class="pt-eyebrow">Facilitator console · Stage ' + (G.i + 1) + ' of ' + G.stages.length + '</span>' +
      '<h2 class="pt-h2 fe-step-title" tabindex="-1">' + esc(st.name) + '</h2><p class="pt-muted">' + G.minutes[G.i] + ' minutes' + (G.start ? ' · ' + clockAt(offsetOf(G.i)) : '') + ' · Role: <strong>' + esc(st.role) + '</strong></p>' +
      '<div class="fe-callout fe-callout--say"><strong>Read aloud</strong>' + p(stagePrompt(k)) + '</div>' + extra +
      '<h3 class="pt-h3">Facilitator guidance</h3>' + p(st.guide) +
      '<div class="fe-timerbox"><div class="fe-timer" id="fe-timer" aria-live="off">' + fmt(G.seconds) + '</div><p class="fe-timer-status" id="fe-timer-status" role="status"></p>' +
      '<div class="fe-actions"><button type="button" class="pt-btn pt-btn--ember" id="fe-timer-toggle" data-act="timer">Start timer</button><button type="button" class="pt-btn pt-btn--ghost" data-act="timer-reset">Reset</button></div></div>' +
      '<div class="fe-nav"><button type="button" class="pt-btn pt-btn--ghost" data-go="' + (G.i - 1) + '"' + (G.i === 0 ? ' disabled' : '') + '>← Previous stage</button><span class="fe-count">' + (G.i + 1) + ' / ' + G.stages.length + '</span>' +
      (G.i < G.stages.length - 1 ? '<button type="button" class="pt-btn pt-btn--ember" data-go="' + (G.i + 1) + '">Next stage →</button>' : '<span class="pt-small pt-muted">Final stage</span>') + '</div></div>';

    var side = '<aside class="fe-side"><div class="fe-card"><h3 class="pt-h3">Breakout rhythm</h3><ol class="fe-list"><li>Quiet reflection (60 seconds)</li><li>Each voice invited (passing is welcome)</li><li>One deeper follow-up</li><li>One insight or faithful response</li></ol>' +
      '<h3 class="pt-h3">Group roles</h3><p>Host · Scripture reader · Question guide · Listener · Prayer lead</p><p class="pt-small pt-muted">Rotate roles across sessions. In a group of three, one man may hold more than one role.</p>' +
      '<details class="fe-details"><summary>Safety covenant</summary><p>Share voluntarily. Don’t repeat another man’s story. Confidentiality has limits when someone is at risk of harm or abuse. Avoid coercive confession, advice-giving and interrogation. Respond with compassion and point to appropriate support.</p></details></div></aside>';

    return setup + trim + notice + '<div class="fe-two">' + consoleCard + side + '</div>';
  }

  /* ---------- Group: participant view ---------- */
  function renderParticipant() {
    var s = S.study, k = G.stages[G.i], st = STAGES[k], body = '';
    body += '<div class="fe-callout fe-callout--say"><strong>' + (st.breakout ? 'Discuss' : 'Consider') + '</strong>' + p(stagePrompt(k)) + '</div>';
    if (st.verse) body += verseBlock();
    if (st.breakout) body += '<p class="pt-small pt-muted">60 seconds of quiet first. Then each man may share; passing is always welcome.</p>';
    if (st.deeper) body += '<details class="fe-details"><summary>Go Deeper questions</summary><ol class="fe-list">' + s.deeper.map(function (q) { return '<li>' + esc(q) + '</li>'; }).join('') + '</ol>' + woundBlock() + '</details>';
    if (st.prayer) body += '<div class="fe-callout fe-callout--prayer"><strong>Pray</strong>' + p(s.prayer) + '</div>';
    if (st.note) body += noteBox('g-' + k, st.note, G.stages.indexOf(k) + 1);
    if (G.i === G.stages.length - 1) body += '<hr class="fe-hr">' + reviewBody();
    var pills = '<nav class="fe-pills" aria-label="Stages">' + G.stages.map(function (key, n) { return '<button type="button" class="fe-pill" data-go="' + n + '" aria-current="' + (n === G.i ? 'step' : 'false') + '">' + (n + 1) + '. ' + esc(STAGES[key].name) + '</button>'; }).join('') + '</nav>';
    return '<p class="fe-notice">You’re following along with your leader. Tap the stage he announces. Your notes stay on this phone; nobody else sees them.</p>' + pills +
      card('Stage ' + (G.i + 1) + ' of ' + G.stages.length, st.name, body) +
      '<div class="fe-nav"><button type="button" class="pt-btn pt-btn--ghost" data-go="' + (G.i - 1) + '"' + (G.i === 0 ? ' disabled' : '') + '>← Back</button><span class="fe-count">' + (G.i + 1) + ' / ' + G.stages.length + '</span>' +
      (G.i < G.stages.length - 1 ? '<button type="button" class="pt-btn pt-btn--ember" data-go="' + (G.i + 1) + '">Next →</button>' : '<span></span>') + '</div>' +
      '<details class="fe-details"><summary>Our group agreements</summary><p>Share voluntarily. Pass anytime. Don’t repeat another man’s story. Confidentiality has limits when someone is at risk of harm.</p></details>';
  }

  /* ---------- controls + render ---------- */
  function renderControls() {
    var c = $('fe-controls'); if (!c) return;
    var problems = S.studies.filter(function (x) { return x.problems.length; });
    c.innerHTML = '<div class="fe-card fe-controls">' +
      '<label class="fe-label" for="fe-study">Choose the study</label><select id="fe-study">' + S.studies.map(function (x) { return '<option value="' + esc(x.id) + '"' + (x === S.study ? ' selected' : '') + '>' + esc(x.title) + '</option>'; }).join('') + '</select>' +
      '<p class="pt-muted fe-sub">' + esc(S.study.subtitle) + ' · ' + esc(S.study.anchor) + '</p>' +
      (S.view === 'participant' ? '' : '<div class="fe-tabs" role="group" aria-label="Experience">' + ['daily', '4321', 'group'].map(function (m) { return '<button type="button" class="fe-tab" data-mode="' + m + '" aria-pressed="' + (S.mode === m) + '">' + MODE_NAMES[m] + '</button>'; }).join('') + '</div>') +
      '<label class="fe-check fe-keep"><input type="checkbox" id="fe-keep"' + (S.keep ? ' checked' : '') + '> Keep my notes on this device <span class="pt-small pt-muted">(off by default; turning it off erases saved notes)</span></label>' +
      (problems.length ? '<div class="fe-banner fe-banner--warn"><strong>Study file check:</strong> ' + problems.map(function (x) { return esc(x.file) + ': ' + esc(x.problems.join(', ')); }).join(' · ') + '</div>' : '') +
      '</div>';
  }
  function syncURL() {
    var u = new URL(location.href);
    u.searchParams.set('study', S.study.id); u.searchParams.set('mode', S.mode);
    if (S.view === 'participant') u.searchParams.set('view', 'participant'); else { u.searchParams.delete('view'); u.searchParams.delete('stages'); u.searchParams.delete('ice'); }
    history.replaceState(null, '', u.toString());
  }
  function render() {
    renderControls();
    var html = S.mode === 'daily' ? renderDaily() : S.mode === '4321' ? render4321() : (S.view === 'participant' ? renderParticipant() : renderLeader());
    $('fe-stage').innerHTML = html;
    wireNotes(); paintTimer(); syncURL();
    if (S.focusNext) { var h = app.querySelector('.fe-step-title'); if (h) { h.focus({ preventScroll: true }); h.scrollIntoView({ behavior: 'smooth', block: 'start' }); } S.focusNext = false; }
  }

  /* one delegated handler for every button */
  app.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b || b.disabled) return;
    if (b.dataset.mode) { S.mode = b.dataset.mode; S.step = 0; resetTimer(); render(); return; }
    if (b.dataset.nav) { S.step = Math.max(0, S.step + (+b.dataset.nav)); S.focusNext = true; render(); return; }
    if (b.dataset.choice) { S.choices[choiceKey()] = +b.dataset.choice; persist(); render(); return; }
    if (b.dataset.go !== undefined) { goStage(+b.dataset.go); return; }
    if (b.dataset.adj !== undefined) { adjust(+b.dataset.adj, +b.dataset.d); render(); return; }
    var a = b.dataset.act;
    if (a === 'export') exportNotes();
    else if (a === 'restart') restart();
    else if (a === 'timer') toggleTimer();
    else if (a === 'timer-reset') resetTimer();
    else if (a === 'trim') { trimRemaining(G.pendingTrim); G.pendingTrim = 0; render(); }
    else if (a === 'keep') { G.pendingTrim = 0; render(); }
    else if (a === 'shuffle') { var o = iceOptions(); if (o.length > 1) { var cur = currentIce(), next = cur; while (next === cur) next = o[Math.floor(Math.random() * o.length)]; G.iceId = next.id; } render(); }
    else if (a === 'copy-link') {
      var link = participantLink(), done = function () { var s = $('fe-copy-status'); if (s) s.textContent = 'Copied ✓'; };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(link).then(done, function () { window.prompt('Copy this link:', link); });
      else window.prompt('Copy this link:', link);
    }
  });
  app.addEventListener('change', function (e) {
    var t = e.target;
    if (t.id === 'fe-study') {
      S.study = S.studies.filter(function (x) { return x.id === t.value; })[0] || S.studies[0];
      S.step = 0; G.i = 0; G.iceId = ''; G.pendingTrim = 0; resetTimer(); render(); return;
    }
    if (t.id === 'fe-keep') { setKeep(t.checked); return; }
    if (t.id === 'fe-total') {
      if (t.value === 'custom') { $('fe-custom-wrap').hidden = false; $('fe-custom').focus(); return; }
      G.total = +t.value;
    }
    else if (t.id === 'fe-custom') G.total = Math.max(20, Math.min(120, Math.round(+t.value || 45)));
    else if (t.id === 'fe-start') G.start = t.value;
    else if (t.id === 'fe-ice-on') G.iceOn = t.checked;
    else if (t.id === 'fe-ice-min') G.iceMin = +t.value;
    else if (t.id === 'fe-ice-stage') { G.iceStage = t.value; G.iceId = ''; }
    else if (t.id === 'fe-ice-format') { G.iceFormat = t.value; G.iceId = ''; }
    else if (t.id === 'fe-ice-pick') { G.iceId = t.value; render(); return; }
    else return;
    if (t.id === 'fe-start') { render(); return; }
    G.setupOpen = true; buildPlan(); render();
  });
  app.addEventListener('toggle', function (e) { if (e.target.classList && e.target.classList.contains('fe-setup')) G.setupOpen = e.target.open; }, true);

  /* ---------- boot ---------- */
  function boot() {
    loadSaved();
    fetchText(CONTENT + 'studies.txt').then(function (list) {
      var files = list.split(/\r?\n/).map(function (l) { return l.trim(); }).filter(function (l) { return l && l.charAt(0) !== '#'; });
      return Promise.all(files.map(function (f) { return fetchText(CONTENT + f).then(function (t) { return toStudy(parse(t), f); }, function () { return null; }); }))
        .then(function (studies) { return fetchText(CONTENT + 'icebreakers.txt').then(parseIcebreakers, function () { return []; }).then(function (ib) { return [studies, ib]; }); });
    }).then(function (r) {
      S.studies = r[0].filter(Boolean); S.icebreakers = r[1];
      if (!S.studies.length) throw new Error('No studies found');
      S.study = S.studies.filter(function (x) { return x.id === qs.get('study'); })[0] || S.studies[0];
      buildPlan();
      if (S.view === 'participant') {
        var st = (qs.get('stages') || '').split(',').filter(function (k) { return STAGES[k]; });
        if (st.length) { G.stages = st; G.minutes = st.map(function () { return 0; }); }
        if (qs.get('ice')) G.iceId = qs.get('ice');
        S.mode = 'group';
      }
      app.classList.remove('is-loading');
      render();
    }).catch(function (err) {
      $('fe-stage').innerHTML = '<div class="fe-card"><h2 class="pt-h3">The studies didn’t load.</h2><p>Check your connection and refresh the page.</p><p class="pt-small pt-muted">' + esc(err.message) + '</p></div>';
    });
  }
  boot();
})();
