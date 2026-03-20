// scripts/build-daily.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  todayCentralISO,
  toHuman,
  fill,
  dailyFileNameFor as fileNameFor,
  normalizeInsight,
  buildDailyInsightHTML
} from './shared/render-content.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const CONTENT_DIR = path.join(ROOT, 'content', 'daily');
const DATA_DIR = path.join(ROOT, 'data');
const DAILY_DIR = path.join(ROOT, 'daily');
const TPL_PATH = path.join(ROOT, 'templates', 'daily.html');
const REDIRECTS = path.join(ROOT, '_redirects');

const START_DATE = '2025-09-02';

async function mergeRedirectLines(linesToEnsure) {
  let existing = '';
  try {
    existing = await fs.readFile(REDIRECTS, 'utf-8');
  } catch {
    existing = '';
  }

  const existingLines = existing
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  const seen = new Set(existingLines);

  for (const line of linesToEnsure) {
    if (line && !seen.has(line)) {
      existingLines.push(line);
      seen.add(line);
    }
  }

  await fs.writeFile(REDIRECTS, existingLines.join('\n') + '\n', 'utf-8');
}

async function ensurePassthroughs() {
  await mergeRedirectLines([
    '/daily/*   /daily/:splat   200',
    '/blog/*   /blog/:splat   200'
  ]);
  console.log('✅ Ensured passthrough rules for /daily/* and /blog/*.');
}

async function readDailyEntries() {
  let files = [];
  try {
    files = (await fs.readdir(CONTENT_DIR)).filter(f => f.endsWith('.json'));
  } catch {
    files = [];
  }

  const entries = [];

  for (const f of files) {
    const fullPath = path.join(CONTENT_DIR, f);
    const raw = await fs.readFile(fullPath, 'utf-8');
    const j = JSON.parse(raw);

    if (j.body && !j.insight) j.insight = j.body;
    if (j['one-minute_win'] && !j.one_minute_win) {
      j.one_minute_win = j['one-minute_win'];
    }

    if (!j.date || !/^\d{4}-\d{2}-\d{2}$/.test(j.date)) {
      throw new Error(`Bad/missing "date" in ${f}`);
    }

    if (!j.verse_ref) {
      throw new Error(`Missing "verse_ref" in ${f}`);
    }

    entries.push(j);
  }

  entries.sort((a, b) => a.date.localeCompare(b.date));
  return entries;
}

async function rebuildDailyOutputDir() {
  try {
    await fs.rm(DAILY_DIR, { recursive: true, force: true });
  } catch {}
  await fs.mkdir(DAILY_DIR, { recursive: true });
}

function partitionEntries(entries, today) {
  const allowed = entries.filter(e => e.date >= START_DATE);
  const visible = allowed.filter(e => e.date <= today);
  const future = allowed.filter(e => e.date > today);
  const older = entries.filter(e => e.date < START_DATE);

  return { allowed, visible, future, older };
}

async function writeArchiveJson(visible) {
  const archive = visible
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(e => ({
      date: e.date,
      title: e.title || '',
      verse_ref: e.verse_ref || '',
      href: `/daily/${fileNameFor(e)}`
    }));

  await fs.writeFile(
    path.join(DATA_DIR, 'daily-archive.json'),
    JSON.stringify(archive, null, 2)
  );
}

async function writeLatestDailyJson(visible) {
  const todayEntry = visible.length ? visible[visible.length - 1] : null;

  if (!todayEntry) {
    try {
      await fs.unlink(path.join(DATA_DIR, 'daily.json'));
    } catch {}
    return;
  }

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

  await fs.writeFile(
    path.join(DATA_DIR, 'daily.json'),
    JSON.stringify(dailyData, null, 2)
  );
}

async function buildDailyPages(visible) {
  const tpl = await fs.readFile(TPL_PATH, 'utf-8');

  for (let i = 0; i < visible.length; i++) {
    const e = visible[i];
    const prev = i > 0 ? visible[i - 1] : null;
    const next = i < visible.length - 1 ? visible[i + 1] : null;

    const insightHTML = buildDailyInsightHTML(e);

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
}

async function writeGuardRedirects(older, future) {
  const guardLines = [
    ...older.map(e => `/daily/${fileNameFor(e)}   /daily-archive.html   302!`),
    ...future.map(e => `/daily/${fileNameFor(e)}   /daily-archive.html   302!`)
  ];

  await mergeRedirectLines(guardLines);
}

async function main() {
  await ensurePassthroughs();
  await fs.mkdir(DATA_DIR, { recursive: true });

  const entries = await readDailyEntries();
  const today = todayCentralISO();

  const { visible, future, older } = partitionEntries(entries, today);

  await rebuildDailyOutputDir();
  await writeArchiveJson(visible);
  await writeLatestDailyJson(visible);
  await buildDailyPages(visible);
  await writeGuardRedirects(older, future);

  console.log(
    `Built ${visible.length} daily pages in [${START_DATE}..${today}]. Older blocked: ${older.length}. Future blocked: ${future.length}.`
  );
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});