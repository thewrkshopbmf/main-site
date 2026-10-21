// POST /groups/apply  — the "Get known" intake form on /get-known.html.
// Saves the answers, emails TheWrkShop, and sends the man a "what happens next" email.
import { db, json, sendEmail, FROM } from '../shared/daily-list.js';
import { TABLE, cleanIntake, applicantEmail, notifyEmail } from '../shared/group-intake.js';

const NOTIFY_TO = process.env.GROUP_INTAKE_NOTIFY_EMAIL || 'steven@thewrkshop.com';
const REPEAT_MINUTES = 10; // ignore a second submit from the same email this soon

export default async (req) => {
  if (req.method !== 'POST') return json({ ok: false, error: 'Method not allowed' }, 405);

  let body = {};
  try { body = await req.json(); } catch { return json({ ok: false, error: 'Invalid request' }, 400); }

  // Bots fill every field; people never see this one.
  if (String(body.company || '').trim()) return json({ ok: true });

  const cleaned = cleanIntake(body);
  if (!cleaned.ok) return json({ ok: false, error: cleaned.error }, 400);
  const row = cleaned.row;

  try {
    const supabase = db();
    const since = new Date(Date.now() - REPEAT_MINUTES * 60 * 1000).toISOString();
    const { data: recent, error: findErr } = await supabase.from(TABLE)
      .select('id').eq('email', row.email).gte('created_at', since).limit(1);
    if (findErr) throw findErr;
    if (recent && recent.length) return json({ ok: true });

    const { error } = await supabase.from(TABLE).insert(row);
    if (error) throw error;
  } catch (err) {
    console.error('group-apply save failed:', err);
    return json({ ok: false, error: 'Something went wrong on our end. Please try again in a minute.' }, 500);
  }

  // The answers are saved; email problems shouldn't fail the form.
  const notify = notifyEmail(row);
  const reply = applicantEmail(row);
  const results = await Promise.allSettled([
    sendEmail('/emails', { from: FROM, to: [NOTIFY_TO], reply_to: row.email, subject: notify.subject, html: notify.html, text: notify.text }),
    sendEmail('/emails', { from: FROM, to: [row.email], subject: reply.subject, html: reply.html, text: reply.text })
  ]);
  results.forEach(r => { if (r.status === 'rejected') console.error('group-apply email failed:', r.reason); });

  return json({ ok: true });
};

export const config = { path: '/groups/apply' };
