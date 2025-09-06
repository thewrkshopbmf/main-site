// scripts/build-podcasts.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { XMLParser } from 'fast-xml-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const ROOT       = path.resolve(__dirname, '..');
const DATA_DIR   = path.join(ROOT, 'data');

const RSS_URL = process.env.PODCAST_RSS_URL;

function stripTags(s = '') {
  return String(s).replace(/<[^>]+>/g, '').trim();
}
function unescapeHTML(s = '') {
  return String(s)
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g,  '<')
    .replace(/&gt;/g,  '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function normText(x) {
  return unescapeHTML(stripTags(x ?? ''));
}

function toArray(x) {
  return Array.isArray(x) ? x : (x ? [x] : []);
}

function pick(...vals) {
  for (const v of vals) {
    if (v !== undefined && v !== null && String(v).trim() !== '') return v;
  }
  return '';
}

function mapRssItem(it) {
  // RSS 2.0 item with optional itunes/media namespaces
  const title = pick(it.title, it['itunes:title']);
  const pub   = pick(it.pubDate, it.published, it.updated);

  // Link can be in <link> or as array; Atom-style links are handled in Atom mapper
  const link  = typeof it.link === 'string' ? it.link : (Array.isArray(it.link) ? it.link[0] : '');

  const guid  = typeof it.guid === 'object' ? (it.guid['#text'] || it.guid._ || '') : (it.guid || '');

  const desc  = pick(
    it['content:encoded'],
    it.description,
    it['itunes:summary'],
    it.summary
  );

  // enclosure
  let audio = '';
  if (it.enclosure && typeof it.enclosure === 'object') {
    audio = it.enclosure.url || '';
  }

  // image (itunes or media)
  const itunesImage = it['itunes:image'] && typeof it['itunes:image'] === 'object' ? (it['itunes:image'].href || '') : '';
  const mediaThumb  = it['media:thumbnail'] && typeof it['media:thumbnail'] === 'object' ? (it['media:thumbnail'].url || '') : '';
  const mediaCont   = it['media:content'] && typeof it['media:content'] === 'object' ? (it['media:content'].url || '') : '';

  const image = pick(itunesImage, mediaThumb, mediaCont);

  // duration
  const duration = pick(it['itunes:duration'], it.duration);

  const pageUrl = pick(link, guid, audio);

  return {
    title:         normText(title),
    pub_date:      normText(pub),
    page_url:      normText(pageUrl),
    audio_url:     normText(audio),
    image:         normText(image),
    description_html: String(desc || ''),
    duration:      normText(duration)
  };
}

function mapAtomEntry(en) {
  // Atom entry; fields often live in attributes/children
  const title = pick(en.title && (en.title['#text'] || en.title._ || en.title), en['itunes:title']);
  const pub   = pick(en.published, en.updated);

  // Atom links array: look for rel="alternate" first
  let pageUrl = '';
  const links = toArray(en.link);
  const alt   = links.find(l => (l.rel || '').toLowerCase() === 'alternate' && l.href);
  if (alt && alt.href) pageUrl = alt.href;
  if (!pageUrl && links[0] && links[0].href) pageUrl = links[0].href;

  // Enclosure audio via link rel="enclosure"
  const encl  = links.find(l => (l.rel || '').toLowerCase() === 'enclosure' && l.href);
  const audio = encl && encl.href ? encl.href : '';

  // Description / content
  const desc  = pick(
    en.content && (en.content['#text'] || en.content._ || en.content),
    en.summary && (en.summary['#text'] || en.summary._ || en.summary),
    en['itunes:summary']
  );

  // Image (itunes/media if present on entry)
  const itunesImage = en['itunes:image'] && typeof en['itunes:image'] === 'object' ? (en['itunes:image'].href || '') : '';
  const mediaThumb  = en['media:thumbnail'] && typeof en['media:thumbnail'] === 'object' ? (en['media:thumbnail'].url || '') : '';
  const mediaCont   = en['media:content'] && typeof en['media:content'] === 'object' ? (en['media:content'].url || '') : '';
  const image       = pick(itunesImage, mediaThumb, mediaCont);

  const duration    = pick(en['itunes:duration'], en.duration);

  if (!pageUrl) pageUrl = pick(en.id, audio);

  return {
    title:            normText(title),
    pub_date:         normText(pub),
    page_url:         normText(pageUrl),
    audio_url:        normText(audio),
    image:            normText(image),
    description_html: String(desc || ''),
    duration:         normText(duration)
  };
}

async function main() {
  if (!RSS_URL) throw new Error('Missing PODCAST_RSS_URL env var');

  await fs.mkdir(DATA_DIR, { recursive: true });

  const res = await fetch(RSS_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`);
  const xml = await res.text();

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
    allowBooleanAttributes: true,
    trimValues: false
  });

  const doc = parser.parse(xml);

  // Two shapes we care about:
  // 1) RSS 2.0 -> rss.channel.item
  // 2) Atom -> feed.entry
  let items = [];

  if (doc?.rss?.channel?.item) {
    items = toArray(doc.rss.channel.item).map(mapRssItem);
  } else if (doc?.feed?.entry) {
    items = toArray(doc.feed.entry).map(mapAtomEntry);
  } else {
    // Some hosts nest differently; try best-effort fallbacks
    const channel = doc?.rss?.channel || doc?.channel;
    if (channel?.item) items = toArray(channel.item).map(mapRssItem);
  }

  // Filter out truly empty
  items = items.filter(it =>
    (it.title && it.title.trim()) || it.audio_url || it.page_url
  );

  // Sort newest first
  items.sort((a,b) => new Date(b.pub_date) - new Date(a.pub_date));

  const latest = items[0] || null;

  await fs.writeFile(path.join(DATA_DIR, 'podcast-archive.json'), JSON.stringify(items.slice(0, 50), null, 2));
  if (latest) {
    await fs.writeFile(path.join(DATA_DIR, 'podcast.json'), JSON.stringify(latest, null, 2));
  } else {
    try { await fs.unlink(path.join(DATA_DIR, 'podcast.json')); } catch {}
  }

  console.log(`Podcast items: ${items.length}. Latest: ${latest ? latest.title : '(none)'}`);
}

main().catch(err => { console.error(err); process.exit(1); });