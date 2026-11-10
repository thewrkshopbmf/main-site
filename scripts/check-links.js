// scripts/check-links.js
// Site-wide internal link check. Runs at the end of every build, after all pages are generated.
// For every .html page it resolves each internal <a href> the way a browser would (honoring
// <base href>), then confirms the target exists as a file, a directory index, or a _redirects rule.
// It only warns; it never stops a build. Previous/Next/Back links are called out first.
//
//   npm run check:links

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKIP_DIRS = new Set(['node_modules', '.git', 'supabase', 'netlify', 'templates', 'insert_content', 'content', 'scripts', 'config', 'docs']);
const ORIGIN = 'https://thewrkshop.com';

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name.startsWith('.')) continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) { if (!SKIP_DIRS.has(ent.name)) walk(p, out); }
    else if (ent.name.endsWith('.html')) out.push(p);
  }
  return out;
}

function redirectSources() {
  const set = new Set();
  const prefixes = [];
  const file = path.join(ROOT, '_redirects');
  if (!fs.existsSync(file)) return { set, prefixes };
  for (const line of fs.readFileSync(file, 'utf-8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const parts = t.split(/\s+/);
    if (parts.length < 2) continue;
    const [from, to, code = ''] = parts;
    if (/^200/.test(code) && from.endsWith('/*') && to.includes(':splat')) continue; // passthroughs don't make a page exist
    if (/^404/.test(code)) continue;
    if (from.endsWith('/*')) prefixes.push(from.slice(0, -1));
    else set.add(from.replace(/\/$/, ''));
  }
  return { set, prefixes };
}

const { set: REDIRECTS, prefixes: REDIRECT_PREFIXES } = redirectSources();

function exists(urlPath) {
  let p;
  try { p = decodeURIComponent(urlPath); } catch { p = urlPath; }
  const bare = p.replace(/\/$/, '');
  if (REDIRECTS.has(bare) || REDIRECTS.has(bare + '.html')) return true;
  if (REDIRECT_PREFIXES.some((pre) => p.startsWith(pre))) return true;
  const local = path.join(ROOT, p.replace(/^\/+/, ''));
  if (p.endsWith('/')) return fs.existsSync(path.join(local, 'index.html'));
  return isFile(local) || isFile(local + '.html') || isFile(path.join(local, 'index.html'));
}
function isFile(f) { try { return fs.statSync(f).isFile(); } catch { return false; } }

const NAV_RE = /prev|next|back|newer|older|←|→/i;
const broken = [];
let links = 0;
const files = walk(ROOT);

for (const file of files) {
  const html = fs.readFileSync(file, 'utf-8');
  let pageUrl = '/' + path.relative(ROOT, file).split(path.sep).join('/');
  if (pageUrl.endsWith('/index.html')) pageUrl = pageUrl.slice(0, -'index.html'.length);
  const baseMatch = html.match(/<base\s+href="([^"]*)"/i);
  const base = new URL(baseMatch ? baseMatch[1] : pageUrl, ORIGIN + pageUrl);
  // Ignore anchors inside <script> blocks (template strings built at runtime)
  const body = html.replace(/<script\b[\s\S]*?<\/script>/gi, '');
  for (const m of body.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const h = m[1].match(/\bhref="([^"]*)"/i);
    if (!h) continue;
    const href = h[1].replace(/&amp;/g, '&').trim();
    if (!href || /^(#|https?:|mailto:|tel:|sms:|javascript:|data:|\{\{)/i.test(href) || href.includes('${')) continue;
    let target;
    try { target = new URL(href, base); } catch { continue; }
    if (target.origin !== ORIGIN) continue;
    links++;
    if (!exists(target.pathname)) {
      const text = m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 40);
      broken.push({ page: pageUrl, text, href, resolved: target.pathname, nav: NAV_RE.test(text + ' ' + m[1]) });
    }
  }
}

broken.sort((a, b) => Number(b.nav) - Number(a.nav));
for (const b of broken) {
  console.log(`⚠️  ${b.nav ? '[prev/next] ' : ''}${b.page}  "${b.text}"  ${b.href}  →  ${b.resolved} (not found)`);
}
console.log(`[check:links] ${files.length} pages, ${links} internal links checked; ${broken.length} broken. (Warnings only: nothing was blocked.)`);
