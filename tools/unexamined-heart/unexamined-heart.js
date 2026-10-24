/* The Unexamined Heart (2 Kings 5).
   The Mirror (18 frequency statements across six areas) -> reflection map -> The Naaman Moment (4 scenarios)
   -> Agreement Finder + Gehazi integrity check -> The Prayer Room -> The Return Path (seven-day path).
   Everything a person enters stays in this browser tab (sessionStorage) and is never sent to a server.
   Google Analytics receives start/finish counts only, never answers. */
(function () {
  'use strict';
  var KEY = 'tws.unexaminedheart.v1';
  var app = document.getElementById('uhApp');
  if (!app) return;

  /* ---------- content ---------- */
  var CATS = [
    { name: 'Expectations & Control', verse: '2 Kings 5:10–12', question: 'Where have I made my preferred process a condition of obedience?',
      prayer: 'Lord, help me distinguish Your commands from the expectations I have added. Give me wisdom to surrender my preferred process without surrendering discernment.' },
    { name: 'Anger & Threatened Respect', verse: 'James 1:19–20', question: 'What did I interpret as disrespect, and what did I do with that interpretation?',
      prayer: 'Father, show me what my anger is protecting. Help me address real wrongs without giving myself permission to harm.' },
    { name: 'Defensiveness & Correction', verse: 'Proverbs 12:15; Hebrews 3:13', question: 'Whose truthful correction have I been reluctant to consider?',
      prayer: 'God, make me teachable. Help me test correction carefully, receive what is true, and reject what is false without pride.' },
    { name: 'Integrity & Concealment', verse: '2 Kings 5:20–27', question: 'Have I used a good explanation to protect a dishonest action?',
      prayer: 'Lord, give me courage to tell the truth, make appropriate repair, and refuse the temptation to hide what needs to be addressed.' },
    { name: 'Desire & Justification', verse: 'James 4:1–3', question: 'What do I want so badly that I am tempted to excuse wrong methods?',
      prayer: 'Father, teach me to bring my desires before You rather than letting them govern me. Shape what I love and how I pursue it.' },
    { name: 'Prayer & Responsive Obedience', verse: 'Psalm 139:23–24; 2 Kings 5:13–14', question: 'What concrete faithful response have I postponed?',
      prayer: 'Search me, God, and lead me. Give me grace not only to recognize truth but to respond with humble, specific obedience.' }
  ];
  var Q = [
    [0, 'When an outcome differs from what I pictured, I struggle to adapt.'],
    [0, 'I assume that my preferred approach is the best or only acceptable one.'],
    [0, 'I resist good counsel when it requires me to release control.'],
    [1, 'I interpret questions or disagreement as disrespect.'],
    [1, 'When upset, I say or do things that punish the other person.'],
    [1, 'I rehearse offenses rather than checking my interpretation.'],
    [2, 'I explain my intentions before listening fully to the concern.'],
    [2, 'I find it harder to accept correction from someone with less status.'],
    [2, 'I revisit criticism mainly to prove the other person wrong.'],
    [3, 'I hide relevant details when disclosure might cost me approval.'],
    [3, 'I have used a good cause to excuse a questionable method.'],
    [3, 'I avoid accountability for actions I would question in someone else.'],
    [4, 'An unmet desire makes it difficult for me to act graciously.'],
    [4, 'I treat a disappointing outcome as evidence someone has wronged me.'],
    [4, 'I excuse my reaction because the thing I wanted was important.'],
    [5, 'I delay prayer until I have exhausted my preferred solutions.'],
    [5, 'I recognize needed changes but postpone taking concrete steps.'],
    [5, 'I ask God to bless decisions I have already refused to reconsider.']
  ];
  var FREQ = ['Never', 'Rarely', 'Sometimes', 'Often'];
  var S = [
    { title: 'The unexpected instruction', text: 'You ask a trusted mentor for help. Instead of the dramatic breakthrough you expected, they recommend a simple, consistent practice.',
      choices: ['I dismiss the advice as too basic.', 'I ask questions and evaluate whether it is sound.', 'I agree publicly but avoid trying it.'],
      ref: '2 Kings 5:10–14', reveal: 'Naaman almost rejected a simple instruction because it contradicted his expectations. Simplicity does not automatically prove that advice is right; examine whether your objection is grounded in discernment or disappointed preference.' },
    { title: 'Correction from someone junior', text: 'A younger colleague or group member respectfully points out a mistake you made.',
      choices: ['I feel compelled to defend my experience.', 'I check the facts and acknowledge what is true.', 'I focus on whether their tone was respectful.'],
      ref: '2 Kings 5:13; Proverbs 12:15', reveal: 'Naaman benefited from servants who challenged his response. The status of a speaker does not settle whether their correction is true.' },
    { title: 'A good purpose, a questionable method', text: 'A ministry or community project needs funds. Exaggerating its impact would make support easier to obtain.',
      choices: ['I tell myself the cause justifies the exaggeration.', 'I report the facts and seek honest alternatives.', 'I leave out inconvenient information without lying directly.'],
      ref: '2 Kings 5:20–25; Ephesians 4:25', reveal: 'Gehazi invoked a seemingly legitimate need to obtain gifts through a false story. Good goals do not make dishonest means acceptable.' },
    { title: 'The difficult apology', text: 'Someone you love explains that your words hurt them, even though you intended to help.',
      choices: ['I emphasize my good intentions.', 'I listen, clarify, own any wrong, and seek repair.', 'I point out ways they have hurt me too.'],
      ref: 'James 1:19; Proverbs 18:13', reveal: 'An explanation can be true without being a justification. Listen for the specific behavior that needs examination.' }
  ];
  var HINGE = [
    ['event', 'What happened? State observable facts, not assumed motives.'],
    ['expected', 'What did I expect or want?'],
    ['story', 'What did I conclude it meant? What evidence supports or challenges that conclusion?'],
    ['threat', 'What desire, fear, reputation, or sense of control felt threatened?'],
    ['permission', 'What did I tell myself that made my response seem acceptable?'],
    ['response', 'What did I actually do, say, avoid, or conceal?'],
    ['alternative', 'What would a truthful, wise, and faithful response look like?']
  ];
  var GEHAZI = [
    'Have I used a respectable reason to disguise a self-serving decision?',
    'Is there information I am withholding specifically to prevent appropriate accountability?',
    'Would I regard my method as honest if another person used it against me?'
  ];
  var DAYS = [
    ['Read', '2 Kings 5', 'Read 2 Kings 5 without rushing. Note what the text states and what you are inferring.'],
    ['Notice', '', 'Record one disappointed expectation. Separate facts from interpretations.'],
    ['Listen', '', 'Invite safe, specific feedback from someone trustworthy. Do not defend yourself immediately.'],
    ['Confess', '1 John 1:8–9', 'Name a genuine wrong before God; make an appropriate apology or repair where needed.'],
    ['Replace', 'Ephesians 4:22–32', 'Identify one old response and practice a specific alternative from Ephesians 4:22–32.'],
    ['Pray', 'Psalm 139:23–24', 'Pray Psalm 139:23–24. Bring one unsurrendered desire to God honestly.'],
    ['Return', '', 'Review your actions. Celebrate grace, identify unfinished repair, and choose one continuing practice.']
  ];
  var STEPS = { q: 1, map: 2, bridge: 3, s: 3, finder: 4, prayer: 5, ret: 6 };
  var STEP_NAMES = ['', 'The Mirror', 'Your Reflection Map', 'The Naaman Moment', 'The Agreement Finder', 'The Prayer Room', 'The Return Path'];
  var NQ = Q.length, NS = S.length;

  /* ---------- helpers ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function track(name) { try { if (window.gtag) window.gtag('event', name); } catch (e) {} }
  function bible(ref) { return 'https://www.biblegateway.com/passage/?search=' + encodeURIComponent(ref.replace(/–/g, '-')) + '&version=KJV'; }
  function refLink(ref) { return ref.split('; ').map(function (r) { return '<a href="' + bible(r) + '" target="_blank" rel="noopener">' + esc(r) + '</a>'; }).join('; '); }
  function fresh() { return { stage: 'intro', q: 0, s: 0, answers: {}, picks: {}, hinge: {}, gehazi: {}, prayer: '', action: '', person: '', done: {} }; }
  var st;
  try { st = JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch (e) { st = null; }
  if (!st || typeof st !== 'object' || !st.answers) st = fresh();
  ['picks', 'hinge', 'gehazi', 'done'].forEach(function (k) { if (!st[k] || typeof st[k] !== 'object') st[k] = {}; });
  ['prayer', 'action', 'person'].forEach(function (k) { if (typeof st[k] !== 'string') st[k] = ''; });
  function save() { try { sessionStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  function count(o) { return Object.keys(o).length; }
  function focusTop() {
    var h = app.querySelector('h2, .pt-legend');
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    app.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function stepTop(extra) {
    var n = STEPS[st.stage];
    return '<div class="pt-tool-top"><span class="pt-count">Step ' + n + ' of 6 · ' + STEP_NAMES[n] + '</span>' + (extra ? '<span class="pt-count">' + extra + '</span>' : '') + '</div>';
  }
  function track6(pct) { return '<div class="pt-track" aria-hidden="true"><div style="width:' + pct + '%"></div></div>'; }
  function nav(backLabel, nextAct, nextLabel, disabled) {
    return '<div class="pt-actions pt-no-print">' +
      '<button type="button" class="pt-btn pt-btn--ghost" data-a="back">' + (backLabel || '← Back') + '</button>' +
      (nextAct ? '<button type="button" class="pt-btn pt-btn--ember" data-a="' + nextAct + '"' + (disabled ? ' disabled' : '') + '>' + nextLabel + '</button>' : '') +
    '</div>';
  }

  /* ---------- scoring ---------- */
  function scores() {
    return CATS.map(function (c, i) {
      var sum = 0;
      Q.forEach(function (q, qi) { var v = st.answers[qi]; if (q[0] === i && typeof v === 'number') sum += v; });
      return { i: i, sum: sum };
    });
  }
  function topCat() {
    var sc = scores().slice().sort(function (a, b) { return b.sum - a.sum || a.i - b.i; });
    return sc[0].sum > 0 ? sc[0].i : null;
  }

  /* ---------- views ---------- */
  function intro() {
    var resume = count(st.answers) > 0;
    return '<h2 class="pt-h2">This is not a test you pass.</h2>' +
      '<p>Naaman almost walked away from the help he needed. Gehazi pursued what he wanted and concealed what he did. Their stories invite us to examine our expectations, reactions, integrity, and willingness to be corrected.</p>' +
      '<div class="uh-two">' +
        '<div><h3>What this can do</h3><p>Help you notice possible patterns, explore relevant Scripture, form honest prayers, and identify concrete responses.</p></div>' +
        '<div><h3>What it cannot do</h3><p>Diagnose motives, measure holiness, determine salvation, identify abuse, or tell you what God privately thinks about you.</p></div>' +
      '</div>' +
      '<ul class="uh-facts"><li><strong>Six steps:</strong> The Mirror, your reflection map, the Naaman Moment, the Agreement Finder, the Prayer Room and the Return Path</li><li><strong>Time:</strong> about 20–35 minutes for the full journey; 8–12 minutes for the core reflection</li><li><strong>Our posture:</strong> serious about truth, careful with people, clear about grace, willing to respond</li></ul>' +
      '<p class="pt-muted pt-small">Read ' + refLink('2 Kings 5') + ' in full before or after. The interpretive questions here are prompts for examination, not claims that Scripture reveals every character’s hidden motive.</p>' +
      '<div class="pt-actions">' +
        '<button type="button" class="pt-btn pt-btn--ember" data-a="start">' + (resume ? 'Continue where I left off' : 'Begin the journey →') + '</button>' +
        (resume ? '<button type="button" class="pt-btn pt-btn--ghost" data-a="restart">Start over</button>' : '') +
      '</div>';
  }

  function question() {
    var q = Q[st.q], cur = st.answers[st.q];
    return stepTop('Statement ' + (st.q + 1) + ' of ' + NQ) + track6(Math.round(st.q / NQ * 100)) +
      '<span class="uh-tag">' + esc(CATS[q[0]].name) + '</span>' +
      '<p class="uh-prompt">Think about the last 30 days. How often does this describe your responses? There is no ideal score to achieve.</p>' +
      '<fieldset class="pt-fieldset"><legend class="pt-legend">' + esc(q[1]) + '</legend>' +
        FREQ.map(function (l, v) {
          return '<button type="button" class="pt-option" data-a="answer" data-v="' + v + '" aria-pressed="' + (cur === v) + '">' + esc(l) + '</button>';
        }).join('') +
      '</fieldset>' +
      nav();
  }

  function map() {
    var sc = scores(), top = topCat();
    var html = stepTop() + track6(100 * 2 / 6) +
      '<h2 class="pt-h2">Notice the pattern. Do not become the label.</h2>' +
      '<p class="pt-muted">These indicators reflect your own answers, not an objective measure of your heart. They are conversation starters, not spiritual diagnoses.</p>';
    html += sc.map(function (r) {
      var c = CATS[r.i];
      return '<div class="uh-result' + (r.i === top ? ' is-top' : '') + '">' +
        '<h3>' + esc(c.name) + '<span>' + r.sum + '/9 · self-reported frequency</span></h3>' +
        '<div class="pt-bar" role="img" aria-label="' + esc(c.name + ': ' + r.sum + ' of 9') + '"><div style="width:' + Math.max(3, Math.round(r.sum / 9 * 100)) + '%"></div></div>' +
        '<p>' + esc(c.question) + '</p>' +
        '<p class="pt-small pt-muted">Scripture: ' + refLink(c.verse) + '</p>' +
      '</div>';
    }).join('');
    if (top !== null) {
      html += '<div class="uh-start"><span class="pt-label">Your suggested starting point</span>' +
        '<h3 class="pt-h3">' + esc(CATS[top].name) + '</h3>' +
        '<p>This is the area you reported most often. That does not establish it is your deepest issue or that other areas are unimportant.</p>' +
        '<p><em>' + esc(CATS[top].question) + '</em></p></div>';
    }
    html += '<div class="pt-callout uh-safe"><p><strong>Grace and responsibility belong together.</strong> You can acknowledge something that needs to change without treating your failure as your entire identity. Read ' + refLink('Romans 8:1') + ' and ' + refLink('1 John 1:8–9') + '.</p></div>' +
      nav('← Revisit answers', 'toBridge', 'Continue: The Naaman Moment →');
    return html;
  }

  function bridge() {
    return stepTop() + track6(100 * 2 / 6) +
      '<h2 class="pt-h2">What happens when the instruction isn’t what you expected?</h2>' +
      '<blockquote class="uh-scripture"><p>“Behold, I thought…”</p><cite>2 Kings 5:11 (KJV)</cite></blockquote>' +
      '<p style="margin-top:1.25rem">Naaman expected a particular encounter. His anger almost turned him away. Choose the response that most resembles your <strong>first instinct</strong>, not what you believe you should do. Each choice opens a short Scripture-based reflection, not a grade.</p>' +
      nav(null, 'toScenarios', 'Continue →');
  }

  function scenario() {
    var s = S[st.s], cur = st.picks[st.s];
    return stepTop('Situation ' + (st.s + 1) + ' of ' + NS) + track6(Math.round(100 * (2 + st.s / NS) / 6)) +
      '<span class="uh-tag">' + esc(s.title) + '</span>' +
      '<fieldset class="pt-fieldset"><legend class="pt-legend">' + esc(s.text) + '</legend>' +
        s.choices.map(function (c, i) {
          return '<button type="button" class="pt-option" data-a="pick" data-v="' + i + '" aria-pressed="' + (cur === i) + '">' + esc(c) + '</button>';
        }).join('') +
      '</fieldset>' +
      '<div class="uh-follow" aria-live="polite">' + (cur != null ? followHtml(s) : '') + '</div>' +
      nav(null, 'next', st.s === NS - 1 ? 'Continue: The Agreement Finder →' : 'Continue →', cur == null);
  }
  function followHtml(s) {
    return '<div class="pt-callout"><p>' + esc(s.reveal) + '</p><p class="pt-small">Read: ' + refLink(s.ref) + '</p></div>';
  }

  function finder() {
    return stepTop() + track6(100 * 3 / 6) +
      '<h2 class="pt-h2">What conclusion have I started obeying?</h2>' +
      '<p>Trace one real incident rather than answering in abstractions. The difference between a fact, an interpretation, and a justification can be spiritually revealing. Write as much or as little as you like.</p>' +
      HINGE.map(function (h, i) {
        return '<div class="pt-field"><label for="uh_' + h[0] + '">' + (i + 1) + '. ' + esc(h[1]) + '</label>' +
          '<textarea id="uh_' + h[0] + '" data-hinge="' + h[0] + '" maxlength="2000">' + esc(st.hinge[h[0]] || '') + '</textarea></div>';
      }).join('') +
      '<h3 class="pt-h3 uh-gap">Integrity under pressure: the Gehazi warning</h3>' +
      '<p>Gehazi’s actions in ' + refLink('2 Kings 5:20–27') + ' include a false story, hidden gain, and denial. His story is not permission to assume that all privacy is secrecy or all ambition is greed. It is a call to examine truthfulness. Check any question you need to sit with.</p>' +
      '<ul class="pt-days uh-checks">' + GEHAZI.map(function (g, i) {
        return '<li><label><input type="checkbox" data-gehazi="' + i + '"' + (st.gehazi[i] ? ' checked' : '') + '>' +
          '<span class="pt-day-text">' + esc(g) + ' <span class="pt-muted pt-small">This is something I need to examine.</span></span></label></li>';
      }).join('') + '</ul>' +
      nav(null, 'toPrayer', 'Bring it into prayer →');
  }

  function prayer() {
    var top = topCat(), c = CATS[top !== null ? top : 5];
    return stepTop() + track6(100 * 4 / 6) +
      '<h2 class="pt-h2">From honest examination to intentional prayer.</h2>' +
      '<p>Prayer is not a performance or a method for guaranteeing an outcome. It is an opportunity to bring our actual desires, fears, and actions before God.</p>' +
      '<div class="uh-result is-top"><span class="pt-label">Suggested focus · ' + esc(c.name) + '</span>' +
        '<p><strong>Scripture:</strong> ' + refLink(c.verse) + '</p>' +
        '<p><strong>Question:</strong> ' + esc(c.question) + '</p>' +
        '<p><strong>Suggested prayer:</strong> ' + esc(c.prayer) + '</p>' +
        '<p class="pt-small pt-muted">This suggestion is based only on your own answers. You may pray about any other concern instead.</p></div>' +
      '<blockquote class="uh-scripture"><span class="pt-label">Scripture to pray</span>' +
        '<p>“Search me, O God, and know my heart: try me, and know my thoughts: And see if there be any wicked way in me, and lead me in the way everlasting.”</p>' +
        '<cite>Psalm 139:23–24 (KJV)</cite></blockquote>' +
      '<div class="pt-field"><label for="uhPrayer">Write an honest prayer in your own words</label>' +
        '<textarea id="uhPrayer" data-field="prayer" maxlength="3000" placeholder="Father, I have been holding on to… I need Your help to…">' + esc(st.prayer) + '</textarea></div>' +
      nav(null, 'toReturn', 'Build my return path →');
  }

  function ret() {
    return stepTop() + track6(100) +
      '<h2 class="pt-h2">What will change when this page closes?</h2>' +
      '<p>Naaman did not merely reconsider Elisha’s instruction. He went to the Jordan and acted. Faithful response is more than a compelling insight.</p>' +
      '<div class="pt-field"><label for="uhAction">My next faithful action</label>' +
        '<textarea id="uhAction" data-field="action" maxlength="2000" placeholder="Within 48 hours, I will…">' + esc(st.action) + '</textarea></div>' +
      '<div class="pt-field"><label for="uhPerson">My safe accountability connection</label>' +
        '<textarea id="uhPerson" data-field="person" maxlength="2000" placeholder="I will speak with… about… (Only if safe and appropriate.)">' + esc(st.person) + '</textarea></div>' +
      '<h3 class="pt-h3 uh-gap">A seven-day formation path</h3>' +
      '<p class="pt-muted pt-small">One day at a time. Check off a day when it’s done.</p>' +
      '<ol class="pt-days uh-days">' + DAYS.map(function (d, i) {
        return '<li><label><input type="checkbox" data-day="' + i + '"' + (st.done[i] ? ' checked' : '') + '><span class="pt-day-num">Day ' + (i + 1) + '</span>' +
          '<span class="pt-day-text"><strong>' + esc(d[0]) + (d[1] ? ' · ' + refLink(d[1]) : '') + '</strong><br>' + esc(d[2]) + '</span></label></li>';
      }).join('') + '</ol>' +
      '<p class="pt-progress" id="uhDaysDone" aria-live="polite">' + daysDone() + '</p>' +
      '<div class="pt-callout uh-safe"><p><strong>A crucial safeguard:</strong> If you are experiencing coercion, abuse, or threats, you do not need to confess responsibility for someone else’s harmful behavior or seek reconciliation without safety. Seek qualified support and appropriate protection.</p></div>' +
      '<div class="pt-actions pt-no-print">' +
        '<button type="button" class="pt-btn" data-a="download">Download my private reflection (.txt)</button>' +
        '<button type="button" class="pt-btn pt-btn--ghost" data-a="copy">Copy my reflection</button>' +
        '<button type="button" class="pt-btn pt-btn--ghost" data-a="print">Print / save as PDF</button>' +
      '</div>' +
      '<p class="pt-feedback pt-no-print" id="uhFb" aria-live="polite"></p>' +
      '<div class="pt-actions pt-no-print">' +
        '<button type="button" class="pt-btn pt-btn--ghost" data-a="back">← Back</button>' +
        '<button type="button" class="pt-btn pt-btn--ghost" data-a="review">Review my answers</button>' +
        '<button type="button" class="pt-btn pt-btn--ghost" data-a="clear">Clear all answers</button>' +
      '</div>';
  }
  function daysDone() { return count(st.done) + ' of 7 days done'; }

  function summaryText() {
    var sc = scores();
    var L = ['THE UNEXAMINED HEART · PRIVATE REFLECTION', 'TheWrkShop · 2 Kings 5 · thewrkshop.com/tools/unexamined-heart/', '', 'THE MIRROR'];
    Q.forEach(function (q, i) { var v = st.answers[i]; L.push((i + 1) + '. ' + q[1] + ' — ' + (typeof v === 'number' ? FREQ[v] : 'Not answered')); });
    L.push('', 'REFLECTION PATTERNS');
    sc.forEach(function (r) { L.push(CATS[r.i].name + ': ' + r.sum + '/9 (self-reported frequency, not a diagnostic score) · ' + CATS[r.i].verse); });
    L.push('', 'THE NAAMAN MOMENT');
    S.forEach(function (s, i) { L.push('- ' + s.title + ': ' + (st.picks[i] != null ? s.choices[st.picks[i]] : 'Not answered')); L.push('  ' + s.ref + ' · ' + s.reveal); });
    L.push('', 'THE AGREEMENT FINDER');
    HINGE.forEach(function (h) { L.push(h[1]); L.push((st.hinge[h[0]] || '').trim() || '(blank)'); });
    L.push('', 'INTEGRITY REFLECTION');
    GEHAZI.forEach(function (g, i) { L.push('- ' + g + ' ' + (st.gehazi[i] ? '[Selected for reflection]' : '[Not selected]')); });
    L.push('', 'MY PRAYER', st.prayer.trim() || '(not written)', '', 'MY NEXT FAITHFUL ACTION', st.action.trim() || '(not written)', '', 'ACCOUNTABILITY', st.person.trim() || '(not written)', '', 'SEVEN-DAY PATH');
    DAYS.forEach(function (d, i) { L.push('- Day ' + (i + 1) + ' · ' + d[0] + ': ' + (st.done[i] ? 'Done' : 'Not yet')); });
    L.push('', 'This is a personal reflection, not a clinical or spiritual diagnosis.');
    return L.join('\n');
  }
  function feedback(m) { var fb = document.getElementById('uhFb'); if (fb) fb.textContent = m; }
  function copyText(text) {
    function fallback() {
      try {
        var t = document.createElement('textarea');
        t.value = text; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
        document.body.appendChild(t); t.select();
        var ok = document.execCommand('copy'); t.remove();
        feedback(ok ? 'Copied.' : 'Copy isn’t available in this browser. Use Print / save as PDF instead.');
      } catch (e) { feedback('Copy isn’t available in this browser. Use Print / save as PDF instead.'); }
    }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(function () { feedback('Copied.'); }, fallback);
    else fallback();
  }
  function download() {
    try {
      var blob = new Blob([summaryText()], { type: 'text/plain;charset=utf-8' }), url = URL.createObjectURL(blob), a = document.createElement('a');
      a.href = url; a.download = 'thewrkshop-unexamined-heart-reflection.txt';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      feedback('Your file was prepared on this device. Store it somewhere private.');
    } catch (e) { feedback('Download isn’t available in this browser. Try Copy or Print instead.'); }
  }

  /* ---------- render + events ---------- */
  var VIEWS = { intro: intro, q: question, map: map, bridge: bridge, s: scenario, finder: finder, prayer: prayer, ret: ret };
  function render(focus) {
    if (!VIEWS[st.stage]) st.stage = 'intro';
    document.body.classList.toggle('uh-in-tool', st.stage !== 'intro');
    app.innerHTML = VIEWS[st.stage]();
    save();
    if (focus) focusTop();
  }
  var BACK = { map: function () { st.stage = 'q'; st.q = 0; }, bridge: function () { st.stage = 'map'; }, finder: function () { st.stage = 's'; st.s = NS - 1; },
    prayer: function () { st.stage = 'finder'; }, ret: function () { st.stage = 'prayer'; },
    q: function () { if (st.q === 0) st.stage = 'intro'; else st.q--; },
    s: function () { if (st.s === 0) st.stage = 'bridge'; else st.s--; } };

  app.addEventListener('click', function (e) {
    var b = e.target.closest('[data-a]');
    if (!b || b.disabled) return;
    var act = b.getAttribute('data-a');
    if (act === 'start') {
      if (!count(st.answers)) track('unexamined_heart_start');
      if (count(st.answers) >= NQ) st.stage = 'map';
      else { st.stage = 'q'; var g = 0; while (g < NQ - 1 && st.answers[g] != null) g++; st.q = g; }
      render(true);
    } else if (act === 'restart') {
      st = fresh(); render(true);
    } else if (act === 'clear') {
      if (!window.confirm('Clear all of your responses from this page? This cannot be undone.')) return;
      st = fresh(); render(true);
    } else if (act === 'answer') {
      st.answers[st.q] = Number(b.getAttribute('data-v'));
      app.querySelectorAll('[data-a="answer"]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      save();
      setTimeout(function () {
        if (st.q < NQ - 1) st.q++;
        else { var gap = -1; for (var i = 0; i < NQ; i++) if (st.answers[i] == null) { gap = i; break; } if (gap >= 0) st.q = gap; else st.stage = 'map'; }
        render(true);
      }, 180);
    } else if (act === 'back') {
      if (BACK[st.stage]) BACK[st.stage]();
      render(true);
    } else if (act === 'toBridge') { st.stage = 'bridge'; render(true);
    } else if (act === 'toScenarios') { st.stage = 's'; render(true);
    } else if (act === 'pick') {
      st.picks[st.s] = Number(b.getAttribute('data-v'));
      app.querySelectorAll('[data-a="pick"]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      app.querySelector('.uh-follow').innerHTML = followHtml(S[st.s]);
      app.querySelector('[data-a="next"]').disabled = false;
      save();
    } else if (act === 'next') {
      if (st.s < NS - 1) st.s++; else st.stage = 'finder';
      render(true);
    } else if (act === 'toPrayer') { st.stage = 'prayer'; render(true);
    } else if (act === 'toReturn') {
      if (st.stage !== 'ret') track('unexamined_heart_finish');
      st.stage = 'ret'; render(true);
    } else if (act === 'review') { st.stage = 'q'; st.q = 0; render(true);
    } else if (act === 'copy') { copyText(summaryText());
    } else if (act === 'download') { download();
    } else if (act === 'print') { window.print(); }
  });
  app.addEventListener('input', function (e) {
    var t = e.target, f = t.getAttribute('data-field'), h = t.getAttribute('data-hinge');
    if (f) { st[f] = t.value.slice(0, 3000); save(); }
    else if (h) { st.hinge[h] = t.value.slice(0, 2000); save(); }
  });
  app.addEventListener('change', function (e) {
    var t = e.target, d = t.getAttribute('data-day'), g = t.getAttribute('data-gehazi');
    if (d != null) {
      if (t.checked) st.done[d] = 1; else delete st.done[d];
      var p = document.getElementById('uhDaysDone'); if (p) p.textContent = daysDone();
    } else if (g != null) {
      if (t.checked) st.gehazi[g] = 1; else delete st.gehazi[g];
    } else return;
    save();
  });

  render(false);
})();
