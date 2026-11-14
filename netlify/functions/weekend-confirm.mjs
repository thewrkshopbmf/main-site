// GET /email/weekend/confirm?token=…  (the link in the confirmation email)
import { db, TABLE, html, isToken, addToDaily } from '../shared/weekend-list.js';
import { simplePage } from '../shared/daily-email.js';

const bad = (status, message) => html(simplePage({
  title: 'That link didn’t work', message,
  buttonHref: '/blog-archive.html', buttonText: 'Go to the 4-3-2-1'
}), status);

export default async (req) => {
  const token = new URL(req.url).searchParams.get('token');
  if (!isToken(token)) return bad(400, 'This confirmation link is incomplete or has expired. You can sign up again at the end of any 4-3-2-1 post.');

  try {
    const supabase = db();
    const { data: sub, error } = await supabase.from(TABLE)
      .select('id, email, first_name, status, wants_daily').eq('confirm_token', token).maybeSingle();
    if (error) throw error;
    if (!sub) return bad(404, 'We couldn’t find this signup. It may have been replaced by a newer confirmation email. You can sign up again at the end of any 4-3-2-1 post.');

    if (sub.status !== 'active') {
      const now = new Date().toISOString();
      const { error: upErr } = await supabase.from(TABLE)
        .update({ status: 'active', confirmed_at: now, unsubscribed_at: null, updated_at: now }).eq('id', sub.id);
      if (upErr) throw upErr;
    }
    let daily = false;
    if (sub.wants_daily) {
      try { await addToDaily(supabase, sub); daily = true; } catch (e) { console.error('weekend-confirm: daily add failed', e); }
    }

    return html(simplePage({
      title: `You’re in${sub.first_name ? ', ' + sub.first_name : ''}.`,
      message: daily
        ? 'Thanks for confirming. The Weekend 4-3-2-1 will come every Friday afternoon, and The Daily every weekday morning.'
        : 'Thanks for confirming. The Weekend 4-3-2-1 will come to your inbox every Friday afternoon.',
      buttonHref: '/blog-archive.html', buttonText: 'Read the latest 4-3-2-1'
    }));
  } catch (err) {
    console.error('weekend-confirm failed:', err);
    return html(simplePage({ title: 'Something went wrong', message: 'We couldn’t confirm your email just now. Please try the link again in a minute.' }), 500);
  }
};

export const config = { path: '/email/weekend/confirm' };
