// scripts/build-podcasts.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const ROOT       = path.resolve(__dirname, '..');
const DATA_DIR   = path.join(ROOT, 'data');

const RSS_URL = process.env.PODCAST_RSS_URL; // set in Netlify env

// Node 18+ has global fetch
// Lightweight XML parser (no install): tiny util to pluck fields from RSS
function textOf(node, tag) {
  const m = node.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'));
  return m ? m[1].trim() : '';
}
function allItems(xml) {
  const items = [];
  const re = /<item\b[\s\S]*?<\/item>/gi;
  let m;
  while ((m = re.exec(xml))) items.push(m[0]);
  return items;
}
function stripTags(s='') {
  return s.replace(/<[^>]+>/g, '').trim();
}
function unescape(s='') {
  return s
    .replace(/&amp;/g,'&')
    .replace(/&lt;/g,'<')
    .replace(/&gt;/g,'>')
    .replace(/&quot;/g,'"')
    .replace(/&#39;/g,"'");
}

function parseDuration(it) {
  // look for itunes:duration or a HH:MM:SS-ish pattern
  const m = it.match(/<itunes:duration[^>]*>([\s\S]*?)<\/itunes:duration>/i);
  const raw = m ? m[1].trim() : '';
  if (!raw) return null;
  return raw;
}

function parseItem(xml) {
  const title = unescape(stripTags(textOf(xml, 'title')));
  const link  = unescape(stripTags(textOf(xml, 'link')));
  const pub   = unescape(stripTags(textOf(xml, 'pubDate')));
  const guid  = unescape(stripTags(textOf(xml, 'guid')));
  const desc  = unescape(textOf(xml, 'description') || textOf(xml, 'content:encoded') || '');
  const imgM  = xml.match(/<itunes:image[^>]*href="([^"]+)"/i);
  const img   = imgM ? imgM[1] : '';
  const enclosureM = xml.match(/<enclosure[^>]*url="([^"]+)"/i);
  const audio = enclosureM ? enclosureM[1] : '';
  const dur   = parseDuration(xml);

  // optional: episode page (Spotify) if present in <link>, else fallback to guid or audio
  const pageUrl = link || guid || '';

  return {
    title, pub_date: pub, page_url: pageUrl, audio_url: audio,
    image: img, description_html: desc, duration: dur
  };
}

async function main() {
  if (!RSS_URL) throw new Error('Missing PODCAST_RSS_URL env var');

  await fs.mkdir(DATA_DIR, { recursive: true });

  const res = await fetch(RSS_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`);
  const xml = await res.text();

  const items = allItems(xml).map(parseItem);

  // sort by pub date descending (best effort)
  items.sort((a,b) => new Date(b.pub_date) - new Date(a.pub_date));

  const latest = items[0] || null;

  // Write archive & latest
  await fs.writeFile(path.join(DATA_DIR, 'podcast-archive.json'), JSON.stringify(items.slice(0, 50), null, 2));
  if (latest) {
    await fs.writeFile(path.join(DATA_DIR, 'podcast.json'), JSON.stringify(latest, null, 2));
  } else {
    // remove stale latest if any
    try { await fs.unlink(path.join(DATA_DIR, 'podcast.json')); } catch {}
  }

  console.log(`Podcast items: ${items.length}. Latest: ${latest ? latest.title : 'none'}`);
}

main().catch(err => { console.error(err); process.exit(1); });
