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
const pushSendTiming = document.getElementById('pushSendTiming');
const pushSendAt = document.getElementById('pushSendAt');
const pushScheduleGroup = document.getElementById('pushScheduleGroup');

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

function hasWebsiteActions(actions) {
  return Boolean(actions.updateDaily || actions.updateBlog);
}

function hasOutboundActions(actions) {
  return Boolean(actions.sendEmail || actions.sendSms);
}

function updateScheduleVisibility() {
  if (!pushScheduleGroup) return;
  pushScheduleGroup.hidden = pushSendTiming?.value !== 'schedule';
}

function getSendAtIso() {
  if (!pushSendTiming || pushSendTiming.value !== 'schedule') return null;
  const raw = pushSendAt?.value?.trim();
  if (!raw) return null;
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function formatDateHuman(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
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
    send_at: getSendAtIso(),
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

function escapeHtml(str) {
  return String(str || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
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

function buildOutboundPreviewHTML(payload) {
  const channels = [];
  if (payload.actions.sendSms) channels.push('SMS / iMessage');
  if (payload.actions.sendEmail) channels.push('Email');

  const subject = payload.subject || '(No subject)';
  const body = payload.body || '(No message body)';
  const label = payload.label || 'No header label';
  const channelText = channels.length ? channels.join(' + ') : 'Outbound message';
  const sendTimingText = payload.send_at
    ? `Scheduled for ${formatDateHuman(payload.send_at)}`
    : 'Send as soon as possible';

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Outbound Preview</title>
      <style>
        body {
          margin: 0;
          font-family: Arial, sans-serif;
          background: #f7f3ef;
          color: #2b211c;
          padding: 24px;
        }
        .wrap {
          max-width: 860px;
          margin: 0 auto;
        }
        .hero {
          background: linear-gradient(145deg, #5f493d 0%, #3e2c23 100%);
          color: #f4f1ee;
          border-radius: 20px;
          padding: 20px 22px;
          margin-bottom: 18px;
        }
        .eyebrow {
          display: inline-block;
          font-size: 12px;
          letter-spacing: .12em;
          text-transform: uppercase;
          opacity: .9;
          margin-bottom: 10px;
        }
        .card {
          background: #fff;
          border: 1px solid rgba(0,0,0,.08);
          border-radius: 18px;
          padding: 18px;
          box-shadow: 0 6px 18px rgba(0,0,0,.06);
          margin-bottom: 16px;
        }
        .meta {
          color: #6b5b53;
          font-size: 14px;
          margin-bottom: 10px;
        }
        .label {
          font-weight: 700;
          color: #3e2c23;
          margin-bottom: 6px;
        }
        .subject {
          font-size: 22px;
          font-weight: 700;
          color: #3e2c23;
          margin: 0 0 14px;
        }
        .body {
          white-space: pre-wrap;
          line-height: 1.65;
          color: #2b211c;
        }
        .pill {
          display: inline-block;
          background: #eadfd5;
          color: #3e2c23;
          border-radius: 999px;
          padding: 6px 10px;
          font-size: 12px;
          font-weight: 700;
          margin-right: 8px;
          margin-bottom: 8px;
        }
      </style>
    </head>
    <body>
      <div class="wrap">
        <div class="hero">
          <div class="eyebrow">Outbound Preview</div>
          <h1 style="margin:0;font-size:32px;">${escapeHtml(channelText)}</h1>
        </div>

        <div class="card">
          <div class="meta">
            <span class="pill">${escapeHtml(channelText)}</span>
            <span class="pill">${escapeHtml(payload.mode || 'single')}</span>
            <span class="pill">${escapeHtml(sendTimingText)}</span>
          </div>

          <div class="label">Optional Header Label</div>
          <div class="meta">${escapeHtml(label)}</div>

          <div class="label">Subject Line</div>
          <div class="subject">${escapeHtml(subject)}</div>

          <div class="label">Message Body</div>
          <div class="body">${escapeHtml(body)}</div>
        </div>
      </div>
    </body>
    </html>
  `;
}

async function renderRealPreview(payload = null, entries = null) {
  if (!realPreviewFrame) return;

  if (!payload || !entries) {
    payload = await collectPayload();
    ({ entries } = normalizeEntriesFromPayload(payload));
  }

  const websiteRequested = hasWebsiteActions(payload.actions);
  const outboundRequested = hasOutboundActions(payload.actions);

  if (!websiteRequested && outboundRequested) {
    previewTypeBadge.textContent = payload.actions.sendSms && payload.actions.sendEmail
      ? 'SMS + Email Preview'
      : payload.actions.sendSms
        ? 'SMS Preview'
        : 'Email Preview';

    previewStatusText.textContent = payload.send_at
      ? `Scheduled for ${formatDateHuman(payload.send_at)}`
      : (payload.subject || payload.body || 'Outbound-only preview');

    realPreviewFrame.srcdoc = buildOutboundPreviewHTML(payload);
    return;
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

  previewStatusText.textContent = `${entry.title || 'Untitled'}${entry.date ? ` • ${entry.date}` : ''}${payload.send_at ? ` • Scheduled ${formatDateHuman(payload.send_at)}` : ''}`;
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

  if (pushSendTiming?.value === 'schedule' && !payload.send_at) {
    bulkAnalysisBox.textContent = 'Choose a valid scheduled date and time.';
    return { ok: false };
  }

  const websiteRequested = hasWebsiteActions(actions);
  const outboundRequested = hasOutboundActions(actions);

  if (!websiteRequested && outboundRequested) {
    const lines = [];
    lines.push(`Mode: ${payload.mode}`);
    lines.push(`Timing: ${payload.send_at ? `scheduled for ${formatDateHuman(payload.send_at)}` : 'send now'}`);
    lines.push('Outbound-only push detected.');
    if (actions.sendSms) lines.push('SMS/iMessage delivery requested.');
    if (actions.sendEmail) lines.push('Email delivery requested.');
    lines.push(`Subject present: ${payload.subject ? 'yes' : 'no'}`);
    lines.push(`Body present: ${payload.body ? 'yes' : 'no'}`);
    lines.push('JSON is not required because no website update action is selected.');

    bulkAnalysisBox.textContent = lines.join('\n');

    return {
      ok: true,
      entries: [],
      payload
    };
  }

  const { errors, entries } = normalizeEntriesFromPayload(payload);

  const report = [];
  report.push(`Timing: ${payload.send_at ? `scheduled for ${formatDateHuman(payload.send_at)}` : 'send now'}`);

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

  if (outboundRequested) {
    report.push('Outbound delivery requested alongside website update.');
    report.push(`Subject present: ${payload.subject ? 'yes' : 'no'}`);
    report.push(`Body present: ${payload.body ? 'yes' : 'no'}`);
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
  const actions = payload.actions;
  const websiteRequested = hasWebsiteActions(actions);
  const outboundRequested = hasOutboundActions(actions);

  const { errors, entries } = normalizeEntriesFromPayload(payload);

  const lines = [];
  lines.push(`Actions: ${Object.entries(payload.actions).filter(([, v]) => v).map(([k]) => k).join(', ') || 'none'}`);
  lines.push(`Mode: ${payload.mode}`);
  lines.push(`Timing: ${payload.send_at ? `scheduled for ${formatDateHuman(payload.send_at)}` : 'send now'}`);
  lines.push(`Subject: ${payload.subject || '(none)'}`);
  lines.push(`Body: ${payload.body || '(none)'}`);

  if (!websiteRequested && outboundRequested) {
    lines.push('');
    lines.push('Outbound-only preview:');
    lines.push(payload.actions.sendSms ? '- SMS/iMessage selected' : '- SMS/iMessage not selected');
    lines.push(payload.actions.sendEmail ? '- Email selected' : '- Email not selected');
    lines.push('- JSON not required for outbound-only mode.');
  } else {
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
  }

  previewBox.textContent = lines.join('\n');

  try {
    await renderRealPreview(payload, websiteRequested ? entries : []);
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
    `Timing: ${analysis.payload.send_at ? `scheduled for ${formatDateHuman(analysis.payload.send_at)}` : 'send now'}`,
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
      send_at: analysis.payload.send_at,
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

pushSendTiming?.addEventListener('change', () => {
  updateScheduleVisibility();
  disarmConfirm();
});

pushSendAt?.addEventListener('input', () => {
  disarmConfirm();
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
  updateScheduleVisibility();
  disarmConfirm();
};