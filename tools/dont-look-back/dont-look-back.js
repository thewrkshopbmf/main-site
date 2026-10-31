/* Don't Look Back: Salt or Shine? (Lot's wife, Genesis 19:26, Luke 17:32).
   Part 1: Salt or Shine? 20 statements in four areas (preservation, nostalgia, emotional loops, forward faith).
   Part 2: the 10-Credit Audit: how much of today's bandwidth the past is spending, then hand one back.
   Part 3: the Mirror Moment: See it, Say it, Shift it, Seal it → a printable Mirror Card.
   Results: profile (Preserver, Reliver, Idealist or Rebuilder), what letting go does and doesn't mean,
   a seven-day Forward Gaze path and a prayer.
   Everything stays in this browser tab (sessionStorage). GA receives start/finish counts only. */
(function () {
  'use strict';
  var KEY = 'tws.dontlookback.v1';
  var app = document.getElementById('lwApp');
  if (!app) return;

  /* ---------- content ---------- */
  var AREAS = [
    { name: 'Preservation', title: 'What am I keeping?', items: [
      'I still rehearse what someone did to me, even years later.',
      'I tell the same old stories about how I was wronged.',
      'Part of me holds onto a grudge so I won’t get hurt the same way again.',
      'I keep reminders of things I’m supposed to be past: old messages, photos, records.',
      'Letting it go would feel like letting them off the hook.'] },
    { name: 'Nostalgia', title: 'Am I living in a better yesterday?', items: [
      'I often feel like my best days are behind me.',
      'I compare my life now to a season that felt better.',
      'I resist change because the old way felt safer.',
      'I miss who I used to be more than I look forward to who I’m becoming.',
      'I romanticize parts of my past that weren’t actually good for me.'] },
    { name: 'Loops', title: 'Does the past keep pulling me back?', items: [
      'A small trigger can take me right back to an old pain.',
      'My mind replays old mistakes when I’m trying to rest or sleep.',
      'I see myself through what happened to me or what I did.',
      'Replaying the past feels strangely comfortable, even when it hurts.',
      'I expect the past to repeat itself.'] },
    { name: 'Forward faith', title: 'Am I facing forward?', items: [
      'I believe God is doing something new in my life right now.',
      'I can thank God for today even when yesterday was hard.',
      'I learn from my past without living in it.',
      'I can trust God with what’s next even when I can’t see it.',
      'When I fail, I get back up and move forward quickly.'] }
  ];
  var SCALE = ['Not me', 'A little', 'Often', 'Very me'];
  var PROF = [
    { who: 'The Preserver', line: 'You hold onto the past to protect yourself.',
      body: 'Salt keeps things from spoiling, and it keeps them from growing. Grudges, old stories and kept reminders feel like protection. But when you preserve your pain, you also preserve your potential. Lot’s wife left Sodom with her feet. Her heart stayed.',
      verse: ['Luke 17:32–33', 'Remember Lot’s wife! Whoever tries to keep their life will lose it, and whoever loses their life will preserve it.'],
      verse2: ['Ephesians 4:31–32', 'Get rid of all bitterness, rage and anger, brawling and slander, along with every form of malice. Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you.'],
      start: 'Name one thing you’ve been keeping “just in case.” Forgive the person in prayer, by name. You don’t have to tell them.' },
    { who: 'The Idealist', line: 'You romanticize what was.',
      body: 'Israel left Egypt, but their hearts stayed there. In the wilderness they remembered the fish and the cucumbers and forgot the chains. Good memories can compete with your future just as much as bad ones. Nostalgia edits out the slavery.',
      verse: ['Numbers 11:5', 'We remember the fish we ate in Egypt at no cost—also the cucumbers, melons, leeks, onions and garlic.'],
      verse2: ['Ecclesiastes 7:10', 'Do not say, “Why were the old days better than these?” For it is not wise to ask such questions.'],
      start: 'Write down the season you miss most. Next to it, write what it actually cost you. Then write one thing God is doing now.' },
    { who: 'The Reliver', line: 'You replay the past until it becomes who you are.',
      body: 'Loops feel like processing, but they’re usually preserving. The man scrolling old messages from the one who betrayed him thinks he’s working through it. He’s keeping it alive. Every replay spends today’s strength on yesterday’s pain, and the pain starts to feel like identity.',
      verse: ['2 Corinthians 5:17', 'Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!'],
      verse2: ['Isaiah 43:18–19', 'Forget the former things; do not dwell on the past. See, I am doing a new thing! Now it springs up; do you not perceive it?'],
      start: 'When the replay starts this week, stop and run a Mirror Moment: see it, say it, shift it, seal it. Every time.' },
    { who: 'The Rebuilder', line: 'You learn from the past and build forward.',
      body: 'You’re not pretending the past didn’t happen. You’ve let it teach you without letting it steer. That’s the forward gaze. Keep guarding it, because the pull to look back never fully goes away, and help other men turn around too.',
      verse: ['Philippians 3:13–14', 'Forgetting what is behind and straining toward what is ahead, I press on toward the goal to win the prize for which God has called me heavenward in Christ Jesus.'],
      verse2: ['Lamentations 3:22–23', 'Because of the LORD’s great love we are not consumed, for his compassions never fail. They are new every morning; great is your faithfulness.'],
      start: 'Find one man who’s stuck looking back and walk with him. Tell him what helped you turn around.' }
  ];
  // area index → profile index
  var AREA_PROF = [0, 1, 2];
  var DRAINS = ['Replaying what someone did to me', 'Regret over what I did or didn’t do', 'Missing how things used to be', 'Fear the past will repeat', 'Old wins I’m trying to live up to', 'Shame about who I was'];
  var LEFT_FOR = ['your wife', 'your kids', 'your work', 'hearing God', 'building what’s next'];
  var SEALS = [
    ['Philippians 3:13–14', 'Forgetting what is behind and straining toward what is ahead, I press on toward the goal.'],
    ['Isaiah 43:19', 'See, I am doing a new thing! Now it springs up; do you not perceive it?'],
    ['Lamentations 3:22–23', 'His compassions never fail. They are new every morning; great is your faithfulness.'],
    ['2 Corinthians 5:17', 'If anyone is in Christ, the new creation has come: The old has gone, the new is here!']
  ];
  var DAYS = [
    ['Genesis 19:15–26', 'Read it slowly. Where is your heart still looking back?'],
    ['Luke 17:32–33', 'Name one thing you’ve left on the outside but still hold on the inside.'],
    ['Numbers 11:4–6', 'Write what you romanticize about a past season. What did it actually cost you?'],
    ['Ephesians 4:31–32', 'Forgive one person in prayer, by name. You don’t have to tell them.'],
    ['Lamentations 3:22–23', 'Do the 10-Credit Audit morning and night: what is yesterday spending today?'],
    ['Isaiah 43:18–19', 'Write three things God is doing right now that you might be missing.'],
    ['Philippians 3:13–14', 'Write your next forward step and tell another man about it.']
  ];
  var NQ = 20;

  /* ---------- helpers ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function track(name) { try { if (window.gtag) window.gtag('event', name); } catch (e) {} }
  function bible(ref) { return 'https://www.biblegateway.com/passage/?search=' + encodeURIComponent(ref.replace(/–/g, '-')) + '&version=NIV'; }
  function refLink(ref) { return '<a href="' + bible(ref) + '" target="_blank" rel="noopener">' + esc(ref) + '</a>'; }
  function verse(v) { return '<blockquote class="lw-verse"><p>“' + esc(v[1]) + '”</p><cite>' + esc(v[0]) + ' (NIV)</cite></blockquote>'; }
  function fresh() { return { stage: 'intro', area: 0, a: {}, cr: {}, gave: null, see: '', say: '', shift: '', choose: '', seal: 0, done: {}, finished: false }; }
  var st;
  try { st = JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch (e) { st = null; }
  if (!st || typeof st !== 'object') st = fresh();
  var F = fresh(); Object.keys(F).forEach(function (k) { if (st[k] == null && F[k] != null) st[k] = F[k]; });
  function save() { try { sessionStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  function clearAll() { try { sessionStorage.removeItem(KEY); } catch (e) {} st = fresh(); }
  function count(o) { return Object.keys(o).length; }
  function filled(v) { return v != null && String(v).trim() !== ''; }
  function qid(ai, i) { return ai * 5 + i; }
  function mean(ai) { var s = 0, n = 0; for (var i = 0; i < 5; i++) { var v = st.a[qid(ai, i)]; if (v != null) { s += v; n++; } } return n ? s / n : null; }
  function profile() {
    var best = -1, bv = 0;
    for (var ai = 0; ai < 3; ai++) { var m = mean(ai); if (m != null && m > bv) { bv = m; best = ai; } }
    var fwd = mean(3);
    if (best < 0 || bv < 1.25 || (fwd != null && fwd >= 2.2 && bv < 1.6)) return 3;
    return AREA_PROF[best];
  }
  function spent() { var s = 0; Object.keys(st.cr).forEach(function (k) { s += st.cr[k]; }); return s; }

  /* ---------- screens ---------- */
  function progress(part, label) {
    return '<div class="pt-tool-top"><span class="pt-count">Part ' + part + ' of 3 · ' + label + '</span></div>' +
      '<div class="lw-steps" aria-hidden="true">' + [1, 2, 3].map(function (n) { return '<span class="' + (n < part ? 'is-done' : n === part ? 'is-here' : '') + '"></span>'; }).join('') + '</div>';
  }

  function intro() {
    var resume = count(st.a) > 0;
    return '<span class="pt-label">Remember Lot’s wife</span>' +
      verse(['Genesis 19:26', 'But Lot’s wife looked back, and she became a pillar of salt.']) +
      '<p>She did leave Sodom. That’s what makes it so sobering. Her feet obeyed. Her heart didn’t. And she became salt, the thing people used to <em>preserve</em> what would otherwise pass away.</p>' +
      '<p>We do the same thing. We preserve old hurts, old grudges, old wins and old seasons, and we carry them into today, which means they come with us into tomorrow.</p>' +
      '<div class="lw-scenes"><p>A man scrolls old messages from the one who betrayed him.</p><p>A man replays the job he lost, every night.</p><p>A man keeps telling the story of when life was good.</p><p class="lw-scenes-end">They all think they’re processing. They’re actually preserving.</p></div>' +
      '<p>About 10 minutes, in three parts:</p>' +
      '<ol class="lw-parts"><li><strong>Salt or Shine?</strong> Twenty quick statements. Where are you stuck?</li><li><strong>The 10-Credit Audit.</strong> How much of today is yesterday spending?</li><li><strong>The Mirror Moment.</strong> See it, say it, shift it, seal it.</li></ol>' +
      '<p class="pt-small pt-muted">Your answers stay on your screen.</p>' +
      '<div class="pt-actions"><button type="button" class="pt-btn pt-btn--ember" data-a="begin">' + (resume ? 'Pick up where I left off' : 'Start Salt or Shine?') + '</button>' +
      (resume && count(st.a) === NQ ? '<button type="button" class="pt-btn pt-btn--ghost" data-a="results">See my results</button>' : '') + '</div>';
  }

  function quiz() {
    var ai = st.area, A = AREAS[ai];
    return progress(1, 'Salt or Shine?') +
      '<div class="pt-tool-top"><span class="pt-count">Set ' + (ai + 1) + ' of 4</span><span class="pt-count">' + count(st.a) + ' of ' + NQ + ' answered</span></div>' +
      '<div class="pt-track"><div style="width:' + Math.round(count(st.a) / NQ * 100) + '%"></div></div>' +
      '<h2 class="pt-h3" tabindex="-1">' + esc(A.title) + '</h2><p class="pt-small pt-muted">How true is each one of you right now?</p>' +
      A.items.map(function (it, i) {
        var id = qid(ai, i), cur = st.a[id];
        return '<div class="lw-q' + (cur != null ? ' is-done' : '') + '"><p>' + esc(it) + '</p><div class="lw-chips" role="group" aria-label="' + esc(it) + '">' +
          SCALE.map(function (l, v) { return '<button type="button" data-a="ans" data-q="' + id + '" data-v="' + v + '" aria-pressed="' + (cur === v) + '">' + l + '</button>'; }).join('') + '</div></div>';
      }).join('') +
      '<p class="pt-error" id="lwErr" aria-live="polite"></p>' +
      '<div class="pt-actions"><button type="button" class="pt-btn pt-btn--ghost" data-a="qback">← Back</button>' +
      '<button type="button" class="pt-btn" data-a="qnext">' + (ai === 3 ? 'Next: the 10-Credit Audit →' : 'Next set →') + '</button></div>';
  }

  function coins() {
    var h = '<div class="lw-coins" aria-hidden="true">', idx = 0;
    DRAINS.forEach(function (d, i) { for (var k = 0; k < (st.cr[i] || 0); k++) h += '<span class="lw-coin is-salt" title="' + esc(d) + '"></span>', idx++; });
    for (; idx < 10; idx++) h += '<span class="lw-coin"></span>';
    return h + '</div>';
  }
  function credits() {
    var used = spent(), left = 10 - used;
    return progress(2, 'The 10-Credit Audit') +
      '<h2 class="pt-h3" tabindex="-1">How much of today is yesterday spending?</h2>' +
      '<p>Every morning God hands you a new 24 hours. Picture it as 10 credits of attention, emotion and energy. Before the day even starts, the past can spend some of them. Tap + for what it’s been taking.</p>' +
      coins() +
      '<p class="lw-left" aria-live="polite"><strong>' + left + ' of 10</strong> left for ' + (left <= 3 ? 'everything else: your wife, your kids, your work, hearing God.' : 'your wife, your kids, your work and hearing God.') + '</p>' +
      '<div class="lw-drains">' + DRAINS.map(function (d, i) {
        var n = st.cr[i] || 0;
        return '<div class="lw-drain' + (n ? ' is-on' : '') + '"><span>' + esc(d) + '</span><div class="lw-step"><button type="button" data-a="cr" data-i="' + i + '" data-d="-1" aria-label="Less for ' + esc(d) + '"' + (n ? '' : ' disabled') + '>−</button><b>' + n + '</b><button type="button" data-a="cr" data-i="' + i + '" data-d="1" aria-label="More for ' + esc(d) + '"' + (used >= 10 ? ' disabled' : '') + '>+</button></div></div>';
      }).join('') + '</div>' +
      (used ? '<div class="lw-give"><span class="pt-label">Hand one back</span><p>Which one is God asking you to stop paying for? Tap it, then give it to Him.</p><div class="lw-chips">' +
        DRAINS.map(function (d, i) { return (st.cr[i] ? '<button type="button" data-a="pickgive" data-v="' + i + '" aria-pressed="' + (st.gave === i) + '">' + esc(d) + '</button>' : ''); }).join('') + '</div>' +
        (st.gave != null && st.cr[st.gave] ? '<button type="button" class="pt-btn pt-btn--ember lw-givebtn" data-a="give">Give it to God</button>' : '') + '</div>' : '') +
      (st.given ? '<p class="lw-gem-sm">“When you give yesterday your energy, you give today your leftovers.” You just took ' + st.given + ' back.</p>' : '') +
      '<div class="pt-actions"><button type="button" class="pt-btn pt-btn--ghost" data-a="toQuiz">← Back</button><button type="button" class="pt-btn" data-a="toMirror">Next: the Mirror Moment →</button></div>';
  }

  function mirror() {
    var p = PROF[profile()];
    return progress(3, 'The Mirror Moment') +
      '<h2 class="pt-h3" tabindex="-1">See it. Say it. Shift it. Seal it.</h2>' +
      '<p>Loops keep you reacting. A mirror lets you reflect. Walk one thing from your past through these four steps.</p>' +
      '<div class="lw-mstep"><span class="lw-num">1 · See it</span><p class="pt-small">' + refLink('Psalm 139:23–24') + ': “Search me, God, and know my heart.”</p>' +
        '<div class="pt-field"><label for="lwSee">What from my past am I still looking back at?</label><textarea id="lwSee" data-field="see" rows="2" maxlength="600" placeholder="The way my dad talked to me. The business that failed. The season when everything worked…">' + esc(st.see) + '</textarea></div></div>' +
      '<div class="lw-mstep"><span class="lw-num">2 · Say it</span><p class="pt-small">' + refLink('James 5:16') + ': “Confess your sins to each other and pray for each other so that you may be healed.”</p>' +
        '<div class="pt-field"><label for="lwSay">Say it honestly: “I confess I’ve been holding onto…”</label><textarea id="lwSay" data-field="say" rows="2" maxlength="600" placeholder="…bitterness toward him, because it made me feel protected.">' + esc(st.say) + '</textarea></div></div>' +
      '<div class="lw-mstep"><span class="lw-num">3 · Shift it</span><p class="pt-small">' + refLink('2 Corinthians 10:5') + ': “We take captive every thought to make it obedient to Christ.”</p>' +
        '<div class="pt-field"><label for="lwShift">I release…</label><textarea id="lwShift" data-field="shift" rows="2" maxlength="400" placeholder="…what he owes me.">' + esc(st.shift) + '</textarea></div>' +
        '<div class="pt-field"><label for="lwChoose">And I choose…</label><textarea id="lwChoose" data-field="choose" rows="2" maxlength="400" placeholder="…to be present with my kids tonight.">' + esc(st.choose) + '</textarea></div></div>' +
      '<div class="lw-mstep"><span class="lw-num">4 · Seal it</span><p class="pt-small">' + refLink('Habakkuk 2:2') + ': “Write down the revelation and make it plain.” Pick the verse to carry this week.</p>' +
        '<div class="lw-seals">' + SEALS.map(function (s, i) { return '<button type="button" class="pt-option" data-a="seal" data-v="' + i + '" aria-pressed="' + (st.seal === i) + '"><span><strong>' + esc(s[0]) + '</strong><br>' + esc(s[1]) + '</span></button>'; }).join('') + '</div></div>' +
      '<p class="pt-small pt-muted">Your profile so far: <strong>' + esc(p.who) + '</strong>. You’ll see the full picture next.</p>' +
      '<div class="pt-actions"><button type="button" class="pt-btn pt-btn--ghost" data-a="toCredits">← Back</button><button type="button" class="pt-btn pt-btn--ember" data-a="results">See my results →</button></div>';
  }

  function mirrorCard() {
    var s = SEALS[st.seal || 0];
    return '<div class="lw-card"><span class="pt-label">My Mirror Card</span>' +
      '<p><strong>See it:</strong> ' + (filled(st.see) ? esc(st.see) : '<em>Not written</em>') + '</p>' +
      '<p><strong>Say it:</strong> I confess I’ve been holding onto ' + (filled(st.say) ? esc(st.say.replace(/^\s*…?/, '').replace(/\s+$/, '')) + (/[.!?]$/.test(st.say.trim()) ? '' : '.') : '<em>…</em>') + '</p>' +
      '<p><strong>Shift it:</strong> I release ' + (filled(st.shift) ? esc(st.shift.replace(/^\s*…?/, '')) : '<em>…</em>') + ', and I choose ' + (filled(st.choose) ? esc(st.choose.replace(/^\s*…?/, '')) : '<em>…</em>') + '.</p>' +
      '<p><strong>Seal it:</strong> “' + esc(s[1]) + '” ' + refLink(s[0]) + '</p></div>';
  }

  function results() {
    var pi = profile(), P = PROF[pi], used = spent();
    var h = '<span class="pt-label">Your results</span><h2 class="pt-h3" tabindex="-1">' + esc(P.who) + '</h2>' +
      '<div class="lw-profile' + (pi === 3 ? ' is-shine' : '') + '"><p class="lw-line">' + esc(P.line) + '</p><p>' + esc(P.body) + '</p>' + verse(P.verse) + verse(P.verse2) +
      '<p><strong>Start here:</strong> ' + esc(P.start) + '</p></div>';

    h += '<h3 class="pt-h3 lw-gap">Salt or shine?</h3><div class="pt-bars">' + AREAS.map(function (A, ai) {
      var m = mean(ai), pct = m == null ? 0 : Math.round(m / 3 * 100);
      var lbl = ai === 3 ? (m == null ? 'Not answered' : m >= 2 ? 'Strong' : m >= 1 ? 'Growing' : 'Weak right now') : (m == null ? 'Not answered' : m >= 2 ? 'Heavy' : m >= 1 ? 'Some' : 'Light');
      return '<div class="pt-bar-row' + ((ai < 3 && AREA_PROF[ai] === pi) ? ' is-top' : '') + (ai === 3 ? ' lw-shine' : '') + '"><div class="pt-bar-head">' + (ai === 3 ? 'Shine: ' : 'Salt: ') + esc(A.name) + '<span>' + lbl + '</span></div><div class="pt-bar"><div style="width:' + Math.max(2, pct) + '%"></div></div></div>';
    }).join('') + '</div>';

    h += '<h3 class="pt-h3 lw-gap">Your 10 credits</h3>' + coins() +
      (used ? '<p>The past is spending <strong>' + used + ' of your 10 credits</strong>, which leaves <strong>' + (10 - used) + '</strong> for ' + LEFT_FOR.slice(0, 4).join(', ') + '. If you’ve wondered why you’re short-fused or not fully present, start here.</p>' +
        DRAINS.map(function (d, i) { return st.cr[i] ? '<p class="lw-drainline"><span>' + esc(d) + '</span><b>' + st.cr[i] + '</b></p>' : ''; }).join('') +
        (st.given ? '<p>You handed <strong>' + st.given + '</strong> back to God. Do it again tomorrow morning.</p>' : '')
        : '<p>You didn’t mark any credits as spent by the past. Try the audit again tomorrow morning, before the day gets going.</p>') +
      '<p class="lw-gem-sm">Heaven deposits mercy daily. Yesterday will spend it if you let it.</p>';

    h += '<h3 class="pt-h3 lw-gap">Your Mirror Moment</h3>' + mirrorCard() +
      '<p class="pt-small pt-muted">Print this card or set a photo of it as your lock screen this week.</p>';

    h += '<h3 class="pt-h3 lw-gap">What letting go does and doesn’t mean</h3><div class="lw-two">' +
      '<div><span class="pt-label">It doesn’t mean</span><ul><li>Pretending it didn’t happen</li><li>Forgetting what God brought you through</li><li>Skipping grief</li><li>Never talking about it</li><li>Excusing harm done to you</li></ul></div>' +
      '<div><span class="pt-label">It does mean</span><ul><li>It no longer gets to steer</li><li>You stop rehearsing it</li><li>You learn from it without living in it</li><li>You receive today as a gift</li><li>You face where God is leading</li></ul></div></div>' +
      '<p class="pt-small">Scripture tells us to remember God’s faithfulness (' + refLink('Psalm 77:11') + '). Remembering what God did is worship. Rehearsing what was done to you is a loop.</p>';

    h += '<h3 class="pt-h3 lw-gap">A seven-day Forward Gaze</h3><p class="pt-muted pt-small">One a day. Check it off when it’s done.</p>' +
      '<ol class="pt-days lw-days">' + DAYS.map(function (d, i) {
        return '<li><label><input type="checkbox" data-day="' + i + '"' + (st.done[i] ? ' checked' : '') + '><span class="pt-day-num">Day ' + (i + 1) + '</span><span class="pt-day-text"><strong>' + refLink(d[0]) + '</strong><br>' + esc(d[1]) + '</span></label></li>';
      }).join('') + '</ol><p class="pt-progress" id="lwDaysDone" aria-live="polite">' + count(st.done) + ' of 7 days done</p>';

    h += '<div class="lw-gem">Salt keeps things from spoiling, and from growing. When you preserve your pain, you also preserve your potential.</div>';
    h += '<div class="lw-prayer"><span class="pt-label">A prayer</span><p>Lord, I’ve left some things with my feet but not with my heart. I’ve kept what You told me to leave, and I’ve spent today’s grace on yesterday. I give it back to You. Heal what needs healing, and turn my face forward. Thank You for new mercy this morning. I don’t want to be preserved. I want to be transformed. Amen.</p></div>';

    h += '<div class="pt-actions pt-no-print"><button type="button" class="pt-btn" data-a="copy">Copy my results</button><button type="button" class="pt-btn pt-btn--ghost" data-a="print">Print / save as PDF</button></div>' +
      '<p class="pt-feedback pt-no-print" id="lwFb" aria-live="polite"></p>' +
      '<div class="pt-actions pt-no-print"><button type="button" class="pt-btn pt-btn--ghost" data-a="restart">Retake it</button><button type="button" class="pt-btn pt-btn--ghost" data-a="clear">Clear my answers</button></div>' +
      '<p class="pt-muted pt-small pt-no-print">Your answers stay in this browser tab only. Closing the tab or pressing “Clear my answers” erases them.</p>';
    return h;
  }

  function summaryText() {
    var P = PROF[profile()], used = spent(), s = SEALS[st.seal || 0];
    var L = ['DON’T LOOK BACK · Salt or Shine? My results', 'thewrkshop.com/tools/dont-look-back/', '', P.who + ': ' + P.line, 'Start here: ' + P.start, P.verse[0] + ': “' + P.verse[1] + '”', ''];
    AREAS.forEach(function (A, ai) { var m = mean(ai); L.push((ai === 3 ? 'Shine: ' : 'Salt: ') + A.name + ': ' + (m == null ? 'not answered' : (Math.round(m / 3 * 100) + '%'))); });
    L.push('', 'The past is spending ' + used + ' of my 10 credits.');
    DRAINS.forEach(function (d, i) { if (st.cr[i]) L.push('- ' + d + ': ' + st.cr[i]); });
    L.push('', 'MY MIRROR CARD', 'See it: ' + (st.see || '').trim(), 'Say it: I confess I’ve been holding onto ' + (st.say || '').trim(), 'Shift it: I release ' + (st.shift || '').trim() + ', and I choose ' + (st.choose || '').trim(), 'Seal it: “' + s[1] + '” (' + s[0] + ')', '', 'Seven-day Forward Gaze:');
    DAYS.forEach(function (d, i) { L.push('Day ' + (i + 1) + ' (' + d[0] + '): ' + d[1]); });
    L.push('', 'Remember Lot’s wife. (Luke 17:32)', '© 2026 TheWrkShop · thewrkshop.com');
    return L.join('\n');
  }
  function feedback(m) { var fb = document.getElementById('lwFb'); if (fb) fb.textContent = m; }
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
    app.innerHTML = s === 'quiz' ? quiz() : s === 'credits' ? credits() : s === 'mirror' ? mirror() : s === 'results' ? results() : intro();
    document.body.classList.toggle('lw-has-results', s === 'results');
    if (focus) {
      var top = app.getBoundingClientRect().top + window.pageYOffset - 80;
      if (Math.abs(window.pageYOffset - top) > 40) window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      var h = app.querySelector('[tabindex="-1"]'); if (h) h.focus({ preventScroll: true });
    }
  }
  function go(stage) {
    st.stage = stage;
    if (stage === 'results' && !st.finished) { st.finished = true; track('dontlookback_finish'); }
    save(); render(true);
  }
  function areaDone(ai) { for (var i = 0; i < 5; i++) if (st.a[qid(ai, i)] == null) return false; return true; }

  app.addEventListener('click', function (e) {
    var b = e.target.closest('[data-a]'); if (!b || b.disabled) return;
    var a = b.getAttribute('data-a'), v = +b.getAttribute('data-v');
    if (a === 'begin') {
      if (!count(st.a)) track('dontlookback_start');
      var ai = 0; while (ai < 3 && areaDone(ai)) ai++;
      st.area = ai; go('quiz');
    }
    else if (a === 'ans') {
      var q = +b.getAttribute('data-q'); st.a[q] = v; save();
      b.parentNode.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      b.closest('.lw-q').classList.add('is-done');
      var c = app.querySelectorAll('.pt-count')[2]; if (c) c.textContent = count(st.a) + ' of ' + NQ + ' answered';
      var t = app.querySelector('.pt-track > div'); if (t) t.style.width = Math.round(count(st.a) / NQ * 100) + '%';
      var err = document.getElementById('lwErr'); if (err) err.textContent = '';
    }
    else if (a === 'qnext') {
      if (!areaDone(st.area)) { var er = document.getElementById('lwErr'); if (er) er.textContent = 'Answer all five to keep going. “Not me” is a fine answer.'; return; }
      if (st.area < 3) { st.area++; go('quiz'); } else go('credits');
    }
    else if (a === 'qback') { if (st.area > 0) { st.area--; go('quiz'); } else go('intro'); }
    else if (a === 'cr') {
      var i = +b.getAttribute('data-i'), d = +b.getAttribute('data-d'), n = (st.cr[i] || 0) + d;
      if (n < 0 || (d > 0 && spent() >= 10)) return;
      if (n) st.cr[i] = n; else delete st.cr[i];
      if (st.gave === i && !n) st.gave = null;
      save(); render();
    }
    else if (a === 'pickgive') { st.gave = v; save(); render(); }
    else if (a === 'give') {
      if (st.gave == null || !st.cr[st.gave]) return;
      st.given = (st.given || 0) + st.cr[st.gave]; delete st.cr[st.gave]; st.gave = null; save(); render();
    }
    else if (a === 'toQuiz') { st.area = 3; go('quiz'); }
    else if (a === 'toCredits') go('credits');
    else if (a === 'toMirror') go('mirror');
    else if (a === 'seal') { st.seal = v; save(); b.parentNode.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); }
    else if (a === 'results') go('results');
    else if (a === 'copy') copyText(summaryText());
    else if (a === 'print') window.print();
    else if (a === 'restart') { clearAll(); save(); render(true); }
    else if (a === 'clear') { if (window.confirm('Erase your answers?')) { clearAll(); render(true); } }
  });
  app.addEventListener('input', function (e) {
    var f = e.target.getAttribute('data-field'); if (!f) return;
    st[f] = e.target.value; save();
  });
  app.addEventListener('change', function (e) {
    var d = e.target.getAttribute('data-day'); if (d == null) return;
    if (e.target.checked) st.done[d] = true; else delete st.done[d];
    save(); var p = document.getElementById('lwDaysDone'); if (p) p.textContent = count(st.done) + ' of 7 days done';
  });

  render(false);
})();

/* Share row: Share / Copy link / Print for this page only. */
(function () {
  'use strict';
  document.querySelectorAll('.lw-share').forEach(function (bar) {
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
