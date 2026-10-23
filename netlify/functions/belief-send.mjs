// POST /reflection/belief-send  { email, first_name, theme ('general' or a theme id), company (honeypot) }
// Starts The Belief Project's seven-day email path and sends a welcome email right away.
// No answers, notes or prayers are ever sent here: only an email, optional first name and optional starting theme.
import { json, isEmail, FROM, sendEmail } from '../shared/daily-list.js';
import { beliefWelcomeEmail, cleanBeliefFocus } from '../shared/belief-plan.js';
import { startPlan, planUnsubscribeUrl, unsubHeaders } from '../shared/reflection-list.js';

const RESEND_WAIT_MINUTES = 5; // don't email the same address again within this window

export default async (req) => {
  if (req.method !== 'POST') return json({ ok: false, error: 'Method not allowed' }, 405);

  let body = {};
  try { body = await req.json(); } catch { return json({ ok: false, error: 'Invalid request' }, 400); }

  if (String(body.company || '').trim()) return json({ ok: true }); // honeypot

  const email = String(body.email || '').trim().toLowerCase();
  const firstName = String(body.first_name || '').trim().slice(0, 60) || null;
  if (!isEmail(email)) return json({ ok: false, error: 'Please enter a valid email address.' }, 400);
  const focusKey = cleanBeliefFocus(body.theme);

  try {
    const now = new Date();
    const { row, previousUpdatedAt } = await startPlan({ email, firstName, focusKey, now, tool: 'belief' });
    if (previousUpdatedAt && (now - new Date(previousUpdatedAt)) < RESEND_WAIT_MINUTES * 60 * 1000) {
      return json({ ok: true, repeat: true });
    }
    const unsub = planUnsubscribeUrl(row.unsub_token);
    const mail = beliefWelcomeEmail({ firstName, focusKey, unsubscribeUrl: unsub });
    await sendEmail('/emails', {
      from: FROM, to: [email], subject: mail.subject, html: mail.html, text: mail.text, headers: unsubHeaders(unsub)
    });
    return json({ ok: true });
  } catch (err) {
    console.error('belief-send failed:', err);
    return json({ ok: false, error: 'Something went wrong on our end. Please try again in a minute.' }, 500);
  }
};

export const config = { path: '/reflection/belief-send' };
