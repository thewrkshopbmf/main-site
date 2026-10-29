/* After the Amen: all answers stay in this browser tab. Nothing typed or chosen is sent anywhere. */
(function(){
'use strict';
const $ = id => document.getElementById(id);
const el = (tag, props = {}, text) => { const n = document.createElement(tag); Object.assign(n, props); if (text !== undefined) n.textContent = text; return n; };
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const scrollTo = node => node.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });

// Scripture links open the passage in context (only when the reader clicks).
const passageLink = ref => {
  const a = el('a', { href: 'https://www.biblegateway.com/passage/?search=' + encodeURIComponent(ref.replace(/–/g, '-')) + '&version=NIV;NLT', target: '_blank', rel: 'noopener' }, ref);
  a.title = 'Read ' + ref + ' in the NIV and NLT (opens in a new tab)';
  return a;
};

/* ---------- Tabs ---------- */
const tabs = [...document.querySelectorAll('[role=tab]')];
function showTab(id, focusHeading = true) {
  document.querySelectorAll('.ata-panel').forEach(s => s.classList.toggle('hidden', s.id !== id));
  tabs.forEach(t => { const on = t.dataset.tab === id; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
  if (id === 'path') renderBurdenEcho();
  // Bring the section tabs back into view if the reader has scrolled past them.
  const nav = $('ataTabs');
  if (nav.getBoundingClientRect().top < 0) nav.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  if (focusHeading) { const h = $(id).querySelector('h2'); if (h) h.focus({ preventScroll: true }); }
}
tabs.forEach((t, i) => {
  t.addEventListener('click', () => showTab(t.dataset.tab, false));
  t.addEventListener('keydown', e => {
    let j = null;
    if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
    if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
    if (e.key === 'Home') j = 0;
    if (e.key === 'End') j = tabs.length - 1;
    if (j !== null) { e.preventDefault(); tabs[j].focus(); showTab(tabs[j].dataset.tab, false); }
  });
});
document.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => showTab(b.dataset.go)));

/* ---------- Decision Lab ---------- */
const scenarios = [
{id:'family',title:'The unanswered message',stages:[
 {title:'You prayed for reconciliation',story:'You sent a respectful message to an adult family member after praying for healing in your relationship. Two days pass without a response.',choices:[
  ['Send several follow-up messages to make sure they respond.','A desire for reconciliation is good. Multiple messages might create pressure; ask whether urgency reflects their needs or your discomfort with uncertainty.'],
  ['Give them room while remaining open to appropriate communication.','Respecting another person’s agency can be faithful. You can remain available without controlling their response.'],
  ['Decide they will never change and stop caring.','Protective withdrawal is understandable, but a painful delay does not establish what the future holds. Healthy boundaries and ongoing love can coexist.']]},
 {title:'The uncertainty continues',story:'A week later, you still have no reply. You are hurt, and someone advises you to “just have more faith.”',choices:[
  ['Hide the hurt because a believer should not feel disappointed.','Psalm 13 makes room for grief and honest petition. Faith does not require pretending.'],
  ['Bring the hurt to God and seek wise counsel about appropriate boundaries.','This allows lament, wisdom, and responsible action without a guaranteed result.'],
  ['Demand that the other person respond immediately.','You can communicate needs and boundaries, but cannot compel another person’s reconciliation.']]}]},
{id:'work',title:'The uncertain job offer',stages:[
 {title:'You prayed for provision',story:'You have interviewed for a job that would help your family. The employer said they would reply by Friday. It is Monday and you have heard nothing.',choices:[
  ['Send a respectful follow-up and continue other applications.','This is an example of responsible action without claiming control over the outcome.'],
  ['Exaggerate another offer to pressure them.','Fear about provision is real, but dishonesty is not justified by a good goal.'],
  ['Stop applying elsewhere because God must give you this job.','A personal hope should not be treated as a divine guarantee. Wise stewardship can include continuing the search.']]},
 {title:'The answer is no',story:'You receive a rejection email. You feel discouraged and wonder whether prayer mattered.',choices:[
  ['Conclude God failed because the job was not yours.','A painful outcome does not by itself establish that God was unfaithful. Romans 8 anchors hope in Christ rather than a particular job.'],
  ['Tell God you are disappointed, seek support, and keep pursuing work.','Honest lament and practical responsibility can belong together.'],
  ['Pretend you are not upset and tell everyone you expected this.','You do not need to perform certainty. Grief and trust can coexist.']]}]},
{id:'health',title:'The difficult medical update',stages:[
 {title:'You prayed for healing',story:'Someone you love receives an unfavorable medical update after weeks of prayer. You feel afraid and helpless.',choices:[
  ['Assume the result means someone did not believe enough.','Scripture does not authorize assigning blame for illness or promising every requested healing.'],
  ['Ask honest questions, pursue appropriate care, and keep praying.','Prayer, medical care, lament, and practical support can coexist.'],
  ['Avoid all conversations because hope feels dangerous.','Withdrawal can be a protective response. Consider a trusted person who can listen without forcing reassurance.']]},
 {title:'Another hard week',story:'Caregiving responsibilities are exhausting. A friend says you should feel peaceful if you truly trust God.',choices:[
  ['Admit you need help and ask others for concrete support.','Bearing one another’s burdens (Galatians 6:2) is part of Christian community.'],
  ['Hide your exhaustion so nobody questions your faith.','Fatigue is not proof of unbelief. Asking for help can be wise and faithful.'],
  ['Abandon all practical planning because the outcome is God’s responsibility.','Trust is not passivity. Appropriate care, rest, and planning remain important.']]}]}
];
let activeScenario = null, stage = 0, picks = [];
function setBar(bar, span, pct, now) { span.style.width = pct + '%'; bar.setAttribute('aria-valuenow', String(now)); }

function renderScenarioSelect() {
  const wrap = $('scenarioSelect'); wrap.replaceChildren();
  scenarios.forEach(s => {
    const tile = el('div', { className: 'tile' });
    tile.append(el('h3', {}, s.title), el('p', {}, 'Two decisions with biblical reflection.'));
    const b = el('button', {}, 'Explore scenario');
    b.setAttribute('aria-label', 'Explore scenario: ' + s.title);
    b.addEventListener('click', () => {
      activeScenario = s; stage = 0; picks = [];
      wrap.classList.add('hidden'); $('labPlay').classList.remove('hidden');
      renderStage(); $('labStage').scrollIntoView({ block: 'center' });
    });
    tile.append(b); wrap.append(tile);
  });
}
function renderStage() {
  const s = activeScenario.stages[stage], n = activeScenario.stages.length;
  $('labStageWrap').classList.remove('hidden'); $('labDone').classList.add('hidden');
  $('labStage').textContent = `${activeScenario.title} · Decision ${stage + 1} of ${n}`;
  setBar($('labBar'), $('labProgress'), stage / n * 100, Math.round(stage / n * 100));
  $('labTitle').textContent = s.title;
  $('labStory').textContent = s.story;
  const opts = $('labOptions'); opts.replaceChildren();
  s.choices.forEach((c, i) => {
    const b = el('button', { className: 'option' }, c[0]);
    b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', () => {
      picks[stage] = i;
      opts.querySelectorAll('button').forEach((x, j) => x.setAttribute('aria-pressed', String(i === j)));
      $('labFeedback').replaceChildren(el('strong', {}, 'Consider: '), document.createTextNode(c[1]));
      $('labFeedback').classList.remove('hidden');
      $('labNext').classList.remove('hidden');
    });
    opts.append(b);
  });
  $('labFeedback').classList.add('hidden');
  $('labNext').classList.add('hidden');
  $('labNext').textContent = stage === n - 1 ? 'Finish scenario' : 'Continue →';
}
$('labNext').addEventListener('click', () => {
  if (stage < activeScenario.stages.length - 1) { stage++; renderStage(); $('labTitle').tabIndex = -1; $('labTitle').focus(); return; }
  setBar($('labBar'), $('labProgress'), 100, 100);
  $('labStageWrap').classList.add('hidden'); $('labNext').classList.add('hidden');
  $('labDoneTitle').textContent = activeScenario.title;
  const recap = $('labRecap'); recap.replaceChildren();
  activeScenario.stages.forEach((st, i) => recap.append(el('li', {}, `${st.title}: ${st.choices[picks[i]][0]}`)));
  $('labDone').classList.remove('hidden');
  $('labDoneTitle').tabIndex = -1; $('labDoneTitle').focus();
});
$('labReset').addEventListener('click', () => {
  $('scenarioSelect').classList.remove('hidden'); $('labPlay').classList.add('hidden'); activeScenario = null;
});
renderScenarioSelect();

/* ---------- The Mirror ---------- */
const qs = [
 ['Protection','What feels hardest to release after praying?',['My sense of security','My reputation or sense of worth','Someone else’s decisions','The need to know what happens next']],
 ['Protection','When uncertainty rises, what do you most want to protect?',['A stable future','A valued relationship','My ability to prevent mistakes','My comfort or predictability']],
 ['Belief','Which thought may arise when an outcome disappoints you?',['Maybe God has not heard me','Maybe I did not believe enough','I must secure a different result','I do not know what this means']],
 ['Belief','What is hardest about “Your will be done”?',['Accepting a different outcome','Not knowing the timeline','Releasing ultimate responsibility','Remaining hopeful after disappointment']],
 ['Response','When fear returns after prayer, what do you often do?',['Replay worst-case scenarios in my mind','Push people or circumstances toward the outcome I want','Pull back from something I know I need to do','Pray again, but keep carrying the worry myself']],
 ['Response','What makes the next faithful step difficult?',['Fear of rejection','Fear of failure','Uncertainty about my responsibility','The cost of obedience']],
 ['Relationship','What happens to prayer after disappointment?',['I bring the hurt to God','I hide how disappointed I feel','I pray less openly or less often','I struggle with anger toward God']],
 ['Relationship','What might help you return to honest prayer?',['Room to lament','Clarity about God’s promises','Support from a trusted person','A small practical next step']]
];
// Which pathway(s) each answer points toward (indexes into `roots` below). Used only to suggest, never to diagnose.
const ROOT = {Security:0, Identity:1, Reputation:2, Relationships:3, Comfort:4, Certainty:5, Control:6, Disappointment:7};
const R = ROOT;
const hints = [
 [[R.Security],[R.Identity,R.Reputation],[R.Relationships,R.Control],[R.Certainty]],
 [[R.Security],[R.Relationships],[R.Control],[R.Comfort]],
 [[R.Disappointment],[R.Identity],[R.Control],[R.Certainty]],
 [[R.Control],[R.Certainty],[R.Control],[R.Disappointment]],
 [[R.Certainty],[R.Relationships,R.Control],[R.Comfort],[R.Security]],
 [[R.Reputation],[R.Identity],[R.Certainty],[R.Comfort]],
 [[],[R.Disappointment],[R.Disappointment],[R.Disappointment]],
 [[R.Disappointment],[R.Security],[R.Relationships],[R.Certainty]]
];
let qi = 0; const answers = {};
function renderQ() {
  const q = qs[qi], area = $('questionArea');
  area.replaceChildren(el('p', { className: 'eyebrow' }, `${q[0]} · ${qi + 1} of ${qs.length}`));
  const h = el('h3', { id: 'qHeading' }, q[1]); area.append(h);
  const opts = el('div', { className: 'options', id: 'qOptions' });
  opts.setAttribute('role', 'group'); opts.setAttribute('aria-labelledby', 'qHeading');
  q[2].forEach((a, i) => {
    const b = el('button', { className: 'option' }, a);
    b.setAttribute('aria-pressed', String(answers[qi] === i));
    b.addEventListener('click', () => { answers[qi] = i; $('mirrorMsg').classList.add('hidden'); renderQ(); $('qOptions').children[i].focus(); });
    opts.append(b);
  });
  area.append(opts);
  const done = Object.keys(answers).length;
  setBar($('mirrorBar'), $('mirrorProgress'), done / qs.length * 100, done);
  $('mirrorPrev').disabled = qi === 0;
  $('mirrorNext').textContent = qi === qs.length - 1 ? 'See reflections' : 'Next →';
}
$('mirrorPrev').addEventListener('click', () => { if (qi > 0) { qi--; $('mirrorMsg').classList.add('hidden'); $('mirrorDone').classList.add('hidden'); renderQ(); } });
$('mirrorNext').addEventListener('click', () => {
  if (answers[qi] === undefined) { $('mirrorMsg').classList.remove('hidden'); return; }
  if (qi < qs.length - 1) { qi++; renderQ(); $('qHeading').tabIndex = -1; $('qHeading').focus(); return; }
  const wrap = $('mirrorSummary'); wrap.replaceChildren();
  ['Protection','Belief','Response','Relationship'].forEach(dim => {
    wrap.append(el('h3', {}, dim));
    const ul = el('ul');
    qs.forEach((q, i) => { if (q[0] === dim) ul.append(el('li', {}, q[2][answers[i]])); });
    wrap.append(ul);
  });
  // Suggest up to two pathways from the chosen answers.
  const tally = new Array(8).fill(0);
  qs.forEach((q, i) => hints[i][answers[i]].forEach(r => tally[r]++));
  const top = tally.map((n, i) => [n, i]).filter(x => x[0] > 0).sort((a, b) => b[0] - a[0] || a[1] - b[1]).slice(0, 2).map(x => x[1]);
  const sug = $('mirrorSuggest'); sug.replaceChildren();
  (top.length ? top : [R.Disappointment]).forEach(r => {
    const b = el('button', {}, `${roots[r][0]} · ${roots[r][1]}`);
    b.addEventListener('click', () => { $('rootSelect').value = String(r); renderRoot(); showTab('path'); });
    sug.append(b);
  });
  $('mirrorDone').classList.remove('hidden');
  scrollTo($('mirrorDone')); $('mirrorDoneHeading').focus({ preventScroll: true });
});
renderQ();

/* ---------- Your Pathway ---------- */
const roots = [
 ['Security','Matthew 6:25–34','What does wise provision look like without treating financial certainty as the source of ultimate peace?'],
 ['Identity','Philippians 3:7–9','Am I allowing an outcome to define my worth instead of remembering who I am in Christ?'],
 ['Reputation','Galatians 2:11–14','Whose approval might be shaping my actions more than truth and love?'],
 ['Relationships','Romans 12:18','How can I pursue peace while respecting another person’s agency and appropriate boundaries?'],
 ['Comfort','Luke 9:23','Am I avoiding a clear responsibility because it may cost me something?'],
 ['Certainty','Hebrews 11:8','What is already clear enough to act faithfully without knowing the result?'],
 ['Control','James 4:13–17','What is mine to plan responsibly, and what am I unable to guarantee?'],
 ['Disappointment','Psalm 13','What grief or unanswered question do I need to bring honestly to God?']
];
roots.forEach((r, i) => $('rootSelect').append(el('option', { value: String(i) }, r[0])));
function renderRoot() {
  const r = roots[+$('rootSelect').value], box = $('rootContent');
  box.replaceChildren(
    el('p', {}, ''), el('p', {}, ''), el('p', { className: 'muted' }, 'This passage is a starting point for study, not a promise of your preferred outcome.')
  );
  box.children[0].append('Read ', passageLink(r[1]), ' in context.');
  box.children[1].append(el('strong', {}, 'Reflect: '), r[2]);
}
$('rootSelect').addEventListener('change', renderRoot); renderRoot();

function renderBurdenEcho() {
  const v = $('burden').value.trim(), box = $('burdenEcho');
  if (!v) { box.classList.add('hidden'); return; }
  box.replaceChildren(el('strong', {}, 'The situation you named: '), document.createTextNode(v));
  box.classList.remove('hidden');
}

// Clean an answer so it reads naturally after its sentence stem.
function clean(id, stems) {
  let v = $(id).value.trim().replace(/\s+/g, ' ');
  if (!v) return '';
  for (const s of stems) { const re = new RegExp('^' + s + '\\s*', 'i'); if (re.test(v)) { v = v.replace(re, ''); break; } }
  v = v.replace(/^[,:;\-–—\s]+/, '').replace(/[\s,;:]+$/, '');
  if (!/[.!?…"”)]$/.test(v)) v += '.';
  return v;
}
$('buildPrayer').addEventListener('click', () => {
  const blank = '[add your own words].';
  const burden = clean('burden', []);
  const desire = clean('desire', ['(god|father|lord),?\\s*i am asking you for', '(god|father|lord),?\\s*i\'m asking you for', 'i am asking you for', "i'm asking you for", 'i am asking for']) || blank;
  const fear = clean('fear', ['i am afraid that', "i'm afraid that", 'i am afraid', "i'm afraid"]) || blank;
  const control = clean('control', ['i notice that i keep trying to', 'i keep trying to', 'i am trying to', "i'm trying to", 'trying to']) || blank;
  const step = clean('responsibility', ['a wise and faithful next step may be', 'my next step is', 'my next step may be']) || blank;
  const parts = ['Father, I come to You honestly.'];
  if (burden) parts.push(`I bring this before You: ${burden}`);
  parts.push(`I am asking You for ${desire}`, `I am afraid that ${fear}`, `I recognize that I keep trying to ${control}`,
    `Please give me wisdom, strength, and willingness to take this faithful step: ${step}`,
    'I know You are able to act. Help me trust Your character without pretending I know the outcome. Teach me to pray truthfully, act responsibly, and return to You when fear comes back. In Jesus’ name, amen.');
  $('prayerText').value = parts.join('\n\n');
  $('prayerArea').classList.remove('hidden');
  $('copyStatus').textContent = '';
  scrollTo($('prayerArea')); $('prayerText').focus({ preventScroll: true });
});
$('copyPrayer').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText($('prayerText').value); $('copyStatus').textContent = 'Prayer copied.'; }
  catch (e) { $('prayerText').select(); $('copyStatus').textContent = 'Your prayer is selected. Press Ctrl+C (or ⌘C) to copy.'; }
  setTimeout(() => { $('copyStatus').textContent = ''; }, 4000);
});
$('printPage').addEventListener('click', () => {
  const r = roots[+$('rootSelect').value];
  $('printPrayer').textContent = `${$('prayerText').value}\n\nFor further reading: ${r[1]}\n${r[2]}`;
  $('path').classList.add('print-prayer');
  window.print();
});
window.addEventListener('afterprint', () => $('path').classList.remove('print-prayer'));
$('printGuide').addEventListener('click', () => window.print());

/* ---------- 7-Day Journey ---------- */
const days = [
 ['Name the burden','Psalm 62:8','What am I asking God to do?','Pray plainly, without editing out your real desire.'],
 ['Notice the fear','Mark 9:24','What am I afraid will happen?','Bring both belief and unbelief to Christ.'],
 ['Test the expectation','Daniel 3:16–18','Am I trusting God or a particular outcome?','Pray boldly, then consider “but if not.”'],
 ['Clarify responsibility','James 4:13–17','What is mine to do, and what cannot I guarantee?','Take one wise action without pretending to control tomorrow.'],
 ['Make room for lament','Psalm 13','What disappointment have I hidden?','Bring unresolved grief into prayer.'],
 ['Return to Christ','Romans 8:31–39','What does God reveal about His love in Christ?','Read slowly; distinguish biblical promises from preferred outcomes.'],
 ['Practice faithful return','John 15:4–5','What will returning to dependence look like tomorrow?','Choose one small act of faithful response and invite support.']
];
const dayWrap = $('days');
days.forEach((d, i) => {
  const det = el('details');
  det.append(el('summary', {}, `Day ${i + 1}: ${d[0]} · ${d[1]}`));
  const read = el('p'); read.append(el('strong', {}, 'Read: '), passageLink(d[1]));
  const ref = el('p'); ref.append(el('strong', {}, 'Reflect: '), d[2]);
  const pr = el('p'); pr.append(el('strong', {}, 'Practice: '), d[3]);
  det.id = 'day-' + (i + 1);
  const share = el('div', { className: 'ata-share ata-day-share' });
  const sb = el('button', { type: 'button', className: 'ata-share-btn' }, 'Share this day');
  sb.dataset.day = String(i);
  share.append(sb);
  det.append(read, ref, pr, share); dayWrap.append(det);
});

/* ---------- Sharing (the page and its days only; answers are never shared) ---------- */
const BRAND = 'TheWrkShop.com';
const pageUrl = ((document.querySelector('link[rel=canonical]') || {}).href || location.href).split('#')[0];
function shareButton(btn, getOpts) {
  if (!btn) return;
  if (window.TWSShare && window.TWSShare.button) { window.TWSShare.button(btn, btn.parentElement, getOpts); return; }
  // Fallback if the shared menu script did not load: the phone's share sheet, or copy the link.
  btn.addEventListener('click', () => {
    const o = getOpts(), body = o.text + '\n' + o.url;
    if (navigator.share) navigator.share({ text: body }).catch(() => {});
    else if (navigator.clipboard) navigator.clipboard.writeText(body).then(() => { btn.textContent = 'Link copied ✓'; });
  });
}
shareButton($('sharePage'), () => ({
  type: 'after_the_amen', title: 'Share After the Amen',
  text: 'After the Amen: what happens between the prayer you pray and the life you live afterward. A free, private reflection from ' + BRAND,
  url: pageUrl, emailSubject: 'After the Amen, from ' + BRAND,
  copyLabel: 'Copy link', note: 'Facebook and LinkedIn: the message is copied for you, so just paste it into your post.'
}));
shareButton($('shareGroup'), () => ({
  type: 'after_the_amen_group', title: 'Send to your group',
  text: 'For our group: After the Amen, a 45-minute gathering on trusting God after we pray. Nobody has to share anything private. From ' + BRAND,
  url: pageUrl + '#group', emailSubject: 'For our group: After the Amen',
  copyLabel: 'Copy link', note: 'Text it to your group before you meet. The link opens straight to the guide.'
}));
dayWrap.querySelectorAll('.ata-day-share .ata-share-btn').forEach(btn => {
  const i = +btn.dataset.day, d = days[i];
  shareButton(btn, () => ({
    type: 'after_the_amen_day', title: 'Share Day ' + (i + 1),
    text: '\u201c' + d[2] + '\u201d Day ' + (i + 1) + ' of After the Amen: ' + d[0] + ' \u00b7 ' + d[1] + ' \u2014 ' + BRAND,
    url: pageUrl + '#day-' + (i + 1), emailSubject: 'Day ' + (i + 1) + ' of After the Amen: ' + d[0]
  }));
});

/* ---------- Links straight to a section (#group) or a day (#day-3) ---------- */
function openFromHash() {
  const h = (location.hash || '').slice(1);
  const day = /^day-([1-7])$/.exec(h);
  if (day) {
    showTab('journey', false);
    const d = $('day-' + day[1]);
    d.open = true;
    d.scrollIntoView({ block: 'center' });
    d.classList.add('share-highlight');
    setTimeout(() => d.classList.remove('share-highlight'), 3000);
    return;
  }
  if (['start', 'lab', 'mirror', 'path', 'journey', 'group'].includes(h)) {
    showTab(h, false);
    $('ataTabs').scrollIntoView({ block: 'start' });
  }
}
openFromHash();
window.addEventListener('hashchange', openFromHash);
})();
