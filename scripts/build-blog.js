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
function titleToSlug(title){
  return slugBase(title).replace(/[:–—]/g,'-').replace(/\s+/g,'-').replace(/-+/g,'-').slice(0,80).replace(/-+$/,'');
}
function fileNameFor(e){
  const slug = titleToSlug(e.title || 'post');
  return `${slug}_${e.date}.html`;
}
function paraHTML(arr){
  if (Array.isArray(arr)) return arr.join('\n');
  if (typeof arr === 'string') return `<p>${arr}</p>`;
  return '';
}

async function main(){
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
  const lines = [
    ...older.map(e => `/blog/${fileNameFor(e)}   /blog-archive.html   302!`),
    ...future.map(e => `/blog/${fileNameFor(e)}   /blog-archive.html   302!`)
  ];
  // Append (don’t overwrite) to the existing redirects if you also write daily rules there.
  // If your daily script also writes _redirects, you can merge; simplest is: let Daily own it.
  // For now, append (create if missing):
  let existing = '';
  try { existing = await fs.readFile(REDIRECTS, 'utf-8'); } catch {}
  const merged = (existing.trim() + '\n' + lines.join('\n')).trim() + (lines.length ? '\n' : '');
  await fs.writeFile(REDIRECTS, merged, 'utf-8');

  console.log(`Blogs built: ${visible.length} in [${START_DATE}..${today}], future: ${future.length}, older: ${older.length}`);
}

main().catch(err => { console.error(err); process.exit(1); });
