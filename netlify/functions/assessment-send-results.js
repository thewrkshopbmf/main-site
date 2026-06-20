import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { buildResultsEmailHtml, buildShareSummary } from '../../assessment-summary.js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL;
const TABLE_NAME = 'assessment_attempts';

const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

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

function isValidEmail(value = '') {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
}

export default async (request) => {
  if (request.method !== 'POST') {
    return json({ ok: false, error: 'Method not allowed' }, 405);
  }

  if (!supabase) {
    return json({ ok: false, error: 'Missing Supabase function environment variables.' }, 500);
  }

  if (!resend || !RESEND_FROM_EMAIL) {
    return json({ ok: false, error: 'Missing Resend environment variables.' }, 500);
  }

  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return json({ ok: false, error: 'Invalid JSON body' }, 400);
    }

    const attempt_id = body.attempt_id || '';
    const assessment_slug = cleanSlug(body.assessment_slug || '');
    const email = String(body.email || '').trim();

    if (!isUuid(attempt_id)) {
      return json({ ok: false, error: 'Invalid attempt_id' }, 400);
    }

    if (!assessment_slug) {
      return json({ ok: false, error: 'assessment_slug is required' }, 400);
    }

    if (!isValidEmail(email)) {
      return json({ ok: false, error: 'A valid email is required' }, 400);
    }

    const { data: attempt, error: attemptError } = await supabase
      .from(TABLE_NAME)
      .select('attempt_id, assessment_slug, result_json, is_complete')
      .eq('attempt_id', attempt_id)
      .eq('assessment_slug', assessment_slug)
      .maybeSingle();

    if (attemptError) {
      return json({ ok: false, error: attemptError.message }, 500);
    }

    if (!attempt || !attempt.is_complete || !attempt.result_json?.normalized) {
      return json({ ok: false, error: 'Completed saved results were not found for this attempt.' }, 404);
    }

    const results = attempt.result_json.normalized;
    const text = buildShareSummary(results);
    const html = buildResultsEmailHtml(results);

    const { data: emailData, error: emailError } = await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: [email],
      subject: 'Your TheWrkShop Spiritual Gifts Results',
      text,
      html
    });

    if (emailError) {
      return json({ ok: false, error: emailError.message || 'Resend email failed' }, 502);
    }

    const { error: updateError } = await supabase
      .from(TABLE_NAME)
      .update({
        result_email: email,
        result_email_sent_at: new Date().toISOString(),
        result_email_message_id: emailData?.id || null
      })
      .eq('attempt_id', attempt_id)
      .eq('assessment_slug', assessment_slug);

    if (updateError) {
      return json({ ok: false, error: updateError.message }, 500);
    }

    return json({ ok: true, message_id: emailData?.id || null });
  } catch (error) {
    return json({ ok: false, error: error.message || 'Unknown error' }, 500);
  }
};
