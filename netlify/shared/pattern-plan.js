// The Pattern Finder — results email and 7-day plan. Pure content + rendering: no network, no environment.
// Content comes from scripts/patterns/patterns-data.mjs (the same data as the website pages),
// plus the seven-day rhythm from the Growth Journal.
import { emailLayout, escapeHtml, SITE_URL } from './daily-email.js';
import { PATTERNS } from '../../scripts/patterns/patterns-data.mjs';

const BROWN = '#3e2c23';
const EMBER = '#c4501a';
const MUTED = '#7a6a60';
const FINDER = `${SITE_URL}/tools/pattern-finder/`;
const LAB = `${SITE_URL}/tools/interruption-lab/`;
const JOURNAL = `${SITE_URL}/tools/growth-journal/`;
const MAX = 8;

export const PATTERN_IDS = PATTERNS.map(p => p.id);
export const patternById = (id) => PATTERNS.find(p => p.id === id) || null;
export const PATTERN_DAYS = 7;

// The Growth Journal's seven-day rhythm, one focus per day.
const RHYTHM = ['Notice the trigger.', 'Separate fact from story.', 'Name what feels threatened.', 'Pause before responding.', 'Rehearse a healthier response.', 'Practice repair where appropriate.', 'Review what you learned.'];

const bible = (ref) => `https://www.biblegateway.com/passage/?search=${encodeURIComponent(ref.replace(/–/g, '-'))}&version=NIV`;
const p = (html, extra = '') => `<p style="margin:0 0 14px;line-height:1.6;${extra}">${html}</p>`;
const btn = (href, text) =>
  `<p style="margin:22px 0;"><a href="${escapeHtml(href)}" style="display:inline-block;background:${BROWN};color:#f4f1ee;padding:12px 22px;border-radius:6px;text-decoration:none;font-weight:700;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(text)}</a></p>`;
const box = (label, html) =>
  `<div style="border-left:4px solid ${EMBER};padding:4px 0 4px 14px;margin:0 0 16px;">
  <p style="margin:0 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:${MUTED};">${escapeHtml(label)}</p>
  <p style="margin:0;line-height:1.6;">${html}</p></div>`;
const hello = (n) => (String(n || '').trim() ? `${escapeHtml(String(n).trim())}, ` : '');
const noDot = (s) => String(s).replace(/[.。]\s*$/, '');

function footer(unsubscribeUrl, day) {
  const where = day ? `Day ${day} of ${PATTERN_DAYS} of the plan` : 'Your 7-day plan';
  return {
    html: `${where} you asked for at thewrkshop.com. Your answers were never stored; we keep only your email and pattern to send the plan.<br>
<a href="${escapeHtml(unsubscribeUrl)}" style="color:${MUTED};">Stop the 7-day plan</a> · <a href="${FINDER}" style="color:${MUTED};">Take the Pattern Finder again</a><br>— TheWrkShop`,
    text: `${where} you asked for at thewrkshop.com. Your answers were never stored.\nStop the 7-day plan: ${unsubscribeUrl}\n— TheWrkShop`
  };
}

/**
 * Results email, sent right away.
 * scores: { [patternId]: 0–8 }, focusId: pattern he explored, follow: [threatIdx, reactionIdx, afterIdx].
 */
export function patternResultsEmail({ firstName, scores, focusId, follow, unsubscribeUrl }) {
  const pat = patternById(focusId);
  const ranked = PATTERNS.map((x, i) => ({ ...x, score: scores[x.id], i })).sort((a, b) => b.score - a.score || a.i - b.i);
  const rows = ranked.map(x => {
    const pct = Math.round(x.score / MAX * 100);
    const color = x.id === focusId ? EMBER : '#9a8f84';
    return `<tr><td style="padding:6px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#2b2b2b;">${escapeHtml(x.name)}</td>
<td style="padding:6px 0 6px 10px;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${MUTED};text-align:right;">${x.score}/${MAX}</td></tr>
<tr><td colspan="2" style="padding:0 0 8px;"><div style="height:8px;background:#ece5dc;"><div style="height:8px;width:${pct}%;background:${color};"></div></div></td></tr>`;
  }).join('');

  const words = [
    ['What may feel threatened', pat.threat[follow[0]]],
    ['Your usual first response', pat.reaction[follow[1]]],
    ['What follows', pat.after[follow[2]]]
  ];

  const bodyHtml = `
${p(`${hello(firstName)}here’s your reflection. Your answers suggest <strong>${escapeHtml(pat.name)}</strong> may be a pattern worth examining: ${escapeHtml(pat.desc.toLowerCase())}. It’s a starting point for reflection, not a label or a diagnosis.`)}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:6px 0 18px;">${rows}</table>
<p style="margin:18px 0 8px;font-weight:700;color:${BROWN};">Your situation, in your words</p>
${words.map(w => p(`<strong>${escapeHtml(w[0])}:</strong> ${escapeHtml(w[1])}`, 'margin-bottom:6px;')).join('')}
<div style="background:#2e2923;color:#e8e0d4;padding:18px 20px;margin:18px 0;border-radius:8px;">
  <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#d6ad61;">Your pause question</p>
  <p style="margin:0 0 12px;font-size:19px;line-height:1.45;color:#fafaf8;">${escapeHtml(pat.pauseQuestion)}</p>
  <p style="margin:0;line-height:1.6;"><strong style="color:#fafaf8;">Try instead:</strong> ${escapeHtml(pat.tryInstead)}</p>
</div>
<p style="margin:18px 0 8px;font-weight:700;color:${BROWN};">Your seven-day practice</p>
<ol style="margin:0 0 14px;padding-left:22px;line-height:1.6;">${pat.days.map(d => `<li>${escapeHtml(d)}</li>`).join('')}</ol>
${p(`<strong>Optional biblical reflection:</strong> <a href="${bible(pat.verse)}" style="color:${BROWN};">${escapeHtml(pat.verse)}</a>. ${escapeHtml(pat.nuance)}`)}
${p(`<strong>Your plan starts tomorrow morning.</strong> Each day brings one practice from the list above and one small way to put it to work. It takes about five minutes.`)}
${btn(`${SITE_URL}/patterns/${pat.id}/#practice`, 'Open my practice page')}`;

  const foot = footer(unsubscribeUrl, 0);
  const text = [
    `${firstName ? firstName + ', here' : 'Here'}’s your Pattern Finder reflection: ${pat.name} (${pat.desc}).`,
    'A starting point for reflection, not a label or diagnosis.',
    '',
    ...ranked.map(x => `- ${x.name}: ${x.score}/${MAX}`),
    '',
    ...words.map(w => `${w[0]}: ${w[1]}`),
    '',
    `Pause question: ${pat.pauseQuestion}`,
    `Try instead: ${pat.tryInstead}`,
    '',
    'Your seven-day practice:',
    ...pat.days.map((d, i) => `${i + 1}. ${d}`),
    '',
    `Optional Scripture: ${pat.verse}. ${pat.nuance}`,
    '',
    'Your plan starts tomorrow morning.',
    `Practice page: ${SITE_URL}/patterns/${pat.id}/#practice`,
    '',
    foot.text
  ].join('\n');

  return {
    subject: `Your Pattern Finder result: ${pat.name}`,
    html: emailLayout({ title: pat.name, preheader: `Your pause question: ${pat.pauseQuestion}`, bodyHtml, footerHtml: foot.html }),
    text
  };
}

/** One day of the plan (day is 1–7). */
export function patternDayEmail({ day, focusKey, firstName, unsubscribeUrl }) {
  const pat = patternById(focusKey);
  const practice = pat.days[day - 1];
  const extras = {
    1: box('Try instead', escapeHtml(pat.tryInstead)),
    2: p(`Write today’s moment in the <a href="${JOURNAL}?pattern=${pat.id}" style="color:${BROWN};">Growth Journal</a>: what happened, and the story you told yourself about it. It stays private on your device.`),
    3: p(`<strong>Read:</strong> <a href="${bible(pat.verse)}" style="color:${BROWN};">${escapeHtml(pat.verse)}</a>. ${escapeHtml(pat.nuance)}`),
    4: p(`Rehearse it before the moment comes: the <a href="${LAB}?pattern=${pat.id}" style="color:${BROWN};">Interruption Lab</a> walks you through one tense moment in about three minutes.`),
    5: box('Practice a different response', escapeHtml(pat.replacement)),
    6: box('Look beneath the reaction', escapeHtml(pat.question)),
    7: `${p(`Look back over the week. What changed when you paused? What still feels hard? There’s grace for both.`)}
${p(`If you want to keep going, The Daily brings one Scripture, one hard question and one step to your inbox every weekday morning.`)}
${btn(`${SITE_URL}/daily.html`, 'Get The Daily')}
${p(`Want other men to walk this out with you? <a href="${SITE_URL}/get-known.html" style="color:${BROWN};">Join a group</a>.`, 'font-size:15px;')}`
  };

  const bodyHtml = `
<p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:${EMBER};">Day ${day} of ${PATTERN_DAYS} · ${escapeHtml(pat.name)}</p>
${p(`${day === 1 ? hello(firstName) : ''}This week’s rhythm for today: <strong>${escapeHtml(RHYTHM[day - 1])}</strong>`)}
${box('Your pause question', escapeHtml(pat.pauseQuestion))}
${extras[day]}
${day < 7 ? btn(`${SITE_URL}/patterns/${pat.id}/#practice`, 'Check it off on my practice page') : ''}`;

  const foot = footer(unsubscribeUrl, day);
  const text = [
    `DAY ${day} OF ${PATTERN_DAYS} · ${pat.name}`,
    `Today's practice: ${practice}`,
    `Today's rhythm: ${RHYTHM[day - 1]}`,
    `Your pause question: ${pat.pauseQuestion}`,
    '',
    { 1: `Try instead: ${pat.tryInstead}`, 2: `Write today's moment in the Growth Journal: ${JOURNAL}?pattern=${pat.id}`,
      3: `Read: ${pat.verse}. ${pat.nuance}`, 4: `Rehearse it in the Interruption Lab: ${LAB}?pattern=${pat.id}`,
      5: `Practice a different response: ${pat.replacement}`, 6: `Look beneath the reaction: ${pat.question}`,
      7: `Look back over the week. Keep going with The Daily: ${SITE_URL}/daily.html` }[day],
    '',
    `Practice page: ${SITE_URL}/patterns/${pat.id}/#practice`,
    '',
    foot.text
  ].join('\n');

  return {
    subject: `Day ${day}: ${noDot(practice)}`,
    html: emailLayout({ title: practice, preheader: `${pat.name} · Day ${day} of ${PATTERN_DAYS}`, bodyHtml, footerHtml: foot.html }),
    text
  };
}

/** Validate what the browser sends. Returns { scores, focusId, follow } or null. */
export function cleanPatternResult(input) {
  if (!input || typeof input !== 'object') return null;
  const scores = {};
  for (const id of PATTERN_IDS) {
    const v = Number(input.scores && input.scores[id]);
    if (!Number.isInteger(v) || v < 0 || v > MAX) return null;
    scores[id] = v;
  }
  const top = Math.max(...PATTERN_IDS.map(id => scores[id]));
  const focusId = String(input.pattern || '');
  if (!PATTERN_IDS.includes(focusId) || scores[focusId] !== top) return null; // he may only pick a top-scoring pattern
  const f = Array.isArray(input.follow) ? input.follow.map(Number) : [];
  if (f.length !== 3 || f.some(n => !Number.isInteger(n) || n < 0 || n > 3)) return null;
  return { scores, focusId, follow: f };
}
