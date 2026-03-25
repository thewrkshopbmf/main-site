// scripts/build-daily.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  todayCentralISO,
  toHuman,
  fill,
  dailyFileNameFor as fileNameFor
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

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function cleanString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function titleCaseFromKey(key = '') {
  return String(key)
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, ch => ch.toUpperCase());
}

function normalizeStringArray(value) {
  if (Array.isArray(value)) {
    return value
      .map(v => cleanString(v))
      .filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(/\n{2,}/)
      .map(v => cleanString(v))
      .filter(Boolean);
  }

  return [];
}

function normalizeScriptures(entry) {
  const scriptures = [];

  if (Array.isArray(entry.scriptures)) {
    for (const s of entry.scriptures) {
      if (!s || typeof s !== 'object') continue;
      const ref = cleanString(s.ref || s.verse_ref);
      const text = cleanString(s.text || s.verse_text);
      if (ref || text) scriptures.push({ ref, text });
    }
  }

  if (!scriptures.length) {
    const ref = cleanString(entry.verse_ref);
    const text = cleanString(entry.verse_text);
    if (ref || text) scriptures.push({ ref, text });
  }

  return scriptures;
}

function normalizeBlock(block) {
  if (typeof block === 'string') {
    const text = cleanString(block);
    return text ? { type: 'paragraph', text } : null;
  }

  if (!block || typeof block !== 'object') return null;

  const type = cleanString(block.type || 'paragraph').toLowerCase();

  if (type === 'paragraph' || type === 'callout' || type === 'quote') {
    const text = cleanString(block.text);
    if (!text) return null;
    const prefix = cleanString(block.prefix);
    return prefix ? { type, text, prefix } : { type, text };
  }

  if (type === 'lines' || type === 'bullet_list' || type === 'numbered_list') {
    const items = normalizeStringArray(block.items || block.text || block.content);
    if (!items.length) return null;
    return { type, items };
  }

  return null;
}

function normalizeSection(section) {
  if (!section || typeof section !== 'object') return null;

  const key = cleanString(section.key || '').toLowerCase() || '';
  const label = cleanString(section.label) || titleCaseFromKey(key || 'section');

  let blocksSource = Array.isArray(section.blocks) ? section.blocks : null;

  if (!blocksSource) {
    if (section.items) {
      const style = cleanString(section.style || 'bullet_list').toLowerCase();
      const blockType = style === 'numbered_list' ? 'numbered_list' : 'bullet_list';
      blocksSource = [{ type: blockType, items: section.items }];
    } else if (section.content) {
      if (Array.isArray(section.content)) {
        blocksSource = section.content.map(text => ({ type: 'paragraph', text }));
      } else {
        blocksSource = [{ type: cleanString(section.style || 'paragraph'), text: section.content }];
      }
    } else if (section.text) {
      blocksSource = [{ type: cleanString(section.style || 'paragraph'), text: section.text }];
    } else {
      blocksSource = [];
    }
  }

  const blocks = blocksSource
    .map(normalizeBlock)
    .filter(Boolean);

  if (!blocks.length) return null;

  return {
    key,
    label,
    blocks
  };
}

function legacySectionsFromEntry(entry) {
  const sections = [];

  if (entry.read_this_out_loud || entry.readAloud) {
    sections.push({
      key: 'read_this_out_loud',
      label: 'Read This Out Loud',
      blocks: normalizeStringArray(entry.read_this_out_loud || entry.readAloud)
        .map(text => ({ type: 'paragraph', text }))
    });
  }

  const insightParts = normalizeStringArray(entry.insight || entry.body);
  if (insightParts.length) {
    sections.push({
      key: 'devotional',
      label: 'The Devotional',
      blocks: insightParts.map(text => ({ type: 'paragraph', text }))
    });
  }

  if (entry.shift) {
    sections.push({
      key: 'shift',
      label: 'The Shift',
      blocks: normalizeStringArray(entry.shift).map(text => ({ type: 'paragraph', text }))
    });
  }

  if (entry.jesus_set_the_pattern) {
    sections.push({
      key: 'jesus_set_the_pattern',
      label: 'Jesus Set the Pattern',
      blocks: normalizeStringArray(entry.jesus_set_the_pattern).map(text => ({ type: 'paragraph', text }))
    });
  }

  if (entry.truth) {
    sections.push({
      key: 'truth',
      label: 'The Truth',
      blocks: normalizeStringArray(entry.truth).map(text => ({ type: 'paragraph', text }))
    });
  }

  if (entry.reflection) {
    sections.push({
      key: 'reflection',
      label: 'Reflection',
      blocks: [{ type: 'bullet_list', items: normalizeStringArray(entry.reflection) }]
    });
  }

  if (entry.one_minute_win || entry['one-minute_win'] || entry.action_step) {
    sections.push({
      key: 'action_step',
      label: 'Action Step',
      blocks: normalizeStringArray(entry.one_minute_win || entry['one-minute_win'] || entry.action_step)
        .map(text => ({ type: 'paragraph', text }))
    });
  }

  if (entry.declaration) {
    sections.push({
      key: 'declaration',
      label: 'Declaration',
      blocks: normalizeStringArray(entry.declaration).map(text => ({ type: 'paragraph', text }))
    });
  }

  if (entry.one_sentence_to_carry) {
    sections.push({
      key: 'one_sentence_to_carry',
      label: 'One Sentence to Carry',
      blocks: normalizeStringArray(entry.one_sentence_to_carry).map(text => ({ type: 'quote', text }))
    });
  }

  return sections.filter(Boolean);
}

function normalizeDailyEntry(entry) {
  const scriptures = normalizeScriptures(entry);

  let sections = [];
  if (Array.isArray(entry.sections) && entry.sections.length) {
    sections = entry.sections
      .map(normalizeSection)
      .filter(Boolean);
  } else {
    sections = legacySectionsFromEntry(entry);
  }

  return {
    ...entry,
    scriptures,
    verse_ref: cleanString(entry.verse_ref || scriptures[0]?.ref || ''),
    verse_text: cleanString(entry.verse_text || scriptures[0]?.text || ''),
    sections
  };
}

function blockToPlainText(block) {
  if (!block) return '';
  if (block.type === 'paragraph' || block.type === 'callout' || block.type === 'quote') {
    return cleanString(block.text);
  }
  if (block.type === 'lines' || block.type === 'bullet_list' || block.type === 'numbered_list') {
    return normalizeStringArray(block.items).join(' ');
  }
  return '';
}

function sectionToPlainText(section) {
  if (!section?.blocks) return '';
  return section.blocks.map(blockToPlainText).filter(Boolean).join('\n');
}

function findSection(entry, keys) {
  const wanted = new Set(keys.map(k => k.toLowerCase()));
  return entry.sections.find(section => wanted.has((section.key || '').toLowerCase())) || null;
}

function renderBlock(block) {
  if (!block) return '';

  if (block.type === 'paragraph') {
    return `<p>${escapeHtml(block.text)}</p>`;
  }

  if (block.type === 'callout') {
    const prefix = cleanString(block.prefix || '👉');
    return `<p class="daily-callout"><span class="daily-callout-prefix">${escapeHtml(prefix)}</span> ${escapeHtml(block.text)}</p>`;
  }

  if (block.type === 'quote') {
    return `<blockquote>${escapeHtml(block.text)}</blockquote>`;
  }

  if (block.type === 'lines') {
    return block.items.map(item => `<p>${escapeHtml(item)}</p>`).join('\n');
  }

  if (block.type === 'bullet_list') {
    const items = block.items.map(item => `<li>${escapeHtml(item)}</li>`).join('');
    return `<ul>${items}</ul>`;
  }

  if (block.type === 'numbered_list') {
    const items = block.items.map(item => `<li>${escapeHtml(item)}</li>`).join('');
    return `<ol>${items}</ol>`;
  }

  return '';
}

function renderSection(section) {
  if (!section) return '';
  const blocksHtml = section.blocks.map(renderBlock).join('\n');
  return `
    <section class="daily-section daily-section-${escapeHtml(section.key || 'section')}">
      <h3 class="daily-section-title">${escapeHtml(section.label || 'Section')}</h3>
      ${blocksHtml}
    </section>
  `.trim();
}

function buildInsightHTML(entry) {
  const hiddenKeys = new Set([
    'action_step',
    'one_minute_win',
    'declaration'
  ]);

  const sections = entry.sections.filter(section => !hiddenKeys.has((section.key || '').toLowerCase()));
  return sections.map(renderSection).join('\n\n');
}

function buildPrimaryVerseRefHTML(entry) {
  const scriptures = entry.scriptures || [];
  if (!scriptures.length) return escapeHtml(entry.verse_ref || '');

  return scriptures
    .map(s => escapeHtml(s.ref || ''))
    .filter(Boolean)
    .join('<br>');
}

function buildPrimaryVerseTextHTML(entry) {
  const scriptures = entry.scriptures || [];
  if (!scriptures.length) return escapeHtml(entry.verse_text || '');

  return scriptures
    .map(s => {
      const ref = cleanString(s.ref);
      const text = cleanString(s.text);
      if (ref && text) return `<strong>${escapeHtml(ref)}</strong><br>${escapeHtml(text)}`;
      if (ref) return `<strong>${escapeHtml(ref)}</strong>`;
      return escapeHtml(text);
    })
    .filter(Boolean)
    .join('<br><br>');
}

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
    const entry = normalizeDailyEntry(j);

    if (!entry.date || !/^\d{4}-\d{2}-\d{2}$/.test(entry.date)) {
      throw new Error(`Bad/missing "date" in ${f}`);
    }

    if (!entry.verse_ref && !(entry.scriptures && entry.scriptures.length)) {
      throw new Error(`Missing scripture data in ${f}`);
    }

    entries.push(entry);
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

  const declarationSection = findSection(todayEntry, ['declaration']);
  const actionSection = findSection(todayEntry, ['action_step', 'one_minute_win']);
  const teaser = todayEntry.sections
    .map(sectionToPlainText)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 240);

  const dailyData = {
    date: todayEntry.date,
    title: todayEntry.title || '',
    verse_ref: todayEntry.verse_ref || '',
    verse_text: todayEntry.verse_text || '',
    scriptures: todayEntry.scriptures || [],
    sections: todayEntry.sections || [],
    insight: todayEntry.sections.map(sectionToPlainText).filter(Boolean),
    insight_teaser: teaser,
    one_minute_win: actionSection ? sectionToPlainText(actionSection) : '',
    declaration: declarationSection ? sectionToPlainText(declarationSection) : ''
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

    const declarationSection = findSection(e, ['declaration']);
    const actionSection = findSection(e, ['action_step', 'one_minute_win']);

    const html = fill(tpl, {
      TITLE: e.title || 'Untitled',
      HUMAN_DATE: toHuman(e.date),
      DATE: e.date,
      VERSE_REF: buildPrimaryVerseRefHTML(e),
      VERSE_TEXT: buildPrimaryVerseTextHTML(e),
      INSIGHT_HTML: buildInsightHTML(e),
      ONE_MINUTE_WIN: actionSection ? sectionToPlainText(actionSection) : (e.one_minute_win || ''),
      DECLARATION: declarationSection ? sectionToPlainText(declarationSection) : (e.declaration || ''),
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