/* The Invisible Life: the life everyone sees is being built by the life no one sees.
   Part 1: The 30-Day Screen. Six quick taps about the hidden life → a "screen" of what the inner movie shows.
   Part 2: Where Do You Run? Four pressure scenes (exhausted, discouraged, ashamed, afraid) → functional refuge.
   Part 3: Root Work. Weakest fruit + up to three hidden habits → a tree that grows roots and fruit,
   then Psalm 139:23–24 (what would make Jesus smile / what He'd invite you to surrender).
   Results: screen, refuge profile, tree, seven-day Root Work path, prayer.
   Everything stays in this browser tab (sessionStorage). GA receives start/finish counts only. */
(function () {
  'use strict';
  var KEY = 'tws.invisiblelife.v1';
  var app = document.getElementById('ilApp');
  if (!app) return;

  /* ---------- content ---------- */
  var SCREEN = [
    ['When no one is talking to me, my mind usually goes to…', 'Mind drifts to', ['Work and to-dos', 'Worry', 'Replaying conversations', 'Daydreams or fantasy', 'What people think of me', 'God and His Word'], 5],
    ['My first thought in the morning is usually…', 'Mornings start with', ['My phone', 'My to-do list', 'What I’m dreading', 'Rushing, no thought at all', 'Thanks or a prayer'], 4],
    ['My last thought at night is usually…', 'Nights end with', ['A screen', 'Tomorrow’s worries', 'Regret about today', 'Whatever I was watching', 'Prayer'], 4],
    ['What I rehearse most is…', 'On repeat', ['Arguments I might have', 'Past mistakes', 'Plans and goals', 'Wins I want people to see', 'Scripture or truth'], 4],
    ['The voice with most of my attention right now is…', 'Loudest voice', ['News and social media', 'Podcasts and influencers', 'My own inner critic', 'Family and friends', 'God’s Word'], 4],
    ['The desire I’m feeding most is…', 'Feeding', ['Comfort', 'Approval', 'Success', 'Control', 'Pleasure', 'Knowing God'], 5]
  ];
  // refuge categories
  var CAT = [
    { name: 'Escape', title: 'Your refuge: escape', gift: 'rest and recreation',
      body: 'When pressure hits, you reach for something that numbs: screens, shows, games. Rest is a good gift. But escape promises rest and leaves you more tired, because it was never designed to carry the weight of your soul.',
      verse: ['Matthew 11:28', 'Come to me, all you who are weary and burdened, and I will give you rest.'] },
    { name: 'Comfort', title: 'Your refuge: comfort', gift: 'God’s good provision',
      body: 'When pressure hits, you reach for something that soothes: food, a drink, a purchase. Comfort is a good gift. It becomes a functional savior when it moves from a blessing you receive to the foundation you stand on.',
      verse: ['Psalm 73:25–26', 'Whom have I in heaven but you? And earth has nothing I desire besides you. My flesh and my heart may fail, but God is the strength of my heart and my portion forever.'] },
    { name: 'Achievement', title: 'Your refuge: achievement', gift: 'work and success',
      body: 'When pressure hits, you get productive. The next win, one more project, extra effort to make up for a failure. Work is a good gift. But many men don’t run from God after they fail. They run toward performance, trying to silence shame with activity.',
      verse: ['Ephesians 2:8–9', 'For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God—not by works, so that no one can boast.'] },
    { name: 'Approval', title: 'Your refuge: approval', gift: 'relationships and encouragement',
      body: 'When pressure hits, you need someone to tell you you’re okay before you can believe it. Encouragement is a good gift. But when people’s approval becomes your peace, you’ll live for an audience instead of for the One who already delights in you.',
      verse: ['Zephaniah 3:17', 'The LORD your God is with you, the Mighty Warrior who saves. He will take great delight in you; in his love he will no longer rebuke you, but will rejoice over you with singing.'] },
    { name: 'Control', title: 'Your refuge: control', gift: 'wisdom and planning',
      body: 'When pressure hits, you plan, research and rehearse every outcome. Planning is a good gift. But control feels like salvation, and it can eat hours of your mind. Peace doesn’t come from controlling tomorrow. It comes from trusting the One who already holds it.',
      verse: ['Isaiah 26:3', 'You will keep in perfect peace those whose minds are steadfast, because they trust in you.'] },
    { name: 'Christ', title: 'Your first refuge is increasingly Christ', gift: '',
      body: 'Under pressure, you’re learning to run to Jesus first. That doesn’t mean you never feel exhausted, discouraged, ashamed or afraid. It means your heart is learning where rest really is. Keep practicing it. The first instinct is formed one return at a time.',
      verse: ['Psalm 62:5–6', 'Yes, my soul, find rest in God; my hope comes from him. Truly he is my rock and my salvation; he is my fortress, I will not be shaken.'] }
  ];
  var RUN = [
    { feel: 'Exhausted', ask: 'What promises rest?', scene: 'It’s been one of the hardest weeks you’ve had. You’re sitting in your car after work, drained. Your heart whispers, “I just need…”',
      opts: [['to scroll for an hour', 0], ['another drink, or something to eat', 1], ['to finish one more thing so I can relax', 2], ['someone to tell me I did a good job', 3], ['to binge a show and not think', 0], ['to get quiet with Jesus', 5]],
      truth: ['Matthew 11:28', 'Come to me, all you who are weary and burdened, and I will give you rest.'] },
    { feel: 'Discouraged', ask: 'What promises hope?', scene: 'You didn’t get the promotion. Or your son made a painful choice. Or you and your wife had it out again. Something starts writing the next chapter of your story.',
      opts: [['I go after the next win to feel better', 2], ['I need someone to encourage me first', 3], ['I compare myself to guys who are doing better', 3], ['I buy something or treat myself', 1], ['I numb out on my phone', 0], ['I slowly go back to God’s promises', 5]],
      truth: ['Romans 15:13', 'May the God of hope fill you with all joy and peace as you trust in him, so that you may overflow with hope by the power of the Holy Spirit.'] },
    { feel: 'Ashamed', ask: 'What promises acceptance?', scene: 'You blew it. You sinned, or you let someone down, and you know it. Now what?',
      opts: [['I get extra productive to make up for it', 2], ['I justify it or point at someone else', 4], ['I need people to reassure me I’m okay', 3], ['I escape into something so I don’t think about it', 0], ['I hide it and act fine', 4], ['I bring it into the light with God', 5]],
      truth: ['Romans 8:1', 'Therefore, there is now no condemnation for those who are in Christ Jesus.'] },
    { feel: 'Afraid', ask: 'What promises control?', scene: 'Something feels uncertain: money, your health, your job, your kids. Your mind starts running.',
      opts: [['I plan every detail', 4], ['I research every possible outcome', 4], ['I work harder', 2], ['I keep everyone happy', 3], ['I lean on savings or comfort', 1], ['I pray and trust Him with tomorrow', 5]],
      truth: ['Matthew 6:34', 'Therefore do not worry about tomorrow, for tomorrow will worry about itself. Each day has enough trouble of its own.'] }
  ];
  var FRUIT = ['Love', 'Joy', 'Peace', 'Patience', 'Kindness', 'Goodness', 'Faithfulness', 'Gentleness', 'Self-control'];
  var ROOTS = [
    ['Pray before I touch my phone', 'Mark 1:35'],
    ['Meditate on one verse all day', 'Psalm 1:2'],
    ['Do one good thing no one will know about', 'Matthew 6:3–4'],
    ['Confess honestly to God and a brother', 'James 5:16'],
    ['Forgive someone in private', 'Mark 11:25'],
    ['Thank God before I sleep', '1 Thessalonians 5:18'],
    ['Read John 15:1–11 each morning', 'John 15:4']
  ];
  var DAYS = [
    ['Psalm 1:1–3', 'Pick one verse and meditate on it all day. Say it before every meal.'],
    ['Matthew 6:1–6', 'Do one good thing today that no one will ever know about.'],
    ['James 1:14–15', 'Notice one desire before it becomes a decision. Name it to God.'],
    ['Luke 6:43–45', 'Listen to your own words today. What do they say about your heart?'],
    ['Matthew 11:28–30', 'The next time you’re worn out, run to Jesus first. Five minutes before anything else.'],
    ['John 15:4–5', 'Before you check your phone, say, “Jesus, I remain in You today.”'],
    ['Psalm 139:23–24', 'Pray it slowly. Write down what He shows you, and tell a brother.']
  ];

  /* ---------- helpers ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function track(name) { try { if (window.gtag) window.gtag('event', name); } catch (e) {} }
  function bible(ref) { return 'https://www.biblegateway.com/passage/?search=' + encodeURIComponent(ref.replace(/–/g, '-')) + '&version=NIV'; }
  function refLink(ref) { return '<a href="' + bible(ref) + '" target="_blank" rel="noopener">' + esc(ref) + '</a>'; }
  function verse(v) { return '<blockquote class="il-verse"><p>“' + esc(v[1]) + '”</p><cite>' + esc(v[0]) + ' (NIV)</cite></blockquote>'; }
  function fresh() { return { stage: 'intro', sc: {}, story: '', run: {}, ri: 0, weak: null, roots: [], smile: '', surrender: '', done: {}, finished: false }; }
  var st;
  try { st = JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch (e) { st = null; }
  if (!st || typeof st !== 'object') st = fresh();
  var F = fresh(); Object.keys(F).forEach(function (k) { if (st[k] == null && F[k] != null) st[k] = F[k]; });
  function save() { try { sessionStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  function clearAll() { try { sessionStorage.removeItem(KEY); } catch (e) {} st = fresh(); }
  function count(o) { return Object.keys(o).length; }
  function filled(v) { return v != null && String(v).trim() !== ''; }
  function godward() { var n = 0; SCREEN.forEach(function (s, i) { if (st.sc[i] === s[3]) n++; }); return n; }
  function tally() { var t = [0, 0, 0, 0, 0, 0]; Object.keys(st.run).forEach(function (k) { var o = RUN[+k].opts[st.run[k]]; if (o) t[o[1]]++; }); return t; }
  function refuge() {
    var t = tally(), best = 5, bv = 0;
    for (var c = 0; c < 5; c++) if (t[c] > bv) { bv = t[c]; best = c; }
    if (t[5] >= 3 || bv === 0) return 5;
    return best;
  }

  /* ---------- screens ---------- */
  function progress(part, label) {
    return '<div class="pt-tool-top"><span class="pt-count">Part ' + part + ' of 3 · ' + label + '</span></div>' +
      '<div class="il-steps" aria-hidden="true">' + [1, 2, 3].map(function (n) { return '<span class="' + (n < part ? 'is-done' : n === part ? 'is-here' : '') + '"></span>'; }).join('') + '</div>';
  }

  function intro() {
    var resume = count(st.sc) > 0;
    return '<span class="pt-label">Imagine two men</span>' +
      '<p class="il-big">Both go to church. Both serve. Both know Scripture. Ten years later, one is full of peace, humility and quiet confidence. The other is exhausted, easily offended, living for approval and slowly drifting.</p>' +
      '<p>What happened? Neither the collapse nor the maturity began in public. Both were being formed long before anyone noticed.</p>' +
      verse(['Proverbs 4:23', 'Above all else, guard your heart, for everything you do flows from it.']) +
      '<p>About 10 minutes, in three parts:</p>' +
      '<ol class="il-parts"><li><strong>The 30-Day Screen.</strong> Six quick taps about your hidden life.</li><li><strong>Where Do You Run?</strong> Four moments of pressure. What does your heart reach for first?</li><li><strong>Root Work.</strong> Pick what to cultivate where no one sees, and watch the tree grow.</li></ol>' +
      '<p class="pt-small pt-muted">Your answers stay on your screen.</p>' +
      '<div class="pt-actions"><button type="button" class="pt-btn pt-btn--ember" data-a="begin">' + (resume ? 'Pick up where I left off' : 'Start') + '</button>' +
      (resume && count(st.run) === RUN.length ? '<button type="button" class="pt-btn pt-btn--ghost" data-a="results">See my results</button>' : '') + '</div>';
  }

  function screenBox(withStory) {
    var rows = SCREEN.map(function (s, i) { var v = st.sc[i]; return v == null ? '' : '<p><span>' + esc(s[1]) + '</span><b class="' + (v === s[3] ? 'is-god' : '') + '">' + esc(s[2][v]) + '</b></p>'; }).join('');
    return '<div class="il-screen" role="img" aria-label="A screen showing your inner life"><div class="il-screen-top"><span class="il-rec"></span>Inner life · 30 days</div>' +
      (rows || '<p class="il-screen-empty">Tap your answers and they’ll appear here.</p>') + '</div>' +
      (withStory ? '' : '');
  }

  function screen() {
    var done = count(st.sc) === SCREEN.length;
    return progress(1, 'The 30-Day Screen') +
      '<h2 class="pt-h3" tabindex="-1">If your private life with God played on a screen for 30 days…</h2>' +
      '<p class="pt-small pt-muted">Not your church attendance or your serving. Your thoughts, desires and reactions. Tap the closest answer for each.</p>' +
      SCREEN.map(function (s, i) {
        return '<div class="il-q"><p>' + esc(s[0]) + '</p><div class="il-chips" role="group" aria-label="' + esc(s[0]) + '">' +
          s[2].map(function (o, v) { return '<button type="button" data-a="sc" data-q="' + i + '" data-v="' + v + '" aria-pressed="' + (st.sc[i] === v) + '">' + esc(o) + '</button>'; }).join('') + '</div></div>';
      }).join('') +
      '<div id="ilScreenWrap">' + screenBox() + '</div>' +
      '<div class="pt-field"><label for="ilStory">What story would this screen tell about where your life is headed? <span class="pt-optional">(optional)</span></label><textarea id="ilStory" data-field="story" rows="3" maxlength="800">' + esc(st.story) + '</textarea></div>' +
      '<p class="pt-error" id="ilErr" aria-live="polite"></p>' +
      '<div class="pt-actions"><button type="button" class="pt-btn pt-btn--ghost" data-a="home">← Start</button><button type="button" class="pt-btn" data-a="toRun"' + '>Next: Where Do You Run? →</button></div>' +
      (done ? '' : '');
  }

  function run() {
    var i = st.ri, R = RUN[i], cur = st.run[i];
    return progress(2, 'Where Do You Run?') +
      '<div class="pt-tool-top"><span class="pt-count">' + (i + 1) + ' of ' + RUN.length + '</span><span class="pt-count">' + esc(R.ask) + '</span></div>' +
      '<div class="il-scene"><span class="il-feel">When you’re ' + esc(R.feel.toLowerCase()) + '</span><p tabindex="-1">' + esc(R.scene) + '</p></div>' +
      '<fieldset class="pt-fieldset"><legend class="pt-legend il-legend">Honestly, where does your heart run first?</legend>' +
        R.opts.map(function (o, v) { return '<button type="button" class="pt-option" data-a="run" data-v="' + v + '" aria-pressed="' + (cur === v) + '">' + esc(o[0]) + '</button>'; }).join('') +
      '</fieldset><p class="pt-small pt-muted">Not where you should run. Where you actually run, before your theology catches up.</p>' +
      (cur != null ? '<div class="il-truth">' + verse(R.truth) + '</div>' : '') +
      '<div class="pt-actions"><button type="button" class="pt-btn pt-btn--ghost" data-a="runBack">← Back</button>' +
      (cur != null ? '<button type="button" class="pt-btn" data-a="runNext">' + (i === RUN.length - 1 ? 'Next: Root Work →' : 'Next →') + '</button>' : '') + '</div>';
  }

  function tree(compact) {
    var n = st.roots.length, w = 320, h = 300, gy = 170;
    var s = '<svg class="il-tree" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="A tree with ' + n + ' root' + (n === 1 ? '' : 's') + ' and ' + (n * 2) + ' fruit">';
    s += '<rect x="0" y="' + gy + '" width="' + w + '" height="' + (h - gy) + '" class="il-soil"/>';
    s += '<line x1="0" y1="' + gy + '" x2="' + w + '" y2="' + gy + '" class="il-ground"/>';
    s += '<text x="8" y="' + (gy - 6) + '" class="il-t-small">What people see</text><text x="8" y="' + (gy + 16) + '" class="il-t-small il-t-light">What God sees</text>';
    var trunkH = 40 + n * 12;
    s += '<path d="M152 ' + gy + ' L152 ' + (gy - trunkH) + ' L168 ' + (gy - trunkH) + ' L168 ' + gy + ' Z" class="il-trunk"/>';
    var cr = 34 + n * 9, cy = gy - trunkH - cr * 0.55;
    s += '<circle cx="160" cy="' + cy + '" r="' + cr + '" class="il-crown' + (n ? '' : ' is-bare') + '"/>';
    var spots = [[-0.5, -0.2], [0.45, -0.35], [0.1, 0.25], [-0.25, 0.4], [0.55, 0.2], [-0.6, 0.25]];
    for (var f = 0; f < Math.min(6, n * 2); f++) s += '<circle cx="' + (160 + spots[f][0] * cr) + '" cy="' + (cy + spots[f][1] * cr) + '" r="7" class="il-fruit"/>';
    var ang = [[-110, 95], [110, 72], [0, 118]];
    st.roots.forEach(function (ri, k) {
      var a = ang[k], x2 = 160 + a[0], y2 = gy + a[1];
      s += '<path d="M160 ' + gy + ' Q ' + (160 + a[0] * 0.3) + ' ' + (gy + a[1] * 0.7) + ' ' + x2 + ' ' + y2 + '" class="il-root"/>';
      s += '<circle cx="' + x2 + '" cy="' + y2 + '" r="9" class="il-rootdot"/><text x="' + x2 + '" y="' + (y2 + 4) + '" text-anchor="middle" class="il-t-num">' + (k + 1) + '</text>';
    });
    if (st.weak != null) s += '<text x="' + (w - 8) + '" y="22" text-anchor="end" class="il-t-small">Growing: ' + esc(FRUIT[st.weak]) + '</text>';
    return s + '</svg>';
  }

  function roots() {
    return progress(3, 'Root Work') +
      '<h2 class="pt-h3" tabindex="-1">Fruit grows from roots no one applauds</h2>' +
      '<p>Jesus never inspected apples. He inspected trees. Which fruit of the Spirit feels weakest in you right now?</p>' +
      '<div class="il-chips" role="group" aria-label="Weakest fruit">' + FRUIT.map(function (f, i) { return '<button type="button" data-a="weak" data-v="' + i + '" aria-pressed="' + (st.weak === i) + '">' + f + '</button>'; }).join('') + '</div>' +
      '<p>You can’t tape fruit onto a tree. Pick up to three hidden habits to cultivate this week, and watch what grows.</p>' +
      '<div class="il-roots">' + ROOTS.map(function (r, i) { var on = st.roots.indexOf(i) > -1; return '<button type="button" class="pt-option" data-a="root" data-v="' + i + '" aria-pressed="' + on + '"' + (!on && st.roots.length >= 3 ? ' disabled' : '') + '><span>' + esc(r[0]) + ' <span class="il-ref">' + esc(r[1]) + '</span></span></button>'; }).join('') + '</div>' +
      '<div id="ilTree">' + tree(false) + (st.roots.length ? '<ol class="il-rootlist">' + st.roots.map(function (r) { return '<li>' + esc(ROOTS[r][0]) + '</li>'; }).join('') + '</ol>' : '<p class="pt-small pt-muted il-center">Pick a habit and the roots start growing.</p>') + '</div>' +
      '<div class="il-search"><span class="pt-label">Psalm 139:23–24</span><p class="il-search-v">“Search me, God, and know my heart; test me and know my anxious thoughts. See if there is any offensive way in me, and lead me in the way everlasting.”</p>' +
        '<p>If Jesus followed you through one ordinary week…</p>' +
        '<div class="pt-field"><label for="ilSmile">What hidden habit would make Him smile?</label><textarea id="ilSmile" data-field="smile" rows="2" maxlength="600">' + esc(st.smile) + '</textarea></div>' +
        '<div class="pt-field"><label for="ilSurrender">What would He lovingly invite you to surrender?</label><textarea id="ilSurrender" data-field="surrender" rows="2" maxlength="600">' + esc(st.surrender) + '</textarea></div></div>' +
      '<div class="pt-actions"><button type="button" class="pt-btn pt-btn--ghost" data-a="toRunLast">← Back</button><button type="button" class="pt-btn pt-btn--ember" data-a="results">See my results →</button></div>';
  }

  function results() {
    var t = tally(), ci = refuge(), C = CAT[ci], g = godward();
    var h = '<span class="pt-label">Your results</span><h2 class="pt-h3" tabindex="-1">' + esc(C.title) + '</h2>' +
      '<div class="il-profile' + (ci === 5 ? ' is-christ' : '') + '"><p>' + esc(C.body) + '</p>' + verse(C.verse) +
      (ci < 5 ? '<p><strong>The question beneath it:</strong> where does your heart run before it remembers to run to Christ? ' + esc(C.gift.charAt(0).toUpperCase() + C.gift.slice(1)) + ' is a good gift. It just can’t be your savior.</p>' : '') + '</div>';

    h += '<h3 class="pt-h3 il-gap">Where you run under pressure</h3>' + RUN.map(function (R, i) {
      var v = st.run[i]; if (v == null) return '';
      var o = R.opts[v];
      return '<div class="il-runrow' + (o[1] === 5 ? ' is-christ' : '') + '"><span class="il-feel">' + esc(R.feel) + '</span><p>' + esc(o[0].charAt(0).toUpperCase() + o[0].slice(1)) + '</p><p class="pt-small">' + refLink(R.truth[0]) + ': “' + esc(R.truth[1]) + '”</p></div>';
    }).join('') +
      '<div class="pt-bars">' + CAT.map(function (c, k) { return t[k] ? '<div class="pt-bar-row' + (k === ci ? ' is-top' : '') + '"><div class="pt-bar-head">' + esc(c.name) + '<span>' + t[k] + ' of 4</span></div><div class="pt-bar"><div style="width:' + (t[k] * 25) + '%"></div></div></div>' : ''; }).join('') + '</div>';

    h += '<h3 class="pt-h3 il-gap">Your 30-day screen</h3>' + screenBox() +
      '<p>' + (g >= 4 ? 'Your hidden life is turning toward God more often than not. Guard it. The strongest part of your spiritual life is the part no one applauds.' : g >= 2 ? 'Some of your hidden life is turning toward God, and some of it is being shaped by other voices. What consistently captures your attention eventually shapes your affection.' : 'Right now, most of your hidden life is being shaped by something other than God. That isn’t a verdict. It’s a starting point, and it’s exactly where He likes to begin.') + '</p>' +
      (filled(st.story) ? '<p class="il-quote">“' + esc(st.story) + '”</p>' : '');

    h += '<h3 class="pt-h3 il-gap">Your root work</h3>' + tree(false) +
      (st.roots.length ? '<ol class="il-rootlist">' + st.roots.map(function (r) { return '<li>' + esc(ROOTS[r][0]) + ' · ' + refLink(ROOTS[r][1]) + '</li>'; }).join('') + '</ol>' : '<p class="pt-muted">No roots picked yet. <button type="button" class="il-link" data-a="toRoots">Pick up to three</button>.</p>') +
      (st.weak != null ? '<p>Don’t try harder to manufacture ' + esc(FRUIT[st.weak].toLowerCase()) + '. Tend the roots, and let the Spirit grow it.</p>' : '') +
      (filled(st.smile) || filled(st.surrender) ? '<div class="il-card">' + (filled(st.smile) ? '<p><strong>What would make Jesus smile:</strong> ' + esc(st.smile) + '</p>' : '') + (filled(st.surrender) ? '<p><strong>What He’s inviting me to surrender:</strong> ' + esc(st.surrender) + '</p>' : '') + '</div>' : '');

    h += '<h3 class="pt-h3 il-gap">Seven days of root work</h3><p class="pt-muted pt-small">One a day. Check it off when it’s done.</p>' +
      '<ol class="pt-days il-days">' + DAYS.map(function (d, i) {
        return '<li><label><input type="checkbox" data-day="' + i + '"' + (st.done[i] ? ' checked' : '') + '><span class="pt-day-num">Day ' + (i + 1) + '</span><span class="pt-day-text"><strong>' + refLink(d[0]) + '</strong><br>' + esc(d[1]) + '</span></label></li>';
      }).join('') + '</ol><p class="pt-progress" id="ilDaysDone" aria-live="polite">' + count(st.done) + ' of 7 days done</p>';

    h += '<div class="il-gems"><span class="pt-label">Gems</span><ul><li>Every public failure first existed as a private compromise.</li><li>Every public victory first existed as a private surrender.</li><li>God changes lives by changing loves.</li><li>Leaves can fool people. Roots never fool God.</li></ul></div>';
    h += '<div class="il-gem">The invisible life isn’t preparation for the Christian life. It <em>is</em> the Christian life.</div>';
    h += '<div class="il-prayer"><span class="pt-label">A prayer</span><p>Search me, God, and know my heart. You see what no one else sees: the thoughts I rehearse, the desires I feed, the places I run. I don’t want to polish fruit. I want You to heal my roots. Be my first refuge. Grow in secret what You’ll one day show in public, and let it all point back to You. Amen.</p></div>';

    h += '<div class="pt-actions pt-no-print"><button type="button" class="pt-btn" data-a="copy">Copy my results</button><button type="button" class="pt-btn pt-btn--ghost" data-a="print">Print / save as PDF</button></div>' +
      '<p class="pt-feedback pt-no-print" id="ilFb" aria-live="polite"></p>' +
      '<div class="pt-actions pt-no-print"><button type="button" class="pt-btn pt-btn--ghost" data-a="restart">Retake it</button><button type="button" class="pt-btn pt-btn--ghost" data-a="clear">Clear my answers</button></div>' +
      '<p class="pt-muted pt-small pt-no-print">Your answers stay in this browser tab only. Closing the tab or pressing “Clear my answers” erases them.</p>';
    return h;
  }

  function summaryText() {
    var C = CAT[refuge()];
    var L = ['THE INVISIBLE LIFE · My results', 'thewrkshop.com/tools/invisible-life/', '', C.title, C.verse[0] + ': “' + C.verse[1] + '”', '', 'Where I run under pressure:'];
    RUN.forEach(function (R, i) { var v = st.run[i]; if (v != null) L.push('- ' + R.feel + ': ' + R.opts[v][0] + ' (' + R.truth[0] + ')'); });
    L.push('', 'My 30-day screen:');
    SCREEN.forEach(function (s, i) { var v = st.sc[i]; if (v != null) L.push('- ' + s[1] + ': ' + s[2][v]); });
    if (filled(st.story)) L.push('Story it tells: ' + st.story.trim());
    L.push('', 'Root work:');
    if (st.weak != null) L.push('Fruit I’m asking God to grow: ' + FRUIT[st.weak]);
    st.roots.forEach(function (r) { L.push('- ' + ROOTS[r][0] + ' (' + ROOTS[r][1] + ')'); });
    if (filled(st.smile)) L.push('What would make Jesus smile: ' + st.smile.trim());
    if (filled(st.surrender)) L.push('What He’s inviting me to surrender: ' + st.surrender.trim());
    L.push('', 'Seven days:'); DAYS.forEach(function (d, i) { L.push('Day ' + (i + 1) + ' (' + d[0] + '): ' + d[1]); });
    L.push('', 'The life everyone sees is being built by the life no one sees.', '© 2026 TheWrkShop · thewrkshop.com');
    return L.join('\n');
  }
  function feedback(m) { var fb = document.getElementById('ilFb'); if (fb) fb.textContent = m; }
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
    app.innerHTML = s === 'screen' ? screen() : s === 'run' ? run() : s === 'roots' ? roots() : s === 'results' ? results() : intro();
    document.body.classList.toggle('il-has-results', s === 'results');
    if (focus) {
      var top = app.getBoundingClientRect().top + window.pageYOffset - 80;
      if (Math.abs(window.pageYOffset - top) > 40) window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      var h = app.querySelector('[tabindex="-1"]'); if (h) h.focus({ preventScroll: true });
    }
  }
  function go(stage) {
    st.stage = stage;
    if (stage === 'results' && !st.finished) { st.finished = true; track('invisiblelife_finish'); }
    save(); render(true);
  }
  var advancing = false;

  app.addEventListener('click', function (e) {
    var b = e.target.closest('[data-a]'); if (!b || b.disabled) return;
    var a = b.getAttribute('data-a'), v = +b.getAttribute('data-v');
    if (a === 'begin') {
      if (!count(st.sc)) track('invisiblelife_start');
      if (count(st.sc) < SCREEN.length) go('screen');
      else if (count(st.run) < RUN.length) { st.ri = count(st.run); go('run'); }
      else go('roots');
    }
    else if (a === 'home') go('intro');
    else if (a === 'sc') {
      st.sc[b.getAttribute('data-q')] = v; save();
      b.parentNode.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      var w = document.getElementById('ilScreenWrap'); if (w) w.innerHTML = screenBox();
      var er = document.getElementById('ilErr'); if (er) er.textContent = '';
    }
    else if (a === 'toRun') {
      if (count(st.sc) < SCREEN.length) { var e2 = document.getElementById('ilErr'); if (e2) e2.textContent = 'Tap an answer for all six to keep going.'; return; }
      st.ri = 0; go('run');
    }
    else if (a === 'run') {
      if (advancing) return;
      st.run[st.ri] = v; save(); render();
    }
    else if (a === 'runNext') { if (st.ri < RUN.length - 1) { st.ri++; go('run'); } else go('roots'); }
    else if (a === 'runBack') { if (st.ri > 0) { st.ri--; go('run'); } else go('screen'); }
    else if (a === 'toRunLast') { st.ri = RUN.length - 1; go('run'); }
    else if (a === 'toRoots') go('roots');
    else if (a === 'weak') { st.weak = st.weak === v ? null : v; save(); render(); }
    else if (a === 'root') {
      var i = st.roots.indexOf(v);
      if (i > -1) st.roots.splice(i, 1); else if (st.roots.length < 3) st.roots.push(v);
      save(); render();
    }
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
    save(); var p = document.getElementById('ilDaysDone'); if (p) p.textContent = count(st.done) + ' of 7 days done';
  });

  render(false);
})();

/* Share row: Share / Copy link / Print for this page only. */
(function () {
  'use strict';
  document.querySelectorAll('.il-share').forEach(function (bar) {
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
