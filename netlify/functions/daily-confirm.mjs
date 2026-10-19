// GET /email/confirm?token=…  — the link in the confirmation email.
import { db, TABLE, html, isToken } from '../shared/daily-list.js';
import { simplePage } from '../shared/daily-email.js';

export default async (req) => {
  const token = new URL(req.url).searchParams.get('token');

  if (!isToken(token)) {
    return html(simplePage({
      title: 'That link didn’t work',
      message: 'This confirmation link is incomplete or has expired. You can sign up again on any Daily page.',
      buttonHref: '/daily.html', buttonText: 'Go to The Daily'
    }), 400);
  }

  try {
    const supabase = db();
    const { data: sub, error } = await supabase.from(TABLE)
      .select('id, first_name, status').eq('confirm_token', token).maybeSingle();
    if (error) throw error;

    if (!sub) {
      return html(simplePage({
        title: 'That link didn’t work',
        message: 'We couldn’t find this signup. It may have been replaced by a newer confirmation email. You can sign up again on any Daily page.',
        buttonHref: '/daily.html', buttonText: 'Go to The Daily'
      }), 404);
    }

    if (sub.status !== 'active') {
      const now = new Date().toISOString();
      const { error: upErr } = await supabase.from(TABLE)
        .update({ status: 'active', confirmed_at: now, unsubscribed_at: null, updated_at: now })
        .eq('id', sub.id);
      if (upErr) throw upErr;
    }

    return html(simplePage({
      title: `You’re in${sub.first_name ? ', ' + sub.first_name : ''}.`,
      message: 'Thanks for confirming. The Daily will arrive in your inbox the morning each new one is released.',
      buttonHref: '/daily.html', buttonText: 'Read today’s Daily'
    }));
  } catch (err) {
    console.error('daily-confirm failed:', err);
    return html(simplePage({
      title: 'Something went wrong',
      message: 'We couldn’t confirm your email just now. Please try the link again in a minute.'
    }), 500);
  }
};

export const config = { path: '/email/confirm' };
