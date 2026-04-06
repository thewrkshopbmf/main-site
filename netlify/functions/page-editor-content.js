import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO_OWNER = process.env.GITHUB_REPO_OWNER;
const GITHUB_REPO_NAME = process.env.GITHUB_REPO_NAME;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

let treeCache = {
  branch: null,
  loadedAt: 0,
  tree: []
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

function cleanString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeType(value) {
  const t = cleanString(value).toLowerCase();
  return ['daily', 'blog', 'podcast'].includes(t) ? t : '';
}

function slugify(value = '') {
  return String(value)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function isIsoDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(cleanString(value));
}

function ghPath(path = '') {
  return path.split('/').map(encodeURIComponent).join('/');
}

async function ghFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(options.headers || {})
    }
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`GitHub API error ${res.status}: ${text || res.statusText}`);
  }

  return res.json();
}

async function requireAdmin(request) {
  const authHeader =
    request.headers.get('authorization') ||
    request.headers.get('Authorization') ||
    '';

  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return { error: json({ ok: false, error: 'Missing bearer token' }, 401) };
  }

  const token = match[1];

  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData?.user) {
    return { error: json({ ok: false, error: `Invalid or expired session: ${userError?.message || 'unknown auth error'}` }, 401) };
  }

  const user = userData.user;

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, email')
    .eq('id', user.id)
    .single();

  if (profileError) {
    return { error: json({ ok: false, error: `Failed to load admin profile: ${profileError.message}` }, 403) };
  }

  if (!profile || profile.role !== 'admin') {
    return { error: json({ ok: false, error: 'Admin access required' }, 403) };
  }

  return { user, profile };
}

async function getRepoTree() {
  const now = Date.now();
  if (
    treeCache.branch === GITHUB_BRANCH &&
    treeCache.tree.length &&
    now - treeCache.loadedAt < 5 * 60 * 1000
  ) {
    return treeCache.tree;
  }

  const data = await ghFetch(
    `https://api.github.com/repos/${encodeURIComponent(GITHUB_REPO_OWNER)}/${encodeURIComponent(GITHUB_REPO_NAME)}/git/trees/${encodeURIComponent(GITHUB_BRANCH)}?recursive=1`
  );

  const tree = Array.isArray(data.tree) ? data.tree : [];

  treeCache = {
    branch: GITHUB_BRANCH,
    loadedAt: now,
    tree
  };

  return tree;
}

async function getContentsByPath(path) {
  const data = await ghFetch(
    `https://api.github.com/repos/${encodeURIComponent(GITHUB_REPO_OWNER)}/${encodeURIComponent(GITHUB_REPO_NAME)}/contents/${ghPath(path)}?ref=${encodeURIComponent(GITHUB_BRANCH)}`
  );

  if (!data || Array.isArray(data) || data.type !== 'file') {
    throw new Error(`Path is not a file: ${path}`);
  }

  const content = Buffer.from(data.content || '', 'base64').toString('utf8');

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (err) {
    throw new Error(`Invalid JSON in ${path}: ${err.message}`);
  }

  return {
    path,
    sha: data.sha,
    content,
    json: parsed
  };
}

function typeDirHints(type) {
  if (type === 'daily') return ['content/daily/'];
  if (type === 'blog') return ['content/blog/', 'content/blogs/'];
  if (type === 'podcast') return ['content/podcast/', 'content/podcasts/'];
  return ['content/'];
}

function scoreCandidate(path, type, date, slug, titleSlug) {
  let score = 0;
  const lower = path.toLowerCase();

  if (typeDirHints(type).some(prefix => lower.startsWith(prefix))) score += 50;
  if (lower.endsWith('.json')) score += 10;
  if (date && lower.includes(date)) score += 20;
  if (slug && lower.includes(slug)) score += 25;
  if (titleSlug && lower.includes(titleSlug)) score += 15;

  return score;
}

async function resolveContentFile({ type, date, slug, title, filePath }) {
  if (filePath) {
    try {
      return await getContentsByPath(filePath);
    } catch (err) {
      throw new Error(`Direct file_path lookup failed for "${filePath}": ${err.message}`);
    }
  }

  const tree = await getRepoTree();
  const titleSlug = slugify(title || '');

  const candidates = tree
    .filter(node => node.type === 'blob' && node.path.endsWith('.json'))
    .map(node => ({
      path: node.path,
      score: scoreCandidate(node.path, type, date, slug, titleSlug)
    }))
    .filter(node => node.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 50);

  if (!candidates.length) {
    throw new Error(`No candidate JSON files found for type=${type}, date=${date}, slug=${slug}, title=${title || '(none)'}`);
  }

  for (const candidate of candidates) {
    try {
      const file = await getContentsByPath(candidate.path);
      const data = file.json || {};
      const fileDate = cleanString(data.date);
      const fileTitleSlug = slugify(cleanString(data.title));

      const dateMatches = !date || fileDate === date;
      const slugMatches = !slug || fileTitleSlug === slug || candidate.path.toLowerCase().includes(slug);

      if (dateMatches && slugMatches) {
        return file;
      }
    } catch {
      // ignore bad candidates
    }
  }

  throw new Error(
    `Could not resolve exact source JSON for type=${type}, date=${date}, slug=${slug}, title=${title || '(none)'}. Top candidate count: ${candidates.length}`
  );
}

function paragraphsToBlocks(content) {
  const paragraphs = String(content || '')
    .split(/\n{2,}/)
    .map(x => x.trim())
    .filter(Boolean);

  return paragraphs.map(text => ({ type: 'paragraph', text }));
}

function sectionsToBodyHtml(sections = []) {
  return sections.map(section => {
    const label = cleanString(section.label || 'Section');
    const paragraphs = String(section.content || '')
      .split(/\n{2,}/)
      .map(x => x.trim())
      .filter(Boolean)
      .map(text => `<p>${escapeHtml(text)}</p>`)
      .join('\n');

    return `<section>\n<h2>${escapeHtml(label)}</h2>\n${paragraphs}\n</section>`;
  }).join('\n\n');
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function todayCentralISO() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Chicago',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date());
}

function scriptureSlug(ref = '') {
  return String(ref)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['"]/g, '')
    .replace(/[^A-Za-z0-9\s:–—-]+/g, ' ')
    .replace(/[:–—]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

function dailyHrefFromEntry(entry) {
  return entry?.date && entry?.title && (entry?.verse_ref || entry?.scriptures?.[0]?.ref)
    ? `/daily/${scriptureSlug(entry.verse_ref || entry.scriptures[0].ref)}_${slugify(entry.title)}_${entry.date}.html`
    : '#';
}

function blogHrefFromPath(path) {
  if (!path) return '#';
  const lower = path.toLowerCase();

  if (lower.startsWith('content/blog/')) {
    const rel = path.slice('content/blog/'.length).replace(/\.json$/i, '');
    return `/blog/${rel}/`;
  }

  if (lower.startsWith('content/blogs/')) {
    const rel = path.slice('content/blogs/'.length).replace(/\.json$/i, '');
    return `/blog/${rel}/`;
  }

  return '#';
}

function podcastHrefFromJson(entry, path) {
  if (entry?.page_url) return entry.page_url;
  if (entry?.href) return entry.href;

  const lower = (path || '').toLowerCase();

  if (lower.startsWith('content/podcast/')) {
    const rel = path.slice('content/podcast/'.length).replace(/\.json$/i, '');
    return `/podcast/${rel}/`;
  }

  if (lower.startsWith('content/podcasts/')) {
    const rel = path.slice('content/podcasts/'.length).replace(/\.json$/i, '');
    return `/podcast/${rel}/`;
  }

  return '#';
}

function buildIndexEntryFromSource(type, path, data) {
  const title = cleanString(data?.title) || 'Untitled';
  const date = cleanString(data?.date);
  const slug = slugify(title || path);

  if (!date || !title) return null;

  if (type === 'daily') {
    return {
      type,
      title,
      date,
      slug,
      verse_ref: cleanString(data?.verse_ref || data?.scriptures?.[0]?.ref || ''),
      href: dailyHrefFromEntry(data),
      file_path: path,
      is_future: date > todayCentralISO()
    };
  }

  if (type === 'blog') {
    return {
      type,
      title,
      date,
      slug,
      category: cleanString(data?.category),
      href: blogHrefFromPath(path),
      file_path: path,
      is_future: false
    };
  }

  return {
    type,
    title,
    date,
    slug,
    duration: cleanString(data?.duration),
    href: podcastHrefFromJson(data, path),
    file_path: path,
    is_future: false
  };
}

async function buildEditorIndex() {
  const tree = await getRepoTree();

  const candidateFiles = tree
    .filter(node => node.type === 'blob' && node.path.toLowerCase().endsWith('.json'))
    .filter(node => {
      const lower = node.path.toLowerCase();
      return (
        lower.startsWith('content/daily/') ||
        lower.startsWith('content/blog/') ||
        lower.startsWith('content/blogs/') ||
        lower.startsWith('content/podcast/') ||
        lower.startsWith('content/podcasts/')
      );
    })
    .map(node => {
      const lower = node.path.toLowerCase();
      let type = 'daily';
      if (lower.startsWith('content/blog/') || lower.startsWith('content/blogs/')) type = 'blog';
      if (lower.startsWith('content/podcast/') || lower.startsWith('content/podcasts/')) type = 'podcast';
      return { type, path: node.path };
    });

  const entries = [];
  let dailyCount = 0;
  let blogCount = 0;
  let podcastCount = 0;

  for (const file of candidateFiles) {
    try {
      const loaded = await getContentsByPath(file.path);
      const entry = buildIndexEntryFromSource(file.type, file.path, loaded.json);
      if (entry) {
        entries.push(entry);
        if (file.type === 'daily') dailyCount += 1;
        if (file.type === 'blog') blogCount += 1;
        if (file.type === 'podcast') podcastCount += 1;
      }
    } catch {
      // ignore bad files
    }
  }

  entries.sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title));

  return {
    entries,
    stats: {
      total_entries: entries.length,
      daily_count: dailyCount,
      blog_count: blogCount,
      podcast_count: podcastCount
    }
  };
}

function applyDailySections(source, editedTitle, sections) {
  const next = { ...source };

  next.title = editedTitle || next.title;

  delete next.read_this_out_loud;
  delete next.insight;
  delete next.body;
  delete next.shift;
  delete next.jesus_set_the_pattern;
  delete next.truth;
  delete next.reflection;
  delete next.one_minute_win;
  delete next.action_step;
  delete next.declaration;

  next.sections = sections.map(section => ({
    key: slugify(section.label || 'section').replace(/-/g, '_'),
    label: cleanString(section.label || 'Section'),
    blocks: paragraphsToBlocks(section.content || '')
  }));

  return next;
}

function applyGenericBodyHtml(source, editedTitle, sections, type) {
  const next = { ...source };
  next.title = editedTitle || next.title;

  const html = sectionsToBodyHtml(sections);

  next.body_html = html;

  if (type === 'podcast') {
    if ('show_notes_html' in next || !('body_html' in next)) {
      next.show_notes_html = html;
    }
  }

  return next;
}

function buildCommitMessage(type, date, title) {
  const label = type.charAt(0).toUpperCase() + type.slice(1);
  return `Admin edit: ${label} ${date}${title ? ` — ${title}` : ''}`;
}

export default async (request) => {
  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return json({ ok: false, error: 'Missing Supabase function environment variables: SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY' }, 500);
    }

    if (!GITHUB_TOKEN || !GITHUB_REPO_OWNER || !GITHUB_REPO_NAME) {
      return json({ ok: false, error: 'Missing GitHub function environment variables: GITHUB_TOKEN, GITHUB_REPO_OWNER, and/or GITHUB_REPO_NAME' }, 500);
    }

    const auth = await requireAdmin(request);
    if (auth.error) return auth.error;

    const method = request.method.toUpperCase();
    const url = new URL(request.url);

    if (method === 'GET') {
      const mode = cleanString(url.searchParams.get('mode'));

      if (mode === 'index') {
        const { entries, stats } = await buildEditorIndex();
        return json({
          ok: true,
          entries,
          stats
        });
      }

      const type = normalizeType(url.searchParams.get('type'));
      const date = cleanString(url.searchParams.get('date'));
      const slug = slugify(url.searchParams.get('slug') || '');
      const title = cleanString(url.searchParams.get('title'));
      const filePath = cleanString(url.searchParams.get('file_path'));

      if (!type || !isIsoDate(date) || !slug) {
        return json({ ok: false, error: `Invalid source lookup params. type=${type || '(missing)'} date=${date || '(missing)'} slug=${slug || '(missing)'}` }, 400);
      }

      const file = await resolveContentFile({ type, date, slug, title, filePath });

      return json({
        ok: true,
        file_path: file.path,
        file_sha: file.sha,
        source_json: file.json
      });
    }

    if (method === 'POST') {
      const payload = await request.json().catch(() => null);
      if (!payload) {
        return json({ ok: false, error: 'Invalid JSON body' }, 400);
      }

      const type = normalizeType(payload.type);
      const date = cleanString(payload.date);
      const slug = slugify(payload.slug || '');
      const title = cleanString(payload.title);
      const editedTitle = cleanString(payload.edited_title);
      const filePath = cleanString(payload.file_path);
      const sections = Array.isArray(payload.sections) ? payload.sections : null;

      if (!type || !isIsoDate(date) || !slug || !sections) {
        return json({
          ok: false,
          error: `Invalid publish params. type=${type || '(missing)'} date=${date || '(missing)'} slug=${slug || '(missing)'} sections=${Array.isArray(sections) ? sections.length : '(invalid)'}`
        }, 400);
      }

      const file = await resolveContentFile({ type, date, slug, title, filePath });

      let updatedJson;
      if (type === 'daily') {
        updatedJson = applyDailySections(file.json, editedTitle, sections);
      } else {
        updatedJson = applyGenericBodyHtml(file.json, editedTitle, sections, type);
      }

      const content = JSON.stringify(updatedJson, null, 2) + '\n';

      const commit = await ghFetch(
        `https://api.github.com/repos/${encodeURIComponent(GITHUB_REPO_OWNER)}/${encodeURIComponent(GITHUB_REPO_NAME)}/contents/${ghPath(file.path)}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: buildCommitMessage(type, date, editedTitle || title),
            content: Buffer.from(content, 'utf8').toString('base64'),
            sha: file.sha,
            branch: GITHUB_BRANCH,
            committer: auth.profile?.email
              ? {
                  name: 'TheWrkShop Admin Editor',
                  email: auth.profile.email
                }
              : undefined
          })
        }
      );

      treeCache.loadedAt = 0;

      return json({
        ok: true,
        file_path: file.path,
        commit_sha: commit?.commit?.sha || '',
        updated_json: updatedJson
      });
    }

    return json({ ok: false, error: `Method not allowed: ${method}` }, 405);
  } catch (err) {
    return json({ ok: false, error: err?.message || 'Unexpected server error' }, 500);
  }
};