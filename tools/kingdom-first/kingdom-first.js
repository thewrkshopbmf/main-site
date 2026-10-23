/* What's Really First? The Kingdom First Diagnostic (Matthew 6:33).
   24 frequency reflections across six areas + 6 pressure scenarios, then a reflection, a seven-day practice and a group guide.
   Everything a person enters stays in this browser tab (sessionStorage) and is never sent to a server.
   Google Analytics receives start/finish counts only, never answers. */
(function () {
  'use strict';
  var KEY = 'tws.kingdomfirst.v1';
  var app = document.getElementById('kfApp');
  if (!app) return;

  /* ---------- content ---------- */
  var AREAS = [
    { name: 'Authority & Surrender', verse: 'Luke 6:46', hope: 'God invites honest obedience, not a performance of perfection.' },
    { name: 'Security & Control', verse: 'Matthew 6:25–34', hope: 'Your Father knows your needs, even when outcomes remain uncertain.' },
    { name: 'Approval & Identity', verse: 'Matthew 6:1–6', hope: 'You can practice faithfulness without living for an audience.' },
    { name: 'Desire & Attachment', verse: 'Matthew 6:19–24', hope: 'A good desire does not have to become your master.' },
    { name: 'Righteousness & Motives', verse: 'Matthew 6:1–18', hope: 'Confession and repentance are pathways toward sincere devotion.' },
    { name: 'Trust & Daily Obedience', verse: 'Matthew 7:24–27', hope: 'Faithfulness grows through small, concrete responses to Christ.' }
  ];
  var Q = [
    [0, 'When a clear biblical teaching challenges a decision I want to make, I look for reasons it might not apply to me.'],
    [0, 'When someone offers a well-founded correction, my first response is usually to defend myself.'],
    [0, 'I ask God to bless my plans before seriously examining whether those plans honor Him.'],
    [0, 'I delay a step I believe is right because I dislike what it may cost me.'],
    [1, 'When a situation is uncertain, I struggle to stop rehearsing ways to control the outcome.'],
    [1, 'I feel compelled to keep working even when rest and reasonable responsibilities have been addressed.'],
    [1, 'I treat an unexpected setback as evidence that everything is about to fall apart.'],
    [1, 'I find it difficult to delegate appropriate responsibility because I need to know exactly how things will turn out.'],
    [2, 'I change how I express my convictions when people whose approval matters to me are present.'],
    [2, 'I replay moments when my contribution went unnoticed.'],
    [2, 'I compare my influence or recognition with that of other people.'],
    [2, 'I avoid an honest but respectful conversation because I fear being disliked.'],
    [3, 'The possibility of losing something important makes it hard for me to consider what faithfulness might require.'],
    [3, 'I sometimes justify questionable methods because the goal feels so important.'],
    [3, 'I measure how well life is going mainly by whether I am getting the outcomes I want.'],
    [3, 'I have difficulty celebrating another person’s success when it touches something I deeply desire.'],
    [4, 'I am more concerned with how righteous I appear than with receiving correction privately.'],
    [4, 'When confronting a genuine wrong, I excuse an unnecessarily harsh response because I was right about the issue.'],
    [4, 'I use my past service or sacrifices as a reason others should not question me.'],
    [4, 'I find it easier to identify another person’s fault than to name my contribution to a conflict.'],
    [5, 'After praying about a decision, I rarely revisit whether my own motives need to change.'],
    [5, 'I know a small act of obedience I have been postponing.'],
    [5, 'When plans fail, I abandon helpful practices of prayer, Scripture, or wise counsel.'],
    [5, 'I rely on spiritual intentions more than concrete follow-through.']
  ];
  var FREQ = ['Almost never', 'Occasionally', 'Sometimes', 'Often'];
  var NOT_SURE = 'Not sure / not applicable';
  var S = [
    { title: 'When your contribution is overlooked', text: 'You invested substantial time in serving, but someone else receives the public thanks. What is closest to your initial response?',
      choices: ['I feel hurt and start mentally keeping track of what I contributed.', 'I wonder whether I should stop serving if no one values it.', 'I acknowledge disappointment and examine whether recognition has become too important.', 'I am unsure how I would respond.'],
      ref: 'Matthew 6:1–4', reflection: 'Appreciation is good, but the Father sees what others overlook. What reward has begun to matter most?' },
    { title: 'When obedience may cost you', text: 'A decision could benefit you financially, but it requires a misleading statement. What is your likely first response?',
      choices: ['I begin looking for a way to justify the wording.', 'I feel torn because people depend on the income.', 'I reject the misleading statement and look for an honest alternative.', 'I am unsure how I would respond.'],
      ref: 'Matthew 6:33', reflection: 'God’s righteousness governs the means as well as the desired result. Faithfulness may be costly.' },
    { title: 'When your authority is challenged', text: 'Someone questions your decision publicly. Their concern may have merit, but you feel embarrassed. What is your first impulse?',
      choices: ['I want to demonstrate that I am in charge.', 'I want to withdraw and avoid the conversation.', 'I try to separate the valid concern from my embarrassment before responding.', 'I am unsure how I would respond.'],
      ref: 'James 1:19–20', reflection: 'Being right about a concern does not make every response righteous. What was threatened?' },
    { title: 'When tomorrow feels uncertain', text: 'A major expense appears unexpectedly and you cannot see how everything will work out. What do you tend to do first?',
      choices: ['I repeatedly rehearse worst-case possibilities.', 'I work or plan compulsively because stopping feels unsafe.', 'I make a responsible plan, ask for help if needed, and pray without demanding certainty.', 'I am unsure how I would respond.'],
      ref: 'Matthew 6:25–34', reflection: 'Trust does not cancel planning. The Father knows your needs while you take responsible steps.' },
    { title: 'When someone else succeeds', text: 'A peer receives an opportunity you hoped for. What response feels most familiar?',
      choices: ['I begin comparing our worth or achievements.', 'I question whether my own efforts matter.', 'I congratulate them while honestly bringing my disappointment to God.', 'I am unsure how I would respond.'],
      ref: 'Matthew 6:19–24', reflection: 'Another person’s success need not become a verdict on your value or calling.' },
    { title: 'When you already know the next step', text: 'You have been avoiding a respectful apology you believe you owe. What most resembles your response?',
      choices: ['I keep rehearsing why the other person was also wrong.', 'I wait for them to apologize first.', 'I take responsibility for my part without pretending theirs was right.', 'I am unsure how I would respond.'],
      ref: 'Matthew 7:24–27', reflection: 'Hearing Jesus’ words calls for practiced obedience. You can take responsibility for your part.' }
  ];
  var DAYS = [
    ['Matthew 6:19–24', 'Name one desire you have begun treating as non-negotiable.'],
    ['Matthew 6:25–34', 'Write down one real concern, one responsible action, and one thing you cannot control.'],
    ['Matthew 6:1–6', 'Do one good thing without seeking recognition.'],
    ['Matthew 6:9–13', 'Pray “Your kingdom come, Your will be done,” then name a decision it touches.'],
    ['James 1:19–20', 'Before responding to pressure, pause and name the desire that feels threatened.'],
    ['Luke 6:46–49', 'Complete one act of obedience you have been postponing.'],
    ['Matthew 6:33–34', 'Review the week: what did you notice, confess, receive, and practice?']
  ];
  var NQ = Q.length, NS = S.length;

  /* ---------- helpers ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function track(name) { try { if (window.gtag) window.gtag('event', name); } catch (e) {} }
  function bible(ref) { return 'https://www.biblegateway.com/passage/?search=' + encodeURIComponent(ref.replace(/–/g, '-')) + '&version=NIV'; }
  function refLink(ref) { return '<a href="' + bible(ref) + '" target="_blank" rel="noopener">' + esc(ref) + '</a>'; }
  function fresh() { return { stage: 'intro', q: 0, s: 0, answers: {}, picks: {}, observation: '', step: '', done: {} }; }
  var st;
  try { st = JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch (e) { st = null; }
  if (!st || typeof st !== 'object' || !st.answers) st = fresh();
  if (!st.done) st.done = {};
  function save() { try { sessionStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  function count(o) { return Object.keys(o).length; }
  function focusTop() {
    var h = app.querySelector('h2, .pt-legend');
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    app.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---------- scoring ---------- */
  function profile() {
    return AREAS.map(function (a, i) {
      var vals = [];
      Q.forEach(function (q, qi) { var v = st.answers[qi]; if (q[0] === i && typeof v === 'number') vals.push(v); });
      var mean = vals.length >= 2 ? vals.reduce(function (x, y) { return x + y; }, 0) / vals.length : null;
      return { i: i, n: vals.length, mean: mean };
    });
  }
  function label(mean) {
    if (mean === null) return 'Not enough responses to interpret';
    return mean >= 2 ? 'A pattern worth exploring' : mean >= 1 ? 'An area to keep noticing' : 'Not frequently reported';
  }

  /* ---------- views ---------- */
  function intro() {
    var resume = count(st.answers) > 0 || count(st.picks) > 0;
    return '<h2 class="pt-h2">Not a grade. An invitation.</h2>' +
      '<p>Explore what may be shaping your decisions, reactions, desires and trust. Answer based on recent experience, not the person you wish you were. Some questions may be uncomfortable. You are not beyond God’s mercy.</p>' +
      '<ul class="kf-facts"><li><strong>Part one:</strong> 24 short reflections</li><li><strong>Part two:</strong> 6 real-life scenarios</li><li><strong>Time:</strong> about 12–16 minutes</li></ul>' +
      '<p class="pt-muted pt-small">You can mark any statement “Not sure / not applicable.” Your reflection describes what you reported. It is not a score, a diagnosis or a measure of salvation.</p>' +
      '<div class="pt-actions">' +
        '<button type="button" class="pt-btn pt-btn--ember" data-a="start">' + (resume ? 'Continue where I left off' : 'Begin reflection →') + '</button>' +
        (resume ? '<button type="button" class="pt-btn pt-btn--ghost" data-a="restart">Start over</button>' : '') +
      '</div>';
  }

  function question() {
    var q = Q[st.q], cur = st.answers[st.q];
    var opts = FREQ.map(function (l, v) { return [l, v]; }).concat([[NOT_SURE, 'x']]);
    return '<div class="pt-tool-top"><span class="pt-count">Part one · Reflection ' + (st.q + 1) + ' of ' + NQ + '</span><span class="pt-count">' + count(st.answers) + ' answered</span></div>' +
      '<div class="pt-track" aria-hidden="true"><div style="width:' + Math.round(st.q / NQ * 100) + '%"></div></div>' +
      '<span class="kf-tag">' + esc(AREAS[q[0]].name) + '</span>' +
      '<p class="kf-prompt">Over the past few months, how often has this reflected your experience?</p>' +
      '<fieldset class="pt-fieldset"><legend class="pt-legend">' + esc(q[1]) + '</legend>' +
        opts.map(function (o) {
          return '<button type="button" class="pt-option' + (o[1] === 'x' ? ' kf-notsure' : '') + '" data-a="answer" data-v="' + o[1] + '" aria-pressed="' + (String(cur) === String(o[1])) + '">' + esc(o[0]) + '</button>';
        }).join('') +
      '</fieldset>' +
      '<div class="pt-actions"><button type="button" class="pt-btn pt-btn--ghost" data-a="back">← Back</button></div>';
  }

  function bridge() {
    return '<span class="pt-eyebrow">Part two · Decisions under pressure</span>' +
      '<h2 class="pt-h2">What happens when the kingdom becomes costly?</h2>' +
      '<p>These situations don’t have perfect multiple-choice answers. Choose the response closest to your likely <strong>first impulse</strong>, not what you believe you should do. Each choice opens a short Scripture-based reflection, not a grade.</p>' +
      '<div class="pt-actions">' +
        '<button type="button" class="pt-btn pt-btn--ghost" data-a="back">← Back</button>' +
        '<button type="button" class="pt-btn pt-btn--ember" data-a="toScenarios">Continue →</button>' +
      '</div>';
  }

  function scenario() {
    var s = S[st.s], cur = st.picks[st.s];
    return '<div class="pt-tool-top"><span class="pt-count">Part two · Situation ' + (st.s + 1) + ' of ' + NS + '</span></div>' +
      '<div class="pt-track" aria-hidden="true"><div style="width:' + Math.round(st.s / NS * 100) + '%"></div></div>' +
      '<span class="kf-tag">' + esc(s.title) + '</span>' +
      '<fieldset class="pt-fieldset"><legend class="pt-legend">' + esc(s.text) + '</legend>' +
        s.choices.map(function (c, i) {
          return '<button type="button" class="pt-option" data-a="pick" data-v="' + i + '" aria-pressed="' + (cur === i) + '">' + esc(c) + '</button>';
        }).join('') +
      '</fieldset>' +
      '<div class="kf-follow" aria-live="polite">' + (cur != null ? followHtml(s) : '') + '</div>' +
      '<div class="pt-actions">' +
        '<button type="button" class="pt-btn pt-btn--ghost" data-a="back">← Back</button>' +
        '<button type="button" class="pt-btn pt-btn--ember" data-a="next"' + (cur == null ? ' disabled' : '') + '>' + (st.s === NS - 1 ? 'See my reflection →' : 'Continue →') + '</button>' +
      '</div>';
  }
  function followHtml(s) {
    return '<div class="pt-callout"><p><strong>' + refLink(s.ref) + '</strong> · ' + esc(s.reflection) + '</p></div>';
  }

  function results() {
    var prof = profile();
    var ranked = prof.filter(function (r) { return r.mean !== null; }).sort(function (a, b) { return b.mean - a.mean || a.i - b.i; });
    var top = ranked.length && ranked[0].mean >= 1 ? ranked[0].i : null;
    var html = '<div class="kf-output">' +
      '<span class="pt-eyebrow">Your personal reflection</span>' +
      '<h2 class="pt-h2">What might deserve your attention?</h2>' +
      '<p class="pt-muted">These patterns are prompts for prayerful consideration, not declarations about your identity or God’s judgment of you. A frequent response can have more than one explanation.</p>';

    html += prof.map(function (r) {
      var a = AREAS[r.i];
      return '<div class="kf-result' + (r.i === top ? ' is-top' : '') + '">' +
        '<h3>' + esc(a.name) + '<span>' + esc(label(r.mean)) + '</span></h3>' +
        (r.mean !== null ? '<div class="pt-bar" role="img" aria-label="' + esc(a.name + ': ' + label(r.mean)) + '"><div style="width:' + Math.max(3, Math.round(r.mean / 3 * 100)) + '%"></div></div>' : '') +
        '<p>' + esc(a.hope) + '</p>' +
        '<p class="pt-small pt-muted">Scripture: ' + refLink(a.verse) + '</p>' +
      '</div>';
    }).join('');

    if (top !== null) {
      html += '<div class="kf-start"><span class="pt-label">A suggested place to begin</span>' +
        '<h3 class="pt-h3">' + esc(AREAS[top].name) + '</h3>' +
        '<p>This is the area you reported most often, not necessarily your deepest issue. Read ' + refLink(AREAS[top].verse) + ' slowly and carry it into the seven days below.</p></div>';
    }

    html += '<h3 class="pt-h3 kf-gap">Your decisions under pressure</h3>' +
      '<p class="pt-muted pt-small">Based on the options you chose in hypothetical situations. These are not judgments about your character.</p>' +
      S.map(function (s, i) {
        var pick = st.picks[i];
        return '<div class="kf-result">' +
          '<h3>' + esc(s.title) + '</h3>' +
          '<p><span class="pt-label">Your response</span>' + (pick != null ? esc(s.choices[pick]) : '<em>Not answered</em>') + '</p>' +
          '<p>' + refLink(s.ref) + ' · ' + esc(s.reflection) + '</p>' +
        '</div>';
      }).join('');

    html += '<h3 class="pt-h3 kf-gap">A seven-day Kingdom First practice</h3>' +
      '<p class="pt-muted pt-small">One day at a time. Read the passage, pray honestly and take one specific step. Check off a day when it’s done.</p>' +
      '<ol class="pt-days kf-days">' + DAYS.map(function (d, i) {
        return '<li><label><input type="checkbox" data-day="' + i + '"' + (st.done[i] ? ' checked' : '') + '><span class="pt-day-num">Day ' + (i + 1) + '</span>' +
          '<span class="pt-day-text"><strong>' + refLink(d[0]) + '</strong><br>' + esc(d[1]) + '</span></label></li>';
      }).join('') + '</ol>' +
      '<p class="pt-progress" id="kfDaysDone" aria-live="polite">' + daysDone() + '</p>';

    html += '<h3 class="pt-h3 kf-gap">Take one faithful next step</h3>' +
      '<p>Read ' + refLink('Matthew 6:19–34') + ' slowly. Ask: <em>“Father, what am I seeking as ultimate, and what would seeking Your kingdom look like in my next decision?”</em></p>' +
      '<div class="pt-field"><label for="kfObs">What response or situation stood out most?</label><textarea id="kfObs" data-field="observation" maxlength="2000" placeholder="Write an honest observation…">' + esc(st.observation) + '</textarea></div>' +
      '<div class="pt-field"><label for="kfStep">One specific, realistic step I can take this week</label><textarea id="kfStep" data-field="step" maxlength="2000" placeholder="For example: seek wise counsel before a difficult decision…">' + esc(st.step) + '</textarea></div>' +
      '<p class="pt-muted pt-small">You don’t have to resolve everything today. Honest attention and a faithful next step matter.</p>' +
      '<div class="pt-actions pt-no-print">' +
        '<button type="button" class="pt-btn" data-a="copy">Copy my reflection</button>' +
        '<button type="button" class="pt-btn pt-btn--ghost" data-a="print">Print / save as PDF</button>' +
      '</div>' +
      '<p class="pt-feedback pt-no-print" id="kfFb" aria-live="polite"></p>';

    html += '<div class="kf-prayer"><span class="pt-label">A prayer to begin</span>' +
      '<p>Father, You know what I need and You see what I cannot yet see in myself. Show me where fear, approval, control or desire has begun to govern me. Thank You for Your mercy in Christ. Teach me to seek Your kingdom and righteousness, and give me grace to take the next faithful step. Amen.</p></div>';

    html += '<div class="pt-callout pt-no-print"><p><strong>Want to keep going?</strong> The <a href="/sub-pages/resources/seek-first-plan.html">30-Day “Seek First” Plan</a> takes Matthew 6:33 one day at a time for a month.</p></div>' +
      '<div class="pt-actions pt-no-print">' +
        '<button type="button" class="pt-btn pt-btn--ghost" data-a="review">Review my answers</button>' +
        '<button type="button" class="pt-btn pt-btn--ghost" data-a="restart">Start again</button>' +
      '</div>' +
    '</div>';
    return html;
  }
  function daysDone() { var n = count(st.done); return n + ' of 7 days done'; }

  function summaryText() {
    var prof = profile();
    var lines = ['WHAT’S REALLY FIRST? · PERSONAL REFLECTION', 'TheWrkShop · thewrkshop.com/tools/kingdom-first/', ''];
    prof.forEach(function (r) {
      var a = AREAS[r.i];
      lines.push(a.name.toUpperCase() + ' · ' + label(r.mean) + ' · ' + a.verse);
      Q.forEach(function (q, qi) {
        if (q[0] !== r.i) return;
        var v = st.answers[qi];
        lines.push('- ' + q[1] + ' — ' + (typeof v === 'number' ? FREQ[v] : v === 'x' ? NOT_SURE : 'Not answered'));
      });
      lines.push('');
    });
    lines.push('DECISIONS UNDER PRESSURE');
    S.forEach(function (s, i) {
      lines.push('- ' + s.title + ': ' + (st.picks[i] != null ? s.choices[st.picks[i]] : 'Not answered'));
      lines.push('  ' + s.ref + ' · ' + s.reflection);
    });
    lines.push('', 'What stood out: ' + (st.observation.trim() || '(not written)'), 'My next step: ' + (st.step.trim() || '(not written)'), '',
      'These are prompts for prayerful reflection, not a diagnosis or a measure of salvation.');
    return lines.join('\n');
  }

  function copyText(text) {
    var fb = document.getElementById('kfFb');
    function done(m) { if (fb) fb.textContent = m; }
    function fallback() {
      try {
        var t = document.createElement('textarea');
        t.value = text; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
        document.body.appendChild(t); t.select();
        var ok = document.execCommand('copy'); t.remove();
        done(ok ? 'Copied.' : 'Copy isn’t available in this browser. Use Print / save as PDF instead.');
      } catch (e) { done('Copy isn’t available in this browser. Use Print / save as PDF instead.'); }
    }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(function () { done('Copied.'); }, fallback);
    else fallback();
  }

  /* ---------- render + events ---------- */
  function render(focus) {
    document.body.classList.toggle('kf-has-results', st.stage === 'results');
    app.innerHTML = st.stage === 'q' ? question() : st.stage === 'bridge' ? bridge() : st.stage === 's' ? scenario() : st.stage === 'results' ? results() : intro();
    save();
    if (focus) focusTop();
  }

  app.addEventListener('click', function (e) {
    var b = e.target.closest('[data-a]');
    if (!b || b.disabled) return;
    var act = b.getAttribute('data-a');
    if (act === 'start') {
      if (!count(st.answers) && !count(st.picks)) track('kingdom_first_start');
      if (count(st.picks) || count(st.answers) >= NQ) { st.stage = count(st.picks) ? 's' : 'bridge'; }
      else { st.stage = 'q'; var firstGap = 0; while (firstGap < NQ - 1 && st.answers[firstGap] != null) firstGap++; st.q = firstGap; }
      render(true);
    } else if (act === 'restart') {
      st = fresh(); render(true);
    } else if (act === 'answer') {
      var v = b.getAttribute('data-v');
      st.answers[st.q] = v === 'x' ? 'x' : Number(v);
      app.querySelectorAll('[data-a="answer"]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      save();
      setTimeout(function () { if (st.q < NQ - 1) st.q++; else st.stage = 'bridge'; render(true); }, 180);
    } else if (act === 'back') {
      if (st.stage === 'q') { if (st.q === 0) st.stage = 'intro'; else st.q--; }
      else if (st.stage === 'bridge') { st.stage = 'q'; st.q = NQ - 1; }
      else if (st.stage === 's') { if (st.s === 0) st.stage = 'bridge'; else st.s--; }
      render(true);
    } else if (act === 'toScenarios') {
      st.stage = 's'; render(true);
    } else if (act === 'pick') {
      st.picks[st.s] = Number(b.getAttribute('data-v'));
      app.querySelectorAll('[data-a="pick"]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      app.querySelector('.kf-follow').innerHTML = followHtml(S[st.s]);
      app.querySelector('[data-a="next"]').disabled = false;
      save();
    } else if (act === 'next') {
      if (st.s < NS - 1) { st.s++; render(true); }
      else { st.stage = 'results'; track('kingdom_first_finish'); render(true); }
    } else if (act === 'review') {
      st.stage = 'q'; st.q = 0; render(true);
    } else if (act === 'copy') {
      copyText(summaryText());
    } else if (act === 'print') {
      window.print();
    }
  });
  app.addEventListener('input', function (e) {
    var f = e.target.getAttribute('data-field');
    if (f) { st[f] = e.target.value.slice(0, 2000); save(); }
  });
  app.addEventListener('change', function (e) {
    var d = e.target.getAttribute('data-day');
    if (d == null) return;
    if (e.target.checked) st.done[d] = 1; else delete st.done[d];
    save();
    var p = document.getElementById('kfDaysDone'); if (p) p.textContent = daysDone();
  });

  render(false);
})();
