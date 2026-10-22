// /reflection/stop?token=…
//  GET  → page with a "Stop the plan" button (so email link-scanners can't stop it by accident)
//  POST → stops the plan. Also handles one-click unsubscribe from Gmail / Apple Mail.
import { db, html, isToken } from '../shared/daily-list.js';
import { simplePage, escapeHtml } from '../shared/daily-email.js';
import { PLAN_TABLE } from '../shared/reflection-list.js';

const PAGE = '/one-verse-man/diagnostic/';

const badLink = () => html(simplePage({
  title: 'That link didn’t work',
  message: 'This link is incomplete. Use the “Stop the 7-day plan” link at the bottom of any plan email.',
  buttonHref: PAGE, buttonText: 'Back to the reflection'
}), 400);

export default async (req) => {
  const token = new URL(req.url).searchParams.get('token');
  if (!isToken(token)) return badLink();

  try {
    const supabase = db();
    const { data: plan, error } = await supabase.from(PLAN_TABLE)
      .select('id, status').eq('unsub_token', token).maybeSingle();
    if (error) throw error;
    if (!plan) return badLink();

    if (req.method === 'POST') {
      if (plan.status === 'active') {
        const now = new Date().toISOString();
        const { error: upErr } = await supabase.from(PLAN_TABLE)
          .update({ status: 'unsubscribed', unsubscribed_at: now, updated_at: now }).eq('id', plan.id);
        if (upErr) throw upErr;
      }
      return html(simplePage({
        title: 'Your plan is stopped',
        message: 'You won’t get any more emails from this 7-day plan. You can take the reflection again anytime.',
        buttonHref: PAGE, buttonText: 'Back to the reflection'
      }));
    }

    if (plan.status !== 'active') {
      return html(simplePage({
        title: 'Nothing left to stop',
        message: 'This 7-day plan has already finished or been stopped. You won’t get more emails from it.',
        buttonHref: PAGE, buttonText: 'Back to the reflection'
      }));
    }

    return html(simplePage({
      title: 'Stop your 7-day plan?',
      message: 'You won’t get the rest of the daily emails.',
      extraHtml: `<form method="post" action="/reflection/stop?token=${escapeHtml(token)}"><button class="btn" type="submit">Yes, stop the plan</button></form>`
    }));
  } catch (err) {
    console.error('reflection-stop failed:', err);
    return html(simplePage({ title: 'Something went wrong', message: 'We couldn’t process that just now. Please try again in a minute.' }), 500);
  }
};

export const config = { path: '/reflection/stop' };
