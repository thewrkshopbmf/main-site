import { supabase } from '../scripts/supabase/supabaseClient.js';

const state = {
  allEntries: [],
  filteredEntries: [],
  selectedIndex: -1,
  currentYear: new Date().getFullYear(),
  currentMonth: new Date().getMonth(),
  selectedDraft: null,
  originalDraft: null,
  history: [],
  historyIndex: -1
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

function normalizeTextBlocks(text) {
  return String(text || '')
    .split(/\n{2,}/)
    .map(x => x.trim())
    .filter(Boolean);
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

function getStorageKey(entry) {
  return `page-editor-draft:${entry.type}:${entry.date || 'unknown'}:${entry.slug || slugify(entry.title)}`;
}

function buildMonths() {
  return [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
}

function getMonthOptions() {
  return buildMonths()
    .map((label, idx) => `<option value="${idx}">${label}</option>`)
    .join('');
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
    isFuture: Boolean(date && date > today),
    sourceHint: 'archive',
    sourceUrl: item.json_url || ''
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
    isFuture: false,
    sourceHint: 'archive',
    sourceUrl: item.json_url || ''
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
    isFuture: false,
    sourceHint: 'archive',
    sourceUrl: item.json_url || ''
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
      if (entry) selectEntry(entry);
    });
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
        if (entry) selectEntry(entry);
      });
    });
  }

  renderCalendar();
  syncPrevNextButtons();
}

function extractSectionsFromHtml(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const title = doc.querySelector('h1')?.textContent?.trim() || 'Untitled';
  const sectionNodes = Array.from(doc.querySelectorAll('section, article section'));
  const sections = [];

  sectionNodes.forEach((node, index) => {
    const heading = node.querySelector('h2, h3, h4');
    const label = heading?.textContent?.trim() || `Section ${index + 1}`;

    const lines = [];
    node.querySelectorAll('p, li, blockquote').forEach(el => {
      const text = el.textContent?.trim();
      if (text) lines.push(text);
    });

    if (!lines.length) return;

    sections.push({
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${index}`,
      label,
      content: lines.join('\n\n')
    });
  });

  if (!sections.length) {
    const bodyLines = Array.from(doc.querySelectorAll('main p, article p'))
      .map(el => el.textContent?.trim())
      .filter(Boolean);

    if (bodyLines.length) {
      sections.push({
        id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-fallback`,
        label: 'Content',
        content: bodyLines.join('\n\n')
      });
    }
  }

  return { title, sections };
}

function buildFallbackDraftFromEntry(entry) {
  return {
    type: entry.type,
    title: entry.title,
    date: entry.date,
    href: entry.href,
    slug: entry.slug,
    sections: [
      {
        id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-summary`,
        label: entry.type === 'daily' ? 'Summary' : 'Content',
        content: [entry.verse, entry.title].filter(Boolean).join('\n\n')
      }
    ]
  };
}

async function loadEntryDraft(entry) {
  const savedDraftRaw = localStorage.getItem(getStorageKey(entry));
  if (savedDraftRaw) {
    try {
      return JSON.parse(savedDraftRaw);
    } catch {}
  }

  if (entry.href && entry.href !== '#') {
    try {
      const res = await fetch(entry.href, { cache: 'no-store' });
      if (res.ok) {
        const html = await res.text();
        const parsed = extractSectionsFromHtml(html);
        return {
          type: entry.type,
          title: parsed.title || entry.title,
          date: entry.date,
          href: entry.href,
          slug: entry.slug,
          sections: parsed.sections.length ? parsed.sections : buildFallbackDraftFromEntry(entry).sections
        };
      }
    } catch {}
  }

  return buildFallbackDraftFromEntry(entry);
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
}

async function selectEntry(entry) {
  const idx = state.filteredEntries.findIndex(item => getEntryKey(item) === getEntryKey(entry));
  if (idx >= 0) {
    state.selectedIndex = idx;
  } else {
    const allIdx = state.allEntries.findIndex(item => getEntryKey(item) === getEntryKey(entry));
    state.selectedIndex = allIdx;
    state.filteredEntries = state.allEntries.slice();
  }

  const draft = await loadEntryDraft(entry);
  state.selectedDraft = deepClone(draft);
  state.originalDraft = deepClone(draft);

  resetHistory(draft);
  renderEditor();
  syncPrevNextButtons();
}

function renderEditor() {
  const entry = getSelectedEntry() || state.allEntries.find(item => item.date === state.selectedDraft?.date && item.slug === state.selectedDraft?.slug);
  if (!state.selectedDraft || !entry) {
    els.selectedEmptyState.hidden = false;
    els.editorWorkspace.hidden = true;
    els.selectedMetaText.textContent = 'Choose a day or search result to open a page.';
    return;
  }

  els.selectedEmptyState.hidden = true;
  els.editorWorkspace.hidden = false;

  const visualType = entryVisualType(entry);
  els.selectedTypePill.textContent = typeLabel(visualType);
  els.selectedTypePill.className = `type-pill ${visualType}`;
  els.selectedTitle.textContent = state.selectedDraft.title || entry.title || 'Untitled';
  els.selectedDateLine.textContent = `${humanDate(entry.date)} · ${typeLabel(visualType)}`;
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
}

function buildExportJson() {
  if (!state.selectedDraft) return null;

  return {
    title: state.selectedDraft.title,
    date: state.selectedDraft.date,
    type: state.selectedDraft.type,
    href: state.selectedDraft.href,
    sections: state.selectedDraft.sections.map(section => ({
      label: section.label,
      paragraphs: normalizeTextBlocks(section.content)
    }))
  };
}

function saveDraftLocal() {
  const entry = getSelectedEntry();
  if (!entry || !state.selectedDraft) return;
  localStorage.setItem(getStorageKey(entry), JSON.stringify(state.selectedDraft));
  els.editorNotice.textContent = 'Draft saved locally in this browser.';
}

function revertDraft() {
  if (!state.originalDraft) return;
  state.selectedDraft = deepClone(state.originalDraft);
  resetHistory(state.selectedDraft);
  renderEditor();
  els.editorNotice.textContent = 'Changes reverted to the original loaded version.';
}

async function copyJson() {
  const json = JSON.stringify(buildExportJson(), null, 2);
  await navigator.clipboard.writeText(json);
  els.editorNotice.textContent = 'Edited JSON copied to clipboard.';
}

function downloadJson() {
  const entry = getSelectedEntry();
  const json = JSON.stringify(buildExportJson(), null, 2);
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

  selectEntry(state.filteredEntries[nextIndex]);
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
  els.revertBtn.addEventListener('click', revertDraft);
  els.saveDraftBtn.addEventListener('click', saveDraftLocal);
  els.copyJsonBtn.addEventListener('click', copyJson);
  els.downloadJsonBtn.addEventListener('click', downloadJson);
  els.prevEntryBtn.addEventListener('click', () => moveSelection(-1));
  els.nextEntryBtn.addEventListener('click', () => moveSelection(1));
}

function cacheEls() {
  [
    'pageSearchInput', 'typeFilter', 'searchResults',
    'calendarMonth', 'calendarYear', 'monthPrevBtn', 'monthNextBtn', 'calendarGrid',
    'selectedMetaText', 'selectedEmptyState', 'editorWorkspace',
    'selectedTypePill', 'selectedTitle', 'selectedDateLine', 'selectedOpenLink',
    'undoBtn', 'redoBtn', 'revertBtn', 'saveDraftBtn', 'copyJsonBtn', 'downloadJsonBtn',
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
      await selectEntry(firstDaily);
    }
  } catch (err) {
    console.error('Page editor failed to load:', err);
    els.searchResults.innerHTML = `<div class="empty-state small">The editor could not load content data.</div>`;
    els.calendarGrid.innerHTML = `<div class="empty-state small">The calendar could not be loaded.</div>`;
  }
};