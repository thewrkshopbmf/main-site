#!/usr/bin/env python3
"""Builds the Group Studies hub and the "Reflex vs. Response" kit.

Usage:
  python3 scripts/studies/make-reflex-vs-response.py          # HTML pages
  python3 scripts/studies/make-reflex-vs-response.py --pdf    # HTML pages + PDFs (needs Python Playwright)

Writes:
  studies/index.html                                  (Group Studies hub)
  studies/reflex-vs-response/index.html               (kit overview)
  studies/reflex-vs-response/leader-guide/index.html  (full leader guide, print-friendly)
  studies/reflex-vs-response/handout/index.html       (participant handout + 7-day Reflex Journal)
  downloads/reflex-vs-response-leader-guide.pdf
  downloads/reflex-vs-response-handout.pdf

Not part of the Netlify build: edit the wording below, run it locally, commit the output.
To add another study, copy this file and change the content; add its card to KITS in the hub.
"""
import html
import os
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
SITE = 'https://thewrkshop.com'
SLUG = 'reflex-vs-response'
TITLE = 'The Reflex vs. the Response'
SUB = 'What Comes Out of You First?'

GA = """  <script async src="https://www.googletagmanager.com/gtag/js?id=G-N48478JV2Z"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-N48478JV2Z');</script>"""

FOOTER = """  <footer>
    <div class="footer-content">
      <nav class="footer-links" aria-label="Browse">
        <a href="/upstream/">Start Here</a>
        <a href="/daily.html">The Daily</a>
        <a href="/leadership/">Leadership</a>
        <a href="/get-known.html">Groups</a>
        <a href="/library/">Library</a>
        <a href="/blog-archive.html">Blog</a>
        <a href="/podcasts.html">Podcast</a>
        <a href="/resources.html">Resources</a>
        <a href="/#contact">Contact</a>
        <a href="/privacy/">Privacy</a>
      </nav>
      <div class="footer-logo"><img src="/assets/images/thewrkshop-logo-transparent-trimmed.png" alt="TheWrkShop" width="233" height="180" loading="lazy"></div>
      <p>&copy; 2026 <span class="sitename"></span>. All rights reserved.</p>
    </div>
  </footer>

  <script src="/script.js"></script>
  <script src="/studies/studies.js?v=1"></script>"""


def page(path, title, desc, body, og='/assets/og/reflex-vs-response.png', schema_type='Article'):
    url = f'{SITE}/{path}'
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>{html.escape(title)} | TheWrkShop</title>
  <link rel="stylesheet" href="/style.css"/>
  <link rel="stylesheet" href="/patterns/patterns.css"/>
  <link rel="stylesheet" href="/studies/studies.css?v=1"/>
  <link rel="icon" type="image/x-icon" href="/assets/favicon/favicon.ico?v=2">
  <meta name="description" content="{html.escape(desc)}"/>
  <link rel="canonical" href="{url}"/>
  <meta property="og:site_name" content="TheWrkShop"/>
  <meta property="og:type" content="article"/>
  <meta property="og:title" content="{html.escape(title)}"/>
  <meta property="og:description" content="{html.escape(desc)}"/>
  <meta property="og:url" content="{url}"/>
  <meta property="og:image" content="{SITE}{og}"/>
  <meta property="og:image:width" content="1200"/>
  <meta property="og:image:height" content="630"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <script type="application/ld+json">
{{"@context":"https://schema.org","@type":"{schema_type}","name":{json_str(title)},"headline":{json_str(title)},"description":{json_str(desc)},"url":"{url}","inLanguage":"en-US","isAccessibleForFree":true,"publisher":{{"@id":"{SITE}/#organization","@type":"Organization","name":"TheWrkShop","url":"{SITE}"}},"isPartOf":{{"@id":"{SITE}/#website"}}}}
  </script>
{GA}
</head>
<body class="pt-page st-page">
  <div id="site-header"></div>
  <main>
    <div class="pt-narrow">{PRINT_BRAND}</div>
{body}
  </main>

{FOOTER}
</body>
</html>
"""


def json_str(s):
    import json
    return json.dumps(s, ensure_ascii=False)


def hero(crumbs, eyebrow, h1, lead):
    return f"""    <section class="pt-hero">
      <div class="pt-narrow">
        <nav class="pt-crumbs" aria-label="Breadcrumb">{crumbs}</nav>
        <span class="pt-eyebrow">{eyebrow}</span>
        <h1 class="pt-h1">{h1}</h1>
        <p class="pt-lead">{lead}</p>
      </div>
    </section>"""


RIGHTS = '© 2026 TheWrkShop · thewrkshop.com. Free to copy and use in your church or men’s group. Please don’t sell, edit or republish it without permission.'


def share_bar(path, title, pdf=None, pdf_label='Download PDF'):
    from urllib.parse import quote
    url = f'{SITE}/{path}'
    t, u = quote(title), quote(url)
    pdf_btn = f'<a class="st-share-pdf" href="{pdf}">{pdf_label}</a>' if pdf else ''
    return (f'<div class="st-share" data-url="{url}" data-title="{html.escape(title)}" aria-label="Share or print">'
            f'<span class="st-share-label">Share</span>'
            f'<button type="button" data-share="native">Share…</button>'
            f'<button type="button" data-share="copy">Copy link</button>'
            f'<a href="sms:?&amp;body={t}%20{u}">Text</a>'
            f'<a href="mailto:?subject={t}&amp;body={u}">Email</a>'
            f'<button type="button" data-share="print">Print</button>{pdf_btn}</div>')


PRINT_BRAND = ('<div class="st-print-brand"><img src="/assets/images/thewrkshop-logo-transparent-trimmed.png" alt="TheWrkShop">'
               '<span>thewrkshop.com</span></div>')


def rights():
    return f'<p class="st-rights">{RIGHTS}</p>'


def say(*lines):
    return '<div class="st-say">' + ''.join(f'<p>{l}</p>' for l in lines) + '</div>'


def ask(*qs, label='Ask the room'):
    return '<div class="st-ask"><strong>' + label + '</strong>' + ''.join(f'<p>{q}</p>' for q in qs) + '</div>'


def verse(ref, text):
    return f'<blockquote class="st-verse">“{text}”<cite>{ref} (NIV)</cite></blockquote>'


LUKE645 = ('Luke 6:45', 'A good man brings good things out of the good stored up in his heart, and an evil man brings evil things out of the evil stored up in his heart. For the mouth speaks what the heart is full of.')
GAL522 = ('Galatians 5:22–23', 'But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control. Against such things there is no law.')
ROM122 = ('Romans 12:2', 'Do not conform to the pattern of this world, but be transformed by the renewing of your mind. Then you will be able to test and approve what God’s will is—his good, pleasing and perfect will.')
JOHN146 = ('John 14:6', 'Jesus answered, “I am the way and the truth and the life. No one comes to the Father except through me.”')

TIMELINE = [
    ('5 min', 'Opening atmosphere and leader opening'),
    ('3 min', 'Opening prayer'),
    ('10 min', 'Icebreaker: what frustrates you fast?'),
    ('30 min', 'Core study: five short teaching parts with discussion'),
    ('10 min', 'The 3-Second Reflex Interrupt'),
    ('7 min', 'Group activation: one reflex, one new response'),
    ('20 min', 'Breakout groups (optional)'),
    ('5 min', 'Closing, prayer and the week’s challenge'),
]

INTERRUPT = [
    ('Pause', 'Not forever. Just three seconds. Most damage happens fast.'),
    ('Notice', 'What rose first? Anger, fear, control, defensiveness, withdrawal?'),
    ('Name it', 'Ask, “What is this revealing in me?” Not, “What did they do?”'),
    ('Replace it', 'Flesh says, “I need control.” The Spirit says, “Trust God.” Flesh says, “Defend yourself.” The Spirit says, “Respond with wisdom.” Flesh says, “Escalate.” The Spirit says, “Slow down.”'),
    ('Repeat', 'New reflexes are built through repetition under pressure.'),
]

SWAPS = [('Anger', 'Patience'), ('Withdrawal', 'Presence'), ('Defensiveness', 'Humility'), ('Control', 'Trust'), ('Sarcasm', 'Gentleness'), ('Panic', 'Peace')]


def leader_guide():
    tl = ''.join(f'<li><strong>{t}</strong><span>{d}</span></li>' for t, d in TIMELINE)
    steps = ''.join(f'<li><strong>{n}.</strong> {d}</li>' for n, d in INTERRUPT)
    swaps = ''.join(f'<tr><td>{a}</td><td>{b}</td></tr>' for a, b in SWAPS)
    body = hero('<a href="/resources.html">Resources</a> / <a href="/studies/">Group Studies</a> / <a href="/studies/reflex-vs-response/">Reflex vs. Response</a> / Leader guide',
                'Leader guide · One session · 60–90 minutes', f'{TITLE}: <em>leader guide</em>',
                'Everything you need to lead the session, word for word where it helps. Print it, or open it on your phone while you lead.')
    body += f"""
    <section class="st-section">
      <div class="pt-narrow st-guide">
        {share_bar(f'studies/{SLUG}/leader-guide/', f'{TITLE}: Leader Guide', '/downloads/reflex-vs-response-leader-guide.pdf', 'Leader guide PDF')}

        <div class="st-card"><h3>The big idea</h3>
          <p>Character isn’t revealed in calm moments. It’s revealed in interruption, because interruption bypasses performance. Pressure doesn’t create what’s in a man. It reveals it. Tonight isn’t about behavior modification. It’s about discovering what each man’s soul has been practicing underneath the surface, and inviting Jesus to form new reflexes.</p>
          <h3>Session at a glance</h3><ul class="st-time">{tl}</ul>
          <p class="pt-small pt-muted">Short on time? Skip the breakouts for a 70-minute session, or teach Parts 1, 2 and 4 only for 60 minutes.</p>
          <h3>Before you meet</h3>
          <ul><li>Print a handout for each man, or text the link: thewrkshop.com/studies/reflex-vs-response/handout/</li><li>Have a whiteboard or large paper for the flow diagram.</li><li>Pray through Luke 6:45 yourself. Know your own first reflex before you ask anyone else for theirs.</li><li>Set the tone: what’s shared in the room stays in the room.</li></ul>
        </div>

        <h2>Opening atmosphere</h2><span class="st-min">5 minutes</span>
        <p>Chairs in a circle or semi-circle. Phones down, Bibles open. Slow the room down on purpose. Quiet instrumental worship while men settle in is optional.</p>
        <h3>Leader opening (read slowly)</h3>
        {say('Most men don’t realize who they really are until life interrupts them.', 'Anybody can look patient when nothing goes wrong. Anybody can look peaceful when life is smooth. Anybody can sound spiritual when there’s no pressure.', 'But interruption exposes formation.', 'Tonight isn’t about behavior modification. It’s about discovering what your soul has been practicing underneath the surface.', '<em>Pause.</em>', 'Because eventually, what’s inside comes out.')}

        <h2>Opening prayer</h2><span class="st-min">3 minutes</span>
        {say('Jesus, we don’t want to perform tonight. We don’t want to hide behind church language, a spiritual image or polished answers. We want truth.', 'Show us what pressure reveals in us. Show us where fear still leads us. Show us where anger, control, pride, defensiveness or isolation have become automatic.', 'Holy Spirit, don’t expose us to shame us. Expose us to heal us. Train us. Transform us. Form Christ in us. Amen.')}

        <h2>Icebreaker</h2><span class="st-min">10 minutes</span>
        {ask('What’s one small thing that frustrates you fast? Slow drivers, being ignored, repeating yourself, being interrupted, waiting, being corrected…', label='Go around the room')}
        <p>This breaks the tension while quietly exposing deeper patterns. After several men share, say:</p>
        {say('Interesting how small interruptions can expose massive realities inside us.')}

        <h2>Part 1: Interruption reveals formation</h2><span class="st-min">6 minutes</span>
        {verse(*LUKE645)}
        <p>Most men think pressure created the anger, the interruption caused the reaction, stress made them act that way. Jesus says something different: “out of the overflow.” Pressure didn’t create it. Pressure revealed it. The frustration, the sarcasm, the shutdown, the panic, the need to control: it was already there. The interruption just removed the mask.</p>
        {ask('What tends to come out of you first under pressure?', 'Where do you think that reflex was trained?')}
        <p class="pt-small pt-muted">Write the answers somewhere everyone can see: anger, silence, blame, defensiveness, control, anxiety, sarcasm, withdrawal, overexplaining, impatience.</p>

        <h2>Part 2: You fall to your training</h2><span class="st-min">6 minutes</span>
        {say('You don’t rise to your intentions under pressure. You fall to your training.')}
        <p>A man can love God, mean well and want peace, and still react destructively. Why? Because intention isn’t formation. Formation comes through repetition. Just as an athlete trains muscle memory, a man’s heart trains emotional reflexes. Some men have practiced irritation, fear, defensiveness, control, self-protection or escape for years. When pressure hits, those pathways fire automatically.</p>
        {ask('What was modeled to you growing up? How did the men around you handle anger, conflict, fear, stress, failure or weakness?', 'What did you inherit emotionally that you never questioned?')}
        <p class="pt-small pt-muted">Pause long enough to let the silence work.</p>
        {verse(*ROM122)}
        <p>Transformation means retraining. New formation is possible.</p>

        <h2>Part 3: The war between reflex and response</h2><span class="st-min">6 minutes</span>
        <p>Draw this where everyone can see it:</p>
        <div class="st-flow"><span>Interruption</span><i>→</i><span>Reflex</span><i>→</i><span>Response</span></div>
        <p><strong>A reflex</strong> is automatic, fast, conditioned and emotional. <strong>A response</strong> is intentional, Spirit-led, formed and submitted.</p>
        {verse(*GAL522)}
        <p>Fruit isn’t fake calm, spiritual performance or a personality type. Fruit is evidence of connection, formation and abiding. Nobody becomes patient overnight or peaceful by accident. Fruit grows through repetition, time with God, daily surrender, practiced awareness and obedience under pressure.</p>
        {ask('Which fruit disappears first when pressure hits you: peace, patience, gentleness, self-control or kindness?', 'What does that show you about where you still need formation?')}

        <h2>Part 4: The real issue isn’t anger</h2><span class="st-min">6 minutes</span>
        {say('Most men try to fight behavior. Jesus fights roots.')}
        <p>Anger is often fear protecting itself, pain defending itself, insecurity reacting, pride resisting exposure, exhaustion leaking out, or control losing its grip. On the surface a man says, “I just snapped.” Underneath is fear, shame, insecurity, pride, control or unresolved pain. And underneath that, very often, is distrust.</p>
        {ask('What are your reactions trying to protect?')}
        <p class="pt-small pt-muted">That one question can change the whole room. Give it time.</p>

        <h2>Part 5: Jesus in interruption</h2><span class="st-min">6 minutes</span>
        {ask('What consistently came out of Jesus under pressure?')}
        <p>Explore a few together: calm in the storm (Mark 4:35–41), compassion when interrupted (Mark 5:25–34), silence before His accusers (Matthew 26:59–63), grace toward Peter after his failure (John 21:15–19).</p>
        {verse(*JOHN146)}
        <p>Jesus didn’t only teach the way. He embodied it. His reflexes revealed His life with the Father.</p>
        {say('Your automatic reactions reveal your deepest agreements. Whatever your soul trusts most leads first under pressure.')}

        <h2>The 3-Second Reflex Interrupt</h2><span class="st-min">10 minutes</span>
        <p>Teach this slowly. Walk through one real example from the room.</p>
        <ol class="st-steps">{steps}</ol>

        <h2>Group activation</h2><span class="st-min">7 minutes</span>
        {ask('What’s one reflex God is confronting in you right now?', 'What response is God trying to build instead?', label='Ask every man')}
        <table class="st-table"><thead><tr><th>Reflex</th><th>New response</th></tr></thead><tbody>{swaps}</tbody></table>
        <p>Then have each man finish these two sentences out loud:</p>
        {say('“When pressure hits me, I usually become ________.”', '“With God’s help, I want to become ________.”')}

        <h2>Breakout groups (optional)</h2><span class="st-min">20 minutes · groups of 3–4</span>
        <p>The goal is to move from inspiration to honesty, brotherhood and practical formation. Pick the questions that fit your group.</p>
        <h3>Exposure</h3><ol><li>What reaction shows up in you fastest under pressure?</li><li>Who taught you that response, directly or indirectly?</li><li>What situations trigger it most?</li></ol>
        <h3>Roots</h3><ol start="4"><li>What is your reflex trying to protect?</li><li>What fear lives underneath it?</li><li>What lie have you agreed with? (“I’m not safe.” “I must stay in control.” “Weakness is dangerous.” “Nobody helps me.” “I have to defend myself.”)</li></ol>
        <h3>Formation</h3><ol start="7"><li>What would it look like for Jesus to form a new reflex in you?</li><li>What practices would help? (Slowing down, Scripture before your phone, prayer pauses, breathing before responding, confession, journaling your triggers, memorizing a verse.)</li></ol>
        <h3>Brotherhood</h3><ol start="9"><li>What kind of man do you become under pressure?</li><li>What kind of man do you want to become instead? Who in this group will check in with you this week?</li></ol>

        <h2>Closing</h2><span class="st-min">5 minutes</span>
        {say('The goal isn’t perfection overnight. The goal is formation.', 'A man transformed by Jesus eventually stops reacting the way he used to.', 'Because eventually, what fills you leads you.')}
        <h3>Closing prayer (have the men open their hands)</h3>
        {say('Jesus, we invite You into the places we usually hide: our anger, our defensiveness, our fear, our control, our shutdown, our panic.', 'Train us, not just in public behavior but in private formation. Slow us down under pressure. Teach us to recognize what rises first. Build new reflexes in us by Your Spirit, until our responses look more like You. Amen.')}
        <h3>This week’s challenge: the Reflex Journal</h3>
        <p>For seven days, each time pressure hits, write down: What happened? What rose first? What was underneath it? What response would reflect Jesus instead? The journal pages are on the handout.</p>
        <div class="st-gem">Pressure reveals what your soul has been practicing all along.</div>

        <div class="st-card pt-no-print"><h3>Keep going</h3>
          <p>Men can practice the pause privately in the <a href="/tools/interruption-lab/">Pattern Interruption Lab</a>, find their pattern with the <a href="/tools/pattern-finder/">Pattern Finder</a>, and read <a href="/questions/how-to-control-anger-as-a-christian-man/">How do I control my anger as a Christian man?</a></p>
          <p class="pt-small pt-muted">If a man shares that his anger is frightening his family, or that anyone is unsafe, follow up privately that week, involve your pastor, and encourage a licensed counselor. If anyone is in danger, call 911.</p>
        </div>
        {rights()}
      </div>
    </section>"""
    return page(f'studies/{SLUG}/leader-guide/', f'{TITLE}: Leader Guide', 'A complete leader guide for a 60–90 minute men’s Bible study on Luke 6:45: what comes out of you first under pressure, and how Jesus forms new reflexes. Free to print and use.', body)


def handout():
    steps = ''.join(f'<li><strong>{n}.</strong> {d}</li>' for n, d in INTERRUPT)
    swaps = ''.join(f'<tr><td>{a}</td><td>{b}</td></tr>' for a, b in SWAPS)
    days = ''.join(f'<div class="st-journal"><h4>Day {i}</h4><p>What happened?</p><div class="st-lines"></div><p>What rose first?</p><div class="st-lines"></div><p>What was underneath it?</p><div class="st-lines"></div><p>What response would reflect Jesus instead?</p><div class="st-lines"></div></div>' for i in range(1, 8))
    body = hero('<a href="/resources.html">Resources</a> / <a href="/studies/">Group Studies</a> / <a href="/studies/reflex-vs-response/">Reflex vs. Response</a> / Handout',
                'Participant handout', f'What comes out of you <em>first?</em>', 'Your notes for tonight and your Reflex Journal for the week ahead.')
    body += f"""
    <section class="st-section">
      <div class="pt-narrow st-guide">
        {share_bar(f'studies/{SLUG}/handout/', f'{TITLE}: Participant Handout', '/downloads/reflex-vs-response-handout.pdf', 'Handout PDF')}
        <div class="st-card">
          <p><strong>Read this out loud:</strong> Your first reaction reveals what your soul has practiced most.</p>
          {verse(*LUKE645)}
          {verse(*GAL522)}
          <div class="st-flow"><span>Interruption</span><i>→</i><span>Reflex</span><i>→</i><span>Response</span></div>
          <p><strong>Reflex:</strong> automatic, fast, conditioned, emotional. <strong>Response:</strong> intentional, Spirit-led, formed, submitted.</p>
          <p>You don’t rise to your intentions under pressure. You fall to your training.</p>
        </div>

        <h2>Reflex Test</h2>
        <p>When I’m interrupted, pressured or frustrated, I usually:</p>
        <p>☐ React automatically &nbsp; ☐ Defend myself immediately &nbsp; ☐ Escalate emotionally &nbsp; ☐ Pause and respond intentionally</p>
        <p><strong>Trigger → Truth → Response:</strong> pressure or interruption → the fruit of the Spirit (Galatians 5:22–23) → “I don’t let pressure lead me. I respond from formation.”</p>

        <h2>The 3-Second Reflex Interrupt</h2>
        <ol class="st-steps">{steps}</ol>

        <h2>Reflex → new response</h2>
        <table class="st-table"><thead><tr><th>Reflex</th><th>New response</th></tr></thead><tbody>{swaps}</tbody></table>
        <p>When pressure hits me, I usually become</p><div class="st-lines"></div>
        <p>With God’s help, I want to become</p><div class="st-lines"></div>
        <p>My reactions are often trying to protect</p><div class="st-lines"></div>

        <h2>The Reflex Journal: 7 days</h2>
        <p>Each time pressure hits this week, catch your first reflex once and write it down.</p>
        {days}
        <div class="st-gem">Your reflexes reveal what your soul trusts most under pressure.</div>
        <p class="pt-small pt-muted">Practice the pause anytime in the free Pattern Interruption Lab: thewrkshop.com/tools/interruption-lab/</p>
        {rights()}
      </div>
    </section>"""
    return page(f'studies/{SLUG}/handout/', f'{TITLE}: Participant Handout', 'Participant notes for the Reflex vs. Response men’s study, with the 3-Second Reflex Interrupt and a 7-day Reflex Journal. Free to print.', body)


def overview():
    tl = ''.join(f'<li><strong>{t}</strong><span>{d}</span></li>' for t, d in TIMELINE)
    body = hero('<a href="/resources.html">Resources</a> / <a href="/studies/">Group Studies</a> / Reflex vs. Response',
                'Group study · One session · Luke 6:45', 'The Reflex vs. the Response: <em>what comes out of you first?</em>',
                'A ready-to-run men’s Bible study on what pressure reveals and how Jesus forms new reflexes. Free for any men’s group or church.')
    body += f"""
    <section class="st-section">
      <div class="pt-narrow">
        {share_bar(f'studies/{SLUG}/', f'{TITLE}: A Men’s Group Study')}
        <div class="st-card">
          <h2 class="pt-h3">The teaching</h2>
          <p>It happened fast. Someone cut you off, disrespected you, ignored you or pressed you, and before you could think, something came out: frustration, defensiveness, sarcasm, anger, withdrawal, fear or control. Not planned. Automatic. Afterward you wonder, “Why did I react like that?”</p>
          <p>Most men think character is revealed in calm moments. It isn’t. Character is revealed in interruption, because interruption bypasses performance. Pressure doesn’t create what’s inside you. It reveals it (Luke 6:45). And whatever fills your heart eventually becomes your reflex.</p>
          <p><strong>Your first reaction reveals what your soul has practiced most.</strong></p>
        </div>

        <div class="st-card">
          <h2 class="pt-h3">What’s in the kit</h2>
          <ul>
            <li><strong>Leader guide:</strong> the full session, with what to say, what to ask, Scripture, timing and optional breakout questions.</li>
            <li><strong>Participant handout:</strong> key verses, the Reflex Test, the 3-Second Reflex Interrupt and a 7-day Reflex Journal.</li>
          </ul>
          <div class="st-actions">
            <a class="pt-btn pt-btn--ember" href="/studies/reflex-vs-response/leader-guide/">Open the leader guide</a>
            <a class="pt-btn" href="/downloads/reflex-vs-response-leader-guide.pdf">Leader guide PDF</a>
            <a class="pt-btn pt-btn--ghost" href="/studies/reflex-vs-response/handout/">Participant handout</a>
            <a class="pt-btn pt-btn--ghost" href="/downloads/reflex-vs-response-handout.pdf">Handout PDF</a>
          </div>
        </div>

        <div class="st-card">
          <h2 class="pt-h3">Session at a glance (60–90 minutes)</h2>
          <ul class="st-time">{tl}</ul>
          <p class="pt-small pt-muted">Key Scripture: Luke 6:45, Galatians 5:22–23, Romans 12:2, John 14:6.</p>
        </div>

        <div class="st-card">
          <h2 class="pt-h3">For the week after</h2>
          <p>Men can practice the pause privately in the <a href="/tools/interruption-lab/">Pattern Interruption Lab</a>, find their pattern with the <a href="/tools/pattern-finder/">Pattern Finder</a>, and read <a href="/questions/how-to-control-anger-as-a-christian-man/">How do I control my anger as a Christian man?</a></p>
          <p>Want a group to run this with? <a href="/get-known.html">Get known</a> and we’ll help you find one.</p>
        </div>
        <div class="st-gem">Pressure reveals what your soul has been practicing all along.</div>
        {rights()}
      </div>
    </section>"""
    return page(f'studies/{SLUG}/', f'{TITLE}: A Men’s Group Study on Luke 6:45', 'A free, ready-to-run men’s Bible study on what comes out of you first under pressure: leader guide, participant handout and a 7-day Reflex Journal, from Luke 6:45.', body)


KITS = [
    ('/studies/reflex-vs-response/', 'One session · Luke 6:45', 'The Reflex vs. the Response', 'What comes out of you first under pressure, and how Jesus forms new reflexes. Leader guide, handout and a 7-day Reflex Journal.'),
]


def hub():
    cards = ''.join(f'<a class="st-kit" href="{h}"><span class="pt-label">{m}</span><h2>{t}</h2><p>{d}</p></a>' for h, m, t, d in KITS)
    body = hero('<a href="/resources.html">Resources</a> / Group Studies', 'Group Studies', 'Ready-to-run <em>men’s group</em> studies',
                'Sessions built from TheWrkShop’s teaching, tested with real men. Each one comes with a leader guide and a printable handout. Free for any men’s group or church.')
    body += f"""
    <section class="st-section">
      <div class="pt-narrow">
        <div class="st-kits">{cards}</div>
        <div class="st-card">
          <h2 class="pt-h3">Starting a group?</h2>
          <p>The <a href="/sub-pages/resources/starter-kit.html">Starter Kit</a> has a meeting agenda, a group covenant and accountability pairs. <a href="/questions/how-to-start-a-mens-group/">How do I start a men’s group?</a> walks through the first steps.</p>
        </div>
      </div>
    </section>"""
    return page('studies/', 'Group Studies for Men’s Groups', 'Free, ready-to-run men’s Bible studies from TheWrkShop, each with a leader guide and a printable handout.', body, schema_type='CollectionPage')


def write(rel, content):
    p = os.path.join(ROOT, rel)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, 'w', encoding='utf-8') as f:
        f.write(content)
    print('wrote', rel)


def make_pdfs():
    import http.server
    import socketserver
    import threading
    from functools import partial
    from playwright.sync_api import sync_playwright
    handler = partial(http.server.SimpleHTTPRequestHandler, directory=ROOT)
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(('127.0.0.1', 0), handler) as httpd:
        port = httpd.server_address[1]
        threading.Thread(target=httpd.serve_forever, daemon=True).start()
        with sync_playwright() as pw:
            b = pw.chromium.launch()
            pg = b.new_page()
            import base64
            logo = base64.b64encode(open(os.path.join(ROOT, 'assets/images/thewrkshop-logo-transparent-trimmed.png'), 'rb').read()).decode()
            header = ('<div style="width:100%;margin:0 0.6in;display:flex;justify-content:space-between;align-items:center;'
                      'border-bottom:1px solid #c9aa8c;padding-bottom:4px;font-family:Helvetica,Arial,sans-serif;font-size:9px;color:#3e2c23;">'
                      f'<img src="data:image/png;base64,{logo}" style="height:42px;width:auto;">'
                      '<span style="letter-spacing:1px;">THEWRKSHOP.COM</span></div>')
            footer = ('<div style="width:100%;margin:0 0.6in;display:flex;justify-content:space-between;gap:12px;'
                      'border-top:1px solid #c9aa8c;padding-top:4px;font-family:Helvetica,Arial,sans-serif;font-size:8px;color:#6b5b53;">'
                      f'<span>{html.escape(RIGHTS)}</span>'
                      '<span style="white-space:nowrap;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></span></div>')
            for src, out in [(f'studies/{SLUG}/leader-guide/', f'downloads/{SLUG}-leader-guide.pdf'),
                             (f'studies/{SLUG}/handout/', f'downloads/{SLUG}-handout.pdf')]:
                pg.goto(f'http://127.0.0.1:{port}/{src}', wait_until='networkidle')
                pg.emulate_media(media='print')
                pg.evaluate("document.body.classList.add('pdf-mode')")
                pg.pdf(path=os.path.join(ROOT, out), format='Letter', print_background=True,
                       display_header_footer=True, header_template=header, footer_template=footer,
                       margin={'top': '1in', 'bottom': '0.8in', 'left': '0.6in', 'right': '0.6in'})
                print('wrote', out)
            b.close()
        httpd.shutdown()


if __name__ == '__main__':
    write('studies/index.html', hub())
    write(f'studies/{SLUG}/index.html', overview())
    write(f'studies/{SLUG}/leader-guide/index.html', leader_guide())
    write(f'studies/{SLUG}/handout/index.html', handout())
    if '--pdf' in sys.argv:
        make_pdfs()
