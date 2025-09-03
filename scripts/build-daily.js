// scripts/build-daily.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const CONTENT_DIR = path.join(ROOT, 'content', 'daily');
const DATA_DIR    = path.join(ROOT, 'data');
const DAILY_DIR   = path.join(ROOT, 'daily');
const TPL_PATH    = path.join(ROOT, 'templates', 'daily.html');

/* ------------ helpers ------------ */

function todayCentralISO() {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago', year: 'numeric', month: '2-digit', day: '2-digit'
  });
  const [m, d, y] = fmt.format(new Date()).split('/');
  return `${y}-${m}-${d}`;
}
function toHuman(dateStr) {
  const dt = new Date(dateStr + 'T00:00:00');
  return dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}
function fill(template, map) {
  return Object.entries(map).reduce((acc, [k, v]) => acc.replaceAll(`{{${k}}}`, v ?? ''), template);
}
function slugBase(s) {
  return (s || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')    // strip accents
    .replace(/['"]/g, '')               // quotes
    .replace(/[^A-Za-z0-9\s:-]+/g, ' ') // keep letters/numbers/space/:/-
    .replace(/\s+/g, ' ')               // collapse spaces
    .trim();
}
function scriptureToSlug(ref) {
  return slugBase(ref)
    .replace(/[:–—]/g, '-') // : and dashes -> hyphen
    .replace(/\s+/g, '-')   // spaces -> hyphen
    .replace(/-+/g, '-');
}
function titleToSlug(title) {
  const s = slugBase(title)
    .replace(/[:–—]/g, '-') // unify
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  // cap for sanity / SEO
  return s.slice(0, 60).replace(/-+$/,'');
}
// scripture-first filename: <SCRIPTURE>_<TITLE>_<DATE>.html
function fileNameFor(e) {
  const scripture = scriptureToSlug(e.verse_ref || 'Scripture');
  const title = titleToSlug(e.title || 'Daily');
  return `${scripture}_${title}_${e.date}.html`;
}

function normalizeInsight(x) {
  if (Array.isArray(x)) return x.filter(Boolean).map(String);
  if (typeof x === 'string') return [x];
  return [];
}

/* ------------ main ------------ */

async function main() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(DAILY_DIR, { recursive: true });

  // load content
  const files = (await fs.readdir(CONTENT_DIR)).filter(f => f.endsWith('.json'));
  const entries = [];
  for (const f of files) {
    const raw = await fs.readFile(path.join(CONTENT_DIR, f), 'utf-8');
    const j = JSON.parse(raw);

    // rename legacy keys if present
    if (j.body && !j.insight) j.insight = j.body;
    if (j['one-minute_win'] && !j.one_minute_win) j.one_minute_win = j['one-minute_win'];

    // basic validation
    if (!j.date) throw new Error(`Missing "date" in ${f}`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(j.date)) throw new Error(`Bad date format in ${f}: ${j.date}`);
    if (!j.verse_ref) throw new Error(`Missing "verse_ref" in ${f}`);

    entries.push(j);
  }

  // sort for prev/next
  entries.sort((a, b) => a.date.localeCompare(b.date));

  const today = todayCentralISO();
  const visible = entries.filter(e => e.date <= today);

  // archive json (newest first)
  const archive = visible
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(e => ({
      date: e.date,
      title: e.title || '',
      verse_ref: e.verse_ref || '',
      href: `/daily/${fileNameFor(e)}`
    }));

  // after: const today = todayCentralISO();
await cleanupFutureDailyPages(DAILY_DIR, today);

async function cleanupFutureDailyPages(dir, todayISO){
  try{
    const files = (await fs.readdir(dir)).filter(f => f.endsWith('.html'));
    for (const f of files){
      // Expect: Scripture_Title_YYYY-MM-DD.html  → extract date
      const m = f.match(/_(\d{4}-\d{2}-\d{2})\.html$/);
      if (m && m[1] > todayISO){
        await fs.unlink(path.join(dir, f)); // remove unreleased file
      }
    }
  }catch(e){
    // ignore if dir does not exist yet
  }
}


  await fs.writeFile(path.join(DATA_DIR, 'daily-archive.json'), JSON.stringify(archive, null, 2));

  // today's json for homepage card
  const todayEntry = visible.find(e => e.date === today) || visible.at(-1);
  if (todayEntry) {
    const insight = normalizeInsight(todayEntry.insight);
    const teaser = insight.join(' ').slice(0, 240);
    const dailyData = {
      date: todayEntry.date,
      title: todayEntry.title || '',
      verse_ref: todayEntry.verse_ref || '',
      verse_text: todayEntry.verse_text || '',
      insight,                 // array of paras
      insight_teaser: teaser,  // helpful for home card
      one_minute_win: todayEntry.one_minute_win || '',
      declaration: todayEntry.declaration || ''
    };
    await fs.writeFile(path.join(DATA_DIR, 'daily.json'), JSON.stringify(dailyData, null, 2));
  }

  // generate HTML pages
  const tpl = await fs.readFile(TPL_PATH, 'utf-8');

  for (let i = 0; i < visible.length; i++) {
    const e = visible[i];
    const prev = visible[i - 1];
    const next = visible[i + 1];

    const insightParas = normalizeInsight(e.insight)
      .map(p => `<p>${p}</p>`)
      .join('\n');

    const html = fill(tpl, {
      TITLE: e.title || 'Untitled',
      HUMAN_DATE: toHuman(e.date),
      DATE: e.date,
      VERSE_REF: e.verse_ref || '',
      VERSE_TEXT: e.verse_text || '',
      INSIGHT_HTML: insightParas,
      ONE_MINUTE_WIN: e.one_minute_win || '',
      DECLARATION: e.declaration || '',
      PREV_HREF: prev ? `./${fileNameFor(prev)}` : '#',
      NEXT_HREF: next ? `./${fileNameFor(next)}` : '#'
    });

    await fs.writeFile(path.join(DAILY_DIR, fileNameFor(e)), html, 'utf-8');
  }

  console.log(`Built ${visible.length} daily pages. Today (CST): ${today}`);
}

main().catch(err => { console.error(err); process.exit(1); });
