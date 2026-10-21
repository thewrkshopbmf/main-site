// 12:01 am Central: if a Daily or a weekend blog post is dated today but isn't live yet, release it.
// It does this by adding an empty "Release daily" commit to main, which makes Netlify
// rebuild the site. When that deploy finishes, deploy-succeeded emails it to the list.
import { centralNow, fetchLiveDaily, SITE_URL } from '../shared/daily-list.js';

// What weekend blog post is live right now (data/blog.json is the latest visible post).
async function fetchLiveBlog() {
  const res = await fetch(`${SITE_URL}/data/blog.json?t=${Date.now()}`, { headers: { 'Cache-Control': 'no-cache' } });
  if (!res.ok) return null;
  return res.json();
}

const TOKEN = process.env.GITHUB_TOKEN;
const OWNER = process.env.GITHUB_REPO_OWNER;
const REPO = process.env.GITHUB_REPO_NAME;
const BRANCH = process.env.GITHUB_BRANCH || 'main';

async function gh(path, options = {}) {
  const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`GitHub ${res.status} on ${path}: ${body.message || ''}`);
  return body;
}

export default async () => {
  const { date: today, hour } = centralNow();

  // Two schedules run (05:01 and 06:01 UTC) so one of them is 12:01 am Central in summer and winter.
  if (hour !== 0) return new Response(`Not midnight in Chicago (hour ${hour}); nothing to do.`);
  if (!TOKEN || !OWNER || !REPO) {
    console.error('daily-release: missing GITHUB_TOKEN / GITHUB_REPO_OWNER / GITHUB_REPO_NAME');
    return new Response('Missing GitHub settings', { status: 500 });
  }

  try {
    // Something dated today that isn't live yet: a Daily (Mon–Fri) or a weekend blog post (Saturday 4-3-2-1).
    const toRelease = [];

    const dailyFiles = await gh(`/contents/content/daily?ref=${encodeURIComponent(BRANCH)}`);
    const todaysDaily = (Array.isArray(dailyFiles) ? dailyFiles : []).filter(f => f.name.startsWith(`${today}_`));
    if (todaysDaily.length) {
      const live = await fetchLiveDaily().catch(() => null);
      if (!(live && live.date === today)) toRelease.push(`daily ${todaysDaily[0].name.replace(/\.json$/, '')}`);
    }

    const blogFiles = await gh(`/contents/content/blog?ref=${encodeURIComponent(BRANCH)}`).catch(() => []);
    const todaysBlog = (Array.isArray(blogFiles) ? blogFiles : []).filter(f => f.name.startsWith(`${today}_`));
    if (todaysBlog.length) {
      const liveBlog = await fetchLiveBlog().catch(() => null);
      if (!(liveBlog && liveBlog.date === today)) toRelease.push(`blog ${todaysBlog[0].name.replace(/\.json$/, '')}`);
    }

    if (!toRelease.length) {
      console.log(`daily-release: nothing new dated ${today} to release.`);
      return new Response('Nothing to release today');
    }

    const ref = await gh(`/git/ref/heads/${encodeURIComponent(BRANCH)}`);
    const parent = await gh(`/git/commits/${ref.object.sha}`);
    const commit = await gh('/git/commits', {
      method: 'POST',
      body: JSON.stringify({
        message: `Release ${today}: ${toRelease.join(' + ')}`,
        tree: parent.tree.sha,
        parents: [ref.object.sha]
      })
    });
    await gh(`/git/refs/heads/${encodeURIComponent(BRANCH)}`, {
      method: 'PATCH',
      body: JSON.stringify({ sha: commit.sha })
    });

    console.log(`daily-release: released ${today} with commit ${commit.sha}`);
    return new Response(`Released ${today}`);
  } catch (err) {
    console.error('daily-release failed:', err);
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
};

export const config = { schedule: '1 5,6 * * *' };
