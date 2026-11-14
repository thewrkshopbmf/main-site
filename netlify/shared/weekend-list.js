// The Weekend 4-3-2-1 email list (Netlify functions only).
// Same shape as The Daily list (netlify/shared/daily-list.js): sign up -> confirm by email ->
// the newest Weekend 4-3-2-1 is emailed once when it goes live (Fridays 2 pm Central).
// A man can also ask for The Daily on the same form; confirming adds him to that list too.
import { db, json, html, isEmail, isToken, newToken, centralNow, sendEmail, FROM, SITE_URL } from './daily-list.js';
import { emailLayout, escapeHtml } from './daily-email.js';

export { db, json, html, isEmail, isToken, newToken };
export const TABLE = 'weekend_subscribers';
const SENDS_TABLE = 'weekend_email_sends';
const DAILY_TABLE = 'daily_subscribers';
const BATCH_SIZE = 100;
const SEND_FROM_HOUR = 14;   // the post goes live at 2 pm Central
const SEND_UNTIL_HOUR = 22;  // don't start a send after 10 pm Central

const BROWN = '#3e2c23';
const CREAM = '#f4f1ee';
const clean = (v) => String(v ?? '').trim();
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

export const confirmUrl = (t) => `${SITE_URL}/email/weekend/confirm?token=${t}`;
export const unsubscribeUrl = (t) => `${SITE_URL}/email/weekend/unsubscribe?token=${t}`;

const button = (href, label) =>
  `<a href="${escapeHtml(href)}" style="display:inline-block;background:${BROWN};color:${CREAM};padding:12px 22px;border-radius:6px;text-decoration:none;font-weight:700;font-family:Arial,Helvetica,sans-serif;">${label}</a>`;

export function confirmEmail({ firstName, wantsDaily, url }) {
  const hi = firstName ? `${escapeHtml(firstName)}, one` : 'One';
  const what = wantsDaily
    ? 'the Weekend 4-3-2-1 every Friday and The Daily every weekday morning'
    : 'the Weekend 4-3-2-1 every Friday afternoon';
  const bodyHtml = `
<p style="margin:0 0 14px;line-height:1.6;">${hi} quick step: confirm your email and we’ll send you ${what}.</p>
<p style="margin:22px 0;">${button(url, wantsDaily ? 'Yes, send me both' : 'Yes, send me the 4-3-2-1')}</p>
<p style="margin:0 0 14px;line-height:1.6;color:#555;font-size:15px;">Four Scriptures, three insights, two questions and one step to carry into the week.</p>`;
  const footerHtml = `If you didn't sign up at thewrkshop.com, you can ignore this email and you won't hear from us.<br>— TheWrkShop`;
  return {
    subject: 'Confirm your email for the Weekend 4-3-2-1',
    html: emailLayout({ title: 'Confirm your email', preheader: 'One click and the 4-3-2-1 will come to you each Friday.', bodyHtml, footerHtml }),
    text: `${firstName ? firstName + ', one' : 'One'} quick step: confirm your email and we'll send you ${what}.\n\nConfirm: ${url}\n\nIf you didn't sign up at thewrkshop.com, ignore this email.\n— TheWrkShop\n`
  };
}

export async function sendConfirmation(sub) {
  const mail = confirmEmail({ firstName: sub.first_name, wantsDaily: sub.wants_daily, url: confirmUrl(sub.confirm_token) });
  return sendEmail('/emails', { from: FROM, to: [sub.email], subject: mail.subject, html: mail.html, text: mail.text });
}

// The weekly email: a short summary that sends him to the post, then "go deeper" into that week's Dailies.
export function weekendEmail(post, { unsubscribeUrl: unsub }) {
  const url = `${SITE_URL}${post.href}`;
  const dailies = Array.isArray(post.week_dailies) ? post.week_dailies : [];
  const win = clean(post.one_minute_win);
  const parts = [];
  if (/^https:\/\//.test(clean(post.hero_image))) {
    parts.push(`<a href="${escapeHtml(url)}"><img src="${escapeHtml(post.hero_image)}" alt="${escapeHtml(post.hero_image_alt || '')}" width="544" style="display:block;width:100%;max-width:544px;height:auto;border-radius:10px;margin:0 0 18px;border:0;"></a>`);
  }
  if (post.excerpt) parts.push(`<p style="margin:0 0 16px;line-height:1.6;">${escapeHtml(post.excerpt)}</p>`);
  if (win) parts.push(`<div style="margin:0 0 18px;padding:12px 14px;border-left:4px solid ${BROWN};background:${CREAM};"><p style="margin:0 0 4px;font-weight:700;color:${BROWN};font-family:Arial,Helvetica,sans-serif;font-size:13px;text-transform:uppercase;letter-spacing:.05em;">One-Minute Win of the Week</p><p style="margin:0;line-height:1.6;">${escapeHtml(win)}</p></div>`);
  parts.push(`<p style="margin:22px 0;">${button(url, 'Read &amp; listen to the 4-3-2-1 →')}</p>`);
  if (dailies.length) {
    parts.push(`<h3 style="margin:26px 0 6px;color:${BROWN};font-size:18px;">Want to go deeper?</h3>`);
    parts.push(`<p style="margin:0 0 10px;line-height:1.6;color:#555;font-size:15px;">This week’s 4-3-2-1 came from these Dailies. Tap any one to sit with the full day.</p>`);
    parts.push(`<ul style="margin:0 0 14px;padding-left:20px;line-height:1.7;">${dailies.map(d =>
      `<li><a href="${escapeHtml(SITE_URL + d.href)}" style="color:${BROWN};font-weight:700;">${escapeHtml(d.title)}</a>${d.day ? ` <span style="color:#7a6a60;font-size:14px;">(${escapeHtml(d.day)})</span>` : ''}</li>`).join('')}</ul>`);
  }
  parts.push(`<p style="margin:0 0 6px;line-height:1.6;font-size:15px;color:#555;">Want one every weekday? <a href="${SITE_URL}/daily.html" style="color:${BROWN};">Get The Daily →</a></p>`);
  const footerHtml = `You're receiving the Weekend 4-3-2-1 because you signed up at thewrkshop.com.<br>
<a href="${escapeHtml(unsub)}" style="color:#7a6a60;">Unsubscribe</a> · <a href="${SITE_URL}/blog-archive.html" style="color:#7a6a60;">Past 4-3-2-1s</a><br>— TheWrkShop`;
  const text = [
    `Weekend 4-3-2-1: ${clean(post.title)}`, '',
    clean(post.excerpt),
    ...(win ? ['', 'ONE-MINUTE WIN OF THE WEEK', win] : []),
    '', `Read & listen: ${url}`,
    ...(dailies.length ? ['', 'WANT TO GO DEEPER? This week’s Dailies:', ...dailies.map(d => `• ${d.title}: ${SITE_URL}${d.href}`)] : []),
    '', `Get The Daily every weekday: ${SITE_URL}/daily.html`,
    '', '—', "You're receiving the Weekend 4-3-2-1 because you signed up at thewrkshop.com.", `Unsubscribe: ${unsub}`, ''
  ].join('\n');
  return {
    subject: `Weekend 4-3-2-1: ${clean(post.title)}`,
    html: emailLayout({ title: clean(post.title), preheader: clean(post.excerpt), bodyHtml: parts.join('\n'), footerHtml }),
    text
  };
}

export async function fetchLiveBlog() {
  const res = await fetch(`${SITE_URL}/data/blog.json?t=${Date.now()}`, { headers: { 'Cache-Control': 'no-cache' } });
  if (!res.ok) throw new Error(`Could not load live blog.json (${res.status})`);
  return res.json();
}

// When a man confirms with "also send me The Daily", put him on The Daily list as active.
export async function addToDaily(supabase, { email, first_name }) {
  const now = new Date().toISOString();
  const { data: existing, error } = await supabase.from(DAILY_TABLE).select('id, status').eq('email', email).maybeSingle();
  if (error) throw error;
  if (existing?.status === 'active') return 'already';
  if (existing) {
    const { error: upErr } = await supabase.from(DAILY_TABLE)
      .update({ status: 'active', confirmed_at: now, unsubscribed_at: null, updated_at: now }).eq('id', existing.id);
    if (upErr) throw upErr;
    return 'reactivated';
  }
  const { error: insErr } = await supabase.from(DAILY_TABLE).insert({
    email, first_name: first_name || null, status: 'active', confirm_token: newToken(), unsub_token: newToken(),
    source: 'weekend-signup', confirm_sent_at: now, confirmed_at: now
  });
  if (insErr) throw insErr;
  return 'added';
}

/**
 * Email the newest Weekend 4-3-2-1 to every active subscriber who hasn't had it yet.
 * Only on the day the post goes live, from 2 pm to 10 pm Central. Safe to run many times.
 */
export async function sendThisWeekend({ reason = 'manual', now = new Date(), live } = {}) {
  const { date: today, hour } = centralNow(now);
  if (hour < SEND_FROM_HOUR) return { sent: 0, skipped: 'Too early: the Weekend 4-3-2-1 goes out at 2 pm Central.' };
  if (hour >= SEND_UNTIL_HOUR) return { sent: 0, skipped: 'Too late in the day to start a send.' };
  const post = live || await fetchLiveBlog();
  if (!post || post.date !== today) return { sent: 0, skipped: `No new 4-3-2-1 live for ${today} (live post is ${post && post.date}).` };

  const supabase = db();
  const { data: run } = await supabase.from(SENDS_TABLE).select('send_date, recipients, failures').eq('send_date', today).maybeSingle();
  let sent = 0, failed = 0;
  const firstSentAt = run?.recipients ? null : new Date().toISOString();

  for (let guard = 0; guard < 200; guard++) {
    const { data: pending, error: pickErr } = await supabase.from(TABLE).select('id')
      .eq('status', 'active').or(`last_sent_date.is.null,last_sent_date.lt.${today}`).order('id').limit(BATCH_SIZE);
    if (pickErr) throw pickErr;
    if (!pending.length) break;

    const { data: claimed, error: claimErr } = await supabase.from(TABLE)
      .update({ last_sent_date: today, updated_at: new Date().toISOString() })
      .in('id', pending.map(p => p.id)).eq('status', 'active')
      .or(`last_sent_date.is.null,last_sent_date.lt.${today}`)
      .select('id, email, unsub_token');
    if (claimErr) throw claimErr;
    if (!claimed.length) continue;

    const emails = claimed.map(sub => {
      const unsub = unsubscribeUrl(sub.unsub_token);
      const mail = weekendEmail(post, { unsubscribeUrl: unsub });
      return {
        from: FROM, to: [sub.email], subject: mail.subject, html: mail.html, text: mail.text,
        headers: { 'List-Unsubscribe': `<${unsub}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' }
      };
    });

    try {
      await sendEmail('/emails/batch', emails);
      sent += claimed.length;
    } catch (err) {
      console.error('Weekend batch failed:', err.message);
      failed += claimed.length;
      await supabase.from(TABLE).update({ last_sent_date: null }).in('id', claimed.map(c => c.id));
      break;
    }
    await sleep(600);
  }

  if (sent || failed) {
    const row = {
      send_date: today,
      post_title: clean(post.title),
      recipients: (run?.recipients || 0) + sent,
      failures: (run?.failures || 0) + failed,
      last_sent_at: new Date().toISOString()
    };
    if (firstSentAt) row.first_sent_at = firstSentAt;
    await supabase.from(SENDS_TABLE).upsert(row, { onConflict: 'send_date' });
  }
  const summary = { reason, date: today, sent, failed };
  console.log('Weekend email run:', JSON.stringify(summary));
  return summary;
}
