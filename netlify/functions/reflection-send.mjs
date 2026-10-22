// POST /reflection/send  { email, first_name, scores: {area: 5–25}, focus, next_step, company (honeypot) }
// Emails a man his "Are You Missing Your Moments?" results right away and starts his 7-day plan.
// Scores and the next step are used to write this one email and are never stored.
import { json, isEmail, FROM, sendEmail } from '../shared/daily-list.js';
import { cleanScores, resultsEmail } from '../shared/reflection-plan.js';
import { startPlan, planUnsubscribeUrl, unsubHeaders } from '../shared/reflection-list.js';

const RESEND_WAIT_MINUTES = 5; // don't email the same address again within this window

export default async (req) => {
  if (req.method !== 'POST') return json({ ok: false, error: 'Method not allowed' }, 405);

  let body = {};
  try { body = await req.json(); } catch { return json({ ok: false, error: 'Invalid request' }, 400); }

  // Bots fill every field; people never see this one.
  if (String(body.company || '').trim()) return json({ ok: true });

  const email = String(body.email || '').trim().toLowerCase();
  const firstName = String(body.first_name || '').trim().slice(0, 60) || null;
  const nextStep = String(body.next_step || '').trim().slice(0, 800);
  if (!isEmail(email)) return json({ ok: false, error: 'Please enter a valid email address.' }, 400);

  const result = cleanScores(body.scores, String(body.focus || ''));
  if (!result) return json({ ok: false, error: 'Your results were incomplete. Please finish all seven areas and try again.' }, 400);

  try {
    const now = new Date();
    const { row, previousUpdatedAt } = await startPlan({ email, firstName, focusKey: result.focusKey, now });

    if (previousUpdatedAt && (now - new Date(previousUpdatedAt)) < RESEND_WAIT_MINUTES * 60 * 1000) {
      // Already sent moments ago (double click or repeat submit): don't send again.
      return json({ ok: true, repeat: true });
    }

    const unsub = planUnsubscribeUrl(row.unsub_token);
    const mail = resultsEmail({ firstName, ...result, nextStep, unsubscribeUrl: unsub });
    await sendEmail('/emails', {
      from: FROM, to: [email], subject: mail.subject, html: mail.html, text: mail.text, headers: unsubHeaders(unsub)
    });
    return json({ ok: true });
  } catch (err) {
    console.error('reflection-send failed:', err);
    return json({ ok: false, error: 'Something went wrong on our end. Please try again in a minute.' }, 500);
  }
};

export const config = { path: '/reflection/send' };
