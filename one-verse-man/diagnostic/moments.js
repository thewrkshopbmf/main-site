/* Are You Missing Your Moments? — private self-reflection.
   Answers stay in this browser tab (sessionStorage) and are never sent anywhere.
   Analytics only records that the reflection was started and finished. */
(function () {
  'use strict';

  var SECTIONS = [
    { title: 'Pace & Presence', verse: 'Luke 10:38–42',
      questions: [
        'I often treat interruptions as obstacles before considering the person behind them.',
        'People close to me receive my leftover attention rather than my intentional presence.',
        'I use being busy to justify postponing important relational responsibilities.',
        'When someone needs me unexpectedly, my first internal response is often resentment.',
        'I rarely create unhurried space to listen, reflect, or pray.'
      ],
      prompt: 'Where has hurry displaced attentiveness? Choose one realistic opportunity to slow down.' },
    { title: 'Attention & Awareness', verse: 'James 1:22–25',
      questions: [
        'I frequently consume meaningful teaching without identifying what I will do differently.',
        'I reach for digital stimulation when I encounter uncomfortable thoughts or emotions.',
        'I sometimes miss emotional cues because my mind is elsewhere.',
        'I forget convictions that felt important because I do not revisit them.',
        'I find it difficult to be fully present without checking something else.'
      ],
      prompt: 'What truth have you heard repeatedly but not practiced? Choose one concrete application.' },
    { title: 'Pride & Selective Obedience', verse: 'Philippians 2:3–8',
      questions: [
        'I am more enthusiastic about visible contributions than unnoticed service.',
        'I resist correction when it comes from someone I do not particularly respect.',
        'I sometimes dismiss responsibilities that feel beneath my abilities.',
        'I am more willing to help when my contribution will be appreciated.',
        'I can defend my intentions instead of acknowledging the impact of my actions.'
      ],
      prompt: 'Where has recognition or self-protection become a condition of service?' },
    { title: 'Fear & Avoidance', verse: 'Galatians 1:10',
      questions: [
        'I postpone necessary conversations because I fear the reaction.',
        'I have allowed a relationship to deteriorate rather than initiate an uncomfortable repair.',
        'I sometimes seek repeated reassurance when I already understand the responsible next step.',
        'I withhold honest words because I want to preserve how others see me.',
        'I often tell myself I will act later without choosing a specific time.'
      ],
      prompt: 'Which safe and appropriate conversation or action have you delayed out of fear?' },
    { title: 'Comfort & Self-Preoccupation', verse: 'Philippians 2:4',
      questions: [
        'I evaluate others’ needs primarily through how much they will disrupt my plans.',
        'When I am stressed, I become less curious about what others are experiencing.',
        'I am reluctant to sacrifice comfort for a responsibility that offers little personal reward.',
        'I sometimes resent people for needing things they have a legitimate reason to ask of me.',
        'My own disappointments occupy so much attention that I overlook opportunities to encourage others.'
      ],
      prompt: 'How might you consider someone else’s legitimate need while maintaining wise boundaries?' },
    { title: 'Honesty & Repentance', verse: 'Psalm 139:23–24; James 5:16',
      questions: [
        'When confronted, I usually explain myself before listening fully.',
        'I find it difficult to apologize without adding a defense or qualification.',
        'I can identify others’ faults more quickly than my contribution to a conflict.',
        'I sometimes confuse feeling remorseful with actually making a change.',
        'I avoid accountability when I suspect someone will challenge a cherished habit.'
      ],
      prompt: 'What would an unqualified apology, repair, or honest accountability look like?' },
    { title: 'Dependence & Discernment', verse: 'John 15:4–5; Proverbs 3:5–6',
      questions: [
        'I make important decisions without seriously considering biblical wisdom or prayer.',
        'I sometimes use spiritual language to justify a decision I have already made.',
        'I rely on my competence while neglecting my dependence on God.',
        'I have difficulty distinguishing genuine responsibility from my desire to control outcomes.',
        'I measure my spiritual progress more by activity or recognition than by love, obedience, and Christlike character.'
      ],
      prompt: 'Where do you need to replace control or religious activity with prayerful dependence and wise action?' }
  ];

  var LABELS = ['Rarely', 'Occasionally', 'Sometimes', 'Often', 'Almost always'];
  var PER = 5;
  var TOTAL = SECTIONS.length * PER;
  var STORE_KEY = 'tws.moments.v1';

  var state = { screen: 'cover', page: 0, answers: new Array(TOTAL).fill(null), commitment: '' };

  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function track(name) { try { if (window.gtag) window.gtag('event', name); } catch (e) {} }
  function answeredCount() { return state.answers.filter(function (x) { return x !== null; }).length; }

  /* ---------- storage (this tab only) ---------- */
  function save() {
    try { sessionStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
  }
  function load() {
    try {
      var raw = sessionStorage.getItem(STORE_KEY);
      if (!raw) return false;
      var s = JSON.parse(raw);
      if (!s || !Array.isArray(s.answers) || s.answers.length !== TOTAL) return false;
      state.answers = s.answers.map(function (v) { return (v >= 1 && v <= 5) ? Number(v) : null; });
      state.page = Math.min(Math.max(Number(s.page) || 0, 0), SECTIONS.length - 1);
      state.commitment = typeof s.commitment === 'string' ? s.commitment : '';
      state.screen = ['cover', 'intro', 'quiz', 'results'].indexOf(s.screen) >= 0 ? s.screen : 'cover';
      return true;
    } catch (e) { return false; }
  }
  function clearStore() { try { sessionStorage.removeItem(STORE_KEY); } catch (e) {} }

  /* ---------- screens ---------- */
  var SCREEN_IDS = { cover: 'mmCover', intro: 'mmIntro', quiz: 'mmQuiz', results: 'mmResults' };
  function show(name, focusId) {
    state.screen = name;
    Object.keys(SCREEN_IDS).forEach(function (k) {
      $(SCREEN_IDS[k]).classList.toggle('is-active', k === name);
    });
    save();
    window.scrollTo(0, 0);
    if (focusId) { var el = $(focusId); if (el) el.focus({ preventScroll: true }); }
  }

  /* ---------- quiz ---------- */
  function updateProgress() {
    var n = answeredCount();
    $('mmStepLabel').textContent = 'Area ' + (state.page + 1) + ' of ' + SECTIONS.length;
    $('mmCount').textContent = n + ' of ' + TOTAL + ' answered';
    $('mmProgressFill').style.width = (n / TOTAL * 100) + '%';
  }

  function renderPage() {
    var s = SECTIONS[state.page];
    $('mmSectionTitle').textContent = s.title;
    $('mmSectionVerse').textContent = 'Explore: ' + s.verse;
    $('mmQuestions').innerHTML = s.questions.map(function (q, j) {
      var ix = state.page * PER + j;
      var choices = [1, 2, 3, 4, 5].map(function (n) {
        return '<label class="mm-choice" title="' + LABELS[n - 1] + '">' +
          '<input type="radio" name="q' + ix + '" value="' + n + '"' + (state.answers[ix] === n ? ' checked' : '') + '>' +
          '<span aria-hidden="true">' + n + '</span><span class="mm-sr">' + n + ', ' + LABELS[n - 1] + '</span></label>';
      }).join('');
      return '<fieldset class="mm-q" id="mmQ' + ix + '">' +
        '<legend><span class="mm-q-num">' + (ix + 1) + '.</span> ' + esc(q) + '</legend>' +
        '<div class="mm-choices">' + choices + '</div>' +
        '<div class="mm-ends" aria-hidden="true"><span>Rarely</span><span>Almost always</span></div>' +
        '</fieldset>';
    }).join('');
    $('mmBack').disabled = state.page === 0;
    $('mmNext').textContent = state.page === SECTIONS.length - 1 ? 'See my results →' : 'Next section →';
    $('mmError').textContent = '';
    updateProgress();
  }

  function onAnswer(e) {
    var t = e.target;
    if (!t || t.type !== 'radio') return;
    var ix = Number(t.name.slice(1));
    state.answers[ix] = Number(t.value);
    var fs = $('mmQ' + ix);
    if (fs) fs.classList.remove('is-missing');
    updateProgress();
    save();
  }

  function next() {
    var start = state.page * PER;
    var missing = [];
    for (var i = start; i < start + PER; i++) if (state.answers[i] === null) missing.push(i);
    document.querySelectorAll('.mm-q.is-missing').forEach(function (el) { el.classList.remove('is-missing'); });
    if (missing.length) {
      missing.forEach(function (i) { var el = $('mmQ' + i); if (el) el.classList.add('is-missing'); });
      $('mmError').textContent = 'Please answer all five statements in this section before continuing.';
      var first = $('mmQ' + missing[0]);
      if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (state.page === SECTIONS.length - 1) { showResults(); return; }
    state.page++;
    renderPage();
    show('quiz', 'mmSectionTitle');
  }

  function back() {
    if (state.page === 0) return;
    state.page--;
    renderPage();
    show('quiz', 'mmSectionTitle');
  }

  /* ---------- results ---------- */
  function scoreSections() {
    return SECTIONS.map(function (s, i) {
      var vals = state.answers.slice(i * PER, i * PER + PER);
      var score = vals.reduce(function (a, b) { return a + b; }, 0);
      return { title: s.title, verse: s.verse, prompt: s.prompt, score: score, order: i };
    }).sort(function (a, b) { return b.score - a.score || a.order - b.order; });
  }

  function band(score) {
    // Average answer for the area, as a word from the rating scale.
    return LABELS[Math.min(4, Math.max(0, Math.round(score / PER) - 1))];
  }

  function showResults() {
    var scored = scoreSections();
    var top = scored[0].score;
    var tied = scored.filter(function (s) { return s.score === top; });

    $('mmScores').innerHTML = scored.map(function (s) {
      var pct = (s.score - PER) / (PER * 4) * 100; // 5 = empty bar, 25 = full bar
      return '<div class="mm-score' + (s.score === top ? ' is-top' : '') + '">' +
        '<div class="mm-score-head"><strong>' + esc(s.title) + '</strong>' +
        '<span>' + s.score + '/25 · usually “' + band(s.score).toLowerCase() + '”</span></div>' +
        '<div class="mm-bar" role="img" aria-label="' + esc(s.title) + ': ' + s.score + ' out of 25">' +
        '<div class="mm-fill" style="width:' + pct.toFixed(1) + '%"></div></div></div>';
    }).join('');

    var allEven = tied.length === SECTIONS.length;
    var lead = '';
    if (allEven) {
      lead = '<p>Your scores came out even across all seven areas. Look over the list above and start with the one where a real situation comes to mind first.</p>';
    } else if (tied.length > 1) {
      lead = '<p>' + tied.length + ' areas are tied for your highest score. Choose the one where you can see the clearest practical next step.</p>';
    }
    var low = top <= 10
      ? '<p>None of these patterns showed up often for you this month. That is worth thanking God for. Still, ask whether any of these areas fits a real situation from this week.</p>'
      : '';

    var focus = (allEven ? [] : tied).map(function (s) {
      return '<div class="mm-focus-item">' +
        (tied.length > 1 ? '<h4>' + esc(s.title) + '</h4>' : '') +
        '<p>' + esc(s.prompt) + '</p>' +
        '<p class="mm-focus-verse"><strong>Scripture to study:</strong> ' + esc(s.verse) + '</p></div>';
    }).join('');

    $('mmReflection').innerHTML =
      '<div class="mm-focus">' +
        '<span class="mm-label mm-label--flat">Your starting point</span>' +
        '<h3 class="mm-h3">' + (allEven ? 'Choose your starting point' : tied.length > 1 ? 'Your top areas' : 'Start with ' + esc(tied[0].title)) + '</h3>' +
        low + lead + focus +
        '<p class="mm-reflect"><strong>Reflect:</strong> What happened? What did I interpret? What desire or fear was active? What would wise, loving faithfulness require?</p>' +
      '</div>';

    $('mmCommitment').value = state.commitment;
    $('mmPrintDate').textContent = 'Completed ' + new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

    if (state.screen !== 'results') track('moments_reflection_complete');
    show('results', 'mmResultsTitle');
  }

  function reportText() {
    var scored = scoreSections();
    var top = scored[0].score;
    var tied = scored.filter(function (s) { return s.score === top; });
    var lines = [
      'ARE YOU MISSING YOUR MOMENTS? — PRIVATE REFLECTION',
      'TheWrkShop · thewrkshop.com/one-verse-man/diagnostic/',
      'Completed ' + new Date().toLocaleDateString(),
      '',
      'Scores (higher = shows up more often):'
    ];
    scored.forEach(function (s) { lines.push('- ' + s.title + ': ' + s.score + '/25 (' + s.verse + ')'); });
    lines.push('');
    lines.push(tied.length > 1 ? 'Top areas (tied):' : 'Start with:');
    tied.forEach(function (s) { lines.push('- ' + s.title + ': ' + s.prompt); });
    lines.push('');
    lines.push('My next step: ' + ($('mmCommitment').value.trim() || '(not written yet)'));
    lines.push('');
    lines.push('Scores describe self-reported patterns, not diagnoses or spiritual worth.');
    return lines.join('\n');
  }

  function download() {
    var blob = new Blob([reportText()], { type: 'text/plain;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'missing-your-moments-reflection.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }

  function restart() {
    if (answeredCount() > 0 && !window.confirm('Clear your answers and start over?')) return;
    state = { screen: 'cover', page: 0, answers: new Array(TOTAL).fill(null), commitment: '' };
    clearStore();
    $('mmCommitment').value = '';
    $('mmResumeNote').hidden = true;
    show('cover', 'mmCoverTitle');
  }

  /* ---------- wire up ---------- */
  function begin() { show('intro', 'mmIntroTitle'); }

  $('mmCoverBtn').addEventListener('click', function () {
    if (answeredCount() > 0) { state.page = 0; }
    begin();
  });
  $('mmResumeBtn').addEventListener('click', function () {
    if (answeredCount() === TOTAL) { showResults(); return; }
    renderPage();
    show('quiz', 'mmSectionTitle');
  });
  $('mmIntroBack').addEventListener('click', function () { show('cover', 'mmCoverTitle'); });
  $('mmIntroStart').addEventListener('click', function () {
    if (answeredCount() === 0) track('moments_reflection_start');
    renderPage();
    show('quiz', 'mmSectionTitle');
  });
  $('mmQuestions').addEventListener('change', onAnswer);
  $('mmNext').addEventListener('click', next);
  $('mmBack').addEventListener('click', back);
  $('mmPrint').addEventListener('click', function () { window.print(); });
  $('mmDownload').addEventListener('click', download);
  $('mmEdit').addEventListener('click', function () {
    state.page = SECTIONS.length - 1;
    renderPage();
    show('quiz', 'mmSectionTitle');
  });
  $('mmRestart').addEventListener('click', restart);
  $('mmCommitment').addEventListener('input', function (e) { state.commitment = e.target.value; save(); });

  // Restore an in-progress reflection after a refresh (same tab only).
  if (load()) {
    if (state.screen === 'results' && answeredCount() === TOTAL) { showResults(); }
    else if (state.screen === 'quiz') { renderPage(); show('quiz'); }
    else if (answeredCount() > 0) { $('mmResumeNote').hidden = false; show('cover'); }
    else { show(state.screen); }
  }
})();
