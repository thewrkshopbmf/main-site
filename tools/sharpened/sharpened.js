/* Sharpened, Not Sheltered: what comes out when iron hits iron (Friction as Formation).
   Part 1: the Reflex Test (8 friction moments, tap your first reaction) → escape-pattern profile.
   Part 2: the Ego Check (tap what's uncomfortably true). Part 3: the Staying Scale.
   Part 4: the Iron Loop on one real moment (friction → reaction → revelation → surrender → formation).
   Then results: profile, Old/New response chart, a live 90-Second Window drill, a feedback text to
   send a brother, a seven-day path, the declaration and a prayer.
   Everything stays in this browser tab (sessionStorage). GA receives start/finish counts only. */
(function () {
  'use strict';
  var KEY = 'tws.sharpened.v1';
  var app = document.getElementById('shApp');
  if (!app) return;

  /* ---------- content ---------- */
  // 0 Deflect, 1 Distance, 2 Dominate, 3 Distract, 4 Lean in
  var PAT = [
    { name: 'Deflection', who: 'The Deflector', protects: 'your image', blocks: 'ownership',
      sounds: '“That’s not what I meant.” “You took it wrong.” “That’s just how I am.”',
      truth: 'Explaining feels like clarity, but it often keeps the truth from landing. A man who always has a reason never has to change.',
      verse: ['Proverbs 15:31–32', 'Whoever heeds life-giving correction will be at home among the wise. Those who disregard discipline despise themselves, but the one who heeds correction gains understanding.'],
      newr: 'Say “Say more” and listen before you explain anything.',
      practice: 'The next time you’re corrected, say only, “Thank you. Let me think about that.” Explain nothing for 24 hours.' },
    { name: 'Distance', who: 'The Distancer', protects: 'your vulnerability', blocks: 'connection',
      sounds: '“I’m good.” “It’s whatever.” “I don’t need this.”',
      truth: 'Going quiet feels like keeping the peace, but it leaves the room before God can do anything. You can’t be sharpened from across the room.',
      verse: ['Ecclesiastes 4:9–10', 'Two are better than one, because they have a good return for their labor: If either of them falls down, one can help the other up. But pity anyone who falls and has no one to help them up.'],
      newr: 'Stay in the room and say, “This is hard for me, but I’m not leaving.”',
      practice: 'When you feel yourself pulling away this week, stay five more minutes. Then follow up within 24 hours.' },
    { name: 'Dominance', who: 'The Dominator', protects: 'your power', blocks: 'teachability',
      sounds: '“Well, what about you?” “Let’s be fair here.” “That’s not the real issue.”',
      truth: 'Winning the conversation can cost you the lesson. If no one can challenge you, no one can change you.',
      verse: ['Philippians 2:3–4', 'Do nothing out of selfish ambition or vain conceit. Rather, in humility value others above yourselves, not looking to your own interests but each of you to the interests of the others.'],
      newr: 'Ask one honest question before you make your point.',
      practice: 'In every disagreement this week, ask a question before you make a point, and let someone else have the last word once.' },
    { name: 'Distraction', who: 'The Distractor', protects: 'you from exposure', blocks: 'transformation',
      sounds: '“That’s deep.” “We all struggle.” A joke right when it gets real.',
      truth: 'Humor and spiritual language can keep a moment at arm’s length. The mirror only works if you keep looking.',
      verse: ['James 1:23–24', 'Anyone who listens to the word but does not do what it says is like someone who looks at his face in a mirror and, after looking at himself, goes away and immediately forgets what he looks like.'],
      newr: 'When it gets real, say “That landed. Give me a second,” and stay with it.',
      practice: 'When a conversation gets close this week, don’t joke or change the subject. Name one honest thing instead.' },
    { name: 'Leaning in', who: 'The Sharpenable Man', protects: 'nothing he needs to hide', blocks: 'nothing',
      sounds: '“Say more.” “You may be seeing something I need to hear.”',
      truth: 'You’re learning to stay when friction hits. Keep it up, and help other men do the same. Sharpening goes both ways.',
      verse: ['Proverbs 27:17', 'As iron sharpens iron, so one person sharpens another.'],
      newr: 'Keep inviting truth, and offer it back with love.',
      practice: 'Ask one man this week, “What have you seen in me that I might need to hear?” Then ask how you can sharpen him.' }
  ];
  // [moment, first-response options as [text, pattern]] (order varies so the pattern isn't obvious)
  var SC = [
    ['A man in your group points out that something you said hurt someone.', [['“That’s not what I meant. They took it wrong.”', 0], ['“Okay. Say more. I want to understand.”', 4], ['You go quiet and think about skipping next week.', 1], ['“Well, what about the stuff you’ve said?”', 2], ['You crack a joke and move the conversation along.', 3]]],
    ['Your wife says you weren’t really listening to her.', [['You stop talking and get short for the rest of the night.', 1], ['“I was listening. I’ve just had a long day.”', 0], ['“You’re right. Can you tell me again? I’m listening now.”', 4], ['“You don’t listen to me either.”', 2], ['You laugh it off: “Selective hearing, I guess.”', 3]]],
    ['Your boss corrects your work in front of the team.', [['You explain why you did it that way, right there.', 0], ['You make a light comment so it doesn’t feel so heavy.', 3], ['You nod, then check out for the rest of the meeting.', 1], ['You ask afterward, “What would you have done differently?”', 4], ['You push back to show you know what you’re doing.', 2]]],
    ['Someone disagrees with a view you care about deeply.', [['You press harder until they back down.', 2], ['“Help me see how you got there.”', 4], ['You decide they don’t get it and stop engaging.', 1], ['“We all see things differently,” and you change the subject.', 3], ['You reframe what you said so you were never wrong.', 0]]],
    ['You share an idea and nobody responds.', [['You make a joke about it bombing.', 3], ['You keep pushing it until someone agrees.', 2], ['You stop sharing ideas with this group.', 1], ['You ask, “What am I missing? Be honest.”', 4], ['“I just meant it as a thought. It wasn’t a big deal.”', 0]]],
    ['A friend asks how you’re really doing after a rough season.', [['“I’m good, man. Busy.”', 1], ['“Honestly? Not great. Can we talk?”', 4], ['You talk about the season in general and never about you.', 3], ['You list everything you’re handling so he knows you’ve got it.', 2], ['“It’s been hard, but that’s just life. Everybody’s tired.”', 0]]],
    ['Someone misreads your intent and gets upset with you.', [['“That is not what I said, and you know it.”', 2], ['You spend ten minutes explaining your intentions.', 0], ['“I can see why it landed that way. Help me understand.”', 4], ['You let it go and quietly keep your distance from them.', 1], ['You smooth it over with humor and move on.', 3]]],
    ['A brother says, “I think pride might be in this.”', [['You get quiet and avoid him for a while.', 1], ['“Maybe. Where are you seeing it?”', 4], ['“Pride? I’m just trying to do the right thing.”', 0], ['“Everybody’s got some pride. That’s deep, man.”', 3], ['You point out where he’s been proud lately.', 2]]]
  ];
  var EGO = [
    'I want feedback, but only if it comes gently.', 'I get tense when people don’t see my good intentions.', 'I replay conversations where I felt slighted.',
    'I struggle to receive correction without explaining myself.', 'I want honesty from others, but I don’t always like it.', 'I can act humble while still resisting input.',
    'I’ve cut people off instead of staying open.', 'I sometimes confuse being strong with being uncorrectable.', 'I’d rather be admired than known.',
    'I can sound reflective while still avoiding surrender.'
  ];
  var STAY = ['When tension rises, I stay emotionally present.', 'When I feel misunderstood, I stay engaged.', 'When corrected, I can listen without shutting down.', 'When I’m uncomfortable, I resist pulling away.', 'When I’m exposed, I can stay open.'];
  var STAYL = ['Rarely', 'Sometimes', 'Often', 'Usually'];
  var FRICT = ['I was corrected', 'Someone disagreed with me', 'I was misunderstood', 'I was overlooked', 'Someone let me down', 'I was interrupted or challenged'];
  var REACT = ['Anger', 'Shut down', 'Defensive', 'Sarcasm', 'Took control', 'Pulled away', 'Blamed', 'Smoothed it over'];
  var ROOTS = [
    ['Insecurity', 'My value doesn’t depend on being right or in control.', ['Colossians 3:3', 'For you died, and your life is now hidden with Christ in God.']],
    ['Pride', 'Humility lets me be taught.', ['Proverbs 16:18', 'Pride goes before destruction, a haughty spirit before a fall.']],
    ['Fear of rejection', 'I’m accepted in Christ, even when someone is upset with me.', ['Romans 15:7', 'Accept one another, then, just as Christ accepted you, in order to bring praise to God.']],
    ['Fear of being exposed', 'Walking in the light is where real fellowship is.', ['1 John 1:7', 'But if we walk in the light, as he is in the light, we have fellowship with one another, and the blood of Jesus, his Son, purifies us from all sin.']],
    ['Need for control', 'I can trust God with how this turns out.', ['Proverbs 3:5–6', 'Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.']],
    ['Feeling owed', 'I can value others above myself.', ['Philippians 2:3', 'Do nothing out of selfish ambition or vain conceit. Rather, in humility value others above yourselves.']],
    ['An old hurt', 'God is close when I’m hurting, and I don’t have to protect it alone.', ['Psalm 34:18', 'The LORD is close to the brokenhearted and saves those who are crushed in spirit.']],
    ['Needing to look strong', 'Christ lives in me. I don’t have to perform.', ['Galatians 2:20', 'I have been crucified with Christ and I no longer live, but Christ lives in me.']]
  ];
  var LOOP = ['Friction', 'Reaction', 'Revelation', 'Surrender', 'Formation'];
  var DAYS = [
    ['Proverbs 27:17', 'Notice every moment of friction today. Don’t fix anything. Just count them and notice what came out.'],
    ['James 1:19', 'In one conversation, be the last to speak. Listen all the way through before you answer.'],
    ['Proverbs 15:31–32', 'Ask one person, “Is there anything you’ve seen in me I might need to hear?” Thank them. Don’t explain.'],
    ['Romans 12:16', 'Spend time with someone who sees things differently than you. Stay curious, not combative.'],
    ['Philippians 2:3–4', 'Let someone else be right today without correcting them.'],
    ['Galatians 6:1–2', 'Lean into one hard conversation you’ve been avoiding. Use the 90-Second Window.'],
    ['Hebrews 10:24–25', 'Tell a brother what you’re learning about yourself, and set a regular time to meet.']
  ];
  var FEEL = ['Angry', 'Embarrassed', 'Hurt', 'Defensive', 'Anxious', 'Dismissed', 'Ashamed', 'Unheard'];
  var NS = SC.length;

  /* ---------- helpers ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function track(name) { try { if (window.gtag) window.gtag('event', name); } catch (e) {} }
  function bible(ref) { return 'https://www.biblegateway.com/passage/?search=' + encodeURIComponent(ref.replace(/–/g, '-')) + '&version=NIV'; }
  function refLink(ref) { return '<a href="' + bible(ref) + '" target="_blank" rel="noopener">' + esc(ref) + '</a>'; }
  function verse(v) { return '<blockquote class="sh-verse"><p>“' + esc(v[1]) + '”</p><cite>' + esc(v[0]) + ' (NIV)</cite></blockquote>'; }
  function fresh() { return { stage: 'intro', i: 0, sc: {}, ego: [], stay: {}, lp: { f: '', ft: '', r: [], rt: '', root: null, nr: '', step: 0 }, feel: '', name: '', done: {}, finished: false }; }
  var st;
  try { st = JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch (e) { st = null; }
  if (!st || typeof st !== 'object') st = fresh();
  var F = fresh(); Object.keys(F).forEach(function (k) { if (st[k] == null) st[k] = F[k]; });
  function save() { try { sessionStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  function clearAll() { try { sessionStorage.removeItem(KEY); } catch (e) {} st = fresh(); }
  function count(o) { return Object.keys(o).length; }
  function filled(v) { return v != null && String(v).trim() !== ''; }

  function tally() {
    var t = [0, 0, 0, 0, 0];
    Object.keys(st.sc).forEach(function (k) { var opt = SC[+k][1][st.sc[k]]; if (opt) t[opt[1]]++; });
    return t;
  }
  function topPattern() {
    var t = tally(), best = -1, bv = 0;
    for (var p = 0; p < 4; p++) if (t[p] > bv) { bv = t[p]; best = p; }
    if (best < 0 || t[4] > bv + 1) return 4;
    return best;
  }
  function stayScore() { var s = 0, n = 0; Object.keys(st.stay).forEach(function (k) { s += st.stay[k] + 1; n++; }); return n ? { sum: s, n: n } : null; }
  function root() { return st.lp.root != null ? ROOTS[st.lp.root] : null; }
  function exitStep() {
    var L = st.lp;
    if (!filled(L.f) && !filled(L.ft)) return 0;
    if (!L.r.length && !filled(L.rt)) return 1;
    if (L.root == null) return 2;
    if (!filled(L.nr)) return 4;
    return 5;
  }
  function chips(name, list, sel, multi) {
    return '<div class="sh-chips" role="group">' + list.map(function (c, i) {
      var on = multi ? sel.indexOf(i) > -1 : sel === i;
      return '<button type="button" data-a="' + name + '" data-v="' + i + '" aria-pressed="' + on + '">' + esc(typeof c === 'string' ? c : c[0]) + '</button>';
    }).join('') + '</div>';
  }

  /* ---------- screens ---------- */
  function intro() {
    var resume = count(st.sc) > 0;
    return '<span class="pt-label">Moment in the room</span>' +
      '<p class="sh-room">You’re not alone this time. There are voices around you. Different opinions, personalities and ways of seeing things. Then someone challenges you. Someone misunderstands you. Someone doesn’t affirm you the way you expected. And something deeper gets exposed. Not your strengths. <strong>Your reactions.</strong></p>' +
      '<p class="sh-read"><span class="pt-label">Read this out loud</span>You don’t grow in isolation. You grow in interaction. Not when life is easy, but when people reveal you.</p>' +
      verse(['Proverbs 27:17', 'As iron sharpens iron, so one person sharpens another.']) +
      '<p>This takes about 10 minutes, in four short parts:</p>' +
      '<ol class="sh-parts"><li><strong>The Reflex Test.</strong> Eight real moments of friction. Tap what you’d honestly do first.</li><li><strong>The Ego Check.</strong> Tap what’s uncomfortably true.</li><li><strong>The Staying Scale.</strong> Do you stay when it gets uncomfortable?</li><li><strong>The Iron Loop.</strong> Walk one real moment from friction to formation.</li></ol>' +
      '<p class="pt-small pt-muted">Then you’ll get your escape pattern, a live 90-Second Window drill, a text you can send to a brother and a seven-day path. Your answers stay on your screen.</p>' +
      '<div class="pt-actions"><button type="button" class="pt-btn pt-btn--ember" data-a="begin">' + (resume ? 'Pick up where I left off' : 'Start the Reflex Test') + '</button>' +
      (resume && count(st.sc) === NS ? '<button type="button" class="pt-btn pt-btn--ghost" data-a="results">See my results</button>' : '') + '</div>';
  }

  function progress(part, label) {
    return '<div class="pt-tool-top"><span class="pt-count">Part ' + part + ' of 4 · ' + label + '</span></div>' +
      '<div class="sh-steps" aria-hidden="true">' + [1, 2, 3, 4].map(function (n) { return '<span class="' + (n < part ? 'is-done' : n === part ? 'is-here' : '') + '"></span>'; }).join('') + '</div>';
  }

  function reflex() {
    var i = st.i, s = SC[i], cur = st.sc[i];
    return progress(1, 'The Reflex Test') +
      '<div class="pt-tool-top"><span class="pt-count">Moment ' + (i + 1) + ' of ' + NS + '</span><span class="pt-count">' + count(st.sc) + ' answered</span></div>' +
      '<div class="pt-track"><div style="width:' + Math.round(count(st.sc) / NS * 100) + '%"></div></div>' +
      '<p class="sh-moment" tabindex="-1">' + esc(s[0]) + '</p>' +
      '<fieldset class="pt-fieldset"><legend class="pt-legend sh-legend">Honestly, what comes out of you first?</legend>' +
        s[1].map(function (o, v) { return '<button type="button" class="pt-option" data-a="pick" data-v="' + v + '" aria-pressed="' + (cur === v) + '">' + esc(o[0]) + '</button>'; }).join('') +
      '</fieldset><p class="pt-small pt-muted">Not what you should do. What you’d actually do.</p>' +
      '<div class="pt-actions"><button type="button" class="pt-btn pt-btn--ghost" data-a="back">← Back</button>' +
        (cur != null ? '<button type="button" class="pt-btn" data-a="fwd">' + (i === NS - 1 ? 'Next: the Ego Check →' : 'Next →') + '</button>' : '') + '</div>';
  }

  function ego() {
    return progress(2, 'The Ego Check') +
      '<h2 class="pt-h3" tabindex="-1">What am I protecting?</h2>' +
      '<p>Ego isn’t always loud. Sometimes it’s self-protection dressed up as maturity. Tap every statement that feels uncomfortably true.</p>' +
      '<div class="sh-ego">' + EGO.map(function (e, i) { return '<button type="button" class="pt-option" data-a="ego" data-v="' + i + '" aria-pressed="' + (st.ego.indexOf(i) > -1) + '"><span class="sh-box" aria-hidden="true"></span>' + esc(e) + '</button>'; }).join('') + '</div>' +
      '<p class="pt-small pt-muted" aria-live="polite">' + st.ego.length + ' tapped. Most honest men tap at least two.</p>' +
      '<div class="pt-actions"><button type="button" class="pt-btn pt-btn--ghost" data-a="toReflex">← Back</button><button type="button" class="pt-btn" data-a="toStay">Next: the Staying Scale →</button></div>';
  }

  function stay() {
    return progress(3, 'The Staying Scale') +
      '<h2 class="pt-h3" tabindex="-1">Do I stay when it’s uncomfortable?</h2>' +
      '<p>Most men don’t fail because they lack insight. They leave the room too early. Not always physically. Sometimes emotionally, mentally or relationally.</p>' +
      STAY.map(function (q, i) {
        return '<div class="sh-rate"><p>' + esc(q) + '</p><div class="sh-chips" role="group" aria-label="' + esc(q) + '">' +
          STAYL.map(function (l, v) { return '<button type="button" data-a="stay" data-q="' + i + '" data-v="' + v + '" aria-pressed="' + (st.stay[i] === v) + '">' + l + '</button>'; }).join('') + '</div></div>';
      }).join('') +
      '<div class="pt-actions"><button type="button" class="pt-btn pt-btn--ghost" data-a="toEgo">← Back</button><button type="button" class="pt-btn" data-a="toLoop">Next: the Iron Loop →</button></div>';
  }

  function loop() {
    var L = st.lp, r = root(), x = exitStep();
    var h = progress(4, 'The Iron Loop') +
      '<h2 class="pt-h3" tabindex="-1">Walk one real moment through the loop</h2>' +
      '<div class="sh-loop" aria-label="The Iron Loop">' + LOOP.map(function (n, i) { return '<span class="' + (i < x ? 'is-done' : i === x ? 'is-here' : '') + '">' + n + '</span>'; }).join('<i>→</i>') + '</div>' +
      '<p class="pt-small pt-muted">Most men never reach formation, because they exit at reaction. Think of a recent moment of tension and walk it all the way through.</p>' +

      '<div class="sh-lstep"><span class="sh-num">1 · Friction</span><p><strong>What happened?</strong></p>' + chips('lf', FRICT, FRICT.indexOf(L.f), false) +
        '<div class="pt-field"><label for="shFt">In a sentence <span class="pt-optional">(optional)</span></label><textarea id="shFt" data-field="ft" rows="2" maxlength="600" placeholder="At dinner, my son said I always…">' + esc(L.ft) + '</textarea></div></div>' +

      '<div class="sh-lstep"><span class="sh-num">2 · Reaction</span><p><strong>What came out of me?</strong> Tap all that fit.</p>' + chips('lr', REACT, L.r, true) +
        '<div class="pt-field"><label for="shRt">What I actually said or did <span class="pt-optional">(optional)</span></label><textarea id="shRt" data-field="rt" rows="2" maxlength="600">' + esc(L.rt) + '</textarea></div></div>' +

      '<div class="sh-lstep"><span class="sh-num">3 · Revelation</span><p><strong>What might it reveal underneath?</strong> Pick the one that rings truest.</p>' + chips('lroot', ROOTS, L.root, false) + '</div>' +

      '<div class="sh-lstep"><span class="sh-num">4 · Surrender</span>' +
        (r ? '<p><strong>The truth to return to:</strong> ' + esc(r[1]) + '</p>' + verse(r[2]) +
          '<p class="sh-pray">Lord, I see that I’ve been protecting myself from ' + esc(r[0].toLowerCase()) + '. I don’t want to defend what You want to form. Have Your way in me.</p>'
          : '<p class="pt-muted">Pick a revelation above, and the truth to return to will appear here.</p>') + '</div>' +

      '<div class="sh-lstep"><span class="sh-num">5 · Formation</span>' +
        '<div class="pt-field"><label for="shNr">Next time this happens, I will…</label><textarea id="shNr" data-field="nr" rows="2" maxlength="600" placeholder="' + esc(PAT[topPattern()].newr) + '">' + esc(L.nr) + '</textarea></div>' +
        '<p class="pt-small pt-muted">Stuck? Try one of these: “Say more.” “You may be seeing something I need to hear.” “This is hard for me, but I’m not leaving.” “Give me a second. I want to respond, not react.”</p></div>' +

      '<div class="pt-actions"><button type="button" class="pt-btn pt-btn--ghost" data-a="toStay">← Back</button><button type="button" class="pt-btn pt-btn--ember" data-a="results">See my results →</button></div>';
    return h;
  }

  function results() {
    var t = tally(), top = topPattern(), P = PAT[top], ss = stayScore(), r = root(), L = st.lp, x = exitStep();
    var h = '<span class="pt-label">Your results</span><h2 class="pt-h3" tabindex="-1">' + (top === 4 ? 'You lean in more than most.' : 'Your strongest escape pattern: ' + esc(P.name)) + '</h2>';
    h += '<div class="sh-profile"><span class="sh-who">' + esc(P.who) + '</span>' +
      '<p class="sh-sounds">' + esc(P.sounds) + '</p>' +
      (top < 4 ? '<p><strong>It protects</strong> ' + esc(P.protects) + '. <strong>It blocks</strong> ' + esc(P.blocks) + '.</p>' : '') +
      '<p>' + esc(P.truth) + '</p>' + verse(P.verse) +
      '<p><strong>Start here:</strong> ' + esc(P.practice) + '</p></div>';

    h += '<h3 class="pt-h3 sh-gap">Your first reactions</h3><div class="pt-bars">' + [0, 1, 2, 3, 4].map(function (p) {
      return '<div class="pt-bar-row' + (p === top ? ' is-top' : '') + '"><div class="pt-bar-head">' + esc(PAT[p].name) + '<span>' + t[p] + ' of ' + NS + '</span></div><div class="pt-bar"><div style="width:' + Math.max(2, Math.round(t[p] / NS * 100)) + '%"></div></div></div>';
    }).join('') + '</div>';
    if (top < 4 && t[4] <= 2) h += '<p class="pt-small pt-muted">Leaning in showed up ' + t[4] + ' of ' + NS + ' times. That’s honest, and that’s where growth starts.</p>';

    if (st.ego.length) {
      h += '<h3 class="pt-h3 sh-gap">What you’re protecting</h3><ul class="sh-list">' + st.ego.map(function (i) { return '<li>' + esc(EGO[i]) + '</li>'; }).join('') + '</ul>' +
        '<p class="pt-small">Bring one of these to a brother this week. Say, “One image I protect is…”</p>';
    }
    if (ss) {
      var pct = Math.round(ss.sum / (ss.n * 4) * 100);
      h += '<h3 class="pt-h3 sh-gap">Your Staying Scale</h3><div class="pt-bar-row is-top"><div class="pt-bar-head">How often you stay<span>' + pct + '%</span></div><div class="pt-bar"><div style="width:' + pct + '%"></div></div></div>' +
        '<p>' + (pct >= 75 ? 'You usually stay. Keep practicing it, and help other men stay too.' : pct >= 50 ? 'You stay some of the time. Notice the moment just before you leave: shorter answers, folded arms, sarcasm, the urge to end it. That’s your exit signal.' : 'Leaving the room, inside or out, is your default right now. That’s not a verdict. It’s where the work is. Start with staying five more minutes.') + '</p>';
    }

    h += '<h3 class="pt-h3 sh-gap">Your Iron Loop</h3><div class="sh-loop">' + LOOP.map(function (n, i) { return '<span class="' + (i < x ? 'is-done' : '') + '">' + n + '</span>'; }).join('<i>→</i>') + '</div>';
    if (x === 0) h += '<p class="pt-muted">You skipped this part. <button type="button" class="sh-link" data-a="toLoop">Walk one moment through the loop</button>.</p>';
    else {
      h += '<div class="sh-card">' +
        '<p><strong>Friction:</strong> ' + esc(L.f || '') + (filled(L.ft) ? (L.f ? '. ' : '') + esc(L.ft) : '') + '</p>' +
        (L.r.length || filled(L.rt) ? '<p><strong>Reaction:</strong> ' + esc(L.r.map(function (i) { return REACT[i]; }).join(', ')) + (filled(L.rt) ? (L.r.length ? '. ' : '') + esc(L.rt) : '') + '</p>' : '') +
        (r ? '<p><strong>Revelation:</strong> ' + esc(r[0]) + '</p><p><strong>Surrender:</strong> ' + esc(r[1]) + ' (' + refLink(r[2][0]) + ')</p>' : '') +
        '<p><strong>Formation:</strong> ' + (filled(L.nr) ? esc(L.nr) : '<em>Not written yet</em>') + '</p></div>';
      if (x < 5) h += '<p class="pt-small">You stopped at <strong>' + LOOP[x].toLowerCase() + '</strong>. <button type="button" class="sh-link" data-a="toLoop">Finish the loop</button>.</p>';
    }

    h += '<h3 class="pt-h3 sh-gap">Old response, new response</h3><p class="pt-small pt-muted">From your Reflex Test. The new responses are a starting point. Make them yours.</p>' +
      '<div class="sh-chart"><div class="sh-chart-h"><span>Moment</span><span>Old</span><span>New</span></div>' +
      SC.map(function (s, i) {
        var v = st.sc[i]; if (v == null) return '';
        var o = s[1][v], lean = s[1].filter(function (x) { return x[1] === 4; })[0];
        return '<div class="sh-chart-r"><span>' + esc(s[0]) + '</span><span>' + (o[1] === 4 ? '<em>Leaned in ✓</em>' : esc(o[0])) + '</span><span>' + esc(lean[0]) + '</span></div>';
      }).join('') + '</div>';

    h += window90();

    h += '<h3 class="pt-h3 sh-gap">Invite a brother to sharpen you</h3><p>God doesn’t just use Scripture to grow you. He uses people to apply it. Send this to a man you trust.</p>' +
      '<div class="pt-field"><label for="shName">His first name <span class="pt-optional">(optional)</span></label><input id="shName" type="text" data-field="name" maxlength="40" value="' + esc(st.name) + '"></div>' +
      '<p class="sh-text" id="shText">' + esc(feedbackText()) + '</p>' +
      '<div class="pt-actions pt-no-print"><a class="pt-btn" id="shSms" href="' + smsHref() + '">Text it</a><button type="button" class="pt-btn pt-btn--ghost" data-a="copyAsk">Copy it</button></div>';

    h += '<h3 class="pt-h3 sh-gap">A seven-day sharpening path</h3><p class="pt-muted pt-small">One a day. Check it off when it’s done.</p>' +
      '<ol class="pt-days sh-days">' + DAYS.map(function (d, i) {
        return '<li><label><input type="checkbox" data-day="' + i + '"' + (st.done[i] ? ' checked' : '') + '><span class="pt-day-num">Day ' + (i + 1) + '</span><span class="pt-day-text"><strong>' + refLink(d[0]) + '</strong><br>' + esc(d[1]) + '</span></label></li>';
      }).join('') + '</ol><p class="pt-progress" id="shDaysDone" aria-live="polite">' + count(st.done) + ' of 7 days done</p>';

    h += '<div class="sh-declare"><span class="pt-label">Say it out loud</span><p>I don’t run from pressure. I grow through it.<br>I don’t protect my image. I pursue truth.<br>I don’t avoid people. I let God use them.<br>I am not sheltered. <strong>I am sharpened.</strong></p></div>';
    h += '<div class="sh-gem">You don’t mature by avoiding friction. You mature by being formed through it.</div>';
    h += '<div class="sh-prayer"><span class="pt-label">A prayer</span><p>Lord, I confess I’ve avoided the very relationships You’ve been using to grow me. When friction comes, help me stay. Show me what my reactions reveal, and give me the humility to be corrected, the courage to be known and the love to sharpen others. Make me a man who stays. Amen.</p></div>';

    h += '<div class="pt-actions pt-no-print"><button type="button" class="pt-btn" data-a="copy">Copy my results</button><button type="button" class="pt-btn pt-btn--ghost" data-a="print">Print / save as PDF</button></div>' +
      '<p class="pt-feedback pt-no-print" id="shFb" aria-live="polite"></p>' +
      '<div class="pt-actions pt-no-print"><button type="button" class="pt-btn pt-btn--ghost" data-a="restart">Retake it</button><button type="button" class="pt-btn pt-btn--ghost" data-a="clear">Clear my answers</button></div>' +
      '<p class="pt-muted pt-small pt-no-print">Your answers stay in this browser tab only. Closing the tab or pressing “Clear my answers” erases them.</p>';
    return h;
  }

  /* ---------- 90-Second Window drill ---------- */
  var W = [
    ['Pause', 'Don’t speak first if your flesh is loud. Breathe in for four, out for six.'],
    ['Name', 'What am I feeling right now?'],
    ['Reveal', 'What is this showing me about me?'],
    ['Return', 'What truth do I need?'],
    ['Respond', 'What would a sharpened response sound like?']
  ];
  var timer = null, left = 0;
  function windowBody(step) {
    var r = root(), P = PAT[topPattern()];
    if (step === 1) return '<p>' + esc(W[1][1]) + '</p>' + chips('feel', FEEL, FEEL.indexOf(st.feel), false);
    if (step === 2) return '<p>' + esc(W[2][1]) + '</p><p class="sh-w-big">' + (r ? 'Maybe: ' + esc(r[0].toLowerCase()) + '.' : 'Is this sharpening me, or am I resisting it?') + '</p>';
    if (step === 3) return '<p>' + esc(W[3][1]) + '</p><p class="sh-w-big">' + esc(r ? r[1] : 'My worth isn’t on trial in this conversation.') + '</p>';
    if (step === 4) return '<p>' + esc(W[4][1]) + '</p><p class="sh-w-big">' + esc(filled(st.lp.nr) ? st.lp.nr : P.newr) + '</p>';
    return '<p>' + esc(W[0][1]) + '</p><div class="sh-breathe" aria-hidden="true"></div>';
  }
  function window90() {
    return '<div class="sh-window" id="shWindow"><span class="pt-label">The 90-Second Window</span>' +
      '<h3 class="pt-h3">Practice it now</h3><p>When friction hits, you have a window. Not to win the moment, but to grow in it. Picture your moment from the Iron Loop, then start the clock.</p>' +
      '<div class="sh-w-steps">' + W.map(function (w, i) { return '<span data-w="' + i + '">' + (i + 1) + ' · ' + w[0] + '</span>'; }).join('') + '</div>' +
      '<div class="sh-w-body" id="shWBody" aria-live="polite"><p class="pt-muted">Five steps, about 18 seconds each.</p></div>' +
      '<div class="pt-actions pt-no-print"><button type="button" class="pt-btn pt-btn--ember" data-a="w90" id="shWBtn">Start the 90 seconds</button><span class="sh-clock" id="shClock" aria-hidden="true"></span></div>' +
      '<p class="sh-w-print">Pause. Name what you feel. Ask what it reveals. Return to truth. Respond, don’t react.</p></div>';
  }
  function setWindow(step) {
    var box = document.getElementById('shWindow'); if (!box) return;
    box.querySelectorAll('[data-w]').forEach(function (s) { var w = +s.getAttribute('data-w'); s.className = w < step ? 'is-done' : w === step ? 'is-here' : ''; });
    document.getElementById('shWBody').innerHTML = step >= 5 ? '<p class="sh-w-big">That’s the window. You can do this in a real moment.</p><p>Write your new response on a card or set it as your phone’s lock screen this week.</p>' : '<p class="sh-w-title">' + esc(W[step][0]) + '</p>' + windowBody(step);
  }
  function stopWindow() { if (timer) { clearInterval(timer); timer = null; } var c = document.getElementById('shClock'); if (c) c.textContent = ''; var b = document.getElementById('shWBtn'); if (b) b.textContent = 'Start the 90 seconds'; }
  function startWindow() {
    stopWindow(); left = 90; setWindow(0); track('sharpened_window');
    var b = document.getElementById('shWBtn'); if (b) b.textContent = 'Stop';
    var c = document.getElementById('shClock'); if (c) c.textContent = '1:30';
    timer = setInterval(function () {
      left--;
      var cl = document.getElementById('shClock'); if (!cl) { stopWindow(); return; }
      cl.textContent = Math.floor(left / 60) + ':' + ('0' + (left % 60)).slice(-2);
      var step = Math.min(4, Math.floor((90 - left) / 18));
      var here = document.querySelector('#shWindow .is-here');
      if (!here || +here.getAttribute('data-w') !== step) setWindow(step);
      if (left <= 0) { stopWindow(); setWindow(5); }
    }, 1000);
  }

  /* ---------- feedback text + summary ---------- */
  function feedbackText() {
    var n = (st.name || '').trim();
    return (n ? 'Hey ' + n + ', ' : 'Hey, ') + 'I’m working on being more teachable. You know me well. Is there anything you’ve seen in me that I might need to hear? I promise I’ll listen, not explain. Can we grab coffee this week?';
  }
  function smsHref() { return 'sms:?&body=' + encodeURIComponent(feedbackText()); }
  function summaryText() {
    var top = topPattern(), P = PAT[top], r = root(), L = st.lp, ss = stayScore();
    var lines = ['SHARPENED, NOT SHELTERED · My results', 'thewrkshop.com/tools/sharpened/', '',
      (top === 4 ? 'I lean in more than most.' : 'My strongest escape pattern: ' + P.name + ' (it protects ' + P.protects + ' and blocks ' + P.blocks + ')'),
      'Start here: ' + P.practice, P.verse[0] + ': “' + P.verse[1] + '”'];
    if (st.ego.length) { lines.push('', 'What I’m protecting:'); st.ego.forEach(function (i) { lines.push('- ' + EGO[i]); }); }
    if (ss) lines.push('', 'Staying Scale: ' + Math.round(ss.sum / (ss.n * 4) * 100) + '%');
    if (exitStep() > 0) {
      lines.push('', 'My Iron Loop:');
      lines.push('Friction: ' + [L.f, L.ft].filter(filled).join('. '));
      if (L.r.length || filled(L.rt)) lines.push('Reaction: ' + [L.r.map(function (i) { return REACT[i]; }).join(', '), L.rt].filter(filled).join('. '));
      if (r) lines.push('Revelation: ' + r[0], 'Surrender: ' + r[1] + ' (' + r[2][0] + ')');
      lines.push('Formation: ' + (filled(L.nr) ? L.nr : '(not written)'));
    }
    lines.push('', 'The 90-Second Window: Pause. Name. Reveal. Return. Respond.', '', 'Seven-day path:');
    DAYS.forEach(function (d, i) { lines.push('Day ' + (i + 1) + ' (' + d[0] + '): ' + d[1]); });
    lines.push('', 'I am not sheltered. I am sharpened.', '© 2026 TheWrkShop · thewrkshop.com');
    return lines.join('\n');
  }
  function feedback(m) { var fb = document.getElementById('shFb'); if (fb) fb.textContent = m; }
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
    stopWindow();
    var s = st.stage;
    app.innerHTML = s === 'reflex' ? reflex() : s === 'ego' ? ego() : s === 'stay' ? stay() : s === 'loop' ? loop() : s === 'results' ? results() : intro();
    document.body.classList.toggle('sh-has-results', s === 'results');
    if (focus) {
      var top = app.getBoundingClientRect().top + window.pageYOffset - 80;
      if (Math.abs(window.pageYOffset - top) > 40) window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      var h = app.querySelector('[tabindex="-1"]'); if (h) h.focus({ preventScroll: true });
    }
  }
  function go(stage) {
    st.stage = stage;
    if (stage === 'results' && !st.finished) { st.finished = true; track('sharpened_finish'); }
    save(); render(true);
  }
  var advancing = false;
  function toggle(arr, v) { var i = arr.indexOf(v); if (i > -1) arr.splice(i, 1); else arr.push(v); }

  app.addEventListener('click', function (e) {
    var b = e.target.closest('[data-a]'); if (!b) return;
    var a = b.getAttribute('data-a'), v = +b.getAttribute('data-v');
    if (a === 'begin') {
      if (!count(st.sc)) track('sharpened_start');
      var first = 0; while (first < NS - 1 && st.sc[first] != null) first++;
      st.i = first; go('reflex');
    }
    else if (a === 'pick') {
      if (advancing) return; advancing = true;
      st.sc[st.i] = v; save(); render();
      setTimeout(function () { advancing = false; if (st.i < NS - 1) { st.i++; go('reflex'); } else go('ego'); }, 220);
    }
    else if (a === 'fwd') { if (st.i < NS - 1) { st.i++; go('reflex'); } else go('ego'); }
    else if (a === 'back') { if (st.i > 0) { st.i--; go('reflex'); } else go('intro'); }
    else if (a === 'ego') { toggle(st.ego, v); save(); render(); }
    else if (a === 'toReflex') { st.i = NS - 1; go('reflex'); }
    else if (a === 'toEgo') go('ego');
    else if (a === 'toStay') go('stay');
    else if (a === 'toLoop') go('loop');
    else if (a === 'stay') { st.stay[b.getAttribute('data-q')] = v; save(); render(); }
    else if (a === 'lf') { st.lp.f = st.lp.f === FRICT[v] ? '' : FRICT[v]; save(); render(); }
    else if (a === 'lr') { toggle(st.lp.r, v); save(); render(); }
    else if (a === 'lroot') { st.lp.root = st.lp.root === v ? null : v; save(); render(); }
    else if (a === 'results') go('results');
    else if (a === 'feel') { st.feel = FEEL[v]; save(); b.parentNode.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); }
    else if (a === 'w90') { if (timer) { stopWindow(); setWindow(0); } else startWindow(); }
    else if (a === 'copyAsk') copyText(feedbackText());
    else if (a === 'copy') copyText(summaryText());
    else if (a === 'print') window.print();
    else if (a === 'restart') { var keepName = st.name; clearAll(); st.name = keepName; save(); render(true); }
    else if (a === 'clear') { if (window.confirm('Erase your answers?')) { clearAll(); render(true); } }
  });
  app.addEventListener('input', function (e) {
    var f = e.target.getAttribute('data-field'); if (!f) return;
    if (f === 'name') {
      st.name = e.target.value; var t = document.getElementById('shText'); if (t) t.textContent = feedbackText();
      var s = document.getElementById('shSms'); if (s) s.setAttribute('href', smsHref());
    } else {
      st.lp[f] = e.target.value;
      var x = exitStep(); app.querySelectorAll('.sh-loop span').forEach(function (sp, i) { sp.className = i < x ? 'is-done' : i === x ? 'is-here' : ''; });
    }
    save();
  });
  app.addEventListener('change', function (e) {
    var d = e.target.getAttribute('data-day'); if (d == null) return;
    if (e.target.checked) st.done[d] = true; else delete st.done[d];
    save(); var p = document.getElementById('shDaysDone'); if (p) p.textContent = count(st.done) + ' of 7 days done';
  });

  render(false);
})();

/* Share row: Share / Copy link / Print for this page only. */
(function () {
  'use strict';
  document.querySelectorAll('.sh-share').forEach(function (bar) {
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
