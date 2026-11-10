// scripts/build-topics.js
// Builds the topic hubs: /topics/ (every topic) and /topics/<slug>/ (one page per topic).
// A hub gathers everything TheWrkShop has published on one subject: the tools and studies
// to start with, the Questions men ask, and every Daily, leadership post and weekend post.
// Hubs are what tend to rank for a broad search like "accountability" or "people pleasing",
// and they tell Google and AI search engines what TheWrkShop is about.
//
// Topics are defined in content/topics.json. Posts name theirs in a "topics" field.
// Runs after build:daily, build:blog and build:questions (it reads data/topic-entries.json
// and data/blog-archive.json). It also refreshes the Topics section of llms.txt.
// See docs/SEARCH-SYSTEM.md.

import fs from 'fs/promises';
import { existsSync, readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { fill, toHuman } from './shared/render-content.js';
import { SEARCH_TOPICS, TOPIC_BY_SLUG, topicsFor, topicHref } from './shared/search-topics.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const OUT_DIR = path.join(ROOT, 'topics');
const TPL_PATH = path.join(ROOT, 'templates', 'topic.html');
const QUESTIONS_DIR = path.join(ROOT, 'content', 'questions');
const LLMS_PATH = path.join(ROOT, 'llms.txt');
const SITE = 'https://thewrkshop.com';

const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const decode = (v) => String(v ?? '')
  .replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const jsonLd = (data) => JSON.stringify(data).replace(/</g, '\\u003c');

async function readJson(file, fallback) {
  try { return JSON.parse(await fs.readFile(file, 'utf-8')); } catch { return fallback; }
}

// Title and description of a tool or study page, read from the page itself so the hub
// always matches what the page says.
function resourceInfo(href) {
  const rel = href.replace(/^\/+/, '').split('#')[0];
  const candidates = rel.endsWith('.html') ? [rel] : [path.join(rel, 'index.html'), `${rel.replace(/\/$/, '')}.html`];
  for (const c of candidates) {
    const file = path.join(ROOT, c);
    if (!existsSync(file)) continue;
    const html = readFileSync(file, 'utf-8');
    const title = decode((html.match(/<title>([^<]*)<\/title>/i) || [])[1] || '')
      .replace(/\s*\|\s*TheWrkShop\s*$/i, '').replace(/\s*\|\s*The Belief Project\s*$/i, '').trim();
    const description = decode((html.match(/<meta\s+name="description"\s+content="([^"]*)"/i) || [])[1] || '').trim();
    return { href, title, description };
  }
  return null;
}

function kindLabel(item) {
  if (item.kind === 'feature') return 'Leadership study';
  if (item.kind === 'leadership') return 'Leadership · Daily';
  if (item.kind === 'blog') return 'Weekend 4-3-2-1';
  return 'Daily';
}

function itemCard(item) {
  const meta = [item.date ? `<time datetime="${esc(item.date)}">${esc(toHuman(item.date))}</time>` : '', item.verse_ref ? esc(item.verse_ref) : '']
    .filter(Boolean).join(' · ');
  return `      <article class="topic-card">
        <p class="topic-kicker">${esc(kindLabel(item))}</p>
        <h3><a href="${esc(item.href)}">${esc(item.title)}</a></h3>
        ${item.description ? `<p>${esc(item.description)}</p>` : ''}
        ${meta ? `<p class="topic-meta">${meta}</p>` : ''}
      </article>`;
}

function toolCard(r) {
  return `      <article class="topic-card topic-card--tool">
        <h3><a href="${esc(r.href)}">${esc(r.title)}</a></h3>
        ${r.description ? `<p>${esc(r.description)}</p>` : ''}
      </article>`;
}

function ogImageFor(slug) {
  const own = path.join(ROOT, 'assets', 'og', 'topics', `${slug}.png`);
  return existsSync(own) ? `${SITE}/assets/og/topics/${slug}.png` : `${SITE}/assets/og/the-daily.png`;
}

function crumbs(name) {
  return `<nav class="topic-crumbs" aria-label="Breadcrumb"><a href="/">Home</a> › <a href="/topics/">Topics</a>${name ? ` › <span>${esc(name)}</span>` : ''}</nav>`;
}

async function main() {
  const tpl = await fs.readFile(TPL_PATH, 'utf-8');

  // Everything published, already filtered to what is live by build:daily and build:blog.
  const posts = await readJson(path.join(DATA_DIR, 'topic-entries.json'), []);
  const blogs = (await readJson(path.join(DATA_DIR, 'blog-archive.json'), [])).map((b) => ({
    kind: 'blog', date: b.date, title: b.title, description: b.description || b.excerpt || '', href: b.href,
    topics: Array.isArray(b.topics) ? b.topics : []
  }));
  const questions = [];
  for (const f of (await fs.readdir(QUESTIONS_DIR).catch(() => [])).filter((f) => f.endsWith('.json')).sort()) {
    const q = await readJson(path.join(QUESTIONS_DIR, f), null);
    if (!q?.slug) continue;
    questions.push({ kind: 'question', title: q.question, description: q.description, href: `/questions/${q.slug}/`, topics: topicsFor(q) });
  }

  const unknown = new Set();
  for (const it of [...posts, ...blogs, ...questions]) {
    for (const s of it.topics || []) if (!TOPIC_BY_SLUG.has(s)) unknown.add(s);
  }
  if (unknown.size) console.warn(`[topics] ⚠️ Unknown topic slugs (add them to content/topics.json or fix the post): ${[...unknown].join(', ')}`);

  await fs.rm(OUT_DIR, { recursive: true, force: true });
  await fs.mkdir(OUT_DIR, { recursive: true });

  const summary = [];
  for (const t of SEARCH_TOPICS) {
    const has = (it) => (it.topics || []).includes(t.slug);
    const toolHrefs = new Set(t.resources || []);
    const tPosts = posts.filter((it) => has(it) && !toolHrefs.has(it.href)).sort((a, b) => b.date.localeCompare(a.date));
    const tBlogs = blogs.filter(has).sort((a, b) => b.date.localeCompare(a.date));
    const tQuestions = questions.filter(has);
    const tools = (t.resources || []).map(resourceInfo).filter(Boolean);
    const missing = (t.resources || []).filter((h) => !tools.some((r) => r.href === h));
    if (missing.length) console.warn(`[topics] ⚠️ ${t.slug}: resource page not found: ${missing.join(', ')}`);

    // Related topics: the ones that show up most often alongside this one
    const co = new Map();
    for (const it of [...tPosts, ...tBlogs, ...tQuestions]) {
      for (const s of it.topics || []) if (s !== t.slug && TOPIC_BY_SLUG.has(s)) co.set(s, (co.get(s) || 0) + 1);
    }
    const related = [...co.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([s]) => TOPIC_BY_SLUG.get(s));

    const count = tPosts.length + tBlogs.length;
    const newest = [...tPosts, ...tBlogs].map((it) => it.date).filter(Boolean).sort().at(-1) || '';
    summary.push({ topic: t, count, questions: tQuestions.length, tools: tools.length, newest });

    const url = `${SITE}${topicHref(t.slug)}`;
    const body = [
      `    <p class="topic-intro">${esc(t.intro)}</p>`,
      tools.length ? `    <h2 class="topic-h2">Start here</h2>\n    <div class="topic-grid topic-grid--tools">\n${tools.map(toolCard).join('\n')}\n    </div>` : '',
      tQuestions.length ? `    <h2 class="topic-h2">Questions men ask</h2>\n    <ul class="topic-questions">\n${tQuestions.map((q) => `      <li><a href="${esc(q.href)}">${esc(q.title)}</a></li>`).join('\n')}\n    </ul>` : '',
      tPosts.length ? `    <h2 class="topic-h2">Devotionals on ${esc(t.name)}</h2>\n    <div class="topic-grid">\n${tPosts.map(itemCard).join('\n')}\n    </div>` : '',
      tBlogs.length ? `    <h2 class="topic-h2">Weekend 4-3-2-1 posts</h2>\n    <div class="topic-grid">\n${tBlogs.map(itemCard).join('\n')}\n    </div>` : '',
      related.length ? `    <h2 class="topic-h2">Related topics</h2>\n    <ul class="topic-chips">\n${related.map((r) => `      <li><a href="${topicHref(r.slug)}">${esc(r.name)}</a></li>`).join('\n')}\n    </ul>` : ''
    ].filter(Boolean).join('\n\n');

    const listItems = [...tQuestions, ...tPosts, ...tBlogs];
    const data = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          '@id': `${url}#page`,
          name: t.title,
          description: t.description,
          url,
          inLanguage: 'en-US',
          about: { '@type': 'Thing', name: t.name },
          keywords: (t.search_phrases || []).join(', '),
          isPartOf: { '@id': `${SITE}/#website` },
          publisher: { '@id': `${SITE}/#organization` },
          breadcrumb: { '@id': `${url}#breadcrumb` },
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: listItems.length,
            itemListElement: listItems.map((it, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE}${it.href}`, name: it.title }))
          }
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${url}#breadcrumb`,
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
            { '@type': 'ListItem', position: 2, name: 'Topics', item: `${SITE}/topics/` },
            { '@type': 'ListItem', position: 3, name: t.name, item: url }
          ]
        }
      ]
    };

    const html = fill(tpl, {
      SEO_TITLE: esc(`${t.title} | TheWrkShop`),
      SOCIAL_TITLE: esc(t.title),
      SEO_DESCRIPTION: esc(t.description),
      CANONICAL_URL: esc(url),
      OG_IMAGE: esc(ogImageFor(t.slug)),
      JSON_LD: jsonLd(data),
      H1: esc(t.title.split(':')[0]),
      HERO_SUB: esc(t.title.includes(':') ? t.title.split(':').slice(1).join(':').trim() : 'Devotionals, tools and studies from TheWrkShop'),
      CRUMBS_HTML: crumbs(t.name),
      BODY_HTML: body
    });
    await fs.mkdir(path.join(OUT_DIR, t.slug), { recursive: true });
    await fs.writeFile(path.join(OUT_DIR, t.slug, 'index.html'), html, 'utf-8');
  }

  // /topics/ — every topic, biggest first
  const sorted = summary.slice().sort((a, b) => b.count - a.count || a.topic.name.localeCompare(b.topic.name));
  const indexUrl = `${SITE}/topics/`;
  const indexBody = `    <p class="topic-intro">Every Daily, leadership post and weekend post TheWrkShop has published, gathered by subject. Pick the battle you're in: each topic starts with a free tool or study, then the Questions men ask about it, then every devotional on it.</p>
    <div class="topic-index">
${sorted.map(({ topic: t, count, questions: qn, tools }) => `      <article class="topic-card">
        <h3><a href="${topicHref(t.slug)}">${esc(t.name)}</a></h3>
        <p>${esc(t.description)}</p>
        <p class="topic-meta">${count} ${count === 1 ? 'post' : 'posts'}${qn ? ` · ${qn} ${qn === 1 ? 'question' : 'questions'}` : ''}${tools ? ` · ${tools} ${tools === 1 ? 'tool' : 'tools'}` : ''}</p>
      </article>`).join('\n')}
    </div>`;
  const indexData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Topics',
    description: 'Devotionals, tools and studies for Christian men and leaders, by topic.',
    url: indexUrl,
    isPartOf: { '@id': `${SITE}/#website` },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: sorted.map(({ topic: t }, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE}${topicHref(t.slug)}`, name: t.name }))
    }
  };
  await fs.writeFile(path.join(OUT_DIR, 'index.html'), fill(tpl, {
    SEO_TITLE: 'Topics: Devotionals and Tools for Christian Men by Subject | TheWrkShop',
    SOCIAL_TITLE: 'Topics | TheWrkShop',
    SEO_DESCRIPTION: 'Browse TheWrkShop by topic: accountability, leadership, anger, people-pleasing, temptation, prayer, purpose and more. Devotionals, tools and studies for men.',
    CANONICAL_URL: indexUrl,
    OG_IMAGE: `${SITE}/assets/og/the-daily.png`,
    JSON_LD: jsonLd(indexData),
    H1: 'Topics',
    HERO_SUB: 'Find what TheWrkShop has written on the battle you are in.',
    CRUMBS_HTML: crumbs(''),
    BODY_HTML: indexBody
  }), 'utf-8');

  // Last-updated dates for the sitemap: a hub changes when a post joins it
  const dates = summary.filter((x) => x.newest).map((x) => ({ href: topicHref(x.topic.slug), date: x.newest }));
  const newestAll = dates.map((d) => d.date).sort().at(-1);
  if (newestAll) dates.push({ href: '/topics/', date: newestAll });
  await fs.writeFile(path.join(DATA_DIR, 'topic-archive.json'), JSON.stringify(dates, null, 2));

  await updateLlmsTxt(summary);

  console.log(`[topics] Built ${SEARCH_TOPICS.length} topic hubs + /topics/:`);
  for (const { topic: t, count, questions: qn, tools } of sorted) console.log(`  - /topics/${t.slug}/  posts=${count} questions=${qn} tools=${tools}`);
}

// Keep the Topics section of llms.txt (the summary AI search engines read) in step with the hubs.
async function updateLlmsTxt(sorted) {
  let txt;
  try { txt = await fs.readFile(LLMS_PATH, 'utf-8'); } catch { return; }
  const START = '<!-- topics:start -->';
  const END = '<!-- topics:end -->';
  const section = [
    START,
    '## Topics',
    '',
    'Hubs that gather every devotional, Question and tool on one subject:',
    '',
    ...sorted.map(({ topic: t }) => `- [${t.name}](${SITE}${topicHref(t.slug)}): ${t.description}`),
    END
  ].join('\n');
  let next;
  if (txt.includes(START) && txt.includes(END)) {
    next = txt.replace(new RegExp(`${START}[\\s\\S]*?${END}`), section);
  } else if (txt.includes('\n## Resources')) {
    next = txt.replace('\n## Resources', `\n${section}\n\n## Resources`);
  } else {
    next = `${txt.trimEnd()}\n\n${section}\n`;
  }
  if (next !== txt) await fs.writeFile(LLMS_PATH, next, 'utf-8');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
