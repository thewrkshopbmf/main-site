import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TABLE_NAME = 'assessment_attempts';

const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store'
    }
  });
}

function isUuid(value = '') {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value));
}

function cleanSlug(value = '') {
  return String(value).trim().toLowerCase();
}

function normalizeAnswers(input) {
  const clean = {};

  Object.entries(input || {}).forEach(([key, value]) => {
    const numericKey = Number(key);
    const numericValue = Number(value);
    if (Number.isInteger(numericKey) && numericKey >= 0 && numericKey < 72 && numericValue >= 1 && numericValue <= 5) {
      clean[numericKey] = numericValue;
    }
  });

  return clean;
}

function normalizeResult(input) {
  if (!input || typeof input !== 'object') return null;
  const normalized = input.normalized;
  if (!normalized || typeof normalized !== 'object') return null;

  const clean = {};
  Object.entries(normalized).forEach(([key, value]) => {
    const score = Number(value);
    if (/^[a-z]+$/i.test(key) && Number.isFinite(score) && score >= 0 && score <= 100) {
      clean[key] = Math.round(score);
    }
  });

  if (!Object.keys(clean).length) return null;
  return { normalized: clean };
}

function validateBase({ attempt_id, assessment_slug }) {
  if (!isUuid(attempt_id)) {
    return 'Invalid attempt_id';
  }

  if (!cleanSlug(assessment_slug)) {
    return 'assessment_slug is required';
  }

  return '';
}

export default async (request) => {
  if (!supabase) {
    return json(
      {
        ok: false,
        error: 'Missing Supabase function environment variables: SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY'
      },
      500
    );
  }

  try {
    if (request.method === 'GET') {
      const url = new URL(request.url);
      const attempt_id = url.searchParams.get('attempt_id') || '';
      const assessment_slug = cleanSlug(url.searchParams.get('assessment_slug') || '');
      const validationError = validateBase({ attempt_id, assessment_slug });
      if (validationError) {
        return json({ ok: false, error: validationError }, 400);
      }

      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('attempt_id, assessment_slug, answers_json, result_json, is_complete, result_email, result_email_sent_at, result_email_message_id, created_at, updated_at')
        .eq('attempt_id', attempt_id)
        .eq('assessment_slug', assessment_slug)
        .maybeSingle();

      if (error) {
        return json({ ok: false, error: error.message }, 500);
      }

      return json({ ok: true, attempt: data || null });
    }

    if (request.method === 'PUT') {
      const body = await request.json().catch(() => null);
      if (!body || typeof body !== 'object') {
        return json({ ok: false, error: 'Invalid JSON body' }, 400);
      }

      const attempt_id = body.attempt_id || '';
      const assessment_slug = cleanSlug(body.assessment_slug || '');
      const validationError = validateBase({ attempt_id, assessment_slug });
      if (validationError) {
        return json({ ok: false, error: validationError }, 400);
      }

      const answers_json = normalizeAnswers(body.answers_json);
      const result_json = normalizeResult(body.result_json);
      const is_complete = Boolean(body.is_complete);

      if (!Object.keys(answers_json).length && !is_complete) {
        return json({ ok: false, error: 'answers_json is required for an in-progress attempt' }, 400);
      }

      const payload = {
        attempt_id,
        assessment_slug,
        answers_json,
        result_json,
        is_complete,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from(TABLE_NAME)
        .upsert(payload, { onConflict: 'attempt_id,assessment_slug' })
        .select('attempt_id, assessment_slug, answers_json, result_json, is_complete, result_email, result_email_sent_at, result_email_message_id, created_at, updated_at')
        .single();

      if (error) {
        return json({ ok: false, error: error.message }, 500);
      }

      return json({ ok: true, attempt: data });
    }

    return json({ ok: false, error: 'Method not allowed' }, 405);
  } catch (error) {
    return json({ ok: false, error: error.message || 'Unknown error' }, 500);
  }
};
