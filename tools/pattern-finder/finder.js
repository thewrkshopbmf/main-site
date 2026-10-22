/* The Pattern Finder. Answers stay in this browser tab (sessionStorage) and are never sent anywhere.
   Pattern data comes from /patterns/patterns-data.js (built from scripts/patterns/patterns-data.mjs). */
(function () {
  'use strict';
  var P = window.TWS_PATTERNS || [];
  var CHOICES = ['Rarely', 'Occasionally', 'Sometimes', 'Often', 'Very often'];
  var FOLLOW_Q = ['When this pattern shows up, what feels most threatened?', 'What do you tend to do first?', 'What most often happens afterward?'];
  var FOLLOW_KEYS = ['threat', 'reaction', 'after'];
  var QUESTIONS = [];
  P.forEach(function (p, i) { p.questions.forEach(function (t) { QUESTIONS.push({ t: t, i: i }); }); });
  var N = QUESTIONS.length;
  var MAX = 8; // two questions per pattern, 0–4 each
  var KEY = 'tws.patternFinder.v1';

  var app = document.getElementById('ptApp');
  var st = fresh();

  function fresh() { return { stage: 'intro', step: 0, answers: {}, follow: [], top: null }; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function track(name) { try { if (window.gtag) window.gtag('event', name); } catch (e) {} }
  function save() { try { sessionStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  function load() {
    try {
      var s = JSON.parse(sessionStorage.getItem(KEY) || 'null');
      if (s && s.stage && typeof s.answers === 'object') st = s;
    } catch (e) {}
  }

  function scores() {
    return P.map(function (p, i) {
      var s = 0;
      QUESTIONS.forEach(function (q, j) { if (q.i === i && st.answers[j] != null) s += st.answers[j]; });
      return { i: i, s: s };
    });
  }
  function tiedTop() {
    var sc = scores();
    var max = Math.max.apply(null, sc.map(function (x) { return x.s; }));
    return { max: max, idx: sc.filter(function (x) { return x.s === max; }).map(function (x) { return x.i; }) };
  }

  function btn(label, act, cls) { return '<button class="pt-btn ' + (cls || '') + '" type="button" data-act="' + act + '">' + label + '</button>'; }
  function top(label, count) {
    return '<div class="pt-tool-top"><span class="pt-eyebrow" style="margin:0">' + label + '</span><span class="pt-count">' + count + '</span></div>';
  }
  function bar(pct) { return '<div class="pt-track"><div style="width:' + pct + '%"></div></div>'; }
  function focusHeading() {
    var h = app.querySelector('legend, h2');
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
  }

  function render(focus) {
    var html = '';
    if (st.stage === 'intro') {
      html = '<span class="pt-eyebrow">3–5 minute reflection</span>' +
        '<h2 class="pt-h2">Understand the reactions that keep repeating</h2>' +
        '<p>Answer 12 short statements. Then explore your strongest pattern with three quick questions, and get a seven-day practice.</p>' +
        '<div class="pt-callout"><p>There are no “bad types.” These are prompts for reflection, not labels or diagnoses.</p></div>' +
        '<div class="pt-actions">' + btn('Begin reflection →', 'start', 'pt-btn--ember') + '</div>';
    } else if (st.stage === 'quiz') {
      var q = QUESTIONS[st.step];
      html = top('Part 1 · Discover', (st.step + 1) + ' / ' + N) + bar(st.step / N * 100) +
        '<fieldset class="pt-fieldset"><legend class="pt-legend">' + esc(q.t) + '</legend>' +
        CHOICES.map(function (c, i) {
          return '<label class="pt-option"><input type="radio" name="answer" value="' + i + '"' + (st.answers[st.step] === i ? ' checked' : '') + '>' + c + '</label>';
        }).join('') + '</fieldset>' +
        '<p class="pt-error" id="ptErr" role="alert"></p>' +
        '<div class="pt-actions">' + btn('Back', 'back', 'pt-btn--ghost') + btn(st.step === N - 1 ? 'Explore my pattern →' : 'Next →', 'next') + '</div>';
    } else if (st.stage === 'pick') {
      var t = tiedTop();
      var none = t.max <= 2;
      html = '<span class="pt-eyebrow">Choose where to start</span>' +
        '<h2 class="pt-h2">' + (none ? 'None of these patterns showed up often' : 'More than one pattern came out on top') + '</h2>' +
        '<p>' + (none
          ? 'That’s worth noticing. Pick the one you’d most like to understand anyway, or <a href="/patterns/">browse the library</a>.'
          : 'Your answers scored the same for these. Choose the one that feels most true in a real situation from this week.') + '</p>' +
        '<fieldset class="pt-fieldset"><legend class="pt-sr">Choose a pattern to explore</legend>' +
        t.idx.map(function (i) {
          return '<label class="pt-option"><input type="radio" name="pick" value="' + i + '"' + (st.top === i ? ' checked' : '') + '><span><strong>' + esc(P[i].name) + '</strong> · ' + esc(P[i].desc) + '</span></label>';
        }).join('') + '</fieldset>' +
        '<p class="pt-error" id="ptErr" role="alert"></p>' +
        '<div class="pt-actions">' + btn('Back', 'back', 'pt-btn--ghost') + btn('Explore this pattern →', 'next') + '</div>';
    } else if (st.stage === 'follow') {
      var p = P[st.top];
      var opts = p[FOLLOW_KEYS[st.step]];
      html = top('Part 2 · Investigate', (st.step + 1) + ' / 3') + bar(st.step / 3 * 100) +
        '<p>Your strongest reported pattern: <strong>' + esc(p.name) + '</strong></p>' +
        '<fieldset class="pt-fieldset"><legend class="pt-legend">' + FOLLOW_Q[st.step] + '</legend>' +
        opts.map(function (c, i) {
          return '<label class="pt-option"><input type="radio" name="follow" value="' + i + '"' + (st.follow[st.step] === i ? ' checked' : '') + '>' + esc(c) + '</label>';
        }).join('') + '</fieldset>' +
        '<p class="pt-error" id="ptErr" role="alert"></p>' +
        '<div class="pt-actions">' + btn('Back', 'back', 'pt-btn--ghost') + btn(st.step === 2 ? 'See my reflection →' : 'Next →', 'next') + '</div>';
    } else {
      html = resultHtml();
    }
    app.innerHTML = html;
    if (focus) { focusHeading(); app.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
    save();
  }

  function resultHtml() {
    var p = P[st.top];
    var sc = scores().sort(function (a, b) { return b.s - a.s || a.i - b.i; });
    return '<span class="pt-eyebrow">Your personal reflection</span>' +
      '<h2 class="pt-h2">' + esc(p.name) + '</h2>' +
      '<p>' + esc(p.desc) + '. Your answers suggest this may be a pattern worth examining. It is not an identity or a confirmed explanation of your motives.</p>' +
      '<div class="pt-bars">' + sc.map(function (x) {
        return '<div class="pt-bar-row' + (x.i === st.top ? ' is-top' : '') + '"><div class="pt-bar-head">' + esc(P[x.i].name) +
          '<span>' + x.s + '/' + MAX + '</span></div><div class="pt-bar" role="img" aria-label="' + esc(P[x.i].name) + ': ' + x.s + ' out of ' + MAX + '"><div style="width:' + (x.s / MAX * 100) + '%"></div></div></div>';
      }).join('') + '</div>' +
      '<h3 class="pt-h3">Your situation, in your words</h3>' +
      '<div class="pt-dl">' +
        '<p><strong>What may feel threatened:</strong> ' + esc(p.threat[st.follow[0]]) + '</p>' +
        '<p><strong>Your usual first response:</strong> ' + esc(p.reaction[st.follow[1]]) + '</p>' +
        '<p><strong>What follows:</strong> ' + esc(p.after[st.follow[2]]) + '</p>' +
      '</div>' +
      '<div class="pt-callout"><span class="pt-label">Pause question</span><p>' + esc(p.pauseQuestion) + '</p>' +
        '<span class="pt-label">Try instead</span><p>' + esc(p.tryInstead) + '</p></div>' +
      '<h3 class="pt-h3" style="margin-top:1.75rem">Your seven-day practice</h3>' +
      '<ol>' + p.days.map(function (d) { return '<li>' + esc(d) + '</li>'; }).join('') + '</ol>' +
      '<p><strong>Optional biblical reflection:</strong> ' + esc(p.verse) + '. What does this passage teach in its context, and how might it shape your next response?</p>' +
      '<div class="pt-actions pt-no-print">' +
        '<a class="pt-btn pt-btn--ember" href="/patterns/' + p.id + '/#practice">Open my practice page</a>' +
        '<a class="pt-btn pt-btn--ghost" href="/tools/interruption-lab/?pattern=' + p.id + '">Rehearse it in the Lab</a>' +
      '</div>' +
      '<p class="pt-muted pt-small">Your practice page has a checklist that remembers your progress in this browser, plus examples and Scripture.</p>' +
      '<div class="pt-actions pt-no-print">' + btn('Copy my reflection', 'copy', 'pt-btn--ghost') + btn('Print / save PDF', 'print', 'pt-btn--ghost') + btn('Start over', 'reset', 'pt-btn--ghost') + '</div>' +
      '<p class="pt-feedback" id="ptFeedback" role="status"></p>';
  }

  function err(msg) { var e = document.getElementById('ptErr'); if (e) e.textContent = msg; }

  app.addEventListener('change', function (e) {
    var t = e.target;
    if (t.name === 'answer') st.answers[st.step] = Number(t.value);
    if (t.name === 'follow') st.follow[st.step] = Number(t.value);
    if (t.name === 'pick') st.top = Number(t.value);
    err('');
    save();
  });

  app.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]');
    if (!b) return;
    var a = b.getAttribute('data-act');
    if (a === 'start') { st.stage = 'quiz'; st.step = 0; track('pattern_finder_start'); }
    else if (a === 'next') {
      if (st.stage === 'quiz') {
        if (st.answers[st.step] == null) return err('Choose an answer to continue.');
        if (st.step < N - 1) st.step++;
        else {
          var t = tiedTop();
          st.follow = []; st.step = 0;
          if (t.idx.length > 1) { st.stage = 'pick'; if (t.idx.indexOf(st.top) < 0) st.top = null; }
          else { st.top = t.idx[0]; st.stage = 'follow'; }
        }
      } else if (st.stage === 'pick') {
        if (st.top == null) return err('Choose a pattern to continue.');
        st.stage = 'follow'; st.step = 0;
      } else if (st.stage === 'follow') {
        if (st.follow[st.step] == null) return err('Choose an answer to continue.');
        if (st.step < 2) st.step++;
        else { st.stage = 'result'; track('pattern_finder_complete'); }
      }
    } else if (a === 'back') {
      if (st.stage === 'quiz') { if (st.step > 0) st.step--; else st.stage = 'intro'; }
      else if (st.stage === 'pick') { st.stage = 'quiz'; st.step = N - 1; }
      else if (st.stage === 'follow') {
        if (st.step > 0) st.step--;
        else if (tiedTop().idx.length > 1) st.stage = 'pick';
        else { st.stage = 'quiz'; st.step = N - 1; }
      }
    } else if (a === 'reset') { st = fresh(); }
    else if (a === 'print') { window.print(); return; }
    else if (a === 'copy') { copy(); return; }
    render(true);
  });

  function copy() {
    var p = P[st.top];
    var text = [
      'The Pattern Finder | TheWrkShop.com', p.name,
      'What may feel threatened: ' + p.threat[st.follow[0]],
      'Usual first response: ' + p.reaction[st.follow[1]],
      'What follows: ' + p.after[st.follow[2]],
      'Pause: ' + p.pauseQuestion,
      'Try instead: ' + p.tryInstead,
      'Seven days:'
    ].concat(p.days.map(function (d, i) { return (i + 1) + '. ' + d; }))
      .concat(['Optional Scripture: ' + p.verse, 'https://thewrkshop.com/patterns/' + p.id + '/']).join('\n');
    var fb = document.getElementById('ptFeedback');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(function () { fb.textContent = 'Reflection copied.'; },
        function () { fb.textContent = 'Copy isn’t available in this browser. Use Print / save PDF instead.'; });
    } else fb.textContent = 'Copy isn’t available in this browser. Use Print / save PDF instead.';
  }

  load();
  render(false);
})();
