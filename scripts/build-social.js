// scripts/build-social.js
// The daily social pack: for each recent Daily, ready-to-post copy for every
// platform plus the images that already exist for it, on one page:
//   /admin/social.html   (kept out of search by the /admin/* noindex header)
// Every link carries UTM tags so Google Analytics shows which platform sent visitors.
// Runs after build:daily (needs data/daily-archive.json). Only released Dailies appear.
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { todayCentralISO } from './shared/render-content.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://thewrkshop.com';
const HOW_MANY = 14;

const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clean = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();

function blocksText(blocks = []) {
  const out = [];
  for (const b of blocks) {
    if (b.text) out.push(clean(b.text));
    if (Array.isArray(b.items)) out.push(...b.items.map(clean));
  }
  return out.filter(Boolean);
}

function pick(entry) {
  const sections = entry.sections || [];
  const gems = [];
  for (const s of sections) {
    if (/gem/i.test(s.key || s.label || '')) {
      for (const b of s.blocks || []) {
        if (b.text) gems.push(clean(b.text));
        if (Array.isArray(b.items)) gems.push(b.items.map(clean).join(' '));
      }
    }
  }
  const lines = sections.flatMap((s) => blocksText(s.blocks));
  const sentence = (l) => (l === l.toUpperCase() && /[A-Z]/.test(l) ? l.charAt(0) + l.slice(1).toLowerCase() : l);
  const question = sentence(lines.find((l) => /\?$/.test(l) && l.length > 25 && l.length < 160) || '');
  // Opening: the first few full sentences (skip fragments like "Scripture honors:" or one-word list items).
  const opening = blocksText((sections[0] || {}).blocks)
    .filter((l) => l.length >= 28 && /^[“"A-Z]/.test(l) && /[.!?…”]$/.test(l))
    .map(sentence)
    .slice(0, 4);
  return { gems: gems.filter((g) => g.length < 220), question, opening };
}

function utm(url, source) {
  return `${url}${url.includes('?') ? '&' : '?'}utm_source=${source}&utm_medium=social&utm_campaign=daily`;
}

function hashtags(entry) {
  const base = entry.category === 'Leadership & Culture'
    ? ['#Leadership', '#TeamCulture', '#FaithAtWork']
    : ['#ChristianMen', '#Discipleship', '#DailyDevotional'];
  const topical = (entry.keywords || [])
    .filter((k) => !/\d/.test(k) && k.split(' ').length <= 3)
    .slice(0, 2)
    .map((k) => '#' + k.replace(/[^A-Za-z ]/g, '').split(' ').map((w) => w[0].toUpperCase() + w.slice(1)).join(''));
  return [...new Set([...base, ...topical])].join(' ');
}

function pack(entry, url, images) {
  const title = clean(entry.headline || entry.subtitle || entry.title);
  const sub = clean(entry.headline ? entry.headline_sub : '');
  const tagline = clean(entry.tagline) || (pick(entry).gems[0] || '');
  const { gems, question, opening } = pick(entry);
  const gem = gems.find((g) => g !== tagline) || tagline;
  const sc = entry.verse_ref ? { ref: entry.verse_ref, text: entry.verse_text } : (entry.scriptures || [])[0];
  const verse = sc && sc.ref ? `${sc.ref}: “${clean(sc.text).replace(/^[“"]|[”"]$/g, '')}”` : '';
  const isLead = entry.category === 'Leadership & Culture';
  const ask = question || (isLead ? 'What is your leadership teaching the room right now?' : 'Where do you see this in your own life?');

  return [
    {
      platform: 'LinkedIn', note: 'Put the link in the first comment, not the post.',
      text: [tagline, '', ...opening.slice(0, 5), '', ask, '', isLead ? 'Full post: link in the first comment.' : 'Today’s Daily is in the first comment.', '', hashtags(entry)].join('\n'),
      extra: { label: 'First comment', text: `${title}: ${utm(url, 'linkedin')}` }
    },
    {
      platform: 'Facebook', note: 'Links work in Facebook posts. Also share into men’s ministry groups you belong to.',
      text: [title, '', tagline, verse ? `\n${verse}` : '', '', ask, '', `Read today’s Daily: ${utm(url, 'facebook')}`].join('\n').replace(/\n{3,}/g, '\n\n')
    },
    {
      platform: 'Instagram', note: 'Use the Hidden Gem image. Posts can’t carry links, so point to the link in your profile.',
      text: [tagline, '', gem !== tagline ? gem : '', verse, '', ask, '', 'Full Daily: link in bio.', '', hashtags(entry)].join('\n').replace(/\n{3,}/g, '\n\n')
    },
    {
      platform: 'X / Threads', note: 'Under 280 characters.',
      text: (() => {
        const link = utm(url, 'x');
        let t = `${tagline}\n\n${link}`;
        if (t.length > 280) t = `${tagline.slice(0, 280 - link.length - 4)}…\n\n${link}`;
        return t;
      })()
    },
    {
      platform: 'YouTube Shorts / Reels / TikTok', note: 'One 30–45 second vertical video works on all three. Say it in your own words.',
      text: [
        `TITLE: ${title}`.slice(0, 100),
        '',
        'SCRIPT',
        `Hook (0–3s): ${tagline}`,
        verse ? `Scripture (3–12s): ${verse}` : '',
        `Turn (12–30s): ${opening.slice(0, 2).join(' ')}`,
        `Question (30–40s): ${ask}`,
        'Close (40–45s): Today’s Daily is at TheWrkShop.com.',
        '',
        'DESCRIPTION',
        `${tagline} Read the full Daily: ${utm(url, 'youtube')}`,
        hashtags(entry)
      ].filter((l) => l !== undefined).join('\n').replace(/\n{3,}/g, '\n\n')
    },
    {
      platform: 'Substack Note', note: 'Short. Link to the Daily or your matching Substack essay.',
      text: `${tagline}\n\n${sub ? sub + ' ' : ''}${utm(url, 'substack')}`
    },
    {
      platform: 'Text message', note: 'For your text list: one line and the link.',
      text: `${title}. ${tagline} ${utm(url, 'sms')}`
    }
  ];
}

async function exists(rel) {
  try { await fs.access(path.join(ROOT, rel)); return true; } catch { return false; }
}

async function main() {
  const archive = JSON.parse(await fs.readFile(path.join(ROOT, 'data', 'daily-archive.json'), 'utf-8'));
  const today = todayCentralISO();
  const byDate = new Map();
  for (const f of await fs.readdir(path.join(ROOT, 'content', 'daily'))) {
    if (!f.endsWith('.json')) continue;
    const e = JSON.parse(await fs.readFile(path.join(ROOT, 'content', 'daily', f), 'utf-8'));
    if (e.date) byDate.set(e.date, e);
  }
  const recent = archive.filter((a) => a.date <= today && byDate.has(a.date))
    .sort((a, b) => b.date.localeCompare(a.date)).slice(0, HOW_MANY);

  const cards = [];
  for (const a of recent) {
    const e = byDate.get(a.date);
    const url = `${SITE}${a.href}`;
    const key = e.category === 'Leadership & Culture' && e.slug ? e.slug : e.date;
    const images = [];
    for (let i = 1; i <= 8; i++) {
      const rel = `assets/og/share/${key}/gem-${i}.jpg`;
      if (await exists(rel)) images.push({ src: `/${rel}`, label: `Hidden Gem ${i}` });
    }
    const chart = `assets/og/share/${key}/chart-1.jpg`;
    if (await exists(chart)) images.push({ src: `/${chart}`, label: 'Flow chart' });
    if (e.og_image && await exists(e.og_image.replace(/^\//, ''))) images.push({ src: e.og_image, label: 'Link card' });

    const items = pack(e, url, images);
    cards.push(`
  <section class="sp-day" id="d-${esc(a.date)}">
    <h2>${esc(a.date)} · ${esc(clean(e.headline || e.subtitle || e.title))}</h2>
    <p class="sp-link"><a href="${esc(a.href)}" target="_blank" rel="noopener">${esc(url)}</a></p>
    ${images.length ? `<div class="sp-imgs">${images.map((im) => `<figure><a href="${esc(im.src)}" download><img src="${esc(im.src)}" alt="${esc(im.label)}" loading="lazy" width="240"></a><figcaption>${esc(im.label)} · <a href="${esc(im.src)}" download>download</a></figcaption></figure>`).join('')}</div>`
      : '<p class="sp-note">No share images yet for this Daily. Use the Hidden Gem text on a Canva quote card.</p>'}
    ${items.map((it, i) => `
    <div class="sp-item">
      <div class="sp-head"><strong>${esc(it.platform)}</strong><button type="button" data-copy="c-${esc(a.date)}-${i}">Copy</button></div>
      <p class="sp-note">${esc(it.note)}</p>
      <textarea id="c-${esc(a.date)}-${i}" rows="${Math.min(14, it.text.split('\n').length + 1)}" readonly>${esc(it.text)}</textarea>
      ${it.extra ? `<div class="sp-head"><span>${esc(it.extra.label)}</span><button type="button" data-copy="c-${esc(a.date)}-${i}x">Copy</button></div>
      <textarea id="c-${esc(a.date)}-${i}x" rows="2" readonly>${esc(it.extra.text)}</textarea>` : ''}
    </div>`).join('')}
  </section>`);
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta name="robots" content="noindex, nofollow"/>
  <title>Social Pack | TheWrkShop</title>
  <style>
    body { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; background:#f4f1ee; color:#2b2b2b; margin:0; }
    header { background:#3e2c23; color:#f4f1ee; padding:1.25rem 1rem; }
    header h1 { margin:0 0 .25rem; font-size:1.4rem; }
    header p { margin:0; opacity:.9; font-size:.95rem; }
    nav.sp-jump { padding:.75rem 1rem; display:flex; gap:.4rem; flex-wrap:wrap; }
    nav.sp-jump a { background:#fff; border-radius:999px; padding:.25rem .7rem; color:#3e2c23; text-decoration:none; font-size:.85rem; }
    main { max-width:860px; margin:0 auto; padding:0 1rem 3rem; }
    .sp-day { background:#fff; border-radius:12px; padding:1rem; margin:1rem 0; box-shadow:0 2px 6px rgba(0,0,0,.06); }
    .sp-day h2 { color:#3e2c23; font-size:1.15rem; margin:0 0 .25rem; }
    .sp-link a { color:#3e2c23; font-size:.85rem; word-break:break-all; }
    .sp-imgs { display:flex; gap:.75rem; overflow-x:auto; padding:.5rem 0; }
    .sp-imgs figure { margin:0; flex:0 0 auto; }
    .sp-imgs img { border-radius:8px; display:block; height:auto; }
    .sp-imgs figcaption { font-size:.8rem; }
    .sp-item { border-top:1px solid #eee; padding-top:.75rem; margin-top:.75rem; }
    .sp-head { display:flex; justify-content:space-between; align-items:center; gap:.5rem; }
    .sp-head button { background:#3e2c23; color:#fff; border:0; border-radius:6px; padding:.35rem .8rem; cursor:pointer; }
    .sp-note { font-size:.82rem; color:#5a4a42; margin:.2rem 0 .4rem; }
    textarea { width:100%; box-sizing:border-box; font:inherit; font-size:.9rem; border:1px solid #ddd; border-radius:8px; padding:.6rem; background:#fbfaf8; }
  </style>
</head>
<body>
  <header>
    <h1>Social Pack</h1>
    <p>Ready-to-post copy for the last ${recent.length} Dailies. Every link is tagged so Google Analytics shows which platform sent visitors. Rebuilt every deploy.</p>
  </header>
  <nav class="sp-jump" aria-label="Jump to a day">${recent.map((a) => `<a href="#d-${esc(a.date)}">${esc(a.date.slice(5))}</a>`).join('')}</nav>
  <main>${cards.join('\n')}
  </main>
  <script>
    document.addEventListener('click', async (e) => {
      const b = e.target.closest('button[data-copy]');
      if (!b) return;
      const t = document.getElementById(b.getAttribute('data-copy'));
      try { await navigator.clipboard.writeText(t.value); } catch { t.select(); document.execCommand('copy'); }
      const old = b.textContent; b.textContent = 'Copied'; setTimeout(() => { b.textContent = old; }, 1200);
    });
  </script>
</body>
</html>
`;
  await fs.writeFile(path.join(ROOT, 'admin', 'social.html'), html);
  console.log(`Social pack: ${recent.length} Dailies → /admin/social.html`);
}

main().catch((err) => { console.error('build-social failed:', err); process.exit(0); });
