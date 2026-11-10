// netlify/shared/indexnow.js
// Tells Bing (which also feeds ChatGPT search and Copilot), Yandex and other IndexNow
// search engines the moment a new page goes live, instead of waiting for them to crawl.
// Google does not use IndexNow; for Google, the sitemap in Search Console does this job.
//
// Called from deploy-succeeded.mjs after each production deploy. It submits today's Daily,
// the topic hubs it belongs to, today's weekend post (if any) and the pages that list them.
// The key below must match the file at https://thewrkshop.com/<key>.txt (in the repo root).

export const INDEXNOW_KEY = '2286773e9e8f07432a33f2e092de52cd';
const SITE = 'https://thewrkshop.com';
const HOST = 'thewrkshop.com';

async function getJson(url) {
  try {
    const r = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(4000) });
    return r.ok ? await r.json() : null;
  } catch {
    return null;
  }
}

function todayCentralISO() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Chicago', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

export async function pingIndexNow() {
  const today = todayCentralISO();
  const paths = new Set(['/', '/daily.html', '/daily-archive.html', '/library/', '/topics/']);

  const daily = await getJson(`${SITE}/data/daily.json`);
  if (daily?.date === today && daily.href) {
    paths.add(daily.href);
    if (daily.href.startsWith('/leadership/')) paths.add('/leadership/');
    for (const slug of Array.isArray(daily.topics) ? daily.topics : []) {
      if (/^[a-z0-9-]+$/.test(slug)) paths.add(`/topics/${slug}/`);
    }
  }
  const blog = await getJson(`${SITE}/data/blog.json`);
  if (blog?.date === today && blog.href) {
    paths.add(blog.href);
    paths.add('/blog-archive.html');
  }

  const urlList = [...paths].map((p) => `${SITE}${p}`);
  try {
    const r = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: HOST, key: INDEXNOW_KEY, keyLocation: `${SITE}/${INDEXNOW_KEY}.txt`, urlList }),
      signal: AbortSignal.timeout(5000)
    });
    return { status: r.status, submitted: urlList.length, urls: urlList };
  } catch (err) {
    return { status: 0, error: err.message, submitted: 0 };
  }
}
