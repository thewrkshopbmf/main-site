// /api/like — "Like this post" counts for blog posts.
//   GET  /api/like?key=blog/2026-11-13_when-success-hides-whats-wrong  -> { ok, likes }
//   POST /api/like  { key, action: "like" | "unlike" }                   -> { ok, likes }
// No sign-in and no personal data: the browser remembers whether it has liked a post
// (localStorage), and the server only keeps one running count per post (table post_likes).
// Keys must match a published blog post (checked against /data/blog-archive.json).
import { db, json } from '../shared/daily-list.js';

const KEY_RE = /^blog\/\d{4}-\d{2}-\d{2}_[a-z0-9-]{1,140}$/;
const ARCHIVE_TTL_MS = 5 * 60 * 1000;
const SITE_URL = 'https://thewrkshop.com';

let archiveCache = { at: 0, origin: '', keys: null };

async function publishedKeys(origin) {
  const fresh = Date.now() - archiveCache.at < ARCHIVE_TTL_MS && archiveCache.origin === origin;
  if (fresh && archiveCache.keys) return archiveCache.keys;
  const res = await fetch(`${origin}/data/blog-archive.json`, { headers: { 'Cache-Control': 'no-cache' } });
  if (!res.ok) throw new Error(`archive ${res.status}`);
  const list = await res.json();
  const keys = new Set((Array.isArray(list) ? list : [])
    .map(p => String(p.href || '').replace(/^\/+|\/+$/g, ''))
    .filter(Boolean));
  archiveCache = { at: Date.now(), origin, keys };
  return keys;
}

// Only check against this site's own archive (the deploy that served the page).
function siteOrigin(req) {
  try {
    const u = new URL(req.url);
    if (u.hostname === 'thewrkshop.com' || u.hostname === 'www.thewrkshop.com' ||
        u.hostname.endsWith('--curious-profiterole-fae7e1.netlify.app') ||
        u.hostname === 'curious-profiterole-fae7e1.netlify.app') return u.origin;
  } catch {}
  return SITE_URL;
}

async function validKey(req, key) {
  if (!KEY_RE.test(key)) return false;
  try {
    return (await publishedKeys(siteOrigin(req))).has(key);
  } catch {
    return true; // archive unreachable: the pattern check above still applies
  }
}

export default async (req) => {
  try {
    if (req.method === 'GET') {
      const key = String(new URL(req.url).searchParams.get('key') || '').trim();
      if (!KEY_RE.test(key)) return json({ ok: false, error: 'Unknown post' }, 400);
      const { data, error } = await db().from('post_likes').select('likes').eq('post_key', key).maybeSingle();
      if (error) throw error;
      return json({ ok: true, likes: data?.likes || 0 });
    }

    if (req.method === 'POST') {
      let body = {};
      try { body = await req.json(); } catch { return json({ ok: false, error: 'Invalid request' }, 400); }
      const key = String(body.key || '').trim();
      const delta = body.action === 'like' ? 1 : body.action === 'unlike' ? -1 : 0;
      if (!delta) return json({ ok: false, error: 'Invalid action' }, 400);
      if (!(await validKey(req, key))) return json({ ok: false, error: 'Unknown post' }, 400);
      const { data, error } = await db().rpc('post_like_change', { p_key: key, p_delta: delta });
      if (error) throw error;
      return json({ ok: true, likes: Number(data) || 0 });
    }

    return json({ ok: false, error: 'Method not allowed' }, 405);
  } catch (err) {
    console.error('[post-like]', err?.message || err);
    return json({ ok: false, error: 'Likes are unavailable right now.' }, 500);
  }
};

export const config = { path: '/api/like' };
