// Server-side logic for the 7-day email plans (Netlify functions only):
//   moments         → One Verse Man "Are You Missing Your Moments?" (table reflection_plans)
//   pattern-finder  → The Pattern Finder (table pattern_plans)
// Stores only: email, optional first name, focus area, and send progress. Never answers or scores.
import { db, FROM, sendEmail, newToken, centralNow } from './daily-list.js';
import { SITE_URL } from './daily-email.js';
import { dayEmail as momentsDay, TOTAL_DAYS as MOMENTS_DAYS } from './reflection-plan.js';
import { patternDayEmail, PATTERN_DAYS } from './pattern-plan.js';

export const PLANS = {
  moments: { table: 'reflection_plans', dayEmail: momentsDay, totalDays: MOMENTS_DAYS, source: 'one-verse-man', page: '/one-verse-man/diagnostic/' },
  'pattern-finder': { table: 'pattern_plans', dayEmail: patternDayEmail, totalDays: PATTERN_DAYS, source: 'pattern-finder', page: '/tools/pattern-finder/' }
};
export const PLAN_TABLE = PLANS.moments.table;
const SEND_FROM_HOUR = 6;   // plan emails go out from 6 am Central…
const SEND_UNTIL_HOUR = 12; // …until noon
const BATCH_SIZE = 100;

export function planUnsubscribeUrl(token) { return `${SITE_URL}/reflection/stop?token=${token}`; }

export function unsubHeaders(url) {
  return { 'List-Unsubscribe': `<${url}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' };
}

/** Whole days between two YYYY-MM-DD dates. */
export function daysBetween(fromDate, toDate) {
  return Math.round((Date.parse(`${toDate}T00:00:00Z`) - Date.parse(`${fromDate}T00:00:00Z`)) / 86400000);
}

/**
 * Create or restart a plan for this email. Returns the row (with unsub_token).
 * One active plan per email: retaking the reflection restarts the plan with the new focus.
 */
export async function startPlan({ email, firstName, focusKey, now = new Date(), tool = 'moments' }) {
  const plan = PLANS[tool];
  const supabase = db();
  const today = centralNow(now).date;
  const stamp = now.toISOString();
  const { data: existing, error: findErr } = await supabase.from(plan.table)
    .select('id, unsub_token, status, updated_at').eq('email', email).eq('status', 'active').maybeSingle();
  if (findErr) throw findErr;

  const fields = {
    first_name: firstName, focus_area: focusKey, started_on: today,
    last_day_sent: 0, last_sent_date: null, updated_at: stamp
  };
  if (existing) {
    const { data, error } = await supabase.from(plan.table).update(fields)
      .eq('id', existing.id).select('id, email, first_name, focus_area, unsub_token, updated_at').single();
    if (error) throw error;
    return { row: data, previousUpdatedAt: existing.updated_at };
  }
  const { data, error } = await supabase.from(plan.table)
    .insert({ email, ...fields, status: 'active', unsub_token: newToken(), source: plan.source })
    .select('id, email, first_name, focus_area, unsub_token, updated_at').single();
  if (error) throw error;
  return { row: data, previousUpdatedAt: null };
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

/**
 * Send each active plan its next day, once per day, from 6 am to noon Central.
 * Day N goes out N days after the plan started. Safe to run often: rows are claimed before sending.
 */
export async function sendPlanDays({ now = new Date(), tool = 'moments' } = {}) {
  const plan = PLANS[tool];
  const TOTAL_DAYS = plan.totalDays;
  const { date: today, hour } = centralNow(now);
  if (hour < SEND_FROM_HOUR || hour >= SEND_UNTIL_HOUR) {
    return { sent: 0, skipped: `Outside sending hours (${SEND_FROM_HOUR}:00–${SEND_UNTIL_HOUR}:00 Central).` };
  }
  const supabase = db();
  let sent = 0, failed = 0, finished = 0;

  for (let guard = 0; guard < 100; guard++) {
    const { data: pending, error: pickErr } = await supabase.from(plan.table)
      .select('id, started_on, last_day_sent')
      .eq('status', 'active')
      .lt('started_on', today)
      .or(`last_sent_date.is.null,last_sent_date.lt.${today}`)
      .order('id')
      .limit(BATCH_SIZE);
    if (pickErr) throw pickErr;
    if (!pending.length) break;

    // Claim them so a parallel run can't send the same day twice.
    const { data: claimed, error: claimErr } = await supabase.from(plan.table)
      .update({ last_sent_date: today, updated_at: new Date().toISOString() })
      .in('id', pending.map(r => r.id))
      .eq('status', 'active')
      .or(`last_sent_date.is.null,last_sent_date.lt.${today}`)
      .select('id, email, first_name, focus_area, unsub_token, last_day_sent, started_on');
    if (claimErr) throw claimErr;
    if (!claimed.length) continue;

    // One day per morning. If a morning was missed, the plan simply resumes the next morning.
    const due = claimed
      .map(r => ({ ...r, day: r.last_day_sent + 1 }))
      .filter(r => r.day <= TOTAL_DAYS && r.day <= daysBetween(r.started_on, today));

    if (due.length) {
      const emails = due.map(r => {
        const unsub = planUnsubscribeUrl(r.unsub_token);
        const mail = plan.dayEmail({ day: r.day, focusKey: r.focus_area, firstName: r.first_name, unsubscribeUrl: unsub });
        return { from: FROM, to: [r.email], subject: mail.subject, html: mail.html, text: mail.text, headers: unsubHeaders(unsub) };
      });
      try {
        await sendEmail('/emails/batch', emails);
        sent += due.length;
        // Record progress per day number (a batch can hold several day numbers).
        const byDay = new Map();
        for (const r of due) byDay.set(r.day, [...(byDay.get(r.day) || []), r.id]);
        for (const [day, ids] of byDay) {
          const doneFields = day >= TOTAL_DAYS ? { status: 'done' } : {};
          const { error } = await supabase.from(plan.table).update({ last_day_sent: day, ...doneFields }).in('id', ids);
          if (error) throw error;
          if (day >= TOTAL_DAYS) finished += ids.length;
        }
      } catch (err) {
        console.error('Plan batch failed:', err.message);
        failed += due.length;
        await supabase.from(plan.table).update({ last_sent_date: null }).in('id', due.map(r => r.id));
        break;
      }
      await sleep(600);
    }
  }

  const summary = { tool, date: today, sent, failed, finished };
  console.log('Plan run:', JSON.stringify(summary));
  return summary;
}
