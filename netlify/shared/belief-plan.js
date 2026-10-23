// The Belief Project — welcome email and 7-day path emails. Pure content + rendering: no network, no environment.
// Content comes from scripts/belief/belief-data.mjs (the same data as the website pages).
// These emails never contain a person's answers, notes or prayers: only the shared path and, optionally, his starting theme.
import { emailLayout, escapeHtml, SITE_URL } from './daily-email.js';
import { THEMES, THEME_IDS, DAYS } from '../../scripts/belief/belief-data.mjs';

const BROWN = '#3e2c23';
const EMBER = '#c4501a';
const MUTED = '#7a6a60';
const HUB = `${SITE_URL}/belief/`;
const PATH = `${SITE_URL}/belief/7-day/`;
const PRAYER = `${SITE_URL}/belief/prayer/`;

export const BELIEF_DAYS = DAYS.length; // 7
export const BELIEF_FOCUS = ['general', ...THEME_IDS];

const bible = (ref) => `https://www.biblegateway.com/passage/?search=${encodeURIComponent(ref.replace(/–/g, '-'))}&version=NIV`;
const refLinks = (refs) => refs.split(';').map(r => r.trim()).map(r => `<a href="${bible(r)}" style="color:${BROWN};">${escapeHtml(r)}</a>`).join('; ');
const p = (html, extra = '') => `<p style="margin:0 0 14px;line-height:1.6;${extra}">${html}</p>`;
const btn = (href, text) =>
  `<p style="margin:22px 0;"><a href="${escapeHtml(href)}" style="display:inline-block;background:${BROWN};color:#f4f1ee;padding:12px 22px;border-radius:6px;text-decoration:none;font-weight:700;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(text)}</a></p>`;
const box = (label, html) =>
  `<div style="border-left:4px solid ${EMBER};padding:4px 0 4px 14px;margin:0 0 16px;">
  <p style="margin:0 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:${MUTED};">${escapeHtml(label)}</p>
  <p style="margin:0;line-height:1.6;">${html}</p></div>`;
const hello = (n) => (String(n || '').trim() ? `${escapeHtml(String(n).trim())}, ` : '');
const themeOf = (key) => (THEMES[key] ? THEMES[key] : null);

function footer(unsubscribeUrl, day) {
  const where = day ? `Day ${day} of ${BELIEF_DAYS} of the seven-day path` : 'The seven-day path';
  return {
    html: `${where} you asked for at thewrkshop.com. Your answers were never sent to us; we keep only your email to send the path.<br>
<a href="${escapeHtml(unsubscribeUrl)}" style="color:${MUTED};">Stop the seven-day path</a> · <a href="${HUB}" style="color:${MUTED};">The Belief Project</a><br>— TheWrkShop`,
    text: `${where} you asked for at thewrkshop.com. Your answers were never sent to us.\nStop the seven-day path: ${unsubscribeUrl}\n— TheWrkShop`
  };
}

/** Welcome email, sent right away. */
export function beliefWelcomeEmail({ firstName, focusKey, unsubscribeUrl }) {
  const t = themeOf(focusKey);
  const bodyHtml = `
${p(`${hello(firstName)}welcome to <strong>Faith in Practice</strong>, seven days built on a father’s honest prayer: <em>“Lord, I believe; help my unbelief.”</em> (Mark 9:24)`)}
${p(`Starting tomorrow morning you’ll get one short email a day: a passage to read in context, one reflection and one manageable step. These are invitations to return to Christ, not a performance test. Miss a day? Just pick up where you are.`)}
${t ? box('Your starting theme', `${escapeHtml(t.name)}. ${escapeHtml(t.prayer)}`) : ''}
<p style="margin:18px 0 8px;font-weight:700;color:${BROWN};">The week ahead</p>
<ol style="margin:0 0 14px;padding-left:22px;line-height:1.6;">${DAYS.map(d => `<li>${escapeHtml(d.name)}</li>`).join('')}</ol>
${btn(PATH, 'See the seven days')}
${p(`Want to write it down as a prayer today? <a href="${PRAYER}${t ? `?theme=${focusKey}` : ''}" style="color:${BROWN};">Bring it before Jesus</a>.`, 'font-size:15px;')}`;
  const foot = footer(unsubscribeUrl, 0);
  const text = [
    `${firstName ? firstName + ', welcome' : 'Welcome'} to Faith in Practice: seven days built on Mark 9:24, "Lord, I believe; help my unbelief."`,
    'Starting tomorrow morning: one passage, one reflection and one manageable step each day.',
    t ? `Your starting theme: ${t.name}. ${t.prayer}` : '',
    '',
    ...DAYS.map((d, i) => `${i + 1}. ${d.name}`),
    '',
    `The seven days: ${PATH}`,
    '',
    foot.text
  ].filter((l, i, a) => l !== '' || a[i - 1] !== '').join('\n');
  return {
    subject: 'Your seven-day path starts tomorrow',
    html: emailLayout({ title: 'I believe. Help my unbelief.', preheader: 'Seven days of one passage, one reflection and one step.', bodyHtml, footerHtml: foot.html }),
    text
  };
}

/** One day of the path (day is 1–7). */
export function beliefDayEmail({ day, focusKey, firstName, unsubscribeUrl }) {
  const d = DAYS[day - 1];
  const t = themeOf(focusKey);
  const extra = {
    1: t ? box('Your starting theme', `${escapeHtml(t.name)}: ${escapeHtml(t.practice)}`) : '',
    4: t ? p(`<strong>A prayer for your theme:</strong> ${escapeHtml(t.prayer)}`) : '',
    7: `${p('Look back over the week without grading yourself. What did you notice? Where did you return to God instead of withdrawing? There’s grace for what still feels hard.')}
${p('If you want to keep going, The Daily brings one Scripture, one hard question and one step to your inbox every weekday morning.')}
${btn(`${SITE_URL}/daily.html`, 'Get The Daily')}
${p(`Leading a group? The <a href="${SITE_URL}/belief/group-guide/" style="color:${BROWN};">six-session belief series</a> is free.`, 'font-size:15px;')}`
  }[day] || '';

  const bodyHtml = `
<p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:${EMBER};">Day ${day} of ${BELIEF_DAYS} · Faith in Practice</p>
${day === 1 ? p(`${hello(firstName)}here’s today. Five minutes is enough.`) : ''}
${box('Read', refLinks(d.read))}
${box('Reflect', escapeHtml(d.reflect))}
${box('Practice', escapeHtml(d.practice))}
${extra}
${day === 1 ? p(`Pray it plainly: <em>“Lord, I believe; help my unbelief.”</em>`) : ''}
${day < 7 ? btn(`${PATH}#day-${day}`, 'Check off today') : ''}`;

  const foot = footer(unsubscribeUrl, day);
  const text = [
    `DAY ${day} OF ${BELIEF_DAYS} · ${d.name}`,
    `Read: ${d.read}`,
    `Reflect: ${d.reflect}`,
    `Practice: ${d.practice}`,
    t && day === 1 ? `Your starting theme, ${t.name}: ${t.practice}` : null,
    t && day === 4 ? `A prayer for your theme: ${t.prayer}` : null,
    day === 7 ? `Keep going with The Daily: ${SITE_URL}/daily.html` : null,
    '',
    `The seven days: ${PATH}`,
    '',
    foot.text
  ].filter(l => l !== null).join('\n');

  return {
    subject: `Day ${day}: ${d.name}`,
    html: emailLayout({ title: d.name, preheader: `Read ${d.read}. ${d.practice}`, bodyHtml, footerHtml: foot.html }),
    text
  };
}

/** Validate the optional theme the browser sends. Anything unknown becomes 'general'. */
export function cleanBeliefFocus(input) {
  const v = String(input || '').trim().toLowerCase();
  return BELIEF_FOCUS.includes(v) ? v : 'general';
}

