/* Steward or Owner? A private reflection on control, self-reliance and trust.
   15 owner-vs-steward pairs across five lenses, the Reflex Test, then the five-step
   Stewardship Shift on one specific burden, a reflection, a seven-day practice and a prayer.
   Everything a person enters stays in this browser tab (sessionStorage) and is never sent to a server.
   Google Analytics receives start/finish counts only, never answers. */
(function () {
  'use strict';
  var KEY = 'tws.stewardowner.v1';
  var app = document.getElementById('soApp');
  if (!app) return;

  /* ---------- content ---------- */
  var LENSES = [
    { name: 'Trust', verse: 'Proverbs 3:5–6',
      sentence: '“It’s all up to me.”',
      truth: 'Trust requires releasing the illusion of total control. That doesn’t mean passivity. A steward still works hard, plans wisely and shows up faithfully. He just doesn’t carry god-level pressure.',
      practice: 'Each time you catch yourself overthinking today, pray: “I trust You with what I can’t control.”' },
    { name: 'Identity', verse: 'Colossians 3:3',
      sentence: '“I am what I hold together.”',
      truth: 'When your worth is tied to outcomes, every outcome becomes a verdict on you. Your life is hidden with Christ in God. You can own your part without the result defining who you are.',
      practice: 'Hand one responsibility to someone else this week and let them do it their way.' },
    { name: 'Fear', verse: 'Matthew 6:34',
      sentence: '“If I don’t control it, it will fall apart.”',
      truth: 'Control is often fear disguised as responsibility. It feels safe, proactive and protective, but underneath it is fear that things will fail, people will disappoint you, or you’ll lose security.',
      practice: 'Name tomorrow’s worry, write down one wise step, then leave the rest with God for today.' },
    { name: 'Surrender', verse: 'Psalm 127:1–2',
      sentence: '“I’ll trust God once I’ve secured it.”',
      truth: 'You can believe in God and still live as if everything depends on you. Unless the Lord builds the house, the builders labor in vain. Rest isn’t falling behind. It’s a declaration that God is still working when you stop.',
      practice: 'Stop work at a set time tonight and rest as an act of trust.' },
    { name: 'Mercy', verse: 'Lamentations 3:22–23',
      sentence: '“God is waiting to make me pay.”',
      truth: 'Many men don’t doubt God exists. They doubt His posture toward them after failure. So they carry everything themselves, like spiritual debtors waiting for payment to come due, even though Christ has already paid the debt. There is now no condemnation for those who are in Christ Jesus.',
      practice: 'Read Romans 8:1 out loud each morning this week, and come back to God quickly the next time you fail.' }
  ];
  // [lens, owner statement, steward statement]
  var P = [
    [0, 'When things are uncertain, I assume it’s up to me to hold everything together.', 'When things are uncertain, I do my part and trust God with what I can’t control.'],
    [0, 'I find it hard to rest until I know how things will turn out.', 'I can rest even when the outcome isn’t settled yet.'],
    [0, 'If I loosen my grip, I fear something will fall apart.', 'I can loosen my grip without believing everything will collapse.'],
    [1, 'When something I’m responsible for fails, it feels like I failed as a man.', 'When something fails, I can own my part without it defining who I am.'],
    [1, 'I feel most valuable when I’m the one holding things together.', 'My worth is settled in Christ whether or not I’m needed.'],
    [1, 'I struggle to let others do things their way.', 'I can let others carry responsibility, even when they do it differently than I would.'],
    [2, 'I replay worst-case scenarios so I’m ready for them.', 'I plan wisely, then stop rehearsing what might go wrong.'],
    [2, 'Underneath my drive is a fear of losing security or control.', 'Underneath my effort is faithfulness, not fear.'],
    [2, 'I keep second-guessing decisions long after I’ve made them.', 'I make the best decision I can and leave the rest with God.'],
    [3, 'I pray about things, but I still carry them as if it all depends on me.', 'When I pray about something, I actually let go of it.'],
    [3, 'I usually decide first and ask God to bless it later.', 'I ask God before I decide, not just after.'],
    [3, 'Rest and Sabbath feel like falling behind.', 'Rest reminds me God is still working when I stop.'],
    [4, 'Part of me expects God to make me pay for my past mistakes.', 'I believe God is for me, even after I’ve failed.'],
    [4, 'After I mess up, I feel I have to earn my way back to God.', 'When I fail, I come back to God quickly because of His grace.'],
    [4, 'When hard things happen, I wonder if it’s payback for what I’ve done.', 'I don’t read every hardship as God punishing me.']
  ];
  var SCALE = ['Very much the first', 'A bit more the first', 'A bit more the second', 'Very much the second'];
  var REFLEX = [
    ['Tighten control', 'You grab the wheel harder. Control feels safe, but it’s often fear dressed up as responsibility.'],
    ['Overthink constantly', 'Your mind runs every scenario. Rehearsing outcomes feels like preparation, but it rarely brings peace.'],
    ['Carry everything internally', 'You hold it alone and say nothing. The weight stays hidden, so no one can help carry it.'],
    ['Trust God while stewarding faithfully', 'You do your part and leave the rest with God. Keep practicing this. It grows with every repetition.']
  ];
  var GRIPS = ['A relationship', 'My finances', 'My work or business', 'Success or reputation', 'My kids', 'My health', 'A future outcome', 'My ministry'];
  var DAYS = [
    ['Matthew 25:14–30', 'Notice that the servants never owned the resources. List what God has entrusted to you.'],
    ['Proverbs 3:5–6', 'Each time you start overthinking today, pray: “I trust You with what I can’t control.”'],
    ['Psalm 127:1–2', 'Stop work at a set time tonight. Rest as an act of trust.'],
    ['Matthew 6:25–34', 'Name tomorrow’s worry, then leave it with God for today.'],
    ['Luke 22:42', 'Pray “Not my will, but Yours” over the thing you’ve been gripping.'],
    ['1 Peter 4:10', 'Hand one responsibility to someone else and let them do it their way.'],
    ['Matthew 25:21', 'Look back on the week: where did faithfulness replace control?']
  ];
  var NP = P.length;

  /* ---------- helpers ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function track(name) { try { if (window.gtag) window.gtag('event', name); } catch (e) {} }
  function bible(ref) { return 'https://www.biblegateway.com/passage/?search=' + encodeURIComponent(ref.replace(/–/g, '-')) + '&version=NIV'; }
  function refLink(ref) { return '<a href="' + bible(ref) + '" target="_blank" rel="noopener">' + esc(ref) + '</a>'; }
  function fresh() { return { stage: 'intro', q: 0, answers: {}, reflex: null, grip: '', gripText: '', mode: '', mine: '', gods: '', prayed: false, faithful: '', done: {} }; }
  var st;
  try { st = JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch (e) { st = null; }
  if (!st || typeof st !== 'object' || !st.answers) st = fresh();
  if (!st.done) st.done = {};
  function save() { try { sessionStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  function clearAll() { try { sessionStorage.removeItem(KEY); } catch (e) {} st = fresh(); }
  function count(o) { return Object.keys(o).length; }
  function focusTop() {
    var h = app.querySelector('h2, .pt-legend');
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    app.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  // Odd-numbered pairs show the steward statement first so order doesn't steer answers.
  function flipped(i) { return i % 2 === 1; }
  // Returns 0 (steward) .. 3 (owner) for a stored answer.
  function ownerScore(i) {
    var v = st.answers[i];
    if (typeof v !== 'number') return null;
    var firstIsOwner = !flipped(i);
    return firstIsOwner ? 3 - v : v;
  }
  function burden() { return (st.gripText || '').trim() || st.grip || 'what I’ve been carrying'; }

  /* ---------- scoring ---------- */
  function profile() {
    return LENSES.map(function (l, li) {
      var vals = [];
      P.forEach(function (p, i) { if (p[0] === li) { var s = ownerScore(i); if (s !== null) vals.push(s); } });
      var mean = vals.length >= 2 ? vals.reduce(function (a, b) { return a + b; }, 0) / vals.length : null;
      return { i: li, mean: mean };
    });
  }
  function label(m) {
    if (m === null) return 'Not enough answers to read';
    return m >= 2 ? 'Living like an owner' : m >= 1.25 ? 'Pulled both ways' : 'Living like a steward';
  }
  function topLens() {
    var r = profile().filter(function (x) { return x.mean !== null && x.mean >= 1.25; }).sort(function (a, b) { return b.mean - a.mean || a.i - b.i; });
    return r.length ? r[0].i : null;
  }

  /* ---------- views ---------- */
  function intro() {
    var resume = count(st.answers) > 0;
    return '<h2 class="pt-h2">Peace disappears the moment you start carrying what only God was meant to hold.</h2>' +
      '<p>Many men live like owners, but God called you to be a steward. An owner believes, “Everything depends on me.” A steward understands, “Everything belongs to God.” Ownership creates pressure, fear, control and exhaustion. Stewardship still works hard and plans wisely. It just doesn’t carry god-level pressure.</p>' +
      '<ul class="so-facts"><li><strong>Part one:</strong> 15 quick “which sounds more like you?” choices</li><li><strong>Part two:</strong> the Reflex Test</li><li><strong>Part three:</strong> the Stewardship Shift on one thing you’re gripping</li><li><strong>Time:</strong> about 8–10 minutes · nothing is saved or sent</li></ul>' +
      '<p class="pt-muted pt-small">Answer for the last few months, not the man you wish you were. Your results are a starting place for prayer, not a grade or a diagnosis.</p>' +
      '<div class="pt-actions">' +
        '<button type="button" class="pt-btn pt-btn--ember" data-a="start">' + (resume ? 'Continue where I left off' : 'Begin →') + '</button>' +
        (resume ? '<button type="button" class="pt-btn pt-btn--ghost" data-a="restart">Start over</button>' : '') +
      '</div>';
  }

  function pair() {
    var i = st.q, p = P[i], cur = st.answers[i];
    var first = flipped(i) ? p[2] : p[1], second = flipped(i) ? p[1] : p[2];
    return '<div class="pt-tool-top"><span class="pt-count">Part one · ' + (i + 1) + ' of ' + NP + '</span><span class="pt-count">' + count(st.answers) + ' answered</span></div>' +
      '<div class="pt-track" aria-hidden="true"><div style="width:' + Math.round(i / NP * 100) + '%"></div></div>' +
      '<p class="so-prompt">Which sounds more like you lately?</p>' +
      '<div class="so-pair"><p><strong>First</strong>' + esc(first) + '</p><p><strong>Second</strong>' + esc(second) + '</p></div>' +
      '<fieldset class="pt-fieldset"><legend class="pt-legend so-sr">Choose the closest</legend>' +
        SCALE.map(function (l, v) {
          return '<button type="button" class="pt-option" data-a="answer" data-v="' + v + '" aria-pressed="' + (cur === v) + '">' + esc(l) + '</button>';
        }).join('') +
      '</fieldset>' +
      '<div class="pt-actions"><button type="button" class="pt-btn pt-btn--ghost" data-a="back">← Back</button></div>';
  }

  function reflex() {
    return '<div class="pt-tool-top"><span class="pt-count">Part two · The Reflex Test</span></div>' +
      '<div class="pt-track" aria-hidden="true"><div style="width:100%"></div></div>' +
      '<fieldset class="pt-fieldset"><legend class="pt-legend">When uncertainty rises, what do you do first?</legend>' +
        REFLEX.map(function (r, i) {
          return '<button type="button" class="pt-option" data-a="reflex" data-v="' + i + '" aria-pressed="' + (st.reflex === i) + '">' + esc(r[0]) + '</button>';
        }).join('') +
      '</fieldset>' +
      '<div class="so-follow" aria-live="polite">' + (st.reflex != null ? '<div class="pt-callout"><p>' + esc(REFLEX[st.reflex][1]) + '</p></div>' : '') + '</div>' +
      '<div class="pt-actions">' +
        '<button type="button" class="pt-btn pt-btn--ghost" data-a="back">← Back</button>' +
        '<button type="button" class="pt-btn pt-btn--ember" data-a="toShift"' + (st.reflex == null ? ' disabled' : '') + '>Continue →</button>' +
      '</div>';
  }

  function shift() {
    return '<span class="pt-eyebrow">Part three · The Stewardship Shift</span>' +
      '<h2 class="pt-h2">Take one thing you’re gripping through five steps.</h2>' +
      '<div class="so-step"><span class="so-num">Step 1</span><h3 class="pt-h3">Identify what you’re gripping tightly</h3>' +
        '<div class="so-chips" role="group" aria-label="What are you gripping?">' + GRIPS.map(function (g) {
          return '<button type="button" data-a="grip" data-v="' + esc(g) + '" aria-pressed="' + (st.grip === g) + '">' + esc(g) + '</button>';
        }).join('') + '</div>' +
        '<div class="pt-field"><label for="soGrip">Name it specifically</label><input id="soGrip" type="text" data-field="gripText" maxlength="160" value="' + esc(st.gripText) + '" placeholder="For example: whether this deal closes…"></div></div>' +
      '<div class="so-step"><span class="so-num">Step 2</span><h3 class="pt-h3">Am I stewarding this, or trying to control it?</h3>' +
        '<p class="pt-small pt-muted">Signs of control: micromanaging, obsessing, carrying it every waking hour, losing peace trying to secure the outcome.</p>' +
        '<div class="so-chips" role="group" aria-label="Stewarding or controlling?">' + ['Stewarding it', 'Trying to control it', 'Honestly, both'].map(function (m) {
          return '<button type="button" data-a="mode" data-v="' + esc(m) + '" aria-pressed="' + (st.mode === m) + '">' + esc(m) + '</button>';
        }).join('') + '</div></div>' +
      '<div class="so-step"><span class="so-num">Step 3</span><h3 class="pt-h3">Separate responsibility from sovereignty</h3>' +
        '<div class="pt-field"><label for="soMine">Mine to handle faithfully</label><textarea id="soMine" data-field="mine" maxlength="1000" placeholder="My effort, my honesty, my next phone call…">' + esc(st.mine) + '</textarea></div>' +
        '<div class="pt-field"><label for="soGods">God’s alone</label><textarea id="soGods" data-field="gods" maxlength="1000" placeholder="The outcome, the timing, other people’s choices, the future…">' + esc(st.gods) + '</textarea></div></div>' +
      '<div class="so-step"><span class="so-num">Step 4</span><h3 class="pt-h3">Release one burden specifically</h3>' +
        '<p>Pray it out loud: <span class="so-says">“Jesus, <span id="soBurden">' + esc(burden()) + '</span> belongs to You more than it belongs to me.”</span></p>' +
        '<label class="pt-small"><input type="checkbox" data-prayed' + (st.prayed ? ' checked' : '') + '> I prayed this</label></div>' +
      '<div class="so-step"><span class="so-num">Step 5</span><h3 class="pt-h3">Return to faithfulness</h3>' +
        '<p class="pt-small pt-muted">Not panic. Not control. Faithfulness.</p>' +
        '<div class="pt-field"><label for="soFaithful">One faithful action I’ll take this week</label><textarea id="soFaithful" data-field="faithful" maxlength="1000" placeholder="For example: make the call, then stop checking for a reply…">' + esc(st.faithful) + '</textarea></div></div>' +
      '<div class="pt-actions">' +
        '<button type="button" class="pt-btn pt-btn--ghost" data-a="back">← Back</button>' +
        '<button type="button" class="pt-btn pt-btn--ember" data-a="finish">See my reflection →</button>' +
      '</div>';
  }

  function results() {
    var prof = profile(), top = topLens();
    var html = '<div class="so-output"><span class="pt-eyebrow">Your private reflection</span>' +
      '<h2 class="pt-h2">Where you may be living like an owner</h2>' +
      '<p class="pt-muted">These describe what you reported, not who you are. Some of these patterns started as wisdom and became weight.</p>';

    if (top !== null) {
      var L = LENSES[top];
      html += '<div class="so-result is-top"><span class="pt-label">Where the weight is heaviest</span><h3>' + esc(L.name) + '</h3>' +
        '<dl class="so-deep"><dt>The hidden sentence</dt><dd>' + esc(L.sentence) + '</dd>' +
        '<dt>The truth</dt><dd>' + esc(L.truth) + '</dd>' +
        '<dt>Start here</dt><dd>' + esc(L.practice) + '</dd></dl>' +
        '<p class="pt-small pt-muted">Scripture: ' + refLink(L.verse) + '</p></div>';
    } else {
      html += '<div class="pt-callout"><p>You mostly answered like a steward. Keep practicing it. Use the Stewardship Shift below whenever something starts to feel heavy again.</p></div>';
    }

    html += '<h3 class="pt-h3 so-gap">All five lenses</h3>' + prof.map(function (r) {
      var L = LENSES[r.i];
      return '<div class="so-result' + (r.i === top ? ' is-top' : '') + '"><h3>' + esc(L.name) + '<span>' + esc(label(r.mean)) + '</span></h3>' +
        (r.mean !== null ? '<div class="pt-bar" role="img" aria-label="' + esc(L.name + ': ' + label(r.mean)) + '"><div style="width:' + Math.max(3, Math.round(r.mean / 3 * 100)) + '%"></div></div>' : '') +
        '<p class="pt-small">Hidden sentence: ' + esc(L.sentence) + ' · ' + refLink(L.verse) + '</p></div>';
    }).join('');

    var mercy = prof[4].mean;
    if (mercy !== null && mercy >= 1.5) {
      html += '<div class="pt-callout"><p><strong>About mercy.</strong> You may be carrying things yourself because part of you expects God to make you pay. That isn’t conviction. It’s condemnation. Read <a href="/questions/conviction-vs-condemnation/">What’s the difference between conviction and condemnation?</a> and ' + refLink('Romans 8:1') + '.</p></div>';
    }

    if (st.reflex != null) {
      html += '<h3 class="pt-h3 so-gap">Your Reflex Test</h3><div class="so-card"><strong>When uncertainty rises: ' + esc(REFLEX[st.reflex][0]) + '</strong><p>' + esc(REFLEX[st.reflex][1]) + '</p>' +
        '<p class="pt-small"><strong>Trigger → Truth → Response:</strong> fear or uncertainty → “Trust in the LORD with all your heart” (' + refLink('Proverbs 3:5–6') + ') → “I release control and return to faithful stewardship.”</p></div>';
    }

    html += '<h3 class="pt-h3 so-gap">Your Stewardship Shift</h3><div class="so-card">' +
      '<p><strong>What I’m gripping:</strong> ' + esc(burden()) + (st.mode ? ' · ' + esc(st.mode) : '') + '</p>' +
      '<p><strong>Mine to handle:</strong> ' + (esc(st.mine.trim()) || '<em>Not written yet</em>') + '</p>' +
      '<p><strong>God’s alone:</strong> ' + (esc(st.gods.trim()) || '<em>Not written yet</em>') + '</p>' +
      '<p><strong>My prayer:</strong> “Jesus, ' + esc(burden()) + ' belongs to You more than it belongs to me.”' + (st.prayed ? ' ✓' : '') + '</p>' +
      '<p><strong>One faithful action:</strong> ' + (esc(st.faithful.trim()) || '<em>Not written yet</em>') + '</p></div>' +
      '<p class="pt-small pt-muted">Carrying more than one thing? Sort each one in the <a href="/prayer/surrender/">Surrender Tool</a>.</p>';

    html += '<div class="so-gem">Control is often fear disguised as responsibility.</div>';

    html += '<h3 class="pt-h3 so-gap">A seven-day stewardship practice</h3>' +
      '<p class="pt-muted pt-small">One day at a time. Read the passage, pray honestly and take the step. Check off a day when it’s done.</p>' +
      '<ol class="pt-days so-days">' + DAYS.map(function (d, i) {
        return '<li><label><input type="checkbox" data-day="' + i + '"' + (st.done[i] ? ' checked' : '') + '><span class="pt-day-num">Day ' + (i + 1) + '</span>' +
          '<span class="pt-day-text"><strong>' + refLink(d[0]) + '</strong><br>' + esc(d[1]) + '</span></label></li>';
      }).join('') + '</ol>' +
      '<p class="pt-progress" id="soDaysDone" aria-live="polite">' + count(st.done) + ' of 7 days done</p>';

    html += '<div class="so-prayer"><span class="pt-label">A prayer</span>' +
      '<p>Jesus, I confess how often I try to carry what only You were meant to hold. I grip tightly, overthink constantly, and try to control outcomes because fear keeps convincing me everything depends on me. I don’t want to live exhausted by false responsibility anymore. Teach me to trust You deeply. Help me steward faithfully without trying to become sovereign over everything. You are the way, and I want to walk in surrender instead of anxious control. Amen.</p></div>';

    html += '<div class="pt-actions pt-no-print">' +
        '<button type="button" class="pt-btn" data-a="copy">Copy my reflection</button>' +
        '<button type="button" class="pt-btn pt-btn--ghost" data-a="print">Print / save as PDF</button>' +
      '</div><p class="pt-feedback pt-no-print" id="soFb" aria-live="polite"></p>' +
      '<div class="so-help"><strong>If the weight is more than stress</strong><p>If anxiety, sleeplessness or exhaustion won’t lift, talk with your doctor or a licensed counselor alongside a pastor you trust. If you’re in crisis, call or text 988 (US).</p></div>' +
      '<div class="pt-actions pt-no-print">' +
        '<button type="button" class="pt-btn pt-btn--ghost" data-a="review">Review my answers</button>' +
        '<button type="button" class="pt-btn pt-btn--ghost" data-a="clear">Clear my answers</button>' +
      '</div>' +
      '<p class="pt-muted pt-small pt-no-print">Your answers stay in this browser tab only. Closing the tab or pressing “Clear my answers” erases them.</p></div>';
    return html;
  }

  function summaryText() {
    var prof = profile(), top = topLens();
    var lines = ['STEWARD OR OWNER? · MY PRIVATE REFLECTION', 'TheWrkShop · thewrkshop.com/tools/steward-or-owner/', ''];
    if (top !== null) lines.push('WHERE THE WEIGHT IS HEAVIEST: ' + LENSES[top].name.toUpperCase(), 'Hidden sentence: ' + LENSES[top].sentence, 'Start here: ' + LENSES[top].practice, '');
    lines.push('ALL FIVE LENSES');
    prof.forEach(function (r) { lines.push('- ' + LENSES[r.i].name + ': ' + label(r.mean) + ' (' + LENSES[r.i].verse + ')'); });
    if (st.reflex != null) lines.push('', 'REFLEX: ' + REFLEX[st.reflex][0]);
    lines.push('', 'STEWARDSHIP SHIFT', 'Gripping: ' + burden() + (st.mode ? ' (' + st.mode + ')' : ''),
      'Mine to handle: ' + (st.mine.trim() || '(not written)'), 'God’s alone: ' + (st.gods.trim() || '(not written)'),
      'Prayer: Jesus, ' + burden() + ' belongs to You more than it belongs to me.', 'One faithful action: ' + (st.faithful.trim() || '(not written)'),
      '', 'Control is often fear disguised as responsibility.', 'A starting place for prayer, not a diagnosis.');
    return lines.join('\n');
  }

  function copyText(text) {
    var fb = document.getElementById('soFb');
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
    document.body.classList.toggle('so-has-results', st.stage === 'results');
    app.innerHTML = st.stage === 'q' ? pair() : st.stage === 'reflex' ? reflex() : st.stage === 'shift' ? shift() : st.stage === 'results' ? results() : intro();
    save();
    if (focus) focusTop();
  }

  app.addEventListener('click', function (e) {
    var b = e.target.closest('[data-a]');
    if (!b || b.disabled) return;
    var act = b.getAttribute('data-a');
    if (act === 'start') {
      if (!count(st.answers)) track('steward_owner_start');
      if (count(st.answers) >= NP) st.stage = st.reflex != null ? 'shift' : 'reflex';
      else { st.stage = 'q'; var g = 0; while (g < NP - 1 && st.answers[g] != null) g++; st.q = g; }
      render(true);
    } else if (act === 'restart' || act === 'clear') {
      clearAll(); render(true);
    } else if (act === 'answer') {
      st.answers[st.q] = Number(b.getAttribute('data-v'));
      app.querySelectorAll('[data-a="answer"]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      save();
      setTimeout(function () { if (st.q < NP - 1) st.q++; else st.stage = 'reflex'; render(true); }, 180);
    } else if (act === 'back') {
      if (st.stage === 'q') { if (st.q === 0) st.stage = 'intro'; else st.q--; }
      else if (st.stage === 'reflex') { st.stage = 'q'; st.q = NP - 1; }
      else if (st.stage === 'shift') st.stage = 'reflex';
      render(true);
    } else if (act === 'reflex') {
      st.reflex = Number(b.getAttribute('data-v')); render(false);
    } else if (act === 'toShift') {
      st.stage = 'shift'; render(true);
    } else if (act === 'grip' || act === 'mode') {
      var v = b.getAttribute('data-v');
      if (act === 'grip') st.grip = st.grip === v ? '' : v; else st.mode = st.mode === v ? '' : v;
      b.parentNode.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', String(x.getAttribute('data-v') === (act === 'grip' ? st.grip : st.mode))); });
      var sb = document.getElementById('soBurden'); if (sb) sb.textContent = burden();
      save();
    } else if (act === 'finish') {
      st.stage = 'results'; track('steward_owner_finish'); render(true);
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
    if (!f) return;
    st[f] = e.target.value.slice(0, 2000); save();
    if (f === 'gripText') { var sb = document.getElementById('soBurden'); if (sb) sb.textContent = burden(); }
  });
  app.addEventListener('change', function (e) {
    if (e.target.hasAttribute('data-prayed')) { st.prayed = e.target.checked; save(); return; }
    var d = e.target.getAttribute('data-day');
    if (d == null) return;
    if (e.target.checked) st.done[d] = 1; else delete st.done[d];
    save();
    var p = document.getElementById('soDaysDone'); if (p) p.textContent = count(st.done) + ' of 7 days done';
  });

  render(false);
})();
