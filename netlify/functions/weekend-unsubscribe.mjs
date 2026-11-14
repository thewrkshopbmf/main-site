// /email/weekend/unsubscribe?token=…
//  GET  → page with an "Unsubscribe" button (so link-scanners can't unsubscribe people by accident)
//  POST → unsubscribes (also one-click unsubscribe from Gmail / Apple Mail). The Daily list is untouched.
import { db, TABLE, html, isToken } from '../shared/weekend-list.js';
import { simplePage, escapeHtml } from '../shared/daily-email.js';

function maskEmail(email = '') {
  const [user, domain] = email.split('@');
  if (!domain) return email;
  return `${user.slice(0, 2)}${'•'.repeat(Math.max(1, user.length - 2))}@${domain}`;
}

const badLink = () => html(simplePage({
  title: 'That link didn’t work',
  message: 'This unsubscribe link is incomplete. Use the link at the bottom of any Weekend 4-3-2-1 email.',
  buttonHref: '/blog-archive.html', buttonText: 'Go to the 4-3-2-1'
}), 400);

export default async (req) => {
  const token = new URL(req.url).searchParams.get('token');
  if (!isToken(token)) return badLink();
  try {
    const supabase = db();
    const { data: sub, error } = await supabase.from(TABLE).select('id, email, status').eq('unsub_token', token).maybeSingle();
    if (error) throw error;
    if (!sub) return badLink();

    if (req.method === 'POST') {
      if (sub.status !== 'unsubscribed') {
        const now = new Date().toISOString();
        const { error: upErr } = await supabase.from(TABLE)
          .update({ status: 'unsubscribed', unsubscribed_at: now, updated_at: now }).eq('id', sub.id);
        if (upErr) throw upErr;
      }
      return html(simplePage({
        title: 'You’ve been unsubscribed',
        message: `${escapeHtml(maskEmail(sub.email))} won’t receive the Weekend 4-3-2-1 anymore. If you also get The Daily, that keeps coming. Changed your mind? Sign up again at the end of any 4-3-2-1 post.`,
        buttonHref: '/blog-archive.html', buttonText: 'Go to the 4-3-2-1'
      }));
    }

    if (sub.status === 'unsubscribed') {
      return html(simplePage({
        title: 'You’re already unsubscribed',
        message: `${escapeHtml(maskEmail(sub.email))} isn’t on the Weekend 4-3-2-1 list.`,
        buttonHref: '/blog-archive.html', buttonText: 'Go to the 4-3-2-1'
      }));
    }

    return html(simplePage({
      title: 'Unsubscribe from the Weekend 4-3-2-1?',
      message: `Stop sending the Weekend 4-3-2-1 to ${escapeHtml(maskEmail(sub.email))}?`,
      extraHtml: `<form method="post" action="/email/weekend/unsubscribe?token=${escapeHtml(token)}"><button class="btn" type="submit">Yes, unsubscribe me</button></form>`
    }));
  } catch (err) {
    console.error('weekend-unsubscribe failed:', err);
    return html(simplePage({ title: 'Something went wrong', message: 'We couldn’t process that just now. Please try again in a minute.' }), 500);
  }
};

export const config = { path: '/email/weekend/unsubscribe' };
