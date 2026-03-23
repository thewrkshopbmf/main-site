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
let lastDetectedFieldMap = null;

function cleanText(value) {
  const v = typeof value === 'string' ? value.trim() : '';
  return v ? v : null;
}

function cleanName(value) {
  const base = cleanText(value);
  if (!base) return null;
  return base.normalize('NFKC');
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

function combinePhoneParts(prefix, phone) {
  const cleanedPhone = cleanText(phone);
  if (!cleanedPhone) return null;

  const cleanedPrefix = cleanText(prefix) || '+1';

  if (/^\s*\+/.test(cleanedPhone)) {
    return cleanedPhone;
  }

  return `${cleanedPrefix} ${cleanedPhone}`;
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

  const us11Anywhere = digits.match(/1\d{10}/);
  if (us11Anywhere) {
    return `+${us11Anywhere[0]}`;
  }

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

function normalizeHeaderName(header) {
  return String(header || '')
    .trim()
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function headerTokens(header) {
  return normalizeHeaderName(header).split(' ').filter(Boolean);
}

const HEADER_RULES = {
  full_name: {
    exact: ['full_name', 'full name', 'name'],
    startsWith: ['full name', 'contact name', 'customer name', 'client name', 'person name'],
    contains: [],
    banned: ['first name', 'last name', 'phonetic first name', 'phonetic last name', 'nickname']
  },
  first_name: {
    exact: ['first_name', 'first name', 'firstname', 'given name'],
    startsWith: ['forename'],
    contains: [],
    banned: ['phonetic first name']
  },
  last_name: {
    exact: ['last_name', 'last name', 'lastname', 'surname'],
    startsWith: ['family name'],
    contains: [],
    banned: ['phonetic last name']
  },
  email: {
    exact: ['email', 'email_address', 'email address'],
    startsWith: ['primary email'],
    contains: [],
    banned: ['email label', 'email type', 'alternate email', 'secondary email']
  },
  phone_e164: {
    exact: ['phone_e164', 'phone', 'phone number', 'mobile', 'mobile number', 'cell', 'cell phone', 'telephone', 'tel'],
    startsWith: ['primary phone', 'sms number'],
    contains: [],
    banned: [
      'phonetic first name',
      'phonetic last name',
      'phone label',
      'phone type',
      'mobile label',
      'telephone label'
    ]
  },
  phone_prefix: {
    exact: ['phone prefix', 'country code', 'dial code', 'phone country code'],
    startsWith: ['mobile prefix'],
    contains: [],
    banned: ['country']
  },
  source_code: {
    exact: ['source_code', 'source code'],
    startsWith: ['lead source', 'origin code'],
    contains: [],
    banned: []
  },
  preferred_contact_code: {
    exact: ['preferred_contact_code', 'preferred contact code'],
    startsWith: ['preferred contact', 'contact preference', 'preferred method'],
    contains: [],
    banned: []
  },
  active: {
    exact: ['active', 'is active'],
    startsWith: ['status active', 'enabled'],
    contains: [],
    banned: ['activity', 'last active']
  },
  paid_user: {
    exact: ['paid_user', 'paid user'],
    startsWith: ['subscriber', 'premium'],
    contains: [],
    banned: []
  },
  birth_month: {
    exact: ['birth_month', 'birth month'],
    startsWith: ['birthday month', 'dob month'],
    contains: [],
    banned: []
  },
  birth_day: {
    exact: ['birth_day', 'birth day'],
    startsWith: ['birthday day', 'dob day'],
    contains: [],
    banned: []
  },
  email_consent: {
    exact: ['email_consent', 'email consent'],
    startsWith: ['email opt in', 'consent email', 'email permission', 'email allowed'],
    contains: [],
    banned: ['email label']
  },
  sms_consent: {
    exact: ['sms_consent', 'sms consent', 'text consent'],
    startsWith: ['mobile consent', 'sms opt in', 'text opt in', 'consent sms'],
    contains: [],
    banned: ['sms label', 'phone label', 'text label']
  },
  consent_source_code: {
    exact: ['consent_source_code', 'consent source code'],
    startsWith: ['consent source', 'source of consent'],
    contains: [],
    banned: []
  },
  notes: {
    exact: ['notes', 'note'],
    startsWith: ['comments', 'comment', 'details', 'remarks'],
    contains: [],
    banned: []
  }
};

function normalizedSet(values) {
  return (values || []).map(normalizeHeaderName).filter(Boolean);
}

function containsBannedTerm(headerNormalized, bannedList) {
  return normalizedSet(bannedList).some((bad) => headerNormalized.includes(bad));
}

function tokenSetMatch(candidateNormalized, targetNormalized) {
  const a = headerTokens(candidateNormalized);
  const b = headerTokens(targetNormalized);
  if (!a.length || !b.length) return false;
  if (a.length !== b.length) return false;
  return a.every((token, idx) => token === b[idx]);
}

function startsWithPhrase(candidateNormalized, targetNormalized) {
  return candidateNormalized === targetNormalized || candidateNormalized.startsWith(`${targetNormalized} `);
}

function containsWholePhrase(candidateNormalized, targetNormalized) {
  if (candidateNormalized === targetNormalized) return true;
  return candidateNormalized.includes(` ${targetNormalized} `) ||
    candidateNormalized.startsWith(`${targetNormalized} `) ||
    candidateNormalized.endsWith(` ${targetNormalized}`);
}

function findHeaderByPriority(normalizedHeaders, rule) {
  const exact = normalizedSet(rule.exact);
  const startsWith = normalizedSet(rule.startsWith);
  const contains = normalizedSet(rule.contains);
  const banned = rule.banned || [];

  for (const candidate of normalizedHeaders) {
    if (containsBannedTerm(candidate.normalized, banned)) continue;
    if (exact.some((alias) => tokenSetMatch(candidate.normalized, alias))) {
      return candidate.original;
    }
  }

  for (const candidate of normalizedHeaders) {
    if (containsBannedTerm(candidate.normalized, banned)) continue;
    if (startsWith.some((alias) => startsWithPhrase(candidate.normalized, alias))) {
      return candidate.original;
    }
  }

  for (const candidate of normalizedHeaders) {
    if (containsBannedTerm(candidate.normalized, banned)) continue;
    if (contains.some((alias) => containsWholePhrase(candidate.normalized, alias))) {
      return candidate.original;
    }
  }

  return null;
}

function detectCsvFieldMap(headers) {
  const normalizedHeaders = headers.map((header) => ({
    original: header,
    normalized: normalizeHeaderName(header)
  }));

  const fieldMap = {};

  for (const [field, rule] of Object.entries(HEADER_RULES)) {
    fieldMap[field] = findHeaderByPriority(normalizedHeaders, rule);
  }

  return fieldMap;
}

function getRawValueByMappedHeader(raw, mappedHeader) {
  if (!mappedHeader) return null;
  return raw[mappedHeader] ?? null;
}

function joinNameParts(first, last) {
  const pieces = [cleanText(first), cleanText(last)].filter(Boolean);
  if (!pieces.length) return null;
  return pieces.join(' ');
}

function remapCsvRow(raw, fieldMap) {
  const explicitFullName = getRawValueByMappedHeader(raw, fieldMap.full_name);
  const firstName = getRawValueByMappedHeader(raw, fieldMap.first_name);
  const lastName = getRawValueByMappedHeader(raw, fieldMap.last_name);

  const builtFullName = explicitFullName || joinNameParts(firstName, lastName);

  const rawPhone = getRawValueByMappedHeader(raw, fieldMap.phone_e164);
  const rawPhonePrefix = getRawValueByMappedHeader(raw, fieldMap.phone_prefix);

  return {
    full_name: builtFullName,
    email: getRawValueByMappedHeader(raw, fieldMap.email),
    phone_e164: rawPhonePrefix ? combinePhoneParts(rawPhonePrefix, rawPhone) : rawPhone,

    source_code: getRawValueByMappedHeader(raw, fieldMap.source_code),
    preferred_contact_code: getRawValueByMappedHeader(raw, fieldMap.preferred_contact_code),

    active: getRawValueByMappedHeader(raw, fieldMap.active),
    paid_user: getRawValueByMappedHeader(raw, fieldMap.paid_user),

    birth_month: getRawValueByMappedHeader(raw, fieldMap.birth_month),
    birth_day: getRawValueByMappedHeader(raw, fieldMap.birth_day),

    email_consent: getRawValueByMappedHeader(raw, fieldMap.email_consent),
    sms_consent: getRawValueByMappedHeader(raw, fieldMap.sms_consent),

    consent_source_code: getRawValueByMappedHeader(raw, fieldMap.consent_source_code),
    notes: getRawValueByMappedHeader(raw, fieldMap.notes)
  };
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

function formatActiveValue(value) {
  if (value === true) return 'Yes';
  if (value === false) return 'No';
  return '—';
}

function didValueChange(rawValue, cleanedValue) {
  const raw = formatPreviewValue(rawValue);
  const cleaned = formatPreviewValue(cleanedValue);
  return raw !== cleaned;
}

function buildPreviewRecord(mappedRaw) {
  const cleaned = buildContactRow(mappedRaw);
  const errors = validateContactRow(cleaned);

  return {
    raw: mappedRaw,
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
      phone_e164: combinePhoneParts(
        document.getElementById('contact_phone_prefix').value,
        document.getElementById('contact_phone').value
      ),
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

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;

  const normalized = String(text || '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');

  for (let i = 0; i < normalized.length; i++) {
    const ch = normalized[i];
    const next = normalized[i + 1];

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
      row.push(cell.trim());
      cell = '';
      continue;
    }

    if (ch === '\n' && !inQuotes) {
      row.push(cell.trim());
      cell = '';

      const hasAnyValue = row.some((v) => String(v).trim() !== '');
      if (hasAnyValue) rows.push(row);

      row = [];
      continue;
    }

    cell += ch;
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell.trim());
    const hasAnyValue = row.some((v) => String(v).trim() !== '');
    if (hasAnyValue) rows.push(row);
  }

  if (rows.length < 2) {
    return { headers: [], rows: [] };
  }

  const headers = rows[0].map((header) => String(header || '').trim());
  const dataRows = rows.slice(1).map((values) => {
    const obj = {};
    headers.forEach((header, idx) => {
      obj[header] = values[idx] ?? '';
    });
    return obj;
  });

  return { headers, rows: dataRows };
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

function createSimplePreviewLine(label, value) {
  const line = document.createElement('div');
  line.className = 'bulk-preview-line';
  line.textContent = `${label}: ${value}`;
  return line;
}

function renderBulkPreview(records, mode = 'preview', importResults = [], detectedFieldMap = null) {
  bulkPreview.innerHTML = '';

  if (detectedFieldMap) {
    const mappingBox = document.createElement('div');
    mappingBox.className = 'bulk-preview-item';

    const title = document.createElement('div');
    title.className = 'bulk-preview-title';
    title.textContent = 'Detected CSV column mapping';
    mappingBox.appendChild(title);

    const nameMap = detectedFieldMap.full_name ||
      [detectedFieldMap.first_name, detectedFieldMap.last_name].filter(Boolean).join(' + ') ||
      '—';

    const mappedFields = [
      ['Name', nameMap],
      ['Email', detectedFieldMap.email || '—'],
      ['Phone', detectedFieldMap.phone_e164 || '—'],
      ['Phone Prefix', detectedFieldMap.phone_prefix || '—'],
      ['Active', detectedFieldMap.active || '—'],
      ['Notes', detectedFieldMap.notes || '—']
    ];

    mappedFields.forEach(([label, value]) => {
      mappingBox.appendChild(createSimplePreviewLine(label, value));
    });

    bulkPreview.appendChild(mappingBox);
  }

  if (!records.length) return;

  const previewCount = Math.min(records.length, 12);

  for (let idx = 0; idx < previewCount; idx++) {
    const record = records[idx];
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
    item.appendChild(createPreviewLine('Active', formatActiveValue(record.raw.active), formatActiveValue(record.cleaned.active)));

    bulkPreview.appendChild(item);
  }

  if (records.length > previewCount) {
    const extra = document.createElement('div');
    extra.className = 'bulk-preview-item';
    extra.textContent = `Plus ${records.length - previewCount} more row(s).`;
    bulkPreview.appendChild(extra);
  }
}

previewBulkImportBtn?.addEventListener('click', async () => {
  try {
    parsedBulkRows = [];
    lastDetectedFieldMap = null;
    bulkPreview.innerHTML = '';

    const csvText = await readBulkCsvSource();
    if (!csvText) {
      bulkImportMessage.textContent = 'Add a CSV file or paste CSV text first.';
      return;
    }

    const { headers, rows: rawRows } = parseCsv(csvText);
    if (!headers.length || !rawRows.length) {
      bulkImportMessage.textContent = 'Could not find usable CSV headers and rows.';
      return;
    }

    const fieldMap = detectCsvFieldMap(headers);
    lastDetectedFieldMap = fieldMap;

    const mappedRows = rawRows.map((raw) => remapCsvRow(raw, fieldMap));
    const records = mappedRows.map((row) => buildPreviewRecord(row));

    parsedBulkRows = records;

    const validCount = records.filter((r) => r.ok).length;
    const invalidCount = records.length - validCount;

    bulkImportMessage.textContent = `Preview ready: ${validCount} valid, ${invalidCount} invalid, ${records.length} total row(s).`;
    renderBulkPreview(records, 'preview', [], fieldMap);
  } catch (err) {
    parsedBulkRows = [];
    lastDetectedFieldMap = null;
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

    bulkImportMessage.textContent = `Import finished: ${successCount} inserted, ${failCount} failed, ${parsedBulkRows.length} total row(s).`;
    renderBulkPreview(parsedBulkRows, 'import', results, lastDetectedFieldMap);
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