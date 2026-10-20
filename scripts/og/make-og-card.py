#!/usr/bin/env python3
"""Make a 1200x630 social preview card (Open Graph image) for a daily.

Usage:
  python3 scripts/og/make-og-card.py --eyebrow "THE BATTLE BEFORE THE BATTLE" \
      --title "What the Leader Rewards" \
      --tagline "Your stated values describe..." \
      --out assets/og/what-the-leader-rewards.png

Not part of the Netlify build: run it locally when adding a post that should
have its own card, then set "og_image" in the post's JSON to the output path.
"""
import argparse
import os
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
BROWN = (62, 44, 35)
CREAM = (244, 241, 238)
TAN = (201, 170, 140)
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))

SERIF = '/usr/share/fonts/truetype/google-fonts/Lora-Variable.ttf'
SERIF_IT = '/usr/share/fonts/truetype/google-fonts/Lora-Italic-Variable.ttf'
SANS = '/usr/share/fonts/opentype/inter/InterDisplay-SemiBold.otf'


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
        if draw.textlength(test, font=fnt) <= max_w:
            cur = test
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--eyebrow', default='THE DAILY')
    ap.add_argument('--title', required=True)
    ap.add_argument('--tagline', default='')
    ap.add_argument('--out', required=True)
    a = ap.parse_args()

    img = Image.new('RGB', (W, H), BROWN)
    d = ImageDraw.Draw(img)
    pad = 80
    max_w = W - pad * 2

    # thin inner frame
    d.rectangle([28, 28, W - 29, H - 29], outline=(95, 72, 60), width=2)

    y = 92
    eyebrow = font(SANS, 26)
    d.text((pad, y), a.eyebrow.upper(), font=eyebrow, fill=TAN, spacing=4)
    y += 54

    # title: shrink until it fits in 2 lines
    size = 86
    while True:
        tf = font(SERIF, size, 'Bold')
        tl = wrap(d, a.title, tf, max_w)
        if len(tl) <= 2 or size <= 54:
            break
        size -= 4
    for line in tl:
        d.text((pad, y), line, font=tf, fill=CREAM)
        y += int(size * 1.18)

    if a.tagline:
        y += 18
        d.line([pad, y, pad + 90, y], fill=TAN, width=3)
        y += 30
        size = 34
        while True:
            gf = font(SERIF_IT, size, 'Italic')
            gl = wrap(d, a.tagline, gf, max_w)
            if y + len(gl) * size * 1.4 < H - 120 or size <= 24:
                break
            size -= 2
        for line in gl:
            d.text((pad, y), line, font=gf, fill=(226, 216, 206))
            y += int(size * 1.4)

    # footer
    foot = font(SANS, 26)
    d.text((pad, H - 92), 'thewrkshop.com', font=foot, fill=TAN)
    logo_path = os.path.join(ROOT, 'assets/images/thewrkshop-logo-transparent-trimmed.png')
    if os.path.exists(logo_path):
        logo = Image.open(logo_path).convert('RGBA')
        lh = 92
        logo = logo.resize((int(logo.width * lh / logo.height), lh))
        img.paste(logo, (W - pad - logo.width, H - 60 - lh), logo)

    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    img.save(a.out, optimize=True)
    print('wrote', a.out)


if __name__ == '__main__':
    main()
