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

function escapeHtml(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
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

/* ---------------------------
   DAILY FLEX SUPPORT
--------------------------- */

function cleanString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function titleCaseFromKey(key = '') {
  return String(key)
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, ch => ch.toUpperCase());
}

function normalizeStringArray(value) {
  if (Array.isArray(value)) {
    return value.map(v => cleanString(v)).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value
      .split(/\n{2,}/)
      .map(v => cleanString(v))
      .filter(Boolean);
  }
  return [];
}

function normalizeScriptures(entry = {}) {
  const scriptures = [];

  if (Array.isArray(entry.scriptures)) {
    for (const s of entry.scriptures) {
      if (!s || typeof s !== 'object') continue;
      const ref = cleanString(s.ref || s.verse_ref);
      const text = cleanString(s.text || s.verse_text);
      if (ref || text) scriptures.push({ ref, text });
    }
  }

  if (!scriptures.length) {
    const ref = cleanString(entry.verse_ref);
    const text = cleanString(entry.verse_text);
    if (ref || text) scriptures.push({ ref, text });
  }

  return scriptures;
}

function normalizeBlock(block) {
  if (typeof block === 'string') {
    const text = cleanString(block);
    return text ? { type: 'paragraph', text } : null;
  }

  if (!block || typeof block !== 'object') return null;

  const type = cleanString(block.type || 'paragraph').toLowerCase();

  if (type === 'paragraph' || type === 'callout' || type === 'quote') {
    const text = cleanString(block.text);
    if (!text) return null;
    const prefix = cleanString(block.prefix);
    return prefix ? { type, text, prefix } : { type, text };
  }

  if (type === 'lines' || type === 'bullet_list' || type === 'numbered_list') {
    const items = normalizeStringArray(block.items || block.text || block.content);
    if (!items.length) return null;
    return { type, items };
  }

  return null;
}

function normalizeSection(section) {
  if (!section || typeof section !== 'object') return null;

  const key = cleanString(section.key || '').toLowerCase();
  const label = cleanString(section.label) || titleCaseFromKey(key || 'section');

  let blocksSource = Array.isArray(section.blocks) ? section.blocks : null;

  if (!blocksSource) {
    if (section.items) {
      const style = cleanString(section.style || 'bullet_list').toLowerCase();
      const blockType = style === 'numbered_list' ? 'numbered_list' : 'bullet_list';
      blocksSource = [{ type: blockType, items: section.items }];
    } else if (section.content) {
      if (Array.isArray(section.content)) {
        blocksSource = section.content.map(text => ({ type: 'paragraph', text }));
      } else {
        blocksSource = [{ type: cleanString(section.style || 'paragraph'), text: section.content }];
      }
    } else if (section.text) {
      blocksSource = [{ type: cleanString(section.style || 'paragraph'), text: section.text }];
    } else {
      blocksSource = [];
    }
  }

  const blocks = blocksSource.map(normalizeBlock).filter(Boolean);
  if (!blocks.length) return null;

  return { key, label, blocks };
}

function legacySectionsFromEntry(entry = {}) {
  const sections = [];

  if (entry.read_this_out_loud || entry.readAloud) {
    sections.push({
      key: 'read_this_out_loud',
      label: 'Read This Out Loud',
      blocks: normalizeStringArray(entry.read_this_out_loud || entry.readAloud)
        .map(text => ({ type: 'paragraph', text }))
    });
  }

  const insightParts = normalizeStringArray(entry.insight || entry.body);
  if (insightParts.length) {
    sections.push({
      key: 'insight',
      label: 'Insight',
      blocks: insightParts.map(text => ({ type: 'paragraph', text }))
    });
  }

  if (entry.shift) {
    sections.push({
      key: 'shift',
      label: 'The Shift',
      blocks: normalizeStringArray(entry.shift).map(text => ({ type: 'paragraph', text }))
    });
  }

  if (entry.jesus_set_the_pattern) {
    sections.push({
      key: 'jesus_set_the_pattern',
      label: 'Jesus Set the Pattern',
      blocks: normalizeStringArray(entry.jesus_set_the_pattern).map(text => ({ type: 'paragraph', text }))
    });
  }

  if (entry.truth) {
    sections.push({
      key: 'truth',
      label: 'The Truth',
      blocks: normalizeStringArray(entry.truth).map(text => ({ type: 'paragraph', text }))
    });
  }

  if (entry.reflection) {
    sections.push({
      key: 'reflection',
      label: 'Reflection',
      blocks: [{ type: 'bullet_list', items: normalizeStringArray(entry.reflection) }]
    });
  }

  if (entry.one_minute_win || entry.action_step || entry['one-minute_win']) {
    sections.push({
      key: 'action_step',
      label: 'Action Step',
      blocks: normalizeStringArray(entry.one_minute_win || entry.action_step || entry['one-minute_win'])
        .map(text => ({ type: 'paragraph', text }))
    });
  }

  if (entry.declaration) {
    sections.push({
      key: 'declaration',
      label: 'Declaration',
      blocks: normalizeStringArray(entry.declaration).map(text => ({ type: 'paragraph', text }))
    });
  }

  return sections.filter(Boolean);
}

export function normalizeDailyEntry(entry = {}) {
  const scriptures = normalizeScriptures(entry);

  let sections = [];
  if (Array.isArray(entry.sections) && entry.sections.length) {
    sections = entry.sections.map(normalizeSection).filter(Boolean);
  } else {
    sections = legacySectionsFromEntry(entry);
  }

  return {
    ...entry,
    scriptures,
    verse_ref: cleanString(entry.verse_ref || scriptures[0]?.ref || ''),
    verse_text: cleanString(entry.verse_text || scriptures[0]?.text || ''),
    sections
  };
}

function renderDailyBlock(block) {
  if (!block) return '';

  if (block.type === 'paragraph') {
    return `<p>${escapeHtml(block.text)}</p>`;
  }

  if (block.type === 'callout') {
    const prefix = escapeHtml(block.prefix || '👉');
    return `<p class="daily-callout"><span class="daily-callout-prefix">${prefix}</span> ${escapeHtml(block.text)}</p>`;
  }

  if (block.type === 'quote') {
    return `<blockquote>${escapeHtml(block.text)}</blockquote>`;
  }

  if (block.type === 'lines') {
    return block.items.map(item => `<p>${escapeHtml(item)}</p>`).join('\n');
  }

  if (block.type === 'bullet_list') {
    return `<ul>${block.items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
  }

  if (block.type === 'numbered_list') {
    return `<ol>${block.items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ol>`;
  }

  return '';
}

function renderDailySection(section) {
  if (!section) return '';
  const blocks = (section.blocks || []).map(renderDailyBlock).join('\n');
  return `
    <section class="daily-section daily-section-${escapeHtml(section.key || 'section')}">
      <h3>${escapeHtml(section.label || 'Section')}</h3>
      ${blocks}
    </section>
  `;
}

function sectionPlainText(section) {
  if (!section?.blocks) return '';
  return section.blocks.map(block => {
    if (block.type === 'paragraph' || block.type === 'callout' || block.type === 'quote') {
      return cleanString(block.text);
    }
    if (block.type === 'lines' || block.type === 'bullet_list' || block.type === 'numbered_list') {
      return normalizeStringArray(block.items).join(' ');
    }
    return '';
  }).filter(Boolean).join('\n');
}

function findDailySection(entry, keys = []) {
  const wanted = new Set(keys.map(k => String(k).toLowerCase()));
  return (entry.sections || []).find(section => wanted.has((section.key || '').toLowerCase())) || null;
}

export function buildDailyInsightHTML(entry) {
  const e = normalizeDailyEntry(entry);

  if (e.sections.length) {
    const hiddenKeys = new Set(['action_step', 'one_minute_win', 'declaration']);
    return e.sections
      .filter(section => !hiddenKeys.has((section.key || '').toLowerCase()))
      .map(renderDailySection)
      .join('\n');
  }

  return normalizeInsight(e.insight)
    .map(p => `<p>${escapeHtml(p)}</p>`)
    .join('\n');
}

export function buildDailyActionText(entry) {
  const e = normalizeDailyEntry(entry);
  const sec = findDailySection(e, ['action_step', 'one_minute_win']);
  return sec ? sectionPlainText(sec) : cleanString(e.one_minute_win || e.action_step || '');
}

export function buildDailyDeclarationText(entry) {
  const e = normalizeDailyEntry(entry);
  const sec = findDailySection(e, ['declaration']);
  return sec ? sectionPlainText(sec) : cleanString(e.declaration || '');
}

export function buildDailyVerseRefHTML(entry) {
  const e = normalizeDailyEntry(entry);
  if (!e.scriptures.length) return escapeHtml(e.verse_ref || '');

  return e.scriptures
    .map(s => escapeHtml(s.ref || ''))
    .filter(Boolean)
    .join('<br>');
}

export function buildDailyVerseTextHTML(entry) {
  const e = normalizeDailyEntry(entry);
  if (!e.scriptures.length) return escapeHtml(e.verse_text || '');

  return e.scriptures
    .map(s => {
      const ref = cleanString(s.ref);
      const text = cleanString(s.text);
      if (ref && text) return `<strong>${escapeHtml(ref)}</strong><br>${escapeHtml(text)}`;
      if (ref) return `<strong>${escapeHtml(ref)}</strong>`;
      return escapeHtml(text);
    })
    .filter(Boolean)
    .join('<br><br>');
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
  const e = normalizeDailyEntry(entry);

  return fill(template, {
    TITLE: e.title || 'Untitled',
    HUMAN_DATE: e.date ? toHuman(e.date) : '',
    DATE: e.date || '',
    VERSE_REF: buildDailyVerseRefHTML(e),
    VERSE_TEXT: buildDailyVerseTextHTML(e),
    INSIGHT_HTML: buildDailyInsightHTML(e),
    ONE_MINUTE_WIN: buildDailyActionText(e),
    DECLARATION: buildDailyDeclarationText(e),
    PREV_HREF: prevHref,
    NEXT_HREF: nextHref
  });
}