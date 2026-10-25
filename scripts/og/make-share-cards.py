#!/usr/bin/env python3
"""Make the link-preview cards for shared Hidden Gems and charts.

When someone shares one gem or one chart, the link is
thewrkshop.com/share/<key>/gem-N/ (or chart-N/). That page's preview card
shows just that gem or chart, so a text or social post shows the piece that
was shared instead of the whole daily.

Usage (run after adding dailies, like make-og-card.py):
  python3 scripts/og/make-share-cards.py            # every daily, skips cards already made
  python3 scripts/og/make-share-cards.py --force    # remake all

Writes assets/og/share/<key>/gem-N.jpg, chart-N.jpg and audit-N.jpg (1200x630).
<key> is the leadership slug when the post has one, otherwise its date.
Keep the numbering in step with scripts/build-daily.js (shareItemsFor).
Not part of the Netlify build: if a card is missing, the share page falls
back to the daily's own card.
"""
import argparse
import glob
import json
import os
import re
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
BROWN = (62, 44, 35)
CREAM = (244, 241, 238)
TAN = (201, 170, 140)
SOFT = (226, 216, 206)
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))

SERIF = '/usr/share/fonts/truetype/google-fonts/Lora-Variable.ttf'
SERIF_IT = '/usr/share/fonts/truetype/google-fonts/Lora-Italic-Variable.ttf'
SANS = '/usr/share/fonts/opentype/inter/InterDisplay-SemiBold.otf'
LEADERSHIP = 'Leadership & Culture'


def font(path, size, variation=None):
    f = ImageFont.truetype(path, size)
    if variation:
        try:
            f.set_variation_by_name(variation)
        except Exception:
            pass
    return f


def wrap(draw, text, fnt, max_w):
    words, lines, cur = text.split(), [], ''
    for w in words:
        test = (cur + ' ' + w).strip()
        if draw.textlength(test, font=fnt) <= max_w or not cur:
            cur = test
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def clean(s):
    return re.sub(r'\s+', ' ', str(s or '')).strip()


def share_key(e):
    slug = clean(e.get('slug'))
    if clean(e.get('category')) == LEADERSHIP and re.fullmatch(r'[a-z0-9-]+', slug or ''):
        return slug
    return e['date']


def share_items(e):
    """Gems and charts in page order, numbered the way the site numbers them."""
    gems, charts, audits = [], [], []
    hidden = {'action_step', 'one_minute_win', 'declaration'}
    for s in e.get('sections') or []:
        key = clean(s.get('key')).lower()
        if key in hidden:
            continue
        blocks = s.get('blocks') or []
        if key in ('hidden_gems', 'gem'):
            for b in blocks:
                if b.get('type') in ('callout', 'quote') and clean(b.get('text')):
                    gems.append(clean(b['text']))
        for b in blocks:
            if b.get('type') == 'flow':
                steps = []
                for st in b.get('steps') or b.get('items') or []:
                    label = clean(st if isinstance(st, str) else st.get('label'))
                    if label and label not in ('↓', '→'):
                        steps.append(label)
                if len(steps) >= 2:
                    charts.append({'heading': clean(s.get('label')) or clean(b.get('title')) or 'Watch the Progression',
                                   'steps': steps, 'caption': clean(b.get('caption'))})
        if 'audit' in key:
            parts = audit_parts(blocks)
            if any(k == 'q' for k, _ in parts):
                audits.append({'heading': clean(s.get('label')) or 'The Audit', 'parts': parts})
    return gems, charts, audits


def audit_parts(blocks):
    parts = []
    for b in blocks:
        t = b.get('type')
        if t in ('bullet_list', 'numbered_list'):
            parts += [('q', clean(i)) for i in b.get('items') or [] if clean(i)]
        elif t == 'callout' and clean(b.get('text')):
            parts.append(('key', clean(b['text'])))
        elif t == 'lines':
            parts += [('note', clean(i)) for i in b.get('items') or [] if clean(i)]
        elif t in ('paragraph', 'quote', 'subhead') and clean(b.get('text')):
            parts.append(('note', clean(b['text'])))
    return parts


def headline(e):
    return clean(e.get('headline')) or clean(e.get('subtitle')) or clean(e.get('title'))


def footer(img, d):
    pad = 80
    d.text((pad, H - 92), 'thewrkshop.com', font=font(SANS, 26), fill=TAN)
    logo_path = os.path.join(ROOT, 'assets/images/thewrkshop-logo-share.png')
    if os.path.exists(logo_path):
        logo = Image.open(logo_path).convert('RGBA')
        lh = 92
        logo = logo.resize((int(logo.width * lh / logo.height), lh), Image.LANCZOS)
        img.paste(logo, (W - pad - logo.width, H - 60 - lh), logo)


def base(eyebrow):
    img = Image.new('RGB', (W, H), BROWN)
    d = ImageDraw.Draw(img)
    d.rectangle([28, 28, W - 29, H - 29], outline=(95, 72, 60), width=2)
    ef = font(SANS, 24)
    text = eyebrow.upper()
    while d.textlength(text, font=ef) > W - 160 and len(text) > 10:
        text = text[:-2].rstrip() + '…'
    d.text((80, 78), text, font=ef, fill=TAN)
    return img, d


def gem_card(e, text, out):
    img, d = base('Hidden Gem · ' + headline(e))
    q = text if re.search('[“”"]', text) else '“' + text + '”'
    pad, max_w = 80, W - 160
    top, bottom = 130, H - 140
    size = 64
    while True:
        f = font(SERIF, size, 'Bold')
        lines = wrap(d, q, f, max_w)
        if len(lines) * size * 1.25 <= bottom - top or size <= 30:
            break
        size -= 2
    block_h = len(lines) * size * 1.25
    y = top + (bottom - top - block_h) / 2
    for line in lines:
        d.text((pad, y), line, font=f, fill=CREAM)
        y += size * 1.25
    footer(img, d)
    img.save(out, 'JPEG', quality=86, optimize=True)


def chart_card(e, chart, out):
    img, d = base(headline(e))
    pad = 80
    tf = font(SERIF, 46, 'Bold')
    d.text((pad, 116), chart['heading'], font=tf, fill=CREAM)
    steps = chart['steps']
    n = len(steps)
    cols = 1 if n <= 4 else 2
    rows = -(-n // cols)
    area_top, area_bottom = 196, H - 166  # keep clear of the logo
    gap = 12
    col_w = (W - pad * 2 - (cols - 1) * 28) / cols
    row_h = min(64, (area_bottom - area_top - (rows - 1) * gap) / rows)
    base_size = 24 if row_h >= 52 else 21
    nf = font(SANS, 18)
    text_w = col_w - 64
    for i, label in enumerate(steps):
        c, r = (i // rows, i % rows)
        x = pad + c * (col_w + 28)
        y = area_top + r * (row_h + gap)
        last = i == n - 1
        t = 0 if n <= 2 else i / (n - 2)
        box_bg = TAN if last else tuple(int(255 + (v - 255) * t) for v in (234, 217, 200))
        d.rounded_rectangle([x, y, x + col_w, y + row_h], radius=10, fill=box_bg)
        d.text((x + 16, y + row_h / 2), f'{i + 1}', font=nf, fill=(138, 106, 82), anchor='lm')
        # fit the step: shrink, then use two lines, never cut words off
        size = base_size
        while size > 20 and d.textlength(label, font=font(SANS, size)) > text_w:
            size -= 1
        sf = font(SANS, size)
        lines = [label] if d.textlength(label, font=sf) <= text_w else wrap(d, label, sf, text_w)
        while len(lines) * size * 1.15 > row_h - 6 and size > 13:
            size -= 1
            sf = font(SANS, size)
            lines = wrap(d, label, sf, text_w)
        ly = y + row_h / 2 - (len(lines) - 1) * size * 1.15 / 2
        for line in lines:
            d.text((x + 48, ly), line, font=sf, fill=BROWN, anchor='lm')
            ly += size * 1.15
    footer(img, d)
    img.save(out, 'JPEG', quality=86, optimize=True)


def audit_card(e, audit, out):
    img, d = base(headline(e))
    pad, max_w = 80, W - 160
    d.text((pad, 116), audit['heading'], font=font(SERIF, 46, 'Bold'), fill=CREAM)
    qs = [t for k, t in audit['parts'] if k == 'q']
    keys = [t for k, t in audit['parts'] if k == 'key']
    d.text((pad, 186), f'{len(qs)} questions to ask yourself', font=font(SERIF_IT, 30, 'Italic'), fill=SOFT)
    feature = keys[-1] if keys else qs[-1]
    top, bottom = 250, H - 150
    size = 44
    while True:
        f = font(SANS, size)
        lines = wrap(d, feature, f, max_w - 40)
        if len(lines) * size * 1.25 + 40 <= bottom - top or size <= 24:
            break
        size -= 2
    box_h = len(lines) * size * 1.25 + 40
    top = top + (bottom - top - box_h) / 2
    d.rounded_rectangle([pad, top, W - pad, top + box_h], radius=14, fill=TAN)
    y = top + 20
    for line in lines:
        d.text((pad + 20, y), line, font=f, fill=BROWN)
        y += size * 1.25
    footer(img, d)
    img.save(out, 'JPEG', quality=86, optimize=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--force', action='store_true')
    a = ap.parse_args()
    made = skipped = 0
    for path in sorted(glob.glob(os.path.join(ROOT, 'content/daily/*.json'))):
        e = json.load(open(path, encoding='utf-8'))
        if not e.get('date'):
            continue
        gems, charts, audits = share_items(e)
        if not gems and not charts and not audits:
            continue
        out_dir = os.path.join(ROOT, 'assets/og/share', share_key(e))
        os.makedirs(out_dir, exist_ok=True)
        jobs = [(f'gem-{i + 1}.jpg', gem_card, g) for i, g in enumerate(gems)]
        jobs += [(f'chart-{i + 1}.jpg', chart_card, c) for i, c in enumerate(charts)]
        jobs += [(f'audit-{i + 1}.jpg', audit_card, a) for i, a in enumerate(audits)]
        for name, fn, item in jobs:
            out = os.path.join(out_dir, name)
            if os.path.exists(out) and not a.force:
                skipped += 1
                continue
            fn(e, item, out)
            made += 1
    print(f'made {made} share cards, skipped {skipped} existing')


if __name__ == '__main__':
    main()
