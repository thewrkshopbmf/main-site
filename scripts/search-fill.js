// scripts/search-fill.js
// Fills in the search fields a Daily is missing, so every new post goes in search-ready.
// Runs automatically from insert_content/daily_insert.py for each Daily it creates.
//
//   node scripts/search-fill.js content/daily/<file>.json ...   fill these files
//   node scripts/search-fill.js --upcoming                      fill every Daily dated today or later
//
// What it fills (it never overwrites anything already there):
//   search_phrase  the first keyword (what a man would type into Google)
//   topics         1–3 topic hubs, suggested from the title, keywords and text
//   seo_title      the headline, if there is no search title yet
// What it can't do for you: say the phrase once, in plain words, on the page. It lists any post
// that still needs that sentence (npm run check:search shows the same report).

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { suggestTopics } from './shared/search-topics.js';
import { todayCentralISO } from './shared/render-content.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DAILY_DIR = path.join(ROOT, 'content', 'daily');
const args = process.argv.slice(2);

let files;
if (args.includes('--upcoming')) {
  const today = todayCentralISO();
  files = fs.readdirSync(DAILY_DIR)
    .filter((f) => f.endsWith('.json') && f.slice(0, 10) >= today)
    .map((f) => path.join(DAILY_DIR, f));
} else {
  files = args.filter((a) => !a.startsWith('--')).map((a) => path.resolve(ROOT, a));
}

const clean = (v) => String(v ?? '').replace(/\s+/g, ' ').trim();
const norm = (v) => clean(v).toLowerCase().replace(/[’‘]/g, "'");

// Put a new key right after an existing one, keeping the file's key order readable
function insertAfter(obj, afterKey, key, value) {
  if (!(afterKey in obj)) { obj[key] = value; return obj; }
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (k === key) continue;
    out[k] = v;
    if (k === afterKey) out[key] = value;
  }
  return out;
}

function visibleText(e) {
  const parts = [e.title, e.subtitle, e.headline, e.headline_sub, e.tagline];
  for (const s of e.sections || []) {
    parts.push(s.label);
    for (const b of s.blocks || []) {
      if (b.text) parts.push(b.text);
      if (Array.isArray(b.items)) parts.push(...b.items.map((i) => (typeof i === 'string' ? i : i.text || '')));
    }
  }
  return norm(parts.join(' '));
}

let changed = 0;
const needsSentence = [];
for (const file of files) {
  let entry;
  try { entry = JSON.parse(fs.readFileSync(file, 'utf-8')); } catch (err) { console.log(`⚠️  ${path.basename(file)}: can't read (${err.message})`); continue; }
  const filled = [];
  let e = entry;

  const keywords = Array.isArray(e.keywords) ? e.keywords.map(clean).filter(Boolean) : [];
  if (!clean(e.seo_title) && clean(e.headline)) {
    e = insertAfter(e, 'category', 'seo_title', clean(e.headline));
    filled.push(`seo_title "${e.seo_title}"`);
  }
  if (!clean(e.search_phrase) && keywords.length) {
    e = insertAfter(e, 'seo_description' in e ? 'seo_description' : 'seo_title', 'search_phrase', keywords[0]);
    filled.push(`search_phrase "${keywords[0]}"`);
  }
  if (!Array.isArray(e.topics) || !e.topics.length) {
    const topics = suggestTopics(e);
    if (topics.length) {
      e = insertAfter(e, 'keywords' in e ? 'keywords' : 'search_phrase', 'topics', topics);
      filled.push(`topics ${topics.join(', ')}`);
    }
  }

  if (filled.length) {
    fs.writeFileSync(file, JSON.stringify(e, null, 2) + '\n', 'utf-8');
    changed++;
    console.log(`✓ ${path.basename(file)}: added ${filled.join('; ')}`);
  }
  const phrase = clean(e.search_phrase || keywords[0]);
  if (!phrase) console.log(`⚠️  ${path.basename(file)}: no keywords, so no search phrase. Add "search_phrase" and "keywords".`);
  else if (!visibleText(e).includes(norm(phrase))) needsSentence.push(`${path.basename(file)}: say "${phrase}" once in plain words (The Truth is a good place)`);
}

for (const line of needsSentence) console.log(`✎ ${line}`);
console.log(`[search:fill] ${files.length} file(s) checked; ${changed} updated; ${needsSentence.length} still need the plain-words sentence.`);
