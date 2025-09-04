// scripts/build-blog.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const CONTENT_DIR = path.join(ROOT, 'content', 'blog');
const DATA_DIR    = path.join(ROOT, 'data');
const BLOG_DIR    = path.join(ROOT, 'blog');
const TPL_PATH    = path.join(ROOT, 'templates', 'blog.html');
const REDIRECTS   = path.join(ROOT, '_redirects');

// Hard start if you want to hide anything older:
const START_DATE = '2025-08-01';

function todayCentralISO() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Chicago', year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(new Date());
}
function toHuman(dateStr) {
  const dt = new Date(dateStr + 'T00:00:00');
  return dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}
function fill(t, map) {
  return Object.entries(map).reduce(
    (acc, [k, v]) => acc.replaceAll(`{{${k}}}`, v ?? ''),
    t
  );
}
function titleToSlug(title) {
  return (title || '')
    .toLowerCase()
    .replace(/['’]/g, '')          // remove apostrophes entirely
    .replace(/[^a-z0-9]+/g, '-')   // collapse everything else to hyphen
    .replace(/^-+|-+$/g, '');      // trim leading/trailing hyphens
}
function fileNameFor(e) {
  const slug = titleToSlug(e.title || 'post');
  return `${e.date}_${slug}.html`;
}

// --- Ensure passthrough rules at top of `_redirects`
async function ensurePassthroughs() {
  const passthroughs = [
    '/blog/*   /blog/:splat   200',
    '/daily/*   /daily/:splat   200',
  ];

  let existing = '';
  try {
    existing = await fs.readFile(REDIRECTS, 'utf-8');
  } catch { /* file not there yet */ }

  const existingLines = existing
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

  const missing = passthroughs.filter(p => !existingLines.includes(p));
  const merged = [
    ...missing,
    ...existingLines
  ].join('\n') + '\n';

  await fs.writeFile(REDIRECTS, merged, 'utf-8');
  console.log('✅ Ensured passthroughs for /blog/* and /daily/* are in _redirects (top of file).');
}

async function main() {
  await ensurePassthroughs();
  await fs.mkdir(DATA_DIR, { recursive: true });

  // Load content
  let files = [];
  try {
    files = (await fs.readdir(CONTENT_DIR)).filter(f => f.endsWith('.json'));
  } catch { /* no blogs yet */ }

  const entries = [];
  for (const f of files) {
    const raw = await fs.readFile(path.join(CONTENT_DIR, f), 'utf-8');
    const j = JSON.parse(raw);

    if (!j.date || !/^\d{4}-\d{2}-\d{2}$/.test(j.date)) throw new Error(`Bad/missing "date" in ${f}`);
    if (!j.title) throw new Error(`Missing "title" in ${f}`);

    entries.push(j);
  }

  // Sort ascending
  entries.sort((a, b) => a.date.localeCompare(b.date));
  const today = todayCentralISO();

  // Allowed window
  const allowed = entries.filter(e => e.date >= START_DATE);
  const visible = allowed.filter(e => e.date <= today);
  const future  = allowed.filter(e => e.date > today);
  const older   = entries.filter(e => e.date < START_DATE);

  // Clean output
  try { await fs.rm(BLOG_DIR, { recursive: true, force: true }); } catch {}
  await fs.mkdir(BLOG_DIR, { recursive: true });

  // Archive JSON (newest first)
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
      href: `/blog/${fileNameFor(e)}`
    }));
  await fs.writeFile(path.join(DATA_DIR, 'blog-archive.json'), JSON.stringify(archive, null, 2));

  // Latest (homepage hook)
  const latest = visible.at(-1);
  if (latest) {
    const blogData = {
      date: latest.date,
      title: latest.title || '',
      category: latest.category || '',
      excerpt: latest.excerpt || '',
      author: latest.author || '',
      reading_minutes: latest.reading_minutes || 0,
      href: `/blog/${fileNameFor(latest)}`
    };
    await fs.writeFile(path.join(DATA_DIR, 'blog.json'), JSON.stringify(blogData, null, 2));
  } else {
    try { await fs.unlink(path.join(DATA_DIR, 'blog.json')); } catch {}
  }

  // Generate pages
  const tpl = await fs.readFile(TPL_PATH, 'utf-8');
  for (let i = 0; i < visible.length; i++) {
    const e = visible[i];
    const prev = visible[i - 1];
    const next = visible[i + 1];

    // Build BODY_HTML dynamically from fields
    const bodyParts = [];

    if (e.kicker) bodyParts.push(`<p class="kicker">${e.kicker}</p>`);
    if (Array.isArray(e.intro)) bodyParts.push(e.intro.map(p => `<p>${p}</p>`).join('\n'));

    if (e.one_minute_win) {
      bodyParts.push(`
        <section class="section callout">
          <h2 class="h2">One-Minute Win</h2>
          <p>${e.one_minute_win}</p>
        </section>`);
    }

    if (Array.isArray(e.picture_this) && e.picture_this.length) {
      bodyParts.push(`
        <section class="section">
          <h2 class="h2">Picture This</h2>
          ${e.picture_this.map(p => `<p>${p}</p>`).join('\n')}
        </section>`);
    }

    if (Array.isArray(e.scriptures) && e.scriptures.length) {
      bodyParts.push(`
        <section class="section">
          <h2 class="h2">Scriptures</h2>
          <div class="kv">
            ${e.scriptures.map(s => `
              <div>
                <div class="k">${s.ref}</div>
                <div class="v">${s.text}</div>
                ${s.insight ? `<p><em>${s.insight}</em></p>` : ''}
                ${s.gem ? `<p><strong>${s.gem}</strong></p>` : ''}
              </div>`).join('\n')}
          </div>
        </section>`);
    }

    if (Array.isArray(e.ways_to_live) && e.ways_to_live.length) {
      bodyParts.push(`
        <section class="section">
          <h2 class="h2">Ways to Live</h2>
          <ul class="list">
            ${e.ways_to_live.map(w => `<li><strong>${w.title}:</strong> ${w.body}</li>`).join('\n')}
          </ul>
        </section>`);
    }

    if (Array.isArray(e.insights) && e.insights.length) {
      bodyParts.push(`
        <section class="section callout">
          <h2 class="h2">Insights</h2>
          ${e.insights.map(p => `<p>${p}</p>`).join('\n')}
        </section>`);
    }

    if (Array.isArray(e.reflective_questions) && e.reflective_questions.length) {
      bodyParts.push(`
        <section class="section">
          <h2 class="h2">Reflective Questions</h2>
          <ul class="list">
            ${e.reflective_questions.map(q => `<li>${q}</li>`).join('\n')}
          </ul>
        </section>`);
    }

    if (e.action_step) {
      bodyParts.push(`
        <section class="section">
          <h2 class="h2">Action Step</h2>
          <p>${e.action_step}</p>
        </section>`);
    }

    if (e.bonus_title || e.bonus_body || e.bonus_list) {
      bodyParts.push(`
        <section class="section">
          <h2 class="h2">${e.bonus_title || 'Bonus'}</h2>
          ${Array.isArray(e.bonus_body) ? e.bonus_body.map(p => `<p>${p}</p>`).join('\n') : ''}
          ${Array.isArray(e.bonus_list) ? `<ul class="list">${e.bonus_list.map(b => `<li>${b}</li>`).join('\n')}</ul>` : ''}
        </section>`);
    }

    if (e.prayer) {
      bodyParts.push(`
        <section class="section">
          <h2 class="h2">Prayer</h2>
          <p>${e.prayer}</p>
        </section>`);
    }

    if (e.declaration) {
      bodyParts.push(`
        <section class="section callout">
          <h2 class="h2">Declaration</h2>
          <p>${e.declaration}</p>
        </section>`);
    }

    if (e.weekly_challenge) {
      bodyParts.push(`
        <section class="section">
          <h2 class="h2">Weekly Challenge</h2>
          <p>${e.weekly_challenge}</p>
        </section>`);
    }

    if (e.invitation) {
      bodyParts.push(`<p class="section">${e.invitation}</p>`);
    }

    if (e.gem_to_carry) {
      bodyParts.push(`
        <section class="section callout">
          <h2 class="h2">Gem to Carry</h2>
          <p>${e.gem_to_carry}</p>
        </section>`);
    }

    const bodyHTML = bodyParts.filter(Boolean).join('\n');

    const html = fill(tpl, {
      TITLE: e.title || 'Untitled',
      CATEGORY: e.category || 'Article',
      DATE: e.date,
      HUMAN_DATE: toHuman(e.date),
      EXCERPT: e.excerpt || '',
      AUTHOR: e.author || '',
      READING_MIN: String(e.reading_minutes || 0),
      BODY_HTML: bodyHTML,
      PREV_HREF: prev ? `./${fileNameFor(prev)}` : '#',
      NEXT_HREF: next ? `./${fileNameFor(next)}` : '#'
    });

    await fs.writeFile(path.join(BLOG_DIR, fileNameFor(e)), html, 'utf-8');
  }

  // Redirect guards
  const guardLines = [
    ...older.map(e => `/blog/${fileNameFor(e)}   /blog-archive.html   302!`),
    ...future.map(e => `/blog/${fileNameFor(e)}   /blog-archive.html   302!`)
  ];

  let existing = '';
  try { existing = await fs.readFile(REDIRECTS, 'utf-8'); } catch {}
  const existingSet = new Set(
    existing.split('\n').map(l => l.trim()).filter(Boolean)
  );
  const toAppend = guardLines.filter(l => l && !existingSet.has(l));
  const merged = (existing.trim() + (toAppend.length ? '\n' + toAppend.join('\n') : '')).trim() + '\n';
  await fs.writeFile(REDIRECTS, merged, 'utf-8');

  console.log(`Blogs built: ${visible.length} in [${START_DATE}..${today}], future: ${future.length}, older: ${older.length}`);
  console.log('Blog pages generated:');
  for (const e of visible) console.log(' -', `/blog/${fileNameFor(e)}`);
}

main().catch(err => { console.error(err); process.exit(1); });
