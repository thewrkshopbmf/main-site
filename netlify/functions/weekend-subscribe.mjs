// POST /email/weekend/subscribe  { email, first_name, also_daily, company (honeypot), source }
// Adds a man to the Weekend 4-3-2-1 list as "pending" and emails him a confirmation link.
import { db, TABLE, json, isEmail, newToken, sendConfirmation } from '../shared/weekend-list.js';

const RESEND_WAIT_MINUTES = 10;

export default async (req) => {
  if (req.method !== 'POST') return json({ ok: false, error: 'Method not allowed' }, 405);

  let body = {};
  try { body = await req.json(); } catch { return json({ ok: false, error: 'Invalid request' }, 400); }
  if (String(body.company || '').trim()) return json({ ok: true, status: 'pending' }); // bots

  const email = String(body.email || '').trim().toLowerCase();
  const firstName = String(body.first_name || '').trim().slice(0, 60) || null;
  const wantsDaily = body.also_daily === true || body.also_daily === 'on' || body.also_daily === 'true';
  if (!isEmail(email)) return json({ ok: false, error: 'Please enter a valid email address.' }, 400);

  try {
    const supabase = db();
    const { data: existing, error: findErr } = await supabase.from(TABLE)
      .select('id, first_name, status, wants_daily, confirm_token, confirm_sent_at').eq('email', email).maybeSingle();
    if (findErr) throw findErr;

    if (existing?.status === 'active' && !wantsDaily) {
      return json({ ok: true, status: 'active', message: "You're already on the list. The next 4-3-2-1 will come to your inbox Friday." });
    }

    const now = new Date();
    let sub;
    if (existing) {
      const recentlySent = existing.confirm_sent_at &&
        (now - new Date(existing.confirm_sent_at)) < RESEND_WAIT_MINUTES * 60 * 1000;
      if (existing.status === 'pending' && recentlySent && existing.wants_daily === wantsDaily) {
        return json({ ok: true, status: 'pending' });
      }
      const { data, error } = await supabase.from(TABLE).update({
        status: existing.status === 'active' ? 'active' : 'pending',
        first_name: firstName || existing.first_name,
        wants_daily: wantsDaily || existing.wants_daily,
        confirm_token: existing.status === 'unsubscribed' ? newToken() : existing.confirm_token,
        confirm_sent_at: now.toISOString(),
        updated_at: now.toISOString()
      }).eq('id', existing.id).select('email, first_name, wants_daily, confirm_token').single();
      if (error) throw error;
      sub = data;
    } else {
      const { data, error } = await supabase.from(TABLE).insert({
        email, first_name: firstName, status: 'pending', wants_daily: wantsDaily,
        confirm_token: newToken(), unsub_token: newToken(),
        source: String(body.source || 'blog').slice(0, 40),
        confirm_sent_at: now.toISOString()
      }).select('email, first_name, wants_daily, confirm_token').single();
      if (error) throw error;
      sub = data;
    }

    await sendConfirmation(sub);
    return json({ ok: true, status: 'pending' });
  } catch (err) {
    console.error('weekend-subscribe failed:', err);
    return json({ ok: false, error: 'Something went wrong. Please try again in a minute.' }, 500);
  }
};

export const config = { path: '/email/weekend/subscribe' };
