import { supabase } from '../scripts/supabase/supabaseClient.js';

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

let armed = false;
let armTimer = null;

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

function slugify(str) {
  return (str || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['"]/g, '')
    .replace(/[^A-Za-z0-9\s:–—-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[:–—]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
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
    report.push(`Mode: bulk`);
    report.push(`Entries detected: ${entries.length}`);
    report.push(analyzeDateRanges(entries));
  } else {
    report.push(`Mode: single`);
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
    outputLog.textContent = 'Fix analysis issues before confirming.';
    return;
  }

  if (!armed) {
    outputLog.textContent = 'You must arm confirmation first.';
    return;
  }

  confirmBtn.disabled = true;
  armConfirmBtn.disabled = true;
  analyzeBtn.disabled = true;
  previewBtn.disabled = true;

  outputLog.textContent = 'Submitting push request...';

  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData?.session?.access_token;

    if (!accessToken) {
      throw new Error('No active session token found.');
    }

    const response = await fetch('/.netlify/functions/push-dispatch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        mode: analysis.payload.mode,
        label: analysis.payload.label,
        subject: analysis.payload.subject,
        body: analysis.payload.body,
        actions: analysis.payload.actions,
        entries: analysis.entries.map((e) => e.data)
      })
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.error || 'Push request failed.');
    }

    outputLog.textContent = JSON.stringify(result, null, 2);
    disarmConfirm('Push request completed. Re-arm confirmation before sending another one.');
  } catch (err) {
    outputLog.textContent = err.message || 'Push request failed.';
    disarmConfirm('Push failed. Re-arm confirmation before trying again.');
  } finally {
    armConfirmBtn.disabled = false;
    analyzeBtn.disabled = false;
    previewBtn.disabled = false;
  }
}

analyzeBtn?.addEventListener('click', runAnalysis);
previewBtn?.addEventListener('click', runPreview);
armConfirmBtn?.addEventListener('click', armConfirm);
confirmBtn?.addEventListener('click', confirmPush);

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