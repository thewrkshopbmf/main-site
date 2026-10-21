#!/usr/bin/env python3
"""Make the Starter Kit printables (letter size) linked from
sub-pages/resources/starter-kit.html.

Usage:
  python3 scripts/pdf/make-starter-kit.py

Writes:
  resources/meeting-agenda.pdf
  resources/scripture-reading-plan.pdf
  resources/accountability-pairs.pdf
  resources/group-covenant.pdf
  resources/facilitator-onepager.pdf
  downloads/thewrkshop-starter-pack.pdf   (all five in one file)

Not part of the Netlify build: edit the wording below, run it locally, commit the PDFs.
Needs: pip install reportlab pypdf, plus the Poppins and DejaVu Sans fonts (paths below).
"""
import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (BaseDocTemplate, Frame, PageTemplate, Paragraph, Spacer,
                                Table, TableStyle, KeepTogether)
from pypdf import PdfWriter, PdfReader

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
FONT_DIR = '/usr/share/fonts/truetype/google-fonts'
LOGO = os.path.join(ROOT, 'assets', 'images', 'thewrkshop-logo-transparent-trimmed.png')

BROWN = colors.HexColor('#3e2c23')
CREAM = colors.HexColor('#f4f1ee')
TAN = colors.HexColor('#c9aa8c')
MUTED = colors.HexColor('#6b5b53')
RULE = colors.HexColor('#ddd3ca')

for name, file in [('Pop', 'Poppins-Regular.ttf'), ('PopM', 'Poppins-Medium.ttf'),
                   ('PopB', 'Poppins-Bold.ttf'), ('PopI', 'Poppins-Italic.ttf')]:
    pdfmetrics.registerFont(TTFont(name, os.path.join(FONT_DIR, file)))
pdfmetrics.registerFont(TTFont('Box', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
pdfmetrics.registerFontFamily('Pop', normal='Pop', bold='PopB', italic='PopI', boldItalic='PopB')

S = {
    'h2': ParagraphStyle('h2', fontName='PopB', fontSize=12.5, leading=16, textColor=BROWN, spaceBefore=10, spaceAfter=4),
    'body': ParagraphStyle('body', fontName='Pop', fontSize=10, leading=14.5, textColor=colors.HexColor('#2b2b2b')),
    'small': ParagraphStyle('small', fontName='Pop', fontSize=8.8, leading=12.5, textColor=MUTED),
    'verse': ParagraphStyle('verse', fontName='PopI', fontSize=10, leading=14.5, textColor=BROWN),
    'cell': ParagraphStyle('cell', fontName='Pop', fontSize=9.3, leading=13, textColor=colors.HexColor('#2b2b2b')),
    'cellb': ParagraphStyle('cellb', fontName='PopB', fontSize=9.3, leading=13, textColor=BROWN),
    'th': ParagraphStyle('th', fontName='PopB', fontSize=8.5, leading=11, textColor=colors.white),
    'center': ParagraphStyle('center', fontName='Pop', fontSize=10, leading=14, alignment=TA_CENTER, textColor=MUTED),
}

W, H = letter
M = 0.7 * inch


def page_frame(title, subtitle):
    def draw(c, doc):
        c.saveState()
        band = 1.25 * inch
        c.setFillColor(BROWN)
        c.rect(0, H - band, W, band, stroke=0, fill=1)
        c.drawImage(LOGO, W - M - 0.95 * inch, H - band + 0.2 * inch, width=0.95 * inch,
                    height=0.95 * inch * 180 / 233, mask='auto')
        c.setFillColor(TAN)
        c.setFont('PopB', 8.5)
        c.drawString(M, H - 0.45 * inch, 'THEWRKSHOP  ·  STARTER KIT')
        c.setFillColor(CREAM)
        c.setFont('PopB', 21)
        c.drawString(M, H - 0.82 * inch, title)
        c.setFont('Pop', 9.5)
        c.drawString(M, H - 1.07 * inch, subtitle)
        c.setStrokeColor(RULE)
        c.setLineWidth(0.6)
        c.line(M, 0.6 * inch, W - M, 0.6 * inch)
        c.setFillColor(MUTED)
        c.setFont('Pop', 8)
        c.drawString(M, 0.42 * inch, 'thewrkshop.com')
        c.drawRightString(W - M, 0.42 * inch, '“Your word is a lamp to my feet and a light to my path.” — Psalm 119:105')
        c.restoreState()
    return draw


def build(path, title, subtitle, story):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    doc = BaseDocTemplate(path, pagesize=letter, title=f'{title} | TheWrkShop', author='TheWrkShop',
                          subject='TheWrkShop Starter Kit', leftMargin=M, rightMargin=M,
                          topMargin=1.25 * inch + 0.3 * inch, bottomMargin=0.85 * inch)
    frame = Frame(M, 0.85 * inch, W - 2 * M, H - 1.55 * inch - 0.85 * inch, id='f',
                  leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
    doc.addPageTemplates([PageTemplate(id='p', frames=[frame], onPage=page_frame(title, subtitle))])
    doc.build(story)
    return path


def P(text, style='body'):
    return Paragraph(text, S[style])


def table(rows, widths, header=True, row_heights=None, zebra=True):
    t = Table(rows, colWidths=widths, rowHeights=row_heights, repeatRows=1 if header else 0)
    style = [
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 7), ('RIGHTPADDING', (0, 0), (-1, -1), 7),
        ('TOPPADDING', (0, 0), (-1, -1), 5), ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LINEBELOW', (0, 0), (-1, -1), 0.5, RULE),
        ('BOX', (0, 0), (-1, -1), 0.6, RULE),
    ]
    if header:
        style += [('BACKGROUND', (0, 0), (-1, 0), BROWN)]
    if zebra:
        for i in range(1 if header else 0, len(rows)):
            if i % 2 == 0:
                style.append(('BACKGROUND', (0, i), (-1, i), CREAM))
    t.setStyle(TableStyle(style))
    return t


def lines(label, n=1, width=None):
    width = width or (W - 2 * M)
    rows = [[P(label, 'cellb') if i == 0 else '', ''] for i in range(n)]
    t = Table(rows, colWidths=[1.35 * inch, width - 1.35 * inch], rowHeights=[0.32 * inch] * n)
    t.setStyle(TableStyle([('LINEBELOW', (1, 0), (1, -1), 0.6, TAN), ('VALIGN', (0, 0), (-1, -1), 'BOTTOM'),
                           ('LEFTPADDING', (0, 0), (-1, -1), 0), ('BOTTOMPADDING', (0, 0), (-1, -1), 3)]))
    return t


CW = W - 2 * M
BOX = '<font name="Box" color="#6b5b53">☐</font>'  # Poppins has no checkbox glyph


# ---------- 1. Meeting Agenda ----------
def meeting_agenda():
    head = Table([[lines('Date', 1, CW / 2 - 6), lines('Facilitator', 1, CW / 2 - 6)],
                  [lines('Passage', 1, CW / 2 - 6), lines('Location', 1, CW / 2 - 6)]],
                 colWidths=[CW / 2, CW / 2])
    head.setStyle(TableStyle([('LEFTPADDING', (0, 0), (-1, -1), 0), ('RIGHTPADDING', (0, 0), (-1, -1), 12)]))
    flow = [
        [P('TIME', 'th'), P('SEGMENT', 'th'), P('WHAT HAPPENS', 'th'), P('NOTES', 'th')],
        [P('3–5 min', 'cellb'), P('<b>Open</b>', 'cell'), P('Gratitude and prayer.', 'cell'), ''],
        [P('10–15 min', 'cellb'), P('<b>Wins &amp; weights</b>', 'cell'), P('Each man shares one win and one weight from the week.', 'cell'), ''],
        [P('5 min', 'cellb'), P('<b>Read</b>', 'cell'), P('Read the passage aloud twice.', 'cell'), ''],
        [P('15–20 min', 'cellb'), P('<b>Reflect</b>', 'cell'), P('What does this reveal about God? About us?', 'cell'), ''],
        [P('10 min', 'cellb'), P('<b>Respond</b>', 'cell'), P('One next step, one accountability partner.', 'cell'), ''],
        [P('10 min', 'cellb'), P('<b>Pray</b>', 'cell'), P('Short, specific prayers.', 'cell'), ''],
    ]
    steps = [[P('NAME', 'th'), P('MY NEXT STEP THIS WEEK', 'th'), P('PARTNER', 'th')]] + \
            [['', '', ''] for _ in range(8)]
    story = [
        head, Spacer(1, 10),
        P('Gather: 60–75 minutes', 'h2'),
        table(flow, [0.95 * inch, 1.45 * inch, 2.75 * inch, CW - 5.15 * inch]),
        Spacer(1, 6),
        P('Keep the Word central, ask good questions, and keep steps small and specific.', 'small'),
        P('Next steps', 'h2'),
        table(steps, [1.6 * inch, CW - 3.2 * inch, 1.6 * inch], row_heights=[None] + [0.34 * inch] * 8, zebra=False),
        Spacer(1, 8),
        P('Mid-week check-in: send a 30-second voice or text, “How can I pray? What step did you take?”', 'small'),
    ]
    return build(os.path.join(ROOT, 'resources', 'meeting-agenda.pdf'), 'Meeting Agenda',
                 'One page for each gathering. Print one per week.', story)


# ---------- 2. 4-Week Reading Plan ----------
WEEKS = [
    ('Week 1', 'Foundation', 'Matthew 7:24–27', 'Set expectations and read the passage together.'),
    ('Week 2', 'Formation', 'Romans 12:1–2', 'Identify one habit to start and one to surrender.'),
    ('Week 3', 'Fellowship', 'Hebrews 10:24–25', 'Each man shares a testimony in 2 minutes.'),
    ('Week 4', 'Faith-in-Action', 'James 1:22–25', 'Plan a simple serve together (1 hour).'),
]


def reading_plan():
    story = [P('Carry one passage all week. Read it each day, Monday through Saturday, then bring what you noticed to the group.', 'body'), Spacer(1, 6)]
    for wk, theme, ref, focus in WEEKS:
        days = Table([[P(f'{BOX} {d}', 'cell') for d in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']]],
                     colWidths=[CW / 6] * 6)
        days.setStyle(TableStyle([('LEFTPADDING', (0, 0), (-1, -1), 0)]))
        block = [
            P(f'{wk} — {theme}', 'h2'),
            P(f'<b>{ref}</b>   ·   {focus}', 'body'), Spacer(1, 4),
            days, Spacer(1, 2),
            lines('What I noticed', 1), lines('My step', 1),
        ]
        story.append(KeepTogether(block))
    story += [Spacer(1, 6), P('Ongoing: repeat the rhythm, rotate facilitators, keep steps small and specific.', 'small')]
    return build(os.path.join(ROOT, 'resources', 'scripture-reading-plan.pdf'), '4-Week Reading Plan',
                 'One Scripture to carry all week, for the first month of your group.', story)


# ---------- 3. Accountability Pairs Guide ----------
def accountability_pairs():
    how = [
        [P('1', 'cellb'), P('<b>Pair up at the Respond step.</b> Each man names one next step and one accountability partner before the group prays.', 'cell')],
        [P('2', 'cellb'), P('<b>Check in mid-week.</b> Send a 30-second voice or text message, “How can I pray? What step did you take?”', 'cell')],
        [P('3', 'cellb'), P('<b>Pray specifically.</b> Pray for the request your partner gives you, by name, before the next gathering.', 'cell')],
        [P('4', 'cellb'), P('<b>Report back.</b> At the next gathering, share how your step went, wins and weights.', 'cell')],
    ]
    rules = [
        [P('<b>Grace + truth.</b> Be honest and be kind. Neither one without the other.', 'cell')],
        [P('<b>Confidentiality.</b> What your partner shares stays between you.', 'cell')],
        [P('<b>Show up.</b> Reply to the check-in, even when the week went badly.', 'cell')],
        [P('<b>Act on the Word.</b> Keep steps small and specific, so you can both tell whether it happened.', 'cell')],
    ]
    log = [[P('WEEK', 'th'), P('MY STEP', 'th'), P('PARTNER’S STEP', 'th'), P('PRAYER REQUEST', 'th'), P('CHECKED IN', 'th')]] + \
          [[P(str(i), 'cellb'), '', '', '', P(BOX, 'cell')] for i in range(1, 5)]
    story = [
        lines('My partner', 1), Spacer(1, 4),
        P('How it works', 'h2'),
        table(how, [0.35 * inch, CW - 0.35 * inch], header=False),
        P('Ground rules', 'h2'),
        table(rules, [CW], header=False),
        P('Pair log', 'h2'),
        table(log, [0.6 * inch, 1.65 * inch, 1.65 * inch, CW - 4.9 * inch, 1.0 * inch],
              row_heights=[None] + [0.5 * inch] * 4, zebra=False),
    ]
    return build(os.path.join(ROOT, 'resources', 'accountability-pairs.pdf'), 'Accountability Pairs Guide',
                 'Two men, one step each, one check-in every week.', story)


# ---------- 4. Group Covenant ----------
def group_covenant():
    commits = [
        ('Grace + truth', 'We will tell each other the truth, and we will do it with grace.'),
        ('Confidentiality', 'What is shared in this group stays in this group.'),
        ('Show up', 'We will make this gathering a priority and be present when we are here.'),
        ('Act on the Word', 'We will not just hear Scripture. We will take one step on what it says.'),
    ]
    rows = [[P(f'<b>{t}</b>', 'cellb'), P(d, 'cell')] for t, d in commits]
    sig = [[P('NAME', 'th'), P('SIGNATURE', 'th'), P('DATE', 'th')]] + [['', '', ''] for _ in range(8)]
    story = [
        P('As men in this group, we commit to one another and to God:', 'body'), Spacer(1, 6),
        table(rows, [1.5 * inch, CW - 1.5 * inch], header=False),
        Spacer(1, 6),
        P('“Do not merely listen to the word, and so deceive yourselves. Do what it says.” — James 1:22', 'verse'),
        Spacer(1, 4),
        lines('Group', 1), lines('Start date', 1),
        P('Signed', 'h2'),
        table(sig, [2.2 * inch, CW - 3.4 * inch, 1.2 * inch], row_heights=[None] + [0.36 * inch] * 8, zebra=False),
    ]
    return build(os.path.join(ROOT, 'resources', 'group-covenant.pdf'), 'Group Covenant',
                 'Grace + truth. Confidentiality. Show up. Act on the Word.', story)


# ---------- 5. Facilitator One-Pager ----------
def facilitator():
    before = [
        f'{BOX} Pray for each man by name.',
        f'{BOX} Choose the passage (see the 4-Week Reading Plan for the first month).',
        f'{BOX} Read it yourself at least twice. Note one thing it shows about God and one about us.',
        f'{BOX} Print the Meeting Agenda.',
    ]
    during = [
        [P('3–5 min', 'cellb'), P('<b>Open</b>: gratitude and prayer', 'cell')],
        [P('10–15 min', 'cellb'), P('<b>Wins &amp; weights</b>: one of each, per man', 'cell')],
        [P('5 min', 'cellb'), P('<b>Read</b>: the passage aloud twice', 'cell')],
        [P('15–20 min', 'cellb'), P('<b>Reflect</b>: What does this reveal about God? About us?', 'cell')],
        [P('10 min', 'cellb'), P('<b>Respond</b>: one next step, one accountability partner', 'cell')],
        [P('10 min', 'cellb'), P('<b>Pray</b>: short, specific prayers', 'cell')],
    ]
    after = [
        f'{BOX} Send the mid-week check-in: “How can I pray? What step did you take?”',
        f'{BOX} Confirm next week’s facilitator. Rotate so every man learns to lead.',
    ]
    tips = [
        [P('<b>You don’t need to be a Bible expert.</b> Keep the Word central, ask good questions, and model obedience.', 'cell')],
        [P('<b>Keep it small.</b> 3–8 men is ideal: big enough for energy, small enough for honesty.', 'cell')],
        [P('<b>Keep steps small and specific.</b> “Pray more” is hard to check. “Read Romans 12 each morning before work” isn’t.', 'cell')],
        [P('<b>Keep momentum</b> with the weekly rhythm, clear next steps, and mid-week check-ins.', 'cell')],
    ]
    story = [
        P('Before', 'h2'), *[P(b, 'body') for b in before],
        P('During (60–75 minutes)', 'h2'), table(during, [1.0 * inch, CW - 1.0 * inch], header=False),
        P('After', 'h2'), *[P(a, 'body') for a in after],
        P('Remember', 'h2'), table(tips, [CW], header=False),
    ]
    return build(os.path.join(ROOT, 'resources', 'facilitator-onepager.pdf'), 'Facilitator One-Pager',
                 'Everything you need to lead any week.', story)


def main():
    files = [meeting_agenda(), reading_plan(), accountability_pairs(), group_covenant(), facilitator()]
    w = PdfWriter()
    for f in files:
        for p in PdfReader(f).pages:
            w.add_page(p)
    w.add_metadata({'/Title': 'Starter Pack | TheWrkShop', '/Author': 'TheWrkShop'})
    out = os.path.join(ROOT, 'downloads', 'thewrkshop-starter-pack.pdf')
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, 'wb') as fh:
        w.write(fh)
    for f in files + [out]:
        print('wrote', os.path.relpath(f, ROOT), len(PdfReader(f).pages), 'page(s)')


if __name__ == '__main__':
    main()
