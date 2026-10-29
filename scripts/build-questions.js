// scripts/build-questions.js
// Builds the Questions section: one answer page per real question men search for,
// plus the /questions/ hub. Source files live in content/questions/*.json.
//
// Each file:
//   slug, question, answer (2-3 sentences; shown first, quoted by Google and AI answers),
//   description (meta, ~150 chars), updated (YYYY-MM-DD),
//   sections: [{ heading, paragraphs: ["...", ...], list?: ["...", ...] }]
//   scriptures: [{ ref, text }]
//   steps: ["...", ...]                         (practical next steps)
//   tool: { href, title, text }                 (the matching reflection tool)
//   related: [{ href, title }]                  (Dailies and studies on the same topic)
//   faqs: [{ q, a }]                             (short follow-up questions)
// Inline [text](/path) links are allowed in paragraphs, list items, steps and faq answers.
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'content', 'questions');
const OUT = path.join(ROOT, 'questions');
const SITE = 'https://thewrkshop.com';

const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const inline = (s) => esc(s).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\[([^\]]+)\]\((\/[^)\s]*|https:\/\/[^)\s]+)\)/g, (_, t, h) => `<a href="${h}">${t}</a>`);
const plain = (s) => String(s ?? '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

const GA = `  <script async src="https://www.googletagmanager.com/gtag/js?id=G-N48478JV2Z"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-N48478JV2Z');</script>`;

const FOOTER = `  <footer>
    <div class="footer-content">
      <nav class="footer-links" aria-label="Browse">
        <a href="/upstream/">Start Here</a>
        <a href="/daily.html">The Daily</a>
        <a href="/leadership/">Leadership</a>
        <a href="/get-known.html">Groups</a>
        <a href="/library/">Library</a>
        <a href="/blog-archive.html">Blog</a>
        <a href="/podcasts.html">Podcast</a>
        <a href="/resources.html">Resources</a>
        <a href="/#contact">Contact</a>
        <a href="/privacy/">Privacy</a>
      </nav>
      <div class="footer-logo"><img src="/assets/images/thewrkshop-logo-transparent-trimmed.png" alt="TheWrkShop" width="233" height="180" loading="lazy"></div>
      <p>&copy; 2026 <span class="sitename"></span>. All rights reserved.</p>
    </div>
  </footer>

  <script src="/script.js"></script>`;

const SIGNUP = `    <section class="daily-signup" aria-labelledby="qSignupTitle">
      <h2 id="qSignupTitle">Get The Daily</h2>
      <p>One Scripture, one hard question and one step, every weekday morning.</p>
      <form class="daily-signup-form" novalidate>
        <input type="text" name="first_name" placeholder="First name (optional)" autocomplete="given-name" maxlength="60" />
        <input type="email" name="email" placeholder="Your email" autocomplete="email" required />
        <input type="text" name="company" class="hp-field" tabindex="-1" autocomplete="off" aria-hidden="true" />
        <button type="submit">Send Me the Daily</button>
      </form>
      <p class="daily-signup-msg" role="status" aria-live="polite"></p>
    </section>`;

function head({ title, description, url, jsonLd }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${esc(title)}</title>
  <link rel="stylesheet" href="/style.css"/>
  <link rel="stylesheet" href="/questions/questions.css"/>
  <link rel="icon" type="image/x-icon" href="/assets/favicon/favicon.ico?v=2">
  <meta name="description" content="${esc(description)}"/>
  <link rel="canonical" href="${url}"/>
  <meta property="og:site_name" content="TheWrkShop"/>
  <meta property="og:type" content="article"/>
  <meta property="og:title" content="${esc(title.replace(/\s*\|\s*TheWrkShop$/, ''))}"/>
  <meta property="og:description" content="${esc(description)}"/>
  <meta property="og:url" content="${url}"/>
  <meta property="og:image" content="${SITE}/assets/og/the-daily.png"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>
${GA}
</head>`;
}

function page(q) {
  const url = `${SITE}/questions/${q.slug}/`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: q.question,
        description: q.description,
        url,
        dateModified: q.updated,
        inLanguage: 'en-US',
        author: { '@id': `${SITE}/#organization` },
        publisher: { '@id': `${SITE}/#organization` },
        isPartOf: { '@id': `${SITE}/#website` },
        about: (q.scriptures || []).map((s) => s.ref)
      },
      {
        '@type': 'FAQPage',
        mainEntity: [{ q: q.question, a: q.answer }, ...(q.faqs || [])].map((f) => ({
          '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: plain(f.a) }
        }))
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Questions', item: `${SITE}/questions/` },
          { '@type': 'ListItem', position: 2, name: q.question, item: url }
        ]
      }
    ]
  };

  const sections = (q.sections || []).map((s) => `
      <section>
        <h2>${esc(s.heading)}</h2>
${(s.paragraphs || []).map((p) => `        <p>${inline(p)}</p>`).join('\n')}
${s.list ? `        <ul>\n${s.list.map((i) => `          <li>${inline(i)}</li>`).join('\n')}\n        </ul>` : ''}
      </section>`).join('\n');

  const scriptures = (q.scriptures || []).length ? `
      <section class="q-scripture">
        <h2>What Scripture says</h2>
${q.scriptures.map((s) => `        <blockquote><p>“${esc(s.text)}”</p><cite>${esc(s.ref)}</cite></blockquote>`).join('\n')}
      </section>` : '';

  const steps = (q.steps || []).length ? `
      <section class="q-steps">
        <h2>Try this today</h2>
        <ol>
${q.steps.map((s) => `          <li>${inline(s)}</li>`).join('\n')}
        </ol>
      </section>` : '';

  const tool = q.tool ? `
      <aside class="q-tool">
        <p class="q-tool-label">Go deeper, privately</p>
        <h2><a href="${esc(q.tool.href)}" data-next-step="question_tool">${esc(q.tool.title)}</a></h2>
        <p>${inline(q.tool.text)}</p>
        <a class="q-btn" href="${esc(q.tool.href)}" data-next-step="question_tool">Start the reflection →</a>
      </aside>` : '';

  const related = (q.related || []).length ? `
      <section class="q-related">
        <h2>Read more on this</h2>
        <ul>
${q.related.map((r) => `          <li><a href="${esc(r.href)}">${esc(r.title)}</a></li>`).join('\n')}
        </ul>
      </section>` : '';

  const faqs = (q.faqs || []).length ? `
      <section class="q-faq">
        <h2>Common follow-up questions</h2>
${q.faqs.map((f) => `        <details>
          <summary>${esc(f.q)}</summary>
          <p>${inline(f.a)}</p>
        </details>`).join('\n')}
      </section>` : '';

  return `${head({ title: q.seo_title || `${q.question} | TheWrkShop`, description: q.description, url, jsonLd })}
<body>
  <div id="site-header"></div>
  <main class="q-wrap">
    <article>
      <nav class="q-crumbs" aria-label="Breadcrumb"><a href="/questions/">Questions</a></nav>
      <h1>${esc(q.question)}</h1>
      <p class="q-answer">${inline(q.answer)}</p>
${sections}
${scriptures}
${steps}
${tool}
      <aside class="q-group">
        <h2>You don’t have to work this out alone</h2>
        <p>TheWrkShop’s online groups are small rooms of men who tell each other the truth. It starts with a short form and a 20-minute call.</p>
        <a class="q-btn q-btn--light" href="/get-known.html" data-next-step="question_groups">Get known →</a>
      </aside>
${related}
${faqs}
      <p class="q-updated">Updated <time datetime="${esc(q.updated)}">${esc(q.updated)}</time> · Scripture quotations are from the NIV unless noted.</p>
    </article>
${SIGNUP}
  </main>

${FOOTER}
</body>
</html>
`;
}

function hub(list) {
  const url = `${SITE}/questions/`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Questions men ask about faith, character and leadership',
    url,
    isPartOf: { '@id': `${SITE}/#website` },
    hasPart: list.map((q) => ({ '@type': 'Article', headline: q.question, url: `${url}${q.slug}/` }))
  };
  const cards = list.map((q) => `      <a class="q-card" href="/questions/${esc(q.slug)}/">
        <h2>${esc(q.question)}</h2>
        <p>${esc(plain(q.answer).split(/(?<=\.)\s/)[0])}</p>
      </a>`).join('\n');
  return `${head({
    title: 'Questions Men Ask About Faith, Character and Leadership | TheWrkShop',
    description: 'Straight answers from Scripture to the questions men actually ask: anger, approval, temptation, shame, starting a men’s group and more.',
    url, jsonLd
  })}
<body>
  <div id="site-header"></div>
  <section class="page-hero q-hero">
    <h1>Questions men ask</h1>
    <p>Straight answers from Scripture to real questions, each with a next step you can take today.</p>
  </section>
  <main class="q-wrap">
    <div class="q-list">
${cards}
    </div>
    <p class="q-more">Have a question we haven’t answered? <a href="/#contact">Ask us</a>.</p>
${SIGNUP}
  </main>

${FOOTER}
</body>
</html>
`;
}

async function main() {
  let files = [];
  try { files = (await fs.readdir(SRC)).filter((f) => f.endsWith('.json')); } catch { console.log('No questions yet.'); return; }
  const list = [];
  for (const f of files) {
    const q = JSON.parse(await fs.readFile(path.join(SRC, f), 'utf-8'));
    if (!q.slug || !q.question || !q.answer) { console.warn(`Skipping ${f}: needs slug, question and answer`); continue; }
    list.push(q);
  }
  list.sort((a, b) => (b.updated || '').localeCompare(a.updated || '') || a.question.localeCompare(b.question));
  for (const q of list) {
    const dir = path.join(OUT, q.slug);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, 'index.html'), page(q));
  }
  await fs.writeFile(path.join(OUT, 'index.html'), hub(list));
  console.log(`Built /questions/ with ${list.length} answers.`);
}

main().catch((err) => { console.error(err); process.exit(1); });
