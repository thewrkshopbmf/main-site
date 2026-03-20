import { supabase } from '../scripts/supabase/supabaseClient.js';

const showSingleContactBtn = document.getElementById('showSingleContactBtn');
const showBulkImportBtn = document.getElementById('showBulkImportBtn');
const singleContactPanel = document.getElementById('singleContactPanel');
const bulkImportPanel = document.getElementById('bulkImportPanel');

const singleContactForm = document.getElementById('singleContactForm');
const singleContactMessage = document.getElementById('singleContactMessage');
const saveSingleContactBtn = document.getElementById('saveSingleContactBtn');

const bulkCsvFile = document.getElementById('bulkCsvFile');
const bulkCsvText = document.getElementById('bulkCsvText');
const previewBulkImportBtn = document.getElementById('previewBulkImportBtn');
const runBulkImportBtn = document.getElementById('runBulkImportBtn');
const bulkImportMessage = document.getElementById('bulkImportMessage');
const bulkPreview = document.getElementById('bulkPreview');

const recentContactsMessage = document.getElementById('recentContactsMessage');
const recentContactsList = document.getElementById('recentContactsList');
const recentContactsActions = document.getElementById('recentContactsActions');
const toggleRecentContactsBtn = document.getElementById('toggleRecentContactsBtn');
const refreshRecentContactsBtn = document.getElementById('refreshRecentContactsBtn');
const contactsCountValue = document.getElementById('contactsCountValue');

let parsedBulkRows = [];
let recentContacts = [];
let showingAllRecentContacts = false;

const INITIAL_RECENT_CONTACTS_COUNT = 6;
const MAX_RECENT_CONTACTS = 30;

function togglePanel(panelToShow) {
  [singleContactPanel, bulkImportPanel].forEach(panel => {
    if (panel) {
      panel.hidden = panel !== panelToShow;
    }
  });
}

showSingleContactBtn?.addEventListener('click', () => togglePanel(singleContactPanel));
showBulkImportBtn?.addEventListener('click', () => togglePanel(bulkImportPanel));

function cleanText(value) {
  const v = typeof value === 'string' ? value.trim() : '';
  return v ? v : null;
}

function cleanEmail(value) {
  const v = cleanText(value);
  return v ? v.toLowerCase() : null;
}

function cleanInt(value) {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return Number.isInteger(n) ? n : null;
}

function cleanBoolLoose(value) {
  if (value === true || value === false) return value;
  if (value === null || value === undefined || value === '') return null;

  const v = String(value).trim().toLowerCase();
  if (['true', '1', 'yes', 'y'].includes(v)) return true;
  if (['false', '0', 'no', 'n'].includes(v)) return false;
  return null;
}

function isoNowOrNull(flag) {
  return flag === true ? new Date().toISOString() : null;
}

function buildContactRow(raw) {
  const emailConsent = cleanBoolLoose(raw.email_consent);
  const smsConsent = cleanBoolLoose(raw.sms_consent);

  return {
    full_name: cleanText(raw.full_name),
    email: cleanEmail(raw.email),
    phone_e164: cleanText(raw.phone_e164),

    source_code: cleanInt(raw.source_code),
    preferred_contact_code: cleanInt(raw.preferred_contact_code),

    active: cleanBoolLoose(raw.active),
    paid_user: cleanBoolLoose(raw.paid_user),

    birth_month: cleanInt(raw.birth_month),
    birth_day: cleanInt(raw.birth_day),

    email_consent: emailConsent,
    sms_consent: smsConsent,

    email_consented_at: isoNowOrNull(emailConsent),
    sms_consented_at: isoNowOrNull(smsConsent),

    consent_source_code: cleanInt(raw.consent_source_code),

    notes: cleanText(raw.notes),

    updated_at: null
  };
}

function validateContactRow(row) {
  const errors = [];

  if (!row.full_name && !row.email && !row.phone_e164) {
    errors.push('Needs at least one identifier: full_name, email, or phone_e164.');
  }

  if (row.birth_month !== null && (row.birth_month < 1 || row.birth_month > 12)) {
    errors.push('birth_month must be 1-12.');
  }

  if (row.birth_day !== null && (row.birth_day < 1 || row.birth_day > 31)) {
    errors.push('birth_day must be 1-31.');
  }

  if (row.source_code !== null && (row.source_code < 1 || row.source_code > 5)) {
    errors.push('source_code must be 1-5.');
  }

  if (row.preferred_contact_code !== null && (row.preferred_contact_code < 1 || row.preferred_contact_code > 4)) {
    errors.push('preferred_contact_code must be 1-4.');
  }

  if (row.consent_source_code !== null && (row.consent_source_code < 1 || row.consent_source_code > 4)) {
    errors.push('consent_source_code must be 1-4.');
  }

  return errors;
}

function formatContactDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString();
}

function contactDisplayName(contact) {
  return contact.full_name || contact.email || contact.phone_e164 || `Contact #${contact.id}`;
}

function renderRecentContacts() {
  if (!recentContactsList) return;

  recentContactsList.innerHTML = '';

  const visibleContacts = showingAllRecentContacts
    ? recentContacts
    : recentContacts.slice(0, INITIAL_RECENT_CONTACTS_COUNT);

  visibleContacts.forEach(contact => {
    const item = document.createElement('div');
    item.className = 'recent-contact-item';

    const top = document.createElement('div');
    top.className = 'recent-contact-top';

    const name = document.createElement('div');
    name.className = 'recent-contact-name';
    name.textContent = contactDisplayName(contact);

    const date = document.createElement('div');
    date.className = 'recent-contact-date';
    date.textContent = formatContactDate(contact.created_at);

    top.appendChild(name);
    top.appendChild(date);

    const meta = document.createElement('div');
    meta.className = 'recent-contact-meta';

    const metaParts = [];
    if (contact.email) metaParts.push(`Email: ${contact.email}`);
    if (contact.phone_e164) metaParts.push(`Phone: ${contact.phone_e164}`);
    if (contact.birth_month && contact.birth_day) {
      metaParts.push(`Birthday: ${contact.birth_month}/${contact.birth_day}`);
    }

    meta.textContent = metaParts.length ? metaParts.join(' • ') : 'No extra details';

    item.appendChild(top);
    item.appendChild(meta);

    recentContactsList.appendChild(item);
  });

  if (toggleRecentContactsBtn) {
    toggleRecentContactsBtn.textContent = showingAllRecentContacts ? 'Show Less' : 'See More';
  }
}

async function loadRecentContacts() {
  if (!recentContactsMessage) return;

  recentContactsMessage.textContent = 'Loading recent contacts...';
  if (recentContactsActions) recentContactsActions.style.display = 'none';
  if (recentContactsList) recentContactsList.innerHTML = '';

  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('id, full_name, email, phone_e164, birth_month, birth_day, created_at')
      .order('created_at', { ascending: false })
      .limit(MAX_RECENT_CONTACTS);

    if (error) throw error;

    recentContacts = data || [];
    showingAllRecentContacts = false;

    if (contactsCountValue) {
      contactsCountValue.textContent = String(recentContacts.length);
    }

    if (!recentContacts.length) {
      recentContactsMessage.textContent = 'No contacts found yet.';
      return;
    }

    recentContactsMessage.textContent = `Showing ${Math.min(INITIAL_RECENT_CONTACTS_COUNT, recentContacts.length)} of ${recentContacts.length} recent contacts.`;
    renderRecentContacts();

    if (recentContactsActions) {
      recentContactsActions.style.display = 'flex';
    }
  } catch (err) {
    if (recentContactsList) recentContactsList.innerHTML = '';
    recentContactsMessage.textContent = err.message || 'Could not load recent contacts.';
  }
}

function splitCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    const next = line[i + 1];

    if (ch === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }

  result.push(current);
  return result.map(v => v.trim());
}

function parseCsv(text) {
  const lines = text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  const headers = splitCsvLine(lines[0]);
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = splitCsvLine(lines[i]);
    const obj = {};
    headers.forEach((header, idx) => {
      obj[header] = values[idx] ?? '';
    });
    rows.push(obj);
  }

  return rows;
}

async function readBulkCsvSource() {
  if (bulkCsvFile?.files?.[0]) {
    return await bulkCsvFile.files[0].text();
  }
  return bulkCsvText?.value.trim() || '';
}

function renderBulkPreview(rows, results = null) {
  if (!bulkPreview) return;

  bulkPreview.innerHTML = '';

  if (!rows.length) return;

  rows.slice(0, 8).forEach((row, idx) => {
    const div = document.createElement('div');
    div.className = 'bulk-preview-item';

    let text = `Row ${idx + 1}: `;
    text += row.full_name || row.email || row.phone_e164 || 'Unnamed row';

    if (results && results[idx]) {
      text += results[idx].ok ? ' — ready/inserted' : ` — error: ${results[idx].error}`;
    }

    div.textContent = text;
    bulkPreview.appendChild(div);
  });

  if (rows.length > 8) {
    const extra = document.createElement('div');
    extra.className = 'bulk-preview-item';
    extra.textContent = `Plus ${rows.length - 8} more row(s).`;
    bulkPreview.appendChild(extra);
  }
}

singleContactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!saveSingleContactBtn || !singleContactMessage) return;

  saveSingleContactBtn.disabled = true;
  singleContactMessage.textContent = 'Saving contact...';

  try {
    const row = buildContactRow({
      full_name: document.getElementById('contact_full_name')?.value,
      email: document.getElementById('contact_email')?.value,
      phone_e164: document.getElementById('contact_phone')?.value,
      source_code: document.getElementById('contact_source_code')?.value,
      preferred_contact_code: document.getElementById('contact_preferred_contact_code')?.value,
      active: document.getElementById('contact_active')?.checked,
      paid_user: document.getElementById('contact_paid_user')?.checked,
      birth_month: document.getElementById('contact_birth_month')?.value,
      birth_day: document.getElementById('contact_birth_day')?.value,
      email_consent: document.getElementById('contact_email_consent')?.checked,
      sms_consent: document.getElementById('contact_sms_consent')?.checked,
      consent_source_code: document.getElementById('contact_consent_source_code')?.value,
      notes: document.getElementById('contact_notes')?.value
    });

    const errors = validateContactRow(row);
    if (errors.length) {
      singleContactMessage.textContent = `Could not save: ${errors.join(' ')}`;
      saveSingleContactBtn.disabled = false;
      return;
    }

    const { data, error } = await supabase
      .from('contacts')
      .insert([row])
      .select('id, full_name, email, phone_e164')
      .single();

    if (error) throw error;

    singleContactMessage.textContent = `Saved contact #${data.id}${data.full_name ? ` (${data.full_name})` : ''}.`;
    singleContactForm.reset();
    await loadRecentContacts();
  } catch (err) {
    singleContactMessage.textContent = err.message || 'Failed to save contact.';
  } finally {
    saveSingleContactBtn.disabled = false;
  }
});

previewBulkImportBtn?.addEventListener('click', async () => {
  try {
    const csvText = await readBulkCsvSource();
    if (!csvText) {
      if (bulkImportMessage) bulkImportMessage.textContent = 'Add a CSV file or paste CSV text first.';
      return;
    }

    const rawRows = parseCsv(csvText);
    const rows = rawRows.map(buildContactRow);
    const results = rows.map(row => {
      const errors = validateContactRow(row);
      return errors.length ? { ok: false, error: errors.join(' ') } : { ok: true };
    });

    parsedBulkRows = rows;
    const validCount = results.filter(r => r.ok).length;
    const invalidCount = results.length - validCount;

    if (bulkImportMessage) {
      bulkImportMessage.textContent = `Preview ready: ${validCount} valid, ${invalidCount} invalid.`;
    }

    renderBulkPreview(rows, results);
  } catch (err) {
    if (bulkImportMessage) {
      bulkImportMessage.textContent = err.message || 'Could not preview CSV.';
    }
  }
});

runBulkImportBtn?.addEventListener('click', async () => {
  try {
    if (!parsedBulkRows.length) {
      if (bulkImportMessage) bulkImportMessage.textContent = 'Preview the CSV first before importing.';
      return;
    }

    if (runBulkImportBtn) runBulkImportBtn.disabled = true;
    if (previewBulkImportBtn) previewBulkImportBtn.disabled = true;
    if (bulkImportMessage) bulkImportMessage.textContent = 'Importing rows...';

    let successCount = 0;
    let failCount = 0;
    const results = [];

    for (const row of parsedBulkRows) {
      const errors = validateContactRow(row);
      if (errors.length) {
        failCount++;
        results.push({ ok: false, error: errors.join(' ') });
        continue;
      }

      const { error } = await supabase
        .from('contacts')
        .insert([row]);

      if (error) {
        failCount++;
        results.push({ ok: false, error: error.message });
      } else {
        successCount++;
        results.push({ ok: true });
      }
    }

    if (bulkImportMessage) {
      bulkImportMessage.textContent = `Import finished: ${successCount} inserted, ${failCount} failed.`;
    }

    renderBulkPreview(parsedBulkRows, results);
    await loadRecentContacts();
  } catch (err) {
    if (bulkImportMessage) {
      bulkImportMessage.textContent = err.message || 'Bulk import failed.';
    }
  } finally {
    if (runBulkImportBtn) runBulkImportBtn.disabled = false;
    if (previewBulkImportBtn) previewBulkImportBtn.disabled = false;
  }
});

toggleRecentContactsBtn?.addEventListener('click', () => {
  showingAllRecentContacts = !showingAllRecentContacts;
  renderRecentContacts();

  if (recentContactsMessage) {
    if (showingAllRecentContacts) {
      recentContactsMessage.textContent = `Showing all ${recentContacts.length} recent contacts.`;
    } else {
      recentContactsMessage.textContent = `Showing ${Math.min(INITIAL_RECENT_CONTACTS_COUNT, recentContacts.length)} of ${recentContacts.length} recent contacts.`;
    }
  }
});

refreshRecentContactsBtn?.addEventListener('click', async () => {
  await loadRecentContacts();
});

window.adminPageInit = async function () {
  await loadRecentContacts();
};