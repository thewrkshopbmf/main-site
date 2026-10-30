#!/usr/bin/env python3
"""Builds the four-session series "The Doing vs. the Dwelling" (John 15).

Usage:
  python3 scripts/studies/make-doing-vs-dwelling.py          # HTML pages
  python3 scripts/studies/make-doing-vs-dwelling.py --pdf    # HTML pages + PDFs (needs Python Playwright)

Writes:
  studies/doing-vs-dwelling/index.html                 (series overview)
  studies/doing-vs-dwelling/leader-guide/index.html    (all four sessions)
  studies/doing-vs-dwelling/handout/index.html         (participant pages + the Return log)
  downloads/doing-vs-dwelling-leader-guide.pdf
  downloads/doing-vs-dwelling-handout.pdf

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

SLUG = 'doing-vs-dwelling'
TITLE = 'The Doing vs. the Dwelling'
SUB = 'Why many men are busy for God, but rarely with Him'
OG = '/assets/og/doing-vs-dwelling.png'
say, ask, verse = S.say, S.ask, S.verse

JOHN154 = ('John 15:4–5', 'Remain in me, as I also remain in you. No branch can bear fruit by itself; it must remain in the vine. Neither can you bear fruit unless you remain in me. I am the vine; you are the branches. If you remain in me and I in you, you will bear much fruit; apart from me you can do nothing.')
COR318 = ('2 Corinthians 3:18', 'And we all, who with unveiled faces contemplate the Lord’s glory, are being transformed into his image with ever-increasing glory, which comes from the Lord, who is the Spirit.')
LUKE1041 = ('Luke 10:41–42', '“Martha, Martha,” the Lord answered, “you are worried and upset about many things, but few things are needed—or indeed only one. Mary has chosen what is better, and it will not be taken away from her.”')
ROM121 = ('Romans 12:1', 'Therefore, I urge you, brothers and sisters, in view of God’s mercy, to offer your bodies as a living sacrifice, holy and pleasing to God—this is your true and proper worship.')
REV22 = ('Revelation 2:2, 4', 'I know your deeds, your hard work and your perseverance…. Yet I hold this against you: You have forsaken the love you had at first.')
MATT722 = ('Matthew 7:22–23', 'Many will say to me on that day, ‘Lord, Lord, did we not prophesy in your name and in your name drive out demons and in your name perform many miracles?’ Then I will tell them plainly, ‘I never knew you. Away from me, you evildoers!’')
PHIL310 = ('Philippians 3:10', 'I want to know Christ—yes, to know the power of his resurrection and participation in his sufferings, becoming like him in his death.')
JOHN158 = ('John 15:8, 16', 'This is to my Father’s glory, that you bear much fruit, showing yourselves to be my disciples…. You did not choose me, but I chose you and appointed you so that you might go and bear fruit—fruit that will last.')
GEN128 = ('Genesis 1:28', 'God blessed them and said to them, “Be fruitful and increase in number; fill the earth and subdue it.”')
GAL522 = S.GAL522

RETURN = [
    ('When you’re distracted', 'return.'), ('When you’re anxious', 'return.'), ('When you succeed', 'return.'),
    ('When you’re discouraged', 'return.'), ('When you fail', 'return.'),
]

SESSIONS = [
    dict(n=1, title='The Activity vs. the Abiding', ref='John 15:1–8',
         big='Two operating systems: “I’m doing things for God,” or “I’m becoming with God.”',
         read='Abiding isn’t passive. It’s returning, again and again, all day long.',
         open=('Most of us know how to be busy for God. Fewer of us know how to be with Him.',
               'Tonight we’re going to look at two very different ways to live the Christian life. Both can look the same from the outside. Only one bears fruit that lasts.'),
         icebreaker='On a scale of 1 to 10, how busy has your life been this month? What’s filling it?',
         verses=[JOHN154, COR318],
         teach=[
             ('Two operating systems', '<p><strong>Operating system one:</strong> “I’m doing things <em>for</em> God.” Read, pray, serve, lead, give, study. Everything centers on doing. <strong>Operating system two:</strong> “I’m becoming <em>with</em> God.” Abide, remain, listen, walk, receive, trust, obey. Everything flows from relationship.</p><p>One begins with effort. The other begins with attachment. One asks, “What should I do today?” The other asks, “Where is Jesus leading today?” One measures productivity. The other measures intimacy. One creates workers. The other creates disciples.</p>'),
             ('Abiding is active attentiveness', '<p>Many men hear “abide” and picture doing nothing. But to remain in Christ is to keep returning the heart’s attention to Him. Not once. Repeatedly, throughout the day. When distracted, return. When anxious, return. When successful, return. When discouraged, return.</p><p>That’s why abiding bears fruit. Not because attention has some magic power, but because the One we attend to transforms us. Paul says we behold, then we become (2 Corinthians 3:18).</p>'),
         ],
         questions=['Which operating system have you been running on lately? How can you tell?', 'Where in your day is it hardest to “return”? What pulls you away?', 'What would change this week if you measured your days by nearness to Jesus instead of productivity?'],
         practice='The Return: five times a day, when you notice your attention has drifted, stop and say, “Jesus, I’m back.” Mark it on the Return log.',
         gem='Before there is fruit, there is attachment.'),
    dict(n=2, title='The Service vs. the Surrender', ref='Luke 10:38–42 · Romans 12:1–2',
         big='Serving is easier than sitting at His feet, and the applause makes it addictive.',
         read='When a man truly walks with God, service becomes the overflow, not the substitute.',
         open=('Martha wasn’t doing something bad. She was serving Jesus, in her own home.', 'And Jesus still said Mary had chosen what was better. Tonight we ask why.'),
         icebreaker='Who is someone you’ve served this year? How did it feel when they thanked you?',
         verses=[LUKE1041, ROM121],
         teach=[
             ('Jesus’ order never changed', '<p>Jesus called the twelve first “that they might be with him,” and only then sent them out (Mark 3:14). Being with Him comes before working for Him.</p><p>Going and serving is a lot easier than sitting with God’s Word and building intimacy with the Father. Serving gives you an immediate reward: people see you, thank you and need you. Time with God is harder at first, and often no one notices. Over time it’s incredible, but at the start the applause is louder.</p>'),
             ('The approval trap', '<p>When we serve, we use the gifts God gave us, and people reward us for it. But the gift is His, and it’s for His glory. It’s easy to get caught up in the gift and the praise and slowly drift from the Giver. Wanting others’ approval can become a powerful addiction.</p><p>Romans 12 doesn’t start with a task. It starts with surrender: offer yourself first. Service that flows from surrender stays healthy. Service that replaces surrender burns out, or puffs up.</p>'),
         ],
         questions=['Are you more like Martha or Mary right now? Be honest.', 'Where do you serve partly because you’re seen, thanked or needed?', 'What would surrender look like before you serve this week?'],
         practice='Before you serve anywhere this week, take five quiet minutes with Jesus first. Write down one thing you heard or noticed.',
         gem='Serving is supposed to be the overflow of walking with God, not a substitute for it.'),
    dict(n=3, title='The Ministry vs. the Master', ref='Revelation 2:1–5 · Matthew 7:21–23',
         big='A good thing becomes a dangerous thing when it quietly replaces the best thing.',
         read='The greatest threat to intimacy with Jesus isn’t always sin. Sometimes it’s being so busy for Him that you stop being with Him.',
         open=('The church in Ephesus did almost everything right.', 'They worked hard, persevered and rejected false teaching. Jesus still said they had left their first love.'),
         icebreaker='What’s something you used to love doing that slowly became an obligation?',
         verses=[REV22, MATT722, PHIL310],
         teach=[
             ('The great exchange', '<p>Many Christians unintentionally substitute religious activity for relationship. Bible knowledge for knowing God. Church attendance for walking with God. Serving for surrender. Leadership for lordship. Ministry for intimacy. Doing for abiding.</p><p>The tragedy is that these are all good things. But a good thing becomes a dangerous thing when it quietly replaces the best thing.</p>'),
             ('Using God or knowing God', '<p>Satan doesn’t always have to pull you away from God. Sometimes he only needs to distract you with things <em>about</em> God. The Pharisees knew Scripture better than almost anyone, yet when the living Word stood in front of them, their knowledge never became relationship.</p><p>In Matthew 7 some people did impressive spiritual work and still heard, “I never knew you.” Paul’s greatest ambition wasn’t to do more. It was, “I want to know Christ.”</p>'),
         ],
         questions=['What “good thing” in your spiritual life is most at risk of replacing the best thing?', 'If Jesus wrote a letter to you like the one to Ephesus, what would He praise? What would He hold against you?', 'What did your “first love” for Jesus look like? What would it take to return to it?'],
         practice='Read Revelation 2:4–5 each morning. Then do one thing you did when your love for Jesus was new.',
         gem='Kingdom work is never meant to replace Kingdom relationship.'),
    dict(n=4, title='The Fruit vs. the Effort', ref='John 15:5, 8, 16 · Galatians 5:22–23',
         big='Fruit isn’t forced performance. It’s Christ’s character becoming visible, and it contains seed.',
         read='Fruit isn’t primarily activity. It’s Christ’s character becoming visible in you.',
         open=('The very first command God gave living things was, “Be fruitful and multiply.”', 'Jesus comes as the true Vine and says it again: bear fruit, fruit that will last. The gospel isn’t a new idea. It restores God’s original design.'),
         icebreaker='Think of someone whose life made you want to know Jesus. What was it about them?',
         verses=[JOHN158, GAL522, GEN128],
         teach=[
             ('Fruit is the restoration of the image', '<p>Humanity was made to receive life from God, reflect Him, bear fruit and multiply His goodness through the earth. Disconnected from God, we still produced, built and achieved, but much of what we multiplied carried the nature of a fallen source.</p><p>Then Jesus says, “No branch can bear fruit by itself.” He’s restoring the original order. The fruit of the Spirit is the character of God becoming visible again in His people: love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control.</p>'),
             ('Fruit contains seed', '<p>Effort can produce results. Only abiding produces fruit, and real fruit always contains seed. Fruit is personal, but multiplication is missional: what God grows in you is meant to be planted in someone else.</p><p>There’s also a danger: multiplication without abiding. Ministries, groups and leaders can multiply activity without multiplying Christ. The question isn’t, “How much did I do?” It’s, “What of Christ is visible in me, and who is it reaching?”</p>'),
         ],
         questions=['Which fruit of the Spirit is most visible in you right now? Which is hardest to see?', 'Where have you been trying to produce fruit by effort instead of abiding?', 'Who is one person God may want your fruit to feed this season?'],
         practice='Ask two people who know you well, “Where do you see Christ in me?” Write down what they say. Then plant one seed: share what God has been teaching you with one other man.',
         gem='Formation was never the finish line. God forms men to send them.'),
]


def leader_guide():
    out = S.hero(f'<a href="/resources.html">Resources</a> / <a href="/studies/">Group Studies</a> / <a href="/studies/{SLUG}/">The Doing vs. the Dwelling</a> / Leader guide',
                 'Leader guide · Four sessions · 60–75 minutes each', f'{TITLE}: <em>leader guide</em>',
                 'All four sessions, with what to say, what to ask, Scripture and a practice for each week. Print it, or open it on your phone while you lead.')
    out += f"""
    <section class="st-section">
      <div class="pt-narrow st-guide">
        {S.share_bar(f'studies/{SLUG}/leader-guide/', f'{TITLE}: Leader Guide', f'/downloads/{SLUG}-leader-guide.pdf', 'Leader guide PDF')}
        <div class="st-card">
          <h3>The big idea of the series</h3>
          <p>Many men are busy for God but rarely with Him. This series isn’t about doing less. It’s about the order: dwelling first, then doing. When a man truly walks with God, service becomes the overflow rather than the substitute.</p>
          <h3>Each session (60–75 minutes)</h3>
          <ul class="st-time">
            <li><strong>5 min</strong><span>Welcome and the read-out-loud line</span></li>
            <li><strong>10 min</strong><span>Icebreaker and check-in on last week’s practice</span></li>
            <li><strong>20 min</strong><span>Scripture and teaching</span></li>
            <li><strong>20 min</strong><span>Discussion, as one group or in threes and fours</span></li>
            <li><strong>5 min</strong><span>This week’s practice</span></li>
            <li><strong>5 min</strong><span>Prayer</span></li>
          </ul>
          <h3>Before you start</h3>
          <ul><li>Print the participant handout for each man, or text the link: thewrkshop.com/studies/{SLUG}/handout/</li><li>Read John 15:1–17 several times this week yourself.</li><li>Practice the Return yourself for a few days before Session 1, so you can talk about it honestly.</li></ul>
        </div>"""
    for s in SESSIONS:
        vs = ''.join(verse(*v) for v in s['verses'])
        tch = ''.join(f'<h3>{h}</h3>{b}' for h, b in s['teach'])
        out += f"""
        <h2>Session {s['n']}: {s['title']}</h2><span class="st-min">{s['ref']}</span>
        <p><strong>Big idea:</strong> {s['big']}</p>
        <h3>Open</h3>
        {say(*s['open'])}
        <p><strong>Read this out loud together:</strong> {s['read']}</p>
        {ask(s['icebreaker'], label='Icebreaker')}
        {'' if s['n'] == 1 else ask('How did last week’s practice go? What did you notice?', label='Check in')}
        <h3>Scripture</h3>
        {vs}
        {tch}
        {ask(*s['questions'], label='Discussion')}
        <h3>This week’s practice</h3>
        <p>{s['practice']}</p>
        <div class="st-gem">{s['gem']}</div>"""
    out += f"""
        <h2>Closing prayer (any session)</h2>
        {say('Jesus, we confess how easily we get busy for You and forget to be with You. Teach us to return, again and again. Let our serving flow from surrender, our ministry from knowing You, and our fruit from abiding in You. Make Your character visible in us, and use it to feed others. Amen.')}
        <div class="st-card pt-no-print"><h3>Going further</h3>
          <p>This series is the first half of an eight-week arc. Sessions 5–8 (The Performance vs. the Presence, The Assignment vs. the Attachment, The Work vs. the Walk, and The Sending vs. the Staying) are coming. For more on John 15, see the Dailies <a href="/daily/John-15-4-5_dont-just-keep-coming-home-learn-to-live-there_2026-08-28.html">Don’t Just Keep Coming Home. Learn to Live There.</a> and <a href="/daily/John-15-5_what-are-you-remaining-in_2026-08-07.html">What Are You Remaining In?</a></p>
        </div>
        {S.rights()}
      </div>
    </section>"""
    return S.page(f'studies/{SLUG}/leader-guide/', f'{TITLE}: Leader Guide', 'A complete leader guide for a four-session men’s Bible study on John 15: activity vs. abiding, service vs. surrender, ministry vs. the Master, and fruit vs. effort. Free to print and use.', out, og=OG)


def handout():
    ret = ''.join(f'<li><strong>{a},</strong> {b}</li>' for a, b in RETURN)
    log = ''.join(f'<tr><td>Day {d}</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>' for d in range(1, 8))
    out = S.hero(f'<a href="/resources.html">Resources</a> / <a href="/studies/">Group Studies</a> / <a href="/studies/{SLUG}/">The Doing vs. the Dwelling</a> / Handout',
                 'Participant handout · Four sessions', 'Busy for God, or <em>with</em> Him?', 'Your notes for each session and the Return log for the weeks in between.')
    out += f"""
    <section class="st-section">
      <div class="pt-narrow st-guide">
        {S.share_bar(f'studies/{SLUG}/handout/', f'{TITLE}: Participant Handout', f'/downloads/{SLUG}-handout.pdf', 'Handout PDF')}
        <div class="st-card">
          {verse(*JOHN154)}
          <p><strong>Two operating systems.</strong> “I’m doing things for God” begins with effort. “I’m becoming with God” begins with attachment.</p>
          <h3>The Return</h3>
          <p>Abiding isn’t passive. It’s returning your heart’s attention to Jesus, again and again:</p>
          <ul>{ret}</ul>
        </div>"""
    for s in SESSIONS:
        qs = ''.join(f'<li>{q}</li>' for q in s['questions'])
        out += f"""
        <h2>Session {s['n']}: {s['title']}</h2><span class="st-min">{s['ref']}</span>
        <p><strong>Read this out loud:</strong> {s['read']}</p>
        <ol>{qs}</ol>
        <p><strong>My notes</strong></p><div class="st-lines"></div><div class="st-lines"></div><div class="st-lines"></div>
        <p><strong>This week:</strong> {s['practice']}</p>
        <div class="st-gem">{s['gem']}</div>"""
    out += f"""
        <h2>The Return log</h2>
        <p>Each day, tally how many times you noticed you’d drifted and returned to Jesus. Write one thing you noticed.</p>
        <table class="st-table"><thead><tr><th>Day</th><th>Times I returned</th><th>What pulled me away</th><th>What I noticed</th></tr></thead><tbody>{log}</tbody></table>
        {S.rights()}
      </div>
    </section>"""
    return S.page(f'studies/{SLUG}/handout/', f'{TITLE}: Participant Handout', 'Participant notes for The Doing vs. the Dwelling, a four-session men’s study on John 15, with the Return practice and a weekly log. Free to print.', out, og=OG)


def overview():
    rows = ''.join(f'<li><strong>{s["n"]}</strong><span><strong>{s["title"]}</strong> · {s["ref"]}<br>{s["big"]}</span></li>' for s in SESSIONS)
    out = S.hero('<a href="/resources.html">Resources</a> / <a href="/studies/">Group Studies</a> / The Doing vs. the Dwelling',
                 'Group study · Four sessions · John 15', 'The Doing vs. the Dwelling: <em>busy for God, or with Him?</em>',
                 'A ready-to-run four-week men’s study on activity and abiding, service and surrender, ministry and the Master, effort and fruit. Free for any men’s group or church.')
    out += f"""
    <section class="st-section">
      <div class="pt-narrow">
        {S.share_bar(f'studies/{SLUG}/', f'{TITLE}: A Four-Week Men’s Study')}
        <div class="st-card">
          <h2 class="pt-h3">The teaching</h2>
          <p>Many ministries teach men how to do more for God. Scripture certainly calls us to serve. But the deeper invitation is this: become the kind of man who walks with God. When a man truly walks with God, service becomes the overflow rather than the substitute.</p>
          <p>Abiding isn’t passive. It’s active attentiveness: returning the heart’s attention to Jesus, again and again, all day long. And the greatest threat to intimacy with Jesus isn’t always sin. Sometimes it’s becoming so busy doing things for Him that you stop being with Him.</p>
        </div>
        <div class="st-card">
          <h2 class="pt-h3">The four sessions</h2>
          <ul class="st-time st-sessions">{rows}</ul>
        </div>
        <div class="st-card">
          <h2 class="pt-h3">What’s in the kit</h2>
          <ul><li><strong>Leader guide:</strong> all four sessions, with what to say, what to ask, Scripture and a weekly practice.</li><li><strong>Participant handout:</strong> notes for each session, the Return practice and a weekly Return log.</li></ul>
          <div class="st-actions">
            <a class="pt-btn pt-btn--ember" href="/studies/{SLUG}/leader-guide/">Open the leader guide</a>
            <a class="pt-btn" href="/downloads/{SLUG}-leader-guide.pdf">Leader guide PDF</a>
            <a class="pt-btn pt-btn--ghost" href="/studies/{SLUG}/handout/">Participant handout</a>
            <a class="pt-btn pt-btn--ghost" href="/downloads/{SLUG}-handout.pdf">Handout PDF</a>
          </div>
        </div>
        <div class="st-card">
          <h2 class="pt-h3">Go deeper on John 15</h2>
          <p>Dailies: <a href="/daily/John-15-4-5_dont-just-keep-coming-home-learn-to-live-there_2026-08-28.html">Don’t Just Keep Coming Home. Learn to Live There.</a> · <a href="/daily/John-15-5_what-are-you-remaining-in_2026-08-07.html">What Are You Remaining In?</a> · <a href="/daily/John-15-5_the-vine-never-rejects-the-branch_2026-08-05.html">The Vine Never Rejects the Branch</a> · <a href="/daily/John-15-16_the-fruit-vs-the-finish-line_2026-07-11.html">The Fruit vs. the Finish Line</a></p>
          <p>Want a group to go through it with? <a href="/get-known.html">Get known</a>.</p>
        </div>
        <div class="st-gem">Before there is fruit, there is attachment.</div>
        {S.rights()}
      </div>
    </section>"""
    return S.page(f'studies/{SLUG}/', f'{TITLE}: A Four-Week Men’s Study on John 15', 'A free, ready-to-run four-week men’s Bible study on John 15: why many men are busy for God but rarely with Him. Leader guide, handout and the Return practice.', out, og=OG)


if __name__ == '__main__':
    S.write(f'studies/{SLUG}/index.html', overview())
    S.write(f'studies/{SLUG}/leader-guide/index.html', leader_guide())
    S.write(f'studies/{SLUG}/handout/index.html', handout())
    if '--pdf' in sys.argv:
        S.make_pdfs([(f'studies/{SLUG}/leader-guide/', f'downloads/{SLUG}-leader-guide.pdf'),
                     (f'studies/{SLUG}/handout/', f'downloads/{SLUG}-handout.pdf')])
