// Group intake ("Get known"): field lists, validation and emails.
// Pure functions except where noted; used by netlify/functions/group-apply.mjs.
import { emailLayout, escapeHtml, SITE_URL } from './daily-email.js';

export const TABLE = 'group_intakes';

// Keep these in sync with the checkboxes and selects on /get-known.html.
export const BRINGING = {
  isolated: 'Feeling isolated',
  identity: 'Unsure who I am or what I’m for',
  family: 'My marriage or family',
  work: 'Pressure at work or in leadership',
  faith_stuck: 'My faith feels stuck',
  grow: 'I want to grow',
  sent: 'Someone sent me'
};
export const LOOKING_FOR = {
  truth: 'Men who will tell me the truth',
  accountability: 'Accountability',
  scripture: 'Studying Scripture',
  leading: 'Help leading better',
  talk: 'Someone to talk to',
  unsure: 'Not sure yet'
};
export const SEASONS = {
  single: 'Single',
  married: 'Married',
  dad_young: 'Dad with kids at home',
  empty_nester: 'Empty nester',
  divorced: 'Divorced or separated',
  widowed: 'Widowed',
  other: 'Other'
};
export const EXPERIENCE = {
  never: 'Never been in one',
  helped: 'Been in one that helped',
  didnt_help: 'Been in one that didn’t'
};
export const CONTACT = { phone: 'Phone call', google_meet: 'Google Meet' };

const str = (v, max) => String(v ?? '').trim().slice(0, max);
const pick = (v, allowed) => (Object.hasOwn(allowed, v) ? v : null);
const pickMany = (v, allowed) =>
  [...new Set((Array.isArray(v) ? v : []).filter(x => Object.hasOwn(allowed, x)))];
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) && v.length <= 254;

// Returns { ok:true, row } or { ok:false, error }.
export function cleanIntake(body = {}) {
  const row = {
    first_name: str(body.first_name, 60),
    last_name: str(body.last_name, 60) || null,
    email: str(body.email, 254).toLowerCase(),
    phone: str(body.phone, 30) || null,
    contact_pref: pick(body.contact_pref, CONTACT),
    time_zone: str(body.time_zone, 60) || null,
    best_times: str(body.best_times, 200) || null,
    season: pick(body.season, SEASONS),
    bringing: pickMany(body.bringing, BRINGING),
    looking_for: pickMany(body.looking_for, LOOKING_FOR),
    group_experience: pick(body.group_experience, EXPERIENCE),
    worth_your_time: str(body.worth_your_time, 1000) || null,
    heard_from: str(body.heard_from, 200) || null,
    source: str(body.source, 40) || 'get-known'
  };
  if (!row.first_name) return { ok: false, error: 'Please tell us your first name.' };
  if (!isEmail(row.email)) return { ok: false, error: 'Please enter a valid email address.' };
  if (!row.contact_pref) return { ok: false, error: 'Choose a phone call or Google Meet.' };
  if (row.contact_pref === 'phone' && !/\d{7,}/.test((row.phone || '').replace(/\D/g, ''))) {
    return { ok: false, error: 'Please add a phone number so we can call you.' };
  }
  return { ok: true, row };
}

const list = (keys, map) => (keys || []).map(k => map[k]).filter(Boolean);

// Email to the person who applied.
export function applicantEmail(row) {
  const how = row.contact_pref === 'phone' ? 'a phone call' : 'a Google Meet';
  const bodyHtml = `
<p style="margin:0 0 14px;line-height:1.6;">${escapeHtml(row.first_name)}, thanks for taking the first step.</p>
<p style="margin:0 0 14px;line-height:1.6;">Here's what happens next. Someone from TheWrkShop will reach out within a few days to set up ${how}. It's about 20 minutes, with no pressure and no pitch. We just want to hear what's going on and figure out the right next step with you.</p>
<p style="margin:0 0 14px;line-height:1.6;">Until then, you can start with The Daily: one Scripture, one hard question and one step, every weekday.</p>
<p style="margin:22px 0;"><a href="${SITE_URL}/daily.html" style="display:inline-block;background:#3e2c23;color:#f4f1ee;padding:12px 22px;border-radius:6px;text-decoration:none;font-weight:700;font-family:Arial,Helvetica,sans-serif;">Read today's Daily</a></p>`;
  const footerHtml = `Only TheWrkShop's leaders see what you shared. If you didn't fill out this form, you can ignore this email.<br>— TheWrkShop`;
  return {
    subject: 'Got it. Here’s what happens next',
    html: emailLayout({ title: 'Thanks for reaching out', preheader: `We'll reach out within a few days to set up ${how}.`, bodyHtml, footerHtml }),
    text: `${row.first_name}, thanks for taking the first step.\n\nSomeone from TheWrkShop will reach out within a few days to set up ${how}. It's about 20 minutes, with no pressure and no pitch.\n\nUntil then, start with The Daily: ${SITE_URL}/daily.html\n\nOnly TheWrkShop's leaders see what you shared.\n— TheWrkShop\n`
  };
}

// Email to TheWrkShop when someone applies.
export function notifyEmail(row) {
  const name = [row.first_name, row.last_name].filter(Boolean).join(' ');
  const lines = [
    ['Name', name],
    ['Email', row.email],
    ['Phone', row.phone || '—'],
    ['Wants', CONTACT[row.contact_pref]],
    ['Time zone', row.time_zone || '—'],
    ['Best times', row.best_times || '—'],
    ['Season of life', SEASONS[row.season] || '—'],
    ['What’s bringing him', list(row.bringing, BRINGING).join(', ') || '—'],
    ['Looking for', list(row.looking_for, LOOKING_FOR).join(', ') || '—'],
    ['Group experience', EXPERIENCE[row.group_experience] || '—'],
    ['Worth his time if…', row.worth_your_time || '—'],
    ['Heard about us', row.heard_from || '—']
  ];
  const rows = lines.map(([k, v]) =>
    `<tr><td style="padding:6px 10px 6px 0;vertical-align:top;color:#6b5b53;white-space:nowrap;">${escapeHtml(k)}</td><td style="padding:6px 0;vertical-align:top;">${escapeHtml(v)}</td></tr>`).join('');
  const bodyHtml = `
<p style="margin:0 0 14px;line-height:1.6;">${escapeHtml(name)} wants to get known.</p>
<table style="border-collapse:collapse;font-size:15px;line-height:1.5;">${rows}</table>
<p style="margin:22px 0;"><a href="${SITE_URL}/admin/group-intakes.html" style="display:inline-block;background:#3e2c23;color:#f4f1ee;padding:12px 22px;border-radius:6px;text-decoration:none;font-weight:700;font-family:Arial,Helvetica,sans-serif;">Open Group Intakes</a></p>`;
  return {
    subject: `New group intake: ${name}`,
    html: emailLayout({ title: 'New group intake', preheader: `${name} · ${CONTACT[row.contact_pref]}`, bodyHtml }),
    text: lines.map(([k, v]) => `${k}: ${v}`).join('\n') + `\n\nOpen: ${SITE_URL}/admin/group-intakes.html\n`
  };
}
