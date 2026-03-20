import { createClient } from '@supabase/supabase-js';

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
    headers: { 'Content-Type': 'application/json' },
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

  const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false }
  });

  const serviceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
  });

  const { data: userData, error: userError } = await anonClient.auth.getUser(jwt);
  if (userError || !userData?.user) {
    throw new Error('Invalid session.');
  }

  const user = userData.user;

  const { data: profile, error: profileError } = await serviceClient
    .from('profiles')
    .select('role, email')
    .eq('id', user.id)
    .single();

  if (profileError || !profile || profile.role !== 'admin') {
    throw new Error('Admin access required.');
  }

  return { user, profile, serviceClient };
}

async function githubGetFile(path) {
  const url = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(GITHUB_BRANCH)}`;

  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github+json'
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
      reason: 'exists'
    };
  }

  const content = Buffer.from(`${JSON.stringify(contentObj, null, 2)}\n`, 'utf8').toString('base64');

  const url = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${encodeURIComponent(path)}`;

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github+json',
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
    path
  };
}

async function queueOutboundJobs(serviceClient, adminUserId, payload, contacts) {
  // Assumes you create a push_jobs table later.
  // This function gracefully returns a summary if the table does not exist yet.
  const rows = [];

  if (payload.actions.sendEmail) {
    for (const contact of contacts.filter((c) => c.email && c.email_consent === true)) {
      rows.push({
        channel: 'email',
        recipient_contact_id: contact.id,
        recipient_email: contact.email,
        recipient_phone: null,
        subject: payload.subject,
        body: payload.body,
        status: 'queued',
        created_by: adminUserId,
        meta_json: {
          source: 'push-center',
          mode: payload.mode
        }
      });
    }
  }

  if (payload.actions.sendSms) {
    for (const contact of contacts.filter((c) => c.phone_e164 && c.sms_consent === true)) {
      rows.push({
        channel: 'sms',
        recipient_contact_id: contact.id,
        recipient_email: null,
        recipient_phone: contact.phone_e164,
        subject: payload.subject,
        body: payload.body,
        status: 'queued',
        created_by: adminUserId,
        meta_json: {
          source: 'push-center',
          mode: payload.mode,
          delivery_adapter: 'imessage'
        }
      });
    }
  }

  if (!rows.length) {
    return {
      queued: 0,
      detail: 'No eligible contact recipients found for selected send actions.'
    };
  }

  const { error } = await serviceClient.from('push_jobs').insert(rows);

  if (error) {
    return {
      queued: 0,
      detail: `push_jobs insert skipped/failed: ${error.message}`
    };
  }

  return {
    queued: rows.length,
    detail: 'Queued successfully.'
  };
}

export default async (req) => {
  if (req.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed.' });
  }

  try {
    const { user, profile, serviceClient } = await verifyAdminFromBearer(
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
      return jsonResponse(400, { error: 'Missing actions.' });
    }

    if (!Array.isArray(entries) || !entries.length) {
      return jsonResponse(400, { error: 'No entries provided.' });
    }

    const responseLog = {
      admin_email: profile.email,
      mode: mode || 'single',
      label: label || null,
      website_updates: [],
      outbound: null
    };

    if (actions.updateDaily) {
      for (const entry of entries) {
        const missing = validateDaily(entry);
        if (missing.length) {
          responseLog.website_updates.push({
            type: 'daily',
            ok: false,
            reason: `missing fields: ${missing.join(', ')}`
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
            reason: `missing fields: ${missing.join(', ')}`
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

    if (actions.sendEmail || actions.sendSms) {
      const { data: contacts, error: contactsError } = await serviceClient
        .from('contacts')
        .select('id, email, phone_e164, email_consent, sms_consent');

      if (contactsError) {
        throw new Error(`Could not load contacts: ${contactsError.message}`);
      }

      responseLog.outbound = await queueOutboundJobs(
        serviceClient,
        user.id,
        {
          mode: mode || 'single',
          subject: subject || null,
          body: messageBody || null,
          actions
        },
        contacts || []
      );
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