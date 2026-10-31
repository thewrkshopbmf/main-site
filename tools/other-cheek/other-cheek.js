/* The Other Cheek: what Jesus actually meant, and what He didn't (Matthew 5:38–48).
   Part 1: Myth or meaning? Eight statements; tap Myth or True and see the explanation.
   Part 2: What did Jesus do? Five real encounters; guess His response (speak, silence, leave, stop the sword, endure).
   Part 3: Untangle it. Safety first, then six things we collapse into one (non-retaliation, enemy-love,
           forgiveness, repentance, reconciliation, trust) applied to one situation.
   Part 4: Justice or vengeance? Five honest questions.
   Results: what's yours to do, five questions before responding, seven days, prayer.
   Everything stays in this browser tab (sessionStorage). GA receives start/finish counts only. */
(function () {
  'use strict';
  var KEY = 'tws.othercheek.v1';
  var app = document.getElementById('ocApp');
  if (!app) return;

  /* ---------- content ---------- */
  // [statement, answer: 0 myth / 1 true, explanation, ref]
  var MYTHS = [
    ['“Turn the other cheek” means you have to let anyone mistreat you.', 0, 'Jesus is calling His followers not to repay wrong with wrong. He isn’t giving anyone permission to demand unlimited access to your body, money, labor or peace. When an abuser says, “If you were really a Christian, you’d turn the other cheek,” he has turned a command for disciples into a tool of control. That’s a distortion.', 'Matthew 5:38–39'],
    ['When Jesus was struck during His trial, He pushed back with words.', 1, 'An officer slapped Him, and Jesus said, “If I said something wrong, testify as to what is wrong. But if I spoke the truth, why did you strike me?” He named the injustice. He didn’t hit back. Refusing to retaliate isn’t the same as being unable to respond.', 'John 18:22–23'],
    ['In Jesus’ day, a slap to the face was mostly about humiliation, not injury.', 1, 'A slap communicated contempt and social degradation, and that’s well supported. Matthew says the right cheek, which may suggest a backhanded insult, though that detail is debated. The point stands either way: Jesus is talking about being dishonored, and who gets to govern your response.', 'Matthew 5:39'],
    ['“An eye for an eye” was God giving people permission to take revenge.', 0, 'It was part of Israel’s legal system for judges and courts, and it actually restrained punishment so it couldn’t go beyond the offense. Jesus tells His followers not to make “pay them back” the rule for their personal response.', 'Exodus 21:23–25'],
    ['If I forgive someone, I have to trust him again.', 0, 'Forgiveness releases your claim to make him pay. Trust is rebuilt by trustworthy behavior over time. Reconciliation takes both people. You can forgive a man and still not hand him your keys.', 'Luke 17:3–4'],
    ['I can refuse revenge and still report a crime, set a boundary or protect someone.', 1, 'Non-retaliation is not abandoning moral responsibility. Scripture calls us to defend the weak. The command not to become an avenger doesn’t cancel the responsibility to be a protector.', 'Psalm 82:3–4'],
    ['Turning the other cheek just means don’t hit back.', 0, 'It’s more than holding back. Jesus gives four pictures (the other cheek, the cloak, the second mile, giving to the one who asks) and then says, “Love your enemies and pray for those who persecute you.” It’s a whole different way of living, not just a restraint.', 'Matthew 5:40–44'],
    ['“Vengeance is mine,” says God, so justice doesn’t really matter.', 0, 'Justice matters deeply to God. That’s exactly why He doesn’t hand the job of payback to wounded individuals. Romans 12 tells us to leave room for God’s wrath; Romans 13 describes authorities who bear the sword. Handing vengeance to God isn’t pretending wrong didn’t happen. It’s trusting the One who judges justly.', 'Romans 12:17–19']
  ];
  var MOVES = ['He spoke up', 'He stayed silent', 'He walked away', 'He stopped His friend’s sword', 'He let it happen'];
  // [situation, correct move index, what happened, ref]
  var ENC = [
    ['An officer slaps Jesus in the face during His questioning.', 0, '“If I said something wrong, testify as to what is wrong. But if I spoke the truth, why did you strike me?” Truth, without striking back.', 'John 18:22–23'],
    ['False witnesses line up and lie about Jesus in court.', 1, '“But Jesus remained silent.” He answered only when asked directly who He is. His silence was selective, not absolute.', 'Matthew 26:59–64'],
    ['A hometown crowd drags Jesus to a cliff to throw Him off.', 2, '“He walked right through the crowd and went on his way.” He didn’t stay to receive their violence.', 'Luke 4:28–30'],
    ['Soldiers come to arrest Jesus, and Peter draws a sword and cuts off a man’s ear.', 3, '“Put your sword back in its place.” He refused rescue by violence, and healed the man.', 'Matthew 26:51–54; Luke 22:51'],
    ['Soldiers mock Jesus, beat Him and nail Him to a cross.', 4, '“When they hurled their insults at him, he did not retaliate… he entrusted himself to him who judges justly.” He chose to suffer, for us.', '1 Peter 2:21–24']
  ];
  var SIX = [
    { name: 'Non-retaliation', q: 'Have I refused to pay him back?', opts: ['Yes', 'Working on it', 'Not yet'], whose: 'yours', note: 'Refusing to repay wrong with wrong. You can do this whether or not he ever changes.' },
    { name: 'Enemy-love', q: 'Can I want his genuine good, even from a distance?', opts: ['Yes', 'Working on it', 'Not yet'], whose: 'yours', note: 'Seeking his real good, which may include accountability. Love isn’t the same as access.' },
    { name: 'Forgiveness', q: 'Have I released my claim to make him pay?', opts: ['Yes', 'Working on it', 'Not yet'], whose: 'yours', note: 'Releasing personal vengeance to God. It doesn’t say the wrong was small, and it often takes time.' },
    { name: 'Repentance', q: 'Has he owned it and turned from it?', opts: ['Yes', 'No', 'I don’t know'], whose: 'his', note: 'His turning from the wrong toward truth and changed behavior. You can’t do this for him.' },
    { name: 'Reconciliation', q: 'Is the relationship being repaired?', opts: ['Yes', 'No', 'Not possible right now'], whose: 'both', note: 'Repairing the relationship. It ordinarily takes both people, and sometimes it isn’t possible yet (Romans 12:18).' },
    { name: 'Trust', q: 'Has trust been rebuilt?', opts: ['Yes', 'Some', 'No'], whose: 'time', note: 'Confidence earned by trustworthy behavior over time. It’s rebuilt, not owed.' }
  ];
  var AUDIT = [
    ['Am I mainly trying to stop harm and establish the truth?', 'A good starting point. Keep checking your means and motives.', 'Get clear on what the wrong was, who’s at risk and what outcome you really want.'],
    ['Would I still want accountability if I never got to see him suffer?', 'Accountability may matter more to you than personal satisfaction.', 'Ask whether watching him suffer has become part of what you need.'],
    ['Am I willing to use truthful, fair and lawful means, even if they feel less satisfying?', 'That willingness points toward justice.', 'A desire for a more satisfying punishment may be bending your judgment.'],
    ['Can I accept that he may face consequences without me being the one to deliver them?', 'That can reflect real release of personal vengeance.', 'You may be taking on authority that belongs to proper authorities, and ultimately to God.'],
    ['Can I want him to genuinely repent and still support the consequences?', 'Mercy and accountability can live together.', 'Ask whether you’ve come to need his destruction rather than his accountability.']
  ];
  var FIVE = [
    ['Is someone in danger right now?', 'Protection comes first. Get safe and get help.'],
    ['What is actually true?', 'Separate what happened from what you assume it means about your worth.'],
    ['What is driving my desire to respond?', 'Protection, truth, accountability, or payback? It can be more than one.'],
    ['What response is faithful and fair?', 'Speak up, stay silent, walk away, get help or pursue proper accountability.'],
    ['Can I let go of revenge and still pursue what’s right?', 'Refusing revenge doesn’t mean giving up truth, justice, boundaries or protecting others.']
  ];
  var DAYS = [
    ['Matthew 5:38–48', 'Read the whole passage, not just one verse. What does Jesus say right after “turn the other cheek”?'],
    ['John 18:19–23', 'Jesus spoke truth without striking back. Where do you need to do the same?'],
    ['1 Samuel 24:1–12', 'David had Saul within reach and wouldn’t lift his hand. What would that look like for you?'],
    ['Luke 9:51–56', 'James and John wanted to call down fire. Notice your “call down fire” moments today.'],
    ['Romans 12:17–21', 'If it’s safe, do one good thing for someone who wronged you. If it isn’t safe, pray for him.'],
    ['Luke 17:3–4', 'Write two lists: what’s yours to do, and what’s his. Give his list to God.'],
    ['1 Peter 2:21–23', 'Pray: “I entrust this to You, who judges justly.” Say it as often as you need to.']
  ];

  /* ---------- helpers ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function track(name) { try { if (window.gtag) window.gtag('event', name); } catch (e) {} }
  function bible(ref) { return 'https://www.biblegateway.com/passage/?search=' + encodeURIComponent(ref.replace(/–/g, '-')) + '&version=NIV'; }
  function refLink(ref) { return '<a href="' + bible(ref) + '" target="_blank" rel="noopener">' + esc(ref) + '</a>'; }
  function verse(v) { return '<blockquote class="oc-verse"><p>“' + esc(v[1]) + '”</p><cite>' + esc(v[0]) + ' (NIV)</cite></blockquote>'; }
  function fresh() { return { stage: 'intro', my: {}, en: {}, ei: 0, danger: null, six: {}, au: {}, done: {}, finished: false }; }
  var st;
  try { st = JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch (e) { st = null; }
  if (!st || typeof st !== 'object') st = fresh();
  var F = fresh(); Object.keys(F).forEach(function (k) { if (st[k] == null && F[k] != null) st[k] = F[k]; });
  function save() { try { sessionStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  function clearAll() { try { sessionStorage.removeItem(KEY); } catch (e) {} st = fresh(); }
  function count(o) { return Object.keys(o).length; }
  function myRight() { var n = 0; Object.keys(st.my).forEach(function (k) { if (st.my[k] === MYTHS[+k][1]) n++; }); return n; }
  function enRight() { var n = 0; Object.keys(st.en).forEach(function (k) { if (st.en[k] === ENC[+k][1]) n++; }); return n; }

  var SAFETY = '<div class="oc-safety"><strong>Your safety comes first.</strong> Turning the other cheek never means staying where you or your children are in danger. Get somewhere safe and get help: call 911, or the National Domestic Violence Hotline at 1-800-799-7233 (text START to 88788). Jesus walked away from a crowd that wanted to hurt Him (Luke 4:30).</div>';

  /* ---------- screens ---------- */
  function progress(part, label) {
    return '<div class="pt-tool-top"><span class="pt-count">Part ' + part + ' of 4 · ' + label + '</span></div>' +
      '<div class="oc-steps" aria-hidden="true">' + [1, 2, 3, 4].map(function (n) { return '<span class="' + (n < part ? 'is-done' : n === part ? 'is-here' : '') + '"></span>'; }).join('') + '</div>';
  }

  function intro() {
    var resume = count(st.my) > 0;
    return '<span class="pt-label">Taken out of context for too long</span>' +
      verse(['Matthew 5:38–39', 'You have heard that it was said, ‘Eye for eye, and tooth for tooth.’ But I tell you, do not resist an evil person. If anyone slaps you on the right cheek, turn to them the other cheek also.']) +
      '<p>Few words of Jesus get misused more. Some men hear them as “be a doormat.” Others dismiss them as unrealistic. Some have had them used against them: “If you were really a Christian, you’d just take it.”</p>' +
      '<p>Jesus meant something more radical, and more freeing, than any of those. <strong>The other person may start the offense, but he doesn’t have to become the author of your response.</strong></p>' +
      '<p>About 10 minutes, in four parts:</p>' +
      '<ol class="oc-parts"><li><strong>Myth or meaning?</strong> Eight things people say about this verse.</li><li><strong>What did Jesus do?</strong> Five times He was wronged. Guess how He responded.</li><li><strong>Untangle it.</strong> Forgiveness, trust and reconciliation aren’t the same thing.</li><li><strong>Justice or vengeance?</strong> Five honest questions.</li></ol>' +
      '<p class="pt-small pt-muted">Your answers stay on your screen.</p>' +
      '<div class="pt-actions"><button type="button" class="pt-btn pt-btn--ember" data-a="begin">' + (resume ? 'Pick up where I left off' : 'Start') + '</button>' +
      (resume ? '<button type="button" class="pt-btn pt-btn--ghost" data-a="results">See my results</button>' : '') + '</div>';
  }

  function myths() {
    return progress(1, 'Myth or meaning?') +
      '<h2 class="pt-h3" tabindex="-1">Myth, or what Jesus meant?</h2>' +
      '<div class="pt-tool-top"><span class="pt-count">' + count(st.my) + ' of ' + MYTHS.length + ' answered</span><span class="pt-count">' + myRight() + ' right</span></div>' +
      MYTHS.map(function (m, i) {
        var v = st.my[i], done = v != null, ok = done && v === m[1];
        return '<div class="oc-myth' + (done ? (ok ? ' is-ok' : ' is-miss') : '') + '"><p class="oc-stmt">' + esc(m[0]) + '</p>' +
          '<div class="oc-mt" role="group" aria-label="Myth or true?"><button type="button" data-a="myth" data-i="' + i + '" data-v="0" aria-pressed="' + (v === 0) + '">Myth</button><button type="button" data-a="myth" data-i="' + i + '" data-v="1" aria-pressed="' + (v === 1) + '">True</button></div>' +
          (done ? '<div class="oc-ans"><strong>' + (ok ? 'Right. ' : 'Not quite. ') + (m[1] ? 'True.' : 'Myth.') + '</strong> ' + esc(m[2]) + ' <span class="oc-ref">' + refLink(m[3]) + '</span></div>' : '') + '</div>';
      }).join('') +
      '<div class="pt-actions"><button type="button" class="pt-btn pt-btn--ghost" data-a="home">← Start</button><button type="button" class="pt-btn" data-a="toEnc">Next: what did Jesus do? →</button></div>';
  }

  function enc() {
    var i = st.ei, E = ENC[i], v = st.en[i];
    return progress(2, 'What did Jesus do?') +
      '<div class="pt-tool-top"><span class="pt-count">Encounter ' + (i + 1) + ' of ' + ENC.length + '</span><span class="pt-count">' + enRight() + ' right</span></div>' +
      '<div class="oc-scene"><span class="oc-tag">The situation</span><p tabindex="-1">' + esc(E[0]) + '</p></div>' +
      '<fieldset class="pt-fieldset"><legend class="pt-legend oc-legend">How did Jesus respond?</legend>' +
      MOVES.map(function (m, k) {
        var cls = v == null ? '' : k === E[1] ? ' is-ok' : k === v ? ' is-miss' : '';
        return '<button type="button" class="pt-option' + cls + '" data-a="move" data-v="' + k + '" aria-pressed="' + (v === k) + '"' + (v != null ? ' disabled' : '') + '>' + esc(m) + '</button>';
      }).join('') + '</fieldset>' +
      (v != null ? '<div class="oc-ans"><strong>' + (v === E[1] ? 'Right.' : 'He ' + esc(MOVES[E[1]].slice(3).toLowerCase()) + '.') + '</strong> ' + esc(E[2]) + ' <span class="oc-ref">' + refLink(E[3]) + '</span></div>' : '') +
      (v != null && i === ENC.length - 1 ? '<div class="oc-lesson"><p><strong>Five encounters, five different responses.</strong> Speaking can be faithful. Silence can be faithful. Leaving can be faithful. Willingly suffering can be faithful. What never changed: He never repaid evil with evil, and He always entrusted Himself to the Father.</p></div>' : '') +
      '<div class="pt-actions"><button type="button" class="pt-btn pt-btn--ghost" data-a="encBack">← Back</button>' +
      (v != null ? '<button type="button" class="pt-btn" data-a="encNext">' + (i === ENC.length - 1 ? 'Next: untangle it →' : 'Next encounter →') + '</button>' : '') + '</div>';
  }

  function untangle() {
    var h = progress(3, 'Untangle it') +
      '<h2 class="pt-h3" tabindex="-1">Six things we collapse into one</h2>' +
      '<p>Think of one person who wronged you. You don’t need to name him. First:</p>' +
      '<div class="oc-q"><p><strong>Is anyone in danger from this person right now?</strong></p><div class="oc-chips">' +
        ['Yes', 'No', 'I’m not sure'].map(function (o, k) { return '<button type="button" data-a="danger" data-v="' + k + '" aria-pressed="' + (st.danger === k) + '">' + o + '</button>'; }).join('') + '</div></div>' +
      (st.danger === 0 || st.danger === 2 ? SAFETY : '');
    if (st.danger != null) {
      h += '<p>Now tap where things stand for each one. Notice whose job each one is.</p>' +
        SIX.map(function (s, i) {
          var v = st.six[i];
          return '<div class="oc-six oc-' + s.whose + '"><div class="oc-six-head"><strong>' + esc(s.name) + '</strong><span class="oc-whose">' + (s.whose === 'yours' ? 'Your part' : s.whose === 'his' ? 'His part' : s.whose === 'both' ? 'Takes both of you' : 'Earned over time') + '</span></div>' +
            '<p class="pt-small">' + esc(s.q) + '</p><div class="oc-chips">' + s.opts.map(function (o, k) { return '<button type="button" data-a="six" data-i="' + i + '" data-v="' + k + '" aria-pressed="' + (v === k) + '">' + esc(o) + '</button>'; }).join('') + '</div>' +
            '<p class="oc-note">' + esc(s.note) + '</p></div>';
        }).join('') +
        '<p class="oc-big">Forgiveness deals with the debt. Trust deals with his reliability. Reconciliation deals with the relationship. Connected, but not the same.</p>';
    }
    h += '<div class="pt-actions"><button type="button" class="pt-btn pt-btn--ghost" data-a="toEncLast">← Back</button><button type="button" class="pt-btn" data-a="toAudit">Next: justice or vengeance? →</button></div>';
    return h;
  }

  function audit() {
    return progress(4, 'Justice or vengeance?') +
      '<h2 class="pt-h3" tabindex="-1">Justice and vengeance can start with the same wound</h2>' +
      '<p>Wanting things made right isn’t sin. But somewhere, the desire for justice can quietly become a need for revenge. Answer for where you honestly are, not where you think you should be.</p>' +
      AUDIT.map(function (a, i) {
        var v = st.au[i];
        return '<div class="oc-q"><p><strong>' + (i + 1) + '. ' + esc(a[0]) + '</strong></p><div class="oc-chips">' +
          ['Yes', 'Not sure', 'No'].map(function (o, k) { return '<button type="button" data-a="au" data-i="' + i + '" data-v="' + k + '" aria-pressed="' + (v === k) + '">' + o + '</button>'; }).join('') + '</div>' +
          (v != null ? '<p class="oc-note">' + esc(v === 0 ? a[1] : v === 2 ? a[2] : 'Uncertainty is worth exploring. Write down what you hope will happen, and why.') + '</p>' : '') + '</div>';
      }).join('') +
      verse(['Romans 12:19', 'Do not take revenge, my dear friends, but leave room for God’s wrath, for it is written: “It is mine to avenge; I will repay,” says the Lord.']) +
      '<div class="pt-actions"><button type="button" class="pt-btn pt-btn--ghost" data-a="toUntangle">← Back</button><button type="button" class="pt-btn pt-btn--ember" data-a="results">See my results →</button></div>';
  }

  function results() {
    var h = '<span class="pt-label">What you found</span><h2 class="pt-h3" tabindex="-1">You don’t have to be the author of your response to evil. Jesus can be.</h2>';
    h += '<div class="oc-score"><div><b>' + myRight() + '<small>/' + MYTHS.length + '</small></b><span>Myths sorted</span></div><div><b>' + enRight() + '<small>/' + ENC.length + '</small></b><span>Encounters</span></div></div>';
    if (st.danger === 0 || st.danger === 2) h += SAFETY;

    var answered = Object.keys(st.six).length;
    if (answered) {
      var yours = [], notyours = [];
      SIX.forEach(function (s, i) {
        var v = st.six[i]; if (v == null) return;
        var line = '<li><strong>' + esc(s.name) + ':</strong> ' + esc(s.opts[v].toLowerCase()) + '</li>';
        if (s.whose === 'yours') yours.push(line); else notyours.push(line);
      });
      var rep = st.six[3], trust = st.six[5];
      h += '<h3 class="pt-h3 oc-gap">What’s yours, and what isn’t</h3><div class="oc-two"><div class="oc-col"><span class="pt-label">Yours to do, with God’s help</span><ul>' + (yours.join('') || '<li>Not answered</li>') + '</ul></div>' +
        '<div class="oc-col"><span class="pt-label">Not yours to force</span><ul>' + (notyours.join('') || '<li>Not answered</li>') + '</ul></div></div>' +
        '<p>' + (rep === 1 || rep === 2 ? 'He hasn’t clearly turned. That means you’re not required to pretend the relationship is fine or to trust him again. You can still refuse revenge, release the debt to God and keep wise boundaries.' : rep === 0 ? 'He has owned it. That opens the door to reconciliation, but trust is still rebuilt one faithful step at a time.' : 'Whatever he does, what’s yours is still yours: refuse revenge, want his good and release the debt to God.') + '</p>' +
        (trust === 2 ? '<p class="pt-small">Not trusting him yet isn’t unforgiveness. It’s wisdom. Trust is earned, not owed.</p>' : '');
    } else h += '<p class="pt-muted oc-gap">You skipped Untangle it. <button type="button" class="oc-link" data-a="toUntangle">Go back to it</button>.</p>';

    var auN = count(st.au);
    if (auN) {
      var yes = 0; Object.keys(st.au).forEach(function (k) { if (st.au[k] === 0) yes++; });
      h += '<h3 class="pt-h3 oc-gap">Justice or vengeance?</h3><p>You answered yes to ' + yes + ' of ' + auN + '. This isn’t a score or a verdict on your heart. ' +
        (yes >= 4 ? 'Your desire looks mostly like justice. Keep checking it.' : 'Some of what you want may be leaning toward payback. Bring those answers to God and to a man you trust.') + '</p>' +
        '<ul class="oc-aulist">' + AUDIT.map(function (a, i) { var v = st.au[i]; return v == null ? '' : '<li><span class="oc-dot oc-d' + v + '"></span>' + esc(a[0]) + '</li>'; }).join('') + '</ul>';
    }

    h += '<div class="oc-card"><span class="pt-label">Five questions before you respond</span><ol>' + FIVE.map(function (f) { return '<li><strong>' + esc(f[0]) + '</strong> ' + esc(f[1]) + '</li>'; }).join('') + '</ol><p class="pt-small">Print this, or take a photo of it for your phone.</p></div>';

    h += verse(['1 Peter 2:23', 'When they hurled their insults at him, he did not retaliate; when he suffered, he made no threats. Instead, he entrusted himself to him who judges justly.']);

    h += '<h3 class="pt-h3 oc-gap">Seven days</h3><p class="pt-muted pt-small">One a day. Check it off when it’s done.</p>' +
      '<ol class="pt-days oc-days">' + DAYS.map(function (d, i) {
        return '<li><label><input type="checkbox" data-day="' + i + '"' + (st.done[i] ? ' checked' : '') + '><span class="pt-day-num">Day ' + (i + 1) + '</span><span class="pt-day-text"><strong>' + refLink(d[0]) + '</strong><br>' + esc(d[1]) + '</span></label></li>';
      }).join('') + '</ol><p class="pt-progress" id="ocDaysDone" aria-live="polite">' + count(st.done) + ' of 7 days done</p>';

    h += '<div class="oc-gem">The command not to become an avenger doesn’t cancel the responsibility to become a protector.</div>';
    h += '<div class="oc-prayer"><span class="pt-label">A prayer</span><p>Jesus, You were struck, lied about and crucified, and You never repaid evil with evil. I’ve been wronged, and part of me wants to make him pay. I give You the debt. Keep me from becoming like the one who hurt me. Give me courage to speak truth, wisdom to set boundaries and strength to protect the people You’ve given me. I entrust this to You, who judges justly. Amen.</p></div>';

    h += '<div class="pt-actions pt-no-print"><button type="button" class="pt-btn" data-a="copy">Copy my results</button><button type="button" class="pt-btn pt-btn--ghost" data-a="print">Print / save as PDF</button></div>' +
      '<p class="pt-feedback pt-no-print" id="ocFb" aria-live="polite"></p>' +
      '<div class="pt-actions pt-no-print"><button type="button" class="pt-btn pt-btn--ghost" data-a="restart">Start over</button><button type="button" class="pt-btn pt-btn--ghost" data-a="clear">Clear my answers</button></div>' +
      '<p class="pt-muted pt-small pt-no-print">Your answers stay in this browser tab only. Closing the tab or pressing “Clear my answers” erases them.</p>';
    return h;
  }

  function summaryText() {
    var L = ['THE OTHER CHEEK · What I found', 'thewrkshop.com/tools/other-cheek/', '', 'Myths sorted: ' + myRight() + ' of ' + MYTHS.length + ' · Encounters: ' + enRight() + ' of ' + ENC.length, ''];
    if (count(st.six)) { L.push('Untangle it:'); SIX.forEach(function (s, i) { var v = st.six[i]; if (v != null) L.push('- ' + s.name + ' (' + (s.whose === 'yours' ? 'mine' : s.whose === 'his' ? 'his' : s.whose === 'both' ? 'both' : 'over time') + '): ' + s.opts[v]); }); L.push(''); }
    if (count(st.au)) { L.push('Justice or vengeance?'); AUDIT.forEach(function (a, i) { var v = st.au[i]; if (v != null) L.push('- ' + a[0] + ' ' + ['Yes', 'Not sure', 'No'][v]); }); L.push(''); }
    L.push('Five questions before I respond:'); FIVE.forEach(function (f, i) { L.push((i + 1) + '. ' + f[0] + ' ' + f[1]); });
    L.push('', 'Seven days:'); DAYS.forEach(function (d, i) { L.push('Day ' + (i + 1) + ' (' + d[0] + '): ' + d[1]); });
    L.push('', 'He may start the offense. He doesn’t have to author my response.', '© 2026 TheWrkShop · thewrkshop.com');
    return L.join('\n');
  }
  function feedback(m) { var fb = document.getElementById('ocFb'); if (fb) fb.textContent = m; }
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
    app.innerHTML = s === 'myths' ? myths() : s === 'enc' ? enc() : s === 'untangle' ? untangle() : s === 'audit' ? audit() : s === 'results' ? results() : intro();
    document.body.classList.toggle('oc-has-results', s === 'results');
    if (focus) {
      var top = app.getBoundingClientRect().top + window.pageYOffset - 80;
      if (Math.abs(window.pageYOffset - top) > 40) window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      var h = app.querySelector('[tabindex="-1"]'); if (h) h.focus({ preventScroll: true });
    }
  }
  function go(stage) {
    st.stage = stage;
    if (stage === 'results' && !st.finished) { st.finished = true; track('othercheek_finish'); }
    save(); render(true);
  }
  function keepScroll(fn) { var y = window.pageYOffset; fn(); window.scrollTo(0, y); }

  app.addEventListener('click', function (e) {
    var b = e.target.closest('[data-a]'); if (!b || b.disabled) return;
    var a = b.getAttribute('data-a'), v = +b.getAttribute('data-v'), i = +b.getAttribute('data-i');
    if (a === 'begin') { if (!count(st.my)) track('othercheek_start'); go(count(st.my) < MYTHS.length ? 'myths' : count(st.en) < ENC.length ? 'enc' : 'untangle'); }
    else if (a === 'home') go('intro');
    else if (a === 'myth') { st.my[i] = v; save(); keepScroll(render); }
    else if (a === 'toEnc') { var f = 0; while (f < ENC.length - 1 && st.en[f] != null) f++; st.ei = f; go('enc'); }
    else if (a === 'move') { st.en[st.ei] = v; save(); render(); }
    else if (a === 'encNext') { if (st.ei < ENC.length - 1) { st.ei++; go('enc'); } else go('untangle'); }
    else if (a === 'encBack') { if (st.ei > 0) { st.ei--; go('enc'); } else go('myths'); }
    else if (a === 'toEncLast') { st.ei = ENC.length - 1; go('enc'); }
    else if (a === 'danger') { st.danger = v; save(); keepScroll(render); }
    else if (a === 'six') { st.six[i] = v; save(); keepScroll(render); }
    else if (a === 'toUntangle') go('untangle');
    else if (a === 'toAudit') go('audit');
    else if (a === 'au') { st.au[i] = v; save(); keepScroll(render); }
    else if (a === 'results') go('results');
    else if (a === 'copy') copyText(summaryText());
    else if (a === 'print') window.print();
    else if (a === 'restart') { clearAll(); save(); render(true); }
    else if (a === 'clear') { if (window.confirm('Erase your answers?')) { clearAll(); render(true); } }
  });
  app.addEventListener('change', function (e) {
    var d = e.target.getAttribute('data-day'); if (d == null) return;
    if (e.target.checked) st.done[d] = true; else delete st.done[d];
    save(); var p = document.getElementById('ocDaysDone'); if (p) p.textContent = count(st.done) + ' of 7 days done';
  });

  render(false);
})();

/* Share row: Share / Copy link / Print for this page only. */
(function () {
  'use strict';
  document.querySelectorAll('.oc-share').forEach(function (bar) {
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
