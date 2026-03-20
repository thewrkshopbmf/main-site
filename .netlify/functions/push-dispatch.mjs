const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO_OWNER = process.env.GITHUB_REPO_OWNER;
const GITHUB_REPO_NAME = process.env.GITHUB_REPO_NAME;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  };
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

function dailyFilename(entry) {
  const date = entry.date || 'unknown-date';
  const verse = slugify(entry.verse_ref || 'unknown-scripture');
  const title = slugify(entry.title || 'untitled');
  return `${date}_${verse}_${title}.json`;
}

function blogFilename(entry) {
  const date = entry.date || 'unknown-date';
  const title = slugify(entry.title || 'untitled');
  return `${date}_${title}.json`;
}

function validateDaily(entry) {
  const required = ['date', 'title', 'verse_ref', 'verse_text'];
  return required.filter((k) => !(k in entry));
}

function validateBlog(entry) {
  const required = ['date', 'title', 'body_html'];
  return required.filter((k) => !(k in entry));
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

async function githubGetFile(path) {
  const url = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${path}?ref=${encodeURIComponent(GITHUB_BRANCH)}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json'
    }
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub read failed for ${path}: ${text}`);
  }

  return await res.json();
}

async function githubCreateFile(path, contentObj, commitMessage) {
  requireEnv('GITHUB_TOKEN', GITHUB_TOKEN);
  requireEnv('GITHUB_REPO_OWNER', GITHUB_REPO_OWNER);
  requireEnv('GITHUB_REPO_NAME', GITHUB_REPO_NAME);

  const existing = await githubGetFile(path);
  if (existing) {
    return {
      ok: false,
      path,
      reason: 'exists',
      message: `Skipped ${path} because it already exists.`
    };
  }

  const content = Buffer.from(`${JSON.stringify(contentObj, null, 2)}\n`, 'utf8').toString('base64');

  const url = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${path}`;

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
    throw new Error(`GitHub write failed for ${path}: ${text}`);
  }

  return {
    ok: true,
    path,
    message: `Created ${path} successfully.`
  };
}

async function queueSmsJobs(adminUserId, subject, body, contacts, mode) {
  const eligible = contacts.filter((c) => c.phone_e164 && c.sms_consent === true);

  if (!eligible.length) {
    return {
      queued: 0,
      detail: 'No SMS jobs were queued because no contacts had both a phone number and SMS consent.'
    };
  }

  const rows = eligible.map((contact) => ({
    channel: 'sms',
    subject: subject || null,
    body: body || '',
    created_by: adminUserId,
    payload_json: {
      recipient_contact_id: contact.id,
      recipient_phone: contact.phone_e164,
      source: 'push-center',
      mode,
      delivery_adapter: 'imessage'
    }
  }));

  await supabaseServiceInsert('push_queue', rows);

  return {
    queued: rows.length,
    detail: `Queued ${rows.length} SMS job(s) successfully for the Mac Mini worker.`
  };
}

export default async (req) => {
  if (req.httpMethod !== 'POST') {
    return jsonResponse(405, { ok: false, error: 'Method not allowed.' });
  }

  try {
    const { user, profile } = await verifyAdminFromBearer(
      req.headers.authorization || req.headers.Authorization
    );

    const body = JSON.parse(req.body || '{}');
    const {
      mode,
      label,
      subject,
      body: messageBody,
      actions,
      entries
    } = body;

    if (!actions || typeof actions !== 'object') {
      return jsonResponse(400, {
        ok: false,
        error: 'Missing actions.'
      });
    }

    if (!Array.isArray(entries) || !entries.length) {
      return jsonResponse(400, {
        ok: false,
        error: 'No entries provided.'
      });
    }

    const responseLog = {
      admin_email: profile.email,
      mode: mode || 'single',
      label: label || null,
      website_updates: [],
      outbound: []
    };

    if (actions.updateDaily) {
      for (const entry of entries) {
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
        const path = `content/daily/${filename}`;
        const result = await githubCreateFile(
          path,
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
      for (const entry of entries) {
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
        const path = `content/blog/${filename}`;
        const result = await githubCreateFile(
          path,
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
        'select=id,phone_e164,sms_consent'
      );

      const smsResult = await queueSmsJobs(
        user.id,
        subject || null,
        messageBody || '',
        contacts || [],
        mode || 'single'
      );

      responseLog.outbound.push({
        type: 'sms',
        ok: true,
        ...smsResult
      });
    }

    if (actions.sendEmail) {
      responseLog.outbound.push({
        type: 'email',
        ok: false,
        detail: 'Email sending is not configured yet.',
        queued: 0
      });
    }

    return jsonResponse(200, {
      ok: true,
      message: 'Push dispatch completed.',
      result: responseLog
    });
  } catch (err) {
    return jsonResponse(500, {
      ok: false,
      error: err.message || 'Unexpected error.'
    });
  }
};