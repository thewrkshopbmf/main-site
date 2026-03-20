import { supabase } from '../scripts/supabase/supabaseClient.js';

const singleContactForm = document.getElementById('singleContactForm');
const singleContactMessage = document.getElementById('singleContactMessage');
const saveSingleContactBtn = document.getElementById('saveSingleContactBtn');

const bulkCsvFile = document.getElementById('bulkCsvFile');
const bulkCsvText = document.getElementById('bulkCsvText');
const previewBulkImportBtn = document.getElementById('previewBulkImportBtn');
const runBulkImportBtn = document.getElementById('runBulkImportBtn');
const bulkImportMessage = document.getElementById('bulkImportMessage');
const bulkPreview = document.getElementById('bulkPreview');

let parsedBulkRows = [];

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

singleContactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  saveSingleContactBtn.disabled = true;
  singleContactMessage.textContent = 'Saving contact...';

  try {
    const row = buildContactRow({
      full_name: document.getElementById('contact_full_name').value,
      email: document.getElementById('contact_email').value,
      phone_e164: document.getElementById('contact_phone').value,
      source_code: document.getElementById('contact_source_code').value,
      preferred_contact_code: document.getElementById('contact_preferred_contact_code').value,
      active: document.getElementById('contact_active').checked,
      paid_user: document.getElementById('contact_paid_user').checked,
      birth_month: document.getElementById('contact_birth_month').value,
      birth_day: document.getElementById('contact_birth_day').value,
      email_consent: document.getElementById('contact_email_consent').checked,
      sms_consent: document.getElementById('contact_sms_consent').checked,
      consent_source_code: document.getElementById('contact_consent_source_code').value,
      notes: document.getElementById('contact_notes').value
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
  } catch (err) {
    singleContactMessage.textContent = err.message || 'Failed to save contact.';
  } finally {
    saveSingleContactBtn.disabled = false;
  }
});

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
  return result.map((v) => v.trim());
}

function parseCsv(text) {
  const lines = text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map((line) => line.trim())
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
  return bulkCsvText.value.trim();
}

function renderBulkPreview(rows, results = null) {
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

previewBulkImportBtn?.addEventListener('click', async () => {
  try {
    const csvText = await readBulkCsvSource();
    if (!csvText) {
      bulkImportMessage.textContent = 'Add a CSV file or paste CSV text first.';
      return;
    }

    const rawRows = parseCsv(csvText);
    const rows = rawRows.map(buildContactRow);
    const results = rows.map((row) => {
      const errors = validateContactRow(row);
      return errors.length ? { ok: false, error: errors.join(' ') } : { ok: true };
    });

    parsedBulkRows = rows;
    const validCount = results.filter((r) => r.ok).length;
    const invalidCount = results.length - validCount;

    bulkImportMessage.textContent = `Preview ready: ${validCount} valid, ${invalidCount} invalid.`;
    renderBulkPreview(rows, results);
  } catch (err) {
    bulkImportMessage.textContent = err.message || 'Could not preview CSV.';
  }
});

runBulkImportBtn?.addEventListener('click', async () => {
  try {
    if (!parsedBulkRows.length) {
      bulkImportMessage.textContent = 'Preview the CSV first before importing.';
      return;
    }

    runBulkImportBtn.disabled = true;
    previewBulkImportBtn.disabled = true;
    bulkImportMessage.textContent = 'Importing rows...';

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

    bulkImportMessage.textContent = `Import finished: ${successCount} inserted, ${failCount} failed.`;
    renderBulkPreview(parsedBulkRows, results);
  } catch (err) {
    bulkImportMessage.textContent = err.message || 'Bulk import failed.';
  } finally {
    runBulkImportBtn.disabled = false;
    previewBulkImportBtn.disabled = false;
  }
});

window.contactImportPageInit = function contactImportPageInit() {
  // Reserved for future page-level initialization
};