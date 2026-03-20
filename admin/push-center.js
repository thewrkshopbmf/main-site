import { supabase } from '../scripts/supabase/supabaseClient.js';
import {
  buildBlogPreviewHTML,
  buildDailyPreviewHTML
} from '../scripts/shared/render-content.js';

const entryModeInputs = document.querySelectorAll('input[name="entryMode"]');
const pushSubject = document.getElementById('pushSubject');
const pushBody = document.getElementById('pushBody');
const pushJsonInput = document.getElementById('pushJsonInput');
const pushJsonFile = document.getElementById('pushJsonFile');
const pushRawLabel = document.getElementById('pushRawLabel');

const actionDaily = document.getElementById('actionDaily');
const actionBlog = document.getElementById('actionBlog');
const actionEmail = document.getElementById('actionEmail');
const actionSms = document.getElementById('actionSms');

const analyzeBtn = document.getElementById('analyzeBtn');
const previewBtn = document.getElementById('previewBtn');
const armConfirmBtn = document.getElementById('armConfirmBtn');
const confirmBtn = document.getElementById('confirmBtn');

const countdownMessage = document.getElementById('countdownMessage');
const previewBox = document.getElementById('previewBox');
const bulkAnalysisBox = document.getElementById('bulkAnalysisBox');
const outputLog = document.getElementById('outputLog');

const realPreviewFrame = document.getElementById('realPreviewFrame');
const refreshRealPreviewBtn = document.getElementById('refreshRealPreviewBtn');
const previewTypeBadge = document.getElementById('previewTypeBadge');
const previewStatusText = document.getElementById('previewStatusText');

let armed = false;
let armTimer = null;
let blogTemplateCache = '';
let dailyTemplateCache = '';

function currentMode() {
  const checked = Array.from(entryModeInputs).find((i) => i.checked);
  return checked ? checked.value : 'single';
}

function selectedActions() {
  return {
    updateDaily: actionDaily.checked,
    updateBlog: actionBlog.checked,
    sendEmail: actionEmail.checked,
    sendSms: actionSms.checked
  };
}

function formatDateHuman(iso) {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function safeJsonParse(text) {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (err) {
    return { ok: false, error: err.message || 'Invalid JSON.' };
  }
}

function formatOutputBlock(title, lines = []) {
  return [title, ...lines].join('\n');
}

async function parseResponseSafely(response) {
  const contentType = response.headers.get('content-type') || '';
  const statusLine = `HTTP ${response.status} ${response.statusText || ''}`.trim();

  let rawText = '';
  try {
    rawText = await response.text();
  } catch (err) {
    return {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      statusLine,
      contentType,
      rawText: '',
      json: null,
      parseError: err.message || 'Could not read response body.'
    };
  }

  let json = null;
  if (rawText) {
    try {
      json = JSON.parse(rawText);
    } catch {
      json = null;
    }
  }

  return {
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
    statusLine,
    contentType,
    rawText,
    json,
    parseError: null
  };
}

function buildReadableErrorFromResponse(parsed) {
  const lines = [parsed.statusLine];

  if (parsed.contentType) {
    lines.push(`Content-Type: ${parsed.contentType}`);
  }

  if (parsed.json) {
    if (parsed.json.error) lines.push(`Error: ${parsed.json.error}`);
    if (parsed.json.message) lines.push(`Message: ${parsed.json.message}`);
    if (parsed.json.details) lines.push(`Details: ${parsed.json.details}`);
    if (parsed.json.hint) lines.push(`Hint: ${parsed.json.hint}`);

    const extraKeys = Object.keys(parsed.json).filter(
      (k) => !['error', 'message', 'details', 'hint'].includes(k)
    );
    if (extraKeys.length) {
      lines.push('');
      lines.push('Extra response data:');
      lines.push(JSON.stringify(parsed.json, null, 2));
    }
  } else if (parsed.rawText) {
    lines.push('');
    lines.push('Raw response body:');
    lines.push(parsed.rawText);
  } else if (parsed.parseError) {
    lines.push(`Response read error: ${parsed.parseError}`);
  } else {
    lines.push('No response body returned.');
  }

  return lines.join('\n');
}

async function readUploadedFiles() {
  const files = Array.from(pushJsonFile.files || []);
  if (!files.length) return [];

  const loaded = [];
  for (const file of files) {
    const text = await file.text();
    loaded.push({
      name: file.name,
      text
    });
  }
  return loaded;
}

async function collectPayload() {
  const mode = currentMode();
  const uploaded = await readUploadedFiles();
  const jsonText = pushJsonInput.value.trim();
  const label = pushRawLabel.value.trim() || null;

  let structured = null;

  if (uploaded.length) {
    structured = uploaded.map((file) => {
      const parsed = safeJsonParse(file.text);
      return {
        source: file.name,
        parsed
      };
    });
  } else if (jsonText) {
    const parsed = safeJsonParse(jsonText);
    structured = [{
      source: 'textarea',
      parsed
    }];
  }

  return {
    mode,
    label,
    subject: pushSubject.value.trim() || null,
    body: pushBody.value.trim() || null,
    actions: selectedActions(),
    structured
  };
}

function normalizeEntriesFromPayload(payload) {
  if (!payload.structured || !payload.structured.length) {
    return { errors: ['No JSON provided.'], entries: [] };
  }

  const entries = [];
  const errors = [];

  for (const item of payload.structured) {
    if (!item.parsed.ok) {
      errors.push(`${item.source}: ${item.parsed.error}`);
      continue;
    }

    const value = item.parsed.value;

    if (Array.isArray(value)) {
      value.forEach((v, idx) => {
        if (v && typeof v === 'object' && !Array.isArray(v)) {
          entries.push({ source: `${item.source}[${idx}]`, data: v });
        } else {
          errors.push(`${item.source}[${idx}]: entry must be a JSON object.`);
        }
      });
    } else if (value && typeof value === 'object') {
      entries.push({ source: item.source, data: value });
    } else {
      errors.push(`${item.source}: root must be a JSON object or array of objects.`);
    }
  }

  return { errors, entries };
}

function validateEntryForDaily(entry) {
  const required = ['date', 'title', 'verse_ref', 'verse_text'];
  return required.filter((key) => !(key in entry));
}

function validateEntryForBlog(entry) {
  const required = ['date', 'title', 'body_html'];
  return required.filter((key) => !(key in entry));
}

function analyzeDateRanges(entries) {
  const dates = entries
    .map((e) => e.data?.date)
    .filter(Boolean)
    .sort();

  if (!dates.length) {
    return 'No valid dates detected.';
  }

  const ranges = [];
  let start = dates[0];
  let prev = dates[0];

  function dayAfter(iso) {
    const d = new Date(`${iso}T00:00:00`);
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  }

  for (let i = 1; i < dates.length; i++) {
    if (dates[i] === dayAfter(prev)) {
      prev = dates[i];
    } else {
      ranges.push([start, prev]);
      start = dates[i];
      prev = dates[i];
    }
  }
  ranges.push([start, prev]);

  if (ranges.length === 1) {
    return `Clean range detected: ${formatDateHuman(ranges[0][0])} - ${formatDateHuman(ranges[0][1])}`;
  }

  if (ranges.length === 2) {
    return `Two ranges detected:\n1) ${formatDateHuman(ranges[0][0])} - ${formatDateHuman(ranges[0][1])}\n2) ${formatDateHuman(ranges[1][0])} - ${formatDateHuman(ranges[1][1])}`;
  }

  return `More than two ranges were detected. This could be an error. Please double check.\nFirst date: ${formatDateHuman(ranges[0][0])}\nLast date: ${formatDateHuman(ranges[ranges.length - 1][1])}`;
}

async function loadTemplateText(path) {
  const res = await fetch(path, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Could not load template: ${path}`);
  }
  return await res.text();
}

async function ensureTemplatesLoaded() {
  if (!blogTemplateCache) {
    blogTemplateCache = await loadTemplateText('../templates/blog.html');
  }
  if (!dailyTemplateCache) {
    dailyTemplateCache = await loadTemplateText('../templates/daily.html');
  }
}

function stripScriptsFromDocument(html) {
  if (!html) return '';
  return String(html).replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
}

function pickPreviewType(payload) {
  if (payload.actions.updateBlog && !payload.actions.updateDaily) return 'blog';
  if (payload.actions.updateDaily && !payload.actions.updateBlog) return 'daily';

  const first = payload.structured?.[0]?.parsed?.value;
  if (first && !Array.isArray(first) && typeof first === 'object') {
    if ('verse_ref' in first || 'verse_text' in first) return 'daily';
    if ('body_html' in first || 'category' in first || 'excerpt' in first) return 'blog';
  }

  return payload.actions.updateBlog ? 'blog' : 'daily';
}

async function renderRealPreview(payload = null, entries = null) {
  if (!realPreviewFrame) return;

  if (!payload || !entries) {
    payload = await collectPayload();
    ({ entries } = normalizeEntriesFromPayload(payload));
  }

  if (!entries.length) {
    previewTypeBadge.textContent = 'Real Preview';
    previewStatusText.textContent = 'No entry available to render.';
    realPreviewFrame.srcdoc = `
      <div style="padding:16px;font-family:sans-serif;color:#6b5b53;">
        No structured entry available for preview.
      </div>
    `;
    return;
  }

  await ensureTemplatesLoaded();

  const entry = entries[0].data;
  const previewType = pickPreviewType(payload);

  let html = '';

  if (previewType === 'blog') {
    html = buildBlogPreviewHTML({
      template: blogTemplateCache,
      entry,
      prevHref: '#',
      nextHref: '#'
    });
    previewTypeBadge.textContent = 'Blog Preview';
  } else {
    html = buildDailyPreviewHTML({
      template: dailyTemplateCache,
      entry,
      prevHref: '#',
      nextHref: '#'
    });
    previewTypeBadge.textContent = 'Daily Preview';
  }

  previewStatusText.textContent = `${entry.title || 'Untitled'}${entry.date ? ` • ${entry.date}` : ''}`;
  realPreviewFrame.srcdoc = stripScriptsFromDocument(html);
}

async function runAnalysis() {
  const payload = await collectPayload();
  const actions = payload.actions;
  const actionCount = Object.values(actions).filter(Boolean).length;

  if (actionCount === 0) {
    bulkAnalysisBox.textContent = 'Choose at least one action first.';
    return { ok: false };
  }

  const { errors, entries } = normalizeEntriesFromPayload(payload);

  const report = [];
  if (errors.length) {
    report.push('JSON errors:');
    errors.forEach((e) => report.push(`- ${e}`));
  }

  if (payload.mode === 'bulk') {
    report.push('Mode: bulk');
    report.push(`Entries detected: ${entries.length}`);
    report.push(analyzeDateRanges(entries));
  } else {
    report.push('Mode: single');
    report.push(`Entries detected: ${entries.length}`);
  }

  if (actions.updateDaily) {
    let dailyIssues = 0;
    for (const entry of entries) {
      const missing = validateEntryForDaily(entry.data);
      if (missing.length) {
        dailyIssues++;
        report.push(`Daily validation issue in ${entry.source}: missing ${missing.join(', ')}`);
      }
    }
    if (!dailyIssues && entries.length) {
      report.push('Daily validation passed.');
    }
  }

  if (actions.updateBlog) {
    let blogIssues = 0;
    for (const entry of entries) {
      const missing = validateEntryForBlog(entry.data);
      if (missing.length) {
        blogIssues++;
        report.push(`Blog validation issue in ${entry.source}: missing ${missing.join(', ')}`);
      }
    }
    if (!blogIssues && entries.length) {
      report.push('Blog validation passed.');
    }
  }

  if (payload.mode === 'bulk' && entries.length) {
    report.push('');
    report.push('First entry sample:');
    report.push(JSON.stringify(entries[0].data, null, 2));
  }

  bulkAnalysisBox.textContent = report.join('\n');
  return {
    ok: !errors.length,
    entries,
    payload
  };
}

async function runPreview() {
  const payload = await collectPayload();
  const { errors, entries } = normalizeEntriesFromPayload(payload);

  const lines = [];
  lines.push(`Actions: ${Object.entries(payload.actions).filter(([, v]) => v).map(([k]) => k).join(', ') || 'none'}`);
  lines.push(`Mode: ${payload.mode}`);
  lines.push(`Subject: ${payload.subject || '(none)'}`);
  lines.push(`Body: ${payload.body || '(none)'}`);

  if (errors.length) {
    lines.push('');
    lines.push('JSON errors:');
    errors.forEach((e) => lines.push(`- ${e}`));
  }

  if (entries.length) {
    lines.push('');
    lines.push('Preview sample:');
    lines.push(JSON.stringify(entries[0].data, null, 2));
  } else {
    lines.push('');
    lines.push('No structured entries detected.');
  }

  previewBox.textContent = lines.join('\n');

  try {
    await renderRealPreview(payload, entries);
  } catch (err) {
    previewStatusText.textContent = 'Preview failed.';
    realPreviewFrame.srcdoc = `
      <div style="padding:16px;font-family:sans-serif;color:#6b5b53;">
        <strong>Preview error:</strong> ${err.message || 'Could not render preview.'}
      </div>
    `;
  }
}

function disarmConfirm(message = 'Confirmation is locked until you arm it. Then a 3-second countdown will begin.') {
  armed = false;
  confirmBtn.disabled = true;
  countdownMessage.textContent = message;
  if (armTimer) {
    clearInterval(armTimer);
    armTimer = null;
  }
}

function armConfirm() {
  disarmConfirm('Arming confirmation...');
  let seconds = 3;
  countdownMessage.textContent = `Confirm available in ${seconds}...`;

  armTimer = setInterval(() => {
    seconds -= 1;
    if (seconds <= 0) {
      clearInterval(armTimer);
      armTimer = null;
      armed = true;
      confirmBtn.disabled = false;
      countdownMessage.textContent = 'Confirmed armed. Review everything, then click Confirm Push.';
      return;
    }
    countdownMessage.textContent = `Confirm available in ${seconds}...`;
  }, 1000);
}

async function confirmPush() {
  const analysis = await runAnalysis();
  if (!analysis.ok) {
    outputLog.textContent = formatOutputBlock('Push blocked by analysis.', [
      'Fix the issues shown in Bulk Analysis before confirming.'
    ]);
    return;
  }

  if (!armed) {
    outputLog.textContent = formatOutputBlock('Push not armed.', [
      'Click "Arm Confirm" and wait for the countdown to finish.'
    ]);
    return;
  }

  confirmBtn.disabled = true;
  armConfirmBtn.disabled = true;
  analyzeBtn.disabled = true;
  previewBtn.disabled = true;
  if (refreshRealPreviewBtn) refreshRealPreviewBtn.disabled = true;

  outputLog.textContent = formatOutputBlock('Submitting push request...', [
    `Mode: ${analysis.payload.mode}`,
    `Actions: ${Object.entries(analysis.payload.actions).filter(([, v]) => v).map(([k]) => k).join(', ') || 'none'}`,
    `Entries: ${analysis.entries.length}`
  ]);

  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      throw new Error(`Could not read auth session: ${sessionError.message || 'Unknown session error.'}`);
    }

    const accessToken = sessionData?.session?.access_token;
    if (!accessToken) {
      throw new Error('No active session token found.');
    }

    const requestBody = {
      mode: analysis.payload.mode,
      label: analysis.payload.label,
      subject: analysis.payload.subject,
      body: analysis.payload.body,
      actions: analysis.payload.actions,
      entries: analysis.entries.map((e) => e.data)
    };

    const response = await fetch('/.netlify/functions/push-dispatch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(requestBody)
    });

    const parsed = await parseResponseSafely(response);

    if (!parsed.ok) {
      outputLog.textContent = formatOutputBlock('Push failed.', [
        buildReadableErrorFromResponse(parsed)
      ]);
      throw new Error(
        parsed.json?.error ||
        parsed.json?.message ||
        parsed.rawText ||
        `Push request failed with status ${parsed.status}.`
      );
    }

    const successJson = parsed.json || {};
    outputLog.textContent = formatOutputBlock('Push completed successfully.', [
      `HTTP ${parsed.status} ${parsed.statusText || ''}`.trim(),
      parsed.rawText ? '' : 'No response body returned.',
      parsed.rawText ? JSON.stringify(successJson, null, 2) : ''
    ].filter(Boolean));

    disarmConfirm('Push request completed. Re-arm confirmation before sending another one.');
  } catch (err) {
    if (!String(outputLog.textContent || '').startsWith('Push failed.')) {
      outputLog.textContent = formatOutputBlock('Push failed.', [
        err.message || 'Unknown error.'
      ]);
    }
    disarmConfirm('Push failed. Re-arm confirmation before trying again.');
  } finally {
    armConfirmBtn.disabled = false;
    analyzeBtn.disabled = false;
    previewBtn.disabled = false;
    if (refreshRealPreviewBtn) refreshRealPreviewBtn.disabled = false;
  }
}

analyzeBtn?.addEventListener('click', runAnalysis);
previewBtn?.addEventListener('click', runPreview);
armConfirmBtn?.addEventListener('click', armConfirm);
confirmBtn?.addEventListener('click', confirmPush);

refreshRealPreviewBtn?.addEventListener('click', async () => {
  try {
    await runPreview();
  } catch (err) {
    outputLog.textContent = formatOutputBlock('Could not refresh preview.', [
      err.message || 'Unknown preview refresh error.'
    ]);
  }
});

entryModeInputs.forEach((input) => {
  input.addEventListener('change', () => {
    disarmConfirm();
  });
});

[actionDaily, actionBlog, actionEmail, actionSms].forEach((el) => {
  el?.addEventListener('change', () => {
    disarmConfirm();
  });
});

[pushSubject, pushBody, pushJsonInput, pushRawLabel].forEach((el) => {
  el?.addEventListener('input', () => {
    disarmConfirm();
  });
});

pushJsonFile?.addEventListener('change', () => {
  disarmConfirm();
});

window.pushCenterInit = function pushCenterInit() {
  disarmConfirm();
};