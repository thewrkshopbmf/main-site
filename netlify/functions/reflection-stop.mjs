// /reflection/stop?token=…
//  GET  → page with a "Stop the plan" button (so email link-scanners can't stop it by accident)
//  POST → stops the plan. Also handles one-click unsubscribe from Gmail / Apple Mail.
import { db, html, isToken } from '../shared/daily-list.js';
import { simplePage, escapeHtml } from '../shared/daily-email.js';
import { PLANS } from '../shared/reflection-list.js';

const PAGE = '/one-verse-man/diagnostic/';

// The token belongs to one plan in one of the plan tables (the One Verse Man reflection or the Pattern Finder).
async function findPlan(supabase, token) {
  for (const tool of Object.keys(PLANS)) {
    const { data, error } = await supabase.from(PLANS[tool].table)
      .select('id, status').eq('unsub_token', token).maybeSingle();
    if (error) throw error;
    if (data) return { ...data, table: PLANS[tool].table, page: PLANS[tool].page };
  }
  return null;
}

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
    const plan = await findPlan(supabase, token);
    if (!plan) return badLink();
    const back = { buttonHref: plan.page, buttonText: plan.page === PAGE ? 'Back to the reflection' : 'Back to the Pattern Finder' };

    if (req.method === 'POST') {
      if (plan.status === 'active') {
        const now = new Date().toISOString();
        const { error: upErr } = await supabase.from(plan.table)
          .update({ status: 'unsubscribed', unsubscribed_at: now, updated_at: now }).eq('id', plan.id);
        if (upErr) throw upErr;
      }
      return html(simplePage({
        title: 'Your plan is stopped',
        message: 'You won’t get any more emails from this 7-day plan. You can start again anytime.',
        ...back
      }));
    }

    if (plan.status !== 'active') {
      return html(simplePage({
        title: 'Nothing left to stop',
        message: 'This 7-day plan has already finished or been stopped. You won’t get more emails from it.',
        ...back
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
