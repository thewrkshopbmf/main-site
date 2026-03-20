// scripts/build-blog.js
import fs from 'fs/promises';
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
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const CONTENT_DIR = path.join(ROOT, 'content', 'blog');
const DATA_DIR = path.join(ROOT, 'data');
const BLOG_DIR = path.join(ROOT, 'blog');
const TPL_PATH = path.join(ROOT, 'templates', 'blog.html');
const REDIRECTS = path.join(ROOT, '_redirects');

const START_DATE = '2025-08-01';

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

  await fs.writeFile(REDIRECTS, existingLines.join('\n') + '\n', 'utf-8');
}

async function ensurePassthroughs() {
  await mergeRedirectLines([
    '/blog/*   /blog/:splat   200',
    '/daily/*   /daily/:splat   200'
  ]);
  console.log('✅ Ensured passthrough rules for /blog/* and /daily/*.');
}

async function main() {
  await ensurePassthroughs();
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
  const today = todayCentralISO();

  const allowed = entries.filter(e => e.date >= START_DATE);
  const visible = allowed.filter(e => e.date <= today);
  const future = allowed.filter(e => e.date > today);
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
      href: `/blog/${path.dirname(fileNameFor(e))}/`
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
      href: `/blog/${path.dirname(fileNameFor(latest))}/`
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

    const bodyHTML = buildBlogBodyHTML(e);
    const source = bodyHTML
      ? (e.body_html !== undefined && e.body_html !== null ? 'body_html' : 'legacy')
      : 'empty';

    const partsCount = Array.isArray(e.body_html)
      ? e.body_html.length
      : typeof e.body_html;

    console.log(
      `[blog] ${e.date} :: ${e.title} | source=${source} | body_parts=${partsCount ?? 'none'} | bytes=${bodyHTML.length}`
    );

    const html = fill(tpl, {
      TITLE: e.title || 'Untitled',
      CATEGORY: e.category || 'Article',
      DATE: e.date,
      HUMAN_DATE: toHuman(e.date),
      EXCERPT: e.excerpt || '',
      AUTHOR: e.author || '',
      READING_MIN: String(e.reading_minutes || 0),
      BODY_HTML: bodyHTML,
      PREV_HREF: prev ? `../${path.dirname(fileNameFor(prev))}/` : '#',
      NEXT_HREF: next ? `../${path.dirname(fileNameFor(next))}/` : '#'
    });

    const outPath = path.join(BLOG_DIR, fileNameFor(e));
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, html, 'utf-8');
  }

  const guardLines = [
    ...older.map(e => `/blog/${path.dirname(fileNameFor(e))}/   /blog-archive.html   302!`),
    ...future.map(e => `/blog/${path.dirname(fileNameFor(e))}/   /blog-archive.html   302!`)
  ];

  await mergeRedirectLines(guardLines);

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