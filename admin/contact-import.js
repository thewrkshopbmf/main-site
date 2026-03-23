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

let preparedImportRows = [];
let preparedFieldMap = null;

/* =========================
   helpers
========================= */

function cleanText(value) {
  if (value === null || value === undefined) return null;
  const v = String(value).trim();
  return v ? v : null;
}

function cleanName(value) {
  const v = cleanText(value);
  return v ? v.normalize('NFKC') : null;
}

function cleanEmail(value) {
  const v = cleanText(value);
  return v ? v.toLowerCase() : null;
}

function cleanBool(value) {
  if (value === true || value === false) return value;
  const v = cleanText(value);
  if (!v) return null;

  const s = v.toLowerCase();
  if (['true', '1', 'yes', 'y', 'active'].includes(s)) return true;
  if (['false', '0', 'no', 'n', 'inactive'].includes(s)) return false;
  return null;
}

function combinePhoneParts(prefix, phone) {
  const p = cleanText(prefix);
  const n = cleanText(phone);
  if (!n) return null;
  if (n.startsWith('+')) return n;
  return p ? `${p} ${n}` : n;
}

function normalizePhoneToE164(value) {
  const raw = cleanText(value);
  if (!raw) return null;

  const digits = raw.replace(/\D/g, '');
  const hasPlus = raw.trim().startsWith('+');

  if (digits.length === 10) {
    return `+1${digits}`;
  }

  if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  }

  if (hasPlus && digits.length >= 8 && digits.length <= 15) {
    return `+${digits}`;
  }

  return raw;
}

function isValidEmail(email) {
  if (!email) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  if (!phone) return true;
  return /^\+[1-9]\d{7,14}$/.test(phone);
}

function formatValue(value) {
  return value === null || value === undefined || value === '' ? '—' : String(value);
}

/* =========================
   1) parse
========================= */

function parseCsv(text) {
  const input = String(text || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    const next = input[i + 1];

    if (ch === '"') {
      if (inQuotes && next === '"') {
        cell += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === ',' && !inQuotes) {
      row.push(cell);
      cell = '';
      continue;
    }

    if (ch === '\n' && !inQuotes) {
      row.push(cell);
      cell = '';

      const hasData = row.some((v) => String(v).trim() !== '');
      if (hasData) rows.push(row);

      row = [];
      continue;
    }

    cell += ch;
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    const hasData = row.some((v) => String(v).trim() !== '');
    if (hasData) rows.push(row);
  }

  if (rows.length < 2) {
    return { headers: [], rows: [] };
  }

  const headers = rows[0].map((h) => String(h).trim());
  const dataRows = rows.slice(1).map((values) => {
    const obj = {};
    headers.forEach((header, idx) => {
      obj[header] = values[idx] ?? '';
    });
    return obj;
  });

  return { headers, rows: dataRows };
}

/* =========================
   2) map
========================= */

function normalizeHeader(header) {
  return String(header || '')
    .trim()
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const FIELD_RULES = {
  full_name: {
    exact: ['full_name', 'full name', 'name'],
    aliases: ['contact name', 'customer name', 'client name'],
    banned: ['first name', 'last name', 'phonetic first name', 'phonetic last name', 'nickname']
  },
  first_name: {
    exact: ['first_name', 'first name', 'firstname'],
    aliases: ['given name'],
    banned: ['phonetic first name']
  },
  last_name: {
    exact: ['last_name', 'last name', 'lastname'],
    aliases: ['surname', 'family name'],
    banned: ['phonetic last name']
  },
  email: {
    exact: ['email', 'email_address', 'email address'],
    aliases: ['primary email'],
    banned: ['email label', 'email label 1', 'email label 2', 'email type']
  },
  phone: {
    exact: ['phone_e164', 'phone', 'phone number', 'mobile', 'mobile number', 'cell', 'cell phone', 'telephone', 'tel'],
    aliases: ['primary phone', 'sms number'],
    banned: ['phonetic first name', 'phonetic last name', 'phone label', 'phone label 1', 'phone label 2', 'phone type']
  },
  phone_prefix: {
    exact: ['phone prefix', 'country code', 'dial code'],
    aliases: ['phone country code', 'mobile prefix'],
    banned: []
  },
  active: {
    exact: ['active', 'is active'],
    aliases: ['enabled', 'status active'],
    banned: ['last active', 'activity']
  },
  notes: {
    exact: ['notes', 'note'],
    aliases: ['comments', 'comment', 'remarks', 'details'],
    banned: []
  }
};

function headerIsBanned(normalizedHeader, bannedList) {
  return bannedList.some((item) => normalizedHeader.includes(normalizeHeader(item)));
}

function findBestHeader(headers, rule) {
  const normalizedHeaders = headers.map((header) => ({
    raw: header,
    normalized: normalizeHeader(header)
  }));

  for (const header of normalizedHeaders) {
    if (headerIsBanned(header.normalized, rule.banned)) continue;
    if (rule.exact.map(normalizeHeader).includes(header.normalized)) {
      return header.raw;
    }
  }

  for (const header of normalizedHeaders) {
    if (headerIsBanned(header.normalized, rule.banned)) continue;
    if (rule.aliases.map(normalizeHeader).includes(header.normalized)) {
      return header.raw;
    }
  }

  return null;
}

function detectFieldMap(headers) {
  return {
    full_name: findBestHeader(headers, FIELD_RULES.full_name),
    first_name: findBestHeader(headers, FIELD_RULES.first_name),
    last_name: findBestHeader(headers, FIELD_RULES.last_name),
    email: findBestHeader(headers, FIELD_RULES.email),
    phone: findBestHeader(headers, FIELD_RULES.phone),
    phone_prefix: findBestHeader(headers, FIELD_RULES.phone_prefix),
    active: findBestHeader(headers, FIELD_RULES.active),
    notes: findBestHeader(headers, FIELD_RULES.notes)
  };
}

/* =========================
   3) transform
========================= */

function getMappedValue(rawRow, headerName) {
  if (!headerName) return null;
  return rawRow[headerName] ?? null;
}

function buildMappedRow(rawRow, fieldMap) {
  const fullName = getMappedValue(rawRow, fieldMap.full_name);
  const firstName = getMappedValue(rawRow, fieldMap.first_name);
  const lastName = getMappedValue(rawRow, fieldMap.last_name);

  const joinedName =
    cleanText(fullName) ||
    [cleanText(firstName), cleanText(lastName)].filter(Boolean).join(' ') ||
    null;

  const phoneValue = combinePhoneParts(
    getMappedValue(rawRow, fieldMap.phone_prefix),
    getMappedValue(rawRow, fieldMap.phone)
  );

  return {
    full_name: cleanName(joinedName),
    email: cleanEmail(getMappedValue(rawRow, fieldMap.email)),
    phone_e164: normalizePhoneToE164(phoneValue),
    active: cleanBool(getMappedValue(rawRow, fieldMap.active)),
    notes: cleanText(getMappedValue(rawRow, fieldMap.notes)),

    paid_user: null,
    source_code: null,
    preferred_contact_code: null,
    birth_month: null,
    birth_day: null,
    email_consent: null,
    sms_consent: null,
    email_consented_at: null,
    sms_consented_at: null,
    consent_source_code: null,
    updated_at: null
  };
}

/* =========================
   4) validate
========================= */

function validateContact(row) {
  const errors = [];

  if (!row.full_name && !row.email && !row.phone_e164) {
    errors.push('Needs at least one identifier: full_name, email, or phone_e164.');
  }

  if (row.email && !isValidEmail(row.email)) {
    errors.push('email appears invalid.');
  }

  if (row.phone_e164 && !isValidPhone(row.phone_e164)) {
    errors.push('phone_e164 is not a valid E.164 number.');
  }

  return errors;
}

function buildPreparedRows(rawRows, fieldMap) {
  return rawRows.map((rawRow, index) => {
    const mapped = buildMappedRow(rawRow, fieldMap);
    const errors = validateContact(mapped);

    return {
      index,
      rawRow,
      mapped,
      ok: errors.length === 0,
      error: errors.join(' ')
    };
  });
}

/* =========================
   5) preview / import
========================= */

function clearPreview() {
  if (bulkPreview) {
    bulkPreview.innerHTML = '';
  }
}

function addPreviewLine(parent, text) {
  const div = document.createElement('div');
  div.className = 'bulk-preview-line';
  div.textContent = text;
  parent.appendChild(div);
}

function renderPreview(preparedRows, fieldMap) {
  clearPreview();

  if (!bulkPreview) return;

  const mappingBox = document.createElement('div');
  mappingBox.className = 'bulk-preview-item';

  const mappingTitle = document.createElement('div');
  mappingTitle.className = 'bulk-preview-title';
  mappingTitle.textContent = 'Detected CSV column mapping';
  mappingBox.appendChild(mappingTitle);

  addPreviewLine(mappingBox, `Name: ${fieldMap.full_name || [fieldMap.first_name, fieldMap.last_name].filter(Boolean).join(' + ') || '—'}`);
  addPreviewLine(mappingBox, `Email: ${fieldMap.email || '—'}`);
  addPreviewLine(mappingBox, `Phone: ${fieldMap.phone || '—'}`);
  addPreviewLine(mappingBox, `Phone Prefix: ${fieldMap.phone_prefix || '—'}`);
  addPreviewLine(mappingBox, `Active: ${fieldMap.active || '—'}`);
  addPreviewLine(mappingBox, `Notes: ${fieldMap.notes || '—'}`);

  bulkPreview.appendChild(mappingBox);

  const previewCount = Math.min(preparedRows.length, 12);

  for (let i = 0; i < previewCount; i++) {
    const row = preparedRows[i];
    const item = document.createElement('div');
    item.className = 'bulk-preview-item';

    const title = document.createElement('div');
    title.className = 'bulk-preview-title';
    title.textContent =
      `Row ${row.index + 2}: ` +
      `${row.mapped.full_name || row.mapped.email || row.mapped.phone_e164 || 'Unnamed row'}` +
      `${row.ok ? ' — ready' : ` — error: ${row.error}`}`;

    item.appendChild(title);

    addPreviewLine(item, `Name: ${formatValue(row.mapped.full_name)}`);
    addPreviewLine(item, `Email: ${formatValue(row.mapped.email)}`);
    addPreviewLine(item, `Phone: ${formatValue(row.mapped.phone_e164)}`);
    addPreviewLine(item, `Active: ${formatValue(row.mapped.active)}`);
    addPreviewLine(item, `Notes: ${formatValue(row.mapped.notes)}`);

    bulkPreview.appendChild(item);
  }

  if (preparedRows.length > previewCount) {
    const extra = document.createElement('div');
    extra.className = 'bulk-preview-item';
    extra.textContent = `Plus ${preparedRows.length - previewCount} more row(s).`;
    bulkPreview.appendChild(extra);
  }
}

async function readBulkCsvSource() {
  if (bulkCsvFile?.files?.[0]) {
    return await bulkCsvFile.files[0].text();
  }
  return bulkCsvText?.value?.trim() || '';
}

/* =========================
   single contact
========================= */

singleContactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  saveSingleContactBtn.disabled = true;
  singleContactMessage.textContent = 'Saving contact...';

  try {
    const row = {
      full_name: cleanName(document.getElementById('contact_full_name')?.value),
      email: cleanEmail(document.getElementById('contact_email')?.value),
      phone_e164: normalizePhoneToE164(
        combinePhoneParts(
          document.getElementById('contact_phone_prefix')?.value,
          document.getElementById('contact_phone')?.value
        )
      ),
      active: document.getElementById('contact_active')?.checked ?? null,
      notes: cleanText(document.getElementById('contact_notes')?.value),

      paid_user: document.getElementById('contact_paid_user')?.checked ?? null,
      source_code: cleanText(document.getElementById('contact_source_code')?.value),
      preferred_contact_code: cleanText(document.getElementById('contact_preferred_contact_code')?.value),
      birth_month: cleanText(document.getElementById('contact_birth_month')?.value),
      birth_day: cleanText(document.getElementById('contact_birth_day')?.value),
      email_consent: document.getElementById('contact_email_consent')?.checked ?? null,
      sms_consent: document.getElementById('contact_sms_consent')?.checked ?? null,
      consent_source_code: cleanText(document.getElementById('contact_consent_source_code')?.value),
      email_consented_at: null,
      sms_consented_at: null,
      updated_at: null
    };

    const errors = validateContact(row);
    if (errors.length) {
      singleContactMessage.textContent = `Could not save: ${errors.join(' ')}`;
      return;
    }

    const { data, error } = await supabase
      .from('contacts')
      .insert([row])
      .select('id, full_name, email, phone_e164')
      .single();

    if (error) throw error;

    singleContactMessage.textContent =
      `Saved${data?.full_name ? ` (${data.full_name})` : ''}.`;

    singleContactForm.reset();
  } catch (err) {
    singleContactMessage.textContent = err.message || 'Failed to save contact.';
  } finally {
    saveSingleContactBtn.disabled = false;
  }
});

/* =========================
   bulk preview
========================= */

previewBulkImportBtn?.addEventListener('click', async () => {
  try {
    preparedImportRows = [];
    preparedFieldMap = null;
    clearPreview();

    const csvText = await readBulkCsvSource();
    if (!csvText) {
      bulkImportMessage.textContent = 'Add a CSV file or paste CSV text first.';
      return;
    }

    const parsed = parseCsv(csvText);
    if (!parsed.headers.length || !parsed.rows.length) {
      bulkImportMessage.textContent = 'Could not find usable CSV headers and rows.';
      return;
    }

    const fieldMap = detectFieldMap(parsed.headers);
    const preparedRows = buildPreparedRows(parsed.rows, fieldMap);

    preparedFieldMap = fieldMap;
    preparedImportRows = preparedRows;

    const validCount = preparedRows.filter((row) => row.ok).length;
    const invalidCount = preparedRows.length - validCount;

    bulkImportMessage.textContent =
      `Preview ready: ${validCount} valid, ${invalidCount} invalid, ${preparedRows.length} total row(s).`;

    renderPreview(preparedRows, fieldMap);
  } catch (err) {
    preparedImportRows = [];
    preparedFieldMap = null;
    bulkImportMessage.textContent = err.message || 'Could not preview CSV.';
  }
});

/* =========================
   bulk import
========================= */

runBulkImportBtn?.addEventListener('click', async () => {
  try {
    if (!preparedImportRows.length) {
      bulkImportMessage.textContent = 'Preview the CSV first before importing.';
      return;
    }

    runBulkImportBtn.disabled = true;
    previewBulkImportBtn.disabled = true;
    bulkImportMessage.textContent = 'Importing rows...';

    let inserted = 0;
    let failed = 0;
    const importResults = [];

    for (const row of preparedImportRows) {
      if (!row.ok) {
        failed++;
        importResults.push({ ok: false, error: row.error });
        continue;
      }

      const { error } = await supabase.from('contacts').insert([row.mapped]);

      if (error) {
        failed++;
        importResults.push({ ok: false, error: error.message });
      } else {
        inserted++;
        importResults.push({ ok: true });
      }
    }

    bulkImportMessage.textContent =
      `Import finished: ${inserted} inserted, ${failed} failed, ${preparedImportRows.length} total row(s).`;

    clearPreview();

    if (bulkPreview) {
      renderPreview(
        preparedImportRows.map((row, idx) => ({
          ...row,
          ok: importResults[idx]?.ok ?? false,
          error: importResults[idx]?.error || row.error
        })),
        preparedFieldMap
      );
    }
  } catch (err) {
    bulkImportMessage.textContent = err.message || 'Bulk import failed.';
  } finally {
    runBulkImportBtn.disabled = false;
    previewBulkImportBtn.disabled = false;
  }
});

window.contactImportPageInit = function contactImportPageInit() {
  // reserved
};