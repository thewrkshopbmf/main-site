// Shared server-side logic for The Daily email list (Netlify functions only).
import { randomBytes } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { SITE_URL, dailyEmail, confirmEmail } from './daily-email.js';

export { SITE_URL };

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RAW_FROM = process.env.DAILY_FROM_EMAIL || process.env.RESEND_FROM_EMAIL || '';
export const FROM = RAW_FROM.includes('<') ? RAW_FROM : `TheWrkShop <${RAW_FROM}>`;
export const TABLE = 'daily_subscribers';
const SENDS_TABLE = 'daily_email_sends';
const BATCH_SIZE = 100;          // Resend batch API maximum
const SEND_AT_MINUTES = 5 * 60 + 25; // emails go out from 5:30 am Central (5-minute grace for the scheduler)
const LATE_SEND_HOUR = 12;       // no Daily emails after noon Central

let _db = null;
export function __setDbForTests(fake) { _db = fake; }
export function db() {
  if (_db) return _db;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Email list is not configured (missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).');
  }
  if (!_db) {
    _db = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false }
    });
  }
  return _db;
}

export const newToken = () => randomBytes(24).toString('hex');
export const isToken = (t) => /^[a-f0-9]{48}$/.test(String(t || ''));
export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || '')) && String(v).length <= 254;

export function confirmUrl(token) { return `${SITE_URL}/email/confirm?token=${token}`; }
export function unsubscribeUrl(token) { return `${SITE_URL}/email/unsubscribe?token=${token}`; }

export function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });
}

export function html(body, status = 200) {
  return new Response(body, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' }
  });
}

// Today's date and hour in Chicago time.
export function centralNow(date = new Date()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
  }).formatToParts(date).map(p => [p.type, p.value]));
  return { date: `${parts.year}-${parts.month}-${parts.day}`, hour: Number(parts.hour), minute: Number(parts.minute) };
}

async function resend(path, payload) {
  if (!RESEND_API_KEY || !RAW_FROM) throw new Error('Resend is not configured (RESEND_API_KEY / RESEND_FROM_EMAIL).');
  const res = await fetch(`https://api.resend.com${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Resend ${res.status}: ${body.message || body.error || 'send failed'}`);
  return body;
}

// Send one email through Resend (used by other site functions, e.g. the group intake).
export { resend as sendEmail };

export async function sendConfirmation(sub) {
  const mail = confirmEmail({ firstName: sub.first_name, confirmUrl: confirmUrl(sub.confirm_token) });
  return resend('/emails', { from: FROM, to: [sub.email], subject: mail.subject, html: mail.html, text: mail.text });
}

// Fetch what's live on the site right now.
export async function fetchLiveDaily() {
  const res = await fetch(`${SITE_URL}/data/daily.json?t=${Date.now()}`, { headers: { 'Cache-Control': 'no-cache' } });
  if (!res.ok) throw new Error(`Could not load live daily.json (${res.status})`);
  return res.json();
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

/**
 * Email today's Daily to every active subscriber who hasn't received it yet.
 * Safe to call many times: each subscriber is "claimed" before sending, so nobody gets it twice.
 */
export async function sendTodaysDaily({ reason = 'manual', now = new Date(), live } = {}) {
  const { date: today, hour, minute } = centralNow(now);
  // Daily emails only go out between 5:30 am and noon Central.
  if (hour * 60 + minute < SEND_AT_MINUTES) {
    return { sent: 0, skipped: `Too early: The Daily emails go out at 5:30 am Central.` };
  }
  if (hour >= LATE_SEND_HOUR) {
    return { sent: 0, skipped: `Too late: no Daily emails after ${LATE_SEND_HOUR}:00 noon Central.` };
  }
  const daily = live || await fetchLiveDaily();

  if (!daily || daily.date !== today) {
    return { sent: 0, skipped: `No new Daily live for ${today} (live daily is ${daily && daily.date}).` };
  }

  const supabase = db();
  const { data: run } = await supabase.from(SENDS_TABLE).select('send_date, recipients').eq('send_date', today).maybeSingle();


  const url = daily.href ? `${SITE_URL}${daily.href}` : `${SITE_URL}/daily.html`;
  let sent = 0, failed = 0, firstSentAt = run?.recipients ? null : new Date().toISOString();

  for (let guard = 0; guard < 200; guard++) {
    // Pick the next group of people who still need today's email…
    const { data: pending, error: pickErr } = await supabase.from(TABLE)
      .select('id')
      .eq('status', 'active')
      .or(`last_sent_date.is.null,last_sent_date.lt.${today}`)
      .order('id')
      .limit(BATCH_SIZE);
    if (pickErr) throw pickErr;
    if (!pending.length) break;

    // …and claim them, so a second run at the same moment can't send to them too.
    const { data: claimed, error: claimErr } = await supabase.from(TABLE)
      .update({ last_sent_date: today, updated_at: new Date().toISOString() })
      .in('id', pending.map(p => p.id))
      .eq('status', 'active')
      .or(`last_sent_date.is.null,last_sent_date.lt.${today}`)
      .select('id, email, first_name, unsub_token');
    if (claimErr) throw claimErr;
    if (!claimed.length) continue;

    const emails = claimed.map(sub => {
      const unsub = unsubscribeUrl(sub.unsub_token);
      const mail = dailyEmail(daily, { url, unsubscribeUrl: unsub });
      return {
        from: FROM,
        to: [sub.email],
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
        headers: {
          'List-Unsubscribe': `<${unsub}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
        }
      };
    });

    try {
      await resend('/emails/batch', emails);
      sent += claimed.length;
    } catch (err) {
      console.error('Daily batch failed:', err.message);
      failed += claimed.length;
      // Release the claim so a later run retries these people.
      await supabase.from(TABLE).update({ last_sent_date: null }).in('id', claimed.map(c => c.id));
      break;
    }
    await sleep(600); // stay under Resend's rate limit
  }

  if (sent || failed) {
    const row = {
      send_date: today,
      daily_title: [daily.title, daily.subtitle].filter(Boolean).join(' — '),
      recipients: (run?.recipients || 0) + sent,
      last_sent_at: new Date().toISOString()
    };
    if (firstSentAt) row.first_sent_at = firstSentAt;
    const { data: prev } = await supabase.from(SENDS_TABLE).select('failures').eq('send_date', today).maybeSingle();
    row.failures = (prev?.failures || 0) + failed;
    await supabase.from(SENDS_TABLE).upsert(row, { onConflict: 'send_date' });
  }

  const summary = { reason, date: today, sent, failed };
  console.log('Daily email run:', JSON.stringify(summary));
  return summary;
}
