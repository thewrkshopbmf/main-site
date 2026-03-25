const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO_OWNER = process.env.GITHUB_REPO_OWNER;
const GITHUB_REPO_NAME = process.env.GITHUB_REPO_NAME;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

function jsonResponse(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

function requireEnv(name, value) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
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

function getPrimaryScripture(entry) {
  if (!entry || typeof entry !== 'object') return null;

  if (typeof entry.verse_ref === 'string' && entry.verse_ref.trim()) {
    return {
      ref: entry.verse_ref.trim(),
      text: typeof entry.verse_text === 'string' ? entry.verse_text : ''
    };
  }

  if (Array.isArray(entry.scriptures) && entry.scriptures.length > 0) {
    const first = entry.scriptures[0];
    if (first && typeof first === 'object') {
      return {
        ref: typeof first.ref === 'string' ? first.ref.trim() : '',
        text: typeof first.text === 'string' ? first.text : ''
      };
    }
  }

  return null;
}

function isOldDailyShape(entry) {
  return Boolean(
    entry &&
    typeof entry === 'object' &&
    typeof entry.date === 'string' &&
    typeof entry.title === 'string' &&
    typeof entry.verse_ref === 'string' &&
    typeof entry.verse_text === 'string'
  );
}

function isNewDailyShape(entry) {
  return Boolean(
    entry &&
    typeof entry === 'object' &&
    typeof entry.date === 'string' &&
    typeof entry.title === 'string' &&
    Array.isArray(entry.scriptures) &&
    entry.scriptures.length > 0 &&
    Array.isArray(entry.sections) &&
    entry.sections.length > 0
  );
}

function dailyFilename(entry) {
  const date = entry.date || 'unknown-date';
  const primaryScripture = getPrimaryScripture(entry);
  const verse = slugify(primaryScripture?.ref || 'unknown-scripture');
  const title = slugify(entry.title || 'untitled');
  return `${date}_${verse}_${title}.json`;
}

function blogFilename(entry) {
  const date = entry.date || 'unknown-date';
  const title = slugify(entry.title || 'untitled');
  return `${date}_${title}.json`;
}

function validateDaily(entry) {
  if (!entry || typeof entry !== 'object') {
    return ['entry must be an object'];
  }

  if (isOldDailyShape(entry) || isNewDailyShape(entry)) {
    return [];
  }

  const missing = [];

  if (!('date' in entry) || !entry.date) missing.push('date');
  if (!('title' in entry) || !entry.title) missing.push('title');

  const hasOldVerse =
    typeof entry.verse_ref === 'string' &&
    entry.verse_ref.trim() &&
    typeof entry.verse_text === 'string';

  const hasNewScriptures =
    Array.isArray(entry.scriptures) &&
    entry.scriptures.length > 0 &&
    entry.scriptures[0] &&
    typeof entry.scriptures[0] === 'object' &&
    typeof entry.scriptures[0].ref === 'string' &&
    entry.scriptures[0].ref.trim() &&
    typeof entry.scriptures[0].text === 'string';

  const hasSections =
    Array.isArray(entry.sections) &&
    entry.sections.length > 0;

  if (!hasOldVerse && !hasNewScriptures) {
    missing.push('verse_ref+verse_text or scriptures[0].ref+scriptures[0].text');
  }

  if ('scriptures' in entry || 'sections' in entry) {
    if (!Array.isArray(entry.scriptures) || !entry.scriptures.length) {
      missing.push('scriptures');
    }
    if (!hasSections) {
      missing.push('sections');
    }
  }

  return missing;
}

function validateBlog(entry) {
  const required = ['date', 'title', 'body_html'];
  return required.filter((k) => !(k in entry));
}

function collectDateStats(entries) {
  const dates = entries
    .map((entry) => (entry && typeof entry.date === 'string' ? entry.date : null))
    .filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date))
    .sort();

  if (!dates.length) {
    return {
      count: entries.length,
      validDateCount: 0,
      startDate: null,
      endDate: null,
      rangeText: 'no valid dates detected'
    };
  }

  return {
    count: entries.length,
    validDateCount: dates.length,
    startDate: dates[0],
    endDate: dates[dates.length - 1],
    rangeText:
      dates[0] === dates[dates.length - 1]
        ? dates[0]
        : `${dates[0]} through ${dates[dates.length - 1]}`
  };
}

function countCreatedFilesByType(responseLog) {
  const counts = { daily: 0, blog: 0 };

  for (const item of responseLog.website_updates || []) {
    if (item?.ok === true && item?.type === 'daily') counts.daily += 1;
    if (item?.ok === true && item?.type === 'blog') counts.blog += 1;
  }

  return counts;
}

function selectedWebsiteTypes(actions) {
  const types = [];
  if (actions?.updateDaily) types.push('daily');
  if (actions?.updateBlog) types.push('blog');
  return types;
}

function selectedOutboundTypes(actions) {
  const types = [];
  if (actions?.sendSms) types.push('sms');
  if (actions?.sendEmail) types.push('email');
  return types;
}

function joinNatural(parts) {
  if (!parts.length) return '';
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[0]} + ${parts[1]}`;
  return `${parts.slice(0, -1).join(', ')}, and ${parts[parts.length - 1]}`;
}

function buildCreatedBreakdown(actions, responseLog) {
  const created = countCreatedFilesByType(responseLog);
  const parts = [];

  if (actions?.updateDaily) parts.push(`${created.daily} daily file(s) created`);
  if (actions?.updateBlog) parts.push(`${created.blog} blog file(s) created`);

  if (!parts.length) return 'No website files were created.';
  return parts.join(' and ') + '.';
}

function buildOutboundBreakdown(responseLog) {
  const outbound = responseLog.outbound || [];
  if (!outbound.length) return 'No outbound jobs requested.';

  const parts = outbound.map((item) => {
    if (item.type === 'sms') {
      return `SMS: ${item.queued || 0} queued, ${item.eligible || 0} eligible, ${item.skipped || 0} skipped`;
    }
    if (item.type === 'email') {
      return `Email: ${item.queued || 0} queued, ${item.eligible || 0} eligible, ${item.skipped || 0} skipped`;
    }
    return `${item.type}: processed`;
  });

  return parts.join(' | ');
}

function buildTopLevelMessage(mode, entries, actions, responseLog) {
  const stats = collectDateStats(entries);

  const websiteTypes = selectedWebsiteTypes(actions);
  const outboundTypes = selectedOutboundTypes(actions);

  const websiteRequested = websiteTypes.length > 0;
  const outboundRequested = outboundTypes.length > 0;

  const websiteText = joinNatural(websiteTypes);
  const outboundTextLabel = joinNatural(outboundTypes);
  const outboundBreakdown = outboundRequested ? ` ${buildOutboundBreakdown(responseLog)}.` : '';
  const createdBreakdown = websiteRequested ? ` ${buildCreatedBreakdown(actions, responseLog)}` : '';

  if ((mode || 'single') === 'bulk') {
    if (websiteRequested && outboundRequested) {
      if (stats.validDateCount > 0) {
        return `Bulk ${websiteText} + ${outboundTextLabel} push completed for ${stats.count} submitted entries covering ${stats.rangeText}.${createdBreakdown}${outboundBreakdown}`;
      }
      return `Bulk ${websiteText} + ${outboundTextLabel} push completed for ${stats.count} submitted entries.${createdBreakdown}${outboundBreakdown}`;
    }

    if (websiteRequested) {
      if (stats.validDateCount > 0) {
        return `Bulk ${websiteText} push completed for ${stats.count} submitted entries covering ${stats.rangeText}.${createdBreakdown}${outboundBreakdown}`;
      }
      return `Bulk ${websiteText} push completed for ${stats.count} submitted entries.${createdBreakdown}${outboundBreakdown}`;
    }

    if (outboundRequested) {
      return `Bulk ${outboundTextLabel} push completed.${outboundBreakdown}`;
    }

    return 'Bulk push completed.';
  }

  if (websiteRequested && entries.length === 1) {
    const entry = entries[0] || {};
    const labelParts = [];
    if (entry.date) labelParts.push(entry.date);
    if (entry.title) labelParts.push(entry.title);

    if (labelParts.length) {
      if (outboundRequested) {
        return `${websiteText.charAt(0).toUpperCase() + websiteText.slice(1)} + ${outboundTextLabel} push completed for ${labelParts.join(' — ')}.${createdBreakdown}${outboundBreakdown}`;
      }
      return `${websiteText.charAt(0).toUpperCase() + websiteText.slice(1)} push completed for ${labelParts.join(' — ')}.${createdBreakdown}${outboundBreakdown}`;
    }
  }

  if (websiteRequested && outboundRequested) {
    return `${websiteText.charAt(0).toUpperCase() + websiteText.slice(1)} + ${outboundTextLabel} push completed.${createdBreakdown}${outboundBreakdown}`;
  }

  if (websiteRequested) {
    return `${websiteText.charAt(0).toUpperCase() + websiteText.slice(1)} push completed.${createdBreakdown}${outboundBreakdown}`;
  }

  if (outboundRequested) {
    return `${outboundTextLabel.charAt(0).toUpperCase() + outboundTextLabel.slice(1)} push completed.${outboundBreakdown}`;
  }

  return 'Push completed.';
}

function normalizeSendAt(sendAt) {
  if (!sendAt) return new Date().toISOString();
  const d = new Date(sendAt);
  if (Number.isNaN(d.getTime())) {
    throw new Error('Invalid send_at value.');
  }
  return d.toISOString();
}

function isSmsEligible(contact) {
  if (contact?.active === false) return false;
  if (!contact?.phone_e164) return false;
  if (contact.sms_consent === true) return true;
  return contact.sms_consented_at == null;
}

function isEmailEligible(contact) {
  if (contact?.active === false) return false;
  if (!contact?.email) return false;
  if (contact.email_consent === true) return true;
  return contact.email_consented_at == null;
}

async function supabaseAuthGetUser(jwt) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    method: 'GET',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${jwt}`
    }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Invalid session: ${text}`);
  }

  return await res.json();
}

async function supabaseServiceSelect(table, query) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
    method: 'GET',
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      Accept: 'application/json'
    }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase select failed on ${table}: ${text}`);
  }

  return await res.json();
}

async function supabaseServiceInsert(table, rows, returnRepresentation = false) {
  const headers = {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json'
  };

  if (returnRepresentation) {
    headers.Prefer = 'return=representation';
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(rows)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase insert failed on ${table}: ${text}`);
  }

  if (returnRepresentation) {
    return await res.json();
  }

  return null;
}

async function verifyAdminFromBearer(authHeader) {
  requireEnv('SUPABASE_URL', SUPABASE_URL);
  requireEnv('SUPABASE_ANON_KEY', SUPABASE_ANON_KEY);
  requireEnv('SUPABASE_SERVICE_ROLE_KEY', SUPABASE_SERVICE_ROLE_KEY);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing bearer token.');
  }

  const jwt = authHeader.slice('Bearer '.length).trim();
  if (!jwt) {
    throw new Error('Missing bearer token.');
  }

  const user = await supabaseAuthGetUser(jwt);

  const profiles = await supabaseServiceSelect(
    'profiles',
    `select=role,email&id=eq.${encodeURIComponent(user.id)}&limit=1`
  );

  const profile = profiles[0];
  if (!profile || profile.role !== 'admin') {
    throw new Error('Admin access required.');
  }

  return { user, profile };
}

async function githubGetFile(filePath) {
  const url = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${filePath}?ref=${encodeURIComponent(GITHUB_BRANCH)}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json'
    }
  });

  if (res.status === 404) return null;

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub read failed for ${filePath}: ${text}`);
  }

  return await res.json();
}

async function githubCreateFile(filePath, contentObj, commitMessage) {
  requireEnv('GITHUB_TOKEN', GITHUB_TOKEN);
  requireEnv('GITHUB_REPO_OWNER', GITHUB_REPO_OWNER);
  requireEnv('GITHUB_REPO_NAME', GITHUB_REPO_NAME);

  const existing = await githubGetFile(filePath);
  if (existing) {
    return {
      ok: false,
      path: filePath,
      reason: 'exists',
      message: `Skipped ${filePath} because it already exists.`
    };
  }

  const content = Buffer.from(
    `${JSON.stringify(contentObj, null, 2)}\n`,
    'utf8'
  ).toString('base64');

  const url = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${filePath}`;

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: commitMessage,
      content,
      branch: GITHUB_BRANCH
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub write failed for ${filePath}: ${text}`);
  }

  return {
    ok: true,
    path: filePath,
    message: `Created ${filePath} successfully.`
  };
}

async function createPushMessage(channel, adminUserId, subject, body, mode) {
  const rows = await supabaseServiceInsert(
    'push_messages',
    [{
      channel,
      subject: subject || null,
      body: body || '',
      created_by: adminUserId,
      source: 'push-center',
      mode: mode || 'single'
    }],
    true
  );

  if (!rows || !rows.length) {
    throw new Error(`Failed to create push_messages row for channel ${channel}.`);
  }

  return rows[0];
}

async function queueSmsJobs(adminUserId, subject, body, contacts, mode, sendAtIso) {
  const withPhone = contacts.filter((c) => c.phone_e164);
  const eligible = withPhone.filter(isSmsEligible);
  const skipped = withPhone.length - eligible.length;

  if (!eligible.length) {
    return {
      queued: 0,
      eligible: 0,
      skipped,
      message_id: null,
      detail: 'No SMS jobs were queued because no active contacts with phone numbers were eligible under the consent/timestamp rules.'
    };
  }

  const messageRow = await createPushMessage('sms', adminUserId, subject, body, mode);

  const rows = eligible.map((contact) => ({
    message_id: messageRow.id,
    contact_id: contact.id,
    channel: 'sms',
    recipient_phone: contact.phone_e164,
    send_at: sendAtIso
  }));

  await supabaseServiceInsert('push_jobs', rows);

  return {
    queued: rows.length,
    eligible: eligible.length,
    skipped,
    message_id: messageRow.id,
    detail: `Queued ${rows.length} SMS job(s) successfully for the Mac Mini worker.`
  };
}

async function prepareEmailJobs(adminUserId, subject, body, contacts, mode, sendAtIso) {
  const withEmail = contacts.filter((c) => c.email);
  const eligible = withEmail.filter(isEmailEligible);
  const skipped = withEmail.length - eligible.length;

  if (!eligible.length) {
    return {
      queued: 0,
      eligible: 0,
      skipped,
      message_id: null,
      detail: 'No email jobs were prepared because no active contacts with email addresses were eligible under the consent/timestamp rules.'
    };
  }

  const messageRow = await createPushMessage('email', adminUserId, subject, body, mode);

  const rows = eligible.map((contact) => ({
    message_id: messageRow.id,
    contact_id: contact.id,
    channel: 'email',
    recipient_email: contact.email,
    send_at: sendAtIso
  }));

  await supabaseServiceInsert('push_jobs', rows);

  return {
    queued: rows.length,
    eligible: eligible.length,
    skipped,
    message_id: messageRow.id,
    detail: 'Email sending is not configured yet, but email jobs were created.'
  };
}

export default async (request) => {
  if (request.method !== 'POST') {
    return jsonResponse(405, { ok: false, error: 'Method not allowed.' });
  }

  try {
    const { user, profile } = await verifyAdminFromBearer(
      request.headers.get('authorization')
    );

    let body = {};
    try {
      body = await request.json();
    } catch {
      return jsonResponse(400, {
        ok: false,
        error: 'Request body must be valid JSON.'
      });
    }

    const {
      mode,
      label,
      subject,
      body: messageBody,
      send_at,
      actions,
      entries
    } = body;

    if (!actions || typeof actions !== 'object') {
      return jsonResponse(400, {
        ok: false,
        error: 'Missing actions.'
      });
    }

    const websiteRequested = Boolean(actions.updateDaily || actions.updateBlog);
    const outboundRequested = Boolean(actions.sendSms || actions.sendEmail);

    if (!websiteRequested && !outboundRequested) {
      return jsonResponse(400, {
        ok: false,
        error: 'No actions selected.'
      });
    }

    if (websiteRequested && (!Array.isArray(entries) || !entries.length)) {
      return jsonResponse(400, {
        ok: false,
        error: 'Entries are required for daily/blog updates.'
      });
    }

    const sendAtIso = normalizeSendAt(send_at);
    const safeEntries = Array.isArray(entries) ? entries : [];

    const responseLog = {
      admin_email: profile.email,
      mode: mode || 'single',
      label: label || null,
      send_at: sendAtIso,
      website_updates: [],
      outbound: []
    };

    if (actions.updateDaily) {
      for (const entry of safeEntries) {
        const missing = validateDaily(entry);

        if (missing.length) {
          responseLog.website_updates.push({
            type: 'daily',
            ok: false,
            reason: `missing fields: ${missing.join(', ')}`,
            message: `Daily entry skipped because it is missing: ${missing.join(', ')}.`
          });
          continue;
        }

        const filename = dailyFilename(entry);
        const filePath = `content/daily/${filename}`;
        const result = await githubCreateFile(
          filePath,
          entry,
          `Add daily content: ${entry.date} ${entry.title}`
        );

        responseLog.website_updates.push({
          type: 'daily',
          ...result
        });
      }
    }

    if (actions.updateBlog) {
      for (const entry of safeEntries) {
        const missing = validateBlog(entry);

        if (missing.length) {
          responseLog.website_updates.push({
            type: 'blog',
            ok: false,
            reason: `missing fields: ${missing.join(', ')}`,
            message: `Blog entry skipped because it is missing: ${missing.join(', ')}.`
          });
          continue;
        }

        const filename = blogFilename(entry);
        const filePath = `content/blog/${filename}`;
        const result = await githubCreateFile(
          filePath,
          entry,
          `Add blog content: ${entry.date} ${entry.title}`
        );

        responseLog.website_updates.push({
          type: 'blog',
          ...result
        });
      }
    }

    if (actions.sendSms) {
      const contacts = await supabaseServiceSelect(
        'contacts',
        'select=id,active,phone_e164,sms_consent,sms_consented_at'
      );

      const smsResult = await queueSmsJobs(
        user.id,
        subject || null,
        messageBody || '',
        contacts || [],
        mode || 'single',
        sendAtIso
      );

      responseLog.outbound.push({
        type: 'sms',
        ok: true,
        ...smsResult
      });
    }

    if (actions.sendEmail) {
      const contacts = await supabaseServiceSelect(
        'contacts',
        'select=id,active,email,email_consent,email_consented_at'
      );

      const emailResult = await prepareEmailJobs(
        user.id,
        subject || null,
        messageBody || '',
        contacts || [],
        mode || 'single',
        sendAtIso
      );

      responseLog.outbound.push({
        type: 'email',
        ok: false,
        ...emailResult
      });
    }

    const createdCounts = countCreatedFilesByType(responseLog);

    const summary = {
      submitted_entries: safeEntries.length,
      ...collectDateStats(safeEntries),
      created_daily_file_count: createdCounts.daily,
      created_blog_file_count: createdCounts.blog,
      send_at: sendAtIso
    };

    return jsonResponse(200, {
      ok: true,
      message: buildTopLevelMessage(mode, safeEntries, actions, responseLog),
      summary,
      result: responseLog
    });
  } catch (err) {
    return jsonResponse(500, {
      ok: false,
      error: err.message || 'Unexpected error.',
      details: err.stack || null
    });
  }
};