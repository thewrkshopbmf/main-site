// scripts/build-blog.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const CONTENT_DIR = path.join(ROOT, 'content', 'blog');
const DATA_DIR    = path.join(ROOT, 'data');
const BLOG_DIR    = path.join(ROOT, 'blog');
const TPL_PATH    = path.join(ROOT, 'templates', 'blog.html');
const REDIRECTS   = path.join(ROOT, '_redirects');

// Hard start if you want to hide anything older:
const START_DATE = '2025-08-01';

/* ----------------- helpers ----------------- */
function todayCentralISO() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Chicago', year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(new Date());
}
function toHuman(dateStr) {
  const dt = new Date(dateStr + 'T00:00:00');
  return dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}
function fill(t, map) {
  let out = t;
  for (const [k, v] of Object.entries(map)) {
    out = out.replaceAll(`{{${k}}}`, String(v ?? ''));
  }
  return out;
}
function titleToSlug(title) {
  return (title || '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
// folder per post with index.html inside
function fileNameFor(e) {
  const slug = titleToSlug(e.title || 'post');
  return `${e.date}_${slug}/index.html`;
}
// body_html can be string or array; normalize to a single string
function paraHTML(val){
  if (Array.isArray(val)) return val.join('');
  if (typeof val === 'string') return val;
  return '';
}

/* ---------- minimal legacy renderer for structured fields ---------- */
function esc(s=''){ return String(s); }
function section(title, inner, extraClass=''){
  const h = title ? `<h2 class="h2">${esc(title)}</h2>` : '';
  return `<section class="section ${extraClass}">${h}${inner || ''}</section>`;
}
function list(items, ordered=false){
  if (!Array.isArray(items) || !items.length) return '';
  const li = items.map(x => `<li>${x}</li>`).join('\n');
  return ordered ? `<ol class="list">${li}</ol>` : `<ul class="list">${li}</ul>`;
}
function scripturesBlock(arr){
  if (!Array.isArray(arr) || !arr.length) return '';
  const cards = arr.map(s => `
    <div>
      <div class="k">${esc(s.ref || '')}</div>
      ${s.text ? `<p class="quote">${esc(s.text)}</p>` : ''}
      ${s.insight ? `<p class="sub">Insight: ${esc(s.insight)}</p>` : ''}
      ${s.gem ? `<p><em>Gem:</em> ${esc(s.gem)}</p>` : ''}
    </div>`).join('\n');
  return `<div class="kv">${cards}</div>`;
}
function renderLegacyBody(e){
  const parts = [];

  // Kicker / salutation / intro
  if (e.kicker || e.salutation || e.intro) {
    const introHTML = Array.isArray(e.intro)
      ? e.intro.map(p=>`<p>${esc(p)}</p>`).join('\n')
      : (e.intro ? `<p>${esc(e.intro)}</p>` : '');
    parts.push(section('', `
      ${e.kicker ? `<div class="kicker">${esc(e.kicker)}</div>` : ''}
      ${e.salutation ? `<p>${esc(e.salutation)}</p>` : ''}
      ${introHTML}
    `));
  }

  if (e.one_minute_win) {
    parts.push(section('One-Minute Win', `<p>${esc(e.one_minute_win)}</p>`, 'callout'));
  }

  if (Array.isArray(e.picture_this) && e.picture_this.length) {
    parts.push(section('Picture This', e.picture_this.map(p=>`<p>${esc(p)}</p>`).join('\n')));
  }

  if (Array.isArray(e.scriptures) && e.scriptures.length) {
    parts.push(section('4 Scriptures · Insights · Gems', scripturesBlock(e.scriptures)));
  }

  if (Array.isArray(e.ways_to_live) && e.ways_to_live.length) {
    const items = e.ways_to_live.map(w => `${w.title ? `<strong>${esc(w.title)}:</strong> ` : ''}${esc(w.body||'')}`);
    parts.push(section('3 Ways to Live It Out', list(items, true)));
  }

  if (Array.isArray(e.insights) && e.insights.length) {
    parts.push(section('Insights', list(e.insights)));
  }

  if (Array.isArray(e.reflective_questions) && e.reflective_questions.length) {
    parts.push(section('2 Reflective Questions', list(e.reflective_questions, true)));
  }

  if (e.action_step) {
    parts.push(section('1 Action Step', `<p>${esc(e.action_step)}</p>`));
  }

  if (e.bonus_title || e.bonus_body || e.bonus_list) {
    const body = Array.isArray(e.bonus_body)
      ? e.bonus_body.map(p=>`<p>${esc(p)}</p>`).join('\n')
      : (e.bonus_body ? `<p>${esc(e.bonus_body)}</p>` : '');
    const listHTML = Array.isArray(e.bonus_list) && e.bonus_list.length
      ? list(e.bonus_list, true)
      : '';
    parts.push(section(e.bonus_title || 'Bonus', body + listHTML));
  }

  if (e.prayer || e.declaration) {
    const inner = `
      ${e.prayer ? `<p><strong>Prayer</strong><br>${esc(e.prayer)}</p>` : ''}
      ${e.declaration ? `<p><strong>Declaration</strong><br>${esc(e.declaration)}</p>` : ''}`;
    parts.push(section('', inner, 'callout'));
  }

  if (e.weekly_challenge || e.invitation || e.gem_to_carry) {
    const inner = `
      <p><strong>Weekly Challenge + Invitation</strong></p>
      ${e.weekly_challenge ? `<p><strong>Challenge:</strong> ${esc(e.weekly_challenge)}</p>` : ''}
      ${e.invitation ? `<p><strong>Invitation:</strong> ${esc(e.invitation)}</p>` : ''}
      ${e.gem_to_carry ? `<p><em>Gem:</em> ${esc(e.gem_to_carry)}</p>` : ''}`;
    parts.push(section('', inner));
  }

  return parts.filter(Boolean).join('\n');
}

/* --- Ensure passthrough rules in `_redirects` (daily only) --- */
async function ensurePassthroughs() {
  const passthroughs = [
    '/daily/*   /daily/:splat   200',
  ];

  let existing = '';
  try {
    existing = await fs.readFile(REDIRECTS, 'utf-8');
  } catch { /* file not there yet */ }

  const existingLines = existing.split('\n').map(l => l.trim()).filter(Boolean);
  const missing = passthroughs.filter(p => !existingLines.includes(p));
  const merged = [...missing, ...existingLines].join('\n') + '\n';

  await fs.writeFile(REDIRECTS, merged, 'utf-8');
  console.log('✅ Ensured passthrough for /daily/* only.');
}

/* --------------------- main --------------------- */
async function main() {
  await ensurePassthroughs();
  await fs.mkdir(DATA_DIR, { recursive: true });

  // Load content
  let files = [];
  try {
    files = (await fs.readdir(CONTENT_DIR)).filter(f => f.endsWith('.json'));
  } catch { /* no blogs yet */ }

  const entries = [];
  for (const f of files) {
    const raw = await fs.readFile(path.join(CONTENT_DIR, f), 'utf-8');
    const j = JSON.parse(raw);

    if (!j.date || !/^\d{4}-\d{2}-\d{2}$/.test(j.date)) throw new Error(`Bad/missing "date" in ${f}`);
    if (!j.title) throw new Error(`Missing "title" in ${f}`);

    entries.push(j);
  }

  // Sort ascending
  entries.sort((a, b) => a.date.localeCompare(b.date));
  const today = todayCentralISO();

  // Allowed window
  const allowed = entries.filter(e => e.date >= START_DATE);
  const visible = allowed.filter(e => e.date <= today);
  const future  = allowed.filter(e => e.date > today);
  const older   = entries.filter(e => e.date < START_DATE);

  // Clean output
  try { await fs.rm(BLOG_DIR, { recursive: true, force: true }); } catch {}
  await fs.mkdir(BLOG_DIR, { recursive: true });

  // Archive JSON (newest first)
  const archive = visible
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(e => ({
      date: e.date,
      title: e.title || '',
      category: e.category || '',
      excerpt: e.excerpt || '',
      author: e.author || '',
      reading_minutes: e.reading_minutes || 0,
      href: `/blog/${path.dirname(fileNameFor(e))}/`
    }));
  await fs.writeFile(path.join(DATA_DIR, 'blog-archive.json'), JSON.stringify(archive, null, 2));

  // Latest (homepage hook)
  const latest = visible.at(-1);
  if (latest) {
    const blogData = {
      date: latest.date,
      title: latest.title || '',
      category: latest.category || '',
      excerpt: latest.excerpt || '',
      author: latest.author || '',
      reading_minutes: latest.reading_minutes || 0,
      href: `/blog/${path.dirname(fileNameFor(latest))}/`
    };
    await fs.writeFile(path.join(DATA_DIR, 'blog.json'), JSON.stringify(blogData, null, 2));
  } else {
    try { await fs.unlink(path.join(DATA_DIR, 'blog.json')); } catch {}
  }

  // Generate blog pages
  const tpl = await fs.readFile(TPL_PATH, 'utf-8');
  for (let i = 0; i < visible.length; i++) {
    const e = visible[i];
    const prev = visible[i - 1];
    const next = visible[i + 1];

    // Prefer body_html if provided; otherwise render legacy schema
    let bodyHTML = '';
    let source = 'legacy';
    if (e.body_html !== undefined && e.body_html !== null) {
      bodyHTML = paraHTML(e.body_html).trim();
      source = 'body_html';
    }
    if (!bodyHTML) {
      bodyHTML = renderLegacyBody(e).trim();
      source = bodyHTML ? 'legacy' : 'empty';
    }

    // DEBUG LOG so we can see on Netlify what happened
    const partsCount = Array.isArray(e.body_html) ? e.body_html.length : (typeof e.body_html);
    console.log(`[blog] ${e.date} :: ${e.title} | source=${source} | body_parts=${partsCount ?? 'none'} | bytes=${bodyHTML.length}`);

    const html = fill(tpl, {
      TITLE: e.title || 'Untitled',
      CATEGORY: e.category || 'Article',
      DATE: e.date,
      HUMAN_DATE: toHuman(e.date),
      EXCERPT: e.excerpt || '',
      AUTHOR: e.author || '',
      READING_MIN: String(e.reading_minutes || 0),
      BODY_HTML: bodyHTML,
      PREV_HREF: prev ? `../${path.dirname(fileNameFor(prev))}/` : '#',
      NEXT_HREF: next ? `../${path.dirname(fileNameFor(next))}/` : '#'
    });

    const outPath = path.join(BLOG_DIR, fileNameFor(e));
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, html, 'utf-8');
  }

  // Redirect guards
  const guardLines = [
    ...older.map(e => `/blog/${path.dirname(fileNameFor(e))}/   /blog-archive.html   302!`),
    ...future.map(e => `/blog/${path.dirname(fileNameFor(e))}/   /blog-archive.html   302!`)
  ];

  let existing = '';
  try { existing = await fs.readFile(REDIRECTS, 'utf-8'); } catch {}
  const existingSet = new Set(existing.split('\n').map(l => l.trim()).filter(Boolean));
  const toAppend = guardLines.filter(l => l && !existingSet.has(l));
  const merged = (existing.trim() + (toAppend.length ? '\n' + toAppend.join('\n') : '')).trim() + '\n';
  await fs.writeFile(REDIRECTS, merged, 'utf-8');

  console.log(`Blogs built: ${visible.length} in [${START_DATE}..${today}], future: ${future.length}, older: ${older.length}`);
  console.log('Blog pages generated:');
  for (const e of visible) console.log(' -', `/blog/${path.dirname(fileNameFor(e))}/`);
}

main().catch(err => { console.error(err); process.exit(1); });
