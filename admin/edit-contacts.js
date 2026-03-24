import { supabase } from '../scripts/supabase/supabaseClient.js';

const contactsList = document.getElementById('contactsList');
const contactsSummary = document.getElementById('contactsSummary');
const contactSearchInput = document.getElementById('contactSearchInput');
const editRefreshBtn = document.getElementById('editRefreshBtn');

const unlockEditBtn = document.getElementById('unlockEditBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const saveContactBtn = document.getElementById('saveContactBtn');
const deleteContactBtn = document.getElementById('deleteContactBtn');
const confirmSaveCheckbox = document.getElementById('confirmSaveCheckbox');
const editorLockStatus = document.getElementById('editorLockStatus');
const editorSubtext = document.getElementById('editorSubtext');
const editorEmptyState = document.getElementById('editorEmptyState');
const contactEditForm = document.getElementById('contactEditForm');
const editorMessage = document.getElementById('editorMessage');
const editorWarning = document.getElementById('editorWarning');

const metaContactId = document.getElementById('metaContactId');
const metaCreatedAt = document.getElementById('metaCreatedAt');
const metaUpdatedAt = document.getElementById('metaUpdatedAt');

const filterButtons = Array.from(document.querySelectorAll('[data-filter]'));
const editFields = Array.from(document.querySelectorAll('.edit-field'));

const viewMoreContactsBtn = document.getElementById('viewMoreContactsBtn');

const fieldMap = {
  full_name: document.getElementById('edit_full_name'),
  email: document.getElementById('edit_email'),
  phone_e164: document.getElementById('edit_phone_e164'),
  source_code: document.getElementById('edit_source_code'),
  preferred_contact_code: document.getElementById('edit_preferred_contact_code'),
  consent_source_code: document.getElementById('edit_consent_source_code'),
  birth_month: document.getElementById('edit_birth_month'),
  birth_day: document.getElementById('edit_birth_day'),
  active: document.getElementById('edit_active'),
  paid_user: document.getElementById('edit_paid_user'),
  email_consent: document.getElementById('edit_email_consent'),
  sms_consent: document.getElementById('edit_sms_consent'),
  notes: document.getElementById('edit_notes')
};

let allContacts = [];
let filteredContacts = [];
let activeFilter = 'all';
let selectedContactId = null;
let selectedContactOriginal = null;
let isEditorUnlocked = false;
let isDirty = false;
const CONTACTS_PAGE_SIZE = 100;

let totalContactsCount = 0;
let loadedContactsCount = 0;
let hasMoreContactsToLoad = false;

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

function cleanBool(value) {
  if (value === true || value === false) return value;
  if (value === null || value === undefined || value === '') return null;

  const v = String(value).trim().toLowerCase();
  if (['true', '1', 'yes', 'y'].includes(v)) return true;
  if (['false', '0', 'no', 'n'].includes(v)) return false;
  return null;
}

function formatDateTime(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString();
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function buildSearchBlob(contact) {
  return [
    contact.full_name,
    contact.email,
    contact.phone_e164,
    contact.notes
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function contactMatchesFilter(contact, filter) {
  if (filter === 'active') return contact.active === true;
  if (filter === 'inactive') return contact.active === false;
  if (filter === 'paid') return contact.paid_user === true;
  if (filter === 'consented') return contact.email_consent === true || contact.sms_consent === true;
  return true;
}

function applySearchAndFilter() {
  const query = (contactSearchInput.value || '').trim().toLowerCase();

  filteredContacts = allContacts.filter((contact) => {
    const passesFilter = contactMatchesFilter(contact, activeFilter);
    const passesSearch = !query || buildSearchBlob(contact).includes(query);
    return passesFilter && passesSearch;
  });

  renderContactsList();
}

function getStatusBadges(contact) {
  const badges = [];

  if (contact.active === true) badges.push('<span class="contact-badge good">Active</span>');
  if (contact.active === false) badges.push('<span class="contact-badge muted">Inactive</span>');
  if (contact.paid_user === true) badges.push('<span class="contact-badge accent">Paid</span>');
  if (contact.email_consent === true || contact.sms_consent === true) {
    badges.push('<span class="contact-badge consent">Consented</span>');
  }

  return badges.join('');
}

function renderContactsList() {
  contactsList.innerHTML = '';

  const shownCount = filteredContacts.length;
  contactsSummary.textContent = `${shownCount} contact(s) shown. Total contacts in table: ${totalContactsCount}.`;

  if (!filteredContacts.length) {
    const empty = document.createElement('div');
    empty.className = 'contact-row-empty';
    empty.textContent = 'No contacts match your current search/filter.';
    contactsList.appendChild(empty);
  } else {
    filteredContacts.forEach((contact) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'contact-row';
      if (contact.id === selectedContactId) {
        button.classList.add('is-selected');
      }

      button.innerHTML = `
        <div class="contact-row-main">
          <div class="contact-row-top">
            <strong>${escapeHtml(contact.full_name || 'Unnamed Contact')}</strong>
            <span class="contact-row-date">${escapeHtml(formatDateTime(contact.created_at))}</span>
          </div>
          <div class="contact-row-mid">
            <span>${escapeHtml(contact.email || 'No email')}</span>
            <span>${escapeHtml(contact.phone_e164 || 'No phone')}</span>
          </div>
          <div class="contact-row-bottom">
            ${getStatusBadges(contact)}
          </div>
        </div>
      `;

      button.addEventListener('click', () => handleSelectContact(contact.id));
      contactsList.appendChild(button);
    });
  }

  if (viewMoreContactsBtn) {
    const canLoadMore = hasMoreContactsToLoad && allContacts.length < totalContactsCount;
    viewMoreContactsBtn.style.display = canLoadMore ? 'inline-flex' : 'none';
    viewMoreContactsBtn.disabled = false;

    if (canLoadMore) {
      const remaining = Math.max(0, totalContactsCount - allContacts.length);
      const nextLoadAmount = Math.min(CONTACTS_PAGE_SIZE, remaining);
      viewMoreContactsBtn.textContent = `View more (${nextLoadAmount})`;
    }
  }
}

function setEditorLockedState(locked) {
  isEditorUnlocked = !locked;

  editFields.forEach((field) => {
    field.disabled = locked;
  });

  confirmSaveCheckbox.disabled = locked;
  if (locked) {
    confirmSaveCheckbox.checked = false;
    saveContactBtn.disabled = true;
    editorLockStatus.textContent = 'Locked';
    editorLockStatus.classList.add('is-locked');
    editorLockStatus.classList.remove('is-unlocked');
    editorWarning.textContent = 'Fields are read-only until you unlock editing.';
    unlockEditBtn.textContent = 'Unlock Editing';
  } else {
    editorLockStatus.textContent = 'Editing Unlocked';
    editorLockStatus.classList.remove('is-locked');
    editorLockStatus.classList.add('is-unlocked');
    editorWarning.textContent = 'Editing is unlocked. Review carefully before saving.';
    unlockEditBtn.textContent = 'Lock Editing';
  }

  cancelEditBtn.disabled = !selectedContactId;
}

function markDirty(nextDirty = true) {
  isDirty = nextDirty;

  if (!selectedContactId) {
    saveContactBtn.disabled = true;
    editorMessage.textContent = 'No contact selected.';
    return;
  }

  if (!isDirty) {
    saveContactBtn.disabled = true;
    editorMessage.textContent = 'No unsaved changes.';
    return;
  }

  if (!isEditorUnlocked) {
    saveContactBtn.disabled = true;
    editorMessage.textContent = 'Unlock editing to change and save fields.';
    return;
  }

  if (!confirmSaveCheckbox.checked) {
    saveContactBtn.disabled = true;
    editorMessage.textContent = 'Review changes and check the confirmation box to save.';
    return;
  }

  saveContactBtn.disabled = false;
  editorMessage.textContent = 'Changes ready to save.';
}

function getFormData() {
  return {
    full_name: cleanText(fieldMap.full_name.value),
    email: cleanEmail(fieldMap.email.value),
    phone_e164: cleanText(fieldMap.phone_e164.value),
    source_code: cleanInt(fieldMap.source_code.value),
    preferred_contact_code: cleanInt(fieldMap.preferred_contact_code.value),
    consent_source_code: cleanInt(fieldMap.consent_source_code.value),
    birth_month: cleanInt(fieldMap.birth_month.value),
    birth_day: cleanInt(fieldMap.birth_day.value),
    active: cleanBool(fieldMap.active.checked),
    paid_user: cleanBool(fieldMap.paid_user.checked),
    email_consent: cleanBool(fieldMap.email_consent.checked),
    sms_consent: cleanBool(fieldMap.sms_consent.checked),
    notes: cleanText(fieldMap.notes.value)
  };
}

function fillForm(contact) {
  fieldMap.full_name.value = contact.full_name || '';
  fieldMap.email.value = contact.email || '';
  fieldMap.phone_e164.value = contact.phone_e164 || '';
  fieldMap.source_code.value = contact.source_code ?? '';
  fieldMap.preferred_contact_code.value = contact.preferred_contact_code ?? '';
  fieldMap.consent_source_code.value = contact.consent_source_code ?? '';
  fieldMap.birth_month.value = contact.birth_month ?? '';
  fieldMap.birth_day.value = contact.birth_day ?? '';
  fieldMap.active.checked = contact.active === true;
  fieldMap.paid_user.checked = contact.paid_user === true;
  fieldMap.email_consent.checked = contact.email_consent === true;
  fieldMap.sms_consent.checked = contact.sms_consent === true;
  fieldMap.notes.value = contact.notes || '';
}

function validateRow(row) {
  const errors = [];

  if (!row.full_name && !row.email && !row.phone_e164) {
    errors.push('Needs at least one identifier: full name, email, or phone.');
  }

  if (row.birth_month !== null && (row.birth_month < 1 || row.birth_month > 12)) {
    errors.push('Birth month must be between 1 and 12.');
  }

  if (row.birth_day !== null && (row.birth_day < 1 || row.birth_day > 31)) {
    errors.push('Birth day must be between 1 and 31.');
  }

  if (row.source_code !== null && (row.source_code < 1 || row.source_code > 5)) {
    errors.push('Source code must be between 1 and 5.');
  }

  if (row.preferred_contact_code !== null && (row.preferred_contact_code < 1 || row.preferred_contact_code > 4)) {
    errors.push('Preferred contact code must be between 1 and 4.');
  }

  if (row.consent_source_code !== null && (row.consent_source_code < 1 || row.consent_source_code > 4)) {
    errors.push('Consent source code must be between 1 and 4.');
  }

  return errors;
}

function buildUpdatePayload(formData) {
  const original = selectedContactOriginal || {};
  const payload = { ...formData };

  if (formData.email_consent === true && !original.email_consented_at) {
    payload.email_consented_at = new Date().toISOString();
  } else if (formData.email_consent === false) {
    payload.email_consented_at = null;
  }

  if (formData.sms_consent === true && !original.sms_consented_at) {
    payload.sms_consented_at = new Date().toISOString();
  } else if (formData.sms_consent === false) {
    payload.sms_consented_at = null;
  }

  payload.updated_at = new Date().toISOString();
  return payload;
}

function resetEditorToSelected() {
  if (!selectedContactOriginal) return;

  fillForm(selectedContactOriginal);
  setEditorLockedState(true);
  markDirty(false);
  editorMessage.textContent = 'Changes cancelled.';
}

async function handleSelectContact(contactId) {
  if (isDirty) {
    const proceed = window.confirm('You have unsaved changes. Discard them and open another contact?');
    if (!proceed) return;
  }

  const contact = allContacts.find((item) => item.id === contactId);
  if (!contact) return;

  selectedContactId = contactId;
  selectedContactOriginal = JSON.parse(JSON.stringify(contact));

  fillForm(contact);

  metaContactId.textContent = contact.id ?? '—';
  metaCreatedAt.textContent = formatDateTime(contact.created_at);
  metaUpdatedAt.textContent = formatDateTime(contact.updated_at);

  editorSubtext.textContent = `Reviewing ${contact.full_name || contact.email || contact.phone_e164 || 'selected contact'}.`;
  editorEmptyState.style.display = 'none';
  contactEditForm.style.display = 'block';

  unlockEditBtn.disabled = false;
  cancelEditBtn.disabled = false;
  deleteContactBtn.disabled = false;

  setEditorLockedState(true);
  markDirty(false);
  renderContactsList();
}

async function loadContactsPage({ reset = false } = {}) {
  if (reset) {
    contactsSummary.textContent = 'Loading contacts...';
    contactsList.innerHTML = '';
    allContacts = [];
    filteredContacts = [];
    loadedContactsCount = 0;
    hasMoreContactsToLoad = false;
  }

  try {
    if (reset) {
      const { count, error: countError } = await supabase
        .from('contacts')
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;
      totalContactsCount = count ?? 0;
    }

    const from = loadedContactsCount;
    const to = loadedContactsCount + CONTACTS_PAGE_SIZE - 1;

    const { data, error } = await supabase
      .from('contacts')
      .select(`
        id,
        full_name,
        email,
        phone_e164,
        source_code,
        preferred_contact_code,
        active,
        paid_user,
        birth_month,
        birth_day,
        email_consent,
        sms_consent,
        email_consented_at,
        sms_consented_at,
        consent_source_code,
        notes,
        created_at,
        updated_at
      `)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    const nextBatch = Array.isArray(data) ? data : [];

    if (reset) {
      allContacts = nextBatch;
    } else {
      allContacts = [...allContacts, ...nextBatch];
    }

    loadedContactsCount = allContacts.length;
    hasMoreContactsToLoad = nextBatch.length === CONTACTS_PAGE_SIZE && loadedContactsCount < totalContactsCount;

    applySearchAndFilter();

    if (selectedContactId) {
      const refreshedSelected = allContacts.find((item) => item.id === selectedContactId);
      if (refreshedSelected) {
        selectedContactOriginal = JSON.parse(JSON.stringify(refreshedSelected));
        fillForm(refreshedSelected);
        metaCreatedAt.textContent = formatDateTime(refreshedSelected.created_at);
        metaUpdatedAt.textContent = formatDateTime(refreshedSelected.updated_at);
      }
    }
  } catch (err) {
    contactsSummary.textContent = err.message || 'Could not load contacts.';
    if (viewMoreContactsBtn) {
      viewMoreContactsBtn.style.display = 'none';
    }
  }
}

async function loadRecentContacts() {
  await loadContactsPage({ reset: true });
}
function handleAnyFieldChange() {
  if (!selectedContactOriginal) return;

  const current = getFormData();
  const originalComparable = {
    full_name: selectedContactOriginal.full_name ?? null,
    email: selectedContactOriginal.email ?? null,
    phone_e164: selectedContactOriginal.phone_e164 ?? null,
    source_code: selectedContactOriginal.source_code ?? null,
    preferred_contact_code: selectedContactOriginal.preferred_contact_code ?? null,
    consent_source_code: selectedContactOriginal.consent_source_code ?? null,
    birth_month: selectedContactOriginal.birth_month ?? null,
    birth_day: selectedContactOriginal.birth_day ?? null,
    active: selectedContactOriginal.active ?? null,
    paid_user: selectedContactOriginal.paid_user ?? null,
    email_consent: selectedContactOriginal.email_consent ?? null,
    sms_consent: selectedContactOriginal.sms_consent ?? null,
    notes: selectedContactOriginal.notes ?? null
  };

  const changed = JSON.stringify(current) !== JSON.stringify(originalComparable);
  markDirty(changed);
}

unlockEditBtn?.addEventListener('click', () => {
  if (!selectedContactId) return;

  if (isEditorUnlocked) {
    setEditorLockedState(true);
    markDirty(isDirty);
    return;
  }

  setEditorLockedState(false);
  markDirty(isDirty);
});

cancelEditBtn?.addEventListener('click', () => {
  if (!selectedContactId) return;

  if (isDirty) {
    const confirmed = window.confirm('Discard unsaved changes for this contact?');
    if (!confirmed) return;
  }

  resetEditorToSelected();
});

confirmSaveCheckbox?.addEventListener('change', () => {
  markDirty(isDirty);
});

contactSearchInput?.addEventListener('input', () => {
  applySearchAndFilter();
});

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterButtons.forEach((item) => item.classList.remove('is-active'));
    btn.classList.add('is-active');
    activeFilter = btn.dataset.filter || 'all';
    applySearchAndFilter();
  });
});

editFields.forEach((field) => {
  const eventName = field.type === 'checkbox' ? 'change' : 'input';
  field.addEventListener(eventName, handleAnyFieldChange);
});

viewMoreContactsBtn?.addEventListener('click', async () => {
  if (!hasMoreContactsToLoad) return;

  viewMoreContactsBtn.disabled = true;
  viewMoreContactsBtn.textContent = 'Loading...';

  await loadContactsPage({ reset: false });
});

editRefreshBtn?.addEventListener('click', async () => {
  if (isDirty) {
    const proceed = window.confirm('You have unsaved changes. Refresh anyway and discard them?');
    if (!proceed) return;
  }

  selectedContactId = null;
  selectedContactOriginal = null;
  isDirty = false;
  isEditorUnlocked = false;

  editorEmptyState.style.display = 'block';
  contactEditForm.style.display = 'none';
  unlockEditBtn.disabled = true;
  cancelEditBtn.disabled = true;
  deleteContactBtn.disabled = true;

  await loadRecentContacts();
});

contactEditForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!selectedContactId) {
    editorMessage.textContent = 'No contact selected.';
    return;
  }

  if (!isEditorUnlocked) {
    editorMessage.textContent = 'Unlock editing before saving.';
    return;
  }

  if (!confirmSaveCheckbox.checked) {
    editorMessage.textContent = 'Check the confirmation box before saving.';
    return;
  }

  const formData = getFormData();
  const errors = validateRow(formData);

  if (errors.length) {
    editorMessage.textContent = errors.join(' ');
    return;
  }

  const confirmed = window.confirm('Save changes to this contact?');
  if (!confirmed) return;

  saveContactBtn.disabled = true;
  editorMessage.textContent = 'Saving changes...';

  try {
    const payload = buildUpdatePayload(formData);

    const { data, error } = await supabase
      .from('contacts')
      .update(payload)
      .eq('id', selectedContactId)
      .select(`
        id,
        full_name,
        email,
        phone_e164,
        source_code,
        preferred_contact_code,
        active,
        paid_user,
        birth_month,
        birth_day,
        email_consent,
        sms_consent,
        email_consented_at,
        sms_consented_at,
        consent_source_code,
        notes,
        created_at,
        updated_at
      `)
      .single();

    if (error) throw error;

    const index = allContacts.findIndex((item) => item.id === selectedContactId);
    if (index !== -1) {
      allContacts[index] = data;
    }

    selectedContactOriginal = JSON.parse(JSON.stringify(data));
    fillForm(data);

    metaUpdatedAt.textContent = formatDateTime(data.updated_at);

    setEditorLockedState(true);
    markDirty(false);
    editorMessage.textContent = 'Changes saved successfully.';
    applySearchAndFilter();
  } catch (err) {
    editorMessage.textContent = err.message || 'Failed to save changes.';
    markDirty(true);
  }
});

deleteContactBtn?.addEventListener('click', async () => {
  if (!selectedContactId || !selectedContactOriginal) {
    editorMessage.textContent = 'No contact selected.';
    return;
  }

  const label =
    selectedContactOriginal.full_name ||
    selectedContactOriginal.email ||
    selectedContactOriginal.phone_e164 ||
    'this contact';

  const firstConfirm = window.confirm(
    `Delete ${label}? This cannot be undone.`
  );
  if (!firstConfirm) return;

  const secondConfirm = window.prompt(
    'Type DELETE to confirm permanent removal.'
  );

  if (secondConfirm !== 'DELETE') {
    editorMessage.textContent = 'Delete cancelled.';
    return;
  }

  deleteContactBtn.disabled = true;
  saveContactBtn.disabled = true;
  cancelEditBtn.disabled = true;
  unlockEditBtn.disabled = true;
  editorMessage.textContent = 'Deleting contact...';

  try {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', selectedContactId);

    if (error) throw error;

    allContacts = allContacts.filter((item) => item.id !== selectedContactId);
    filteredContacts = filteredContacts.filter((item) => item.id !== selectedContactId);

    selectedContactId = null;
    selectedContactOriginal = null;
    isDirty = false;
    isEditorUnlocked = false;

    editorEmptyState.style.display = 'block';
    contactEditForm.style.display = 'none';
    editorSubtext.textContent = 'Choose a contact from the list to review details.';
    editorMessage.textContent = 'Contact deleted successfully.';
    unlockEditBtn.disabled = true;
    cancelEditBtn.disabled = true;
    deleteContactBtn.disabled = true;

    applySearchAndFilter();
  } catch (err) {
    editorMessage.textContent = err.message || 'Failed to delete contact.';
    deleteContactBtn.disabled = false;
    cancelEditBtn.disabled = false;
    unlockEditBtn.disabled = false;
    markDirty(isDirty);
  }
});

window.addEventListener('beforeunload', (event) => {
  if (!isDirty) return;
  event.preventDefault();
  event.returnValue = '';
});

window.contactEditPageInit = async function contactEditPageInit() {
  await loadRecentContacts();
};