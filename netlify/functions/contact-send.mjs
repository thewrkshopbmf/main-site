// POST /contact/send — the "Contact Us" form on the homepage.
// Saves the message, emails it to TheWrkShop (reply goes straight to the sender),
// and sends the sender a short "we got it" note.
import { db, json, sendEmail, FROM } from '../shared/daily-list.js';
import { emailLayout, escapeHtml } from '../shared/daily-email.js';

const NOTIFY_TO = process.env.CONTACT_NOTIFY_EMAIL || 'steven@thewrkshop.com';
const TABLE = 'contact_messages';
const REPEAT_MINUTES = 2; // ignore an identical double-submit

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) && v.length <= 254;
const str = (v, max) => String(v ?? '').trim().slice(0, max);

async function readBody(req) {
  const type = req.headers.get('content-type') || '';
  if (type.includes('application/json')) return { body: await req.json(), isForm: false };
  const form = await req.formData();
  return { body: Object.fromEntries(form.entries()), isForm: true };
}

function backTo(status) {
  return new Response(null, { status: 303, headers: { Location: `/?contact=${status}#contact` } });
}

export default async (req) => {
  if (req.method !== 'POST') return json({ ok: false, error: 'Method not allowed' }, 405);

  let parsed;
  try { parsed = await readBody(req); } catch { return json({ ok: false, error: 'Invalid request' }, 400); }
  const { body, isForm } = parsed;
  const reply = (ok, error, status = 400) => (isForm ? backTo(ok ? 'sent' : 'error') : json(ok ? { ok: true } : { ok: false, error }, ok ? 200 : status));

  // Bots fill every field; people never see this one.
  if (str(body.company, 200)) return reply(true);

  const name = str(body.name, 100);
  const email = str(body.email, 254).toLowerCase();
  const message = str(body.message, 5000);
  if (!name) return reply(false, 'Please tell us your name.');
  if (!isEmail(email)) return reply(false, 'Please enter a valid email address.');
  if (message.length < 2) return reply(false, 'Please write a message.');

  try {
    const supabase = db();
    const since = new Date(Date.now() - REPEAT_MINUTES * 60 * 1000).toISOString();
    const { data: recent, error: findErr } = await supabase.from(TABLE)
      .select('id').eq('email', email).eq('message', message).gte('created_at', since).limit(1);
    if (findErr) throw findErr;
    if (recent && recent.length) return reply(true);
    const { error } = await supabase.from(TABLE).insert({ name, email, message, source: 'homepage-contact' });
    if (error) throw error;
  } catch (err) {
    console.error('contact-send save failed:', err);
    return reply(false, 'Something went wrong on our end. Please try again in a minute.', 500);
  }

  const notifyHtml = emailLayout({
    title: 'New message from the website',
    preheader: `${name}: ${message.slice(0, 80)}`,
    bodyHtml: `<p style="margin:0 0 6px;"><strong>${escapeHtml(name)}</strong> &lt;${escapeHtml(email)}&gt;</p>
<p style="margin:0 0 16px;color:#6b5b53;font-size:14px;">Reply to this email to answer them directly.</p>
<div style="white-space:pre-wrap;line-height:1.6;padding:12px 14px;background:#ffffff;border-left:4px solid #3e2c23;">${escapeHtml(message)}</div>
<p style="margin:18px 0 0;"><a href="https://thewrkshop.com/admin/messages.html" style="color:#3e2c23;font-weight:700;">Open Messages in admin</a></p>`
  });
  const thanksHtml = emailLayout({
    title: 'We got your message',
    preheader: 'Thanks for reaching out to TheWrkShop.',
    bodyHtml: `<p style="margin:0 0 14px;line-height:1.6;">${escapeHtml(name)}, thanks for reaching out to TheWrkShop. We’ve received your message and will get back to you soon.</p>
<p style="margin:0 0 14px;line-height:1.6;">In the meantime, stay bold, stay faithful, and keep building with purpose.</p>`,
    footerHtml: '— TheWrkShop Team'
  });

  const results = await Promise.allSettled([
    sendEmail('/emails', { from: FROM, to: [NOTIFY_TO], reply_to: email, subject: `Website message from ${name}`, html: notifyHtml,
      text: `${name} <${email}>\n\n${message}\n\nReply to this email to answer them directly.` }),
    sendEmail('/emails', { from: FROM, to: [email], subject: 'We got your message', html: thanksHtml,
      text: `${name}, thanks for reaching out to TheWrkShop. We've received your message and will get back to you soon.\n\n— TheWrkShop Team` })
  ]);
  results.forEach(r => { if (r.status === 'rejected') console.error('contact-send email failed:', r.reason); });

  return reply(true);
};

export const config = { path: '/contact/send' };
