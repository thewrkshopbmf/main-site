import { supabase } from '../scripts/supabase/supabaseClient.js';

const state = {
  allEntries: [],
  filteredEntries: [],
  selectedIndex: -1,
  currentYear: new Date().getFullYear(),
  currentMonth: new Date().getMonth(),
  selectedDraft: null,
  originalDraft: null,
  selectedSourcePath: '',
  selectedRawSource: null,
  history: [],
  historyIndex: -1,
  isPublishing: false
};

const els = {};

function $(id) {
  return document.getElementById(id);
}

function todayCentralISO() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Chicago',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date());
}

function humanDate(dateStr) {
  if (!dateStr) return 'Unknown date';
  const dt = new Date(dateStr + 'T00:00:00');
  return dt.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
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

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function entryVisualType(entry) {
  if (entry.type === 'daily' && entry.isFuture) return 'daily-future';
  return entry.type;
}

function typeLabel(type) {
  if (type === 'daily-future') return 'Pending Daily';
  if (type === 'daily') return 'Daily';
  if (type === 'blog') return 'Blog';
  if (type === 'podcast') return 'Podcast';
  return 'Page';
}

function getMonthOptions() {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return months.map((label, idx) => `<option value="${idx}">${label}</option>`).join('');
}

function getYearRange(entries) {
  const years = new Set(entries.map(e => Number((e.date || '').slice(0, 4))).filter(Boolean));
  const current = new Date().getFullYear();
  years.add(current);
  years.add(current + 1);
  years.add(current - 1);
  return Array.from(years).sort((a, b) => a - b);
}

function extractDateFromHref(href = '') {
  const match = href.match(/(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : '';
}

function normalizeDailyArchiveItem(item) {
  const date = item.date || extractDateFromHref(item.href || '');
  const today = todayCentralISO();
  return {
    type: 'daily',
    title: item.title || 'Untitled Daily',
    date,
    href: item.href || '#',
    verse: item.verse_ref || '',
    slug: slugify(item.title || item.href || date),
    isFuture: Boolean(date && date > today)
  };
}

function normalizeBlogArchiveItem(item) {
  return {
    type: 'blog',
    title: item.title || 'Untitled Blog',
    date: item.date || extractDateFromHref(item.href || ''),
    href: item.href || '#',
    verse: item.category || '',
    slug: slugify(item.title || item.href || item.date),
    isFuture: false
  };
}

function normalizePodcastArchiveItem(item) {
  return {
    type: 'podcast',
    title: item.title || 'Untitled Podcast',
    date: item.date || extractDateFromHref(item.page_url || item.href || ''),
    href: item.page_url || item.href || '#',
    verse: item.duration || item.subtitle || '',
    slug: slugify(item.title || item.page_url || item.date),
    isFuture: false
  };
}

async function fetchJson(url) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to load ${url}`);
  return res.json();
}

async function maybeFetchJson(url) {
  try {
    return await fetchJson(url);
  } catch {
    return null;
  }
}

async function loadAllEntries() {
  const dailyArchive = await maybeFetchJson('/data/daily-archive.json');
  const blogArchive = await maybeFetchJson('/data/blog-archive.json');
  const podcastArchive =
    await maybeFetchJson('/data/podcast-archive.json') ||
    await maybeFetchJson('/data/podcasts-archive.json') ||
    await maybeFetchJson('/data/podcasts.json') ||
    await maybeFetchJson('/data/podcast.json');

  const dailyItems = Array.isArray(dailyArchive) ? dailyArchive.map(normalizeDailyArchiveItem) : [];
  const blogItems = Array.isArray(blogArchive) ? blogArchive.map(normalizeBlogArchiveItem) : [];
  let podcastItems = [];

  if (Array.isArray(podcastArchive)) {
    podcastItems = podcastArchive.map(normalizePodcastArchiveItem);
  } else if (podcastArchive && typeof podcastArchive === 'object' && podcastArchive.title) {
    podcastItems = [normalizePodcastArchiveItem(podcastArchive)];
  }

  state.allEntries = [...dailyItems, ...blogItems, ...podcastItems]
    .filter(item => item.date)
    .sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title));

  state.filteredEntries = state.allEntries.slice();
}

function renderYearMonthSelectors() {
  els.calendarMonth.innerHTML = getMonthOptions();
  els.calendarMonth.value = String(state.currentMonth);

  const years = getYearRange(state.allEntries);
  els.calendarYear.innerHTML = years
    .map(year => `<option value="${year}">${year}</option>`)
    .join('');
  els.calendarYear.value = String(state.currentYear);
}

function getItemsForDate(dateStr) {
  return state.filteredEntries
    .filter(entry => entry.date === dateStr)
    .sort((a, b) => {
      const order = { 'daily-future': 0, daily: 1, blog: 2, podcast: 3 };
      return (order[entryVisualType(a)] || 99) - (order[entryVisualType(b)] || 99);
    });
}

function getEntryKey(entry) {
  return `${entry.type}|${entry.date}|${entry.slug}`;
}

function findEntryByKey(key) {
  return state.filteredEntries.find(entry => getEntryKey(entry) === key)
    || state.allEntries.find(entry => getEntryKey(entry) === key)
    || null;
}

function renderCalendar() {
  const year = state.currentYear;
  const month = state.currentMonth;
  const first = new Date(year, month, 1);
  const firstWeekday = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  const today = todayCentralISO();

  let html = '';

  for (let i = 0; i < 42; i++) {
    let cellDay;
    let cellMonth = month;
    let cellYear = year;
    let otherMonth = false;

    if (i < firstWeekday) {
      cellDay = prevMonthDays - firstWeekday + i + 1;
      cellMonth = month - 1;
      if (cellMonth < 0) {
        cellMonth = 11;
        cellYear -= 1;
      }
      otherMonth = true;
    } else if (i >= firstWeekday + daysInMonth) {
      cellDay = i - (firstWeekday + daysInMonth) + 1;
      cellMonth = month + 1;
      if (cellMonth > 11) {
        cellMonth = 0;
        cellYear += 1;
      }
      otherMonth = true;
    } else {
      cellDay = i - firstWeekday + 1;
    }

    const iso = `${cellYear}-${String(cellMonth + 1).padStart(2, '0')}-${String(cellDay).padStart(2, '0')}`;
    const items = getItemsForDate(iso);
    const isToday = iso === today;

    html += `
      <div class="calendar-day ${otherMonth ? 'is-other-month' : ''} ${isToday ? 'is-today' : ''}" data-date="${iso}">
        <div class="day-number">${cellDay}</div>
        <div class="day-badges">
          ${items.map(item => `
            <button
              type="button"
              class="day-badge ${entryVisualType(item)}"
              data-entry-key="${escapeHtml(getEntryKey(item))}"
              title="${escapeHtml(typeLabel(entryVisualType(item)))} — ${escapeHtml(item.title)}"
            >
              ${escapeHtml(typeLabel(entryVisualType(item)))}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  els.calendarGrid.innerHTML = html;

  els.calendarGrid.querySelectorAll('.day-badge').forEach(btn => {
    btn.addEventListener('click', () => {
      const entry = findEntryByKey(btn.dataset.entryKey);
      if (entry) {
        selectEntry(entry).catch(err => {
          console.error('Select entry failed:', err);
          els.editorNotice.textContent = `Could not open source for this entry: ${err.message}`;
        });
      }
    });
  });
}

function renderSearchResults() {
  const q = els.pageSearchInput.value.trim().toLowerCase();
  const typeFilter = els.typeFilter.value;

  const results = state.allEntries.filter(entry => {
    if (typeFilter !== 'all' && entry.type !== typeFilter) return false;

    if (!q) return true;

    const haystack = [
      entry.title,
      entry.date,
      entry.type,
      entry.verse,
      typeLabel(entryVisualType(entry))
    ].join(' ').toLowerCase();

    return haystack.includes(q);
  });

  state.filteredEntries = results
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title));

  const limited = results
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 24);

  if (!limited.length) {
    els.searchResults.innerHTML = `<div class="empty-state small">No matching pages found.</div>`;
  } else {
    els.searchResults.innerHTML = limited.map(item => `
      <div class="search-result-item">
        <div class="search-result-main">
          <h4>${escapeHtml(item.title)}</h4>
          <p>${escapeHtml(humanDate(item.date))} · ${escapeHtml(typeLabel(entryVisualType(item)))}${item.verse ? ` · ${escapeHtml(item.verse)}` : ''}</p>
        </div>
        <div class="search-result-action">
          <button type="button" class="editor-btn secondary open-search-result" data-entry-key="${escapeHtml(getEntryKey(item))}">
            Open
          </button>
        </div>
      </div>
    `).join('');

    els.searchResults.querySelectorAll('.open-search-result').forEach(btn => {
      btn.addEventListener('click', () => {
        const entry = findEntryByKey(btn.dataset.entryKey);
        if (entry) {
          selectEntry(entry).catch(err => {
            console.error('Select entry failed:', err);
            els.editorNotice.textContent = `Could not open source for this entry: ${err.message}`;
          });
        }
      });
    });
  }

  renderCalendar();
  syncPrevNextButtons();
}

function normalizeStringArray(value) {
  if (Array.isArray(value)) {
    return value.map(v => String(v || '').trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value.split(/\n{2,}/).map(v => v.trim()).filter(Boolean);
  }
  return [];
}

function blocksToParagraphs(blocks = []) {
  const out = [];

  blocks.forEach(block => {
    if (!block || typeof block !== 'object') return;

    if (block.type === 'paragraph' || block.type === 'quote' || block.type === 'callout') {
      if (block.text) out.push(String(block.text).trim());
      return;
    }

    if (block.type === 'lines' || block.type === 'bullet_list' || block.type === 'numbered_list') {
      const items = normalizeStringArray(block.items);
      if (items.length) out.push(items.join('\n'));
    }
  });

  return out.filter(Boolean);
}

function draftFromGenericText(entry, label, text) {
  return {
    type: entry.type,
    title: entry.title || 'Untitled',
    date: entry.date,
    href: entry.href,
    slug: entry.slug,
    sections: [
      {
        id: `section-fallback-${Date.now()}`,
        label,
        content: String(text || '').trim()
      }
    ]
  };
}

function dailySourceToDraft(source, entry) {
  let sections = [];

  if (Array.isArray(source.sections) && source.sections.length) {
    sections = source.sections.map((section, index) => ({
      id: `section-${index}-${Date.now()}`,
      label: section.label || section.key || `Section ${index + 1}`,
      content: blocksToParagraphs(section.blocks || []).join('\n\n')
    })).filter(section => section.content.trim());
  } else {
    const legacyOrder = [
      ['read_this_out_loud', 'Read This Out Loud'],
      ['insight', 'Insight'],
      ['body', 'Body'],
      ['shift', 'The Shift'],
      ['jesus_set_the_pattern', 'Jesus Set the Pattern'],
      ['truth', 'The Truth'],
      ['reflection', 'Reflection'],
      ['one_minute_win', 'Action Step'],
      ['action_step', 'Action Step'],
      ['declaration', 'Declaration']
    ];

    sections = legacyOrder
      .map(([key, label], index) => {
        const value = source[key];
        const parts = normalizeStringArray(value);
        if (!parts.length) return null;
        return {
          id: `section-${index}-${Date.now()}`,
          label,
          content: parts.join('\n\n')
        };
      })
      .filter(Boolean);
  }

  if (!sections.length) {
    const fallbackText = [
      source.verse_ref ? `${source.verse_ref}` : '',
      source.verse_text ? `${source.verse_text}` : '',
      source.title ? `${source.title}` : ''
    ].filter(Boolean).join('\n\n');

    return draftFromGenericText(entry, 'Insight', fallbackText);
  }

  return {
    type: 'daily',
    title: source.title || entry.title || 'Untitled Daily',
    date: source.date || entry.date,
    href: entry.href,
    slug: entry.slug,
    sections
  };
}

function htmlToDraftSections(html = '') {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const sections = [];
  const topSections = Array.from(doc.body.children).filter(Boolean);

  topSections.forEach((node, index) => {
    const heading = node.querySelector?.('h1, h2, h3, h4');
    const label = heading?.textContent?.trim() || `Section ${index + 1}`;

    const lines = [];
    node.querySelectorAll?.('p, li, blockquote').forEach(el => {
      const text = el.textContent?.trim();
      if (text) lines.push(text);
    });

    if (lines.length) {
      sections.push({
        id: `section-${index}-${Date.now()}`,
        label,
        content: lines.join('\n\n')
      });
    }
  });

  if (!sections.length) {
    const lines = Array.from(doc.querySelectorAll('p, li, blockquote'))
      .map(el => el.textContent?.trim())
      .filter(Boolean);

    if (lines.length) {
      sections.push({
        id: `section-fallback-${Date.now()}`,
        label: 'Content',
        content: lines.join('\n\n')
      });
    }
  }

  return sections;
}

function genericSourceToDraft(source, entry) {
  const html = source.body_html || source.show_notes_html || source.content_html || '';
  const sections = htmlToDraftSections(html);

  if (!sections.length) {
    const fallbackText = [
      source.title || entry.title || '',
      source.excerpt || '',
      source.description || '',
      source.summary || ''
    ].filter(Boolean).join('\n\n');

    return draftFromGenericText(entry, 'Content', fallbackText);
  }

  return {
    type: entry.type,
    title: source.title || entry.title || 'Untitled',
    date: source.date || entry.date,
    href: entry.href,
    slug: entry.slug,
    sections
  };
}

function sourceToDraft(source, entry) {
  if (entry.type === 'daily') {
    return dailySourceToDraft(source, entry);
  }
  return genericSourceToDraft(source, entry);
}

function draftToExportJson() {
  if (!state.selectedDraft) return null;

  return {
    title: state.selectedDraft.title,
    date: state.selectedDraft.date,
    type: state.selectedDraft.type,
    sections: state.selectedDraft.sections.map(section => ({
      label: section.label,
      paragraphs: section.content
        .split(/\n{2,}/)
        .map(x => x.trim())
        .filter(Boolean)
    }))
  };
}

async function getAccessToken() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  const token = data?.session?.access_token;
  if (!token) throw new Error('No active session');
  return token;
}

async function tryFetchLivePageDraft(entry) {
  if (!entry.href || entry.href === '#') {
    return draftFromGenericText(entry, entry.type === 'daily' ? 'Insight' : 'Content', entry.verse || entry.title || '');
  }

  const res = await fetch(entry.href, { cache: 'no-store' });
  if (!res.ok) {
    return draftFromGenericText(entry, entry.type === 'daily' ? 'Insight' : 'Content', entry.verse || entry.title || '');
  }

  const html = await res.text();
  const sections = htmlToDraftSections(html);

  if (!sections.length) {
    return draftFromGenericText(entry, entry.type === 'daily' ? 'Insight' : 'Content', entry.verse || entry.title || '');
  }

  return {
    type: entry.type,
    title: entry.title || 'Untitled',
    date: entry.date,
    href: entry.href,
    slug: entry.slug,
    sections
  };
}

async function apiLoadSource(entry) {
  const token = await getAccessToken();
  const url = `/.netlify/functions/page-editor-content?type=${encodeURIComponent(entry.type)}&date=${encodeURIComponent(entry.date)}&slug=${encodeURIComponent(entry.slug)}&title=${encodeURIComponent(entry.title || '')}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(payload?.error || 'Failed to load source');
  }

  return payload;
}

async function apiPublish(entry, draft) {
  const token = await getAccessToken();

  const res = await fetch('/.netlify/functions/page-editor-content', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      type: entry.type,
      date: entry.date,
      slug: entry.slug,
      title: entry.title || '',
      edited_title: draft.title || '',
      sections: draft.sections.map(section => ({
        label: section.label,
        content: section.content
      }))
    })
  });

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(payload?.error || 'Publish failed');
  }

  return payload;
}

function resetHistory(draft) {
  state.history = [deepClone(draft)];
  state.historyIndex = 0;
  syncUndoRedoButtons();
}

function pushHistorySnapshot() {
  const snapshot = deepClone(state.selectedDraft);
  state.history = state.history.slice(0, state.historyIndex + 1);
  state.history.push(snapshot);
  state.historyIndex = state.history.length - 1;
  syncUndoRedoButtons();
}

function syncUndoRedoButtons() {
  els.undoBtn.disabled = state.historyIndex <= 0;
  els.redoBtn.disabled = state.historyIndex >= state.history.length - 1;
}

function undoEdit() {
  if (state.historyIndex <= 0) return;
  state.historyIndex -= 1;
  state.selectedDraft = deepClone(state.history[state.historyIndex]);
  renderEditor();
  syncUndoRedoButtons();
}

function redoEdit() {
  if (state.historyIndex >= state.history.length - 1) return;
  state.historyIndex += 1;
  state.selectedDraft = deepClone(state.history[state.historyIndex]);
  renderEditor();
  syncUndoRedoButtons();
}

function getSelectedEntry() {
  if (state.selectedIndex < 0) return null;
  return state.filteredEntries[state.selectedIndex] || null;
}

function syncPrevNextButtons() {
  const hasPrev = state.selectedIndex > 0;
  const hasNext = state.selectedIndex >= 0 && state.selectedIndex < state.filteredEntries.length - 1;
  els.prevEntryBtn.disabled = !hasPrev;
  els.nextEntryBtn.disabled = !hasNext;
  els.publishBtn.disabled = !state.selectedDraft || state.isPublishing;
}

async function selectEntry(entry) {
  const idx = state.filteredEntries.findIndex(item => getEntryKey(item) === getEntryKey(entry));
  if (idx >= 0) {
    state.selectedIndex = idx;
  } else {
    state.filteredEntries = state.allEntries.slice();
    state.selectedIndex = state.filteredEntries.findIndex(item => getEntryKey(item) === getEntryKey(entry));
  }

  els.selectedEmptyState.hidden = true;
  els.editorWorkspace.hidden = false;
  els.editorNotice.textContent = 'Loading source file...';

  let draft;
  let sourcePath = '';
  let sourceJson = null;
  let usedFallback = false;

  try {
    const payload = await apiLoadSource(entry);
    sourceJson = payload?.source_json || {};
    sourcePath = payload?.file_path || '(unknown path)';
    draft = sourceToDraft(sourceJson, entry);
  } catch (err) {
    console.warn('Source function load failed, falling back to live page parse:', err);
    usedFallback = true;
    sourcePath = '(live page fallback)';
    sourceJson = null;
    draft = await tryFetchLivePageDraft(entry);
  }

  state.selectedDraft = deepClone(draft);
  state.originalDraft = deepClone(draft);
  state.selectedSourcePath = sourcePath;
  state.selectedRawSource = sourceJson;

  resetHistory(draft);
  renderEditor();
  syncPrevNextButtons();

  els.editorNotice.textContent = usedFallback
    ? 'Loaded from the live page because source JSON could not be fetched yet. Viewing/editing still works, but publish may fail until the source resolver is configured.'
    : 'Source loaded. Make your edits, then publish.';
}

function renderEditor() {
  const entry = getSelectedEntry() || state.allEntries.find(item => item.date === state.selectedDraft?.date && item.slug === state.selectedDraft?.slug);
  if (!state.selectedDraft || !entry) {
    els.selectedEmptyState.hidden = false;
    els.editorWorkspace.hidden = true;
    els.selectedMetaText.textContent = 'Choose a day or search result to open a page.';
    syncPrevNextButtons();
    return;
  }

  els.selectedEmptyState.hidden = true;
  els.editorWorkspace.hidden = false;

  const visualType = entryVisualType(entry);
  els.selectedTypePill.textContent = typeLabel(visualType);
  els.selectedTypePill.className = `type-pill ${visualType}`;
  els.selectedTitle.textContent = state.selectedDraft.title || entry.title || 'Untitled';
  els.selectedDateLine.textContent = `${humanDate(entry.date)} · ${typeLabel(visualType)}`;
  els.selectedSourcePath.textContent = state.selectedSourcePath ? `Source: ${state.selectedSourcePath}` : 'Source path unavailable';
  els.selectedOpenLink.href = entry.href || '#';
  els.selectedMetaText.textContent = `Editing ${typeLabel(visualType)} from ${humanDate(entry.date)}.`;

  els.pageTitleInput.value = state.selectedDraft.title || '';
  els.pageDateInput.value = entry.date || '';

  els.sectionEditorList.innerHTML = '';

  state.selectedDraft.sections.forEach((section, index) => {
    const card = document.createElement('div');
    card.className = 'section-card';
    card.innerHTML = `
      <div class="section-card-head">
        <div style="flex:1 1 320px;">
          <label for="sectionTitle_${index}" style="display:block; margin-bottom:.4rem; color:#3e2c23; font-weight:700;">Section Title</label>
          <input type="text" id="sectionTitle_${index}" class="editor-input section-title-input" value="${escapeHtml(section.label || '')}" data-index="${index}">
        </div>

        <div class="section-card-actions">
          <button type="button" class="editor-btn secondary delete-section-btn" data-index="${index}">Delete Section</button>
        </div>
      </div>

      <div>
        <label for="sectionText_${index}" style="display:block; margin-bottom:.4rem; color:#3e2c23; font-weight:700;">Section Content</label>
        <textarea id="sectionText_${index}" class="editor-textarea section-content-input" data-index="${index}">${escapeHtml(section.content || '')}</textarea>
        <div class="section-helper">Separate paragraphs with a blank line. Keep edits simple and clear.</div>
      </div>
    `;
    els.sectionEditorList.appendChild(card);
  });

  els.pageTitleInput.oninput = (e) => {
    state.selectedDraft.title = e.target.value;
    pushHistorySnapshot();
    renderEditor();
  };

  els.sectionEditorList.querySelectorAll('.section-title-input').forEach(input => {
    input.addEventListener('input', (e) => {
      const index = Number(e.target.dataset.index);
      state.selectedDraft.sections[index].label = e.target.value;
      pushHistorySnapshot();
      renderEditor();
    });
  });

  els.sectionEditorList.querySelectorAll('.section-content-input').forEach(textarea => {
    textarea.addEventListener('input', (e) => {
      const index = Number(e.target.dataset.index);
      state.selectedDraft.sections[index].content = e.target.value;
      pushHistorySnapshot();
      renderEditor();
    });
  });

  els.sectionEditorList.querySelectorAll('.delete-section-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = Number(btn.dataset.index);
      state.selectedDraft.sections.splice(index, 1);
      pushHistorySnapshot();
      renderEditor();
    });
  });

  syncPrevNextButtons();
}

async function reloadSource() {
  const entry = getSelectedEntry();
  if (!entry) return;
  await selectEntry(entry);
}

async function publishChanges() {
  const entry = getSelectedEntry();
  if (!entry || !state.selectedDraft) return;

  try {
    state.isPublishing = true;
    syncPrevNextButtons();
    els.editorNotice.textContent = 'Publishing changes to GitHub...';

    const result = await apiPublish(entry, state.selectedDraft);

    if (state.selectedDraft.title && entry.title !== state.selectedDraft.title) {
      entry.title = state.selectedDraft.title;
      entry.slug = slugify(state.selectedDraft.title);
    }

    state.originalDraft = deepClone(state.selectedDraft);
    state.selectedSourcePath = result?.file_path || state.selectedSourcePath;
    state.selectedRawSource = result?.updated_json || state.selectedRawSource;

    resetHistory(state.selectedDraft);
    renderSearchResults();
    renderEditor();

    els.editorNotice.textContent = `Published successfully. Commit: ${result?.commit_sha || 'created'}`;
  } catch (err) {
    console.error(err);
    els.editorNotice.textContent = `Publish failed: ${err.message}`;
  } finally {
    state.isPublishing = false;
    syncPrevNextButtons();
  }
}

async function copyJson() {
  const json = JSON.stringify(draftToExportJson(), null, 2);
  await navigator.clipboard.writeText(json);
  els.editorNotice.textContent = 'Edited JSON copied to clipboard.';
}

function downloadJson() {
  const entry = getSelectedEntry();
  const json = JSON.stringify(draftToExportJson(), null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const base = entry ? `${entry.type}_${entry.date}_${entry.slug}` : 'page-editor-export';
  a.href = url;
  a.download = `${base}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  els.editorNotice.textContent = 'Edited JSON downloaded.';
}

function moveSelection(direction) {
  if (state.selectedIndex < 0) return;

  const nextIndex = state.selectedIndex + direction;
  if (nextIndex < 0 || nextIndex >= state.filteredEntries.length) return;

  selectEntry(state.filteredEntries[nextIndex]).catch(err => {
    console.error('Move selection failed:', err);
    els.editorNotice.textContent = `Could not open source for this entry: ${err.message}`;
  });
}

function bindControls() {
  els.pageSearchInput.addEventListener('input', renderSearchResults);
  els.typeFilter.addEventListener('change', renderSearchResults);

  els.calendarMonth.addEventListener('change', () => {
    state.currentMonth = Number(els.calendarMonth.value);
    renderCalendar();
  });

  els.calendarYear.addEventListener('change', () => {
    state.currentYear = Number(els.calendarYear.value);
    renderCalendar();
  });

  els.monthPrevBtn.addEventListener('click', () => {
    state.currentMonth -= 1;
    if (state.currentMonth < 0) {
      state.currentMonth = 11;
      state.currentYear -= 1;
    }
    renderYearMonthSelectors();
    renderCalendar();
  });

  els.monthNextBtn.addEventListener('click', () => {
    state.currentMonth += 1;
    if (state.currentMonth > 11) {
      state.currentMonth = 0;
      state.currentYear += 1;
    }
    renderYearMonthSelectors();
    renderCalendar();
  });

  els.undoBtn.addEventListener('click', undoEdit);
  els.redoBtn.addEventListener('click', redoEdit);
  els.revertBtn.addEventListener('click', () => {
    reloadSource().catch(err => {
      console.error('Reload source failed:', err);
      els.editorNotice.textContent = `Could not reload source: ${err.message}`;
    });
  });
  els.copyJsonBtn.addEventListener('click', copyJson);
  els.downloadJsonBtn.addEventListener('click', downloadJson);
  els.publishBtn.addEventListener('click', publishChanges);
  els.prevEntryBtn.addEventListener('click', () => moveSelection(-1));
  els.nextEntryBtn.addEventListener('click', () => moveSelection(1));
}

function cacheEls() {
  [
    'pageSearchInput', 'typeFilter', 'searchResults',
    'calendarMonth', 'calendarYear', 'monthPrevBtn', 'monthNextBtn', 'calendarGrid',
    'selectedMetaText', 'selectedEmptyState', 'editorWorkspace',
    'selectedTypePill', 'selectedTitle', 'selectedDateLine', 'selectedSourcePath', 'selectedOpenLink',
    'undoBtn', 'redoBtn', 'revertBtn', 'copyJsonBtn', 'downloadJsonBtn', 'publishBtn',
    'pageTitleInput', 'pageDateInput', 'sectionEditorList', 'editorNotice',
    'prevEntryBtn', 'nextEntryBtn'
  ].forEach(id => {
    els[id] = $(id);
  });
}

window.pageEditorInit = async function pageEditorInit() {
  cacheEls();
  bindControls();

  try {
    await loadAllEntries();
  } catch (err) {
    console.error('Archive load failed:', err);
    els.searchResults.innerHTML = `<div class="empty-state small">The editor could not load published archive data.</div>`;
    els.calendarGrid.innerHTML = `<div class="empty-state small">The calendar could not be loaded.</div>`;
    return;
  }

  if (!state.allEntries.length) {
    els.searchResults.innerHTML = `<div class="empty-state small">No published content data was found.</div>`;
    els.calendarGrid.innerHTML = `<div class="empty-state small">No calendar items available.</div>`;
    return;
  }

  const newest = state.allEntries[state.allEntries.length - 1];
  if (newest?.date) {
    const dt = new Date(newest.date + 'T00:00:00');
    state.currentYear = dt.getFullYear();
    state.currentMonth = dt.getMonth();
  }

  renderYearMonthSelectors();
  renderSearchResults();

  const firstDaily = state.allEntries
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .find(entry => entry.type === 'daily') || state.allEntries[state.allEntries.length - 1];

  if (firstDaily) {
    try {
      await selectEntry(firstDaily);
    } catch (err) {
      console.error('Initial entry load failed:', err);
      els.editorNotice.textContent = `Archive data loaded, but the first source file could not be opened: ${err.message}`;
      els.selectedEmptyState.hidden = false;
      els.editorWorkspace.hidden = true;
      els.selectedMetaText.textContent = 'Choose a page from the calendar or search results.';
    }
  }
};