// POST /reflection/pattern-send  { email, first_name, scores: {pattern: 0–8}, pattern, follow: [i,i,i], company (honeypot) }
// Emails a man his Pattern Finder result right away and starts his 7-day plan.
// Scores and follow-up answers are used to write this one email and are never stored.
import { json, isEmail, FROM, sendEmail } from '../shared/daily-list.js';
import { cleanPatternResult, patternResultsEmail } from '../shared/pattern-plan.js';
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

  const result = cleanPatternResult(body);
  if (!result) return json({ ok: false, error: 'Your results were incomplete. Please finish the Pattern Finder and try again.' }, 400);

  try {
    const now = new Date();
    const { row, previousUpdatedAt } = await startPlan({ email, firstName, focusKey: result.focusId, now, tool: 'pattern-finder' });
    if (previousUpdatedAt && (now - new Date(previousUpdatedAt)) < RESEND_WAIT_MINUTES * 60 * 1000) {
      return json({ ok: true, repeat: true });
    }
    const unsub = planUnsubscribeUrl(row.unsub_token);
    const mail = patternResultsEmail({ firstName, ...result, unsubscribeUrl: unsub });
    await sendEmail('/emails', {
      from: FROM, to: [email], subject: mail.subject, html: mail.html, text: mail.text, headers: unsubHeaders(unsub)
    });
    return json({ ok: true });
  } catch (err) {
    console.error('pattern-send failed:', err);
    return json({ ok: false, error: 'Something went wrong on our end. Please try again in a minute.' }, 500);
  }
};

export const config = { path: '/reflection/pattern-send' };
