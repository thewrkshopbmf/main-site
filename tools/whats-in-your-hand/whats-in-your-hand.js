/* What's in Your Hand? A private purpose inventory, from TheWrkShop's "What Do You Have?" study.
   Five steps: take inventory (8 categories), name what you've dismissed and the excuse,
   what you're holding back, who's in front of you, and open your hands.
   Then a reflection, a seven-day path and a prayer.
   Everything a person enters stays in this browser tab (sessionStorage) and is never sent to a server.
   Google Analytics receives start/finish counts only, never answers. */
(function () {
  'use strict';
  var app = document.getElementById('whApp');
  if (!app) return;
  var FIXED = app.getAttribute('data-aud') || '';
  var KEY = FIXED ? 'tws.inyourhand.' + FIXED + '.v1' : 'tws.inyourhand.v1';

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

  /* Audience versions. Each can be opened directly with a link: /tools/whats-in-your-hand/#after-loss (etc.). */
  var AUD = {
    '': { label: 'Any man' },
    'after-loss': { label: 'After a loss',
      title: 'What do you still have when everything is taken?',
      lead: 'Job lost nearly everything and still said, “The LORD gave and the LORD has taken away; may the name of the LORD be praised.” The prodigal had nothing left but the road home. After a job loss, a divorce or retirement, it can feel like your hands are empty. They aren’t.',
      cats: {
        staff: ['The job or role may be gone, but the skill isn’t. What do you still know how to do?', 'Managing people, selling, building, fixing, planning…'],
        scars: ['What you’re walking through right now may become someone else’s help. What have you already learned?', 'How to keep going, what really matters, who stayed…'],
        yes: ['This season may have given you something you didn’t have before: time. When are you available?', 'Weekday mornings, most afternoons, every Saturday…'] },
      excuses: [
        { says: 'Everything has been taken from me.', ref: 'Job 1:20–22', answer: 'Job lost his wealth and his children in a day, and he worshiped. Later the LORD restored his fortunes (Job 42:10). The loss is real, and so is the God who stays.' },
        { says: 'I wasted what I had.', ref: 'Luke 15:17–24', answer: 'The prodigal came to his senses with nothing left but the road home, and his father ran to meet him. You still have a way back, and a story someone else needs.' }],
      days: [['Job 1:20–22', 'Name what you lost, honestly. Then name one thing you still have.'],
        ['Psalm 34:18', 'Tell God how this season really feels.'],
        ['Ruth 1:16–17', 'Ruth lost almost everything and still had loyalty and a yes. Who is still with you? Thank them.'],
        ['Luke 15:17–20', 'Take one step home this week: back to God, back to church, or back to a friend.'],
        ['2 Corinthians 1:3–4', 'Name someone going through a loss like yours, and reach out to them.'],
        ['Isaiah 43:18–19', 'Ask God what new thing He might be doing in this season.'],
        ['Job 42:10', 'Look back on the week: what did you find was still in your hands?']],
      help: 'Grief after a job loss, divorce or retirement is real. If it turns into hopelessness, talk with a pastor and a licensed counselor. If you’re thinking about ending your life, call or text 988 (US).' },
    'veterans': { label: 'Veterans & soldiers',
      title: 'What did God train into you in uniform?',
      lead: 'David didn’t face Goliath in borrowed armor. He used what he’d been trained in when no one was watching. Your service trained things into you: discipline, courage, loyalty, carrying weight for others. God doesn’t waste any of it.',
      cats: {
        sling: ['What did your service train into you that most men never learned?', 'Discipline, leading under pressure, staying calm, watching out for the man next to me…'],
        scars: ['Some of what you carry from service could become another veteran’s help. What have you walked through?', 'Coming home, losing friends, injuries, finding faith again…'],
        people: ['Who are the men you served with, or the veterans near you?', 'My old unit, guys at the VFW, a neighbor who served…'] },
      excuses: [
        { says: 'What I did in uniform doesn’t translate.', ref: '1 Samuel 17:34–37', answer: 'David told Saul that keeping sheep had trained him to face lions and bears. God used a skill from one season to win a battle in another.' },
        { says: 'I’ve seen and done too much to be useful to God.', ref: 'Acts 9:13–15', answer: 'Paul had a violent past, and God called him “my chosen instrument.” Grace doesn’t erase your story. It redeems it.' }],
      days: [['1 Samuel 17:34–40', 'List three things your service trained into you.'],
        ['Joshua 1:9', 'Read it out loud. Where do you need courage now?'],
        ['2 Timothy 2:3–4', 'Name one mission worth giving yourself to in this season.'],
        ['Psalm 18:32–34', 'Thank God for the strength He’s built in you.'],
        ['2 Corinthians 1:3–4', 'Reach out to one veteran this week, just to check in.'],
        ['Isaiah 6:8', 'Tell God, “Here am I. Send me,” and mean one specific thing by it.'],
        ['John 15:13', 'Look back on the week: where did you lay something down for someone else?']],
      help: 'If you’re a veteran in crisis, call 988 and press 1, or text 838255 (Veterans Crisis Line). If you’re carrying what you saw or did, a chaplain, a pastor or a counselor who works with veterans can help.' },
    'young-men': { label: 'Young men',
      title: 'You’re not too young for God to use what’s in your hand.',
      lead: 'Jeremiah said, “I am too young.” God said, “Do not say that.” Timothy was told not to let anyone look down on him because he was young. David was a teenager with a sling. God isn’t waiting for you to grow up before He uses what you have.',
      cats: {
        staff: ['What are you good at, even if it seems small? A sport, a skill, a subject, something you make?', 'Basketball, video editing, fixing bikes, math, making people laugh…'],
        voice: ['Who listens to you? Friends, teammates, younger kids, people online?', 'My team, my little brother, my group chat…'],
        yes: ['When are you free? Summers, weekends, after school or work?', 'Saturday mornings, two nights a week, this summer…'] },
      excuses: [
        { says: 'I haven’t done anything yet.', ref: '1 Timothy 4:12', answer: 'Paul told Timothy not to let anyone look down on him for being young, but to set an example in speech, conduct, love, faith and purity. You can start there today.' }],
      days: [['Jeremiah 1:4–8', 'Write down one way you’ve said “I’m too young.” Then cross it out.'],
        ['1 Samuel 17:32–37', 'Name something you’ve practiced that God could use.'],
        ['1 Timothy 4:12', 'Pick one of the five (speech, conduct, love, faith, purity) to set an example in this week.'],
        ['Ecclesiastes 12:1', 'Give God the first ten minutes of your day, before your phone.'],
        ['John 6:9', 'Offer something small: help a younger kid, a teammate or a parent.'],
        ['Proverbs 27:17', 'Ask an older man you respect to grab a meal or coffee with you.'],
        ['Psalm 119:9', 'Look back on the week: what did you learn about what God can use?']],
      help: 'If you’re going through something heavy and need to talk to someone now, call or text 988 (US), and tell a parent, pastor or another adult you trust.' },
    'leaders': { label: 'Leaders & teams', secular: true, commit: true, url: 'thewrkshop.com/tools/use-what-you-have/',
      title: 'Most leaders start with what they don’t have.',
      lead: 'Not enough budget, headcount, time or authority. The best leaders start somewhere else: with what’s already in their hands. This private inventory helps you see the assets you’ve been overlooking, name the excuse you’ve been using, and put one to work this week.',
      names: { staff: 'Your skills', oil: 'Your resources', sling: 'Your hard-won experience', voice: 'Your influence', story: 'Your story', scars: 'Your setbacks', people: 'Your team & network', yes: 'Your capacity' },
      cats: {
        staff: ['What can you do better than most people around you?', 'Negotiating, simplifying complex problems, building trust fast, running a tight meeting…'],
        oil: ['What resources do you already control or have access to, even small ones?', 'A modest budget, a tool nobody uses well, a meeting slot, a quiet hour each morning…'],
        sling: ['What did a past role, setback or side project train into you that you’ve stopped noticing?', 'Turning around a failing team, sales from the ground up, managing through layoffs…'],
        voice: ['Where do people already listen to you, with or without a title?', 'My peers, the new hires, a client who trusts me, an industry group…'],
        story: ['What have you lived through that would help someone on your team?', 'Starting over in my 40s, getting fired and recovering, building something from nothing…'],
        scars: ['What failure or setback taught you something you couldn’t have learned another way?', 'A launch that flopped, a hire I got wrong, a year I burned out…'],
        people: ['Who is already on your team or in your network that you haven’t fully tapped?', 'A quiet analyst with big ideas, a former boss, a peer in another department…'],
        yes: ['Where do you actually have capacity, if you protected it?', 'Friday afternoons, the first hour of the day, one lunch a week…'] },
      onlyExcuses: [
        { says: 'We don’t have the budget.', ref: 'John 6:9', answer: 'Constraints aren’t the end of the plan. They’re often the start of a better one. Five loaves and two fish looked ridiculous for a crowd of thousands, and it was enough.' },
        { says: 'I don’t have the title or authority.', ref: 'Nehemiah 2:1–8', answer: 'Influence comes before position. Nehemiah was a cupbearer, not a governor, when he started rebuilding a city. He used the access he already had.' },
        { says: 'My team isn’t strong enough.', ref: 'Judges 7:2–7', answer: 'Gideon’s army was cut from 32,000 to 300 before the win. A smaller, committed team that knows what it has often outperforms a bigger one that doesn’t.' },
        { says: 'I don’t have time.', ref: 'Ephesians 5:15–16', answer: 'You don’t find time. You decide what it’s for. Protect one hour this week for the thing only you can do.' },
        { says: 'I’m not experienced enough.', ref: '1 Samuel 17:34–40', answer: 'David didn’t fight in borrowed armor. He used what he’d practiced when nobody was watching. Your unusual background may be your edge.' },
        { says: 'We tried that and it failed.', ref: 'Luke 5:4–6', answer: 'Peter had fished all night and caught nothing. One more try, in a different way, filled the nets. A past failure is data, not a verdict.' }],
      text: {
        s3h: 'What are you holding back?',
        s3p: 'Leaders often hoard what would make their team better: information, credit, access, a skill they’ve never taught. What are you holding that would multiply if you gave it away?',
        s3ph: 'Credit for wins, a client relationship, how I really make decisions, my calendar…',
        s4h: 'Who needs what you have?',
        s4p: 'Name one person on your team, or one problem in front of you, that what’s in your hands could help right now.',
        s4ph: 'A new manager who’s drowning, the handoff between sales and operations…',
        s5h: 'Commit to one step',
        s5say: 'Say it out loud:',
        s5check: 'I said it',
        s5ph: 'For example: spend Friday’s first hour teaching Maria how I build forecasts…',
        startHere: 'Start right here.',
        daysIntro: 'One action a day. Each one is rooted in a principle as old as Moses’ staff; the reference is there if you want to read it.',
        keepGoing: 'use the <a href="/studies/spotting-leaders/">Spotting Leaders</a> guide to see who on your team is ready for more, or read TheWrkShop’s <a href="/leadership/">leadership writing</a>.',
        summaryTitle: 'USE WHAT YOU HAVE' },
      days: [['Exodus 4:2', 'Write down the one asset you’ve been underusing. Decide one way to use it this week.'],
        ['John 6:9–11', 'Pick one constraint you’ve been complaining about. Ask your team, “What could we do with only what we have?”'],
        ['Nehemiah 2:4–5', 'Use the access you already have: make one request you’ve been waiting for permission to make.'],
        ['Matthew 25:14–30', 'Name one thing you’ve buried out of fear of failing. Take the first small step on it.'],
        ['2 Timothy 2:2', 'Teach one skill to someone on your team that you’ve been doing yourself.'],
        ['Luke 10:33–35', 'Notice one person who’s struggling. Stop and ask how you can help.'],
        ['Luke 16:10', 'Look back on the week: what happened when you used what you already had?']],
      principle: 'Every leader faces the same question Moses did: “What is that in your hand?” God almost never starts with what we don’t have. He starts with what’s already there, and multiplies what’s offered. What you keep shrinks. What you pour out multiplies.' },
    'couples': { label: 'Couples', we: true,
      title: 'What’s in your house?',
      lead: 'Elisha asked a struggling widow, “What do you have in your house?” She had a little oil, and God filled every jar she could find. Priscilla and Aquila opened their home, and a church met there. Take this inventory together: what has God already put in your house?',
      cats: {
        oil: ['What’s already in your house that God could use? Space, a table, a car, tools, time?', 'A big kitchen table, a spare room, our minivan, Sunday afternoons…'],
        story: ['What has God brought you through as a couple?', 'A hard first year, infertility, losing a parent, rebuilding trust…'],
        people: ['Who already sits at your table, or could?', 'Neighbors, newlyweds from church, our kids’ friends’ parents…'],
        yes: ['When are you both available?', 'Sunday evenings, one Saturday a month…'] },
      excuses: [
        { says: 'Our marriage isn’t strong enough to help anyone.', ref: '2 Corinthians 12:9', answer: 'God’s power is made perfect in weakness. Couples who have struggled and stayed are often the ones other couples trust most.' },
        { says: 'We don’t have enough to share.', ref: '2 Kings 4:1–7', answer: 'The widow said she had nothing but a little oil. God filled every jar she could find. Start with what’s already in your house.' }],
      days: [['2 Kings 4:1–7', 'Walk through your home together. Name what God has already put in it.'],
        ['Romans 16:3–5', 'Read about Priscilla and Aquila. Talk about what your home could be used for.'],
        ['Joshua 24:15', 'Write a one-line mission for your household together.'],
        ['Hebrews 13:2', 'Plan one meal for someone outside your family this month.'],
        ['Ecclesiastes 4:9–12', 'Pray together for five minutes, out loud.'],
        ['2 Corinthians 1:3–4', 'Name a couple going through what you’ve walked through, and reach out.'],
        ['Psalm 127:1', 'Look back on the week together: what did God build?']],
      help: 'If there’s abuse or you don’t feel safe at home, that comes first: call the National Domestic Violence Hotline at 1-800-799-7233, or 911 in an emergency. For a marriage that’s struggling, talk with a pastor or a Christian counselor.' }
  };
  var AUD_KEYS = ['', 'after-loss', 'veterans', 'young-men', 'couples'];

  /* ---------- helpers ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function track(name) { try { if (window.gtag) window.gtag('event', name); } catch (e) {} }
  function bible(ref) { return 'https://www.biblegateway.com/passage/?search=' + encodeURIComponent(ref.replace(/–/g, '-')) + '&version=NIV'; }
  function refLink(ref) { return '<a href="' + bible(ref) + '" target="_blank" rel="noopener">' + esc(ref) + '</a>'; }
  function fresh() { return { stage: 'intro', aud: '', inv: {}, dismissed: '', excuse: null, holding: '', person: '', step: '', prayed: false, done: {} }; }
  var st;
  try { st = JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch (e) { st = null; }
  if (!st || typeof st !== 'object' || !st.inv) st = fresh();
  if (!st.done) st.done = {};
  if (!AUD[st.aud]) st.aud = '';
  if (FIXED && AUD[FIXED]) st.aud = FIXED;
  else (function () { var h = (location.hash || '').replace('#', ''); if (AUD[h] && h && AUD_KEYS.indexOf(h) > -1) st.aud = h; })();
  function A() { return AUD[st.aud] || AUD['']; }
  function we() { return !!A().we; }
  function excuses() { return A().onlyExcuses || (A().excuses || []).concat(EXCUSES); }
  function nameFor(c) { return (A().names && A().names[c.id]) || c.name; }
  function refLabel(c) { return A().secular ? 'Rooted in ' + c.ref : c.ref; }
  function tx(k, d) { var t = A().text && A().text[k]; return t != null ? t : d; }
  function prayTail(long) {
    if (A().commit) return '';
    if (we()) return long ? 'It doesn’t look like enough to us. We put it in Your hands. Use it for Your glory and for the people in front of us.' : 'It doesn’t look like enough to us. We put it in Your hands.';
    return long ? 'It doesn’t look like enough to me. I put it in Your hands. Use it for Your glory and for the people in front of me.' : 'It doesn’t look like enough to me. I put it in Your hands.';
  }
  function days() { return A().days || DAYS; }
  function promptFor(c) { var o = A().cats && A().cats[c.id]; return o ? o[0] : c.prompt; }
  function phFor(c) { var o = A().cats && A().cats[c.id]; return o ? o[1] : c.ph; }
  function save() { try { sessionStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  function clearAll() { var a = st && st.aud; try { sessionStorage.removeItem(KEY); } catch (e) {} st = fresh(); st.aud = a || ''; }
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
    if (A().commit) return l ? 'This week I’ll put this to work: ' + l + '.' : 'This week I’ll put what’s already in my hands to work.';
    if (we()) return l ? 'Lord, what’s in our hands is this: ' + l + '.' : 'Lord, here’s what’s in our hands.';
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
    var a = A();
    var chooser = FIXED ? '' : '<p class="pt-small"><strong>Who’s this for?</strong></p><div class="wh-chips" role="group" aria-label="Who is this for?">' +
      AUD_KEYS.map(function (k) { return '<button type="button" data-a="aud" data-v="' + k + '" aria-pressed="' + (st.aud === k) + '">' + esc(AUD[k].label) + '</button>'; }).join('') + '</div>';
    return chooser + (a.title ? '<h2 class="pt-h2">' + esc(a.title) + '</h2><p>' + esc(a.lead) + '</p>' :
      '<h2 class="pt-h2">God almost never starts with what you don’t have.</h2>' +
      '<p>He starts with what’s already in your hand. Moses had a staff. The widow had a little oil. A boy had five loaves and two fish. Each time the person thought, “It’s not enough.” Each time, God started there.</p>') +
      '<p>This private inventory helps you see what God has already put in your hands, name the excuse you’ve been using, and take one step to put it to work.</p>' +
      '<ul class="wh-facts"><li><strong>Step 1:</strong> take inventory (8 short prompts, fill in what fits)</li><li><strong>Steps 2–5:</strong> what you’ve dismissed, what you’re holding back, who’s in front of you, and opening your hands</li><li><strong>Time:</strong> about 10 minutes · nothing is saved or sent</li></ul>' +
      '<div class="pt-actions">' +
        '<button type="button" class="pt-btn pt-btn--ember" data-a="start">' + (resume ? 'Continue where I left off' : 'Take inventory →') + '</button>' +
        (resume ? '<button type="button" class="pt-btn pt-btn--ghost" data-a="restart">Start over</button>' : '') +
      '</div>';
  }

  function inventory() {
    return '<span class="pt-eyebrow">Step 1 of 5</span>' +
      '<h2 class="pt-h2">' + (we() ? 'What’s in your house?' : 'What’s in your hand?') + '</h2>' +
      '<p class="pt-muted">Fill in the ones that fit. A few honest words is enough. Skip any that don’t.</p>' +
      CATS.map(function (c) {
        return '<div class="wh-item"><span class="wh-ref">' + esc(refLabel(c)) + '</span><h3>' + esc(nameFor(c)) + (A().secular ? '' : ': ' + esc(c.what)) + '</h3>' +
          '<p>' + esc(promptFor(c)) + '</p>' +
          '<div class="pt-field"><label class="so-sr" for="wh_' + c.id + '">' + esc(nameFor(c)) + '</label><textarea id="wh_' + c.id + '" data-inv="' + c.id + '" maxlength="500" placeholder="' + esc(phFor(c)) + '">' + esc(st.inv[c.id] || '') + '</textarea></div></div>';
      }).join('') +
      '<p class="pt-feedback" id="whNeed" aria-live="polite"></p>' +
      '<div class="pt-actions">' +
        '<button type="button" class="pt-btn pt-btn--ghost" data-a="toIntro">← Back</button>' +
        '<button type="button" class="pt-btn pt-btn--ember" data-a="toSteps">Continue →</button>' +
      '</div>';
  }

  function steps() {
    var f = filled();
    var ex = st.excuse != null ? excuses()[st.excuse] : null;
    return '<span class="pt-eyebrow">Steps 2–5</span>' +
      '<h2 class="pt-h2">From “not enough” to open hands</h2>' +
      '<div class="wh-step"><span class="wh-num">Step 2</span><h3 class="pt-h3">Which one have you dismissed as “not enough”?</h3>' +
        '<div class="wh-chips" role="group" aria-label="What have you dismissed?">' + f.map(function (c) {
          return '<button type="button" data-a="dismiss" data-v="' + c.id + '" aria-pressed="' + (st.dismissed === c.id) + '">' + esc(nameFor(c)) + '</button>';
        }).join('') + '</div>' +
        '<p>What do you usually tell yourself about it?</p>' +
        '<div class="wh-chips" role="group" aria-label="Your excuse">' + excuses().map(function (e, i) {
          return '<button type="button" data-a="excuse" data-v="' + i + '" aria-pressed="' + (st.excuse === i) + '">' + esc(e.says) + '</button>';
        }).join('') + '</div>' +
        '<div id="whAnswer" aria-live="polite">' + (ex ? '<div class="pt-callout"><p><strong>' + refLink(ex.ref) + '</strong> · ' + esc(ex.answer) + '</p></div>' : '') + '</div></div>' +
      '<div class="wh-step"><span class="wh-num">Step 3</span><h3 class="pt-h3">' + tx('s3h', 'What are you holding back?') + '</h3>' +
        '<p class="pt-small pt-muted">' + tx('s3p', 'The woman broke her alabaster jar and poured it all out. The rich young ruler walked away sad because he couldn’t let go. What are you gripping that God may be asking you to open?') + '</p>' +
        '<div class="pt-field"><label class="so-sr" for="whHold">What I’m holding back</label><textarea id="whHold" data-field="holding" maxlength="1000" placeholder="' + tx('s3ph', 'My time, my money, my comfort, a dream I’ve kept to myself…') + '">' + esc(st.holding) + '</textarea></div></div>' +
      '<div class="wh-step"><span class="wh-num">Step 4</span><h3 class="pt-h3">' + tx('s4h', 'Who’s in front of you?') + '</h3>' +
        '<p class="pt-small pt-muted">' + tx('s4p', 'The Samaritan didn’t go looking for a mission. He stopped for the man on his road. Name one person or need you already see.') + '</p>' +
        '<div class="pt-field"><label class="so-sr" for="whPerson">One person or need</label><textarea id="whPerson" data-field="person" maxlength="500" placeholder="' + tx('s4ph', 'A coworker who’s struggling, a single mom next door, the youth group…') + '">' + esc(st.person) + '</textarea></div></div>' +
      '<div class="wh-step"><span class="wh-num">Step 5</span><h3 class="pt-h3">' + tx('s5h', 'Open your hands') + '</h3>' +
        '<p>' + tx('s5say', 'Pray it out loud:') + ' <span class="wh-says">“<span id="whDis">' + esc(prayerStart()) + '</span>' + (prayTail(true) ? ' ' + prayTail(true) : '') + '”</span></p>' +
        (A().commit ? '<p class="pt-small pt-muted">If you pray: “God, this is what’s in my hand. Use it.”</p>' : '') +
        '<label class="pt-small"><input type="checkbox" data-prayed' + (st.prayed ? ' checked' : '') + '> ' + tx('s5check', 'I prayed this') + '</label>' +
        '<div class="pt-field"><label for="whStep">One step I’ll take this week</label><textarea id="whStep" data-field="step" maxlength="1000" placeholder="' + tx('s5ph', 'For example: offer to help Mike move on Saturday…') + '">' + esc(st.step) + '</textarea></div></div>' +
      '<div class="pt-actions">' +
        '<button type="button" class="pt-btn pt-btn--ghost" data-a="toInv">← Back</button>' +
        '<button type="button" class="pt-btn pt-btn--ember" data-a="finish">See my reflection →</button>' +
      '</div>';
  }

  function results() {
    var f = filled(), ex = st.excuse != null ? excuses()[st.excuse] : null, dc = cat(st.dismissed);
    var html = '<div class="wh-output"><span class="pt-eyebrow">Your private reflection</span>' +
      '<h2 class="pt-h2">' + (we() ? 'What’s already in your house' : 'What’s already in your hand') + '</h2>' +
      '<p class="pt-muted">You came in thinking you might not have enough. Look at the list.</p>';
    html += f.length ? f.map(function (c) {
      return '<div class="wh-result' + (c.id === st.dismissed ? ' is-top' : '') + '"><h3>' + esc(nameFor(c)) + '<span>' + esc(refLabel(c)) + '</span></h3><p>' + esc(st.inv[c.id].trim()) + '</p>' +
        (c.id === st.dismissed ? '<p class="pt-small"><strong>You called this “not enough.”</strong> ' + tx('startHere', 'God usually starts right here.') + '</p>' : '') + '</div>';
    }).join('') : '<div class="pt-callout"><p>You didn’t list anything yet. Go back and write even one small thing. God starts with what you have.</p></div>';

    if (ex) html += '<div class="wh-card"><strong>The excuse: “' + esc(ex.says) + '”</strong><p>' + esc(ex.answer) + ' (' + refLink(ex.ref) + ')</p></div>';
    html += '<h3 class="pt-h3 wh-gap">Your next step</h3><div class="wh-card">' +
      '<p><strong>Holding back:</strong> ' + (esc(st.holding.trim()) || '<em>Not written yet</em>') + '</p>' +
      '<p><strong>In front of me:</strong> ' + (esc(st.person.trim()) || '<em>Not written yet</em>') + '</p>' +
      '<p><strong>' + (A().commit ? 'My commitment' : we() ? 'Our prayer' : 'My prayer') + ':</strong> “' + esc(prayerStart()) + (prayTail(false) ? ' ' + prayTail(false) : '') + '”' + (st.prayed ? ' ✓' : '') + '</p>' +
      '<p><strong>One step this week:</strong> ' + (esc(st.step.trim()) || '<em>Not written yet</em>') + '</p></div>';
    html += '<div class="wh-gem">What you keep shrinks. What you pour out multiplies.</div>';
    html += '<h3 class="pt-h3 wh-gap">A seven-day path</h3>' +
      '<p class="pt-muted pt-small">' + tx('daysIntro', 'One day at a time. Read the passage, pray honestly and take the step. Check off a day when it’s done.') + '</p>' +
      '<ol class="pt-days wh-days">' + days().map(function (d, i) {
        return '<li><label><input type="checkbox" data-day="' + i + '"' + (st.done[i] ? ' checked' : '') + '><span class="pt-day-num">Day ' + (i + 1) + '</span>' +
          '<span class="pt-day-text"><strong>' + refLink(d[0]) + '</strong><br>' + esc(d[1]) + '</span></label></li>';
      }).join('') + '</ol>' +
      '<p class="pt-progress" id="whDaysDone" aria-live="polite">' + Object.keys(st.done).length + ' of 7 days done</p>';
    if (A().principle) html += '<div class="wh-prayer"><span class="pt-label">The principle underneath</span><p>' + esc(A().principle) + '</p></div>';
    else html += '<div class="wh-prayer"><span class="pt-label">A prayer</span><p>Father, I’ve spent so much time looking at what I don’t have. Open my eyes to what You’ve already put in my hands. Forgive me for burying what You gave me out of fear. Here is my staff, my story, my scars and my yes. They don’t look like much to me, but they’re Yours. Multiply what I give, and lead me to the people You want me to serve. Amen.</p></div>';
    if (A().help) html += '<div class="wh-help"><p>' + esc(A().help) + '</p></div>';
    html += '<div class="pt-actions pt-no-print">' +
        '<button type="button" class="pt-btn" data-a="copy">Copy my reflection</button>' +
        '<button type="button" class="pt-btn pt-btn--ghost" data-a="print">Print / save as PDF</button>' +
      '</div><p class="pt-feedback pt-no-print" id="whFb" aria-live="polite"></p>' +
      '<div class="pt-callout pt-no-print"><p><strong>Keep going:</strong> ' + tx('keepGoing', 'see how God has gifted you to serve with the <a href="/assessment.html">Spiritual Gifts Assessment</a>, read <a href="/questions/what-is-my-purpose-as-a-man/">What is my purpose as a man?</a>, or <a href="/get-known.html">get known</a> and join a group of men who’ll walk it out with you.') + '</p></div>' +
      '<div class="pt-actions pt-no-print">' +
        '<button type="button" class="pt-btn pt-btn--ghost" data-a="toInv">Edit my answers</button>' +
        '<button type="button" class="pt-btn pt-btn--ghost" data-a="clear">Clear my answers</button>' +
      '</div><p class="pt-muted pt-small pt-no-print">Your answers stay in this browser tab only. Closing the tab or pressing “Clear my answers” erases them.</p></div>';
    return html;
  }

  function summaryText() {
    var f = filled(), ex = st.excuse != null ? excuses()[st.excuse] : null;
    var lines = [tx('summaryTitle', 'WHAT’S IN YOUR HAND?') + ' · ' + (we() ? 'OUR' : 'MY') + ' PRIVATE REFLECTION' + (st.aud && !FIXED ? ' · ' + A().label.toUpperCase() : ''), 'TheWrkShop · ' + (A().url || ('thewrkshop.com/tools/whats-in-your-hand/' + (st.aud ? '#' + st.aud : ''))), ''];
    f.forEach(function (c) { lines.push(nameFor(c).toUpperCase() + (c.id === st.dismissed ? ' (the one I called “not enough”)' : '') + ': ' + st.inv[c.id].trim()); });
    if (ex) lines.push('', 'My excuse: “' + ex.says + '”', 'God’s answer (' + ex.ref + '): ' + ex.answer);
    lines.push('', 'Holding back: ' + (st.holding.trim() || '(not written)'), 'In front of me: ' + (st.person.trim() || '(not written)'),
      (A().commit ? 'Commitment: ' : 'Prayer: ') + prayerStart() + (prayTail(false) ? ' ' + prayTail(false) : ''),
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
    } else if (act === 'aud') {
      st.aud = v || ''; st.excuse = null;
      try { history.replaceState(null, '', st.aud ? '#' + st.aud : location.pathname); } catch (e2) {}
      render(false);
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
      var ex = st.excuse != null ? excuses()[st.excuse] : null;
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

  window.addEventListener('hashchange', function () {
    var h = (location.hash || '').replace('#', '');
    if (!FIXED && AUD[h] && AUD_KEYS.indexOf(h) > -1 && h !== st.aud) { st.aud = h; st.excuse = null; render(false); }
  });

  render(false);
})();
