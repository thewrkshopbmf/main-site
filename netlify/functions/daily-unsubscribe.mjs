// /email/unsubscribe?token=…
//  GET  → page with an "Unsubscribe" button (so email link-scanners can't unsubscribe people by accident)
//  POST → unsubscribes. Also handles one-click unsubscribe from Gmail / Apple Mail (List-Unsubscribe-Post).
import { db, TABLE, html, isToken } from '../shared/daily-list.js';
import { simplePage, escapeHtml } from '../shared/daily-email.js';

function maskEmail(email = '') {
  const [user, domain] = email.split('@');
  if (!domain) return email;
  return `${user.slice(0, 2)}${'•'.repeat(Math.max(1, user.length - 2))}@${domain}`;
}

const badLink = () => html(simplePage({
  title: 'That link didn’t work',
  message: 'This unsubscribe link is incomplete. Use the link at the bottom of any Daily email.',
  buttonHref: '/daily.html', buttonText: 'Go to The Daily'
}), 400);

export default async (req) => {
  const token = new URL(req.url).searchParams.get('token');
  if (!isToken(token)) return badLink();

  try {
    const supabase = db();
    const { data: sub, error } = await supabase.from(TABLE)
      .select('id, email, status').eq('unsub_token', token).maybeSingle();
    if (error) throw error;
    if (!sub) return badLink();

    if (req.method === 'POST') {
      if (sub.status !== 'unsubscribed') {
        const now = new Date().toISOString();
        const { error: upErr } = await supabase.from(TABLE)
          .update({ status: 'unsubscribed', unsubscribed_at: now, updated_at: now })
          .eq('id', sub.id);
        if (upErr) throw upErr;
      }
      return html(simplePage({
        title: 'You’ve been unsubscribed',
        message: `${escapeHtml(maskEmail(sub.email))} won’t receive The Daily by email anymore. Changed your mind? You can sign up again on any Daily page.`,
        buttonHref: '/daily.html', buttonText: 'Go to The Daily'
      }));
    }

    if (sub.status === 'unsubscribed') {
      return html(simplePage({
        title: 'You’re already unsubscribed',
        message: `${escapeHtml(maskEmail(sub.email))} isn’t on The Daily email list.`,
        buttonHref: '/daily.html', buttonText: 'Go to The Daily'
      }));
    }

    return html(simplePage({
      title: 'Unsubscribe from The Daily?',
      message: `Stop sending The Daily to ${escapeHtml(maskEmail(sub.email))}?`,
      extraHtml: `<form method="post" action="/email/unsubscribe?token=${escapeHtml(token)}"><button class="btn" type="submit">Yes, unsubscribe me</button></form>`
    }));
  } catch (err) {
    console.error('daily-unsubscribe failed:', err);
    return html(simplePage({
      title: 'Something went wrong',
      message: 'We couldn’t process that just now. Please try again in a minute.'
    }), 500);
  }
};

export const config = { path: '/email/unsubscribe' };
