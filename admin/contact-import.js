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

function collapseWhitespace(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function cleanName(value) {
  const base = cleanText(value);
  if (!base) return null;

  let v = base.normalize('NFKC');
  v = collapseWhitespace(v);

  v = v.replace(/\s*-\s*/g, '-');
  v = v.replace(/\s*'\s*/g, "'");
  v = v.replace(/\s*,\s*/g, ', ');
  v = v.replace(/\s+\./g, '.');

  return v || null;
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

function normalizePhoneToE164(value) {
  const raw = cleanText(value);
  if (!raw) return null;

  const v = raw.normalize('NFKC').trim();
  const digits = v.replace(/\D/g, '');

  if (!digits) return null;

  if (digits.length === 10) {
    return `+1${digits}`;
  }

  if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  }

  const hadLeadingPlus = /^\s*\+/.test(v);
  if (hadLeadingPlus && digits.length >= 8 && digits.length <= 15) {
    return `+${digits}`;
  }

  // For messy US-style input with extra junk, try to recover:
  // 1XXXXXXXXXX anywhere -> use that
  const match11 = digits.match(/1\d{10}/);
  if (match11) {
    return `+${match11[0]}`;
  }

  // Otherwise grab the last 10 digits as a US number
  if (digits.length >= 10) {
    return `+1${digits.slice(-10)}`;
  }

  return raw;
}

function isLikelyValidEmail(email) {
  if (!email) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isLikelyValidPhoneE164(phone) {
  if (!phone) return true;
  return /^\+[1-9]\d{7,14}$/.test(phone);
}

function buildContactRow(raw) {
  const emailConsent = cleanBoolLoose(raw.email_consent);
  const smsConsent = cleanBoolLoose(raw.sms_consent);

  return {
    full_name: cleanName(raw.full_name),
    email: cleanEmail(raw.email),
    phone_e164: normalizePhoneToE164(raw.phone_e164),

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

  if (row.email && !isLikelyValidEmail(row.email)) {
    errors.push('email appears invalid.');
  }

  if (row.phone_e164 && !isLikelyValidPhoneE164(row.phone_e164)) {
    errors.push('phone_e164 could not be normalized into a valid E.164 phone number.');
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

function formatPreviewValue(value) {
  return value === null || value === undefined || value === '' ? '—' : String(value);
}

function didValueChange(rawValue, cleanedValue) {
  const raw = formatPreviewValue(rawValue);
  const cleaned = formatPreviewValue(cleanedValue);
  return raw !== cleaned;
}

function buildPreviewRecord(raw) {
  const cleaned = buildContactRow(raw);
  const errors = validateContactRow(cleaned);

  return {
    raw,
    cleaned,
    ok: errors.length === 0,
    error: errors.join(' ')
  };
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

    const { count, error: countError } = await supabase
      .from('contacts')
      .select('*', { count: 'exact', head: true });

    if (countError) throw countError;

    singleContactMessage.textContent =
      `Saved contact as member #${count}${data.full_name ? ` (${data.full_name})` : ''}.`;

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

function createPreviewLine(label, rawValue, cleanedValue) {
  const changed = didValueChange(rawValue, cleanedValue);
  const line = document.createElement('div');
  line.className = 'bulk-preview-line';
  line.textContent = `${label}: ${formatPreviewValue(rawValue)} → ${formatPreviewValue(cleanedValue)}${changed ? ' (cleaned)' : ''}`;
  return line;
}

function renderBulkPreview(records, mode = 'preview', importResults = []) {
  bulkPreview.innerHTML = '';

  if (!records.length) return;

  records.slice(0, 8).forEach((record, idx) => {
    const item = document.createElement('div');
    item.className = 'bulk-preview-item';

    const title = document.createElement('div');
    title.className = 'bulk-preview-title';

    let titleText = `Row ${idx + 1}: `;
    titleText += record.cleaned.full_name || record.cleaned.email || record.cleaned.phone_e164 || 'Unnamed row';

    if (mode === 'preview') {
      titleText += record.ok ? ' — ready' : ` — error: ${record.error}`;
    } else if (mode === 'import') {
      const result = importResults[idx];
      if (result) {
        titleText += result.ok ? ' — inserted' : ` — error: ${result.error}`;
      }
    }

    title.textContent = titleText;
    item.appendChild(title);

    item.appendChild(createPreviewLine('Name', record.raw.full_name, record.cleaned.full_name));
    item.appendChild(createPreviewLine('Email', record.raw.email, record.cleaned.email));
    item.appendChild(createPreviewLine('Phone', record.raw.phone_e164, record.cleaned.phone_e164));

    bulkPreview.appendChild(item);
  });

  if (records.length > 8) {
    const extra = document.createElement('div');
    extra.className = 'bulk-preview-item';
    extra.textContent = `Plus ${records.length - 8} more row(s).`;
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
    const records = rawRows.map(buildPreviewRecord);

    parsedBulkRows = records;

    const validCount = records.filter((r) => r.ok).length;
    const invalidCount = records.length - validCount;

    bulkImportMessage.textContent = `Preview ready: ${validCount} valid, ${invalidCount} invalid.`;
    renderBulkPreview(records, 'preview');
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

    for (const record of parsedBulkRows) {
      const row = record.cleaned;
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
    renderBulkPreview(parsedBulkRows, 'import', results);
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