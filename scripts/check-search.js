// scripts/check-search.js
// The pre-publish search check. For each upcoming post (Dailies, leadership pieces, weekend
// blog posts and Questions) it asks the questions in docs/SEARCH-SYSTEM.md:
//   1. Is there a search phrase (what a man would type into Google)?
//   2. Is it in the Google title or snippet?
//   3. Is it said once, in plain words, in the visible text?
//   4. Does the post name its topics, and are the title and snippet the right length?
// It only warns; it never stops a build.
//
//   npm run check:search            posts dated today or later (what is about to publish)
//   npm run check:search -- --all   every post (the archive report)
//   npm run check:search -- --all --quiet   just the totals

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { todayCentralISO } from './shared/render-content.js';
import { TOPIC_BY_SLUG, suggestTopics } from './shared/search-topics.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ALL = process.argv.includes('--all');
const QUIET = process.argv.includes('--quiet');
const today = todayCentralISO();

const norm = (v) => String(v ?? '').toLowerCase().replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

function readDir(dir) {
  const full = path.join(ROOT, 'content', dir);
  if (!fs.existsSync(full)) return [];
  return fs.readdirSync(full).filter((f) => f.endsWith('.json')).sort().map((f) => ({
    file: `content/${dir}/${f}`,
    kind: dir,
    entry: JSON.parse(fs.readFileSync(path.join(full, f), 'utf-8'))
  }));
}

// What a reader sees on the page, without the Topics line (which is added automatically).
function visibleText(e) {
  const parts = [];
  const walk = (v) => {
    if (!v) return;
    if (typeof v === 'string') parts.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (typeof v === 'object') Object.values(v).forEach(walk);
  };
  [e.headline, e.headline_sub, e.subtitle, e.tagline, e.question, e.answer, e.excerpt].forEach(walk);
  walk(e.sections); walk(e.body_html); walk(e.steps); walk(e.faqs);
  walk(e.one_minute_win); walk(e.declaration);
  return norm(parts.join(' '));
}

function phraseFound(phrase, text) {
  const p = norm(phrase).trim();
  if (!p) return 'no';
  if (text.includes(p)) return 'yes';
  const words = p.split(' ').filter((w) => w.length > 3);
  if (words.length > 1 && words.every((w) => text.includes(w))) return 'partly';
  return 'no';
}

function check({ file, kind, entry: e }) {
  const notes = [];
  const seoTitle = String(e.seo_title || '').replace(/\s*\|\s*TheWrkShop\s*$/i, '').trim();
  const seoDesc = String(e.seo_description || e.description || '').trim();
  // Without a search_phrase, use the first keyword that isn't a generic label
  const GENERIC = new Set(['leadership', 'christian leadership', 'devotional for men', 'christian men', 'men']);
  const firstKeyword = (Array.isArray(e.keywords) ? e.keywords : []).find((k) => !GENERIC.has(String(k).toLowerCase().trim()));
  const phrase = String(e.search_phrase || firstKeyword || '').trim();

  // In the archive report, a post with keywords doesn't need a separate search_phrase.
  if (!e.search_phrase && !(ALL && phrase) && kind !== 'questions') notes.push(phrase
    ? `no "search_phrase" (using the first keyword, "${phrase}"). Ask: what would a man type into Google about this?`
    : 'no "search_phrase" and no keywords. Ask: what would a man type into Google about this?');
  if (!seoTitle) notes.push('no "seo_title" (the blue link in Google).');
  else if (seoTitle.length > 62) notes.push(`"seo_title" is ${seoTitle.length} characters; Google cuts off around 60.`);
  if (!seoDesc) notes.push('no "seo_description" (the snippet under the link).');
  else if (seoDesc.length < 110 || seoDesc.length > 165) notes.push(`"seo_description" is ${seoDesc.length} characters; aim for 140–160.`);
  if (kind !== 'questions' && kind !== 'blog' && (!Array.isArray(e.keywords) || e.keywords.length < 3)) notes.push('fewer than 3 "keywords".');

  if (phrase && kind !== 'questions') {
    if (phraseFound(phrase, norm(`${seoTitle} ${seoDesc}`)) === 'no') notes.push(`"${phrase}" isn't in the Google title or snippet.`);
    const inBody = phraseFound(phrase, visibleText(e));
    if (inBody === 'no') notes.push(`"${phrase}" never appears in the visible text. Say it once in plain words (The Truth is a good place).`);
    else if (inBody === 'partly') notes.push(`"${phrase}" appears only in pieces in the visible text. Consider saying it once as a phrase.`);
  }

  const own = Array.isArray(e.topics) ? e.topics : [];
  const bad = own.filter((s) => !TOPIC_BY_SLUG.has(s));
  if (!own.length) {
    const s = suggestTopics(e);
    notes.push(`no "topics". Suggested: ${s.length ? JSON.stringify(s) : '(none matched; pick from content/topics.json)'}.`);
  }
  if (bad.length) notes.push(`unknown topics ${JSON.stringify(bad)}; use slugs from content/topics.json.`);

  if (kind === 'daily' && /battle before the battle/i.test(seoTitle)) notes.push('the series name leads the Google title; lead with the topic instead.');
  return notes;
}

const items = [...readDir('daily'), ...readDir('leadership'), ...readDir('blog'), ...readDir('questions')]
  .filter(({ kind, entry }) => ALL || (kind !== 'questions' && String(entry.date || '') >= today));

let flagged = 0;
const counts = {};
for (const it of items) {
  const notes = check(it);
  if (!notes.length) continue;
  flagged++;
  for (const n of notes) {
    const key = n.replace(/".*?"/g, '…').replace(/\d+/g, '#').slice(0, 60);
    counts[key] = (counts[key] || 0) + 1;
  }
  if (!QUIET) {
    const label = it.entry.date ? `${it.entry.date} ` : '';
    console.log(`\n⚠️  ${label}${it.file}`);
    for (const n of notes) console.log(`   - ${n}`);
  }
}

const scope = ALL ? 'all posts' : `posts dated ${today} or later`;
console.log(`\n[check:search] ${items.length} ${scope} checked; ${flagged} with suggestions.${flagged ? ' (Warnings only: nothing was blocked.)' : ''}`);
if (ALL && QUIET) for (const [k, v] of Object.entries(counts).sort((a, b) => b[1] - a[1])) console.log(`  ${String(v).padStart(4)}  ${k}`);
