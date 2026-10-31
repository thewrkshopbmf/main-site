/* Built for More: why you can have everything and still feel empty (Ecclesiastes 2–3, Jeremiah 2:13, John 10:10).
   An entry point for men near or far from faith.
   Part 1: The Everything Test. Tap what you've chased to fill the soul; a cistern fills, then leaks.
   Part 2: Existing or Alive? Tap the signs that are true right now; a pulse line responds.
   Part 3: The Big Story. Five tap-through cards: designed, disconnected, searching, Jesus, alive again.
   Then: pick your honest next step. Results: cistern, pulse, next step, seven days, an optional prayer.
   Everything stays in this browser tab (sessionStorage). GA receives start/finish counts only. */
(function () {
  'use strict';
  var KEY = 'tws.builtformore.v1';
  var app = document.getElementById('bmApp');
  if (!app) return;

  /* ---------- content ---------- */
  var CHASE = ['Success at work', 'Money', 'Pleasure', 'Entertainment', 'Attention or likes', 'A relationship', 'Status or a title', 'Fitness or looks', 'Adventure', 'Knowledge', 'Alcohol or a substance', 'Staying busy'];
  var LAST = ['For a moment', 'For a while', 'It lasted'];
  var EXIST = ['I keep myself constantly distracted', 'I avoid silence', 'I stay endlessly busy', 'I chase validation', 'I numb pain instead of facing it', 'I overconsume: food, screens, stuff', 'I shut down emotionally', 'I’ve lost curiosity', 'I’ve lost gratitude', 'I’ve lost any hunger for God'];
  var ALIVE = ['Peace in the middle of chaos', 'Steady under pressure', 'Real depth in my relationships', 'A sense of purpose', 'Gratitude most days', 'Present with the people I love', 'Awake to God'];
  var STORY = [
    ['Designed', 'You were made for connection with God.', 'Before Adam worked, he walked with God. God didn’t just make humans alive. He breathed His own life into them. You are not only biological. You were built to know the One who made you.', ['Genesis 2:7', 'Then the LORD God formed a man from the dust of the ground and breathed into his nostrils the breath of life, and the man became a living being.']],
    ['Disconnected', 'Something broke.', 'Adam and Eve didn’t drop dead the day they sinned. But shame, fear and hiding came in immediately. What died first was the connection. That’s what sin does: it separates us from Life Himself.', ['Isaiah 59:2', 'But your iniquities have separated you from your God; your sins have hidden his face from you, so that he will not hear.']],
    ['Searching', 'So we dig our own wells.', 'Ever since, people have tried to fill an eternal soul with temporary things. Success, pleasure, attention, status. They work for a moment, then leak. You can have a pulse, ambition and success and still feel hollow.', ['Jeremiah 2:13', 'My people have committed two sins: They have forsaken me, the spring of living water, and have dug their own cisterns, broken cisterns that cannot hold water.']],
    ['Jesus', 'Life came looking for you.', 'Jesus didn’t just teach about life. He said, “I am the life.” He came to bring people back to the Source. Not to make you religious, but to make you alive. He died for the sin that separated us and rose to give us His life.', ['John 10:10', 'The thief comes only to steal and kill and destroy; I have come that they may have life, and have it to the full.']],
    ['Alive again', 'It starts now, not someday.', 'Salvation isn’t only avoiding hell someday. It’s being brought back to life now: connection, identity, peace and purpose restored. Eternal life, Jesus said, is knowing God.', ['Ephesians 2:4–5', 'But because of his great love for us, God, who is rich in mercy, made us alive with Christ even when we were dead in transgressions—it is by grace you have been saved.']]
  ];
  var NEXT = [
    { label: 'I’m curious. I want to find out who Jesus really is.', title: 'Read one of the eyewitness accounts',
      body: 'Start with the Gospel of John. It was written “that you may believe… and that by believing you may have life” (John 20:31). Read one chapter a day for 21 days. Ask God, even if you’re not sure He’s there, to show you if it’s true.',
      link: ['https://www.biblegateway.com/passage/?search=John%201&version=NIV', 'Read John 1'] },
    { label: 'I want to come back to God, or come to Him for the first time.', title: 'You can talk to Him right now',
      body: 'There’s no form to fill out and no cleanup required first. Jesus said, “Let anyone who is thirsty come to me and drink” (John 7:37). The prayer at the bottom of this page is a place to start. Then tell someone, and find a few men to walk with.',
      link: ['/get-known.html', 'Find a group of men'] },
    { label: 'I follow Jesus, but I’ve been existing, not living.', title: 'Reconnect to the Source',
      body: 'You don’t need more effort. You need more connection. A branch doesn’t strain to bear fruit. It stays attached. Start with ten quiet minutes a day: no phone, open Bible, honest prayer.',
      link: ['/studies/doing-vs-dwelling/', 'The Doing vs. the Dwelling study'] },
    { label: 'I want to talk to someone about this.', title: 'You don’t have to figure this out alone',
      body: 'Tell us a little about where you are. We’ll set up a short call or video chat with no pressure and no agenda but helping you find a next step.',
      link: ['/get-known.html', 'Get known'] },
    { label: 'I’m not there yet.', title: 'That’s an honest answer',
      body: 'Keep the question open. Try one thing this week: five minutes of silence a day, with no phone. Notice what comes up. Ecclesiastes says God “set eternity in the human heart.” Pay attention to that ache. It’s pointing somewhere.',
      link: ['https://www.biblegateway.com/passage/?search=Ecclesiastes%203&version=NIV', 'Read Ecclesiastes 3'] }
  ];
  var DAYS = [
    ['Psalm 46:10', 'Five minutes of silence. No phone, no music. Notice what you reach for.'],
    ['Ecclesiastes 2:1–11', 'Read Solomon’s experiment. What have you chased that he already tried?'],
    ['Psalm 42:1–2', 'Name what your soul is actually thirsty for. Say it to God out loud.'],
    ['Isaiah 55:1–3', 'Skip one thing you use to numb out today. Spend that time with God instead.'],
    ['John 1:1–14', 'Read about the One who said, “I am the life.”'],
    ['John 10:7–11', 'Where has “counterfeit life” been stealing from you? Write it down.'],
    ['Psalm 16:11', 'Thank God for three things today. Gratitude is a sign of life coming back.']
  ];

  /* ---------- helpers ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function track(name) { try { if (window.gtag) window.gtag('event', name); } catch (e) {} }
  function bible(ref) { return 'https://www.biblegateway.com/passage/?search=' + encodeURIComponent(ref.replace(/–/g, '-')) + '&version=NIV'; }
  function refLink(ref) { return '<a href="' + bible(ref) + '" target="_blank" rel="noopener">' + esc(ref) + '</a>'; }
  function verse(v) { return '<blockquote class="bm-verse"><p>“' + esc(v[1]) + '”</p><cite>' + esc(v[0]) + ' (NIV)</cite></blockquote>'; }
  function fresh() { return { stage: 'intro', chase: {}, ex: [], al: [], si: 0, seen: 0, next: null, prayed: false, done: {}, finished: false }; }
  var st;
  try { st = JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch (e) { st = null; }
  if (!st || typeof st !== 'object') st = fresh();
  var F = fresh(); Object.keys(F).forEach(function (k) { if (st[k] == null && F[k] != null) st[k] = F[k]; });
  function save() { try { sessionStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  function clearAll() { try { sessionStorage.removeItem(KEY); } catch (e) {} st = fresh(); }
  function count(o) { return Object.keys(o).length; }
  function toggle(arr, v) { var i = arr.indexOf(v); if (i > -1) arr.splice(i, 1); else arr.push(v); }
  function lasted() { var n = 0; Object.keys(st.chase).forEach(function (k) { if (st.chase[k] === 2) n++; }); return n; }

  /* ---------- visuals ---------- */
  function cistern(anim) {
    var n = count(st.chase), fill = Math.min(100, n * 14), keep = Math.min(100, lasted() * 10);
    return '<div class="bm-cistern-wrap"><svg class="bm-cistern' + (anim && n ? ' is-leaking' : '') + '" viewBox="0 0 200 220" role="img" aria-label="A cracked cistern. ' + n + ' things poured in.">' +
      '<defs><clipPath id="bmClip"><path d="M30 40 L40 200 Q100 214 160 200 L170 40 Z"/></clipPath></defs>' +
      '<g clip-path="url(#bmClip)"><rect class="bm-water" x="0" y="' + (200 - fill * 1.6) + '" width="200" height="' + (fill * 1.6 + 20) + '" style="--drop:' + Math.round((fill - keep) * 1.6) + 'px"/></g>' +
      '<path d="M30 40 L40 200 Q100 214 160 200 L170 40" class="bm-wall"/>' +
      '<ellipse cx="100" cy="40" rx="70" ry="10" class="bm-rim"/>' +
      '<path d="M120 120 l8 14 l-6 10 l9 16" class="bm-crack"/><path d="M62 150 l-6 12 l7 9" class="bm-crack"/>' +
      (n ? '<g class="bm-drips"><circle cx="128" cy="170" r="3"/><circle cx="58" cy="180" r="3"/><circle cx="104" cy="214" r="3"/></g>' : '') +
      '</svg><p class="bm-cistern-cap">' + (n ? n + ' poured in · ' + (n - lasted()) + ' didn’t last' : 'Tap what you’ve chased') + '</p></div>';
  }
  function pulse() {
    var e = st.ex.length, a = st.al.length;
    var amp = Math.max(4, Math.min(46, 10 + a * 6 - e * 3));
    var flat = e >= 7 && a <= 1;
    var pts = [], x = 0;
    for (var k = 0; k < 4; k++) {
      pts.push([x, 50], [x + 30, 50], [x + 38, 50 - amp * 0.3], [x + 44, 50 + amp * 0.25], [x + 50, 50 - amp], [x + 56, 50 + amp * 0.6], [x + 62, 50], [x + 80, 50]);
      x += 80;
    }
    var d = 'M' + pts.map(function (p) { return p[0] + ' ' + p[1]; }).join(' L');
    return '<svg class="bm-pulse' + (flat ? ' is-flat' : '') + '" viewBox="0 0 320 100" role="img" aria-label="A pulse line"><path d="' + d + '"/></svg>' +
      '<p class="bm-pulse-cap">' + (e + a === 0 ? 'Tap what’s true and watch the line.' : flat ? 'Still breathing, but barely living.' : a > e ? 'Signs of real life.' : e > a ? 'More existing than living right now.' : 'Somewhere in between.') + '</p>';
  }

  /* ---------- screens ---------- */
  function progress(part, label) {
    return '<div class="pt-tool-top"><span class="pt-count">Part ' + part + ' of 3 · ' + label + '</span></div>' +
      '<div class="bm-steps" aria-hidden="true">' + [1, 2, 3].map(function (n) { return '<span class="' + (n < part ? 'is-done' : n === part ? 'is-here' : '') + '"></span>'; }).join('') + '</div>';
  }

  function intro() {
    var resume = count(st.chase) > 0;
    return '<span class="pt-label">Have you ever had everything and still felt empty?</span>' +
      '<p class="bm-big">The promotion came. The deal closed. The house, the trip, the follower count. And somewhere underneath, a voice still says, “Is this it?”</p>' +
      '<p>You’re not broken for feeling that. Three thousand years ago, the richest, wisest, most powerful man of his day ran the same experiment. He denied himself nothing. His conclusion:</p>' +
      verse(['Ecclesiastes 2:11', 'Yet when I surveyed all that my hands had done and what I had toiled to achieve, everything was meaningless, a chasing after the wind; nothing was gained under the sun.']) +
      '<p>About 8 minutes, in three parts:</p>' +
      '<ol class="bm-parts"><li><strong>The Everything Test.</strong> What have you poured in? How long did it last?</li><li><strong>Existing or alive?</strong> Check your vital signs.</li><li><strong>The big story.</strong> Why the ache is there, and where it points.</li></ol>' +
      '<p class="pt-small pt-muted">Wherever you are with God, even nowhere, this is for you. Your answers stay on your screen.</p>' +
      '<div class="pt-actions"><button type="button" class="pt-btn pt-btn--ember" data-a="begin">' + (resume ? 'Pick up where I left off' : 'Start the Everything Test') + '</button></div>';
  }

  function everything() {
    return progress(1, 'The Everything Test') +
      '<h2 class="pt-h3" tabindex="-1">What have you poured in?</h2>' +
      '<p>Tap everything you’ve chased to feel full. Then tap how long it lasted.</p>' +
      '<div class="bm-chase">' + CHASE.map(function (c, i) {
        var v = st.chase[i], on = v != null;
        return '<div class="bm-item' + (on ? ' is-on' : '') + '"><button type="button" class="bm-pick" data-a="chase" data-v="' + i + '" aria-pressed="' + on + '">' + esc(c) + '</button>' +
          (on ? '<div class="bm-last" role="group" aria-label="How long did ' + esc(c) + ' satisfy?">' + LAST.map(function (l, k) { return '<button type="button" data-a="last" data-i="' + i + '" data-v="' + k + '" aria-pressed="' + (v === k) + '">' + l + '</button>'; }).join('') + '</div>' : '') + '</div>';
      }).join('') + '</div>' +
      '<div id="bmCistern">' + cistern(false) + '</div>' +
      (count(st.chase) ? '<div class="bm-reveal">' + verse(['Jeremiah 2:13', 'They have forsaken me, the spring of living water, and have dug their own cisterns, broken cisterns that cannot hold water.']) +
        '<p>Most of these aren’t bad things. Many are gifts. But an eternal soul can’t be filled with temporary things. External abundance can’t heal internal disconnection.</p></div>' : '') +
      '<div class="pt-actions"><button type="button" class="pt-btn pt-btn--ghost" data-a="home">← Start</button><button type="button" class="pt-btn" data-a="toAlive">Next: existing or alive? →</button></div>';
  }

  function alive() {
    return progress(2, 'Existing or alive?') +
      '<h2 class="pt-h3" tabindex="-1">Still breathing. But truly alive?</h2>' +
      '<p>Most people think death begins physically. In Scripture, it often begins inside: losing wonder, peace, joy and stillness long before the body goes. Tap what’s true for you right now.</p>' +
      '<h3 class="bm-sect">Signs of existing</h3><div class="bm-chips">' + EXIST.map(function (x, i) { return '<button type="button" data-a="ex" data-v="' + i + '" aria-pressed="' + (st.ex.indexOf(i) > -1) + '">' + esc(x) + '</button>'; }).join('') + '</div>' +
      '<h3 class="bm-sect">Signs of life</h3><div class="bm-chips">' + ALIVE.map(function (x, i) { return '<button type="button" class="is-life" data-a="al" data-v="' + i + '" aria-pressed="' + (st.al.indexOf(i) > -1) + '">' + esc(x) + '</button>'; }).join('') + '</div>' +
      '<div class="bm-monitor" id="bmPulse">' + pulse() + '</div>' +
      verse(['Romans 8:6', 'The mind governed by the flesh is death, but the mind governed by the Spirit is life and peace.']) +
      '<p class="pt-small">The modern world is producing highly stimulated people with deeply malnourished souls: constant motion outside, slow erosion inside.</p>' +
      '<div class="pt-actions"><button type="button" class="pt-btn pt-btn--ghost" data-a="toEverything">← Back</button><button type="button" class="pt-btn" data-a="toStory">Next: the big story →</button></div>';
  }

  function story() {
    var i = st.si, S = STORY[i];
    if (i + 1 > st.seen) st.seen = i + 1;
    var last = i === STORY.length - 1;
    return progress(3, 'The big story') +
      '<div class="bm-dots" role="tablist">' + STORY.map(function (s, k) { return '<button type="button" role="tab" data-a="sgo" data-v="' + k + '" aria-selected="' + (k === i) + '" class="' + (k < st.seen ? 'is-seen' : '') + '">' + (k + 1) + ' · ' + esc(s[0]) + '</button>'; }).join('') + '</div>' +
      '<div class="bm-card"><span class="bm-num">' + (i + 1) + ' of 5 · ' + esc(S[0]) + '</span><h2 class="pt-h3" tabindex="-1">' + esc(S[1]) + '</h2><p>' + esc(S[2]) + '</p>' + verse(S[3]) + '</div>' +
      (last ? '<div class="bm-next"><h3 class="pt-h3">So what’s your honest next step?</h3>' +
        NEXT.map(function (n, k) { return '<button type="button" class="pt-option" data-a="next" data-v="' + k + '" aria-pressed="' + (st.next === k) + '">' + esc(n.label) + '</button>'; }).join('') + '</div>' : '') +
      '<div class="pt-actions"><button type="button" class="pt-btn pt-btn--ghost" data-a="sprev">← ' + (i === 0 ? 'Back' : 'Previous') + '</button>' +
        (last ? '<button type="button" class="pt-btn pt-btn--ember" data-a="results">See my results →</button>' : '<button type="button" class="pt-btn" data-a="snext">Next →</button>') + '</div>';
  }

  function results() {
    var n = count(st.chase), N = st.next != null ? NEXT[st.next] : null;
    var h = '<span class="pt-label">What you found</span><h2 class="pt-h3" tabindex="-1">Your soul was built for more</h2>' +
      '<p class="bm-big">“You have made us for Yourself, O Lord, and our hearts are restless until they rest in You.” <span class="pt-small pt-muted">Augustine, about AD 400</span></p>';

    h += '<div class="bm-two"><div>' + cistern(true) + '</div><div>';
    if (n) {
      var items = Object.keys(st.chase).map(function (k) { return '<li>' + esc(CHASE[+k]) + ' · <em>' + LAST[st.chase[k]].toLowerCase() + '</em></li>'; }).join('');
      h += '<p><strong>What you’ve poured in:</strong></p><ul class="bm-list">' + items + '</ul>' +
        '<p>' + (lasted() === 0 ? 'None of it lasted. That isn’t failure. It’s information. Solomon found the same thing.' : 'Some things lasted longer than others. Notice what they have in common. Often it’s the things that point beyond themselves: love, purpose, people.') + '</p>';
    } else h += '<p class="pt-muted">You didn’t tap anything in the Everything Test.</p>';
    h += '</div></div>';

    h += '<h3 class="pt-h3 bm-gap">Your vital signs</h3><div class="bm-monitor">' + pulse() + '</div>' +
      (st.ex.length ? '<p class="pt-small"><strong>Existing:</strong> ' + esc(st.ex.map(function (i) { return EXIST[i].replace(/^I(’ve)? /, '').replace(/^keep myself /, ''); }).join(' · ')) + '</p>' : '') +
      (st.al.length ? '<p class="pt-small"><strong>Alive:</strong> ' + esc(st.al.map(function (i) { return ALIVE[i]; }).join(' · ')) + '</p>' : '') +
      verse(['Ecclesiastes 3:11', 'He has made everything beautiful in its time. He has also set eternity in the human heart.']) +
      '<p>That ache isn’t a malfunction. It’s a homing signal. Nothing else fully satisfies it, because you were designed for union with God.</p>';

    if (N) {
      h += '<h3 class="pt-h3 bm-gap">Your next step</h3><div class="bm-profile"><span class="pt-label">' + esc(N.label) + '</span><h4>' + esc(N.title) + '</h4><p>' + esc(N.body) + '</p>' +
        '<p><a class="pt-btn pt-btn--ember bm-go" href="' + N.link[0] + '"' + (N.link[0].indexOf('http') === 0 ? ' target="_blank" rel="noopener"' : '') + '>' + esc(N.link[1]) + '</a></p></div>';
    } else h += '<p class="pt-muted bm-gap">You didn’t pick a next step. <button type="button" class="bm-link" data-a="toLast">Pick one</button>.</p>';

    h += '<div class="bm-prayer"><span class="pt-label">If you’re ready, a prayer</span><p>God, if You’re there, and You made me for more, I want to know You. I’ve tried to fill this with other things, and they keep leaking. I’m tired of just existing. Jesus, You said You came so I could have life to the full. I’m asking for it. Forgive me, bring me back to You and show me the way. Amen.</p>' +
      '<label class="bm-prayed pt-no-print"><input type="checkbox" data-a="prayed"' + (st.prayed ? ' checked' : '') + '> I prayed this</label>' +
      (st.prayed ? '<p class="bm-prayed-note">Don’t keep it to yourself. Tell someone today, and <a href="/get-known.html">let us help you find a few men to walk with</a>.</p>' : '') + '</div>';

    h += '<h3 class="pt-h3 bm-gap">Seven days to come alive</h3><p class="pt-muted pt-small">One a day. Check it off when it’s done.</p>' +
      '<ol class="pt-days bm-days">' + DAYS.map(function (d, i) {
        return '<li><label><input type="checkbox" data-day="' + i + '"' + (st.done[i] ? ' checked' : '') + '><span class="pt-day-num">Day ' + (i + 1) + '</span><span class="pt-day-text"><strong>' + refLink(d[0]) + '</strong><br>' + esc(d[1]) + '</span></label></li>';
      }).join('') + '</ol><p class="pt-progress" id="bmDaysDone" aria-live="polite">' + count(st.done) + ' of 7 days done</p>';

    h += '<div class="bm-gem">Counterfeit life fades. That’s why you keep needing more of it.</div>';
    h += '<div class="pt-actions pt-no-print"><button type="button" class="pt-btn" data-a="copy">Copy my results</button><button type="button" class="pt-btn pt-btn--ghost" data-a="print">Print / save as PDF</button></div>' +
      '<p class="pt-feedback pt-no-print" id="bmFb" aria-live="polite"></p>' +
      '<div class="pt-actions pt-no-print"><button type="button" class="pt-btn pt-btn--ghost" data-a="restart">Start over</button><button type="button" class="pt-btn pt-btn--ghost" data-a="clear">Clear my answers</button></div>' +
      '<p class="pt-muted pt-small pt-no-print">Your answers stay in this browser tab only. Closing the tab or pressing “Clear my answers” erases them.</p>';
    return h;
  }

  function summaryText() {
    var L = ['BUILT FOR MORE · What I found', 'thewrkshop.com/tools/built-for-more/', '', 'What I’ve poured in:'];
    Object.keys(st.chase).forEach(function (k) { L.push('- ' + CHASE[+k] + ': ' + LAST[st.chase[k]].toLowerCase()); });
    if (st.ex.length) L.push('', 'Signs of existing: ' + st.ex.map(function (i) { return EXIST[i]; }).join('; '));
    if (st.al.length) L.push('Signs of life: ' + st.al.map(function (i) { return ALIVE[i]; }).join('; '));
    if (st.next != null) { var N = NEXT[st.next]; L.push('', 'My next step: ' + N.title, N.body); }
    L.push('', 'Seven days:'); DAYS.forEach(function (d, i) { L.push('Day ' + (i + 1) + ' (' + d[0] + '): ' + d[1]); });
    L.push('', '“He has also set eternity in the human heart.” (Ecclesiastes 3:11)', '© 2026 TheWrkShop · thewrkshop.com');
    return L.join('\n');
  }
  function feedback(m) { var fb = document.getElementById('bmFb'); if (fb) fb.textContent = m; }
  function copyText(text) {
    function fallback() {
      var ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); feedback('Copied.'); } catch (e) { feedback('Couldn’t copy. Try Print / save as PDF instead.'); }
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(function () { feedback('Copied.'); }, fallback); else fallback();
  }

  /* ---------- render + events ---------- */
  function render(focus) {
    var s = st.stage;
    app.innerHTML = s === 'everything' ? everything() : s === 'alive' ? alive() : s === 'story' ? story() : s === 'results' ? results() : intro();
    document.body.classList.toggle('bm-has-results', s === 'results');
    if (focus) {
      var top = app.getBoundingClientRect().top + window.pageYOffset - 80;
      if (Math.abs(window.pageYOffset - top) > 40) window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      var h = app.querySelector('[tabindex="-1"]'); if (h) h.focus({ preventScroll: true });
    }
  }
  function go(stage) {
    st.stage = stage;
    if (stage === 'results' && !st.finished) { st.finished = true; track('builtformore_finish'); }
    save(); render(true);
  }

  app.addEventListener('click', function (e) {
    var b = e.target.closest('[data-a]'); if (!b || b.disabled || b.tagName === 'INPUT' || b.tagName === 'A') return;
    var a = b.getAttribute('data-a'), v = +b.getAttribute('data-v');
    if (a === 'begin') { if (!count(st.chase)) track('builtformore_start'); go('everything'); }
    else if (a === 'home') go('intro');
    else if (a === 'chase') { if (st.chase[v] != null) delete st.chase[v]; else st.chase[v] = 0; save(); render(); }
    else if (a === 'last') { st.chase[b.getAttribute('data-i')] = v; save(); render(); }
    else if (a === 'toEverything') go('everything');
    else if (a === 'toAlive') go('alive');
    else if (a === 'ex' || a === 'al') {
      toggle(st[a], v); save();
      b.setAttribute('aria-pressed', st[a].indexOf(v) > -1);
      var pm = document.getElementById('bmPulse'); if (pm) pm.innerHTML = pulse();
    }
    else if (a === 'toStory') { st.si = 0; go('story'); }
    else if (a === 'sgo') { st.si = v; save(); render(); }
    else if (a === 'snext') { st.si = Math.min(STORY.length - 1, st.si + 1); go('story'); }
    else if (a === 'sprev') { if (st.si > 0) { st.si--; go('story'); } else go('alive'); }
    else if (a === 'toLast') { st.si = STORY.length - 1; go('story'); }
    else if (a === 'next') { st.next = v; save(); b.parentNode.querySelectorAll('[data-a="next"]').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); }
    else if (a === 'results') go('results');
    else if (a === 'copy') copyText(summaryText());
    else if (a === 'print') window.print();
    else if (a === 'restart') { clearAll(); save(); render(true); }
    else if (a === 'clear') { if (window.confirm('Erase your answers?')) { clearAll(); render(true); } }
  });
  app.addEventListener('change', function (e) {
    if (e.target.getAttribute('data-a') === 'prayed') { st.prayed = e.target.checked; if (st.prayed) track('builtformore_prayed'); save(); render(); return; }
    var d = e.target.getAttribute('data-day'); if (d == null) return;
    if (e.target.checked) st.done[d] = true; else delete st.done[d];
    save(); var p = document.getElementById('bmDaysDone'); if (p) p.textContent = count(st.done) + ' of 7 days done';
  });

  render(false);
})();

/* Share row: Share / Copy link / Print for this page only. */
(function () {
  'use strict';
  document.querySelectorAll('.bm-share').forEach(function (bar) {
    var url = bar.getAttribute('data-url'), title = bar.getAttribute('data-title');
    var native = bar.querySelector('[data-share="native"]');
    if (native) { if (!navigator.share) native.style.display = 'none'; else native.addEventListener('click', function () { navigator.share({ title: title, url: url }).catch(function () {}); }); }
    var copy = bar.querySelector('[data-share="copy"]');
    if (copy) copy.addEventListener('click', function () {
      var done = function () { copy.textContent = 'Copied ✓'; setTimeout(function () { copy.textContent = 'Copy link'; }, 2000); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, function () { window.prompt('Copy this link:', url); });
      else window.prompt('Copy this link:', url);
    });
    var print = bar.querySelector('[data-share="print"]');
    if (print) print.addEventListener('click', function () { window.print(); });
  });
})();
