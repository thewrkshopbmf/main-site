/* Who Gets Access to Your Weight? Discerned disclosure for men.
   "I stopped proving. I started receiving." Privacy is not sin. Isolation is.
   Part 1: How are you carrying weight? 12 statements (armor, discernment, covenant) → profile.
   Part 2: The S.P.E.A.K. check on up to three specific men → the highest level of sharing each has earned.
   Part 3: The 2-Sentence Rule: write your Level 1 and Level 2 sentences, see how to read the response.
   Results: profile, the formation phase to work on, your people, your sentences, seven days, prayer.
   Everything stays in this browser tab (sessionStorage). Nothing about anyone is sent anywhere.
   GA receives start/finish counts only. */
(function () {
  'use strict';
  var KEY = 'tws.whogetsaccess.v1';
  var app = document.getElementById('waApp');
  if (!app) return;

  /* ---------- content ---------- */
  var SECT = [
    { name: 'Armor', title: 'Your default pattern', rev: true, items: [
      'I tend to deal with pressure alone, even when support is available.',
      'I worry that sharing struggles will change how people see me.',
      'I’ve had experiences where being open backfired.',
      'I feel safer being private than being misunderstood.'] },
    { name: 'Discernment', title: 'How you share', rev: false, items: [
      'I know the difference between being honest and being exposed.',
      'I’m intentional about who gets access to my deeper struggles.',
      'I can describe my current season without oversharing.',
      'I rarely regret what I’ve shared, or who I shared it with.'] },
    { name: 'Covenant', title: 'Who has access', rev: false, items: [
      'At least one man knows the real weight I’m carrying.',
      'There’s someone I trust with my fear, not just my facts.',
      'I believe help can strengthen me without making me less.',
      'I know where I’d go if things started to unravel.'] }
  ];
  var SCALE = ['Never', 'Sometimes', 'Often', 'Almost always'];
  var LEVELS = [
    { n: 1, name: 'General reality', who: 'Many people', say: '“I’m in a demanding season.”', what: 'Honest, with no details and no exposure. Men can live here forever and still collapse quietly.' },
    { n: 2, name: 'Directional truth', who: 'A few people', say: '“I’m carrying more than I should alone.”', what: 'Names the strain without the details. It opens the door without walking through it, and it tests who is safe.' },
    { n: 3, name: 'Specific burden', who: 'Very few', say: 'Names, facts, fears, real consequences.', what: 'Shared weight, prayer and honest correction. This level is earned, not assumed.' },
    { n: 4, name: 'Soul-level weight', who: 'Rare, within covenant', say: 'Confession, origin stories, identity wounds.', what: 'Where shame loses its power and prayer carries real weight. The gospel invites this level. It never demands it with everyone.' }
  ];
  var PROF = [
    { min: 0, who: 'The Fortified Isolator', line: 'Your armor is doing all the work.', body: 'Your strength is real, but it’s unsupported. That makes sense: many men learned that weakness was punished and struggle lowered status. But the risk is a silent collapse, resentment or burnout. You don’t need forced vulnerability. You need a safe next step.', phase: 0 },
    { min: 15, who: 'The Selective Carrier', line: 'Some discernment, inconsistent support.', body: 'You’re not reckless and you’re not completely alone. But the weight may be getting heavier than you’ve admitted. The work now is to get clear on who carries what, and why.', phase: 1 },
    { min: 25, who: 'The Discerning Sharer', line: 'Healthy boundaries. Intentional disclosure.', body: 'You know the difference between honest and exposed, and you choose carefully. The next step isn’t widening your circle. It’s deepening covenant with one or two proven men.', phase: 2 },
    { min: 33, who: 'The Covenanted Brother', line: 'Your weight is distributed wisely.', body: 'Shame has little leverage on you, and you hold up under pressure. With that comes a responsibility: become a safe carrier for other men. Be the one who can sit in silence and keep a confidence.', phase: 3 }
  ];
  var PHASES = [
    ['Name the load', 'Practice Level 1 this week. When someone asks how you’re doing, skip “fine.” Say, “It’s been a demanding season.” You don’t have to pretend.'],
    ['Signal strain', 'Pick two or three men and test them with Level 2: “I’m carrying more than I should alone.” Then watch who leans in, who minimizes, who fixes and who disappears.'],
    ['Transfer weight', 'Name one or two load carriers. Agree together on confidentiality, prayer, truth-telling and availability. Then share one specific burden.'],
    ['Anchor covenant', 'Set aside an intentional time with a covenant brother for confession, intercession, silence and blessing. Then offer to carry weight for another man.']
  ];
  var SPEAK = [
    ['S', 'Silence', 'Can he sit in silence without rushing to fix it or turning the conversation to himself?'],
    ['P', 'Power', 'Does he handle status well, or does he need to win, one-up stories or feel superior?'],
    ['E', 'Empathy', 'Does he reduce shame, or analyze it from a distance?'],
    ['A', 'Access history', 'How has he handled other people’s stories? Does he gossip or diagnose people who aren’t there?'],
    ['K', 'After effect', 'When you leave time with him, do you feel lighter or tighter?']
  ];
  var MARK = ['Passes', 'Not sure', 'Fails'];
  var RESP = [
    ['Presence', 'He slows down, asks a gentle question, or just says, “I’m with you.”', 'Safe. He may be ready for Level 3, over time.', 'is-safe'],
    ['Fixing', 'He jumps straight to advice or a three-step plan.', 'Limited. He means well, but he may not be able to hold weight yet. Keep it at Level 2.', 'is-mid'],
    ['Minimizing', '“Everybody’s tired, man.” “You’ll be fine.”', 'Unsafe for now. Keep it at Level 1.', 'is-no'],
    ['Curiosity without care', 'He wants the details, but not to help carry them.', 'Unsafe. Your story would become commentary. Level 1 only.', 'is-no']
  ];
  var DAYS = [
    ['2 Corinthians 12:9–10', 'Pray, “I stopped proving. I’m receiving.” Name one place you’ve been performing strength.'],
    ['Matthew 26:36–38', 'Notice who Jesus took closest in Gethsemane: three, not twelve. Who are your three, or who could be?'],
    ['Proverbs 11:13', 'Watch how the people around you handle other people’s stories. Just notice.'],
    ['Galatians 6:2', 'Use the 2-Sentence Rule with one man. Then stop talking, and notice what happens.'],
    ['Ecclesiastes 4:9–10', 'Ask a man you trust, “What kind of season are you in?” Then carry some of his weight.'],
    ['James 5:16', 'If a man has earned it, share one specific burden. Ask him to pray with you, not fix it.'],
    ['Proverbs 18:24', 'Thank God for one faithful friend, or ask Him for one. Then tell that man what he means to you.']
  ];
  var NQ = 12;

  /* ---------- helpers ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function track(name) { try { if (window.gtag) window.gtag('event', name); } catch (e) {} }
  function bible(ref) { return 'https://www.biblegateway.com/passage/?search=' + encodeURIComponent(ref.replace(/–/g, '-')) + '&version=NIV'; }
  function refLink(ref) { return '<a href="' + bible(ref) + '" target="_blank" rel="noopener">' + esc(ref) + '</a>'; }
  function verse(v) { return '<blockquote class="wa-verse"><p>“' + esc(v[1]) + '”</p><cite>' + esc(v[0]) + ' (NIV)</cite></blockquote>'; }
  function freshPerson() { return { name: '', m: {}, cov: false }; }
  function fresh() { return { stage: 'intro', a: {}, people: [freshPerson()], pi: 0, s1: 'It’s been a heavy season.', s2: 'I’m carrying more than I should alone.', resp: null, done: {}, finished: false }; }
  var st;
  try { st = JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch (e) { st = null; }
  if (!st || typeof st !== 'object') st = fresh();
  var F = fresh(); Object.keys(F).forEach(function (k) { if (st[k] == null && F[k] != null) st[k] = F[k]; });
  if (!st.people.length) st.people = [freshPerson()];
  function save() { try { sessionStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  function clearAll() { try { sessionStorage.removeItem(KEY); } catch (e) {} st = fresh(); }
  function count(o) { return Object.keys(o).length; }
  function filled(v) { return v != null && String(v).trim() !== ''; }
  function qid(s, i) { return s * 4 + i; }
  function score(si) { var t = 0, n = 0; for (var i = 0; i < 4; i++) { var v = st.a[qid(si, i)]; if (v != null) { t += SECT[si].rev ? 3 - v : v; n++; } } return { t: t, n: n }; }
  function total() { return score(0).t + score(1).t + score(2).t; }
  function profile() { var t = total(), p = PROF[0]; PROF.forEach(function (x) { if (t >= x.min) p = x; }); return p; }
  function level(p) {
    var fails = 0, unsure = 0, marked = 0;
    for (var i = 0; i < 5; i++) { var v = p.m[i]; if (v == null) continue; marked++; if (v === 2) fails++; else if (v === 1) unsure++; }
    if (marked < 5) return null;
    if (fails >= 2) return 1;
    if (fails === 1 || unsure >= 2) return 2;
    if (unsure === 1) return 2;
    return p.cov ? 4 : 3;
  }
  function pname(p, i) { return filled(p.name) ? p.name.trim() : 'Man ' + (i + 1); }

  /* ---------- screens ---------- */
  function progress(part, label) {
    return '<div class="pt-tool-top"><span class="pt-count">Part ' + part + ' of 3 · ' + label + '</span></div>' +
      '<div class="wa-steps" aria-hidden="true">' + [1, 2, 3].map(function (n) { return '<span class="' + (n < part ? 'is-done' : n === part ? 'is-here' : '') + '"></span>'; }).join('') + '</div>';
  }
  function ladder(max) {
    return '<div class="wa-ladder">' + LEVELS.slice().reverse().map(function (L) {
      var on = max != null && L.n <= max;
      return '<div class="wa-rung' + (on ? ' is-on' : '') + (max === L.n ? ' is-max' : '') + '"><b>' + L.n + '</b><span><strong>' + esc(L.name) + '</strong> · ' + esc(L.who) + '<br><em>' + esc(L.say) + '</em></span></div>';
    }).join('') + '</div>';
  }

  function intro() {
    var resume = count(st.a) > 0;
    return '<span class="pt-label">The man under the load</span>' +
      '<p class="wa-big">Picture a man carrying a massive load alone because he’s terrified to admit he’s tired. Then a stronger man walks beside him and says, “Put it on my shoulders. I’m with you.” Will he cling to pride, or receive strength?</p>' +
      verse(['2 Corinthians 12:9', 'My grace is sufficient for you, for my power is made perfect in weakness.']) +
      '<p>A lot of men push back: “You want me to lower my guard in a world that hasn’t earned my trust?” Fair. Many have seen openness turn into gossip. But the Bible never says to tell everyone everything. Jesus practiced discerned disclosure. In Gethsemane He didn’t take all twelve. He took three.</p>' +
      '<p class="wa-key"><strong>Privacy is not sin. Isolation is.</strong></p>' +
      '<p>About 8 minutes, in three parts:</p>' +
      '<ol class="wa-parts"><li><strong>How are you carrying weight?</strong> Twelve quick statements.</li><li><strong>The S.P.E.A.K. check.</strong> Run one, two or three specific men through five filters and see what level of sharing each has earned.</li><li><strong>The 2-Sentence Rule.</strong> A 30-second way to find out who’s safe.</li></ol>' +
      '<p class="pt-small pt-muted">Your answers, including any names you type, stay on your screen and are never sent anywhere.</p>' +
      '<div class="pt-actions"><button type="button" class="pt-btn pt-btn--ember" data-a="begin">' + (resume ? 'Pick up where I left off' : 'Start') + '</button>' +
      (resume && count(st.a) === NQ ? '<button type="button" class="pt-btn pt-btn--ghost" data-a="results">See my results</button>' : '') + '</div>';
  }

  function carry() {
    return progress(1, 'How are you carrying weight?') +
      '<h2 class="pt-h3" tabindex="-1">How are you carrying weight right now?</h2>' +
      '<div class="pt-tool-top"><span class="pt-count">' + count(st.a) + ' of ' + NQ + ' answered</span></div>' +
      '<div class="pt-track"><div style="width:' + Math.round(count(st.a) / NQ * 100) + '%"></div></div>' +
      SECT.map(function (S, si) {
        return '<h3 class="wa-sect">' + esc(S.title) + '</h3>' + S.items.map(function (it, i) {
          var id = qid(si, i), cur = st.a[id];
          return '<div class="wa-q' + (cur != null ? ' is-done' : '') + '"><p>' + esc(it) + '</p><div class="wa-chips" role="group" aria-label="' + esc(it) + '">' +
            SCALE.map(function (l, v) { return '<button type="button" data-a="ans" data-q="' + id + '" data-v="' + v + '" aria-pressed="' + (cur === v) + '">' + l + '</button>'; }).join('') + '</div></div>';
        }).join('');
      }).join('') +
      '<p class="pt-error" id="waErr" aria-live="polite"></p>' +
      '<div class="pt-actions"><button type="button" class="pt-btn pt-btn--ghost" data-a="home">← Start</button><button type="button" class="pt-btn" data-a="toSpeak">Next: the S.P.E.A.K. check →</button></div>';
  }

  function speak() {
    var i = st.pi, p = st.people[i], lv = level(p);
    return progress(2, 'The S.P.E.A.K. check') +
      '<h2 class="pt-h3" tabindex="-1">Who has earned access?</h2>' +
      '<p>You don’t have to discern everyone. Most men are over-interviewing unqualified candidates. Think of one specific man, someone you might share with, and run him through five filters you can observe without exposing anything.</p>' +
      '<div class="wa-tabs" role="tablist">' + st.people.map(function (q, k) { return '<button type="button" role="tab" data-a="ptab" data-v="' + k + '" aria-selected="' + (k === i) + '">' + esc(pname(q, k)) + (level(q) ? ' · L' + level(q) : '') + '</button>'; }).join('') +
        (st.people.length < 3 ? '<button type="button" class="wa-add" data-a="padd">+ Another man</button>' : '') + '</div>' +
      '<div class="pt-field"><label for="waName">His first name or initials <span class="pt-optional">(optional, stays on your screen)</span></label><input id="waName" type="text" data-field="pname" maxlength="30" value="' + esc(p.name) + '"></div>' +
      SPEAK.map(function (s, k) {
        return '<div class="wa-filter"><span class="wa-letter">' + s[0] + '</span><div><p><strong>' + esc(s[1]) + '.</strong> ' + esc(s[2]) + '</p><div class="wa-chips" role="group" aria-label="' + esc(s[1]) + '">' +
          MARK.map(function (m, v) { return '<button type="button" class="wa-m' + v + '" data-a="mark" data-k="' + k + '" data-v="' + v + '" aria-pressed="' + (p.m[k] === v) + '">' + m + '</button>'; }).join('') + '</div></div></div>';
      }).join('') +
      '<label class="wa-cov"><input type="checkbox" data-a="cov"' + (p.cov ? ' checked' : '') + '> We have a covenant: we’ve agreed on confidentiality, prayer, truth-telling and being there.</label>' +
      '<div class="wa-verdict" aria-live="polite">' + (lv ? '<p><span class="pt-label">' + esc(pname(p, i)) + ' has earned</span><strong>Level ' + lv + ': ' + esc(LEVELS[lv - 1].name) + '</strong></p>' + ladder(lv) +
        '<p class="pt-small">' + (lv === 1 ? 'Two or more filters failed. Keep it at Level 1 with him for now. That isn’t judgment. It’s stewardship.' : lv === 2 ? 'Mixed or unsure. Test him with Level 2 (Part 3), and watch how he responds.' : lv === 3 ? 'He passes. Level 3 is possible, over time. Level 4 is for covenant.' : 'He passes, and you have covenant. Soul-level weight is safe here.') + '</p>'
        : '<p class="pt-muted">Mark all five filters to see what level he’s earned.</p>' + ladder(null)) + '</div>' +
      '<div class="pt-actions"><button type="button" class="pt-btn pt-btn--ghost" data-a="toCarry">← Back</button><button type="button" class="pt-btn" data-a="toRule">Next: the 2-Sentence Rule →</button></div>';
  }

  function rule() {
    return progress(3, 'The 2-Sentence Rule') +
      '<h2 class="pt-h3" tabindex="-1">Thirty seconds, not emotional labor</h2>' +
      '<p>Instead of deep evaluation, use micro-disclosure. Say two sentences, then stop. Don’t explain, justify or clarify. Watch what happens.</p>' +
      '<div class="wa-say"><div class="pt-field"><label for="waS1">Sentence 1 <span class="pt-optional">(Level 1)</span></label><input id="waS1" type="text" data-field="s1" maxlength="120" value="' + esc(st.s1) + '"></div>' +
        '<div class="pt-field"><label for="waS2">Sentence 2 <span class="pt-optional">(Level 2, optional)</span></label><input id="waS2" type="text" data-field="s2" maxlength="120" value="' + esc(st.s2) + '"></div>' +
        '<p class="wa-stop">Then stop talking.</p></div>' +
      '<h3 class="wa-sect">What did he do next?</h3><p class="pt-small pt-muted">Tap each response to see what it tells you.</p>' +
      '<div class="wa-resp">' + RESP.map(function (r, k) {
        var on = st.resp === k;
        return '<button type="button" class="pt-option ' + r[3] + '" data-a="resp" data-v="' + k + '" aria-expanded="' + on + '"><span><strong>' + esc(r[0]) + '</strong><br><span class="pt-small">' + esc(r[1]) + '</span>' + (on ? '<span class="wa-read">' + esc(r[2]) + '</span>' : '') + '</span></button>';
      }).join('') + '</div>' +
      '<div class="pt-actions pt-no-print"><a class="pt-btn pt-btn--ghost" id="waSms" href="' + smsHref() + '">Text these two sentences</a></div>' +
      '<p class="pt-small pt-muted">Only send them to a man who passed at least three filters.</p>' +
      '<div class="pt-actions"><button type="button" class="pt-btn pt-btn--ghost" data-a="toSpeak">← Back</button><button type="button" class="pt-btn pt-btn--ember" data-a="results">See my results →</button></div>';
  }
  function smsHref() { return 'sms:?&body=' + encodeURIComponent([st.s1, st.s2].filter(filled).map(function (s) { return s.trim(); }).join(' ')); }

  function results() {
    var P = profile(), t = total(), ph = PHASES[P.phase];
    var h = '<span class="pt-label">Your results</span><h2 class="pt-h3" tabindex="-1">' + esc(P.who) + '</h2>' +
      '<div class="wa-profile"><p class="wa-line">' + esc(P.line) + '</p><p>' + esc(P.body) + '</p>' +
      '<div class="pt-bar-row is-top"><div class="pt-bar-head">Weight shared wisely<span>' + t + ' of 36</span></div><div class="pt-bar"><div style="width:' + Math.max(2, Math.round(t / 36 * 100)) + '%"></div></div></div></div>';

    h += '<div class="pt-bars">' + SECT.map(function (S, si) {
      var s = score(si), pct = Math.round(s.t / 12 * 100);
      var lbl = si === 0 ? (pct >= 67 ? 'Light armor' : pct >= 34 ? 'Some armor' : 'Heavy armor') : (pct >= 67 ? 'Strong' : pct >= 34 ? 'Growing' : 'Thin');
      return '<div class="pt-bar-row"><div class="pt-bar-head">' + esc(S.name) + '<span>' + lbl + '</span></div><div class="pt-bar"><div style="width:' + Math.max(2, pct) + '%"></div></div></div>';
    }).join('') + '</div>';

    h += '<h3 class="pt-h3 wa-gap">Your next step: ' + esc(ph[0].toLowerCase()) + '</h3>' +
      '<ol class="wa-phases">' + PHASES.map(function (x, k) { return '<li class="' + (k === P.phase ? 'is-here' : k < P.phase ? 'is-done' : '') + '"><strong>' + esc(x[0]) + '</strong>' + (k === P.phase ? '<br>' + esc(x[1]) : '') + '</li>'; }).join('') + '</ol>';

    var checked = st.people.filter(function (p) { return level(p); });
    h += '<h3 class="pt-h3 wa-gap">Your people</h3>';
    if (checked.length) h += checked.map(function (p) { var k = st.people.indexOf(p), lv = level(p); return '<div class="wa-person"><strong>' + esc(pname(p, k)) + '</strong><span class="wa-lv wa-lv' + lv + '">Level ' + lv + ': ' + esc(LEVELS[lv - 1].name) + '</span></div>'; }).join('') +
      '<p class="pt-small pt-muted">S.P.E.A.K.: if two or more filters fail, Level 1 only. If all pass consistently, Level 3 is possible. If there’s covenant, Level 4 is invited.</p>';
    else h += '<p class="pt-muted">You didn’t finish checking anyone. <button type="button" class="wa-link" data-a="toSpeak">Run one man through S.P.E.A.K.</button></p>';

    h += '<h3 class="pt-h3 wa-gap">The four levels of sharing</h3>' + LEVELS.map(function (L) { return '<div class="wa-lvl"><b>' + L.n + '</b><div><strong>' + esc(L.name) + '</strong> · ' + esc(L.who) + '<br><em>' + esc(L.say) + '</em><p>' + esc(L.what) + '</p></div></div>'; }).join('');

    h += '<h3 class="pt-h3 wa-gap">Your two sentences</h3><div class="wa-card"><p>“' + esc((st.s1 || '').trim()) + (filled(st.s2) ? ' ' + esc(st.s2.trim()) : '') + '”</p><p class="pt-small">Then stop. Presence is safe. Fixing is limited. Minimizing and curiosity without care are unsafe.</p></div>';

    h += '<h3 class="pt-h3 wa-gap">Seven days</h3><p class="pt-muted pt-small">One a day. Check it off when it’s done.</p>' +
      '<ol class="pt-days wa-days">' + DAYS.map(function (d, i) {
        return '<li><label><input type="checkbox" data-day="' + i + '"' + (st.done[i] ? ' checked' : '') + '><span class="pt-day-num">Day ' + (i + 1) + '</span><span class="pt-day-text"><strong>' + refLink(d[0]) + '</strong><br>' + esc(d[1]) + '</span></label></li>';
      }).join('') + '</ol><p class="pt-progress" id="waDaysDone" aria-live="polite">' + count(st.done) + ' of 7 days done</p>';

    h += verse(['Galatians 6:2', 'Carry each other’s burdens, and in this way you will fulfill the law of Christ.']);
    h += '<div class="wa-gem">Armor is not the enemy. Carrying it alone is.</div>';
    h += '<div class="wa-prayer"><span class="pt-label">A prayer</span><p>Lord, I’ve been proving for a long time. I’m tired of carrying this alone. Give me wisdom to know who has earned my weight, courage to share it with them, and humility to receive strength instead of pretending I don’t need it. Make me a safe man for my brothers, too. Amen.</p></div>';
    h += '<div class="wa-next pt-no-print"><span class="pt-label">Don’t have anyone yet?</span><p>That’s more common than you think, and it’s exactly why TheWrkShop groups exist. <a href="/get-known.html">Get known</a>: tell us a little about where you are and we’ll help you find a next step.</p></div>';

    h += '<div class="pt-actions pt-no-print"><button type="button" class="pt-btn" data-a="copy">Copy my results</button><button type="button" class="pt-btn pt-btn--ghost" data-a="print">Print / save as PDF</button></div>' +
      '<p class="pt-feedback pt-no-print" id="waFb" aria-live="polite"></p>' +
      '<div class="pt-actions pt-no-print"><button type="button" class="pt-btn pt-btn--ghost" data-a="restart">Retake it</button><button type="button" class="pt-btn pt-btn--ghost" data-a="clear">Clear my answers</button></div>' +
      '<p class="pt-muted pt-small pt-no-print">Your answers stay in this browser tab only. Closing the tab or pressing “Clear my answers” erases them.</p>';
    return h;
  }

  function summaryText() {
    var P = profile(), ph = PHASES[P.phase];
    var L = ['WHO GETS ACCESS TO MY WEIGHT? · My results', 'thewrkshop.com/tools/who-gets-access/', '', P.who + ' (' + total() + ' of 36): ' + P.line, 'Next step, ' + ph[0] + ': ' + ph[1], ''];
    st.people.forEach(function (p, k) { var lv = level(p); if (lv) L.push(pname(p, k) + ': Level ' + lv + ' (' + LEVELS[lv - 1].name + ')'); });
    L.push('', 'My two sentences: ' + [st.s1, st.s2].filter(filled).join(' '), '', 'The four levels:');
    LEVELS.forEach(function (x) { L.push(x.n + '. ' + x.name + ' (' + x.who + '): ' + x.say); });
    L.push('', 'S.P.E.A.K.: Silence, Power, Empathy, Access history, After effect.', '', 'Seven days:');
    DAYS.forEach(function (d, i) { L.push('Day ' + (i + 1) + ' (' + d[0] + '): ' + d[1]); });
    L.push('', 'Privacy is not sin. Isolation is.', '© 2026 TheWrkShop · thewrkshop.com');
    return L.join('\n');
  }
  function feedback(m) { var fb = document.getElementById('waFb'); if (fb) fb.textContent = m; }
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
    app.innerHTML = s === 'carry' ? carry() : s === 'speak' ? speak() : s === 'rule' ? rule() : s === 'results' ? results() : intro();
    document.body.classList.toggle('wa-has-results', s === 'results');
    if (focus) {
      var top = app.getBoundingClientRect().top + window.pageYOffset - 80;
      if (Math.abs(window.pageYOffset - top) > 40) window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      var h = app.querySelector('[tabindex="-1"]'); if (h) h.focus({ preventScroll: true });
    }
  }
  function go(stage) {
    st.stage = stage;
    if (stage === 'results' && !st.finished) { st.finished = true; track('whogetsaccess_finish'); }
    save(); render(true);
  }

  app.addEventListener('click', function (e) {
    var b = e.target.closest('[data-a]'); if (!b || b.disabled || b.tagName === 'INPUT') return;
    var a = b.getAttribute('data-a'), v = +b.getAttribute('data-v');
    if (a === 'begin') { if (!count(st.a)) track('whogetsaccess_start'); go(count(st.a) < NQ ? 'carry' : 'speak'); }
    else if (a === 'home') go('intro');
    else if (a === 'ans') {
      st.a[b.getAttribute('data-q')] = v; save();
      b.parentNode.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      b.closest('.wa-q').classList.add('is-done');
      var c = app.querySelectorAll('.pt-count')[1]; if (c) c.textContent = count(st.a) + ' of ' + NQ + ' answered';
      var t = app.querySelector('.pt-track > div'); if (t) t.style.width = Math.round(count(st.a) / NQ * 100) + '%';
      var er = document.getElementById('waErr'); if (er) er.textContent = '';
    }
    else if (a === 'toSpeak') {
      if (st.stage === 'carry' && count(st.a) < NQ) { var e2 = document.getElementById('waErr'); if (e2) e2.textContent = 'Answer all twelve to keep going. “Never” is a fine answer.'; return; }
      go('speak');
    }
    else if (a === 'toCarry') go('carry');
    else if (a === 'toRule') go('rule');
    else if (a === 'ptab') { st.pi = v; save(); render(); }
    else if (a === 'padd') { if (st.people.length < 3) { st.people.push(freshPerson()); st.pi = st.people.length - 1; save(); render(); } }
    else if (a === 'mark') { st.people[st.pi].m[b.getAttribute('data-k')] = v; save(); render(); }
    else if (a === 'resp') { st.resp = st.resp === v ? null : v; save(); render(); }
    else if (a === 'results') go('results');
    else if (a === 'copy') copyText(summaryText());
    else if (a === 'print') window.print();
    else if (a === 'restart') { clearAll(); save(); render(true); }
    else if (a === 'clear') { if (window.confirm('Erase your answers, including any names?')) { clearAll(); render(true); } }
  });
  app.addEventListener('change', function (e) {
    if (e.target.getAttribute('data-a') === 'cov') { st.people[st.pi].cov = e.target.checked; save(); render(); return; }
    var d = e.target.getAttribute('data-day'); if (d == null) return;
    if (e.target.checked) st.done[d] = true; else delete st.done[d];
    save(); var p = document.getElementById('waDaysDone'); if (p) p.textContent = count(st.done) + ' of 7 days done';
  });
  app.addEventListener('input', function (e) {
    var f = e.target.getAttribute('data-field'); if (!f) return;
    if (f === 'pname') {
      st.people[st.pi].name = e.target.value;
      var tab = app.querySelector('.wa-tabs [aria-selected="true"]'); var lv = level(st.people[st.pi]);
      if (tab) tab.textContent = pname(st.people[st.pi], st.pi) + (lv ? ' · L' + lv : '');
    } else {
      st[f] = e.target.value;
      var s = document.getElementById('waSms'); if (s) s.setAttribute('href', smsHref());
    }
    save();
  });

  render(false);
})();

/* Share row: Share / Copy link / Print for this page only. */
(function () {
  'use strict';
  document.querySelectorAll('.wa-share').forEach(function (bar) {
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
