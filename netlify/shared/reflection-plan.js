// "Are You Missing Your Moments?" (The One Verse Man) — results email and 7-day plan.
// Pure content + rendering: no network, no environment. Used by the reflection-* functions.
//
// The 7-day spine comes from the One Verse Man facilitator guide's "Seven-day follow-through".
// Each day adds one line written for the man's focus area (his highest-scoring area).

import { emailLayout, escapeHtml, SITE_URL } from './daily-email.js';

const BROWN = '#3e2c23';
const EMBER = '#c4501a';
const MUTED = '#7a6a60';
const PAGE_URL = `${SITE_URL}/one-verse-man/diagnostic/`;

// Same order as the questions on the page. Keys are what the browser sends.
export const AREAS = [
  {
    key: 'pace', title: 'Pace & Presence', verse: 'Luke 10:38–42',
    prompt: 'Where has hurry displaced attentiveness? Choose one realistic opportunity to slow down.',
    lens: [
      'Look for the person behind today’s interruption. Who keeps getting your leftover attention?',
      'Give someone close to you ten unhurried minutes today, with no phone and no agenda, and don’t mention that you did it.',
      'Is your pace a burden you were given or one you chose? Name one thing you could hand off or let wait.',
      'Courage for you may look like slowing down when everything in you says to push. Protect one unhurried space today.',
      'What does hurry give you: importance, control, a way to avoid feeling something? Name it honestly.',
      'Is there someone your busyness has hurt? A short, honest “I’ve been distracted, and I’m sorry” may be today’s step.',
      'Pick one small rhythm of presence you can actually keep, like a phone-free dinner or a short walk to pray.'
    ]
  },
  {
    key: 'attention', title: 'Attention & Awareness', verse: 'James 1:22–25',
    prompt: 'What truth have you heard repeatedly but not practiced? Choose one concrete application.',
    lens: [
      'Write down one truth you’ve heard more than once this year but haven’t practiced. That’s today’s overlooked responsibility.',
      'Notice one emotional cue from someone close to you today, and respond to it without being asked.',
      'When something uncomfortable surfaces today, wait before reaching for your phone. What were you about to avoid?',
      'Choose to stay present in one conversation you would usually half-listen to, even when it feels slow.',
      'What does constant input protect you from? Boredom, silence, or a conviction you’d rather not face?',
      'If a conviction faded because you never returned to it, bring it back to God today and start again.',
      'Choose one way to revisit what you learn, like a note you reread on Fridays, so truth turns into practice.'
    ]
  },
  {
    key: 'pride', title: 'Pride & Selective Obedience', verse: 'Philippians 2:3–8',
    prompt: 'Where has recognition or self-protection become a condition of service?',
    lens: [
      'Find one responsibility you’ve treated as beneath you, and do it well.',
      'Do one act of service today that no one will see or thank you for. Don’t tell anyone.',
      'Pride often refuses help. Where do you need to admit you can’t carry something alone?',
      'Ask for honest feedback today from someone you wouldn’t usually ask, and listen without defending.',
      'Where has wanting credit started to compete with simply obeying?',
      'Is there an impact you’ve explained away instead of owning? Name it plainly to God, and to the person if it’s wise.',
      'Choose one recurring, unseen way to serve, and keep it quiet.'
    ]
  },
  {
    key: 'fear', title: 'Fear & Avoidance', verse: 'Galatians 1:10',
    prompt: 'Which safe and appropriate conversation or action have you delayed out of fear?',
    lens: [
      'Name the conversation or task you keep putting off. Write it down.',
      'Serve someone today whose opinion of you makes you nervous, without trying to win their approval.',
      'Fear isolates. Tell one trusted man what you’ve been avoiding and ask him to pray for you.',
      'Choose a specific day and time for the conversation you’ve delayed. Courage with discernment means a plan, not a leap.',
      'Whose approval are you protecting by staying quiet? What is it costing you or them?',
      'Is there a relationship you let drift instead of repairing? Take one step toward it today.',
      'Choose one habit that helps you act sooner, like setting a time for hard things instead of “later.”'
    ]
  },
  {
    key: 'comfort', title: 'Comfort & Self-Preoccupation', verse: 'Philippians 2:4',
    prompt: 'How might you consider someone else’s legitimate need while maintaining wise boundaries?',
    lens: [
      'Whose legitimate need have you been treating as an inconvenience? Name the person.',
      'Do one helpful thing today that costs you some comfort and offers you no reward.',
      'Be honest: is something heavy making you less aware of others? Name it, and find support for it.',
      'Ask one person how they are really doing, and stay curious long enough to hear the answer.',
      'What part of your comfort are you protecting most tightly right now?',
      'If you’ve resented someone for needing you, own that before God and, if it’s wise, with them.',
      'Choose one regular way to look outward, like a weekly check-in with someone who could use encouragement.'
    ]
  },
  {
    key: 'honesty', title: 'Honesty & Repentance', verse: 'Psalm 139:23–24; James 5:16',
    prompt: 'What would an unqualified apology, repair, or honest accountability look like?',
    lens: [
      'Think of a recent conflict. Write down your part only, without anyone else’s.',
      'Serve the person you last argued with, quietly, without bringing up the conflict.',
      'Accountability is a burden meant to be shared. Who could ask you the hard questions?',
      'The next time you are corrected, listen fully before saying anything.',
      'Which cherished habit do you protect from anyone’s questions?',
      'Offer one apology today with no “but” attached, if it’s safe and appropriate.',
      'Choose one rhythm of honesty, like a weekly check-in with another man, where you share real things.'
    ]
  },
  {
    key: 'dependence', title: 'Dependence & Discernment', verse: 'John 15:4–5; Proverbs 3:5–6',
    prompt: 'Where do you need to replace control or religious activity with prayerful dependence and wise action?',
    lens: [
      'Name one decision you’ve been making on your own competence without bringing it to God.',
      'Serve today in a way that doesn’t depend on your skills, and notice what that feels like.',
      'Where are you trying to control an outcome that isn’t yours to carry? Hand it to God in prayer.',
      'Before your next important decision, pause to pray and ask one wise person for counsel.',
      'Have you used spiritual language to approve something you had already decided? Look at it honestly.',
      'If activity has taken the place of love and obedience, confess it simply. Peter’s restoration started with love.',
      'Choose one daily habit of abiding, like five minutes in Scripture and prayer before your phone.'
    ]
  }
];

export const AREA_KEYS = AREAS.map(a => a.key);
export const areaByKey = (k) => AREAS.find(a => a.key === k) || null;

// The 7-day spine from the facilitator guide.
export const DAYS = [
  { theme: 'Notice one overlooked responsibility', ref: 'James 1:22',
    body: 'James warns that hearing the Word without doing it is self-deception. Most of us don’t lack information; we lack follow-through on what we already know.',
    step: 'Write down one responsibility you’ve been overlooking. You don’t have to fix it today, just name it.' },
  { theme: 'Serve without seeking applause', ref: 'Matthew 6:1–4',
    body: 'Jesus tells us to give in secret, and the Father who sees in secret will reward. Serving unseen trains the heart to want God’s approval more than people’s.',
    step: 'Do one appropriate act of service today that no one will notice.' },
  { theme: 'Name a burden and seek wise support', ref: 'Galatians 6:2–5',
    body: 'Paul tells us to carry each other’s burdens and also to carry our own load. Strength isn’t refusing help; it’s knowing which weight is yours and asking for help with the rest.',
    step: 'Name one burden you’re carrying and tell one trusted person about it.' },
  { theme: 'Practice courage with discernment', ref: 'Jeremiah 38:7–13',
    body: 'Ebed-Melech went to the king about Jeremiah’s unjust treatment, then pulled him from the cistern with old rags so the ropes wouldn’t hurt him. His courage was bold and careful at the same time.',
    step: 'Take one courageous step that is also wise. Think about the timing and the person, then act.' },
  { theme: 'Identify a desire competing with obedience', ref: 'Mark 10:17–22',
    body: 'The rich man kept the commandments, but one thing held his heart. Jesus looked at him and loved him, then named it. He named it out of love, not to shame him.',
    step: 'Ask God to show you one desire competing with your obedience, and write it down.' },
  { theme: 'Practice confession and restoration', ref: 'John 21:15–19',
    body: 'After Peter denied Him three times, Jesus restored him with three questions about love and a renewed calling. Failure was not the end of Peter’s story, and it isn’t the end of yours.',
    step: 'Confess one thing to God plainly. If it’s safe and wise, take one step toward repair with a person.' },
  { theme: 'Review, pray, and choose one sustainable habit', ref: 'John 15:4–5',
    body: 'Jesus says to remain in Him, because apart from Him we can do nothing. The goal isn’t to catch every moment by trying harder. It’s to stay connected to Him so faithful responses grow naturally.',
    step: 'Look back over the week. Pray about what you noticed, and choose one small habit you can keep.' }
];

export const TOTAL_DAYS = DAYS.length;

const bibleLink = (ref) =>
  `https://www.biblegateway.com/passage/?search=${encodeURIComponent(ref.replace(/–/g, '-'))}&version=NIV`;

const p = (html, extra = '') => `<p style="margin:0 0 14px;line-height:1.6;${extra}">${html}</p>`;
const btn = (href, text) =>
  `<p style="margin:22px 0;"><a href="${escapeHtml(href)}" style="display:inline-block;background:${BROWN};color:#f4f1ee;padding:12px 22px;border-radius:6px;text-decoration:none;font-weight:700;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(text)}</a></p>`;

function planFooter(unsubscribeUrl, day) {
  const where = day ? `Day ${day} of ${TOTAL_DAYS} of the plan` : 'Your 7-day plan';
  return {
    html: `${where} you asked for at thewrkshop.com. Your answers were never stored; we keep only your email and focus area to send the plan.<br>
<a href="${escapeHtml(unsubscribeUrl)}" style="color:${MUTED};">Stop the 7-day plan</a> · <a href="${PAGE_URL}" style="color:${MUTED};">Take the reflection again</a><br>— TheWrkShop`,
    text: `${where} you asked for at thewrkshop.com. Your answers were never stored.\nStop the 7-day plan: ${unsubscribeUrl}\n— TheWrkShop`
  };
}

function hello(firstName) {
  const n = String(firstName || '').trim();
  return n ? `${escapeHtml(n)}, ` : '';
}

/**
 * Results email, sent right away.
 * scores: { [areaKey]: number 5–25 }, focusKey: area to work on, strengthKey: lowest area or null.
 */
export function resultsEmail({ firstName, scores, focusKey, strengthKey, nextStep, unsubscribeUrl }) {
  const focus = areaByKey(focusKey);
  const strength = strengthKey ? areaByKey(strengthKey) : null;
  const ranked = AREAS.map((a, i) => ({ ...a, score: scores[a.key], i }))
    .sort((a, b) => b.score - a.score || a.i - b.i);

  const rows = ranked.map(a => {
    const pct = Math.round((a.score - 5) / 20 * 100);
    const color = a.key === focusKey ? EMBER : '#9a8f84';
    return `<tr><td style="padding:6px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#2b2b2b;">${escapeHtml(a.title)}</td>
<td style="padding:6px 0 6px 10px;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${MUTED};text-align:right;white-space:nowrap;">${a.score}/25</td></tr>
<tr><td colspan="2" style="padding:0 0 8px;"><div style="height:8px;background:#ece5dc;"><div style="height:8px;width:${pct}%;background:${color};"></div></div></td></tr>`;
  }).join('');

  const nextStepHtml = String(nextStep || '').trim()
    ? `<p style="margin:18px 0 6px;font-weight:700;color:${BROWN};">The next step you wrote</p>
<blockquote style="margin:0 0 14px;padding:8px 14px;border-left:4px solid ${BROWN};background:#f4f1ee;color:${BROWN};">${escapeHtml(String(nextStep).trim()).replace(/\n/g, '<br>')}</blockquote>`
    : '';

  const strengthHtml = strength
    ? p(`<strong>Where you’re steady:</strong> ${escapeHtml(strength.title)}. You reported these obstacles least often. Thank God for that, and consider how this steadiness could help another man.`)
    : '';

  const bodyHtml = `
${p(`${hello(firstName)}here are your results. Higher scores mean you reported these obstacles more often. They describe patterns you noticed, not a diagnosis or a measure of your worth.`)}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:6px 0 18px;">${rows}</table>
<div style="background:#2e2923;color:#e8e0d4;padding:18px 20px;margin:0 0 18px;border-radius:8px;">
  <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#d6ad61;">Your focus this week</p>
  <p style="margin:0 0 8px;font-size:20px;font-weight:700;color:#fafaf8;">${escapeHtml(focus.title)}</p>
  <p style="margin:0 0 8px;line-height:1.6;">${escapeHtml(focus.prompt)}</p>
  <p style="margin:0;line-height:1.6;"><strong style="color:#fafaf8;">Scripture to study:</strong> <a href="${bibleLink(focus.verse.split(';')[0])}" style="color:#d6ad61;">${escapeHtml(focus.verse)}</a></p>
</div>
${strengthHtml}
${nextStepHtml}
${p(`<strong>Reflect:</strong> What happened? What did I interpret? What desire or fear was active? What would wise, loving faithfulness require?`)}
${p(`<strong>Your 7-day plan starts tomorrow morning.</strong> Each day brings one short reading, one question for ${escapeHtml(focus.title)}, and one small step. It takes about five minutes.`)}`;

  const foot = planFooter(unsubscribeUrl, 0);
  const text = [
    `${firstName ? firstName + ', here' : 'Here'} are your results from "Are You Missing Your Moments?"`,
    'Higher scores mean you reported these obstacles more often. They describe patterns, not a diagnosis or your worth.',
    '',
    ...ranked.map(a => `- ${a.title}: ${a.score}/25`),
    '',
    `YOUR FOCUS THIS WEEK: ${focus.title}`,
    focus.prompt,
    `Scripture to study: ${focus.verse}`,
    strength ? `\nWhere you're steady: ${strength.title}. You reported these obstacles least often.` : '',
    String(nextStep || '').trim() ? `\nThe next step you wrote:\n${String(nextStep).trim()}` : '',
    '',
    'Reflect: What happened? What did I interpret? What desire or fear was active? What would wise, loving faithfulness require?',
    '',
    'Your 7-day plan starts tomorrow morning.',
    '',
    foot.text
  ].filter(l => l !== null).join('\n');

  return {
    subject: `Your results: start with ${focus.title}`,
    html: emailLayout({
      title: 'Are you missing your moments?',
      preheader: `Your focus this week: ${focus.title}. Your 7-day plan starts tomorrow.`,
      bodyHtml,
      footerHtml: foot.html
    }),
    text
  };
}

/** One day of the plan (day is 1–7). */
export function dayEmail({ day, focusKey, firstName, unsubscribeUrl }) {
  const d = DAYS[day - 1];
  const area = areaByKey(focusKey);
  const lens = area.lens[day - 1];
  const last = day === TOTAL_DAYS;

  const closing = last
    ? `${p(`That’s the week. Some men are known for chapters. Others are known for moments. God uses both, and He isn’t finished with you.`)}
${p(`If you want to keep going, The Daily brings one Scripture, one hard question and one step to your inbox every weekday morning.`)}
${btn(`${SITE_URL}/daily.html`, 'Get The Daily')}
${p(`Want other men to walk this out with you? <a href="${SITE_URL}/get-known.html" style="color:${BROWN};">Join a group</a>.`, 'font-size:15px;')}`
    : '';

  const bodyHtml = `
<p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:${EMBER};">Day ${day} of ${TOTAL_DAYS} · Focus: ${escapeHtml(area.title)}</p>
${p(`<strong>Read:</strong> <a href="${bibleLink(d.ref)}" style="color:${BROWN};">${escapeHtml(d.ref)}</a>`)}
${p(`${day === 1 ? hello(firstName) : ''}${escapeHtml(d.body)}`)}
<div style="border-left:4px solid ${EMBER};padding:4px 0 4px 14px;margin:0 0 16px;">
  <p style="margin:0 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:${MUTED};">For ${escapeHtml(area.title)}</p>
  <p style="margin:0;line-height:1.6;">${escapeHtml(lens)}</p>
</div>
${p(`<strong>Today’s step:</strong> ${escapeHtml(d.step)}`)}
${last ? p(`Look back at the next step you wrote in your results email. Did you take it? If not, there’s grace for that. Choose a time and try again.`) : ''}
${closing}`;

  const foot = planFooter(unsubscribeUrl, day);
  const text = [
    `DAY ${day} OF ${TOTAL_DAYS}: ${d.theme}`,
    `Focus: ${area.title}`,
    '',
    `Read: ${d.ref}`,
    d.body,
    '',
    `For ${area.title}: ${lens}`,
    '',
    `Today's step: ${d.step}`,
    last ? '\nLook back at the next step you wrote in your results email. Did you take it? If not, choose a time and try again.\n\nKeep going with The Daily: ' + SITE_URL + '/daily.html' : '',
    '',
    foot.text
  ].join('\n');

  return {
    subject: `Day ${day}: ${d.theme}`,
    html: emailLayout({ title: d.theme, preheader: lens, bodyHtml, footerHtml: foot.html }),
    text
  };
}

/** Validate what the browser sends. Returns { scores, focusKey, strengthKey } or null. */
export function cleanScores(input, focusInput) {
  if (!input || typeof input !== 'object') return null;
  const scores = {};
  for (const k of AREA_KEYS) {
    const v = Number(input[k]);
    if (!Number.isInteger(v) || v < 5 || v > 25) return null;
    scores[k] = v;
  }
  const top = Math.max(...AREA_KEYS.map(k => scores[k]));
  const low = Math.min(...AREA_KEYS.map(k => scores[k]));
  // The man may pick among tied top areas; otherwise use the highest.
  const focusKey = (AREA_KEYS.includes(focusInput) && scores[focusInput] === top)
    ? focusInput
    : AREA_KEYS.find(k => scores[k] === top);
  const lows = AREA_KEYS.filter(k => scores[k] === low);
  const strengthKey = (low < top && lows.length === 1) ? lows[0] : null;
  return { scores, focusKey, strengthKey };
}
