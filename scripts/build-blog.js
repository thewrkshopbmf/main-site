// scripts/build-blog.js
import fs from 'fs/promises';
import { nextStepsHtml } from './shared/next-steps.js';
import { topicsFor, topicsLineHtml, topicNames } from './shared/search-topics.js';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  todayCentralISO,
  toHuman,
  fill,
  blogFileNameFor as fileNameFor,
  buildBlogBodyHTML
} from './shared/render-content.js';

const __filename = fileURLToPath(import.meta.url);
const SITE_URL = 'https://thewrkshop.com';
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const CONTENT_DIR = path.join(ROOT, 'content', 'blog');
const DATA_DIR = path.join(ROOT, 'data');
const BLOG_DIR = path.join(ROOT, 'blog');
const TPL_PATH = path.join(ROOT, 'templates', 'blog.html');
const REDIRECTS = path.join(ROOT, '_redirects');

const START_DATE = '2025-08-01';
const GO_DEEPER_FROM = '2026-10-01';

async function mergeRedirectLines(linesToEnsure) {
  let existing = '';
  try {
    existing = await fs.readFile(REDIRECTS, 'utf-8');
  } catch {}

  const existingLines = existing
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

  const set = new Set(existingLines);
  for (const line of linesToEnsure) {
    if (line && !set.has(line)) {
      existingLines.push(line);
      set.add(line);
    }
  }

  // Netlify uses the first matching rule: keep the catch-all "200" passthroughs
  // last so redirects and release guards above them actually apply.
  const isPassthrough = l => /\s200!?$/.test(l);
  const ordered = [...existingLines.filter(l => !isPassthrough(l)), ...existingLines.filter(isPassthrough)];
  await fs.writeFile(REDIRECTS, ordered.join('\n') + '\n', 'utf-8');
}

// Hand-kept permanent redirects (moved/removed pages) live in config/redirects.txt
async function readPermanentRedirects() {
  try {
    const raw = await fs.readFile(path.join(ROOT, 'config', 'redirects.txt'), 'utf-8');
    return raw
      .split('\n')
      .map(l => l.trim())
      .filter(l => l && !l.startsWith('#'))
      .map(l => l.split(/\s+/).join('   '));
  } catch {
    return [];
  }
}

async function ensurePassthroughs() {
  await mergeRedirectLines([
    '/blog/*   /blog/:splat   200',
    '/daily/*   /daily/:splat   200'
  ]);
  console.log('✅ Ensured passthrough rules for /blog/* and /daily/*.');
}

// Optional podcast/audio for a post, same fields as the Dailies:
// audio_file (a site path like /assets/audio/....m4a) or audio_link (https://, e.g. a Spotify episode),
// plus optional audio_label and audio_note.
function audioHtml(e, esc) {
  const clean = v => String(v ?? '').trim();
  const file = clean(e.audio_file);
  const label = clean(e.audio_label) || 'Listen to the Conversation';
  if (/^\/[A-Za-z0-9/_.-]+$/.test(file)) {
    const note = clean(e.audio_note) || 'An audio discussion of this post.';
    const type = /\.mp3$/i.test(file) ? 'audio/mpeg' : 'audio/mp4';
    return `<div class="daily-audio daily-audio--player"><p class="daily-audio-title"><span aria-hidden="true">🎧</span> ${esc(label)}</p><audio class="daily-audio-player" controls preload="metadata" aria-label="${esc(label)}"><source src="${esc(file)}" type="${type}"><a href="${esc(file)}">Download the audio</a></audio><p class="daily-audio-note">${esc(note)}</p></div>`;
  }
  const url = clean(e.audio_link);
  if (!/^https:\/\//i.test(url)) return '';
  const note = clean(e.audio_note) || 'An audio discussion of this post. Opens in a new tab.';
  return `<div class="daily-audio"><a class="daily-audio-btn" href="${esc(url)}" target="_blank" rel="noopener" aria-label="${esc(label)} (opens in a new tab)"><span aria-hidden="true">🎧</span><span>${esc(label)}</span></a><p class="daily-audio-note">${esc(note)}</p></div>`;
}

// The Dailies a weekend post was drawn from: everything published in the 7 days up to the post.
const SERIES_TITLE_RE = /^the battle before the battle$/i;
function dailyName(d) {
  const t = String(d.title || '').trim();
  return (SERIES_TITLE_RE.test(t) && d.subtitle) ? String(d.subtitle).trim() : (t || String(d.subtitle || '').trim());
}
function weekDailiesFor(post, dailies) {
  const end = post.date;
  const start = new Date(new Date(end + 'T12:00:00Z').getTime() - 6 * 864e5).toISOString().slice(0, 10);
  return dailies
    .filter(d => d.date >= start && d.date <= end && d.href)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(d => ({
      date: d.date,
      day: new Date(d.date + 'T12:00:00Z').toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' }),
      title: dailyName(d),
      verse_ref: d.verse_ref || '',
      href: d.href
    }));
}
function oneMinuteWinOf(bodyHTML) {
  const m = String(bodyHTML).match(/One-Minute Win[^<]*<\/strong>\s*(?:<br\s*\/?>)?\s*([\s\S]*?)<\/p>/i);
  return m ? m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : '';
}
const escText = v => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
function goDeeperHtml(week) {
  if (!week.length) return '';
  const items = week.map(d => `<li><a href="${escText(d.href)}"><span class="gd-title">${escText(d.title)}</span><span class="gd-meta">${escText(d.day)}${d.verse_ref ? ' · ' + escText(d.verse_ref) : ''}</span></a></li>`).join('');
  return `<section class="go-deeper" aria-labelledby="goDeeperTitle"><h2 id="goDeeperTitle">Want to go deeper?</h2><p>This week’s 4-3-2-1 came from these Dailies. Tap any one to sit with the full day.</p><ul>${items}</ul></section>`;
}

// Unlisted bonus posts (content/bonus/*.json -> /bonus/<slug>/): same page design as the blog,
// but not in the blog list, sitemap, search or the Friday email, and marked noindex.
// Used for extras such as a thank-you 4-3-2-1 for new subscribers.
async function buildBonusPages(tpl) {
  const BONUS_SRC = path.join(ROOT, 'content', 'bonus');
  const BONUS_OUT = path.join(ROOT, 'bonus');
  let files = [];
  try { files = (await fs.readdir(BONUS_SRC)).filter(f => f.endsWith('.json')); } catch {}
  await fs.rm(BONUS_OUT, { recursive: true, force: true });
  if (!files.length) return;
  const attr = v => String(v ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  for (const f of files) {
    const e = JSON.parse(await fs.readFile(path.join(BONUS_SRC, f), 'utf-8'));
    const slug = f.replace(/\.json$/, '');
    // "hold": true keeps a bonus page on the staging preview only (not built on thewrkshop.com)
    const isStagingPreview = process.env.CONTEXT === 'branch-deploy' && process.env.BRANCH === 'staging';
    if (e.hold && !isStagingPreview) { console.log(' - bonus on hold (staging only):', `/bonus/${slug}/`); continue; }
    const bodyHTML = is4321(e) ? accent4321(buildBlogBodyHTML(e)) : buildBlogBodyHTML(e);
    const canonical = `${SITE_URL}/bonus/${slug}/`;
    const title = String(e.title || 'Bonus').trim();
    const spokenWords = `${title} ${bodyHTML}`.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    const html = fill(tpl, {
      SEO_TITLE: attr(`${title} | TheWrkShop`),
      SOCIAL_TITLE: attr(title),
      SOCIAL_TITLE_ENC: attr(encodeURIComponent(title)),
      SEO_DESCRIPTION: attr(e.excerpt || ''),
      CANONICAL_URL: attr(canonical),
      CANONICAL_URL_ENC: attr(encodeURIComponent(canonical)),
      ROBOTS_META: '<meta name="robots" content="noindex"/>',
      ARTICLE_CLASS: is4321(e) ? 'blog-post w4321 is-bonus' : 'blog-post is-bonus',
      HERO_HTML: heroHtml(e, attr),
      OG_IMAGE: attr(`${SITE_URL}/assets/og/site.png`),
      JSON_LD: '{}',
      TITLE: title,
      CATEGORY: e.category || 'Bonus',
      DATE: '',
      HUMAN_DATE: '',
      EXCERPT: e.excerpt || '',
      AUTHOR: e.author || '',
      READING_MIN: String(e.reading_minutes || 0),
      BODY_HTML: bodyHTML,
      TOPICS_HTML: topicsLineHtml(topicsFor(e)),
      NEXT_STEPS_HTML: nextStepsHtml(e, 'blog'),
      POST_KEY: '',
      LISTEN_MIN: String(Math.max(1, Math.round(spokenWords / 155))),
      AUDIO_HTML: audioHtml(e, attr),
      GO_DEEPER_HTML: '',
      PREV_HREF: '#',
      NEXT_HREF: '#'
    });
    const out = path.join(BONUS_OUT, slug, 'index.html');
    await fs.mkdir(path.dirname(out), { recursive: true });
    await fs.writeFile(out, html, 'utf-8');
    console.log(' - bonus (unlisted):', `/bonus/${slug}/`);
  }
}

// Weekend 4-3-2-1 accents: mark the numbered headings, Gems and the 1 Action Step so the
// template can give them the bronze accent (text stays exactly as written).
function accent4321(html) {
  return String(html)
    .replace(/<h2 class="h2">(?=[1-4]\s)/g, '<h2 class="h2 h2-num">')
    .replace(/<p><em>Gem:<\/em>/g, '<p class="gem"><em>Gem:</em>')
    .replace(/<section class="section">(\s*<h2 class="h2 h2-num">1 Action Step)/g, '<section class="section action">$1');
}
const is4321 = e => /4-3-2-1/.test(e.category || '');
function heroHtml(e, esc) {
  const src = String(e.hero_image || '').trim();
  // A site path (/assets/...) or an image in the site's public Supabase image folder (site-media)
  const ok = /^\/[A-Za-z0-9/_.-]+\.(jpe?g|png|webp)$/i.test(src) ||
    /^https:\/\/dtgkcjuhrwjpvhycydfq\.supabase\.co\/storage\/v1\/object\/public\/site-media\/[A-Za-z0-9/_.-]+\.(jpe?g|png|webp)$/i.test(src);
  if (!ok) return '';
  return `<figure class="post-hero"><img src="${esc(src)}" alt="${esc(e.hero_image_alt || '')}" width="1600" height="800" loading="eager" fetchpriority="high"></figure>`;
}

async function main() {
  await ensurePassthroughs();
  let dailyArchive = [];
  try { dailyArchive = JSON.parse(await fs.readFile(path.join(DATA_DIR, 'daily-archive.json'), 'utf-8')); } catch {
    console.warn('[blog] data/daily-archive.json not found (run build:daily first); "go deeper" lists will be empty');
  }
  await fs.mkdir(DATA_DIR, { recursive: true });

  let files = [];
  try {
    files = (await fs.readdir(CONTENT_DIR)).filter(f => f.endsWith('.json'));
  } catch {}

  const entries = [];
  for (const f of files) {
    const raw = await fs.readFile(path.join(CONTENT_DIR, f), 'utf-8');
    const j = JSON.parse(raw);

    if (!j.date || !/^\d{4}-\d{2}-\d{2}$/.test(j.date)) {
      throw new Error(`Bad/missing "date" in ${f}`);
    }
    if (!j.title) {
      throw new Error(`Missing "title" in ${f}`);
    }

    entries.push(j);
  }

  entries.sort((a, b) => a.date.localeCompare(b.date));
  // On the staging preview, show weekend posts up to a week ahead so the Friday draft can be reviewed
  // before it goes live. Production (thewrkshop.com) only shows posts dated before today, plus a post
  // dated today once it is 2 pm Central (the Weekend 4-3-2-1 goes live Fridays at 2 pm; see
  // netlify/functions/daily-release.mjs, which triggers the 2 pm rebuild).
  const BLOG_RELEASE_HOUR = 14;
  const isStagingPreview = process.env.CONTEXT === 'branch-deploy' && process.env.BRANCH === 'staging';
  const today = isStagingPreview
    ? new Date(new Date(todayCentralISO() + 'T12:00:00Z').getTime() + 7 * 864e5).toISOString().slice(0, 10)
    : todayCentralISO();
  const centralHour = Number(new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago', hour: '2-digit', hourCycle: 'h23'
  }).format(new Date()));
  const releasedToday = isStagingPreview || centralHour >= BLOG_RELEASE_HOUR;
  if (isStagingPreview) console.log(`[blog] staging preview: showing posts dated through ${today}`);
  else if (!releasedToday) console.log(`[blog] before 2 pm Central: posts dated ${today} stay hidden until the 2 pm release`);

  const isVisible = e => e.date < today || (e.date === today && releasedToday);
  const allowed = entries.filter(e => e.date >= START_DATE);
  const visible = allowed.filter(isVisible);
  const future = allowed.filter(e => !isVisible(e));
  const older = entries.filter(e => e.date < START_DATE);

  try {
    await fs.rm(BLOG_DIR, { recursive: true, force: true });
  } catch {}
  await fs.mkdir(BLOG_DIR, { recursive: true });

  const archive = visible
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(e => ({
      date: e.date,
      title: e.title || '',
      category: e.category || '',
      excerpt: e.excerpt || '',
      author: e.author || '',
      reading_minutes: e.reading_minutes || 0,
      href: `/blog/${path.dirname(fileNameFor(e))}/`,
      description: String(e.seo_description || e.excerpt || '').replace(/\s+/g, ' ').trim(),
      image: e.hero_image || '',
      topics: topicsFor(e)
    }));

  await fs.writeFile(
    path.join(DATA_DIR, 'blog-archive.json'),
    JSON.stringify(archive, null, 2)
  );

  const latest = visible.at(-1);
  if (latest) {
    const blogData = {
      date: latest.date,
      title: latest.title || '',
      category: latest.category || '',
      excerpt: latest.excerpt || '',
      author: latest.author || '',
      reading_minutes: latest.reading_minutes || 0,
      href: `/blog/${path.dirname(fileNameFor(latest))}/`,
      one_minute_win: oneMinuteWinOf(buildBlogBodyHTML(latest)),
      hero_image: latest.hero_image ? (/^https:/.test(latest.hero_image) ? latest.hero_image : `${SITE_URL}${latest.hero_image}`) : '',
      hero_image_alt: latest.hero_image_alt || '',
      week_dailies: latest.date >= GO_DEEPER_FROM ? weekDailiesFor(latest, dailyArchive) : []
    };

    await fs.writeFile(
      path.join(DATA_DIR, 'blog.json'),
      JSON.stringify(blogData, null, 2)
    );
  } else {
    try {
      await fs.unlink(path.join(DATA_DIR, 'blog.json'));
    } catch {}
  }

  const tpl = await fs.readFile(TPL_PATH, 'utf-8');

  for (let i = 0; i < visible.length; i++) {
    const e = visible[i];
    const prev = visible[i - 1];
    const next = visible[i + 1];

    const bodyHTML = is4321(e) ? accent4321(buildBlogBodyHTML(e)) : buildBlogBodyHTML(e);
    const source = bodyHTML
      ? (e.body_html !== undefined && e.body_html !== null ? 'body_html' : 'legacy')
      : 'empty';

    const partsCount = Array.isArray(e.body_html)
      ? e.body_html.length
      : typeof e.body_html;

    console.log(
      `[blog] ${e.date} :: ${e.title} | source=${source} | body_parts=${partsCount ?? 'none'} | bytes=${bodyHTML.length}`
    );

    const canonical = `${SITE_URL}/blog/${path.dirname(fileNameFor(e))}/`;
    const plainTitle = String(e.seo_title || e.title || 'Untitled').trim();
    const description = String(e.seo_description || e.excerpt || '').replace(/\s+/g, ' ').trim();
    const ogImage = e.og_image
      ? (/^https?:/i.test(e.og_image) ? e.og_image : `${SITE_URL}/${String(e.og_image).replace(/^\/+/, '')}`)
      : `${SITE_URL}/assets/og/site.png`;
    const jsonLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: plainTitle.slice(0, 110),
      description,
      datePublished: e.date,
      dateModified: e.date,
      url: canonical,
      mainEntityOfPage: canonical,
      image: ogImage,
      inLanguage: 'en-US',
      ...(e.category ? { articleSection: e.category } : {}),
      ...(e.reading_minutes ? { timeRequired: `PT${Number(e.reading_minutes)}M` } : {}),
      ...(() => {
        const kw = [...(Array.isArray(e.keywords) ? e.keywords : []), ...topicNames(topicsFor(e))]
          .filter((k, i, all) => k && all.findIndex(x => x.toLowerCase() === k.toLowerCase()) === i);
        return kw.length ? { keywords: kw.join(', ') } : {};
      })(),
      author: { '@id': 'https://thewrkshop.com/#organization' },
      publisher: { '@id': 'https://thewrkshop.com/#organization' },
      isPartOf: { '@id': 'https://thewrkshop.com/#website' }
    }).replace(/</g, '\\u003c');
    const attr = v => String(v ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const socialTitle = plainTitle.replace(/\s*\|\s*TheWrkShop\s*$/i, '');
    // Spoken length of the post (read-aloud runs ~155 words a minute)
    const spokenWords = `${e.title || ''} ${bodyHTML}`.replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ')
      .split(/\s+/).filter(Boolean).length;
    const listenMin = Math.max(1, Math.round(spokenWords / 155));

    const html = fill(tpl, {
      SEO_TITLE: attr(/\|\s*TheWrkShop\s*$/i.test(plainTitle) ? plainTitle : `${plainTitle} | TheWrkShop`),
      SOCIAL_TITLE: attr(socialTitle),
      SOCIAL_TITLE_ENC: attr(encodeURIComponent(socialTitle)),
      CANONICAL_URL_ENC: attr(encodeURIComponent(canonical)),
      POST_KEY: attr(`blog/${path.dirname(fileNameFor(e))}`),
      LISTEN_MIN: String(listenMin),
      AUDIO_HTML: audioHtml(e, attr),
      // Only weekend posts drawn from that week's Dailies (Oct 2026 on); earlier 4-3-2-1s stood alone
      GO_DEEPER_HTML: /4-3-2-1/.test(e.category || '') && e.date >= GO_DEEPER_FROM ? goDeeperHtml(weekDailiesFor(e, dailyArchive)) : '',
      SEO_DESCRIPTION: attr(description),
      CANONICAL_URL: attr(canonical),
      OG_IMAGE: attr(ogImage),
      JSON_LD: jsonLd,
      TITLE: e.title || 'Untitled',
      CATEGORY: e.category || 'Article',
      DATE: e.date,
      HUMAN_DATE: toHuman(e.date),
      EXCERPT: e.excerpt || '',
      AUTHOR: e.author || '',
      READING_MIN: String(e.reading_minutes || 0),
      BODY_HTML: bodyHTML,
      TOPICS_HTML: topicsLineHtml(topicsFor(e)),
      NEXT_STEPS_HTML: nextStepsHtml(e, 'blog'),
      // Root-relative links: blog pages carry <base href="/">, so "../" would resolve to the site root (404)
      ROBOTS_META: '',
      ARTICLE_CLASS: is4321(e) ? 'blog-post w4321' : 'blog-post',
      HERO_HTML: heroHtml(e, attr),
      PREV_HREF: prev ? `/blog/${path.dirname(fileNameFor(prev))}/` : '#',
      NEXT_HREF: next ? `/blog/${path.dirname(fileNameFor(next))}/` : '#'
    });

    const outPath = path.join(BLOG_DIR, fileNameFor(e));
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, html, 'utf-8');
  }

  await buildBonusPages(tpl);

  const guardLines = [
    ...older.map(e => `/blog/${path.dirname(fileNameFor(e))}/   /blog-archive.html   302!`),
    ...future.map(e => `/blog/${path.dirname(fileNameFor(e))}/   /blog-archive.html   302!`)
  ];

  await mergeRedirectLines([...await readPermanentRedirects(), ...guardLines]);

  console.log(`Blogs built: ${visible.length} in [${START_DATE}..${today}], future: ${future.length}, older: ${older.length}`);
  console.log('Blog pages generated:');
  for (const e of visible) {
    console.log(' -', `/blog/${path.dirname(fileNameFor(e))}/`);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});