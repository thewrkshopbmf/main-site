// "flow" block: a progression drawn as a visual (step → step → step) in dailies.
// Pure functions, shared by scripts/build-daily.js (pages + data), the Daily email and the RSS feed.
// daily.html (the "today" page) carries a browser copy of renderFlowHtml; keep the two in sync.
//
// In content/daily/*.json:
// {
//   "type": "flow",
//   "title": "Watch the progression",            (optional, small label above)
//   "steps": [
//     "Disagreement.",                            (a step can be plain text…)
//     { "label": "Shame interprets it.", "note": "“If they know, they’ll think less of me.”" }  (…or label + note)
//   ],
//   "loop": "Repeated responses shape what we see next time",   (optional, shown with ↻)
//   "caption": "The visible conflict came later.",             (optional, below)
//   "link": { "href": "/upstream/", "text": "See the Upstream Formation Framework" }   (optional)
// }

const BROWN = '#3e2c23';
const CREAM = '#f4f1ee';
const TAN = '#c9aa8c';

const clean = (v) => String(v ?? '').replace(/\s+/g, ' ').trim();

export function normalizeFlowBlock(block) {
  if (!block || typeof block !== 'object') return null;
  const raw = Array.isArray(block.steps) ? block.steps : (Array.isArray(block.items) ? block.items : []);
  const steps = raw
    .map(s => (typeof s === 'string' ? { label: clean(s) } : { label: clean(s?.label), note: clean(s?.note) }))
    .filter(s => s.label && s.label !== '↓' && s.label !== '→')
    .map(s => (s.note ? s : { label: s.label }));
  if (steps.length < 2) return null;
  const out = { type: 'flow', steps };
  for (const k of ['title', 'loop', 'caption']) if (clean(block[k])) out[k] = clean(block[k]);
  const href = clean(block.link?.href);
  if (href && (href.startsWith('/') || href.startsWith('https://'))) {
    out.link = { href, text: clean(block.link?.text) || 'Learn more' };
  }
  return out;
}

// For Listen (text-to-speech), teasers and plain-text email.
export function flowPlainText(block, { arrows = false } = {}) {
  if (!block?.steps) return '';
  const steps = block.steps.map(s => (s.note ? `${s.label} ${s.note}` : s.label));
  const parts = [];
  if (block.title) parts.push(block.title);
  parts.push(arrows ? steps.join('\n  ↓\n') : steps.join(' '));
  if (block.loop) parts.push(`${arrows ? '↻ ' : ''}${block.loop}`);
  if (block.caption) parts.push(block.caption);
  return parts.join(arrows ? '\n' : ' ');
}

// Light cream at the top, deepening step by step, ending in solid brown.
function shade(i, n) {
  if (i === n - 1) return { bg: BROWN, fg: CREAM, note: '#e8dccf', border: BROWN };
  const t = n <= 2 ? 0 : i / (n - 2);
  const from = [255, 255, 255], to = [234, 217, 200];
  const c = from.map((f, k) => Math.round(f + (to[k] - f) * t));
  return { bg: `rgb(${c.join(',')})`, fg: BROWN, note: '#6b5b53', border: 'rgba(62,44,35,.18)' };
}

// Website version (classes styled by FLOW_CSS).
export function renderFlowHtml(block, escapeHtml) {
  const n = block.steps.length;
  const steps = block.steps.map((s, i) => {
    const c = shade(i, n);
    return `<li class="daily-flow-step"><span class="daily-flow-box" style="background:${c.bg};color:${c.fg};border-color:${c.border};"><span class="daily-flow-label">${escapeHtml(s.label)}</span>${s.note ? `<span class="daily-flow-note" style="color:${c.note};">${escapeHtml(s.note)}</span>` : ''}</span></li>`;
  }).join('');
  const label = escapeHtml(block.title || 'Progression');
  return `<figure class="daily-flow" role="group" aria-label="${label}">`
    + (block.title ? `<div class="daily-flow-title">${escapeHtml(block.title)}</div>` : '')
    + `<ol class="daily-flow-steps">${steps}</ol>`
    + (block.loop ? `<p class="daily-flow-loop">↻ ${escapeHtml(block.loop)}</p>` : '')
    + (block.caption ? `<figcaption class="daily-flow-caption">${escapeHtml(block.caption)}</figcaption>` : '')
    + (block.link ? `<p class="daily-flow-link"><a href="${escapeHtml(block.link.href)}">${escapeHtml(block.link.text)} →</a></p>` : '')
    + `</figure>`;
}

export const FLOW_CSS = `
    .daily-flow { margin: 1.25rem auto 1.4rem; max-width: 440px; text-align: center; }
    .daily-flow-title { font-size: .78rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #8a6a52; margin-bottom: .6rem; }
    .daily-flow-steps { list-style: none; margin: 0; padding: 0; }
    .daily-flow-step { margin: 0; padding: 0; }
    .daily-flow-step + .daily-flow-step::before { content: "↓"; display: block; color: ${TAN}; font-size: 1.15rem; line-height: 1; margin: .3rem 0; }
    .daily-flow-box { display: block; border: 1px solid; border-radius: 10px; padding: .6rem .9rem; }
    .daily-flow-label { display: block; font-weight: 700; line-height: 1.35; }
    .daily-flow-note { display: block; font-size: .92rem; font-style: italic; line-height: 1.4; margin-top: .2rem; }
    .daily-flow-loop { margin: .7rem 0 0; color: #6b4a36; font-weight: 600; font-size: .95rem; }
    .daily-flow-caption { margin: .6rem 0 0; color: #6b5b53; font-style: italic; font-size: .95rem; }
    .daily-flow-link { margin: .7rem 0 0; }
    .daily-flow-link a { color: #3e2c23; font-weight: 700; }
`;

// Email version: tables and inline styles only.
export function renderFlowEmailHtml(block, escapeHtml) {
  const n = block.steps.length;
  const rows = block.steps.map((s, i) => {
    const c = shade(i, n);
    const arrow = i ? `<tr><td align="center" style="padding:4px 0;color:${TAN};font-size:18px;line-height:1;">&darr;</td></tr>` : '';
    return `${arrow}<tr><td align="center" style="background:${c.bg};color:${c.fg};border:1px solid ${c.border};border-radius:8px;padding:10px 14px;font-weight:700;line-height:1.35;">${escapeHtml(s.label)}${s.note ? `<br><span style="font-weight:400;font-style:italic;font-size:14px;color:${c.note};">${escapeHtml(s.note)}</span>` : ''}</td></tr>`;
  }).join('');
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:420px;margin:8px auto 16px;border-collapse:separate;">`
    + (block.title ? `<tr><td align="center" style="padding-bottom:8px;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#8a6a52;">${escapeHtml(block.title)}</td></tr>` : '')
    + rows
    + (block.loop ? `<tr><td align="center" style="padding-top:10px;color:#6b4a36;font-weight:700;">&#8635; ${escapeHtml(block.loop)}</td></tr>` : '')
    + (block.caption ? `<tr><td align="center" style="padding-top:8px;color:#6b5b53;font-style:italic;">${escapeHtml(block.caption)}</td></tr>` : '')
    + (block.link ? `<tr><td align="center" style="padding-top:10px;"><a href="${escapeHtml(block.link.href.startsWith('/') ? 'https://thewrkshop.com' + block.link.href : block.link.href)}" style="color:${BROWN};font-weight:700;">${escapeHtml(block.link.text)} &rarr;</a></td></tr>` : '')
    + `</table>`;
}
