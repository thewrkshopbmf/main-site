/* What's Feeding It? The Anatomy of Lust self-check.
   24 frequency reflections across six root systems + "when does it hit?" windows,
   then a reflection, guardrails, a seven-day path for the top root and a prayer.
   Everything a person enters stays in this browser tab (sessionStorage) and is never sent to a server.
   Google Analytics receives start/finish counts only, never answers. */
(function () {
  'use strict';
  var KEY = 'tws.whatfeedsit.v1';
  var app = document.getElementById('wfApp');
  if (!app) return;

  /* ---------- content ---------- */
  var ROOTS = [
    { name: 'The Eyes & the Imagination', verse: 'Matthew 6:22–23',
      hunger: 'Stimulation and escape.',
      lie: '“It’s just a look. It doesn’t hurt anything.”',
      truth: 'In Matthew 6, Jesus puts the eye between treasure and masters on purpose. What you keep looking at shapes what you treasure, and what you treasure becomes your master. For Eve, Achan and David, the look came before the fall.',
      guard: 'Decide where your eyes go before the moment comes. Filters on every device, the phone out of the bedroom, and your own covenant with your eyes (Job 31:1).',
      days: [['Matthew 6:19–24', 'Read it slowly. Write down what you have been looking at most this week.'],
        ['Job 31:1', 'Make your own covenant with your eyes. Write it in one sentence.'],
        ['Psalm 119:37', 'Delete or block one app, account or habit that feeds your eyes.'],
        ['2 Samuel 11:1–4', 'Notice where David’s fall began. Name your own “rooftop.”'],
        ['Philippians 4:8', 'Choose one thing to fill your mind with today instead.'],
        ['Proverbs 4:23–27', 'Set one boundary for your phone at night and keep it.'],
        ['2 Corinthians 3:18', 'Look back on the week: what changed when you changed what you looked at?']] },
    { name: 'Pain & Pressure', verse: 'Matthew 11:28–30',
      hunger: 'Relief and comfort.',
      lie: '“I deserve something to take the edge off.”',
      truth: 'Often it isn’t pleasure you’re after. It’s numbness. When pain goes unhealed long enough, the flesh settles for anesthesia. Jesus doesn’t offer a numbing agent. He offers rest for your soul.',
      guard: 'Have a plan for hard days before they come: who you’ll call, where you’ll go, and what you’ll do instead of being alone with a screen.',
      days: [['Matthew 11:28–30', 'Name the pain or pressure you most often try to numb.'],
        ['Psalm 34:18', 'Tell God honestly how that pain feels. Write it as a prayer.'],
        ['Psalm 62:8', 'Pour out your heart to Him before you reach for relief.'],
        ['Isaiah 61:1–3', 'Ask God where an old wound still needs His healing.'],
        ['1 Peter 5:7', 'Plan a healthy way to come down after a hard day, and use it.'],
        ['James 5:16', 'Tell one trusted man about the pressure you’re under.'],
        ['Psalm 23', 'Review the week: where did you find real rest instead of relief?']] },
    { name: 'Loneliness & the Love Deficit', verse: 'Genesis 2:18',
      hunger: 'Intimacy, acceptance and being wanted.',
      lie: '“No one would understand, so I’ll handle it alone.”',
      truth: 'Many men are not addicted to pleasure. They are starving for intimacy, safety, affection, rest and belonging. The flesh steps in where love wounds remain unhealed. Adam’s first recorded lack wasn’t work, money or power. It was being alone.',
      guard: 'Get known. Tell one trusted brother the truth and set a weekly check-in.',
      days: [['Genesis 2:18', 'Name the ways you’ve been carrying this alone.'],
        ['Psalm 68:6', 'Ask God to place you with brothers who will really know you.'],
        ['Ecclesiastes 4:9–12', 'Choose one man you could trust with the truth.'],
        ['James 5:16', 'Tell him one true thing this week.'],
        ['1 John 4:18', 'Notice where the fear of being known keeps you hiding.'],
        ['Romans 8:38–39', 'Write down, “Nothing can separate me from the love of God,” and read it aloud.'],
        ['Hebrews 10:24–25', 'Set a weekly check-in with a brother, or join a group.']] },
    { name: 'Boredom & No Mission', verse: '2 Samuel 11:1',
      hunger: 'Purpose and something worth fighting for.',
      lie: '“I’ve got nothing better to do.”',
      truth: 'David fell in the spring, “at the time when kings go off to war,” while he stayed home. Idle hours with no mission are fertile ground. A man with nothing to build will find something to consume.',
      guard: 'Fill your empty hours on purpose: a plan for evenings and weekends, and one way to serve someone this week.',
      days: [['2 Samuel 11:1', 'Name the idle hours when you’re most vulnerable.'],
        ['Ephesians 5:15–16', 'Plan tonight and this weekend before they arrive.'],
        ['Exodus 4:2', 'List what’s already in your hand that God could use.'],
        ['Galatians 6:9–10', 'Do one good thing for someone this week.'],
        ['Colossians 3:23', 'Start one project worth building.'],
        ['Proverbs 6:6–11', 'Replace one hour of screens with something that builds.'],
        ['Matthew 25:21', 'Review the week: where did purpose push temptation out?']] },
    { name: 'Identity, Pride & Entitlement', verse: '1 John 2:15–17',
      hunger: 'Significance, control and feeling wanted.',
      lie: '“I’ve earned this,” or, “This is just who I am.”',
      truth: 'Lust can offer a feeling of being chosen, powerful or in control, especially when you feel overlooked or right after you’ve succeeded. Your identity is settled in Christ. It isn’t proven by what you can take, and this struggle isn’t who you are.',
      guard: 'Watch the highs as closely as the lows: after a win, after being overlooked, and whenever you feel owed.',
      days: [['1 John 2:15–17', 'Name what lust promises to make you feel: wanted, powerful, in control or rewarded.'],
        ['Galatians 2:20', 'Write down who you are in Christ in one sentence.'],
        ['Proverbs 16:18', 'Notice where pride or entitlement whispers, “I deserve this.”'],
        ['Philippians 2:3–8', 'Serve someone this week without being noticed.'],
        ['2 Corinthians 10:12', 'Stop one comparison habit this week.'],
        ['Romans 12:1–2', 'Offer your body to God as worship today, in one specific way.'],
        ['1 Peter 2:9', 'Review the week: where did knowing whose you are change a choice?']] },
    { name: 'Drift & Weak Defenses', verse: 'Proverbs 4:23',
      hunger: 'Ease and the path of least resistance.',
      lie: '“I’ll get back on track next week.”',
      truth: 'Most falls aren’t sudden. Time with God thins out, boundaries slip, and you stop counting the cost. By the time the temptation comes, the wall was already down.',
      guard: 'Rebuild the wall in advance: a daily time with God, written boundaries, and one man with permission to ask how you’re really doing.',
      days: [['Proverbs 4:23', 'Name the boundaries that have slipped.'],
        ['Revelation 2:4–5', 'Remember what your walk with God looked like when it was strong. Do one of those things today.'],
        ['Psalm 5:3', 'Set a daily time with God and keep it for the rest of the week.'],
        ['Luke 14:28', 'Write down what this struggle could cost you if nothing changes.'],
        ['Romans 13:14', 'Put back one guardrail: a filter, a phone rule or an accountability partner.'],
        ['Hebrews 3:13', 'Give one brother permission to ask you hard questions.'],
        ['Galatians 6:7–9', 'Review the week: what did you sow, and what are you starting to reap?']] }
  ];
  var Q = [
    [0, 'I let my eyes linger on images or people longer than I know I should.'],
    [0, 'Scrolling social media or videos leads me toward things I didn’t set out to look at.'],
    [0, 'My mind replays images or fantasies when I’m not doing anything else.'],
    [0, 'It takes more than it used to for the same pull.'],
    [1, 'I turn to it after a stressful or exhausting day to come down.'],
    [1, 'It’s how I avoid feeling something painful, like hurt, anger, fear or shame.'],
    [1, 'Old hurts from my past still affect how I feel about myself.'],
    [1, 'When I feel rejected or criticized, the pull gets stronger.'],
    [2, 'No one really knows what I’m struggling with.'],
    [2, 'I feel lonely, even around people who care about me.'],
    [2, 'I feel unwanted or unseen in my closest relationship.'],
    [2, 'I don’t have a brother I would call when I’m being tempted.'],
    [3, 'It happens most when I have idle time with nothing planned.'],
    [3, 'I feel like I lack a clear purpose or mission right now.'],
    [3, 'Evenings and weekends feel empty or aimless.'],
    [3, 'I spend hours on screens that leave me feeling worse, not rested.'],
    [4, 'After a big win or a hard-earned success, I feel I’ve earned a reward.'],
    [4, 'I compare my life, marriage or body with other men’s and come up short.'],
    [4, 'It gives me a feeling of being wanted, powerful or in control.'],
    [4, 'Part of me believes this is just who I am and won’t change.'],
    [5, 'My time with God has thinned out over the past few months.'],
    [5, 'I’ve let boundaries slip that I once kept, like filters or phone rules.'],
    [5, 'I rarely think about what this could cost me, my family or my walk with God.'],
    [5, 'I tell myself I’ll deal with it later.']
  ];
  var FREQ = ['Rarely or never', 'Sometimes', 'Often', 'Almost always'];
  var NOT_SURE = 'Not sure / doesn’t apply';
  var WINDOWS = [
    ['Late at night when I’m tired', 'Set a hard stop: the phone charges outside the bedroom by a set time.'],
    ['Alone with my phone or computer', 'Use devices in shared spaces when you can, and keep filters on.'],
    ['After an argument, rejection or criticism', 'Call or text a brother before you’re alone.'],
    ['After a stressful or exhausting day', 'Plan a real way to come down: a walk, a workout, prayer or sleep.'],
    ['When I’m bored or have nothing planned', 'Put something on the calendar for empty evenings.'],
    ['Traveling or away from home', 'Tell someone your travel dates and check in each night.'],
    ['After a big win or celebration', 'Celebrate with people, not alone.'],
    ['After drinking', 'Decide your limit beforehand, and don’t be alone with a screen afterward.'],
    ['Weekends or days off', 'Plan your days off with purpose and people.']
  ];
  var NQ = Q.length;

  /* ---------- helpers ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function track(name) { try { if (window.gtag) window.gtag('event', name); } catch (e) {} }
  function bible(ref) { return 'https://www.biblegateway.com/passage/?search=' + encodeURIComponent(ref.replace(/–/g, '-')) + '&version=NIV'; }
  function refLink(ref) { return '<a href="' + bible(ref) + '" target="_blank" rel="noopener">' + esc(ref) + '</a>'; }
  function fresh() { return { stage: 'intro', q: 0, answers: {}, windows: {}, brother: '', step: '', done: {} }; }
  var st;
  try { st = JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch (e) { st = null; }
  if (!st || typeof st !== 'object' || !st.answers) st = fresh();
  if (!st.done) st.done = {};
  if (!st.windows) st.windows = {};
  function save() { try { sessionStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  function clearAll() { try { sessionStorage.removeItem(KEY); } catch (e) {} st = fresh(); }
  function count(o) { return Object.keys(o).length; }
  function focusTop() {
    var h = app.querySelector('h2, .pt-legend');
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    app.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---------- scoring ---------- */
  function profile() {
    return ROOTS.map(function (r, i) {
      var vals = [];
      Q.forEach(function (q, qi) { var v = st.answers[qi]; if (q[0] === i && typeof v === 'number') vals.push(v); });
      var mean = vals.length >= 2 ? vals.reduce(function (x, y) { return x + y; }, 0) / vals.length : null;
      return { i: i, n: vals.length, mean: mean };
    });
  }
  function label(mean) {
    if (mean === null) return 'Not enough answers to read';
    return mean >= 2 ? 'Likely feeding it' : mean >= 1 ? 'Worth watching' : 'Not often reported';
  }
  function ranked() {
    return profile().filter(function (r) { return r.mean !== null; })
      .sort(function (a, b) { return b.mean - a.mean || a.i - b.i; });
  }
  function topRoots() {
    var r = ranked();
    var tops = r.filter(function (x) { return x.mean >= 1; }).slice(0, 2).map(function (x) { return x.i; });
    return tops;
  }

  /* ---------- views ---------- */
  function intro() {
    var resume = count(st.answers) > 0;
    return '<h2 class="pt-h2">Not a verdict. A map.</h2>' +
      '<p>Most men try to beat lust at the moment of temptation, and most men lose that fight. This self-check looks upstream, at what may be feeding it, so you know where to fight.</p>' +
      '<p>Many men are not addicted to pleasure. They are starving for intimacy, safety, rest and belonging, and the flesh steps in where those needs go unmet. Answer honestly about the last few months. You are not beyond God’s mercy.</p>' +
      '<ul class="wf-facts"><li><strong>Part one:</strong> 24 short statements</li><li><strong>Part two:</strong> when it tends to hit</li><li><strong>Time:</strong> about 6–8 minutes</li><li><strong>Private:</strong> nothing is saved or sent anywhere</li></ul>' +
      '<p class="pt-muted pt-small">You can mark any statement “Not sure / doesn’t apply.” Your results describe what you reported. They aren’t a diagnosis, a score or a measure of your faith.</p>' +
      '<div class="pt-actions">' +
        '<button type="button" class="pt-btn pt-btn--ember" data-a="start">' + (resume ? 'Continue where I left off' : 'Begin the self-check →') + '</button>' +
        (resume ? '<button type="button" class="pt-btn pt-btn--ghost" data-a="restart">Start over</button>' : '') +
      '</div>';
  }

  function question() {
    var q = Q[st.q], cur = st.answers[st.q];
    var opts = FREQ.map(function (l, v) { return [l, v]; }).concat([[NOT_SURE, 'x']]);
    return '<div class="pt-tool-top"><span class="pt-count">Part one · ' + (st.q + 1) + ' of ' + NQ + '</span><span class="pt-count">' + count(st.answers) + ' answered</span></div>' +
      '<div class="pt-track" aria-hidden="true"><div style="width:' + Math.round(st.q / NQ * 100) + '%"></div></div>' +
      '<p class="wf-prompt">Over the past few months, how often has this been true for you?</p>' +
      '<fieldset class="pt-fieldset"><legend class="pt-legend">' + esc(q[1]) + '</legend>' +
        opts.map(function (o) {
          return '<button type="button" class="pt-option' + (o[1] === 'x' ? ' wf-notsure' : '') + '" data-a="answer" data-v="' + o[1] + '" aria-pressed="' + (String(cur) === String(o[1])) + '">' + esc(o[0]) + '</button>';
        }).join('') +
      '</fieldset>' +
      '<div class="pt-actions"><button type="button" class="pt-btn pt-btn--ghost" data-a="back">← Back</button></div>';
  }

  function windows() {
    return '<div class="pt-tool-top"><span class="pt-count">Part two · When does it hit?</span></div>' +
      '<div class="pt-track" aria-hidden="true"><div style="width:100%"></div></div>' +
      '<h2 class="pt-h2">When does it tend to hit?</h2>' +
      '<p>Check every situation that’s been true in the last few months. These become your guardrails.</p>' +
      '<div role="group" aria-label="Situations">' +
        WINDOWS.map(function (w, i) {
          return '<label class="wf-check"><input type="checkbox" data-win="' + i + '"' + (st.windows[i] ? ' checked' : '') + '><span>' + esc(w[0]) + '</span></label>';
        }).join('') +
      '</div>' +
      '<div class="pt-actions">' +
        '<button type="button" class="pt-btn pt-btn--ghost" data-a="back">← Back</button>' +
        '<button type="button" class="pt-btn pt-btn--ember" data-a="finish">See what may be feeding it →</button>' +
      '</div>';
  }

  function deep(i, n) {
    var r = ROOTS[i];
    return '<div class="wf-result is-top"><span class="pt-label">' + (n === 0 ? 'Most likely feeding it' : 'Also feeding it') + '</span>' +
      '<h3>' + esc(r.name) + '</h3>' +
      '<dl class="wf-deep">' +
        '<dt>What it’s really hungry for</dt><dd>' + esc(r.hunger) + '</dd>' +
        '<dt>The lie it tells</dt><dd>' + esc(r.lie) + '</dd>' +
        '<dt>The truth</dt><dd>' + esc(r.truth) + '</dd>' +
        '<dt>Your guardrail</dt><dd>' + esc(r.guard) + '</dd>' +
      '</dl>' +
      '<p class="pt-small pt-muted">Scripture: ' + refLink(r.verse) + '</p></div>';
  }

  function results() {
    var prof = profile(), tops = topRoots();
    var html = '<div class="wf-output">' +
      '<span class="pt-eyebrow">Your private results</span>' +
      '<h2 class="pt-h2">What may be feeding it</h2>' +
      '<p class="pt-muted">These are the roots you reported most often. They’re a place to start praying and fighting, not a label on who you are.</p>';

    if (tops.length) html += tops.map(deep).join('');
    else html += '<div class="pt-callout"><p>You didn’t report any root as happening often. That may be good news, or the struggle may be showing up somewhere this self-check doesn’t reach. Read ' + refLink('Matthew 6:19–24') + ' and ask God to show you what you can’t see yet.</p></div>';

    html += '<h3 class="pt-h3 wf-gap">All six root systems</h3>' +
      prof.map(function (r) {
        var a = ROOTS[r.i];
        return '<div class="wf-result' + (tops.indexOf(r.i) > -1 ? ' is-top' : '') + '">' +
          '<h3>' + esc(a.name) + '<span>' + esc(label(r.mean)) + '</span></h3>' +
          (r.mean !== null ? '<div class="pt-bar" role="img" aria-label="' + esc(a.name + ': ' + label(r.mean)) + '"><div style="width:' + Math.max(3, Math.round(r.mean / 3 * 100)) + '%"></div></div>' : '') +
          '<p class="pt-small">Hungry for: ' + esc(a.hunger) + ' · ' + refLink(a.verse) + '</p>' +
        '</div>';
      }).join('');

    var wins = WINDOWS.filter(function (w, i) { return st.windows[i]; });
    html += '<h3 class="pt-h3 wf-gap">Your danger windows</h3>' +
      (wins.length ? wins.map(function (w) { return '<div class="wf-window"><strong>' + esc(w[0]) + '</strong>' + esc(w[1]) + '</div>'; }).join('')
        : '<p class="pt-muted">You didn’t check any situations. If you notice a pattern this week, come back and add it.</p>');

    var start = tops.length ? tops[0] : 5;
    html += '<h3 class="pt-h3 wf-gap">A seven-day path: ' + esc(ROOTS[start].name) + '</h3>' +
      '<p class="pt-muted pt-small">One day at a time. Read the passage, pray honestly and take the step. Check off a day when it’s done.</p>' +
      '<ol class="pt-days wf-days">' + ROOTS[start].days.map(function (d, i) {
        return '<li><label><input type="checkbox" data-day="' + i + '"' + (st.done[i] ? ' checked' : '') + '><span class="pt-day-num">Day ' + (i + 1) + '</span>' +
          '<span class="pt-day-text"><strong>' + refLink(d[0]) + '</strong><br>' + esc(d[1]) + '</span></label></li>';
      }).join('') + '</ol>' +
      '<p class="pt-progress" id="wfDaysDone" aria-live="polite">' + daysDone() + '</p>';

    html += '<h3 class="pt-h3 wf-gap">Bring it into the light</h3>' +
      '<p>Freedom grows in the light. You don’t get clean in order to come to God and to a brother. You come to get clean (' + refLink('James 5:16') + ').</p>' +
      '<div class="pt-field"><label for="wfBrother">One man I will tell the truth to this week</label><textarea id="wfBrother" data-field="brother" maxlength="500" placeholder="A first name is enough…">' + esc(st.brother) + '</textarea></div>' +
      '<div class="pt-field"><label for="wfStep">The one guardrail I’m putting in place first</label><textarea id="wfStep" data-field="step" maxlength="1000" placeholder="For example: my phone charges in the kitchen by 10pm…">' + esc(st.step) + '</textarea></div>' +
      '<div class="pt-actions pt-no-print">' +
        '<button type="button" class="pt-btn" data-a="copy">Copy my results</button>' +
        '<button type="button" class="pt-btn pt-btn--ghost" data-a="print">Print / save as PDF</button>' +
      '</div>' +
      '<p class="pt-feedback pt-no-print" id="wfFb" aria-live="polite"></p>';

    html += '<div class="wf-prayer"><span class="pt-label">A prayer to begin</span>' +
      '<p>Father, You see what I hide and You still call me Your son. Show me what my heart has really been hungry for, and meet that need Yourself. Guard my eyes, heal what’s wounded, and give me the courage to bring this into the light with a brother. There is no condemnation for those who are in Christ Jesus. Make me free. Amen.</p></div>';

    html += '<div class="wf-help"><strong>When to get more help</strong><ul>' +
      '<li>If it feels compulsive, or it’s hurting your marriage, work or sleep, talk with a pastor you trust and a licensed Christian counselor.</li>' +
      '<li>If anything you’ve viewed involves anyone under 18, stop now and get professional help immediately.</li>' +
      '<li>If you’re in crisis or thinking about hurting yourself, call or text 988 (US), or call 911 if you’re in danger.</li></ul></div>';

    html += '<div class="pt-callout pt-no-print"><p><strong>Keep going:</strong> read <a href="/questions/how-to-quit-porn-as-a-christian-man/">How do I quit porn for good?</a>, practice the pause in the <a href="/tools/interruption-lab/">Pattern Interruption Lab</a>, or <a href="/get-known.html">get known</a> and join an online men’s group.</p></div>' +
      '<div class="pt-actions pt-no-print">' +
        '<button type="button" class="pt-btn pt-btn--ghost" data-a="review">Review my answers</button>' +
        '<button type="button" class="pt-btn pt-btn--ghost" data-a="clear">Clear my answers</button>' +
      '</div>' +
      '<p class="pt-muted pt-small pt-no-print">Your answers stay in this browser tab only. Closing the tab or pressing “Clear my answers” erases them.</p>' +
    '</div>';
    return html;
  }
  function daysDone() { return count(st.done) + ' of 7 days done'; }

  function summaryText() {
    var prof = profile(), tops = topRoots();
    var lines = ['WHAT’S FEEDING IT? · MY PRIVATE RESULTS', 'TheWrkShop · thewrkshop.com/tools/what-feeds-it/', ''];
    tops.forEach(function (i, n) {
      var r = ROOTS[i];
      lines.push((n === 0 ? 'MOST LIKELY: ' : 'ALSO: ') + r.name.toUpperCase());
      lines.push('Hungry for: ' + r.hunger, 'The lie: ' + r.lie, 'Guardrail: ' + r.guard, 'Scripture: ' + r.verse, '');
    });
    lines.push('ALL SIX ROOTS');
    prof.forEach(function (r) { lines.push('- ' + ROOTS[r.i].name + ': ' + label(r.mean)); });
    var wins = WINDOWS.filter(function (w, i) { return st.windows[i]; });
    if (wins.length) { lines.push('', 'DANGER WINDOWS'); wins.forEach(function (w) { lines.push('- ' + w[0] + ' → ' + w[1]); }); }
    lines.push('', 'Who I’ll tell: ' + (st.brother.trim() || '(not written)'), 'First guardrail: ' + (st.step.trim() || '(not written)'), '',
      'A starting place for prayer and honest conversation, not a diagnosis.');
    return lines.join('\n');
  }

  function copyText(text) {
    var fb = document.getElementById('wfFb');
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
    document.body.classList.toggle('wf-has-results', st.stage === 'results');
    app.innerHTML = st.stage === 'q' ? question() : st.stage === 'w' ? windows() : st.stage === 'results' ? results() : intro();
    save();
    if (focus) focusTop();
  }

  app.addEventListener('click', function (e) {
    var b = e.target.closest('[data-a]');
    if (!b || b.disabled) return;
    var act = b.getAttribute('data-a');
    if (act === 'start') {
      if (!count(st.answers)) track('what_feeds_it_start');
      if (count(st.answers) >= NQ) st.stage = 'w';
      else { st.stage = 'q'; var g = 0; while (g < NQ - 1 && st.answers[g] != null) g++; st.q = g; }
      render(true);
    } else if (act === 'restart' || act === 'clear') {
      clearAll(); render(true);
    } else if (act === 'answer') {
      var v = b.getAttribute('data-v');
      st.answers[st.q] = v === 'x' ? 'x' : Number(v);
      app.querySelectorAll('[data-a="answer"]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      save();
      setTimeout(function () { if (st.q < NQ - 1) st.q++; else st.stage = 'w'; render(true); }, 180);
    } else if (act === 'back') {
      if (st.stage === 'q') { if (st.q === 0) st.stage = 'intro'; else st.q--; }
      else if (st.stage === 'w') { st.stage = 'q'; st.q = NQ - 1; }
      render(true);
    } else if (act === 'finish') {
      st.stage = 'results'; track('what_feeds_it_finish'); render(true);
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
    var w = e.target.getAttribute('data-win');
    if (w != null) { if (e.target.checked) st.windows[w] = 1; else delete st.windows[w]; save(); return; }
    var d = e.target.getAttribute('data-day');
    if (d == null) return;
    if (e.target.checked) st.done[d] = 1; else delete st.done[d];
    save();
    var p = document.getElementById('wfDaysDone'); if (p) p.textContent = daysDone();
  });

  render(false);
})();
