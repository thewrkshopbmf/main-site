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
import { SITE_URL, dailyBodyHtml } from '../netlify/shared/daily-email.js';

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

  if (type === 'paragraph' || type === 'callout' || type === 'quote' || type === 'subhead') {
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
  if (block.type === 'paragraph' || block.type === 'callout' || block.type === 'quote' || block.type === 'subhead') {
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

  if (block.type === 'subhead') {
    return `<h4 class="daily-subhead">${escapeHtml(block.text)}</h4>`;
  }

  if (block.type === 'callout') {
    const prefix = cleanString(block.prefix || '👉');
    return `<p class="daily-callout"><span class="daily-callout-prefix">${escapeHtml(prefix)}</span> ${escapeHtml(block.text)}</p>`;
  }

  if (block.type === 'quote') {
    return `<blockquote>${escapeHtml(block.text)}</blockquote>`;
  }

  if (block.type === 'lines') {
    // Lines that belong together stay together (one short group, line breaks inside)
    return `<p class="daily-lines">${block.items.map(item => escapeHtml(item)).join('<br>')}</p>`;
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
    await fs.rm(LEADERSHIP_DIR, { recursive: true, force: true });
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
      subtitle: e.subtitle || '',
      verse_ref: e.verse_ref || '',
      href: pagePathFor(e)
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
  const teaser = [todayEntry.tagline || '', ...todayEntry.sections
    .map(sectionToPlainText)]
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 240);

  const dailyData = {
    date: todayEntry.date,
    href: pagePathFor(todayEntry),
    title: todayEntry.title || '',
    subtitle: todayEntry.subtitle || '',
    tagline: todayEntry.tagline || '',
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

    const seo = seoFor(e);

    const html = fill(tpl, {
      SEO_TITLE: escapeHtml(seo.title),
      SEO_DESCRIPTION: escapeHtml(seo.description),
      SOCIAL_TITLE: escapeHtml(seo.socialTitle),
      SOCIAL_TITLE_ENC: escapeHtml(encodeURIComponent(seo.socialTitle)),
      CANONICAL_URL: escapeHtml(seo.url),
      CANONICAL_URL_ENC: escapeHtml(encodeURIComponent(seo.url)),
      OG_IMAGE: escapeHtml(seo.image),
      JSON_LD: jsonLdFor(e, seo),
      SERIES_HTML: eyebrowHtml(e),
      HERO_TITLE: hasLeadershipPage(e) ? 'Leadership &amp; Culture' : 'Daily',
      HERO_SUB: hasLeadershipPage(e)
        ? 'For leaders, managers, coaches, pastors and parents.'
        : 'Scripture, reflection, and one clear step to live it out.',
      TITLE: escapeHtml(cleanString(e.headline) || e.title || 'Untitled'),
      SUBTITLE_HTML: (() => {
        const sub = cleanString(e.headline) ? cleanString(e.headline_sub) : cleanString(e.subtitle);
        return sub ? `<span class="daily-subtitle" id="dSubtitle">${escapeHtml(sub)}</span>` : '';
      })(),
      SERIES_NOTE_HTML: cleanString(e.headline) && cleanString(e.series)
        ? `<p class="daily-series-note">Part of the series <em>${escapeHtml(cleanString(e.series))}</em></p>`
        : '',
      TAGLINE_HTML: e.tagline ? `<p class="daily-tagline" id="dTagline">${escapeHtml(e.tagline)}</p>` : '',
      HUMAN_DATE: toHuman(e.date),
      DATE: e.date,
      VERSE_REF: buildPrimaryVerseRefHTML(e),
      VERSE_TEXT: buildPrimaryVerseTextHTML(e),
      INSIGHT_HTML: buildInsightHTML(e),
      ONE_MINUTE_WIN: actionSection ? sectionToPlainText(actionSection) : (e.one_minute_win || ''),
      DECLARATION: declarationSection ? sectionToPlainText(declarationSection) : (e.declaration || ''),
      PREV_HREF: prev ? pagePathFor(prev) : '#',
      NEXT_HREF: next ? pagePathFor(next) : '#'
    });

    // Drop the Action Step / Declaration boxes when this daily doesn't have them
    const cleaned = html
      .replace(/\s*<section class="daily-section">\s*<h3>Action Step<\/h3>\s*<div class="action-step" id="dActionStep">\s*<\/div>\s*<\/section>/, '')
      .replace(/\s*<section class="daily-section">\s*<h3>Declaration<\/h3>\s*<p class="declaration-text" id="dDeclaration">\s*<\/p>\s*<\/section>/, '');

    const outFile = pageFileFor(e);
    await fs.mkdir(path.dirname(outFile), { recursive: true });
    await fs.writeFile(outFile, cleaned, 'utf-8');
  }
}


// ---------- SEO / social metadata ----------
// Optional per-post fields in content/daily/*.json:
//   seo_title        – what Google shows as the blue link (keep under ~60 chars)
//   seo_description  – the snippet under it (aim for 140–160 chars)
//   og_image         – site path to a 1200x630 social card (scripts/og/make-og-card.py)
//   category         – e.g. "Leadership & Culture" (posts in this category appear on /leadership/)
//   series           – e.g. "The Battle Before the Battle"
// Every field is optional; posts without them get sensible defaults.

const DEFAULT_OG_IMAGE = '/assets/og/the-daily.png';
const LEADERSHIP_DIR = path.join(ROOT, 'leadership');
const DEFAULT_DESCRIPTION = 'Daily devotional: scripture, reflection, and a practical next step.';
const LEADERSHIP_CATEGORY = 'Leadership & Culture';

// Where a post lives on the site. Leadership posts with a "slug" get a clean
// /leadership/<slug>/ address; everything else stays at /daily/<file>.html.
function hasLeadershipPage(e) {
  return cleanString(e.category) === LEADERSHIP_CATEGORY && /^[a-z0-9-]+$/.test(cleanString(e.slug));
}

function pagePathFor(e) {
  return hasLeadershipPage(e) ? `/leadership/${cleanString(e.slug)}/` : `/daily/${fileNameFor(e)}`;
}

function pageFileFor(e) {
  return hasLeadershipPage(e)
    ? path.join(LEADERSHIP_DIR, cleanString(e.slug), 'index.html')
    : path.join(DAILY_DIR, fileNameFor(e));
}

function absoluteUrl(p = '') {
  if (/^https?:\/\//i.test(p)) return p;
  return `${SITE_URL}/${String(p).replace(/^\/+/, '')}`;
}

function truncate(text = '', max = 160) {
  const t = String(text).replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:\s]+$/, '') + '…';
}

function displayTitle(e) {
  if (cleanString(e.headline)) return cleanString(e.headline);
  return [e.title || 'Daily', e.subtitle].filter(Boolean).join(': ');
}

function seoFor(e) {
  const url = `${SITE_URL}${pagePathFor(e)}`;
  const seoTitle = cleanString(e.seo_title) || `${displayTitle(e)} | TheWrkShop`;
  const description = truncate(cleanString(e.seo_description) || cleanString(e.tagline) || `${displayTitle(e)}. ${DEFAULT_DESCRIPTION}`);
  return {
    url,
    title: seoTitle,
    socialTitle: cleanString(e.seo_title).replace(/\s*\|\s*TheWrkShop\s*$/i, '') || displayTitle(e),
    description,
    image: absoluteUrl(cleanString(e.og_image) || DEFAULT_OG_IMAGE)
  };
}

function seriesHubHref(e) {
  return cleanString(e.category) === LEADERSHIP_CATEGORY ? '/leadership/' : '';
}

// Small label above the title: the category (linked to its hub) or, failing
// that, the series name when it isn't already the post's title.
function eyebrowHtml(e) {
  const category = cleanString(e.category);
  const series = cleanString(e.series);
  const href = seriesHubHref(e);
  if (category && href) return `<a class="daily-series" href="${href}">${escapeHtml(category)}</a>`;
  if (category) return `<span class="daily-series">${escapeHtml(category)}</span>`;
  if (series && series.toLowerCase() !== cleanString(e.title).toLowerCase()) {
    return `<span class="daily-series">${escapeHtml(series)}</span>`;
  }
  return '';
}

function jsonLdFor(e, seo) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: truncate(seo.socialTitle, 110),
    description: seo.description,
    datePublished: e.date,
    dateModified: e.date,
    url: seo.url,
    mainEntityOfPage: seo.url,
    image: seo.image,
    inLanguage: 'en-US',
    author: { '@id': 'https://thewrkshop.com/#organization' },
    publisher: { '@id': 'https://thewrkshop.com/#organization' },
    isPartOf: { '@id': 'https://thewrkshop.com/#website' }
  };
  if (cleanString(e.category)) data.articleSection = cleanString(e.category);
  if (Array.isArray(e.keywords) && e.keywords.length) data.keywords = e.keywords.join(', ');
  const refs = (e.scriptures || []).map(s => s.ref).filter(Boolean);
  if (refs.length) data.about = refs.map(ref => ({ '@type': 'CreativeWork', name: ref }));
  // keep "</script>" out of the inline JSON
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

// ---------- Leadership hub (/leadership/) ----------

async function buildLeadershipHub(visible) {
  const posts = visible
    .filter(e => cleanString(e.category) === LEADERSHIP_CATEGORY)
    .slice()
    .reverse();

  const outDir = LEADERSHIP_DIR;
  await fs.mkdir(outDir, { recursive: true });

  const tplPath = path.join(ROOT, 'templates', 'leadership.html');
  const tpl = await fs.readFile(tplPath, 'utf-8');

  const cards = posts.length
    ? posts.map(e => {
        const seo = seoFor(e);
        return `
      <article class="lead-card">
        <h2><a href="${pagePathFor(e)}">${escapeHtml(cleanString(e.headline) || e.subtitle || e.title || 'Daily')}</a></h2>
        ${cleanString(e.headline_sub) ? `<p class="lead-sub">${escapeHtml(cleanString(e.headline_sub))}</p>` : ''}
        ${e.tagline ? `<p class="lead-tagline">${escapeHtml(e.tagline)}</p>` : ''}
        <p class="lead-meta"><time datetime="${e.date}">${toHuman(e.date)}</time>${e.verse_ref ? ` · ${escapeHtml(e.verse_ref)}` : ''}</p>
        <a class="lead-read" href="${pagePathFor(e)}" aria-label="Read ${escapeHtml(seo.socialTitle)}">Read →</a>
      </article>`;
      }).join('\n')
    : '<p>New leadership posts are on the way.</p>';

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Leadership & Culture',
    url: `${SITE_URL}/leadership/`,
    isPartOf: { '@id': 'https://thewrkshop.com/#website' },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: posts.map((e, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE_URL}${pagePathFor(e)}`,
        name: seoFor(e).socialTitle
      }))
    }
  };

  const html = fill(tpl, {
    CARDS_HTML: cards,
    JSON_LD: JSON.stringify(itemList).replace(/</g, '\\u003c')
  });
  await fs.writeFile(path.join(outDir, 'index.html'), html, 'utf-8');
  return posts.length;
}

// ---------- Email feed (Kit RSS-to-email reads this) ----------

function xmlEscape(value = '') {
  return String(value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

async function writeDailyFeed(visible) {
  const items = visible.slice(-20).reverse().map(e => {
    const url = `${SITE_URL}${pagePathFor(e)}`;
    const title = [e.title || 'Daily', e.subtitle].filter(Boolean).join(' — ');
    const pubDate = new Date(`${e.date}T06:01:00Z`).toUTCString(); // just after midnight Central
    const html = dailyBodyHtml(e, url).replace(/]]>/g, ']]&gt;');
    return `    <item>
      <title>${xmlEscape(title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${html}]]></description>
      <content:encoded><![CDATA[${html}]]></content:encoded>
    </item>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>TheWrkShop — The Daily</title>
    <link>${SITE_URL}/daily.html</link>
    <atom:link href="${SITE_URL}/daily/feed.xml" rel="self" type="application/rss+xml"/>
    <description>Daily devotionals for men from TheWrkShop: scripture, reflection, and one clear step to live it out.</description>
    <language>en-us</language>
${items}
  </channel>
</rss>
`;
  await fs.writeFile(path.join(DAILY_DIR, 'feed.xml'), xml, 'utf-8');
}

function guardAndMoveLines(visible, older, future) {
  return [
    // posts that moved to /leadership/<slug>/ keep their old daily link working
    ...visible.filter(hasLeadershipPage).map(e => `/daily/${fileNameFor(e)}   ${pagePathFor(e)}   301!`),
    ...older.map(e => `/daily/${fileNameFor(e)}   /daily-archive.html   302!`),
    ...future.map(e => `/daily/${fileNameFor(e)}   /daily-archive.html   302!`)
  ];
}

async function main() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  const entries = await readDailyEntries();
  const today = todayCentralISO();

  const { visible, future, older } = partitionEntries(entries, today);

  // Netlify uses the first matching rule, so moves and guards go before the passthroughs
  await mergeRedirectLines(guardAndMoveLines(visible, older, future));
  await ensurePassthroughs();

  await rebuildDailyOutputDir();
  await writeArchiveJson(visible);
  await writeLatestDailyJson(visible);
  await buildDailyPages(visible);
  const leadershipCount = await buildLeadershipHub(visible);
  await writeDailyFeed(visible);

  console.log(
    `Built ${visible.length} daily pages in [${START_DATE}..${today}]. Older blocked: ${older.length}. Future blocked: ${future.length}. Leadership hub: ${leadershipCount} posts.`
  );
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});