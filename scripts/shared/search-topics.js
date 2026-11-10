// scripts/shared/search-topics.js
// Topic hubs for search: thewrkshop.com/topics/<slug>/.
// The topic list lives in content/topics.json. Every Daily, leadership piece, blog post
// and Question names its topics in a "topics" field, e.g.  "topics": ["accountability", "leadership"].
// A post without that field still gets topics: suggestTopics() matches the post's own words
// against each topic's "match" list. scripts/check-search.js warns when a post relies on that.
// See docs/SEARCH-SYSTEM.md.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..', '..');
export const TOPICS_FILE = path.join(ROOT, 'content', 'topics.json');

const LEADERSHIP_CATEGORY = 'Leadership & Culture';

export const SEARCH_TOPICS = JSON.parse(fs.readFileSync(TOPICS_FILE, 'utf-8')).topics;
export const TOPIC_BY_SLUG = new Map(SEARCH_TOPICS.map((t) => [t.slug, t]));

const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clean = (v) => (typeof v === 'string' ? v.trim() : '');

export function topicHref(slug) {
  return `/topics/${slug}/`;
}

// The words a reader and Google see first: titles, the Google title and snippet, keywords.
export function headlineText(entry) {
  const title = clean(entry.title) === 'The Battle Before The Battle' ? '' : entry.title;
  return [entry.seo_title, entry.seo_description, entry.headline, entry.headline_sub, entry.subtitle,
    entry.tagline, title, entry.question, entry.description, entry.excerpt,
    ...(Array.isArray(entry.keywords) ? entry.keywords : [])]
    .filter((v) => typeof v === 'string' && v.trim())
    .join(' ')
    .toLowerCase();
}

// The body a reader scrolls through (sections, blog body, Question answer and steps).
export function bodyText(entry) {
  const parts = [];
  const walk = (v) => {
    if (!v) return;
    if (typeof v === 'string') parts.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (typeof v === 'object') Object.values(v).forEach(walk);
  };
  walk(entry.sections);
  walk(entry.body_html);
  walk(entry.answer);
  walk(entry.steps);
  walk(entry.one_minute_win);
  walk(entry.declaration);
  return parts.join(' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').toLowerCase();
}

function countHits(text, word) {
  const w = word.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return (text.match(new RegExp(`\\b${w}`, 'g')) || []).length;
}

// Suggest up to `max` topics from the post's own words. Words in the titles and keywords
// count far more than words deep in the body.
export function suggestTopics(entry, max = 3) {
  const head = headlineText(entry);
  const body = bodyText(entry);
  const scored = [];
  for (const t of SEARCH_TOPICS) {
    const words = Array.isArray(t.match) ? t.match : [];
    const headHits = words.reduce((n, w) => n + countHits(head, w), 0);
    const bodyHits = words.reduce((n, w) => n + countHits(body, w), 0);
    let score = 3 * headHits + Math.min(bodyHits, 8) * 0.5;
    if (t.slug === 'leadership' && clean(entry.category) === LEADERSHIP_CATEGORY) score += 10;
    if (score >= 3) scored.push({ slug: t.slug, score, headHits });
  }
  scored.sort((a, b) => b.score - a.score);
  // Keep the strongest match; keep the others only when the titles or keywords mention them.
  return scored
    .filter((s, i) => i === 0 || s.headHits > 0)
    .slice(0, max)
    .map((s) => s.slug);
}

// The topics for a post: its own "topics" field when it has one, otherwise suggested ones.
export function topicsFor(entry) {
  const own = (Array.isArray(entry.topics) ? entry.topics : [])
    .map(clean)
    .filter((slug) => TOPIC_BY_SLUG.has(slug));
  const list = own.length ? own : suggestTopics(entry);
  if (clean(entry.category) === LEADERSHIP_CATEGORY && !list.includes('leadership')) list.push('leadership');
  return [...new Set(list)];
}

export function topicNames(slugs) {
  return slugs.map((s) => TOPIC_BY_SLUG.get(s)?.name).filter(Boolean);
}

// "Topics: Accountability · Christian Leadership" — the plain words, visible on the page,
// each linking to its hub.
export function topicsLineHtml(slugs) {
  const links = slugs
    .filter((s) => TOPIC_BY_SLUG.has(s))
    .map((s) => `<a href="${topicHref(s)}">${esc(TOPIC_BY_SLUG.get(s).name)}</a>`);
  if (!links.length) return '';
  return `<nav class="topic-links" aria-label="Topics"><span class="topic-links-label">Topics:</span> ${links.join('<span class="topic-links-sep" aria-hidden="true"> · </span>')} <a class="topic-links-all" href="/topics/">All topics →</a></nav>`;
}
