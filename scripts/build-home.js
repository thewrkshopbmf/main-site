// scripts/build-home.js
// Bakes the current Daily, latest podcast, latest blog, latest leadership posts and
// latest blog posts into index.html, so the homepage is never stale for search engines,
// link previews, AI crawlers or visitors whose JavaScript loads slowly.
// script.js still refreshes these cards in the browser; this is the starting HTML.
// Runs after build:daily, build:blog and build:podcasts (see package.json "build:all").
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { todayCentralISO } from './shared/render-content.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const INDEX = path.join(ROOT, 'index.html');

const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

async function readJson(rel) {
  try { return JSON.parse(await fs.readFile(path.join(ROOT, rel), 'utf-8')); } catch { return null; }
}

// Cut long text at a word boundary so cards never end mid-word.
export function trimTeaser(text, max = 180) {
  const t = String(text || '').replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const at = cut.lastIndexOf(' ');
  return (at > 60 ? cut.slice(0, at) : cut).replace(/[\s,;:.–—-]+$/, '') + '…';
}

function shortDate(iso) {
  const dt = new Date(iso + 'T12:00:00Z');
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
}

function podcastMinutes(raw) {
  if (!raw) return '';
  if (String(raw).includes(':')) {
    const parts = String(raw).split(':').map((x) => parseInt(x, 10) || 0);
    let h = 0, m = 0, s = 0;
    if (parts.length === 3) [h, m, s] = parts; else if (parts.length === 2) [m, s] = parts;
    if (s >= 30) m++;
    if (m >= 60) { h++; m -= 60; }
    return h ? `${h}h ${m}m` : `${m}m`;
  }
  const sec = parseInt(raw, 10);
  if (Number.isNaN(sec)) return String(raw);
  const h = Math.floor(sec / 3600);
  const m = Math.round((sec % 3600) / 60);
  return h ? `${h}h ${m}m` : `${m}m`;
}

// Replace the inner HTML of the first element whose opening tag matches openRe,
// up to its matching close tag (same tag name, nesting-aware).
function replaceInner(html, openRe, inner) {
  const m = openRe.exec(html);
  if (!m) return { html, ok: false };
  const tag = m[1];
  const start = m.index + m[0].length;
  const re = new RegExp(`<${tag}\\b[^>]*>|</${tag}>`, 'gi');
  re.lastIndex = start;
  let depth = 1, hit;
  while ((hit = re.exec(html))) {
    depth += hit[0].startsWith('</') ? -1 : 1;
    if (depth === 0) return { html: html.slice(0, start) + inner + html.slice(hit.index), ok: true };
  }
  return { html, ok: false };
}

async function main() {
  let html = await fs.readFile(INDEX, 'utf-8');
  const today = todayCentralISO();
  const done = [];

  // 1) Today's Daily
  const d = await readJson('data/daily.json');
  const archive = (await readJson('data/daily-archive.json')) || [];
  if (d && d.date) {
    const mainTitle = d.headline || d.subtitle || d.title;
    const subTitle = d.headline ? (d.headline_sub || '') : (d.subtitle && d.subtitle !== mainTitle ? d.subtitle : '');
    const teaser = trimTeaser(d.tagline || d.insight_teaser || (Array.isArray(d.insight) ? d.insight[0] : d.insight) || '');
    let href = d.href || (archive.find((x) => x.date === d.date) || {}).href || '/daily.html';
    if (d.date > today) href = '/daily-archive.html';
    const inner = `
      <div class="df-head">
        <span class="badge">Today’s Daily</span>
        <time class="df-date" datetime="${esc(d.date)}">${esc(shortDate(d.date))}</time>
      </div>

      <h2 class="df-title">${esc(mainTitle)}</h2>
      <p class="df-subtitle"${subTitle ? '' : ' hidden'}>${esc(subTitle)}</p>
      <p class="df-teaser">${esc(teaser)}</p>

      <div class="df-verse">
        <span class="verse-ref">${esc(d.verse_ref || '')}</span>
        <span class="verse-snippet">${d.verse_text ? '“' + esc(d.verse_text) + '”' : ''}</span>
      </div>

      <div class="df-actions">
        <a class="df-cta" href="${esc(href)}">Read Today’s Daily →</a>
      </div>
    `;
    const r = replaceInner(html, /<(article) class="daily-feature">/i, inner);
    if (r.ok) { html = r.html; done.push(`daily ${d.date}`); }
  }

  // 2) Latest podcast mini-card
  const p = await readJson('data/podcast.json');
  if (p && p.title) {
    const mins = podcastMinutes(p.duration);
    const inner = `
        <h3>Latest Podcast</h3>
        <p class="mini-teaser">${esc(p.title)}${mins ? ' • ' + esc(mins) : ''}</p>
        <a class="cta" href="${esc(p.page_url || '/podcasts.html')}">Play →</a>
      `;
    const r = replaceInner(html, /<(article) class="mini-card" id="latestPodcastCard">/i, inner);
    if (r.ok) { html = r.html; done.push('podcast'); }
  }

  // 3) Latest blog mini-card
  const b = await readJson('data/blog.json');
  if (b && b.title) {
    const inner = `
        <h3>Latest Blog</h3>
        <p class="mini-teaser">${esc(b.title)} • ${esc(b.reading_minutes || 0)} min</p>
        <a class="cta" href="${esc(b.href || '/blog-archive.html')}">Read →</a>
      `;
    const r = replaceInner(html, /<(article) class="mini-card" id="latestBlogCard">/i, inner);
    if (r.ok) { html = r.html; done.push('blog card'); }
  }

  // 4) Latest 3 leadership posts
  const lead = archive
    .filter((x) => x.category === 'Leadership & Culture' && x.href && x.date <= today)
    .sort((a, z) => z.date.localeCompare(a.date))
    .slice(0, 3);
  if (lead.length) {
    const inner = lead.map((x) => `
      <article class="blog-card">
        <h3><a href="${esc(x.href)}">${esc(x.headline || x.subtitle || x.title)}</a></h3>
        ${x.tagline ? `<p class="excerpt">${esc(x.tagline)}</p>` : ''}
      </article>`).join('') + '\n    ';
    const r = replaceInner(html, /<(div) class="cards lead-feature-cards" id="leadCards">/i, inner);
    if (r.ok) { html = r.html; done.push('leadership'); }
  }

  // 5) Latest 3 blog posts
  const blogs = ((await readJson('data/blog-archive.json')) || [])
    .filter((x) => x.date && x.date <= today && x.href)
    .sort((a, z) => z.date.localeCompare(a.date))
    .slice(0, 3);
  if (blogs.length) {
    const inner = blogs.map((x) => `
      <article class="blog-card">
        <h3><a href="${esc(x.href)}">${esc(x.title)}</a></h3>
        <p class="meta">${esc(x.reading_minutes || 0)} min • ${esc(x.category || 'Article')}</p>
        <p class="excerpt">${esc(x.excerpt || '')}</p>
      </article>`).join('') + '\n    ';
    const r = replaceInner(html, /<(div) class="cards" id="blogCards">/i, inner);
    if (r.ok) { html = r.html; done.push('blog row'); }
  }

  await fs.writeFile(INDEX, html);
  console.log(`Homepage baked: ${done.join(', ') || 'nothing (data missing)'}`);
}

main().catch((err) => { console.error('build-home failed:', err); process.exit(0); });
