/* The Filter Lens · Movement One: Recognize.
   Ten questions about what has been shaping the way a man sees, believes, desires and responds.
   Each question: Scripture, two gems, reflection, "what did you notice?", a second layer
   ("what might it mean?") that suggests a related question, prayer, a listening prompt and one next step.
   Then the Awareness Audit, a printable journal with a seven-day review, and the Daily Filter Reset.
   Answers stay in this browser (sessionStorage by default; localStorage only if he ticks "keep on this device").
   Google Analytics receives start/finish counts only, never answers. */
(function () {
  'use strict';
  var KEY = 'tws.filterlens.v1';
  var app = document.getElementById('flApp');
  if (!app) return;

  /* ---------- content ---------- */
  var Q = [
    { q: 'Who taught me to see life the way I see it, and have I ever questioned what they taught me?',
      refs: 'Romans 12:2 · Deuteronomy 6:6–9',
      verse: ['Romans 12:2', 'Do not conform to the pattern of this world, but be transformed by the renewing of your mind. Then you will be able to test and approve what God’s will is—his good, pleasing and perfect will.'],
      context: 'Families, communities and experiences teach us what to expect before we know we’re learning. Some lessons are wise. Others need a second look.',
      big: 'A belief can be familiar without being true.',
      sub: 'The lessons that shape us most may be the ones nobody ever said out loud.',
      prompts: ['What assumption about life did I inherit?', 'Where has it helped me, and where has it limited me?', 'What does Scripture invite me to reconsider?'],
      options: ['A family expectation', 'A cultural or social message', 'A painful experience', 'A helpful teaching I’ve never examined'],
      deep: { prompt: 'What part of that influence still feels active today?',
        choices: ['I assume it’s true because it came from someone I trust.', 'I’d feel disloyal if I questioned it.', 'I’ve never considered a different explanation.', 'It has genuinely helped me, but I want to test it.'],
        follow: ['Who taught me this, and what did they actually intend?', 'What would respectful examination look like?', 'What evidence or Scripture might challenge this assumption?', 'What would it mean to keep what’s good and revise what isn’t?'],
        targets: [2, 6, 3, 10] },
      prayer: 'Father, help me honor what was good in what I learned and examine what may not be true. Renew my mind through Your Word.',
      whisper: 'What assumption deserves careful, prayerful examination?',
      action: 'Name one inherited assumption and compare it with a passage of Scripture, read in context.' },
    { q: 'What do I believe so strongly that I’ve stopped examining whether it’s true?',
      refs: 'Acts 17:11 · Proverbs 18:17',
      verse: ['Acts 17:11', 'Now the Berean Jews were of more noble character than those in Thessalonica, for they received the message with great eagerness and examined the Scriptures every day to see if what Paul said was true.'],
      context: 'Confidence isn’t the same as accuracy. The Bereans tested what they heard against the Scriptures instead of trusting how sure the speaker sounded.',
      big: 'Strong conviction doesn’t remove the need for honest examination.',
      sub: 'The beliefs we defend fastest may be the ones we examine least.',
      prompts: ['Which opinion feels threatening to question?', 'What would it take to change my mind?', 'Have I listened fairly to a thoughtful disagreement?'],
      options: ['I get defensive', 'I lean on my group', 'I avoid evidence against it', 'I welcome examination'],
      deep: { prompt: 'What makes this belief hard to revisit?',
        choices: ['Being wrong would feel like a hit to who I am.', 'My community expects me to hold this position.', 'I mostly hear things that confirm it.', 'I’m willing to learn but don’t know where to start.'],
        follow: ['Can I separate my worth from being right?', 'What might faithful disagreement cost me?', 'What would a fair account of the other side sound like?', 'Who could help me study this carefully?'],
        targets: [10, 6, 3, 1] },
      prayer: 'God of truth, make me teachable. Help me tell the difference between loyalty to You and loyalty to my assumptions.',
      whisper: 'Where might humility make room for clearer understanding?',
      action: 'Write down the strongest fair objection to one belief you hold, and study it without rushing to defend yourself.' },
    { q: 'Am I seeing what’s actually happening, or what my past has trained me to expect?',
      refs: 'James 1:19 · Proverbs 18:13',
      verse: ['James 1:19', 'My dear brothers and sisters, take note of this: Everyone should be quick to listen, slow to speak and slow to become angry.'],
      context: 'Past experiences shape how we read new situations. That doesn’t make our feelings imaginary, but it can make our first interpretation incomplete.',
      big: 'My first interpretation may not be the whole story.',
      sub: 'Sometimes I react to what I expect someone meant, not to what they actually said.',
      prompts: ['What happened, in plain facts?', 'What meaning did I attach to it right away?', 'What other explanation haven’t I considered?'],
      options: ['I expect rejection', 'I expect conflict', 'I expect disappointment', 'I usually ask before assuming'],
      deep: { prompt: 'What seems to be underneath your first interpretation?',
        choices: ['A past experience makes this feel familiar.', 'I’m trying to protect myself from being hurt again.', 'I have little information but feel pressure to decide.', 'I may need to ask what they actually meant.'],
        follow: ['What belongs to the present, and what belongs to memory?', 'What boundary could protect me without assuming the worst?', 'What do I actually know, and what am I guessing?', 'What respectful question would clear this up?'],
        targets: [1, 6, 2, 10] },
      prayer: 'Lord, give me patience to hear accurately, courage to ask and wisdom to tell memory from the present.',
      whisper: 'What would change if I sought understanding before reaching a conclusion?',
      action: 'In one conversation this week, ask a clarifying question before deciding what someone meant.' },
    { q: 'What captures my attention before I consciously choose to give it?',
      refs: 'Philippians 4:8–9 · Colossians 3:1–2',
      verse: ['Philippians 4:8', 'Finally, brothers and sisters, whatever is true, whatever is noble, whatever is right, whatever is pure, whatever is lovely, whatever is admirable—if anything is excellent or praiseworthy—think about such things.'],
      context: 'Attention is shaped by habit, environment and desire. Not every unwanted thought is chosen, but we can practice where we return our attention.',
      big: 'What keeps getting my attention can shape what grows in my life.',
      sub: 'Where my attention goes when no one needs anything from me tells me a lot.',
      prompts: ['What do I reach for in quiet moments?', 'What does that pattern produce in me?', 'What would a healthier return of attention look like?'],
      options: ['Comparison or scrolling', 'Worry or replaying conflict', 'Work and achievement', 'Prayer, rest or being present with people'],
      deep: { prompt: 'What need might your attention be trying to meet?',
        choices: ['Relief from discomfort or boredom.', 'Reassurance that I’m doing enough.', 'A sense of control when things are uncertain.', 'Rest, connection or real presence.'],
        follow: ['What feeling shows up right before I reach for distraction?', 'Whose standard am I trying to meet?', 'What’s mine to handle, and what isn’t?', 'How can I make room for this good need on purpose?'],
        targets: [7, 6, 8, 10] },
      prayer: 'Father, help me notice what captures my attention, and gently return to what is true, worthy and life-giving.',
      whisper: 'Where could I practice paying attention instead of reacting on autopilot?',
      action: 'Pick one recurring cue and trade five minutes of autopilot attention for a deliberate practice.' },
    { q: 'What have I accepted as normal just because I’ve lived with it so long?',
      refs: 'Ephesians 4:17–24 · Romans 12:2',
      verse: ['Ephesians 4:22–24', 'You were taught, with regard to your former way of life, to put off your old self, which is being corrupted by its deceitful desires; to be made new in the attitude of your minds; and to put on the new self, created to be like God in true righteousness and holiness.'],
      context: 'Repetition can make an unhealthy pattern feel ordinary. Familiarity should invite a second look, not automatic condemnation.',
      big: 'Familiar doesn’t necessarily mean faithful or healthy.',
      sub: 'A pattern can start to feel like part of who I am just because I’ve repeated it for years.',
      prompts: ['What do I excuse as “just how I am”?', 'Who is affected by that pattern?', 'What other response is possible?'],
      options: ['A way I speak', 'A way I avoid', 'A way I cope', 'A way I prioritize'],
      deep: { prompt: 'Why has this pattern stayed familiar?',
        choices: ['I call it part of my personality.', 'It protects me from an uncomfortable conversation.', 'It gives me short-term relief.', 'I’ve never practiced a different response.'],
        follow: ['Who might be affected when I say, “That’s just me”?', 'What am I avoiding saying or hearing?', 'What happens after the relief fades?', 'What small replacement could I rehearse?'],
        targets: [10, 3, 7, 9] },
      prayer: 'Lord, show me what I’ve normalized that needs renewal, and strengthen me to practice a different way.',
      whisper: 'What familiar response deserves a fresh look?',
      action: 'Notice one automatic behavior three times this week without beating yourself up. Write down what triggered it.' },
    { q: 'Whose approval quietly shapes the decisions I think I’m making on my own?',
      refs: 'Galatians 1:10 · Proverbs 29:25',
      verse: ['Galatians 1:10', 'Am I now trying to win the approval of human beings, or of God? Or am I trying to please people? If I were still trying to please people, I would not be a servant of Christ.'],
      context: 'Wanting to belong is human. The question is whether fear of disapproval starts to override truth, integrity or wise love.',
      big: 'Approval can become an unseen audience for my decisions.',
      sub: 'I may call something “keeping the peace” when I’m really afraid of disappointing someone.',
      prompts: ['Whose reaction do I rehearse in my head?', 'What decision would look different without that pressure?', 'How can I honor people without making their approval my authority?'],
      options: ['A boss or leader', 'Family', 'Friends or my community', 'An imagined audience'],
      deep: { prompt: 'What feels at stake if approval is withheld?',
        choices: ['I might feel less valuable.', 'I might lose an opportunity or a relationship.', 'People might find out I’m not perfect.', 'I may be confusing kindness with agreement.'],
        follow: ['What defines my worth apart from their response?', 'What’s a wise response to a real relational risk?', 'What would honest humility look like here?', 'How can I be kind without hiding the truth?'],
        targets: [10, 3, 2, 5] },
      prayer: 'Father, free me from fear-driven performance. Teach me to love people without handing my integrity to their approval.',
      whisper: 'Where is fear of someone’s reaction shaping my choice?',
      action: 'Make one small, truthful decision without fishing for reassurance.' },
    { q: 'What do my private habits reveal about what I really value?',
      refs: 'Matthew 6:19–21 · Luke 16:10',
      verse: ['Matthew 6:21', 'For where your treasure is, there your heart will be also.'],
      context: 'Private habits are clues, not a final verdict on the heart. Time, energy and attention can show the gap between what I say matters and how I actually live.',
      big: 'My private routines often reveal priorities my public words don’t.',
      sub: 'A small repeated choice can show a competing desire long before a big decision does.',
      prompts: ['Where does my free time go?', 'What do I do when I’m running on empty?', 'What small change would better match what I say I value?'],
      options: ['Entertainment and distraction', 'Work or productivity', 'Comfort or avoidance', 'Relationships and serving'],
      deep: { prompt: 'What might this private habit be giving you?',
        choices: ['A way to escape pressure.', 'Proof that I’m productive or important.', 'Comfort when I feel alone or tired.', 'Real restoration.'],
        follow: ['What pressure am I trying to escape?', 'Who am I trying to prove myself to?', 'What need could I meet in a healthier way?', 'What makes this life-giving rather than a way to avoid things?'],
        targets: [4, 6, 8, 10] },
      prayer: 'Lord, examine my hidden life with mercy and truth. Help my ordinary choices reflect love for You and for others.',
      whisper: 'Which ordinary habit deserves more intention?',
      action: 'Track one habit for seven days and note what need you were trying to meet each time.' },
    { q: 'When my circumstances change, what changes first: my trust, my thoughts or my behavior?',
      refs: 'Psalm 46:1–3 · James 1:2–8',
      verse: ['Psalm 46:1–2', 'God is our refuge and strength, an ever-present help in trouble. Therefore we will not fear, though the earth give way and the mountains fall into the heart of the sea.'],
      context: 'Stress shows how we tend to interpret and respond. A hard emotional reaction isn’t proof of weak faith. It may show where you need support, rest and prayer.',
      big: 'Pressure often reveals the responses I’ve practiced most.',
      sub: 'My first reaction tells me about my habits. It isn’t the final word on my faith.',
      prompts: ['What changed recently?', 'What was my first internal response?', 'What would a faithful next step look like?'],
      options: ['I worry right away', 'I try to control everything', 'I pull back and go quiet', 'I reach out for support and pray'],
      deep: { prompt: 'What’s hardest for you when circumstances change?',
        choices: ['My mind runs worst-case scenarios.', 'I feel I have to fix everything immediately.', 'I stop talking or asking for help.', 'I’m not sure what a faithful response would be.'],
        follow: ['What’s actually possible, and what’s only imagined?', 'Which part is mine to act on, and which isn’t?', 'Who could help me carry this honestly?', 'What’s one wise next step that doesn’t require certainty?'],
        targets: [3, 7, 6, 10] },
      prayer: 'God, meet me in the uncertainty. Give me wisdom for what I can do and trust for what I can’t control.',
      whisper: 'What support or faithful step might be right now?',
      action: 'The next time something shifts, pause, name what you feel, pray briefly and choose one grounded response.' },
    { q: 'What patterns keep repeating in my life, and why have I gotten comfortable explaining them instead of examining them?',
      refs: 'Galatians 6:7–9 · Proverbs 26:11',
      verse: ['Galatians 6:9', 'Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up.'],
      context: 'Repeated responses can come from habits, circumstances, unmet needs or other things. We can examine them without assuming every struggle is a spiritual failure.',
      big: 'An explanation can describe a pattern without changing it.',
      sub: 'The story I tell about why I keep doing something can keep me from trying a new response.',
      prompts: ['What repeats?', 'What happens right before it?', 'What have I tried, and what support might help?'],
      options: ['I blame circumstances', 'I blame myself', 'I promise to change without a plan', 'I’m trying out new responses'],
      deep: { prompt: 'What seems to keep the cycle going?',
        choices: ['I explain it by what other people do.', 'I shame myself and lose hope.', 'I make big promises without a specific plan.', 'I notice the trigger but struggle to respond differently.'],
        follow: ['What part of the pattern is within my influence?', 'What would grace and accountability look like together?', 'What one small response could I test this week?', 'What support or change in my surroundings would help?'],
        targets: [3, 10, 5, 4] },
      prayer: 'Father, give me honesty without shame, and perseverance to pursue wise, lasting change.',
      whisper: 'What might I need to learn, not just promise?',
      action: 'Write out the chain for one recurring pattern: trigger → what I told myself → what I did.' },
    { q: 'If God searched my heart today, what might He show me that I haven’t been willing or able to see?',
      refs: 'Psalm 139:23–24 · Jeremiah 17:9–10',
      verse: ['Psalm 139:23–24', 'Search me, God, and know my heart; test me and know my anxious thoughts. See if there is any offensive way in me, and lead me in the way everlasting.'],
      context: 'Psalm 139 invites God to search us and lead us. The goal isn’t endless suspicion of yourself. It’s honest openness before the One who already knows you fully.',
      big: 'God knows what I can’t fully see, and I can invite His searching without hiding.',
      sub: 'What I most need to see may be a place where I need grace, not just another flaw to fix.',
      prompts: ['What have I noticed across these ten questions?', 'What might I be protecting or avoiding?', 'What am I learning about God’s character as I reflect?'],
      options: ['A belief that needs testing', 'A fear that needs naming', 'A habit that needs changing', 'A truth I need to receive'],
      deep: { prompt: 'What would help you receive this discovery well?',
        choices: ['I need to examine a belief without panicking.', 'I need to name a fear honestly.', 'I need support to change a repeated habit.', 'I need to receive a truth about God’s grace.'],
        follow: ['What passage would help me test this belief fairly?', 'What is the fear trying to protect?', 'Who could support a specific next step?', 'What would resting in this truth look like today?'],
        targets: [2, 8, 9, 7] },
      prayer: 'Search me, God, and know my heart. Show me what is true, lead me in Your way and help me receive Your grace as I respond.',
      whisper: 'What seems worth bringing into prayer and testing against Scripture?',
      action: 'Write one honest sentence to God. If it helps, talk it over with a man you trust.' }
  ];
  var ENTRY = [
    ['I wonder if my assumptions are accurate', 2], ['I keep reacting out of past experiences', 3], ['I feel distracted or preoccupied', 4],
    ['Other people’s opinions drive my choices', 6], ['I keep repeating a habit or pattern', 9], ['I’m not sure what needs attention', 10]
  ];
  var TRACE = [['trigger', 'What happened?'], ['meaning', 'What meaning did I give it?'], ['belief', 'What did I assume or believe?'], ['response', 'How did I respond?'], ['truth', 'What does Scripture invite me to examine?']];
  var DSE = [['discard', 'Discard', 'One false or destructive belief to let go of'], ['submit', 'Submit', 'One uncertain desire or plan to hand to God'], ['embrace', 'Embrace', 'One biblical truth or wise practice to hold onto']];
  var REVIEW = ['When did I notice the pattern this week?', 'How did I respond? What actually happened?', 'What changed, if anything, in how I saw it or what I did?', 'What did I learn about God’s character, grace or faithfulness?', 'What support, conversation or Scripture would help next?', 'What is one next faithful step?'];
  var RESET = [['notice', 'Notice', 'What is filling my attention today?'], ['discard', 'Discard', 'What false or destructive conclusion should I let go of?'], ['submit', 'Submit', 'What uncertainty, desire or plan should I hand to God?'], ['embrace', 'Embrace', 'What truth or wise action should I hold onto?'], ['pray', 'Pray', 'What honest prayer do I want to offer?'], ['step', 'Step', 'What one action will I take today?']];

  /* ---------- helpers ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function track(name) { try { if (window.gtag) window.gtag('event', name); } catch (e) {} }
  function bible(ref) { return 'https://www.biblegateway.com/passage/?search=' + encodeURIComponent(ref.replace(/–/g, '-')) + '&version=NIV'; }
  function refLinks(refs) { return refs.split(' · ').map(function (r) { return '<a href="' + bible(r) + '" target="_blank" rel="noopener">' + esc(r) + '</a>'; }).join(' · '); }
  function fresh() { return { stage: 'intro', q: 1, keep: false, started: false, a: {}, audit: {}, reset: {} }; }
  function store(keep) { try { return keep ? window.localStorage : window.sessionStorage; } catch (e) { return null; } }

  var st = null;
  [true, false].forEach(function (k) { if (st) return; try { var s = store(k); var v = s && JSON.parse(s.getItem(KEY) || 'null'); if (v && typeof v === 'object') st = v; } catch (e) {} });
  if (!st) st = fresh();
  ['a', 'audit', 'reset'].forEach(function (k) { if (!st[k] || typeof st[k] !== 'object') st[k] = {}; });

  function save() {
    var s = store(st.keep), other = store(!st.keep);
    try { if (s) s.setItem(KEY, JSON.stringify(st)); } catch (e) {}
    try { if (other) other.removeItem(KEY); } catch (e) {}
  }
  function clearAll() { [true, false].forEach(function (k) { try { var s = store(k); if (s) s.removeItem(KEY); } catch (e) {} }); st = fresh(); }
  function A(n) { return st.a[n] || (st.a[n] = {}); }
  function filled(v) { return v != null && String(v).trim() !== ''; }
  function touched(n) { var d = st.a[n]; return !!d && (d.pick != null || filled(d.note) || filled(d.listen) || filled(d.step)); }
  function nTouched() { var c = 0; for (var i = 1; i <= 10; i++) if (touched(i)) c++; return c; }
  function area(id, field, label, val, ph, rows) {
    return '<div class="pt-field"><label for="' + id + '">' + label + '</label><textarea id="' + id + '" data-field="' + field + '" rows="' + (rows || 4) + '" maxlength="2000" placeholder="' + esc(ph || '') + '">' + esc(val) + '</textarea></div>';
  }

  /* ---------- screens ---------- */
  function intro() {
    var resume = nTouched() > 0;
    return '<span class="pt-label">Movement One · Recognize</span>' +
      '<h2 class="pt-h3">What if the filter you trust most is the one you’ve examined least?</h2>' +
      '<p>Every day you interpret situations, form expectations, make decisions and respond to people. You don’t walk into those moments empty. You bring habits, assumptions, fears, hopes and beliefs, and some of them you’ve never examined on purpose.</p>' +
      '<p>Ten questions will help you notice what’s been shaping the way you see. The aim is more attention to Christ, not more suspicion of yourself. You may find something to <strong>discard</strong>, something to <strong>submit</strong> and something good to <strong>embrace</strong>.</p>' +
      '<div class="fl-dse"><div><strong>Discard</strong>What is false or destructive</div><div><strong>Submit</strong>What needs wisdom and surrender</div><div><strong>Embrace</strong>What is true and good</div></div>' +
      '<p class="pt-small pt-muted">About 30–45 minutes for all ten, or take one question a day. Not every emotion is a lie, and not every hard thought is a sin.</p>' +
      '<label class="fl-keep"><input type="checkbox" data-a="keep"' + (st.keep ? ' checked' : '') + '> Keep my answers on this device so I can come back over several days. <span class="pt-muted">(Leave it unchecked on a shared device. Unchecked, closing the tab erases everything.)</span></label>' +
      '<div class="pt-actions">' +
        '<button type="button" class="pt-btn pt-btn--ember" data-a="begin">' + (resume ? 'Pick up where I left off' : 'Walk through all ten') + '</button>' +
        '<button type="button" class="pt-btn pt-btn--ghost" data-a="finder">Find my starting question</button>' +
      '</div>' +
      (st.finder ? '<fieldset class="pt-fieldset fl-finder"><legend class="pt-legend">What feels most relevant today?</legend>' +
        ENTRY.map(function (e) { return '<button type="button" class="pt-option" data-a="go" data-v="' + e[1] + '">' + esc(e[0]) + ' <span class="fl-arrow">→ Question ' + e[1] + '</span></button>'; }).join('') +
        '<p class="pt-small pt-muted">This only suggests a place to start. It isn’t a diagnosis.</p></fieldset>' : '') +
      (resume ? '<p class="pt-small"><button type="button" class="fl-link" data-a="journal">Go straight to my journal</button> · <button type="button" class="fl-link" data-a="resetday">Daily Filter Reset</button></p>' : '<p class="pt-small"><button type="button" class="fl-link" data-a="resetday">Already done it? Use the Daily Filter Reset</button></p>');
  }

  function dots() {
    var h = '<nav class="fl-dots" aria-label="Questions">';
    for (var i = 1; i <= 10; i++) h += '<button type="button" data-a="go" data-v="' + i + '" class="' + (touched(i) ? 'is-done' : '') + (st.stage === 'q' && st.q === i ? ' is-here' : '') + '" aria-label="Question ' + i + (touched(i) ? ', started' : '') + '"' + (st.stage === 'q' && st.q === i ? ' aria-current="step"' : '') + '>' + i + '</button>';
    return h + '<button type="button" data-a="audit" class="fl-dot-wide' + (st.stage === 'audit' ? ' is-here' : '') + '">Audit</button></nav>';
  }

  function question() {
    var n = st.q, q = Q[n - 1], d = A(n);
    var h = dots() + '<div class="pt-tool-top"><span class="pt-count">Recognize · Question ' + n + ' of 10</span><span class="pt-count">' + nTouched() + ' started</span></div>' +
      '<div class="pt-track"><div style="width:' + (n * 10) + '%"></div></div>' +
      '<h2 class="fl-q" tabindex="-1">' + esc(q.q) + '</h2>' +
      '<p class="pt-muted">' + esc(q.context) + '</p>' +
      '<blockquote class="fl-verse"><p>“' + esc(q.verse[1]) + '”</p><cite>' + esc(q.verse[0]) + ' (NIV)</cite></blockquote>' +
      '<p class="pt-small">Read in context: ' + refLinks(q.refs) + '</p>' +
      '<div class="fl-gems"><p><span class="pt-label">Big gem</span>' + esc(q.big) + '</p><p><span class="pt-label">Subtle gem</span>' + esc(q.sub) + '</p></div>' +

      '<div class="fl-step"><span class="fl-num">1 · Reflect</span><ol>' + q.prompts.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ol>' +
        area('flNote', 'a.' + n + '.note', 'My reflection <span class="pt-optional">(optional)</span>', d.note, 'Write what comes to mind…', 5) + '</div>' +

      '<div class="fl-step"><span class="fl-num">2 · Notice</span><fieldset class="pt-fieldset"><legend class="pt-legend">Which comes closest to what you noticed?</legend>' +
        q.options.map(function (o, i) { return '<button type="button" class="pt-option" data-a="pick" data-v="' + i + '" aria-pressed="' + (d.pick === i) + '">' + esc(o) + '</button>'; }).join('') +
        '<p class="pt-small pt-muted">A starting point, not a label.</p></fieldset>' + deeper(n) + '</div>' +

      '<div class="fl-step"><span class="fl-num">3 · Pray</span><p class="fl-prayer">' + esc(q.prayer) + '</p></div>' +

      '<div class="fl-step"><span class="fl-num">4 · Listen</span><p>Get quiet for a minute and ask: <strong>' + esc(q.whisper) + '</strong></p>' +
        '<p class="pt-small pt-muted">Write down what comes to mind without assuming every impression is God’s voice. Test it with Scripture, wisdom and a man you trust.</p>' +
        area('flListen', 'a.' + n + '.listen', 'What I’m noticing <span class="pt-optional">(optional)</span>', d.listen, '', 3) + '</div>' +

      '<div class="fl-step"><span class="fl-num">5 · Respond</span><p><strong>Try this:</strong> ' + esc(q.action) + '</p>' +
        area('flStep', 'a.' + n + '.step', 'My one faithful next step', d.step, 'This week I will…', 2) + '</div>' +

      '<div class="pt-actions">' +
        '<button type="button" class="pt-btn pt-btn--ghost" data-a="' + (n === 1 ? 'home' : 'prev') + '">← ' + (n === 1 ? 'Start' : 'Question ' + (n - 1)) + '</button>' +
        '<button type="button" class="pt-btn pt-btn--ember" data-a="' + (n === 10 ? 'audit' : 'next') + '">' + (n === 10 ? 'Open the Awareness Audit →' : 'Question ' + (n + 1) + ' →') + '</button>' +
      '</div>';
    return h;
  }

  function deeper(n) {
    var q = Q[n - 1], d = A(n), D = q.deep;
    if (d.pick == null) return '';
    var h = '<div class="fl-deep" id="flDeep"><span class="pt-label">Second layer · What might it mean?</span>' +
      '<p class="pt-small">You chose: <strong>' + esc(q.options[d.pick]) + '</strong>. That alone can’t tell you why it matters.</p>' +
      '<fieldset class="pt-fieldset"><legend class="pt-legend fl-legend-sm">' + esc(D.prompt) + '</legend>' +
      D.choices.map(function (c, i) { return '<button type="button" class="pt-option" data-a="deep" data-v="' + i + '" aria-pressed="' + (d.deep === i) + '">' + esc(c) + '</button>'; }).join('') + '</fieldset>';
    if (d.deep != null) {
      var t = D.targets[d.deep];
      h += '<div class="fl-beneath"><span class="pt-label">The question beneath your answer</span><p class="fl-beneath-q">' + esc(D.follow[d.deep]) + '</p>' +
        area('flDeepNote', 'a.' + n + '.deepNote', 'My honest answer <span class="pt-optional">(optional)</span>', d.deepNote, 'What might be true, uncertain or worth exploring?', 3) +
        (t !== n ? '<p class="pt-small"><strong>Related question to explore: ' + t + '.</strong> ' + esc(Q[t - 1].q) + '</p>' +
          '<p class="pt-small pt-muted">A suggestion based only on your answer, not a verdict on your heart.</p>' +
          '<button type="button" class="pt-btn pt-btn--ghost fl-small-btn" data-a="go" data-v="' + t + '">Go to Question ' + t + '</button>' : '') +
        '</div>';
    }
    return h + '</div>';
  }

  function audit() {
    var d = st.audit;
    return dots() + '<span class="pt-label">Checkpoint · The Awareness Audit</span>' +
      '<h2 class="pt-h3" tabindex="-1">Pull it together</h2>' +
      '<p>You’ve had ten chances to notice the filters that shape how you see. This is a pause to put it together, not a grade.</p>' +
      '<div class="fl-gems"><p><span class="pt-label">Big gem</span>What has become familiar can stay unexamined.</p><p><span class="pt-label">Subtle gem</span>Sometimes the filter is so familiar we mistake it for our personality.</p></div>' +
      '<div class="fl-step"><span class="fl-num">1 · Three patterns I noticed</span>' +
        [1, 2, 3].map(function (i) { return area('flP' + i, 'audit.p' + i, 'Pattern ' + i, d['p' + i], '', 2); }).join('') + '</div>' +
      '<div class="fl-step"><span class="fl-num">2 · Trace one pattern</span>' +
        TRACE.map(function (t) { return area('flT' + t[0], 'audit.' + t[0], t[1], d[t[0]], '', 2); }).join('') + '</div>' +
      '<div class="fl-step"><span class="fl-num">3 · Discard · Submit · Embrace</span>' +
        DSE.map(function (t) { return area('flD' + t[0], 'audit.' + t[0], '<span class="fl-dse-tag">' + t[1] + '</span> ' + t[2], d[t[0]], '', 2); }).join('') + '</div>' +
      '<div class="fl-step"><span class="fl-num">4 · Pray</span><p class="fl-prayer">Search me, God, and know my heart. Show me what needs to be examined, renew what needs to change, and teach me to receive Your truth and grace. Lead me in the way everlasting. Amen.</p></div>' +
      '<div class="fl-step"><span class="fl-num">5 · One seven-day practice</span>' +
        area('flPractice', 'audit.practice', 'What I’ll practice for the next seven days', d.practice, '', 2) + '</div>' +
      '<div class="pt-actions">' +
        '<button type="button" class="pt-btn pt-btn--ghost" data-a="go" data-v="10">← Question 10</button>' +
        '<button type="button" class="pt-btn pt-btn--ember" data-a="journal">See my journal →</button>' +
      '</div>';
  }

  function show(v) { return filled(v) ? esc(String(v).trim()).replace(/\n/g, '<br>') : '<em class="pt-muted">Not written</em>'; }

  function journal() {
    var d = st.audit, h = '<span class="pt-label">The Filter Lens · Recognize</span><h2 class="pt-h3" tabindex="-1">My journal</h2>' +
      '<p class="pt-muted pt-small">Everything you wrote, in one place. Print it or save it as a PDF to keep, then come back in seven days for the review.</p>';
    var any = false;
    for (var n = 1; n <= 10; n++) {
      if (!touched(n)) continue; any = true;
      var q = Q[n - 1], a = A(n);
      h += '<div class="fl-entry"><span class="fl-num">Question ' + n + '</span><h3>' + esc(q.q) + '</h3>' +
        (filled(a.note) ? '<p><strong>Reflection:</strong> ' + show(a.note) + '</p>' : '') +
        (a.pick != null ? '<p><strong>What I noticed:</strong> ' + esc(q.options[a.pick]) + (a.deep != null ? '. ' + esc(q.deep.choices[a.deep]) : '') + '</p>' : '') +
        (a.deep != null ? '<p><strong>The question beneath it:</strong> ' + esc(q.deep.follow[a.deep]) + (filled(a.deepNote) ? '<br>' + show(a.deepNote) : '') + '</p>' : '') +
        (filled(a.listen) ? '<p><strong>Listening:</strong> ' + show(a.listen) + '</p>' : '') +
        '<p><strong>Next step:</strong> ' + show(a.step) + '</p>' +
        '<p class="fl-entry-gem">' + esc(q.big) + '</p></div>';
    }
    if (!any) h += '<p class="pt-callout">You haven’t started any questions yet. <button type="button" class="fl-link" data-a="go" data-v="1">Start with Question 1</button>.</p>';
    var auditAny = Object.keys(d).some(function (k) { return filled(d[k]); });
    if (auditAny) {
      h += '<div class="fl-entry"><span class="fl-num">Awareness Audit</span>' +
        [1, 2, 3].filter(function (i) { return filled(d['p' + i]); }).map(function (i) { return '<p><strong>Pattern ' + i + ':</strong> ' + show(d['p' + i]) + '</p>'; }).join('') +
        TRACE.filter(function (t) { return filled(d[t[0]]); }).map(function (t) { return '<p><strong>' + t[1] + '</strong> ' + show(d[t[0]]) + '</p>'; }).join('') +
        DSE.map(function (t) { return '<p><strong>' + t[1] + ':</strong> ' + show(d[t[0]]) + '</p>'; }).join('') +
        '<p><strong>My seven-day practice:</strong> ' + show(d.practice) + '</p></div>';
    }
    h += '<div class="fl-review"><span class="pt-label">Come back in seven days</span><h3 class="pt-h3">What changed, and what did I learn about God?</h3>' +
      '<p class="pt-small">Not pass or fail. Growth can include setbacks, more honesty and learning to ask for help. Answer on the printout or in your own journal.</p>' +
      '<ol>' + REVIEW.map(function (r) { return '<li>' + esc(r) + '<div class="fl-lines"></div></li>'; }).join('') + '</ol>' +
      '<p class="fl-prayer">Father, thank You for meeting me in an unfinished journey. Help me receive what is true, learn from what was hard and keep abiding in Christ. Amen.</p></div>';
    h += '<div class="fl-gem">A belief can be familiar without being true.</div>';
    h += '<div class="pt-actions pt-no-print">' +
        '<button type="button" class="pt-btn" data-a="print">Print / save as PDF</button>' +
        '<button type="button" class="pt-btn pt-btn--ghost" data-a="copy">Copy as text</button>' +
        '<button type="button" class="pt-btn pt-btn--ghost" data-a="download">Download (.txt)</button>' +
      '</div><p class="pt-feedback pt-no-print" id="flFb" aria-live="polite"></p>' +
      '<div class="pt-actions pt-no-print">' +
        '<button type="button" class="pt-btn pt-btn--ghost" data-a="resetday">Daily Filter Reset</button>' +
        '<button type="button" class="pt-btn pt-btn--ghost" data-a="go" data-v="1">Back to the questions</button>' +
        '<button type="button" class="pt-btn pt-btn--ghost" data-a="clear">Clear my answers</button>' +
      '</div>' +
      '<p class="pt-muted pt-small pt-no-print">' + (st.keep ? 'Your answers are kept on this device until you clear them.' : 'Your answers stay in this browser tab only. Closing the tab or pressing “Clear my answers” erases them.') + '</p>';
    return h;
  }

  function resetDay() {
    var d = st.reset;
    return '<span class="pt-label">A practice for any day</span><h2 class="pt-h3" tabindex="-1">The Daily Filter Reset</h2>' +
      '<p>Five minutes. Use it whenever something is coloring how you see. Scripture: ' + refLinks('Philippians 4:8–9 · Psalm 139:23–24 · 1 Thessalonians 5:21') + '.</p>' +
      '<div class="fl-gems"><p><span class="pt-label">Big gem</span>What I practice paying attention to shapes how I respond.</p><p><span class="pt-label">Subtle gem</span>Not every thought needs a fight. Sometimes faithful attention means letting a passing thought pass.</p></div>' +
      RESET.map(function (r) { return area('flR' + r[0], 'reset.' + r[0], '<span class="fl-dse-tag">' + r[1] + '</span> ' + r[2], d[r[0]], '', 2); }).join('') +
      '<div class="pt-actions pt-no-print">' +
        '<button type="button" class="pt-btn" data-a="print">Print / save as PDF</button>' +
        '<button type="button" class="pt-btn pt-btn--ghost" data-a="clearreset">Clear today’s reset</button>' +
        '<button type="button" class="pt-btn pt-btn--ghost" data-a="home">← Back to start</button>' +
      '</div>';
  }

  /* ---------- text export ---------- */
  function asText() {
    var L = ['THE FILTER LENS · MOVEMENT ONE: RECOGNIZE', 'thewrkshop.com/tools/filter-lens/', ''];
    function t(v) { return filled(v) ? String(v).trim() : '(not written)'; }
    for (var n = 1; n <= 10; n++) {
      if (!touched(n)) continue;
      var q = Q[n - 1], a = A(n);
      L.push('QUESTION ' + n + ': ' + q.q);
      if (filled(a.note)) L.push('Reflection: ' + t(a.note));
      if (a.pick != null) L.push('What I noticed: ' + q.options[a.pick] + (a.deep != null ? '. ' + q.deep.choices[a.deep] : ''));
      if (a.deep != null) L.push('The question beneath it: ' + q.deep.follow[a.deep] + (filled(a.deepNote) ? ' ' + t(a.deepNote) : ''));
      if (filled(a.listen)) L.push('Listening: ' + t(a.listen));
      L.push('Next step: ' + t(a.step), '');
    }
    var d = st.audit;
    if (Object.keys(d).some(function (k) { return filled(d[k]); })) {
      L.push('AWARENESS AUDIT');
      [1, 2, 3].forEach(function (i) { if (filled(d['p' + i])) L.push('Pattern ' + i + ': ' + t(d['p' + i])); });
      TRACE.forEach(function (x) { if (filled(d[x[0]])) L.push(x[1] + ' ' + t(d[x[0]])); });
      DSE.forEach(function (x) { L.push(x[1] + ': ' + t(d[x[0]])); });
      L.push('Seven-day practice: ' + t(d.practice), '');
    }
    L.push('SEVEN-DAY REVIEW'); REVIEW.forEach(function (r, i) { L.push((i + 1) + '. ' + r); });
    L.push('', '© 2026 TheWrkShop · thewrkshop.com');
    return L.join('\n');
  }
  function feedback(m) { var fb = document.getElementById('flFb'); if (fb) fb.textContent = m; }
  function copyText(text) {
    function fallback() {
      var ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); feedback('Copied.'); } catch (e) { feedback('Couldn’t copy. Try Print / save as PDF instead.'); }
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(function () { feedback('Copied.'); }, fallback); else fallback();
  }
  function download(text) {
    try {
      var blob = new Blob([text], { type: 'text/plain;charset=utf-8' }), a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = 'filter-lens-journal-' + new Date().toISOString().slice(0, 10) + '.txt';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000); feedback('Downloaded.');
    } catch (e) { feedback('Couldn’t download. Try Copy or Print instead.'); }
  }

  /* ---------- render + events ---------- */
  function render(focus) {
    var html = st.stage === 'q' ? question() : st.stage === 'audit' ? audit() : st.stage === 'journal' ? journal() : st.stage === 'reset' ? resetDay() : intro();
    app.innerHTML = html;
    document.body.classList.toggle('fl-printing-journal', st.stage === 'journal');
    if (focus) {
      var top = app.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      var h = app.querySelector('[tabindex="-1"]'); if (h) h.focus({ preventScroll: true });
    }
  }
  function goStage(stage, q) { st.stage = stage; if (q) st.q = q; if (!st.started && (stage === 'q' || stage === 'audit')) { st.started = true; track('filter_lens_start'); } if (stage === 'journal' && !st.finished) { st.finished = true; track('filter_lens_finish'); } save(); render(true); }

  app.addEventListener('click', function (e) {
    var b = e.target.closest('[data-a]'); if (!b || b.tagName === 'INPUT') return;
    var a = b.getAttribute('data-a'), v = b.getAttribute('data-v');
    if (a === 'begin') { var first = 1; for (var i = 1; i <= 10; i++) { if (!touched(i)) { first = i; break; } if (i === 10) first = 10; } goStage('q', nTouched() ? first : 1); }
    else if (a === 'finder') { st.finder = !st.finder; save(); render(); }
    else if (a === 'go') goStage('q', +v);
    else if (a === 'next') goStage('q', Math.min(10, st.q + 1));
    else if (a === 'prev') goStage('q', Math.max(1, st.q - 1));
    else if (a === 'home') goStage('intro');
    else if (a === 'audit') goStage('audit');
    else if (a === 'journal') goStage('journal');
    else if (a === 'resetday') goStage('reset');
    else if (a === 'pick') {
      var d = A(st.q), val = +v;
      if (d.pick !== val) { d.pick = val; delete d.deep; delete d.deepNote; }
      save(); render(); var dp = document.getElementById('flDeep'); if (dp) dp.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    else if (a === 'deep') { A(st.q).deep = +v; save(); render(); }
    else if (a === 'print') { window.print(); }
    else if (a === 'copy') copyText(asText());
    else if (a === 'download') download(asText());
    else if (a === 'clear') { if (window.confirm('Erase everything you’ve written in the Filter Lens on this device?')) { clearAll(); render(true); } }
    else if (a === 'clearreset') { st.reset = {}; save(); render(); }
  });
  app.addEventListener('change', function (e) {
    if (e.target.getAttribute('data-a') === 'keep') { st.keep = e.target.checked; save(); }
  });
  app.addEventListener('input', function (e) {
    var f = e.target.getAttribute('data-field'); if (!f) return;
    var p = f.split('.'), o = st[p[0]];
    if (p.length === 3) { o = o[p[1]] || (o[p[1]] = {}); o[p[2]] = e.target.value; } else o[p[1]] = e.target.value;
    save();
  });

  render(false);
})();

/* Share row: Share / Copy link / Print for this page only. */
(function () {
  'use strict';
  document.querySelectorAll('.fl-share').forEach(function (bar) {
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
