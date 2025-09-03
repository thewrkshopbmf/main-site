// scripts/build-daily.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

/* ---------- paths ---------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const CONTENT_DIR = path.join(ROOT, 'content', 'daily');
const DATA_DIR    = path.join(ROOT, 'data', 'v2');
const DAILY_DIR   = path.join(ROOT, 'daily');
const TPL_PATH    = path.join(ROOT, 'templates', 'daily.html');
const REDIRECTS   = path.join(ROOT, '_redirects'); // Netlify redirects at repo root

/* ---------- helpers ---------- */

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

    if (!j.date || !/^\d{4}-\d{2}-\d{2}$/.test(j.date)) {
      throw new Error(`Bad or missing "date" in ${f}`);
    }
    if (!j.verse_ref) {
      throw new Error(`Missing "verse_ref" in ${f}`);
    }
    entries.push(j);
  }

  // Sort ascending by date
  entries.sort((a, b) => a.date.localeCompare(b.date));

  const today = todayCentralISO();

  // Partition into visible vs future
  const visible = entries.filter(e => e.date <= today);
  const future  = entries.filter(e => e.date > today);

  /* --------- HARD RESET DAILY FOLDER ---------
     This guarantees NO stale files remain from prior deploys.
  ------------------------------------------------ */
  try { await fs.rm(DAILY_DIR, { recursive: true, force: true }); } catch {}
  await fs.mkdir(DAILY_DIR, { recursive: true });

  // --- Archive JSON (newest first) from visible only ---
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
    // If nothing visible yet, remove stale daily.json
    try { await fs.unlink(path.join(DATA_DIR, 'daily.json')); } catch {}
  }

  // --- Generate HTML pages for visible only ---
  const tpl = await fs.readFile(TPL_PATH, 'utf-8');
  for (let i = 0; i < visible.length; i++) {
    const e = visible[i];
    const prev = visible[i - 1];
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

  // --- Generate Netlify _redirects to block/re-route FUTURE URLs ---
  // We’ll 302 redirect any future daily URL to the archive (you can change to 404 if you prefer).
  // Also include a catch-all to leave other routes alone.
  const futureLines = future.map(e => `/daily/${fileNameFor(e)}  /daily-archive.html  302!`);
  const redirectsContent = [
    ...futureLines,
    // (Optional) protect raw content JSONs from direct access
    '/content/*  /daily-archive.html  302!',
    // default: do nothing special for others
  ].join('\n') + '\n';

  await fs.writeFile(REDIRECTS, redirectsContent, 'utf-8');

  console.log(`Built ${visible.length} daily pages (<= ${today}). Future blocked: ${future.length}.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
