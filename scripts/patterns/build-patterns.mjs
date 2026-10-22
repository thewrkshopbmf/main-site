// Builds the Pattern Practice Library from scripts/patterns/patterns-data.mjs:
//   patterns/index.html             library index
//   patterns/<id>/index.html        one static landing page per pattern (search-friendly)
//   patterns/patterns-data.js       the same data for the Pattern Finder and Interruption Lab
//
// Usage:  node scripts/patterns/build-patterns.mjs
// Not part of the Netlify build: run it after editing the data, then commit the output.
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { PATTERNS, SETTINGS } from './patterns-data.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const SITE = 'https://thewrkshop.com';
const OUT = path.join(ROOT, 'patterns');
const FINDER = '/tools/pattern-finder/';
const LAB = '/tools/interruption-lab/';

const esc = (s = '') => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const bible = (ref) => `https://www.biblegateway.com/passage/?search=${encodeURIComponent(ref.replace(/–/g, '-'))}&version=NIV`;
const json = (o) => JSON.stringify(o, null, 2).replace(/</g, '\\u003c');

function head({ title, description, url, ogTitle, jsonLd }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${esc(title)}</title>
  <link rel="stylesheet" href="/style.css"/>
  <link rel="stylesheet" href="/patterns/patterns.css"/>
  <link rel="icon" type="image/x-icon" href="/assets/favicon/favicon.ico?v=2">
  <meta name="description" content="${esc(description)}"/>
  <link rel="canonical" href="${SITE}${url}"/>
  <link rel="alternate" type="application/rss+xml" title="TheWrkShop — The Daily" href="${SITE}/daily/feed.xml"/>
  <meta property="og:site_name" content="TheWrkShop"/>
  <meta property="og:type" content="article"/>
  <meta property="og:title" content="${esc(ogTitle || title)}"/>
  <meta property="og:description" content="${esc(description)}"/>
  <meta property="og:url" content="${SITE}${url}"/>
  <meta property="og:image" content="${SITE}/assets/og/site.png"/>
  <meta property="og:image:width" content="1200"/>
  <meta property="og:image:height" content="630"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <script type="application/ld+json">
${json(jsonLd)}
  </script>
  <!-- Google Analytics (same GA4 property as the rest of the site) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-N48478JV2Z"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-N48478JV2Z');</script>
</head>`;
}

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
        <a href="/products.html">Store</a>
        <a href="/#contact">Contact</a>
      </nav>
      <div class="footer-logo"><img src="/assets/images/thewrkshop-logo-transparent-trimmed.png" alt="TheWrkShop" width="233" height="180" loading="lazy"></div>
      <p>&copy; 2026 <span class="sitename"></span>. All rights reserved.</p>
    </div>
  </footer>`;

const SAFETY = 'This is an educational reflection resource, not a diagnostic instrument or a substitute for mental health care. If you face abuse, coercion or unsafe conflict, put your safety first and reach out for appropriate support rather than practicing exposure to harm.';

const card = (p) => `      <a class="pt-card" href="/patterns/${p.id}/">
        <span class="pt-theme">${esc(p.theme)}</span>
        <h3>${esc(p.name)}</h3>
        <p>${esc(p.search)}</p>
        <span class="pt-go">Explore →</span>
      </a>`;

const organization = { '@id': `${SITE}/#organization`, '@type': 'Organization', name: 'TheWrkShop', url: SITE };

/* ---------- library index ---------- */
function indexPage() {
  const url = '/patterns/';
  const description = 'Six recurring response patterns, from defensiveness to people-pleasing, with real-life examples, reflection questions, 7-day practices and biblical insight. Free from TheWrkShop.';
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Pattern Practice Library', url: `${SITE}${url}`, description,
    isPartOf: { '@id': `${SITE}/#website` }, publisher: organization,
    mainEntity: { '@type': 'ItemList', itemListElement: PATTERNS.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.search, url: `${SITE}/patterns/${p.id}/` })) }
  };
  return `${head({ title: 'Pattern Practice Library: Recognize It, Interrupt It, Replace It | TheWrkShop', description, url, ogTitle: 'Recognize it. Interrupt it. Replace it.', jsonLd })}
<body class="pt-page">
  <div id="site-header"></div>
  <main>
    <section class="pt-hero">
      <div class="pt-wrap">
        <span class="pt-eyebrow">Pattern Practice Library</span>
        <h1 class="pt-h1">Recognize it. <em>Interrupt it.</em> Replace it.</h1>
        <p class="pt-lead">A practical library for understanding the reactions that keep repeating, practicing better responses, and exploring biblical wisdom, without reducing yourself to a label.</p>
        <div class="pt-actions">
          <a class="pt-btn pt-btn--ember" href="${FINDER}">Take the Pattern Finder</a>
          <a class="pt-btn pt-btn--ghost" href="${LAB}">Practice in the Lab</a>
        </div>
      </div>
    </section>

    <section class="pt-section">
      <div class="pt-wrap">
        <h2 class="pt-h2">Choose a pattern to explore</h2>
        <p class="pt-muted">You don’t need an assessment result to begin. Choose the question that feels most relevant today.</p>
        <div class="pt-cards">
${PATTERNS.map(card).join('\n')}
        </div>
      </div>
    </section>

    <section class="pt-section">
      <div class="pt-wrap">
        <div class="pt-grid3">
          <div class="pt-panel"><span class="pt-label">Step 1</span><h3 class="pt-h3">Find it</h3><p>The <a href="${FINDER}">Pattern Finder</a> takes 3–5 minutes and points you to the pattern that shows up most for you.</p></div>
          <div class="pt-panel"><span class="pt-label">Step 2</span><h3 class="pt-h3">Understand it</h3><p>Each pattern page shows what may be underneath, where it shows up, and a 7-day practice.</p></div>
          <div class="pt-panel"><span class="pt-label">Step 3</span><h3 class="pt-h3">Rehearse it</h3><p>The <a href="${LAB}">Interruption Lab</a> walks you through a tense moment so the better response is ready when you need it.</p></div>
        </div>
        <p class="pt-note">${esc(SAFETY)}</p>
      </div>
    </section>
  </main>

${FOOTER}

  <script src="/script.js"></script>
</body>
</html>
`;
}

/* ---------- one pattern ---------- */
function patternPage(p) {
  const url = `/patterns/${p.id}/`;
  const description = `${p.insight} ${p.name}: what may be underneath, where it shows up, and a free 7-day practice with biblical insight.`;
  const others = PATTERNS.filter(o => o.id !== p.id);
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Article', headline: p.search, about: `${p.name} (${p.theme})`,
    description, url: `${SITE}${url}`, inLanguage: 'en-US', isAccessibleForFree: true,
    author: organization, publisher: organization, isPartOf: { '@id': `${SITE}/#website` },
    breadcrumb: { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Pattern Library', item: `${SITE}/patterns/` },
      { '@type': 'ListItem', position: 3, name: p.name, item: `${SITE}${url}` }
    ] }
  };
  const list = (items) => `<ul>${items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>`;
  const places = ['At work', 'In relationships', 'At home'];

  return `${head({ title: `${p.search} ${p.name} | TheWrkShop`, description, url, ogTitle: p.search, jsonLd })}
<body class="pt-page" data-pattern="${p.id}">
  <div id="site-header"></div>
  <main>
    <section class="pt-hero">
      <div class="pt-wrap">
        <nav class="pt-crumbs" aria-label="Breadcrumb"><a href="/patterns/">Pattern Library</a> / ${esc(p.name)}</nav>
        <span class="pt-name-pill">${esc(p.name)} · ${esc(p.theme)}</span>
        <h1 class="pt-h1">${esc(p.search)}</h1>
        <p class="pt-lead">${esc(p.insight)}</p>
        <div class="pt-actions">
          <a class="pt-btn pt-btn--ember" href="#practice">Start the 7-day practice</a>
          <a class="pt-btn pt-btn--ghost" href="${FINDER}">Not sure this is you? Take the Pattern Finder</a>
        </div>
      </div>
    </section>

    <section class="pt-section">
      <div class="pt-wrap">
        <span class="pt-eyebrow">What it looks like</span>
        <h2 class="pt-h2">${esc(p.desc)}</h2>
        <div class="pt-grid3">
          <div class="pt-col pt-panel"><h3>What may feel threatened</h3>${list(p.threat)}</div>
          <div class="pt-col pt-panel"><h3>Common first reactions</h3>${list(p.reaction)}</div>
          <div class="pt-col pt-panel"><h3>What often follows</h3>${list(p.after)}</div>
        </div>
      </div>
    </section>

    <section class="pt-section">
      <div class="pt-wrap">
        <span class="pt-eyebrow">Where it shows up</span>
        <h2 class="pt-h2">Where this might show up</h2>
        <div class="pt-grid3">
${p.scenarios.map((s, i) => `          <div class="pt-scenario"><strong>${places[i]}</strong>${esc(s)}</div>`).join('\n')}
        </div>
        <p class="pt-muted pt-small">Examples are illustrative, not proof of anyone’s motives. Responding firmly to real mistreatment can be appropriate.</p>
      </div>
    </section>

    <section class="pt-section">
      <div class="pt-narrow">
        <div class="pt-panel">
          <span class="pt-eyebrow">Look beneath the reaction</span>
          <h2 class="pt-h2">${esc(p.question)}</h2>
          <p><strong>Pause and ask:</strong> ${esc(p.pauseQuestion)}</p>
          <div class="pt-callout">
            <span class="pt-label">Practice a different response</span>
            <p><strong>${esc(p.replacement)}</strong></p>
            <p>${esc(p.tryInstead)}</p>
          </div>
          <div class="pt-actions pt-no-print">
            <a class="pt-btn pt-btn--ghost" href="${LAB}?pattern=${p.id}">Rehearse it in the Interruption Lab</a>
          </div>
        </div>
      </div>
    </section>

    <section class="pt-section" id="practice">
      <div class="pt-narrow">
        <div class="pt-panel">
          <span class="pt-eyebrow">Your seven-day practice</span>
          <h2 class="pt-h2">One small step a day</h2>
          <p class="pt-muted pt-small pt-no-print">Check each practice as you finish it. Your checkmarks are saved in this browser only.</p>
          <ul class="pt-days" id="ptDays">
${p.days.map((d, i) => `            <li><label><input type="checkbox" data-day="${i}"><span class="pt-day-num">Day ${i + 1}</span><span class="pt-day-text">${esc(d)}</span></label></li>`).join('\n')}
          </ul>
          <p class="pt-progress" id="ptProgress" role="status" aria-live="polite">0 of 7 practices checked</p>
          <div class="pt-actions pt-no-print">
            <button class="pt-btn" type="button" id="ptCopy">Copy practice plan</button>
            <button class="pt-btn pt-btn--ghost" type="button" id="ptPrint">Print / save as PDF</button>
            <button class="pt-btn pt-btn--ghost" type="button" id="ptClear">Clear checkmarks</button>
          </div>
          <p class="pt-feedback" id="ptFeedback" role="status"></p>
        </div>
      </div>
    </section>

    <section class="pt-section">
      <div class="pt-narrow">
        <div class="pt-panel">
          <span class="pt-eyebrow">Optional biblical reflection</span>
          <h2 class="pt-h2"><a href="${bible(p.verse)}" target="_blank" rel="noopener">${esc(p.verse)}</a></h2>
          <p class="pt-muted">${esc(p.nuance)}</p>
          <p>Read the passage in context. What does it reveal about God, people and wise responses? What is one faithful action you can take?</p>
        </div>
      </div>
    </section>

    <section class="pt-section pt-no-print">
      <div class="pt-wrap">
        <div class="pt-cta">
          <h2 class="pt-h2">Keep the battle upstream</h2>
          <p>The Daily brings one Scripture, one hard question and one step to your inbox every weekday morning.</p>
          <div class="pt-actions">
            <a class="pt-btn pt-btn--ember" href="/daily.html">Get The Daily</a>
            <a class="pt-btn pt-btn--ghost" href="/get-known.html">Join a group</a>
          </div>
        </div>
      </div>
    </section>

    <section class="pt-section pt-no-print">
      <div class="pt-wrap">
        <h2 class="pt-h2">Explore the other patterns</h2>
        <div class="pt-cards">
${others.map(card).join('\n')}
        </div>
        <p class="pt-note">${esc(SAFETY)}</p>
      </div>
    </section>
  </main>

${FOOTER}

  <script src="/script.js"></script>
  <script src="/patterns/pattern-page.js"></script>
</body>
</html>
`;
}

/* ---------- browser data for the Finder and Lab ---------- */
function dataFile() {
  const pick = PATTERNS.map(p => ({
    id: p.id, name: p.name, theme: p.theme, search: p.search, desc: p.desc,
    questions: p.questions, threat: p.threat, reaction: p.reaction, after: p.after,
    pauseQuestion: p.pauseQuestion, tryInstead: p.tryInstead, verse: p.verse, days: p.days,
    instinct: p.instinct, need: p.need, pauseThought: p.pauseThought, response: p.response, labVerse: p.labVerse
  }));
  return `// Generated by scripts/patterns/build-patterns.mjs from scripts/patterns/patterns-data.mjs. Do not edit by hand.
window.TWS_PATTERNS = ${JSON.stringify(pick, null, 1)};
window.TWS_LAB_SETTINGS = ${JSON.stringify(SETTINGS, null, 1)};
`;
}

await fs.mkdir(OUT, { recursive: true });
await fs.writeFile(path.join(OUT, 'index.html'), indexPage());
for (const p of PATTERNS) {
  await fs.mkdir(path.join(OUT, p.id), { recursive: true });
  await fs.writeFile(path.join(OUT, p.id, 'index.html'), patternPage(p));
}
await fs.writeFile(path.join(OUT, 'patterns-data.js'), dataFile());
console.log(`Built /patterns/ and ${PATTERNS.length} pattern pages.`);
