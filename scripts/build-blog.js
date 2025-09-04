// scripts/build-blog.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const CONTENT_DIR = path.join(ROOT, 'content', 'blog');
const DATA_DIR    = path.join(ROOT, 'data');         // keep consistent with your daily
const BLOG_DIR    = path.join(ROOT, 'blog');         // output HTML here
const TPL_PATH    = path.join(ROOT, 'templates', 'blog.html');
const REDIRECTS   = path.join(ROOT, '_redirects');

// Hard start if you want to hide anything older:
const START_DATE = '2025-08-01'; // first Monday week or whatever you prefer

function todayCentralISO() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Chicago', year:'numeric', month:'2-digit', day:'2-digit'
  }).format(new Date());
}
function toHuman(dateStr){
  const dt = new Date(dateStr + 'T00:00:00');
  return dt.toLocaleDateString(undefined,{month:'short', day:'numeric', year:'numeric'});
}
function fill(t, map){
  return Object.entries(map).reduce((acc,[k,v])=>acc.replaceAll(`{{${k}}}`, v ?? ''), t);
}
function slugBase(s){
  return (s||'').normalize('NFKD')
    .replace(/[\u0300-\u036f]/g,'')
    .replace(/['"]/g,'')
    .replace(/[^A-Za-z0-9\s:–—-]+/g,' ')
    .replace(/\s+/g,' ')
    .trim();
}
function titleToSlug(title) {
  return (title || '')
    .toLowerCase()
    .replace(/['’]/g, '')          // remove apostrophes entirely
    .replace(/[^a-z0-9]+/g, '-')   // collapse everything else to hyphen
    .replace(/^-+|-+$/g, '');      // trim leading/trailing hyphens
}

function fileNameFor(e){
  const slug = titleToSlug(e.title || 'post');
  return `${e.date}_${slug}.html`;
}
function paraHTML(arr){
  if (Array.isArray(arr)) return arr.join('\n');
  if (typeof arr === 'string') return `<p>${arr}</p>`;
  return '';
}

// --- NEW: ensure passthrough rules are always at the top of `_redirects`
async function ensurePassthroughs() {
  const passthroughs = [
    '/blog/*   /blog/:splat   200',
    '/daily/*   /daily/:splat   200', // parity; harmless if you already serve dailies directly
  ];

  let existing = '';
  try {
    existing = await fs.readFile(REDIRECTS, 'utf-8');
  } catch {
    // _redirects doesn't exist yet; we'll create it below
  }

  const existingLines = existing
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

  // De-dupe and ensure passthroughs are first
  const missing = passthroughs.filter(p => !existingLines.includes(p));
  const merged = [
    ...missing,      // ensure these are at the very top
    ...existingLines // keep whatever you already had (daily future guards, etc.)
  ].join('\n') + '\n';

  await fs.writeFile(REDIRECTS, merged, 'utf-8');
  console.log('✅ Ensured passthroughs for /blog/* and /daily/* are in _redirects (top of file).');
}

async function main(){
  // make sure passthrough rules exist before we append any other redirects
  await ensurePassthroughs();

  await fs.mkdir(DATA_DIR, { recursive: true });

  // Load content
  let files = [];
  try { files = (await fs.readdir(CONTENT_DIR)).filter(f => f.endsWith('.json')); }
  catch { /* no blogs yet */ }

  const entries = [];
  for (const f of files){
    const raw = await fs.readFile(path.join(CONTENT_DIR, f), 'utf-8');
    const j = JSON.parse(raw);

    if (!j.date || !/^\d{4}-\d{2}-\d{2}$/.test(j.date)) throw new Error(`Bad/missing "date" in ${f}`);
    if (!j.title) throw new Error(`Missing "title" in ${f}`);

    entries.push(j);
  }

  // Sort ascending
  entries.sort((a,b)=>a.date.localeCompare(b.date));

  const today = todayCentralISO();

  // Allowed window
  const allowed = entries.filter(e => e.date >= START_DATE);
  const visible = allowed.filter(e => e.date <= today);
  const future  = allowed.filter(e => e.date > today);
  const older   = entries.filter(e => e.date < START_DATE);

  // Clean output
  try { await fs.rm(BLOG_DIR, { recursive:true, force:true }); } catch {}
  await fs.mkdir(BLOG_DIR, { recursive:true });

  // Archive JSON (newest first)
  const archive = visible
    .slice()
    .sort((a,b)=>b.date.localeCompare(a.date))
    .map(e => ({
      date: e.date,
      title: e.title || '',
      category: e.category || '',
      excerpt: e.excerpt || '',
      reading_minutes: e.reading_minutes || 0,
      href: `/blog/${fileNameFor(e)}`
    }));
  await fs.writeFile(path.join(DATA_DIR,'blog-archive.json'), JSON.stringify(archive, null, 2));

  // Latest (homepage hook)
  const latest = visible.at(-1);
  if (latest){
    const blogData = {
      date: latest.date,
      title: latest.title || '',
      category: latest.category || '',
      excerpt: latest.excerpt || '',
      reading_minutes: latest.reading_minutes || 0,
      href: `/blog/${fileNameFor(latest)}`
    };
    await fs.writeFile(path.join(DATA_DIR,'blog.json'), JSON.stringify(blogData, null, 2));
  } else {
    try { await fs.unlink(path.join(DATA_DIR,'blog.json')); } catch {}
  }

  // Generate pages
  const tpl = await fs.readFile(TPL_PATH, 'utf-8');
  for (let i=0;i<visible.length;i++){
    const e = visible[i];
    const prev = visible[i-1];
    const next = visible[i+1];

    const html = fill(tpl, {
      TITLE: e.title || 'Untitled',
      CATEGORY: e.category || 'Article',
      DATE: e.date,
      HUMAN_DATE: toHuman(e.date),
      EXCERPT: e.excerpt || '',
      READING_MIN: String(e.reading_minutes || 0),
      BODY_HTML: paraHTML(e.body_html),
      PREV_HREF: prev ? `./${fileNameFor(prev)}` : '#',
      NEXT_HREF: next ? `./${fileNameFor(next)}` : '#'
    });

    await fs.writeFile(path.join(BLOG_DIR, fileNameFor(e)), html, 'utf-8');
  }

  // Redirect blocklist (older than start + future → archive)
  const guardLines = [
    ...older.map(e => `/blog/${fileNameFor(e)}   /blog-archive.html   302!`),
    ...future.map(e => `/blog/${fileNameFor(e)}   /blog-archive.html   302!`)
  ];

  // Merge guards AFTER passthroughs and without duplicating
  let existing = '';
  try { existing = await fs.readFile(REDIRECTS, 'utf-8'); } catch {}
  const existingSet = new Set(
    existing.split('\n').map(l => l.trim()).filter(Boolean)
  );
  const toAppend = guardLines.filter(l => l && !existingSet.has(l));
  const merged = (existing.trim() + (toAppend.length ? '\n' + toAppend.join('\n') : '')).trim() + '\n';
  await fs.writeFile(REDIRECTS, merged, 'utf-8');

  console.log(`Blogs built: ${visible.length} in [${START_DATE}..${today}], future: ${future.length}, older: ${older.length}`);
  console.log('Blog pages generated:');
  for (const e of visible) console.log(' -', `/blog/${fileNameFor(e)}`);
}

main().catch(err => { console.error(err); process.exit(1); });
