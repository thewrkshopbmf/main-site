// Make TheWrkShop's shareable infographics (1080x1350 PNGs) in assets/infographics/.
//
// Usage:  node scripts/infographics/make-infographics.mjs
// Needs Playwright with Chromium, plus the Lora and Inter fonts (paths below).
// Not part of the Netlify build: run it locally after editing INFOGRAPHICS, then commit the PNGs.
// The list of infographics (titles, sources, alt text) is exported for the /infographics/ page.
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT = path.join(ROOT, 'assets', 'infographics');
const LORA = '/usr/share/fonts/truetype/google-fonts/Lora-Variable.ttf';
const INTER = '/usr/share/fonts/opentype/inter/Inter-Regular.otf';
const INTER_SEMI = '/usr/share/fonts/opentype/inter/Inter-SemiBold.otf';
const INTER_BOLD = '/usr/share/fonts/opentype/inter/Inter-Bold.otf';
const LOGO = path.join(ROOT, 'assets', 'images', 'thewrkshop-logo-transparent-trimmed.png');

export const INFOGRAPHICS = [
  {
    slug: 'upstream-formation-framework',
    eyebrow: 'A TheWrkShop framework',
    title: 'The Upstream Formation Framework',
    subtitle: 'The battle starts before the behavior.',
    kind: 'flow',
    steps: [
      { label: 'Trigger', note: 'What happened?' },
      { label: 'Interpretation', note: 'What meaning did I assign?', up: true },
      { label: 'Agreement', note: 'What did I accept as true?', up: true },
      { label: 'Response', note: 'What did I choose to do?' },
      { label: 'Formation', note: 'What is repetition shaping?' }
    ],
    upstreamLabel: 'Upstream: where the battle starts',
    loop: 'Repeated responses shape what we see next time.',
    footnote: 'A proposed teaching model, not a literal neurological sequence or a direct quotation of Scripture.',
    source: { text: 'thewrkshop.com/upstream', href: 'https://thewrkshop.com/upstream/' },
    description: 'Five questions for catching the battle upstream, before it becomes behavior.',
    alt: 'The Upstream Formation Framework: Trigger (What happened?), Interpretation (What meaning did I assign?), Agreement (What did I accept as true?), Response (What did I choose to do?), Formation (What is repetition shaping?).'
  },
  {
    slug: 'information-funnel',
    eyebrow: 'Leadership & Culture',
    title: 'The Information Funnel',
    subtitle: 'When truth becomes expensive, information becomes distorted.',
    kind: 'flow',
    compact: true,
    steps: [
      { label: 'Leader reacts badly to truth' },
      { label: 'People notice' },
      { label: 'Bad news gets softened' },
      { label: 'Problems get delayed' },
      { label: 'Reports become polished' },
      { label: 'Leader receives distorted reality' },
      { label: 'Decisions are made from distorted reality' },
      { label: 'Problems increase' },
      { label: '“Why didn’t anybody tell me?”' }
    ],
    caption: 'They may have learned not to.',
    source: { text: 'From “Why Leaders Stop Hearing Bad News” · 1 Kings 22:8', href: 'https://thewrkshop.com/leadership/why-leaders-stop-hearing-bad-news/' },
    description: 'How a leader’s reaction to bad news slowly cuts them off from reality.',
    alt: 'The Information Funnel: leader reacts badly to truth, people notice, bad news gets softened, problems get delayed, reports become polished, leader receives distorted reality, decisions are made from distorted reality, problems increase, “Why didn’t anybody tell me?” They may have learned not to.'
  },
  {
    slug: 'survival-system',
    eyebrow: 'Leadership & Culture',
    title: 'Every Leader Trains the Room',
    subtitle: 'Nobody held a training seminar. The room learned anyway.',
    kind: 'table',
    head: ['If the leader…', 'People learn to…'],
    rows: [
      ['is unpredictable', 'read the leader’s mood'],
      ['punishes bad news', 'hide problems'],
      ['needs praise', 'flatter'],
      ['cannot be questioned', 'agree publicly'],
      ['plays favorites', 'build proximity'],
      ['takes credit', 'protect their work'],
      ['blames others', 'document everything'],
      ['humiliates weakness', 'never admit weakness']
    ],
    caption: 'Healthy leadership makes truth easier to tell.',
    source: { text: 'From “When the Leader Changes the Room” · Mark 10:42–45', href: 'https://thewrkshop.com/leadership/when-the-leader-changes-the-room/' },
    description: 'What people learn to do around a leader, without anyone saying a word.',
    alt: 'Every Leader Trains the Room. If the leader is unpredictable, people learn to read the leader’s mood. Punishes bad news: hide problems. Needs praise: flatter. Cannot be questioned: agree publicly. Plays favorites: build proximity. Takes credit: protect their work. Blames others: document everything. Humiliates weakness: never admit weakness.'
  },
  {
    slug: 'whatever-you-celebrate',
    eyebrow: 'Leadership & Culture',
    title: 'Whatever You Celebrate, They Will Copy',
    subtitle: 'Your rewards reveal the culture you are actually building.',
    kind: 'arenas',
    rows: [
      { arena: 'At work', says: '“We collaborate here.”', rewards: 'The bonus goes to the person who hoarded information and hit the number alone.', learns: 'Protect your turf.' },
      { arena: 'At home', says: '“Character matters more than grades.”', rewards: 'The only celebration is for the report card and the trophy.', learns: 'Performance earns attention.' },
      { arena: 'On the field', says: '“Nobody is bigger than the team.”', rewards: 'The star skips practice and still starts.', learns: 'Talent buys exceptions.' },
      { arena: 'In the church', says: '“Every member is a minister.”', rewards: 'Only the people on the stage get thanked.', learns: 'Visibility is what counts.' }
    ],
    source: { text: 'From “What Leaders Reward Shapes Culture” · 1 Samuel 16:7', href: 'https://thewrkshop.com/leadership/what-leaders-reward/' },
    description: 'Four arenas, one lesson: people copy what leaders reward, not what they say.',
    alt: 'Whatever You Celebrate, They Will Copy. At work: we say we collaborate, reward the person who hoarded information, and people learn to protect their turf. At home: we say character matters more than grades, celebrate only the report card, and kids learn performance earns attention. On the field: nobody is bigger than the team, the star skips practice and still starts, and the roster learns talent buys exceptions. In the church: every member is a minister, only the people on stage get thanked, and volunteers learn visibility is what counts.'
  },
  {
    slug: 'when-disagreement-becomes-danger',
    eyebrow: 'The battle before the battle',
    title: 'When Disagreement Becomes Danger',
    subtitle: 'The argument may have started several moments earlier.',
    kind: 'flow',
    steps: [
      { label: 'Disagreement' },
      { label: 'Threat' },
      { label: 'Interpretation' },
      { label: 'Defensiveness' },
      { label: 'Counterargument' },
      { label: 'Escalation' }
    ],
    caption: 'The visible conflict came later.',
    source: { text: 'From “What Happens When Somebody Disagrees?” · James 1:19–20', href: 'https://thewrkshop.com/leadership/when-somebody-disagrees/' },
    description: 'How a disagreement turns into a fight before anyone raises their voice.',
    alt: 'When Disagreement Becomes Danger: disagreement, threat, interpretation, defensiveness, counterargument, escalation. The visible conflict came later.'
  },
  {
    slug: 'im-good',
    eyebrow: 'The battle before the words',
    title: 'What’s Behind “I’m Good”',
    subtitle: 'Long before isolation becomes visible.',
    kind: 'flow',
    steps: [
      { label: 'Need appears' },
      { label: 'Shame interprets it', note: '“If they know, they’ll think less of me.”' },
      { label: 'Pride protects image' },
      { label: 'Fear predicts rejection' },
      { label: 'Silence feels safer' },
      { label: '“I’m good.”', note: 'What he says out loud' }
    ],
    caption: 'Carry each other’s burdens. Galatians 6:2',
    source: { text: 'From “When a Man Says I Need Help” · Galatians 6:2', href: 'https://thewrkshop.com/daily/Galatians-6-2_when-a-man-says-i-need-help_2026-10-07.html' },
    description: 'The battle a man fights before he answers “How are you really doing?”',
    alt: 'What’s Behind “I’m Good”: need appears, shame interprets it (“If they know, they’ll think less of me”), pride protects image, fear predicts rejection, silence feels safer, “I’m good.”'
  }
];

const esc = (s = '') => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function shade(i, n) {
  if (i === n - 1) return 'background:#3e2c23;color:#f4f1ee;border-color:#3e2c23;';
  const t = n <= 2 ? 0 : i / (n - 2);
  const c = [255, 255, 255].map((f, k) => Math.round(f + ([234, 217, 200][k] - f) * t));
  return `background:rgb(${c.join(',')});color:#3e2c23;border-color:rgba(62,44,35,.2);`;
}

function body(g) {
  if (g.kind === 'flow') {
    const n = g.steps.length;
    const box = (s, i) => `<div class="step${g.compact ? ' compact' : ''}" style="${s.up ? 'background:#efe4d8;color:#3e2c23;border-color:rgba(62,44,35,.2);' : shade(i, n)}"><b>${esc(s.label)}</b>${s.note ? `<span>${esc(s.note)}</span>` : ''}</div>`;
    let html = '';
    let i = 0;
    while (i < n) {
      if (g.steps[i].up) {
        let j = i; const group = [];
        while (j < n && g.steps[j].up) { group.push(box(g.steps[j], j)); j++; }
        html += (i ? '<div class="arrow">↓</div>' : '') + `<div class="upstream"><div class="up-label">${esc(g.upstreamLabel || 'Upstream')}</div>${group.join('<div class="arrow">↓</div>')}</div>`;
        i = j;
      } else {
        html += (i ? '<div class="arrow">↓</div>' : '') + box(g.steps[i], i);
        i++;
      }
    }
    return `<div class="flow">${html}</div>`
      + (g.loop ? `<div class="loop">↻ ${esc(g.loop)}</div>` : '')
      + (g.caption ? `<div class="caption">${esc(g.caption)}</div>` : '');
  }
  if (g.kind === 'table') {
    return `<table class="tbl"><thead><tr><th>${esc(g.head[0])}</th><th></th><th>${esc(g.head[1])}</th></tr></thead><tbody>`
      + g.rows.map(r => `<tr><td>${esc(r[0])}</td><td class="to">→</td><td><b>${esc(r[1])}</b></td></tr>`).join('')
      + `</tbody></table>` + (g.caption ? `<div class="caption strong">${esc(g.caption)}</div>` : '');
  }
  if (g.kind === 'arenas') {
    return `<div class="arenas">` + g.rows.map(r => `<div class="arena"><div class="a-name">${esc(r.arena)}</div>`
      + `<div class="a-row"><span class="a-k">Says</span><span>${esc(r.says)}</span></div>`
      + `<div class="a-row"><span class="a-k">Rewards</span><span>${esc(r.rewards)}</span></div>`
      + `<div class="a-row learn"><span class="a-k">They learn</span><span><b>${esc(r.learns)}</b></span></div></div>`).join('') + `</div>`;
  }
  return '';
}

function page(g, logoData) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face { font-family: Lora; src: url('file://${LORA}'); font-weight: 400 700; }
  @font-face { font-family: Inter; src: url('file://${INTER}'); font-weight: 400; }
  @font-face { font-family: Inter; src: url('file://${INTER_SEMI}'); font-weight: 600; }
  @font-face { font-family: Inter; src: url('file://${INTER_BOLD}'); font-weight: 700; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1080px; height: 1350px; }
  body { background: #f4f1ee; font-family: Inter, sans-serif; color: #2b2b2b; display: flex; flex-direction: column; }
  header { background: #3e2c23; color: #f4f1ee; padding: 56px 72px 44px; position: relative; }
  .eyebrow { font-size: 22px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #c9aa8c; }
  h1 { font-family: Lora, serif; font-weight: 700; font-size: 62px; line-height: 1.08; margin-top: 14px; max-width: 820px; }
  .sub { font-family: Lora, serif; font-style: italic; font-size: 30px; line-height: 1.3; margin-top: 16px; color: #e8dccf; max-width: 840px; }
  .logo { position: absolute; right: 64px; top: 52px; width: 120px; }
  main { flex: 1; padding: 34px 110px 22px; display: flex; flex-direction: column; justify-content: center; }
  .flow { display: flex; flex-direction: column; align-items: stretch; }
  .step { border: 2px solid; border-radius: 16px; padding: 15px 28px; text-align: center; }
  .step b { display: block; font-size: 30px; font-weight: 700; }
  .step span { display: block; font-size: 22px; font-style: italic; margin-top: 2px; opacity: .85; }
  .step.compact { padding: 9px 24px; } .step.compact b { font-size: 26px; }
  .arrow { text-align: center; color: #c9aa8c; font-size: 26px; line-height: 1; margin: 5px 0; }
  .upstream { border: 3px dashed #c9aa8c; border-radius: 22px; padding: 14px 16px 18px; }
  .up-label { text-align: center; font-size: 19px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #8a6a52; margin-bottom: 10px; }
  .loop { text-align: center; margin-top: 16px; font-size: 26px; font-weight: 600; color: #6b4a36; }
  .caption { text-align: center; margin-top: 16px; font-family: Lora, serif; font-style: italic; font-size: 28px; color: #6b4a36; }
  .caption.strong { font-style: normal; font-weight: 700; color: #3e2c23; margin-top: 28px; }
  .tbl { width: 100%; border-collapse: collapse; font-size: 28px; }
  .tbl th { text-align: left; font-size: 22px; letter-spacing: .08em; text-transform: uppercase; color: #8a6a52; padding: 0 0 14px; }
  .tbl td { padding: 14px 0; border-top: 2px solid rgba(62,44,35,.12); color: #3e2c23; vertical-align: middle; }
  .tbl td.to { color: #c9aa8c; text-align: center; width: 70px; }
  .arenas { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; }
  .arena { background: #fff; border: 2px solid rgba(62,44,35,.14); border-radius: 18px; padding: 22px 24px; }
  .a-name { font-family: Lora, serif; font-weight: 700; font-size: 30px; color: #3e2c23; margin-bottom: 10px; }
  .a-row { display: grid; grid-template-columns: 112px 1fr; gap: 10px; font-size: 21px; line-height: 1.35; margin-top: 8px; color: #3e2c23; }
  .a-k { font-size: 15px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #8a6a52; padding-top: 4px; }
  .a-row.learn { background: #3e2c23; color: #f4f1ee; border-radius: 10px; padding: 10px 12px; margin-top: 12px; }
  .a-row.learn .a-k { color: #c9aa8c; }
  .foot { padding: 0 110px 26px; text-align: center; font-size: 18px; color: #6b5b53; font-style: italic; }
  footer { background: #3e2c23; color: #f4f1ee; padding: 26px 72px; display: flex; justify-content: space-between; align-items: center; font-size: 22px; }
  footer b { color: #c9aa8c; font-weight: 700; letter-spacing: .02em; }
  </style></head><body>
  <header><div class="eyebrow">${esc(g.eyebrow)}</div><h1>${esc(g.title)}</h1>${g.subtitle ? `<div class="sub">${esc(g.subtitle)}</div>` : ''}<img class="logo" src="${logoData}"></header>
  <main>${body(g)}</main>
  ${g.footnote ? `<div class="foot">${esc(g.footnote)}</div>` : ''}
  <footer><span>${esc(g.source.text)}</span><b>thewrkshop.com</b></footer>
  </body></html>`;
}

async function main() {
  const { chromium } = await import('playwright');
  await fs.mkdir(OUT, { recursive: true });
  const logoData = 'data:image/png;base64,' + (await fs.readFile(LOGO)).toString('base64');
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const p = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const g of INFOGRAPHICS) {
    await p.setContent(page(g, logoData), { waitUntil: 'load' });
    await p.evaluate(() => document.fonts.ready);
    const overflow = await p.evaluate(() => document.body.scrollHeight > 1350);
    const out = path.join(OUT, `${g.slug}.png`);
    await p.screenshot({ path: out, clip: { x: 0, y: 0, width: 1080, height: 1350 } });
    console.log(`wrote assets/infographics/${g.slug}.png${overflow ? '  (WARNING: content taller than 1350px)' : ''}`);
  }
  await browser.close();
}

if (import.meta.url === `file://${process.argv[1]}`) main();
