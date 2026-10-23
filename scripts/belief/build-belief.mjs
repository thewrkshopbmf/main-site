// Builds The Belief Project ("I Believe. Help My Unbelief.") from scripts/belief/belief-data.mjs:
//   belief/index.html                          landing page (hub)
//   tools/belief-under-pressure/index.html     Step 1 · the 24-question assessment
//   belief/trust-diagnostic/index.html         Step 2 · the Hidden Trust Diagnostic
//   belief/belief-and-practice/index.html      Step 2 · conviction and practice
//   belief/prayer/index.html                   Step 3 · write a personal prayer
//   belief/7-day/index.html                    Step 4 · seven-day path (+ optional email)
//   belief/group-guide/index.html              six-session group series
//   belief/belief-data.js                      the same data for the browser (window.TWS_BELIEF)
//
// Usage:  node scripts/belief/build-belief.mjs
// Not part of the Netlify build: run it after editing the data, then commit the output.
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import * as D from './belief-data.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const SITE = 'https://thewrkshop.com';
const OG = `${SITE}/assets/og/belief.png`;
const V = '1'; // bump to bust browser caches of belief.js / belief.css

const esc = (s = '') => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const bible = (ref) => `https://www.biblegateway.com/passage/?search=${encodeURIComponent(ref.replace(/–/g, '-'))}&version=NIV`;
const refLinks = (refs) => refs.split(';').map(r => r.trim()).map(r => `<a href="${bible(r)}" target="_blank" rel="noopener">${esc(r)}</a>`).join('; ');
const json = (o) => JSON.stringify(o, null, 2).replace(/</g, '\\u003c');

export const PAGES = {
  hub: '/belief/',
  assessment: '/tools/belief-under-pressure/',
  diagnostic: '/belief/trust-diagnostic/',
  gap: '/belief/belief-and-practice/',
  prayer: '/belief/prayer/',
  path: '/belief/7-day/',
  group: '/belief/group-guide/'
};

function head({ title, description, url, ogTitle, jsonLd }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${esc(title)}</title>
  <link rel="stylesheet" href="/style.css"/>
  <link rel="stylesheet" href="/patterns/patterns.css"/>
  <link rel="stylesheet" href="/belief/belief.css?v=${V}"/>
  <link rel="icon" type="image/x-icon" href="/assets/favicon/favicon.ico?v=2">
  <meta name="description" content="${esc(description)}"/>
  <link rel="canonical" href="${SITE}${url}"/>
  <meta property="og:site_name" content="TheWrkShop"/>
  <meta property="og:type" content="website"/>
  <meta property="og:title" content="${esc(ogTitle || title)}"/>
  <meta property="og:description" content="${esc(description)}"/>
  <meta property="og:url" content="${SITE}${url}"/>
  <meta property="og:image" content="${OG}"/>
  <meta property="og:image:width" content="1200"/>
  <meta property="og:image:height" content="630"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <script type="application/ld+json">
${json(jsonLd)}
  </script>
  <!-- Google Analytics: page views and start/finish counts only, never answers. -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-N48478JV2Z"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-N48478JV2Z');</script>
</head>`;
}

const publisher = { '@id': `${SITE}/#organization`, '@type': 'Organization', name: 'TheWrkShop', url: SITE };
const webPage = (name, url, description, extra = {}) => ({
  '@context': 'https://schema.org', '@type': 'WebPage', name, url: `${SITE}${url}`, description,
  inLanguage: 'en-US', isAccessibleForFree: true, publisher, isPartOf: { '@id': `${SITE}/#website` }, ...extra
});
const webApp = (name, url, description) => ({
  '@context': 'https://schema.org', '@type': 'WebApplication', name, url: `${SITE}${url}`, description,
  applicationCategory: 'LifestyleApplication', operatingSystem: 'Any', browserRequirements: 'Requires JavaScript',
  isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, inLanguage: 'en-US',
  publisher, isPartOf: { '@id': `${SITE}/#website` }
});

const FOOTER = `
  <footer>
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

const STEPS = [
  { n: '1', label: 'Notice', href: PAGES.assessment, keys: ['assessment'] },
  { n: '2', label: 'Examine', href: PAGES.diagnostic, keys: ['diagnostic', 'gap'] },
  { n: '3', label: 'Respond', href: PAGES.prayer, keys: ['prayer'] },
  { n: '4', label: 'Practice', href: PAGES.path, keys: ['path'] }
];
function stepsNav(current) {
  const items = STEPS.map(s => {
    const on = s.keys.includes(current);
    return `<a href="${s.href}"${on ? ' class="is-current" aria-current="page"' : ''}><span>${s.n}</span>${s.label}</a>`;
  }).join('');
  const group = `<a href="${PAGES.group}" class="bp-steps-group${current === 'group' ? ' is-current' : ''}"${current === 'group' ? ' aria-current="page"' : ''}>Group guide</a>`;
  return `<nav class="bp-steps pt-no-print" aria-label="The Belief Project steps"><div class="pt-wrap">${items}${group}</div></nav>`;
}

function page({ key, title, description, ogTitle, jsonLd, hero, body, scripts = true }) {
  return `${head({ title, description, url: PAGES[key], ogTitle, jsonLd })}
<body class="pt-page bp-page" data-bp="${key}">
  <div id="site-header"></div>
  <main>
${hero}
${key === 'hub' ? '' : stepsNav(key)}
${body}
  </main>
${FOOTER}

  <script src="/script.js"></script>
${scripts ? `  <script src="/belief/belief-data.js?v=${V}"></script>
  <script src="/belief/belief.js?v=${V}"></script>
` : ''}</body>
</html>
`;
}

function toolHero({ crumb, eyebrow, h1, lead }) {
  return `    <section class="pt-hero bp-hero--tool">
      <div class="pt-narrow">
        <nav class="pt-crumbs" aria-label="Breadcrumb"><a href="${PAGES.hub}">The Belief Project</a> / ${esc(crumb)}</nav>
        <span class="pt-eyebrow">${esc(eyebrow)}</span>
        <h1 class="pt-h1">${h1}</h1>
        <p class="pt-lead">${lead}</p>
      </div>
    </section>`;
}

const PRIVACY = 'Private by design: what you enter stays in this browser tab and is never sent to a server. These tools are for voluntary biblical self-reflection, not clinical assessment, pastoral judgment, or a measure of salvation. Grief, fear, uncertainty, and unanswered prayer are not automatically evidence of sin. If you are in crisis or feel unsafe, please reach out to a pastor, a counselor, or emergency services.';

function toolSection(appId, note = PRIVACY, before = '') {
  return `    <section class="pt-tool">
      <div class="pt-narrow">
${before}        <div class="pt-tool-card" id="${appId}" aria-live="polite"><noscript><p>This interactive tool needs JavaScript. You can still read the <a href="${PAGES.path}">seven-day path</a> and the <a href="${PAGES.group}">group guide</a>.</p></noscript></div>
        <p class="pt-note">${esc(note)}</p>
      </div>
    </section>`;
}

// ---------------------------------------------------------------- hub
const HUB_DESC = 'I Believe. Help My Unbelief. Free, private biblical reflection tools from TheWrkShop: a 24-question faith-under-pressure assessment, a hidden trust diagnostic, guided prayer, a seven-day path and a six-session group series.';
const cards = [
  { step: 'Step 1 · Notice', title: 'Belief Under Pressure', text: '24 reflection questions across six themes, about 7–10 minutes.', href: PAGES.assessment, go: 'Take the assessment' },
  { step: 'Step 2 · Examine', title: 'The Hidden Trust Diagnostic', text: 'Choose a real-world situation and separate what happened from the story you’re telling yourself.', href: PAGES.diagnostic, go: 'Explore a scenario' },
  { step: 'Step 2 · Examine', title: 'Belief and Practice', text: 'Six biblical convictions: how strongly you affirm each one, and how much it has shaped your recent choices.', href: PAGES.gap, go: 'Reflect' },
  { step: 'Step 3 · Respond', title: 'Bring It Before Jesus', text: 'Turn your honest reflection into a written prayer, with Scripture to keep praying.', href: PAGES.prayer, go: 'Write a prayer' },
  { step: 'Step 4 · Practice', title: 'Faith in Practice: Seven Days', text: 'One passage, one reflection and one manageable step a day. Read it here or get it by email.', href: PAGES.path, go: 'Start the seven days' },
  { step: 'For groups', title: 'Six-Session Belief Series', text: 'A facilitator guide for small groups, classes and one-on-one discipleship, with a 50-minute format.', href: PAGES.group, go: 'Open the group guide' }
];
const hub = page({
  key: 'hub',
  title: 'I Believe. Help My Unbelief. | The Belief Project | TheWrkShop',
  ogTitle: 'I Believe. Help My Unbelief.',
  description: HUB_DESC,
  jsonLd: webPage('I Believe. Help My Unbelief. — The Belief Project', PAGES.hub, HUB_DESC, {
    about: 'Mark 9:24',
    hasPart: cards.map(c => ({ '@type': 'WebPage', name: c.title, url: `${SITE}${c.href}` }))
  }),
  hero: `    <section class="pt-hero bp-hero">
      <div class="pt-narrow">
        <nav class="pt-crumbs" aria-label="Breadcrumb"><a href="/resources.html">Resources</a> / The Belief Project</nav>
        <span class="pt-eyebrow">The Belief Project</span>
        <h1 class="pt-h1">I believe.<br><em>Help my unbelief.</em></h1>
        <blockquote class="bp-verse"><p>“Lord, I believe; help thou mine unbelief.”</p><cite>Mark 9:24 (KJV)</cite></blockquote>
        <p class="pt-lead">Explore what happens to your trust under pressure, examine what may be underneath your responses, and turn honest reflection into prayer and faithful action.</p>
        <div class="pt-actions">
          <a class="pt-btn pt-btn--ember" href="${PAGES.assessment}">Begin the assessment</a>
          <a class="pt-btn pt-btn--ghost" href="${PAGES.diagnostic}">Explore a scenario first</a>
        </div>
        <p class="bp-promise">Private by default · No account required · No spiritual grade</p>
      </div>
    </section>`,
  body: `    <section class="pt-section">
      <div class="pt-wrap">
        <div class="bp-intro">
          <h2 class="pt-h2">What do you believe when belief becomes costly?</h2>
          <p class="pt-lead">We can sincerely affirm God’s faithfulness and still struggle to trust Him when the outcome is uncertain. These tools help you tell apart the circumstance, the meaning you attach to it, the desire under pressure, and the next faithful response.</p>
        </div>
        <ol class="bp-journey" aria-label="Suggested journey">
          <li><strong>Notice</strong><span>where trust strains</span></li>
          <li><strong>Examine</strong><span>what’s underneath</span></li>
          <li><strong>Respond</strong><span>in honest prayer</span></li>
          <li><strong>Practice</strong><span>one faithful step</span></li>
        </ol>
        <div class="pt-cards">
${cards.map(c => `          <a class="pt-card" href="${c.href}">
            <span class="pt-theme">${esc(c.step)}</span>
            <h3>${esc(c.title)}</h3>
            <p>${esc(c.text)}</p>
            <span class="pt-go">${esc(c.go)} →</span>
          </a>`).join('\n')}
        </div>
        <div class="pt-callout bp-important">
          <p><strong>Important.</strong> These tools are for voluntary biblical self-reflection, not clinical assessment, pastoral judgment, or determining salvation. Grief, fear, uncertainty, and unanswered prayer are not automatically evidence of sin. You can skip questions, avoid entering names, and keep results private: your answers stay in your browser.</p>
        </div>
      </div>
    </section>

    <section class="pt-section">
      <div class="pt-wrap bp-two">
        <div class="pt-panel">
          <span class="pt-label">For churches and small groups</span>
          <h2 class="pt-h3">Using it with a group</h2>
          <ol class="bp-list">
            <li>Share the assessment link ahead of time. Participation is optional.</li>
            <li>Ask everyone to reflect privately on one theme that stood out. Never require anyone to share results.</li>
            <li>Lead the session from the facilitator guide.</li>
            <li>Discuss in groups of three to five, with permission to pass.</li>
            <li>Close with one voluntary next step and prayer.</li>
          </ol>
          <div class="pt-actions"><a class="pt-btn" href="${PAGES.group}">Open the group guide</a></div>
        </div>
        <div class="pt-cta">
          <span class="pt-eyebrow">Free · 7 days</span>
          <h2 class="pt-h2">Get the seven-day path by email</h2>
          <p>One short email each morning for a week: a passage, a reflection and one manageable step. We never ask for or send your answers.</p>
          <div class="pt-actions"><a class="pt-btn pt-btn--ember" href="${PAGES.path}#email">Send me the seven days</a></div>
        </div>
      </div>
    </section>`,
  scripts: false
});

// ---------------------------------------------------------------- tools
const ASSESS_DESC = 'A free, private 24-question reflection on what happens to your trust in God under pressure: uncertainty, disappointment, control, approval, obedience and prayer. About 7–10 minutes. Not a faith score.';
const assessment = page({
  key: 'assessment',
  title: 'Belief Under Pressure: A Free Faith Reflection | TheWrkShop',
  ogTitle: 'Belief Under Pressure',
  description: ASSESS_DESC,
  jsonLd: webApp('Belief Under Pressure', PAGES.assessment, ASSESS_DESC),
  hero: toolHero({ crumb: 'Belief Under Pressure', eyebrow: 'Step 1 · Notice', h1: 'Belief <em>under pressure</em>', lead: 'Twenty-four honest questions about the last 30 days. Notice where trust becomes hard to practice. This is not a measure of how much God loves you.' }),
  body: toolSection('bpAssess')
});

const DIAG_DESC = 'The Hidden Trust Diagnostic: choose a real situation (unanswered prayer, criticism, money, grief) and separate what happened from the story you’re telling yourself, then bring it to prayer. Free and private.';
const diagnostic = page({
  key: 'diagnostic',
  title: 'The Hidden Trust Diagnostic | The Belief Project | TheWrkShop',
  ogTitle: 'The Hidden Trust Diagnostic',
  description: DIAG_DESC,
  jsonLd: webApp('The Hidden Trust Diagnostic', PAGES.diagnostic, DIAG_DESC),
  hero: toolHero({ crumb: 'Hidden Trust Diagnostic', eyebrow: 'Step 2 · Examine', h1: 'The hidden <em>trust</em> diagnostic', lead: 'Choose a situation. Then examine the difference between what happened, what you interpreted, and what you may be tempted to do.' }),
  body: toolSection('bpDiag')
});

const GAP_DESC = 'Six biblical convictions about trusting God. For each one, reflect on how strongly you affirm it and how consistently it has shaped your recent choices. Free and private.';
const gap = page({
  key: 'gap',
  title: 'Belief and Practice: A Conviction Reflection | TheWrkShop',
  ogTitle: 'Belief and Practice',
  description: GAP_DESC,
  jsonLd: webApp('Belief and Practice', PAGES.gap, GAP_DESC),
  hero: toolHero({ crumb: 'Belief and Practice', eyebrow: 'Step 2 · Examine', h1: 'From belief <em>to practice</em>', lead: 'For each conviction, consider both your agreement with it and how consistently it has shaped your recent choices. A difference is a conversation starter, not proof of hypocrisy.' }),
  body: toolSection('bpGap')
});

const PRAYER_DESC = 'Mark 9:24 invites us to bring weak and struggling faith directly to Christ. Choose a theme, name your situation if you like, and write a personal prayer with Scripture. Nothing is saved or sent.';
const prayer = page({
  key: 'prayer',
  title: 'Bring It Before Jesus: Write a Mark 9:24 Prayer | TheWrkShop',
  ogTitle: 'Bring It Before Jesus',
  description: PRAYER_DESC,
  jsonLd: webApp('Bring It Before Jesus', PAGES.prayer, PRAYER_DESC),
  hero: toolHero({ crumb: 'Prayer', eyebrow: 'Step 3 · Respond', h1: 'Bring it <em>before Jesus</em>', lead: 'Mark 9:24 invites us to bring weak and struggling faith directly to Christ. Create a prayer without saving or submitting anything.' }),
  body: toolSection('bpPrayer', 'Nothing you type here is saved or sent anywhere. Use general language if you prefer.')
});

const PATH_DESC = 'Faith in Practice: a free seven-day path through Mark 9, Psalm 73, Daniel 3, James 1, Hebrews 4 and John 15. One passage, one reflection and one step a day. Read it here or get it by email.';
const pathPage = page({
  key: 'path',
  title: 'Faith in Practice: A Seven-Day Path | The Belief Project | TheWrkShop',
  ogTitle: 'Faith in Practice: Seven Days',
  description: PATH_DESC,
  jsonLd: webPage('Faith in Practice: Seven Days', PAGES.path, PATH_DESC),
  hero: toolHero({ crumb: 'Seven-Day Path', eyebrow: 'Step 4 · Practice', h1: 'Faith in practice: <em>seven days</em>', lead: 'These practices are invitations to return to Christ, not a seven-day performance test. Read each passage in context, pray, and take one manageable step.' }),
  body: `    <section class="pt-tool">
      <div class="pt-narrow">
        <div class="pt-tool-card">
          <ol class="pt-days bp-days" id="bpDays">
${D.DAYS.map((d, i) => `            <li id="day-${i + 1}">
              <label>
                <input type="checkbox" data-day="${i}" aria-label="Mark day ${i + 1} done">
                <span class="pt-day-num">Day ${i + 1}</span>
                <span class="pt-day-text"><strong>${esc(d.name)}</strong><br>
                  <span class="bp-day-line"><b>Read:</b> ${refLinks(d.read)}</span>
                  <span class="bp-day-line"><b>Reflect:</b> ${esc(d.reflect)}</span>
                  <span class="bp-day-line"><b>Practice:</b> ${esc(d.practice)}</span>
                </span>
              </label>
            </li>`).join('\n')}
          </ol>
          <p class="pt-progress" id="bpDaysProgress" aria-live="polite"></p>
          <div class="pt-actions pt-no-print">
            <button type="button" class="pt-btn pt-btn--ghost" data-print>Print the seven days</button>
          </div>
          <div id="email"></div>
          <div id="bpPlan"></div>
        </div>
        <p class="pt-note">Checking off a day saves only on this device. If you choose to get the path by email, we keep your email, first name (optional) and, only if you took the assessment, your top theme. Never your answers. Stop anytime from any email.</p>
      </div>
    </section>`
});

const GROUP_DESC = 'A free six-session small-group series on Mark 9:24, Psalm 73, Matthew 6, James 1, Hebrews 4 and John 15, with a 50-minute format and facilitator notes. For any church group or one-on-one discipleship.';
const group = page({
  key: 'group',
  title: 'Six-Session Belief Series: Facilitator Guide | TheWrkShop',
  ogTitle: 'Six-Session Belief Series',
  description: GROUP_DESC,
  jsonLd: webPage('Six-Session Belief Series: Facilitator Guide', PAGES.group, GROUP_DESC),
  hero: toolHero({ crumb: 'Group Guide', eyebrow: 'For churches, ministries and small groups', h1: 'Six-session <em>belief</em> series', lead: 'Use this resource in men’s groups, women’s groups, mixed groups, or one-on-one discipleship. Assessment responses stay private unless participants freely choose to share them.' }),
  body: `    <section class="pt-tool">
      <div class="pt-narrow">
        <div class="pt-tool-card bp-guide">
          <h2 class="pt-h3">Suggested 50-minute format</h2>
          <ol class="bp-format">
${D.FORMAT.map(([n, t, m]) => `            <li><strong>${esc(n)}</strong> <span>${esc(t)}</span> <em>${m} min</em></li>`).join('\n')}
          </ol>
          <p class="pt-muted pt-small">For a 70-minute gathering, extend the textual study and scenario discussion. Do not ask leaders to interpret participants’ private assessment results.</p>

          <h2 class="pt-h3 bp-gap-top">The six sessions</h2>
${D.SESSIONS.map((s, i) => `          <details class="bp-session"${i === 0 ? ' open' : ''}>
            <summary><span>Session ${i + 1}</span> ${esc(s.title)}</summary>
            <p><strong>Primary texts:</strong> ${refLinks(s.texts)}</p>
            <p><strong>Word · textual study:</strong> ${esc(s.study)}</p>
            <p><strong>Search · group question:</strong> ${esc(s.question)}</p>
            <p><strong>Response · weekly practice:</strong> ${esc(s.practice)}</p>
            <p class="pt-muted pt-small"><strong>Facilitator note:</strong> Read the full passage in context, invite voluntary sharing, and do not treat responses as proof of hidden motives or deficient faith.</p>
          </details>`).join('\n')}

          <h2 class="pt-h3 bp-gap-top">Before the first session</h2>
          <ul>
            <li>Share the <a href="${PAGES.assessment}">Belief Under Pressure assessment</a> as an optional, private starting point.</li>
            <li>Set expectations: confidentiality, permission to pass, and no fixing each other.</li>
            <li>Know where to point someone who is grieving deeply or in crisis: a pastor, a counselor, or emergency help.</li>
          </ul>
          <div class="pt-actions pt-no-print">
            <button type="button" class="pt-btn" data-print>Print facilitator guide</button>
            <a class="pt-btn pt-btn--ghost" href="${PAGES.path}">Seven-day path for participants</a>
          </div>
        </div>
      </div>
    </section>`
});

// ---------------------------------------------------------------- write
const browserData = {
  pages: PAGES, themes: D.THEMES, questions: D.QUESTIONS, frequency: D.FREQUENCY,
  scenarios: D.SCENARIOS, themeScenario: D.THEME_SCENARIO, followups: D.FOLLOWUPS,
  convictions: D.CONVICTIONS, affirm: D.AFFIRM, practice: D.PRACTICE, days: D.DAYS
};

const out = [
  ['belief/index.html', hub],
  ['tools/belief-under-pressure/index.html', assessment],
  ['belief/trust-diagnostic/index.html', diagnostic],
  ['belief/belief-and-practice/index.html', gap],
  ['belief/prayer/index.html', prayer],
  ['belief/7-day/index.html', pathPage],
  ['belief/group-guide/index.html', group],
  ['belief/belief-data.js', `/* Generated by scripts/belief/build-belief.mjs from belief-data.mjs. Do not edit by hand. */\nwindow.TWS_BELIEF = ${json(browserData)};\n`]
];
for (const [rel, content] of out) {
  const file = path.join(ROOT, rel);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, content);
  console.log('wrote', rel);
}
