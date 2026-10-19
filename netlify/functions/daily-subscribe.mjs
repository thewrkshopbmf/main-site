// POST /email/subscribe  { email, first_name, company (honeypot) }
// Adds a man to The Daily list as "pending" and emails him a confirmation link.
import { db, TABLE, json, isEmail, newToken, sendConfirmation } from '../shared/daily-list.js';

const RESEND_WAIT_MINUTES = 10; // don't re-send a confirmation to the same address more often than this

export default async (req) => {
  if (req.method !== 'POST') return json({ ok: false, error: 'Method not allowed' }, 405);

  let body = {};
  try { body = await req.json(); } catch { return json({ ok: false, error: 'Invalid request' }, 400); }

  // Bots fill every field; people never see this one.
  if (String(body.company || '').trim()) return json({ ok: true, status: 'pending' });

  const email = String(body.email || '').trim().toLowerCase();
  const firstName = String(body.first_name || '').trim().slice(0, 60) || null;
  if (!isEmail(email)) return json({ ok: false, error: 'Please enter a valid email address.' }, 400);

  try {
    const supabase = db();
    const { data: existing, error: findErr } = await supabase.from(TABLE)
      .select('id, email, first_name, status, confirm_token, confirm_sent_at')
      .eq('email', email).maybeSingle();
    if (findErr) throw findErr;

    if (existing?.status === 'active') {
      return json({ ok: true, status: 'active', message: "You're already on the list. The next Daily will come to your inbox." });
    }

    const now = new Date();
    let sub;

    if (existing) {
      const recentlySent = existing.confirm_sent_at &&
        (now - new Date(existing.confirm_sent_at)) < RESEND_WAIT_MINUTES * 60 * 1000;
      if (existing.status === 'pending' && recentlySent) {
        return json({ ok: true, status: 'pending' });
      }
      const { data, error } = await supabase.from(TABLE).update({
        status: 'pending',
        first_name: firstName || existing.first_name,
        confirm_token: existing.status === 'pending' ? existing.confirm_token : newToken(),
        confirm_sent_at: now.toISOString(),
        updated_at: now.toISOString()
      }).eq('id', existing.id).select('email, first_name, confirm_token').single();
      if (error) throw error;
      sub = data;
    } else {
      const { data, error } = await supabase.from(TABLE).insert({
        email,
        first_name: firstName,
        status: 'pending',
        confirm_token: newToken(),
        unsub_token: newToken(),
        source: String(body.source || 'daily-page').slice(0, 40),
        confirm_sent_at: now.toISOString()
      }).select('email, first_name, confirm_token').single();
      if (error) throw error;
      sub = data;
    }

    await sendConfirmation(sub);
    return json({ ok: true, status: 'pending' });
  } catch (err) {
    console.error('daily-subscribe failed:', err);
    return json({ ok: false, error: 'Something went wrong on our end. Please try again in a minute.' }, 500);
  }
};

export const config = { path: '/email/subscribe' };
