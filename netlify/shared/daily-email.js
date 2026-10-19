// Shared HTML/text rendering for The Daily emails.
// Used by Netlify functions (confirmation + daily emails) and scripts/build-daily.js (feed).
// Pure functions only: no network, no environment.

export const SITE_URL = 'https://thewrkshop.com';
const BROWN = '#3e2c23';
const ACCENT = '#6b4a36';
const CREAM = '#f4f1ee';

export function escapeHtml(value = '') {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const clean = (v) => String(v ?? '').trim();

export function dailySubject(daily) {
  return [clean(daily.title) || 'The Daily', clean(daily.subtitle)].filter(Boolean).join(' — ');
}

function blockHtml(block) {
  if (!block) return '';
  const p = `margin:0 0 12px;line-height:1.6;color:#2b2b2b;`;
  const items = Array.isArray(block.items) ? block.items : [];
  switch (block.type) {
    case 'paragraph':
      return `<p style="${p}">${escapeHtml(block.text)}</p>`;
    case 'callout':
      return `<p style="${p}font-weight:700;color:${BROWN};">${escapeHtml(clean(block.prefix) || '👉')} ${escapeHtml(block.text)}</p>`;
    case 'quote':
      return `<blockquote style="margin:0 0 12px;padding:8px 14px;border-left:4px solid ${BROWN};background:${CREAM};font-style:italic;color:${BROWN};">${escapeHtml(block.text)}</blockquote>`;
    case 'lines':
      return items.map(i => `<p style="${p}">${escapeHtml(i)}</p>`).join('');
    case 'bullet_list':
    case 'numbered_list': {
      const tag = block.type === 'bullet_list' ? 'ul' : 'ol';
      return `<${tag} style="margin:0 0 12px;padding-left:22px;line-height:1.6;color:#2b2b2b;">${items.map(i => `<li>${escapeHtml(i)}</li>`).join('')}</${tag}>`;
    }
    default:
      return block.text ? `<p style="${p}">${escapeHtml(block.text)}</p>` : '';
  }
}

function scripturesOf(daily) {
  const list = Array.isArray(daily.scriptures) && daily.scriptures.length
    ? daily.scriptures
    : [{ ref: daily.verse_ref, text: daily.verse_text }];
  return list.filter(s => clean(s.ref) || clean(s.text));
}

// The devotional itself (no title, no outer layout). Used inside emails and the RSS feed.
export function dailyBodyHtml(daily, url) {
  const parts = [];
  if (daily.subtitle) parts.push(`<h2 style="margin:0 0 8px;color:${ACCENT};font-size:20px;">${escapeHtml(daily.subtitle)}</h2>`);
  if (daily.tagline) parts.push(`<p style="margin:0 0 16px;line-height:1.6;font-style:italic;color:${BROWN};">${escapeHtml(daily.tagline)}</p>`);
  const verses = scripturesOf(daily).map(s =>
    `<p style="margin:0 0 8px;line-height:1.6;"><strong>${escapeHtml(s.ref)}</strong><br>${escapeHtml(s.text)}</p>`).join('');
  if (verses) parts.push(`<div style="margin:0 0 18px;padding:10px 14px;border-left:4px solid ${BROWN};background:#ffffff;">${verses}</div>`);
  (daily.sections || []).forEach(sec => {
    if (sec.label) parts.push(`<h3 style="margin:20px 0 8px;color:${BROWN};font-size:18px;">${escapeHtml(sec.label)}</h3>`);
    parts.push((sec.blocks || []).map(blockHtml).join(''));
  });
  if (url) {
    parts.push(`<p style="margin:24px 0 0;"><a href="${escapeHtml(url)}" style="display:inline-block;background:${BROWN};color:${CREAM};padding:10px 18px;border-radius:6px;text-decoration:none;font-weight:700;">Read &amp; listen on TheWrkShop →</a></p>`);
  }
  return parts.join('\n');
}

export function dailyBodyText(daily, url) {
  const out = [];
  out.push(dailySubject(daily));
  if (daily.tagline) out.push('', clean(daily.tagline));
  scripturesOf(daily).forEach(s => out.push('', `${clean(s.ref)}`, clean(s.text)));
  (daily.sections || []).forEach(sec => {
    out.push('', clean(sec.label).toUpperCase());
    (sec.blocks || []).forEach(b => {
      if (Array.isArray(b.items)) b.items.forEach(i => out.push((b.type === 'lines' ? '' : '• ') + clean(i)));
      else if (b.text) out.push((b.type === 'callout' ? (clean(b.prefix) || '👉') + ' ' : '') + clean(b.text));
    });
  });
  if (url) out.push('', `Read & listen: ${url}`);
  return out.join('\n');
}

// Outer email layout: logo, title, content, footer.
export function emailLayout({ title, preheader = '', bodyHtml, footerHtml = '' }) {
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background:${CREAM};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CREAM};">
  <tr><td align="center" style="padding:24px 12px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;">
      <tr><td align="center" style="background:${BROWN};padding:18px;">
        <a href="${SITE_URL}"><img src="${SITE_URL}/assets/images/thewrkshop-logo-transparent-trimmed.png" width="104" height="80" alt="TheWrkShop" style="display:block;border:0;"></a>
      </td></tr>
      <tr><td style="padding:28px 28px 8px;font-family:Georgia,'Times New Roman',serif;font-size:17px;color:#2b2b2b;">
        <h1 style="margin:0 0 10px;color:${BROWN};font-size:26px;line-height:1.25;">${escapeHtml(title)}</h1>
        ${bodyHtml}
      </td></tr>
      <tr><td style="padding:24px 28px 28px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#7a6a60;">
        ${footerHtml}
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

export function dailyEmail(daily, { url, unsubscribeUrl }) {
  const title = clean(daily.title) || 'The Daily';
  const firstVerse = scripturesOf(daily)[0];
  const preheader = clean(daily.subtitle) || clean(daily.tagline) || (firstVerse ? `${clean(firstVerse.ref)} — ${clean(firstVerse.text)}` : '');
  const footerHtml = `You're receiving The Daily because you signed up at thewrkshop.com.<br>
<a href="${escapeHtml(unsubscribeUrl)}" style="color:#7a6a60;">Unsubscribe</a> · <a href="${SITE_URL}/daily-archive.html" style="color:#7a6a60;">Past Dailies</a><br>— TheWrkShop`;
  return {
    subject: dailySubject(daily),
    html: emailLayout({ title, preheader, bodyHtml: dailyBodyHtml(daily, url), footerHtml }),
    text: `${dailyBodyText(daily, url)}\n\n—\nYou're receiving The Daily because you signed up at thewrkshop.com.\nUnsubscribe: ${unsubscribeUrl}\n`
  };
}

export function confirmEmail({ firstName, confirmUrl }) {
  const hi = firstName ? `${escapeHtml(firstName)}, one` : 'One';
  const bodyHtml = `
<p style="margin:0 0 14px;line-height:1.6;">${hi} quick step: confirm your email and The Daily will start arriving in your inbox the morning each new one is released.</p>
<p style="margin:22px 0;"><a href="${escapeHtml(confirmUrl)}" style="display:inline-block;background:${BROWN};color:${CREAM};padding:12px 22px;border-radius:6px;text-decoration:none;font-weight:700;font-family:Arial,Helvetica,sans-serif;">Yes, send me The Daily</a></p>
<p style="margin:0 0 14px;line-height:1.6;color:#555;font-size:15px;">Scripture, reflection, and one clear step to live it out, written for men.</p>`;
  const footerHtml = `If you didn't sign up at thewrkshop.com, you can ignore this email and you won't hear from us.<br>— TheWrkShop`;
  return {
    subject: 'Confirm your email for The Daily',
    html: emailLayout({ title: 'Confirm your email', preheader: 'One click and The Daily will come to you.', bodyHtml, footerHtml }),
    text: `${firstName ? firstName + ', one' : 'One'} quick step: confirm your email and The Daily will start arriving in your inbox the morning each new one is released.\n\nConfirm: ${confirmUrl}\n\nIf you didn't sign up at thewrkshop.com, ignore this email.\n— TheWrkShop\n`
  };
}

// Small branded HTML page returned by the confirm / unsubscribe links.
export function simplePage({ title, message, buttonHref, buttonText, extraHtml = '' }) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>TheWrkShop — ${escapeHtml(title)}</title>
<link rel="icon" type="image/x-icon" href="/assets/favicon/favicon.ico?v=2">
<meta name="robots" content="noindex">
<style>
  body{margin:0;background:#d9a066;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#2b2b2b;}
  header{background:${BROWN};padding:14px;text-align:center}
  header img{height:56px;width:auto}
  main{max-width:560px;margin:40px auto;padding:0 16px}
  .card{background:${CREAM};border-radius:14px;padding:28px;box-shadow:0 2px 6px rgba(0,0,0,.07)}
  h1{color:${BROWN};margin:0 0 10px;font-size:1.6rem}
  p{line-height:1.6;margin:0 0 14px}
  .btn{display:inline-block;background:${BROWN};color:${CREAM};padding:.7rem 1.2rem;border-radius:6px;text-decoration:none;font-weight:700;border:none;font-size:1rem;cursor:pointer}
  .btn:hover{background:#5b3a29}
</style></head>
<body>
<header><a href="/"><img src="/assets/images/thewrkshop-logo-transparent-trimmed.png" alt="TheWrkShop" width="233" height="180"></a></header>
<main><div class="card">
  <h1>${escapeHtml(title)}</h1>
  <p>${message}</p>
  ${extraHtml}
  ${buttonHref ? `<p><a class="btn" href="${escapeHtml(buttonHref)}">${escapeHtml(buttonText)}</a></p>` : ''}
</div></main>
</body></html>`;
}
