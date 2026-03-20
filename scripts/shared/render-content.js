// scripts/shared/render-content.js

export function todayCentralISO() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Chicago',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date());
}

export function toHuman(dateStr) {
  const dt = new Date(dateStr + 'T00:00:00');
  return dt.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function fill(template, map) {
  let out = template;
  for (const [k, v] of Object.entries(map)) {
    out = out.replaceAll(`{{${k}}}`, String(v ?? ''));
  }
  return out;
}

export function titleToSlug(title) {
  return (title || '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function slugBase(s) {
  return (s || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['"]/g, '')
    .replace(/[^A-Za-z0-9\s:–—-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function scriptureToSlug(ref) {
  return slugBase(ref)
    .replace(/[:–—]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function blogFileNameFor(entry) {
  const slug = titleToSlug(entry.title || 'post');
  return `${entry.date}_${slug}/index.html`;
}

export function dailyFileNameFor(entry) {
  const scripture = scriptureToSlug(entry.verse_ref || 'Scripture');
  const title = titleToSlug(entry.title || 'Daily');
  return `${scripture}_${title}_${entry.date}.html`;
}

function esc(s = '') {
  return String(s);
}

function section(title, inner, extraClass = '') {
  const h = title ? `<h2 class="h2">${esc(title)}</h2>` : '';
  return `<section class="section ${extraClass}">${h}${inner || ''}</section>`;
}

function list(items, ordered = false) {
  if (!Array.isArray(items) || !items.length) return '';
  const li = items.map(x => `<li>${x}</li>`).join('\n');
  return ordered ? `<ol class="list">${li}</ol>` : `<ul class="list">${li}</ul>`;
}

function scripturesBlock(arr) {
  if (!Array.isArray(arr) || !arr.length) return '';
  const cards = arr.map(s => `
    <div>
      <div class="k">${esc(s.ref || '')}</div>
      ${s.text ? `<p class="quote">${esc(s.text)}</p>` : ''}
      ${s.insight ? `<p class="sub">Insight: ${esc(s.insight)}</p>` : ''}
      ${s.gem ? `<p><em>Gem:</em> ${esc(s.gem)}</p>` : ''}
    </div>
  `).join('\n');
  return `<div class="kv">${cards}</div>`;
}

export function paraHTML(val) {
  if (Array.isArray(val)) return val.join('');
  if (typeof val === 'string') return val;
  return '';
}

export function renderLegacyBlogBody(entry) {
  const e = entry;
  const parts = [];

  if (e.kicker || e.salutation || e.intro) {
    const introHTML = Array.isArray(e.intro)
      ? e.intro.map(p => `<p>${esc(p)}</p>`).join('\n')
      : (e.intro ? `<p>${esc(e.intro)}</p>` : '');

    parts.push(section('', `
      ${e.kicker ? `<div class="kicker">${esc(e.kicker)}</div>` : ''}
      ${e.salutation ? `<p>${esc(e.salutation)}</p>` : ''}
      ${introHTML}
    `));
  }

  if (e.one_minute_win) {
    parts.push(section('One-Minute Win', `<p>${esc(e.one_minute_win)}</p>`, 'callout'));
  }

  if (Array.isArray(e.picture_this) && e.picture_this.length) {
    parts.push(section('Picture This', e.picture_this.map(p => `<p>${esc(p)}</p>`).join('\n')));
  }

  if (Array.isArray(e.scriptures) && e.scriptures.length) {
    parts.push(section('4 Scriptures · Insights · Gems', scripturesBlock(e.scriptures)));
  }

  if (Array.isArray(e.ways_to_live) && e.ways_to_live.length) {
    const items = e.ways_to_live.map(w =>
      `${w.title ? `<strong>${esc(w.title)}:</strong> ` : ''}${esc(w.body || '')}`
    );
    parts.push(section('3 Ways to Live It Out', list(items, true)));
  }

  if (Array.isArray(e.insights) && e.insights.length) {
    parts.push(section('Insights', list(e.insights)));
  }

  if (Array.isArray(e.reflective_questions) && e.reflective_questions.length) {
    parts.push(section('2 Reflective Questions', list(e.reflective_questions, true)));
  }

  if (e.action_step) {
    parts.push(section('1 Action Step', `<p>${esc(e.action_step)}</p>`));
  }

  if (e.bonus_title || e.bonus_body || e.bonus_list) {
    const body = Array.isArray(e.bonus_body)
      ? e.bonus_body.map(p => `<p>${esc(p)}</p>`).join('\n')
      : (e.bonus_body ? `<p>${esc(e.bonus_body)}</p>` : '');

    const listHTML = Array.isArray(e.bonus_list) && e.bonus_list.length
      ? list(e.bonus_list, true)
      : '';

    parts.push(section(e.bonus_title || 'Bonus', body + listHTML));
  }

  if (e.prayer || e.declaration) {
    const inner = `
      ${e.prayer ? `<p><strong>Prayer</strong><br>${esc(e.prayer)}</p>` : ''}
      ${e.declaration ? `<p><strong>Declaration</strong><br>${esc(e.declaration)}</p>` : ''}
    `;
    parts.push(section('', inner, 'callout'));
  }

  if (e.weekly_challenge || e.invitation || e.gem_to_carry) {
    const inner = `
      <p><strong>Weekly Challenge + Invitation</strong></p>
      ${e.weekly_challenge ? `<p><strong>Challenge:</strong> ${esc(e.weekly_challenge)}</p>` : ''}
      ${e.invitation ? `<p><strong>Invitation:</strong> ${esc(e.invitation)}</p>` : ''}
      ${e.gem_to_carry ? `<p><em>Gem:</em> ${esc(e.gem_to_carry)}</p>` : ''}
    `;
    parts.push(section('', inner));
  }

  return parts.filter(Boolean).join('\n');
}

export function normalizeInsight(x) {
  if (Array.isArray(x)) return x.filter(Boolean).map(String);
  if (typeof x === 'string') return [x];
  return [];
}

export function sanitizePreviewHTML(html) {
  if (!html) return '';

  let out = String(html);

  out = out.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
  out = out.replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, '');
  out = out.replace(/<object[\s\S]*?>[\s\S]*?<\/object>/gi, '');
  out = out.replace(/<embed[\s\S]*?>/gi, '');

  out = out.replace(/\son\w+="[^"]*"/gi, '');
  out = out.replace(/\son\w+='[^']*'/gi, '');
  out = out.replace(/\shref\s*=\s*(['"])javascript:[\s\S]*?\1/gi, ' href="#"');
  out = out.replace(/\ssrc\s*=\s*(['"])javascript:[\s\S]*?\1/gi, '');

  return out;
}

export function buildBlogBodyHTML(entry) {
  let bodyHTML = '';

  if (entry.body_html !== undefined && entry.body_html !== null) {
    bodyHTML = sanitizePreviewHTML(paraHTML(entry.body_html).trim());
  }

  if (!bodyHTML) {
    bodyHTML = renderLegacyBlogBody(entry).trim();
  }

  return bodyHTML;
}

export function buildDailyInsightHTML(entry) {
  return normalizeInsight(entry.insight)
    .map(p => `<p>${esc(p)}</p>`)
    .join('\n');
}

export function buildBlogPreviewHTML({ template, entry, prevHref = '#', nextHref = '#' }) {
  return fill(template, {
    TITLE: entry.title || 'Untitled',
    CATEGORY: entry.category || 'Article',
    DATE: entry.date || '',
    HUMAN_DATE: entry.date ? toHuman(entry.date) : '',
    EXCERPT: entry.excerpt || '',
    AUTHOR: entry.author || '',
    READING_MIN: String(entry.reading_minutes || 0),
    BODY_HTML: buildBlogBodyHTML(entry),
    PREV_HREF: prevHref,
    NEXT_HREF: nextHref
  });
}

export function buildDailyPreviewHTML({ template, entry, prevHref = '#', nextHref = '#' }) {
  return fill(template, {
    TITLE: entry.title || 'Untitled',
    HUMAN_DATE: entry.date ? toHuman(entry.date) : '',
    DATE: entry.date || '',
    VERSE_REF: entry.verse_ref || '',
    VERSE_TEXT: entry.verse_text || '',
    INSIGHT_HTML: buildDailyInsightHTML(entry),
    ONE_MINUTE_WIN: entry.one_minute_win || '',
    DECLARATION: entry.declaration || '',
    PREV_HREF: prevHref,
    NEXT_HREF: nextHref
  });
}