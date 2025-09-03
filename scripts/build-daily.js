// scripts/build-daily.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

/* ---------- paths ---------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const CONTENT_DIR = path.join(ROOT, 'content', 'daily');
const DATA_DIR    = path.join(ROOT, 'data');        // keep v1 paths unless you've moved to v2
const DAILY_DIR   = path.join(ROOT, 'daily');
const TPL_PATH    = path.join(ROOT, 'templates', 'daily.html');
const REDIRECTS   = path.join(ROOT, '_redirects');  // Netlify redirects at repo root

/* ---------- config ---------- */
// 🚫 Absolutely ignore anything before this day.
// This makes 2025-09-02 the first allowed entry (no “Prev”).
const START_DATE = '2025-09-02'; // YYYY-MM-DD

/* ---------- helpers ---------- */

function todayCentralISO() {
  // Unambiguous YYYY-MM-DD in America/Chicago
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Chicago', year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(new Date());
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
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['"]/g, '')
    .replace(/[^A-Za-z0-9\s:–—-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
function scriptureToSlug(ref) {
  return slugBase(ref)
    .replace(/[:–—]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
function titleToSlug(title) {
  return slugBase(title)
    .replace(/[:–—]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60)
    .replace(/-+$/,'');
}
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

/* ---------- main ---------- */

async function main() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  // Load all content JSONs
  const files = (await fs.readdir(CONTENT_DIR)).filter(f => f.endsWith('.json'));
  const entries = [];
  for (const f of files) {
    const raw = await fs.readFile(path.join(CONTENT_DIR, f), 'utf-8');
    const j = JSON.parse(raw);

    // Back-compat
    if (j.body && !j.insight) j.insight = j.body;
    if (j['one-minute_win'] && !j.one_minute_win) j.one_minute_win = j['one-minute_win'];

    if (!j.date || !/^\d{4}-\d{2}-\d{2}$/.test(j.date)) throw new Error(`Bad/missing "date" in ${f}`);
    if (!j.verse_ref) throw new Error(`Missing "verse_ref" in ${f}`);

    entries.push(j);
  }

  // Sort ascending by date
  entries.sort((a, b) => a.date.localeCompare(b.date));

  const today = todayCentralISO();

  // Partition with hard start: only START_DATE..today are allowed/visible
  const allowed = entries.filter(e => e.date >= START_DATE);       // everything on/after start
  const visible = allowed.filter(e => e.date <= today);            // and not in the future
  const future  = allowed.filter(e => e.date > today);             // for optional redirects
  const older   = entries.filter(e => e.date < START_DATE);        // before the start → block

  /* --------- HARD RESET DAILY FOLDER --------- */
  try { await fs.rm(DAILY_DIR, { recursive: true, force: true }); } catch {}
  await fs.mkdir(DAILY_DIR, { recursive: true });

  // --- Archive JSON (newest first) strictly from visible ---
  const archive = visible
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(e => ({
      date: e.date,
      title: e.title || '',
      verse_ref: e.verse_ref || '',
      href: `/daily/${fileNameFor(e)}`
    }));
  await fs.writeFile(path.join(DATA_DIR, 'daily-archive.json'), JSON.stringify(archive, null, 2));

  // --- Today's JSON (homepage) from latest visible ---
  const todayEntry = visible.at(-1);
  if (todayEntry) {
    const insight = normalizeInsight(todayEntry.insight);
    const teaser = insight.join(' ').slice(0, 240);

    const dailyData = {
      date: todayEntry.date,
      title: todayEntry.title || '',
      verse_ref: todayEntry.verse_ref || '',
      verse_text: todayEntry.verse_text || '',
      insight,
      insight_teaser: teaser,
      one_minute_win: todayEntry.one_minute_win || '',
      declaration: todayEntry.declaration || ''
    };
    await fs.writeFile(path.join(DATA_DIR, 'daily.json'), JSON.stringify(dailyData, null, 2));
  } else {
    // nothing visible yet → remove stale daily.json if it exists
    try { await fs.unlink(path.join(DATA_DIR, 'daily.json')); } catch {}
  }

  // --- Generate HTML pages for visible only ---
  const tpl = await fs.readFile(TPL_PATH, 'utf-8');
  for (let i = 0; i < visible.length; i++) {
    const e = visible[i];
    const prev = visible[i - 1];   // will be undefined for the first (START_DATE) entry
    const next = visible[i + 1];

    const insightHTML = normalizeInsight(e.insight).map(p => `<p>${p}</p>`).join('\n');

    const html = fill(tpl, {
      TITLE: e.title || 'Untitled',
      HUMAN_DATE: toHuman(e.date),
      DATE: e.date,
      VERSE_REF: e.verse_ref || '',
      VERSE_TEXT: e.verse_text || '',
      INSIGHT_HTML: insightHTML,
      ONE_MINUTE_WIN: e.one_minute_win || '',
      DECLARATION: e.declaration || '',
      PREV_HREF: prev ? `./${fileNameFor(prev)}` : '#',
      NEXT_HREF: next ? `./${fileNameFor(next)}` : '#'
    });

    await fs.writeFile(path.join(DAILY_DIR, fileNameFor(e)), html, 'utf-8');
  }

  // --- Generate Netlify _redirects to block older-than-start and future URLs ---
  // Everything before START_DATE and after today → send to archive (or 404 if you prefer)
  const olderLines  = older.map(e  => `/daily/${fileNameFor(e)}   /daily-archive.html   302!`);
  const futureLines = future.map(e => `/daily/${fileNameFor(e)}   /daily-archive.html   302!`);
  const redirectsContent = [...olderLines, ...futureLines].join('\n') + (olderLines.length||futureLines.length ? '\n' : '');
  await fs.writeFile(REDIRECTS, redirectsContent, 'utf-8');

  console.log(`Built ${visible.length} daily pages in [${START_DATE}..${today}]. Older blocked: ${older.length}. Future blocked: ${future.length}.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
