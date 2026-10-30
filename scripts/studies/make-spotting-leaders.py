#!/usr/bin/env python3
"""Builds the leader guide "Spotting Leaders: What's in His Hand?".

Usage:
  python3 scripts/studies/make-spotting-leaders.py          # HTML page
  python3 scripts/studies/make-spotting-leaders.py --pdf    # HTML page + PDF (needs Python Playwright)

Writes:
  studies/spotting-leaders/index.html
  downloads/spotting-leaders-guide.pdf

Reuses the page shell, share bar and PDF settings from make-reflex-vs-response.py.
Not part of the Netlify build: edit the wording below, run it locally, commit the output.
"""
import importlib.util
import os
import sys

HERE = os.path.dirname(__file__)
spec = importlib.util.spec_from_file_location('studies', os.path.join(HERE, 'make-reflex-vs-response.py'))
S = importlib.util.module_from_spec(spec)
spec.loader.exec_module(S)

SLUG = 'spotting-leaders'
PATH = f'studies/{SLUG}/'
TITLE = 'Spotting Leaders: What’s in His Hand?'
PDF = f'/downloads/{SLUG}-guide.pdf'

SIGNALS = [
    ('His staff', 'He quietly fixes what’s broken: stacks the chairs, follows up on the guy who missed, notices what nobody assigned.'),
    ('His sling', 'He’s faithful in small, hidden things, week after week, whether or not anyone sees (Luke 16:10).'),
    ('His voice', 'Other men lean in when he talks. His questions open the room instead of closing it.'),
    ('His story', 'He’s willing to go first with his own failure, which makes it safe for others to be honest.'),
    ('His scars', 'He moves toward men who are hurting instead of away from them.'),
    ('His people', 'He invites others. He brings a coworker or a neighbor. Men follow him in the door.'),
    ('His yes', 'He shows up, and he says yes to small things before he’s offered big ones.'),
    ('His teachability', 'He receives correction without defending himself, and you see him apply it (Proverbs 9:9).'),
]
CAUTIONS = [
    'He wants the title before the towel.',
    'He talks more than he listens, or needs to be the expert in every discussion.',
    'He shares other men’s stories that weren’t his to share.',
    'He controls, corrects or competes with the leader.',
    'There’s an unaddressed pattern (anger, drinking, lust, dishonesty) he isn’t walking out with anyone.',
    'His home life is in crisis and needs his attention first (1 Timothy 3:4–5).',
]
LADDER = [
    ('Invite', 'Give him one small, specific assignment: open in prayer, read the passage aloud, follow up with a man who missed, or lead one discussion question.'),
    ('Observe', 'Watch what comes out. Does he prepare? Does he make it about himself or about the men? How does he handle it when it doesn’t go well?'),
    ('Debrief', 'Within a few days, ask: “What did you notice? What was that like for you?” Affirm what you saw, name one thing to grow in, and pray for him.'),
    ('Increase', 'If he was faithful, give him a little more: co-lead a session, host a breakout, or walk with a newer man. If not, stay at this step and keep investing.'),
]
INTAKE = [
    ('What’s in your hand?', 'Ask him to walk you through his inventory: skills, what’s in his house, what he’s been trained in, who listens to him, his story, his scars, his people, his yes.', 'Listen for: specifics, ownership, and things he mentions almost as an afterthought. The gold is often in what he dismisses.'),
    ('Which one have you called “not enough”?', 'Ask which one he usually discounts, and what he tells himself about it.', 'Listen for: the excuse. “Too small,” “not qualified,” “my past.” Name God’s answer to it from Scripture, gently.'),
    ('What are you holding back?', 'Ask what he might be gripping that God is asking him to open.', 'Listen for: honesty. A man who can name what he’s holding back is usually ready for the next step.'),
    ('Who’s already in front of you?', 'Ask who he already notices, cares about or is around every week.', 'Listen for: men who already have “people.” Leaders usually have someone following before they have a title.'),
    ('What’s one step?', 'Ask what one step he’ll take this week, and offer one small invitation in the group.', 'Listen for: a yes to something small. That yes is the first micro-signal.'),
]


def body():
    sig = ''.join(f'<tr><td><strong>{a}</strong></td><td>{b}</td></tr>' for a, b in SIGNALS)
    cau = ''.join(f'<li>{c}</li>' for c in CAUTIONS)
    lad = ''.join(f'<li><strong>{a}.</strong> {b}</li>' for a, b in LADDER)
    intake = ''.join(f'<div class="st-ask"><strong>{i + 1}. {q}</strong><p>{d}</p><p class="pt-small pt-muted">{l}</p></div>' for i, (q, d, l) in enumerate(INTAKE))
    rows = ''.join('<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>' for _ in range(6))
    h = S.hero('<a href="/resources.html">Resources</a> / <a href="/studies/">Group Studies</a> / Spotting Leaders',
               'Leader guide · For group leaders and coaches', 'Spotting leaders: <em>what’s in his hand?</em>',
               'How to use the What’s in Your Hand? inventory in intake calls and men’s groups to see which men God is already raising up, and how to call it out of them.')
    return h + f"""
    <section class="st-section">
      <div class="pt-narrow st-guide">
        {S.share_bar(PATH, TITLE, PDF, 'Guide PDF')}
        <div class="st-card">
          <h3>The big idea</h3>
          <p>God almost never starts with what a man doesn’t have. He starts with what’s already in his hand. The same is true when you’re looking for leaders. The men God is raising up are usually already serving in small ways before anyone gives them a title. Your job isn’t to manufacture leaders. It’s to notice what God has already put in a man’s hand, invite it out, and walk with him as it grows.</p>
          <p>This guide uses TheWrkShop’s Potential Activation approach: watch for <strong>micro-signals</strong>, then use <strong>intentional provocation</strong>, small, specific invitations that draw out what’s already there.</p>
          {S.verse('2 Timothy 2:2', 'And the things you have heard me say in the presence of many witnesses entrust to reliable people who will also be qualified to teach others.')}
          {S.verse('Luke 16:10', 'Whoever can be trusted with very little can also be trusted with much, and whoever is dishonest with very little will also be dishonest with much.')}
        </div>

        <h2>1. In intake calls</h2><span class="st-min">20-minute call or Google Meet</span>
        <p>Send the man the link before the call (thewrkshop.com/tools/whats-in-your-hand/) and ask him to take it, or walk through it together on the call. His answers stay in his browser, so let him share only what he chooses. Then use these five questions:</p>
        {intake}
        <p class="pt-small pt-muted">After a loss, a veteran, a young man or a couple? Send the version that fits: add #after-loss, #veterans, #young-men or #couples to the end of the link.</p>

        <h2>2. Micro-signals to watch for</h2>
        <p>In the group, over weeks, watch for these. One signal means little. Several, repeated over time, usually mean God is raising a man up.</p>
        <table class="st-table"><thead><tr><th>What’s in his hand</th><th>What it looks like</th></tr></thead><tbody>{sig}</tbody></table>
        <h3>Signals to slow down</h3>
        <p>None of these disqualify a man forever. They mean “not yet,” and they show you where to invest first.</p>
        <ul>{cau}</ul>
        {S.verse('1 Timothy 5:22', 'Do not be hasty in the laying on of hands.')}

        <h2>3. Intentional provocation: the invitation ladder</h2>
        <p>Don’t wait for a man to volunteer. Most men who are ready never will. Give small, specific invitations that reveal what’s there, one rung at a time.</p>
        <ol class="st-steps">{lad}</ol>
        <p>Jesus called the twelve first “that they might be with him” (Mark 3:14), then sent them out. Start with time together, then responsibility.</p>

        <h2>4. The “I see something in you” conversation</h2>
        <p>When you’ve seen several signals and a few faithful steps, tell him. Be specific, and connect it to what’s in his hand.</p>
        {S.say('“I want to tell you what I’ve been noticing. When you ________, the other guys ________. That’s not small. I think God has put something in your hand.”', '“Would you be open to ________ with me for the next few weeks? No title, no pressure. Just walk with me and let’s see what God does.”', '“What would make that hard for you? What do you need from me?”')}
        <p>Close by praying over him, out loud, by name. Many men have never been told what someone sees in them.</p>

        <h2>5. In a group session</h2>
        <p>Run What’s in Your Hand? as a group night: men take it privately beforehand, then use the group guide on the tool page (thewrkshop.com/tools/whats-in-your-hand/). Pay attention to who encourages other men’s answers, who names something specific, and who says yes to a step. Those are often your next leaders.</p>

        <h2>6. Your leader-spotting tracker</h2>
        <p>Keep it simple and private. Review it monthly and pray through each name.</p>
        <table class="st-table"><thead><tr><th>Name</th><th>What’s in his hand</th><th>Signals I’ve seen</th><th>Next small invitation</th><th>Debrief notes</th></tr></thead><tbody>{rows}</tbody></table>

        <div class="st-gem">Formation was never the finish line. God forms men to send them.</div>
        <div class="st-card pt-no-print"><h3>Related</h3>
          <p><a href="/tools/whats-in-your-hand/">What’s in Your Hand?</a> · <a href="/assessment.html">Spiritual Gifts Assessment</a> · <a href="/sub-pages/resources/starter-kit.html">Starter Kit</a> · <a href="/questions/how-to-start-a-mens-group/">How do I start a men’s group?</a></p>
        </div>
        {S.rights()}
      </div>
    </section>"""


if __name__ == '__main__':
    html_out = S.page(PATH, TITLE, 'A free guide for men’s group leaders and coaches: use the What’s in Your Hand? inventory in intake calls and groups to spot the men God is raising up, with micro-signals, an invitation ladder and a tracker.', body(), og='/assets/og/spotting-leaders.png')
    S.write(f'{PATH}index.html', html_out)
    if '--pdf' in sys.argv:
        S.make_pdfs([(PATH, PDF.lstrip('/'))])
