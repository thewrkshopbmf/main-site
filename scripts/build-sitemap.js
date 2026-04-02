// scripts/build-sitemap.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const SITE_URL = (process.env.SITE_URL || 'https://thewrkshop.com').replace(/\/+$/, '');
const OUTPUT_PATH = path.join(ROOT, 'sitemap.xml');

// Root HTML pages we do NOT want indexed
const EXCLUDED_ROOT_HTML = new Set([
  '404.html',
  '500.html',
  'login.html'
]);

// Folders that should never be crawled for sitemap URLs
const EXCLUDED_DIRS = new Set([
  '.git',
  '.github',
  '.netlify',
  'admin',
  'assets',
  'config',
  'content',
  'data',
  'dist',
  'insert_content',
  'netlify',
  'node_modules',
  'scripts',
  'templates'
]);

// Only scan these public content areas recursively.
// This keeps the sitemap focused on real landing/content pages.
const RECURSIVE_PUBLIC_DIRS = [
  'blog',
  'daily',
  'pages',
  'sub-pages'
];

function toPosix(p) {
  return p.split(path.sep).join('/');
}

function escapeXml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function isHtmlFile(name) {
  return path.extname(name).toLowerCase() === '.html';
}

function shouldSkipRecursiveDir(name) {
  return EXCLUDED_DIRS.has(name);
}

function isHiddenOrPrivateLike(name) {
  return name.startsWith('.');
}

function relPathToAbsoluteUrl(relPath) {
  const rel = toPosix(relPath);

  if (rel === 'index.html') {
    return `${SITE_URL}/`;
  }

  if (rel.endsWith('/index.html')) {
    return `${SITE_URL}/${rel.slice(0, -'index.html'.length)}`;
  }

  return `${SITE_URL}/${rel}`;
}

async function statMtimeIso(absPath) {
  const stat = await fs.stat(absPath);
  return stat.mtime.toISOString();
}

async function readRootPublicHtml() {
  const dirents = await fs.readdir(ROOT, { withFileTypes: true });
  const urls = [];

  for (const entry of dirents) {
    if (!entry.isFile()) continue;
    if (!isHtmlFile(entry.name)) continue;
    if (EXCLUDED_ROOT_HTML.has(entry.name)) continue;
    if (isHiddenOrPrivateLike(entry.name)) continue;

    const absPath = path.join(ROOT, entry.name);
    urls.push({
      loc: relPathToAbsoluteUrl(entry.name),
      lastmod: await statMtimeIso(absPath)
    });
  }

  return urls;
}

async function walkPublicHtml(absDir, relDir = '') {
  let dirents = [];
  try {
    dirents = await fs.readdir(absDir, { withFileTypes: true });
  } catch {
    return [];
  }

  const urls = [];

  for (const entry of dirents) {
    const absPath = path.join(absDir, entry.name);
    const relPath = relDir ? path.join(relDir, entry.name) : entry.name;

    if (entry.isDirectory()) {
      if (shouldSkipRecursiveDir(entry.name)) continue;
      if (isHiddenOrPrivateLike(entry.name)) continue;
      urls.push(...await walkPublicHtml(absPath, relPath));
      continue;
    }

    if (!entry.isFile()) continue;
    if (!isHtmlFile(entry.name)) continue;
    if (isHiddenOrPrivateLike(entry.name)) continue;

    // Exclude error/auth pages even if they appear under scanned folders
    const lower = entry.name.toLowerCase();
    if (lower === '404.html' || lower === '500.html' || lower === 'login.html') {
      continue;
    }

    urls.push({
      loc: relPathToAbsoluteUrl(relPath),
      lastmod: await statMtimeIso(absPath)
    });
  }

  return urls;
}

function dedupeAndSort(items) {
  const map = new Map();

  for (const item of items) {
    if (!item?.loc) continue;
    // Keep the newest lastmod if the same URL appears twice
    const existing = map.get(item.loc);
    if (!existing || new Date(item.lastmod) > new Date(existing.lastmod)) {
      map.set(item.loc, item);
    }
  }

  return [...map.values()].sort((a, b) => {
    if (a.loc === `${SITE_URL}/`) return -1;
    if (b.loc === `${SITE_URL}/`) return 1;

    const aDepth = a.loc.replace(SITE_URL, '').split('/').filter(Boolean).length;
    const bDepth = b.loc.replace(SITE_URL, '').split('/').filter(Boolean).length;

    if (aDepth !== bDepth) return aDepth - bDepth;
    return a.loc.localeCompare(b.loc);
  });
}

function buildXml(urls) {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  ];

  for (const { loc, lastmod } of urls) {
    lines.push('  <url>');
    lines.push(`    <loc>${escapeXml(loc)}</loc>`);
    if (lastmod) {
      lines.push(`    <lastmod>${escapeXml(lastmod)}</lastmod>`);
    }
    lines.push('  </url>');
  }

  lines.push('</urlset>');
  lines.push('');

  return lines.join('\n');
}

async function main() {
  const allUrls = [];

  // 1) Public root HTML pages
  allUrls.push(...await readRootPublicHtml());

  // 2) Public generated/content folders
  for (const dir of RECURSIVE_PUBLIC_DIRS) {
    const absDir = path.join(ROOT, dir);
    allUrls.push(...await walkPublicHtml(absDir, dir));
  }

  const finalUrls = dedupeAndSort(allUrls);
  const xml = buildXml(finalUrls);

  await fs.writeFile(OUTPUT_PATH, xml, 'utf-8');

  console.log(`✅ sitemap.xml generated with ${finalUrls.length} URL(s).`);
  for (const { loc } of finalUrls) {
    console.log(` - ${loc}`);
  }
}

main().catch((err) => {
  console.error('❌ Failed to build sitemap.xml');
  console.error(err);
  process.exit(1);
});