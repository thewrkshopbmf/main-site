/* What's in Your Hand? A private purpose inventory, from TheWrkShop's "What Do You Have?" study.
   Five steps: take inventory (8 categories), name what you've dismissed and the excuse,
   what you're holding back, who's in front of you, and open your hands.
   Then a reflection, a seven-day path and a prayer.
   Everything a person enters stays in this browser tab (sessionStorage) and is never sent to a server.
   Google Analytics receives start/finish counts only, never answers. */
(function () {
  'use strict';
  var KEY = 'tws.inyourhand.v1';
  var app = document.getElementById('whApp');
  if (!app) return;

  /* ---------- content ---------- */
  var CATS = [
    { id: 'staff', name: 'Your staff', what: 'Skills, abilities and know-how', ref: 'Exodus 4:2',
      prompt: 'Moses had an ordinary shepherd’s staff. What do you know how to do?', ph: 'Fix things, teach, sell, organize, cook, listen…' },
    { id: 'oil', name: 'Your oil', what: 'What’s already in your house', ref: '2 Kings 4:1–7',
      prompt: 'The widow said she had nothing, “except a small jar of olive oil.” What resources are sitting in your house?', ph: 'A truck, a spare room, tools, some savings, free evenings…' },
    { id: 'sling', name: 'Your sling', what: 'What you practiced when no one was watching', ref: '1 Samuel 17:34–40',
      prompt: 'David didn’t fight in Saul’s armor. He used what he’d practiced in the fields. What has God trained you in quietly?', ph: 'Years in a hard job, caring for a parent, coaching, leading a team…' },
    { id: 'voice', name: 'Your voice', what: 'Words, influence and the rooms you’re in', ref: 'Exodus 4:11–12',
      prompt: 'Moses said he wasn’t a speaker. God said, “I will help you speak.” Who listens to you?', ph: 'My kids, my crew at work, a group chat, a neighborhood…' },
    { id: 'story', name: 'Your story', what: 'What God has brought you through', ref: 'John 4:39',
      prompt: 'Many believed because of one woman’s testimony. What has God done in your life that someone else needs to hear?', ph: 'Getting sober, a marriage that survived, coming back to faith…' },
    { id: 'scars', name: 'Your scars', what: 'Pain, loss and failure God can redeem', ref: '2 Corinthians 1:3–4',
      prompt: 'God comforts us so we can comfort others with the comfort we received. What pain could become someone else’s help?', ph: 'Losing a job, a divorce, grief, a failure I’ve walked through…' },
    { id: 'people', name: 'Your people', what: 'Relationships, your table and your home', ref: '2 Kings 4:8–10',
      prompt: 'The Shunammite woman built a small room so Elisha had a place to stay. Who already shares your table?', ph: 'Neighbors, coworkers, men from church, my in-laws…' },
    { id: 'yes', name: 'Your yes', what: 'Availability and time', ref: 'Isaiah 6:8',
      prompt: 'Sometimes all a person has is a yes. When are you actually available?', ph: 'Saturday mornings, my lunch hour, two evenings a week…' }
  ];
  var EXCUSES = [
    { says: 'It’s too small to matter.', ref: 'John 6:9–11', answer: 'Andrew asked, “How far will they go among so many?” Jesus took five loaves and two fish, gave thanks, and fed thousands. Small in your hands isn’t small in His.' },
    { says: 'I’m not qualified.', ref: 'Exodus 4:10–12', answer: 'Moses gave God every reason he wasn’t enough. God didn’t argue about Moses’ ability. He promised His presence: “I will help you speak.”' },
    { says: 'I’m too young, or too old.', ref: 'Jeremiah 1:6–8', answer: 'Jeremiah said, “I am too young.” God said, “Do not say that,” and promised to go with him. Age isn’t the qualification. Obedience is.' },
    { says: 'I don’t have what other men have.', ref: 'Acts 3:6', answer: 'Peter said, “Silver or gold I do not have, but what I do have I give you.” He gave what he had, and a man walked for the first time.' },
    { says: 'My past disqualifies me.', ref: 'Luke 23:42–43', answer: 'The thief on the cross had nothing left but a request. Jesus answered, “Today you will be with me in paradise.” Grace starts with what you have, not what you’ve lost.' },
    { says: 'I’m too weak.', ref: 'Judges 6:14–16', answer: 'God told Gideon, “Go in the strength you have.” When Gideon pointed to his weakness, God answered, “I will be with you.”' }
  ];
  var DAYS = [
    ['Exodus 4:1–5', 'Read it slowly. Pick up the one thing you listed as “not enough” and thank God for it.'],
    ['2 Kings 4:1–7', 'Notice the oil kept flowing as long as there were jars. What empty “jars” are around you?'],
    ['John 6:5–13', 'Give something small away today: your time, a meal, a word of encouragement.'],
    ['Mark 14:3–9', 'Name what you’ve been holding back from God. Pour out one part of it this week.'],
    ['Luke 10:30–37', 'Notice one person on your road who needs what you have. Stop for them.'],
    ['Matthew 25:14–30', 'Ask: what have I buried because I was afraid? Take one step to put it to work.'],
    ['1 Peter 4:10', 'Look back on the week: what happened when you opened your hands?']
  ];

  /* ---------- helpers ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function track(name) { try { if (window.gtag) window.gtag('event', name); } catch (e) {} }
  function bible(ref) { return 'https://www.biblegateway.com/passage/?search=' + encodeURIComponent(ref.replace(/–/g, '-')) + '&version=NIV'; }
  function refLink(ref) { return '<a href="' + bible(ref) + '" target="_blank" rel="noopener">' + esc(ref) + '</a>'; }
  function fresh() { return { stage: 'intro', inv: {}, dismissed: '', excuse: null, holding: '', person: '', step: '', prayed: false, done: {} }; }
  var st;
  try { st = JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch (e) { st = null; }
  if (!st || typeof st !== 'object' || !st.inv) st = fresh();
  if (!st.done) st.done = {};
  function save() { try { sessionStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  function clearAll() { try { sessionStorage.removeItem(KEY); } catch (e) {} st = fresh(); }
  function filled() { return CATS.filter(function (c) { return (st.inv[c.id] || '').trim(); }); }
  function cat(id) { for (var i = 0; i < CATS.length; i++) if (CATS[i].id === id) return CATS[i]; return null; }
  function dismissedLabel() {
    var c = cat(st.dismissed);
    if (!c) return '';
    var t = (st.inv[c.id] || '').trim().replace(/[.!\s]+$/, '');
    return t ? t.charAt(0).toLowerCase() + t.slice(1) : '';
  }
  function prayerStart() {
    var l = dismissedLabel();
    return l ? 'Lord, what’s in my hand is this: ' + l + '.' : 'Lord, here’s what’s in my hand.';
  }
  function focusTop() {
    var h = app.querySelector('h2');
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    app.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---------- views ---------- */
  function intro() {
    var resume = filled().length > 0;
    return '<h2 class="pt-h2">God almost never starts with what you don’t have.</h2>' +
      '<p>He starts with what’s already in your hand. Moses had a staff. The widow had a little oil. A boy had five loaves and two fish. Each time the person thought, “It’s not enough.” Each time, God started there.</p>' +
      '<p>This private inventory helps you see what God has already put in your hands, name the excuse you’ve been using, and take one step to put it to work.</p>' +
      '<ul class="wh-facts"><li><strong>Step 1:</strong> take inventory (8 short prompts, fill in what fits)</li><li><strong>Steps 2–5:</strong> what you’ve dismissed, what you’re holding back, who’s in front of you, and opening your hands</li><li><strong>Time:</strong> about 10 minutes · nothing is saved or sent</li></ul>' +
      '<div class="pt-actions">' +
        '<button type="button" class="pt-btn pt-btn--ember" data-a="start">' + (resume ? 'Continue where I left off' : 'Take inventory →') + '</button>' +
        (resume ? '<button type="button" class="pt-btn pt-btn--ghost" data-a="restart">Start over</button>' : '') +
      '</div>';
  }

  function inventory() {
    return '<span class="pt-eyebrow">Step 1 of 5</span>' +
      '<h2 class="pt-h2">What’s in your hand?</h2>' +
      '<p class="pt-muted">Fill in the ones that fit. A few honest words is enough. Skip any that don’t.</p>' +
      CATS.map(function (c) {
        return '<div class="wh-item"><span class="wh-ref">' + esc(c.ref) + '</span><h3>' + esc(c.name) + ': ' + esc(c.what) + '</h3>' +
          '<p>' + esc(c.prompt) + '</p>' +
          '<div class="pt-field"><label class="so-sr" for="wh_' + c.id + '">' + esc(c.name) + '</label><textarea id="wh_' + c.id + '" data-inv="' + c.id + '" maxlength="500" placeholder="' + esc(c.ph) + '">' + esc(st.inv[c.id] || '') + '</textarea></div></div>';
      }).join('') +
      '<p class="pt-feedback" id="whNeed" aria-live="polite"></p>' +
      '<div class="pt-actions">' +
        '<button type="button" class="pt-btn pt-btn--ghost" data-a="toIntro">← Back</button>' +
        '<button type="button" class="pt-btn pt-btn--ember" data-a="toSteps">Continue →</button>' +
      '</div>';
  }

  function steps() {
    var f = filled();
    var ex = st.excuse != null ? EXCUSES[st.excuse] : null;
    return '<span class="pt-eyebrow">Steps 2–5</span>' +
      '<h2 class="pt-h2">From “not enough” to open hands</h2>' +
      '<div class="wh-step"><span class="wh-num">Step 2</span><h3 class="pt-h3">Which one have you dismissed as “not enough”?</h3>' +
        '<div class="wh-chips" role="group" aria-label="What have you dismissed?">' + f.map(function (c) {
          return '<button type="button" data-a="dismiss" data-v="' + c.id + '" aria-pressed="' + (st.dismissed === c.id) + '">' + esc(c.name) + '</button>';
        }).join('') + '</div>' +
        '<p>What do you usually tell yourself about it?</p>' +
        '<div class="wh-chips" role="group" aria-label="Your excuse">' + EXCUSES.map(function (e, i) {
          return '<button type="button" data-a="excuse" data-v="' + i + '" aria-pressed="' + (st.excuse === i) + '">' + esc(e.says) + '</button>';
        }).join('') + '</div>' +
        '<div id="whAnswer" aria-live="polite">' + (ex ? '<div class="pt-callout"><p><strong>' + refLink(ex.ref) + '</strong> · ' + esc(ex.answer) + '</p></div>' : '') + '</div></div>' +
      '<div class="wh-step"><span class="wh-num">Step 3</span><h3 class="pt-h3">What are you holding back?</h3>' +
        '<p class="pt-small pt-muted">The woman broke her alabaster jar and poured it all out. The rich young ruler walked away sad because he couldn’t let go. What are you gripping that God may be asking you to open?</p>' +
        '<div class="pt-field"><label class="so-sr" for="whHold">What I’m holding back</label><textarea id="whHold" data-field="holding" maxlength="1000" placeholder="My time, my money, my comfort, a dream I’ve kept to myself…">' + esc(st.holding) + '</textarea></div></div>' +
      '<div class="wh-step"><span class="wh-num">Step 4</span><h3 class="pt-h3">Who’s in front of you?</h3>' +
        '<p class="pt-small pt-muted">The Samaritan didn’t go looking for a mission. He stopped for the man on his road. Name one person or need you already see.</p>' +
        '<div class="pt-field"><label class="so-sr" for="whPerson">One person or need</label><textarea id="whPerson" data-field="person" maxlength="500" placeholder="A coworker who’s struggling, a single mom next door, the youth group…">' + esc(st.person) + '</textarea></div></div>' +
      '<div class="wh-step"><span class="wh-num">Step 5</span><h3 class="pt-h3">Open your hands</h3>' +
        '<p>Pray it out loud: <span class="wh-says">“<span id="whDis">' + esc(prayerStart()) + '</span> It doesn’t look like enough to me. I put it in Your hands. Use it for Your glory and for the people in front of me.”</span></p>' +
        '<label class="pt-small"><input type="checkbox" data-prayed' + (st.prayed ? ' checked' : '') + '> I prayed this</label>' +
        '<div class="pt-field"><label for="whStep">One step I’ll take this week</label><textarea id="whStep" data-field="step" maxlength="1000" placeholder="For example: offer to help Mike move on Saturday…">' + esc(st.step) + '</textarea></div></div>' +
      '<div class="pt-actions">' +
        '<button type="button" class="pt-btn pt-btn--ghost" data-a="toInv">← Back</button>' +
        '<button type="button" class="pt-btn pt-btn--ember" data-a="finish">See my reflection →</button>' +
      '</div>';
  }

  function results() {
    var f = filled(), ex = st.excuse != null ? EXCUSES[st.excuse] : null, dc = cat(st.dismissed);
    var html = '<div class="wh-output"><span class="pt-eyebrow">Your private reflection</span>' +
      '<h2 class="pt-h2">What’s already in your hand</h2>' +
      '<p class="pt-muted">You came in thinking you might not have enough. Look at the list.</p>';
    html += f.length ? f.map(function (c) {
      return '<div class="wh-result' + (c.id === st.dismissed ? ' is-top' : '') + '"><h3>' + esc(c.name) + '<span>' + esc(c.ref) + '</span></h3><p>' + esc(st.inv[c.id].trim()) + '</p>' +
        (c.id === st.dismissed ? '<p class="pt-small"><strong>You called this “not enough.”</strong> God usually starts right here.</p>' : '') + '</div>';
    }).join('') : '<div class="pt-callout"><p>You didn’t list anything yet. Go back and write even one small thing. God starts with what you have.</p></div>';

    if (ex) html += '<div class="wh-card"><strong>The excuse: “' + esc(ex.says) + '”</strong><p>' + esc(ex.answer) + ' (' + refLink(ex.ref) + ')</p></div>';
    html += '<h3 class="pt-h3 wh-gap">Your next step</h3><div class="wh-card">' +
      '<p><strong>Holding back:</strong> ' + (esc(st.holding.trim()) || '<em>Not written yet</em>') + '</p>' +
      '<p><strong>In front of me:</strong> ' + (esc(st.person.trim()) || '<em>Not written yet</em>') + '</p>' +
      '<p><strong>My prayer:</strong> “' + esc(prayerStart()) + ' It doesn’t look like enough to me. I put it in Your hands.”' + (st.prayed ? ' ✓' : '') + '</p>' +
      '<p><strong>One step this week:</strong> ' + (esc(st.step.trim()) || '<em>Not written yet</em>') + '</p></div>';
    html += '<div class="wh-gem">What you keep shrinks. What you pour out multiplies.</div>';
    html += '<h3 class="pt-h3 wh-gap">A seven-day path</h3>' +
      '<p class="pt-muted pt-small">One day at a time. Read the passage, pray honestly and take the step. Check off a day when it’s done.</p>' +
      '<ol class="pt-days wh-days">' + DAYS.map(function (d, i) {
        return '<li><label><input type="checkbox" data-day="' + i + '"' + (st.done[i] ? ' checked' : '') + '><span class="pt-day-num">Day ' + (i + 1) + '</span>' +
          '<span class="pt-day-text"><strong>' + refLink(d[0]) + '</strong><br>' + esc(d[1]) + '</span></label></li>';
      }).join('') + '</ol>' +
      '<p class="pt-progress" id="whDaysDone" aria-live="polite">' + Object.keys(st.done).length + ' of 7 days done</p>';
    html += '<div class="wh-prayer"><span class="pt-label">A prayer</span><p>Father, I’ve spent so much time looking at what I don’t have. Open my eyes to what You’ve already put in my hands. Forgive me for burying what You gave me out of fear. Here is my staff, my story, my scars and my yes. They don’t look like much to me, but they’re Yours. Multiply what I give, and lead me to the people You want me to serve. Amen.</p></div>';
    html += '<div class="pt-actions pt-no-print">' +
        '<button type="button" class="pt-btn" data-a="copy">Copy my reflection</button>' +
        '<button type="button" class="pt-btn pt-btn--ghost" data-a="print">Print / save as PDF</button>' +
      '</div><p class="pt-feedback pt-no-print" id="whFb" aria-live="polite"></p>' +
      '<div class="pt-callout pt-no-print"><p><strong>Keep going:</strong> see how God has gifted you to serve with the <a href="/assessment.html">Spiritual Gifts Assessment</a>, read <a href="/questions/what-is-my-purpose-as-a-man/">What is my purpose as a man?</a>, or <a href="/get-known.html">get known</a> and join a group of men who’ll walk it out with you.</p></div>' +
      '<div class="pt-actions pt-no-print">' +
        '<button type="button" class="pt-btn pt-btn--ghost" data-a="toInv">Edit my answers</button>' +
        '<button type="button" class="pt-btn pt-btn--ghost" data-a="clear">Clear my answers</button>' +
      '</div><p class="pt-muted pt-small pt-no-print">Your answers stay in this browser tab only. Closing the tab or pressing “Clear my answers” erases them.</p></div>';
    return html;
  }

  function summaryText() {
    var f = filled(), ex = st.excuse != null ? EXCUSES[st.excuse] : null;
    var lines = ['WHAT’S IN YOUR HAND? · MY PRIVATE REFLECTION', 'TheWrkShop · thewrkshop.com/tools/whats-in-your-hand/', ''];
    f.forEach(function (c) { lines.push(c.name.toUpperCase() + (c.id === st.dismissed ? ' (the one I called “not enough”)' : '') + ': ' + st.inv[c.id].trim()); });
    if (ex) lines.push('', 'My excuse: “' + ex.says + '”', 'God’s answer (' + ex.ref + '): ' + ex.answer);
    lines.push('', 'Holding back: ' + (st.holding.trim() || '(not written)'), 'In front of me: ' + (st.person.trim() || '(not written)'),
      'Prayer: ' + prayerStart() + ' It doesn’t look like enough to me. I put it in Your hands.',
      'One step this week: ' + (st.step.trim() || '(not written)'), '', 'What you keep shrinks. What you pour out multiplies.', '© 2026 TheWrkShop · thewrkshop.com');
    return lines.join('\n');
  }

  function copyText(text) {
    var fb = document.getElementById('whFb');
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
    document.body.classList.toggle('wh-has-results', st.stage === 'results');
    app.innerHTML = st.stage === 'inv' ? inventory() : st.stage === 'steps' ? steps() : st.stage === 'results' ? results() : intro();
    save();
    if (focus) focusTop();
  }

  app.addEventListener('click', function (e) {
    var b = e.target.closest('[data-a]');
    if (!b || b.disabled) return;
    var act = b.getAttribute('data-a'), v = b.getAttribute('data-v');
    if (act === 'start') {
      if (!filled().length) track('in_your_hand_start');
      st.stage = 'inv'; render(true);
    } else if (act === 'restart' || act === 'clear') {
      clearAll(); render(true);
    } else if (act === 'toIntro') {
      st.stage = 'intro'; render(true);
    } else if (act === 'toInv') {
      st.stage = 'inv'; render(true);
    } else if (act === 'toSteps') {
      if (!filled().length) { var n = document.getElementById('whNeed'); if (n) n.textContent = 'Write at least one thing. Even something small counts.'; return; }
      if (st.dismissed && !(st.inv[st.dismissed] || '').trim()) st.dismissed = '';
      st.stage = 'steps'; render(true);
    } else if (act === 'dismiss') {
      st.dismissed = st.dismissed === v ? '' : v;
      b.parentNode.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', String(x.getAttribute('data-v') === st.dismissed)); });
      var d = document.getElementById('whDis'); if (d) d.textContent = prayerStart();
      save();
    } else if (act === 'excuse') {
      var i = Number(v); st.excuse = st.excuse === i ? null : i;
      b.parentNode.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', String(Number(x.getAttribute('data-v')) === st.excuse)); });
      var ex = st.excuse != null ? EXCUSES[st.excuse] : null;
      document.getElementById('whAnswer').innerHTML = ex ? '<div class="pt-callout"><p><strong>' + refLink(ex.ref) + '</strong> · ' + esc(ex.answer) + '</p></div>' : '';
      save();
    } else if (act === 'finish') {
      st.stage = 'results'; track('in_your_hand_finish'); render(true);
    } else if (act === 'copy') {
      copyText(summaryText());
    } else if (act === 'print') {
      window.print();
    }
  });
  app.addEventListener('input', function (e) {
    var inv = e.target.getAttribute('data-inv'), f = e.target.getAttribute('data-field');
    if (inv) { st.inv[inv] = e.target.value.slice(0, 500); save(); var n = document.getElementById('whNeed'); if (n) n.textContent = ''; }
    else if (f) { st[f] = e.target.value.slice(0, 1000); save(); }
  });
  app.addEventListener('change', function (e) {
    if (e.target.hasAttribute('data-prayed')) { st.prayed = e.target.checked; save(); return; }
    var d = e.target.getAttribute('data-day');
    if (d == null) return;
    if (e.target.checked) st.done[d] = 1; else delete st.done[d];
    save();
    var p = document.getElementById('whDaysDone'); if (p) p.textContent = Object.keys(st.done).length + ' of 7 days done';
  });

  render(false);
})();
