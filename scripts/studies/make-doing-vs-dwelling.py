#!/usr/bin/env python3
"""Builds the eight-session series "The Doing vs. the Dwelling" (John 15).

Usage:
  python3 scripts/studies/make-doing-vs-dwelling.py          # HTML pages
  python3 scripts/studies/make-doing-vs-dwelling.py --pdf    # HTML pages + PDFs (needs Python Playwright)

Writes:
  studies/doing-vs-dwelling/index.html                 (series overview)
  studies/doing-vs-dwelling/leader-guide/index.html    (all eight sessions)
  studies/doing-vs-dwelling/handout/index.html         (participant pages, quick checks, activity sheets + the Return log)
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

EX33 = ('Exodus 33:11, 15', 'The LORD would speak to Moses face to face, as one speaks to a friend…. Then Moses said to him, “If your Presence does not go with us, do not send us up from here.”')
PS27 = ('Psalm 27:4, 8', 'One thing I ask from the LORD, this only do I seek: that I may dwell in the house of the LORD all the days of my life, to gaze on the beauty of the LORD and to seek him in his temple…. My heart says of you, “Seek his face!” Your face, LORD, I will seek.')
JOHN2117 = ('John 21:17', 'The third time he said to him, “Simon son of John, do you love me?” Peter was hurt because Jesus asked him the third time, “Do you love me?” He said, “Lord, you know all things; you know that I love you.” Jesus said, “Feed my sheep.”')
JOHN2021 = ('John 20:21–22', 'Again Jesus said, “Peace be with you! As the Father has sent me, I am sending you.” And with that he breathed on them and said, “Receive the Holy Spirit.”')
MATT2819 = ('Matthew 28:19–20', 'Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, and teaching them to obey everything I have commanded you. And surely I am with you always, to the very end of the age.')
MIC68 = ('Micah 6:8', 'He has shown you, O mortal, what is good. And what does the LORD require of you? To act justly and to love mercy and to walk humbly with your God.')
COL26 = ('Colossians 2:6–7', 'So then, just as you received Christ Jesus as Lord, continue to live your lives in him, rooted and built up in him, strengthened in the faith as you were taught, and overflowing with thankfulness.')
GEN524 = ('Genesis 5:24', 'Enoch walked faithfully with God; then he was no more, because God took him away.')
ACTS18 = ('Acts 1:8', 'But you will receive power when the Holy Spirit comes on you; and you will be my witnesses in Jerusalem, and in all Judea and Samaria, and to the ends of the earth.')

SESSIONS += [
    dict(n=5, title='The Performance vs. the Presence', ref='Exodus 33:7–18 · Psalm 27:4–8',
         big='Performance asks, “How am I doing?” Presence asks, “Who am I with?”',
         read='I’d rather stay with God than go anywhere without Him.',
         open=('God offered Moses the Promised Land, success and an angel to lead the way. Everything except His own presence.', 'Moses said no. “If your Presence does not go with us, do not send us up from here.” Tonight we ask whether we’d say the same.'),
         icebreaker='Where do you feel most “on stage” in your life: work, church, home, online?',
         verses=[EX33, PS27],
         teach=[
             ('Success without Him isn’t success', '<p>Moses had a tent outside the camp where he met with God “face to face, as one speaks to a friend.” When God offered to send Israel ahead without His presence, Moses refused the deal. He understood something many men miss: the blessing without the Blesser isn’t worth having.</p><p>Performance keeps score: how I look, how I did, what they think. Presence just stays near. A man can perform for God for years and never sit with Him.</p>'),
             ('One thing', '<p>David had a kingdom to run, enemies to fight and a family in turmoil. His “one thing” was to dwell with God and gaze on His beauty. Psalm 27 shows a man under real pressure choosing presence over performance.</p>'),
         ],
         activities=[
             ('Two minutes of silence', '3 minutes', 'A phone timer.', 'Say: “For the next two minutes, no one talks, no phones. Just sit with God. If your mind wanders, gently return.” Start the timer. When it ends, wait a few more seconds before speaking.', 'What was that like? What did your mind run to? What does it say that stillness is hard for us?'),
             ('Stage or tent?', '8 minutes', 'Index cards and pens.', 'Each man draws a line down the middle of a card. On the left, “Where I perform” (the stages). On the right, “Where I’m present with God” (the tents). Give two minutes, then have them share one item from each side with a partner.', 'Which side was easier to fill? Why?'),
             ('My one thing', '7 minutes', 'Handouts or cards.', 'Read Psalm 27:4 aloud together. Each man rewrites it in his own words: “One thing I ask of You, Lord…” Then read it to a partner.', 'What surprised you about what you wrote?'),
         ],
         check=[('When I pray, I mostly ask God to bless my plans.', 'When I pray, I mostly want to be with Him.'),
                ('I feel closest to God after I’ve done well.', 'I feel close to God even after a bad week.'),
                ('Silence makes me restless.', 'Silence with God feels like rest.'),
                ('I measure my faith by what I get done.', 'I measure my faith by how near I stay.')],
         questions=['What would you have done with God’s offer to Moses?', 'Where is your “tent outside the camp”? If you don’t have one, where could it be?', 'What is your “one thing” right now, honestly? What do you want it to be?'],
         practice='Set a daily “tent” this week: the same place and time, ten minutes, phone in another room. Just be with Him.',
         gem='The blessing without the Blesser isn’t worth having.'),
    dict(n=6, title='The Assignment vs. the Attachment', ref='John 21:15–19 · John 20:19–22 · Matthew 28:18–20',
         big='Jesus asked “Do you love me?” three times before He said “Feed my sheep.” Attachment comes before assignment.',
         read='Before there is a mission, there is a Person.',
         open=('Peter had denied Jesus three times. On the beach, Jesus didn’t start with Peter’s performance review or his next assignment.', 'He asked one question, three times: “Do you love me?”'),
         icebreaker='What’s one assignment you carry right now: at work, at home or at church?',
         verses=[JOHN2117, JOHN2021, MATT2819],
         teach=[
             ('The order matters', '<p>Before Jesus sent His disciples, He breathed on them. Before He gave Peter a flock, He restored Peter’s love. Before the Great Commission, He promised, “I am with you always.” Every assignment in the Kingdom is meant to flow from attachment, not to compensate for a lack of it.</p><p>An assignment without attachment becomes a burden or an idol. An assignment that flows from attachment becomes an overflow.</p>'),
             ('Restored, then sent', '<p>Peter’s failure didn’t disqualify him. Jesus asked three times, once for each denial, and then trusted him with His people. Some men are waiting to feel worthy before they serve. Jesus starts with love, not worthiness.</p>'),
         ],
         activities=[
             ('The three questions', '12 minutes', 'Pairs.', 'In pairs, one man asks his partner, slowly, “Do you love Jesus?” three times. The partner answers differently each time: first, why he loves Him; second, what’s getting in the way right now; third, what loving Him would look like this week. Then switch.', 'What did the second question bring up? What would Jesus say back to you?'),
             ('Unplugged', '5 minutes', 'A lamp, unplugged.', 'Hold up a lamp that isn’t plugged in and try to turn it on. Then plug it in. Say: “The lamp has an assignment: give light. It can’t do it detached from its source.”', 'Where are you trying to carry an assignment while unplugged?'),
             ('Assignment card', '6 minutes', 'Index cards.', 'On one side, each man writes his biggest current assignment. On the other side, he writes what it would look like to stay attached to Jesus while doing it this week. Keep the card in a wallet or on a dashboard.', 'Share one side, whichever you choose.'),
         ],
         check=[('I start my day with my to-do list.', 'I start my day with Jesus, then my list.'),
                ('I serve to feel useful or worthy.', 'I serve because I’m loved.'),
                ('After I fail, I try to make up for it by doing more.', 'After I fail, I come back to Jesus first.'),
                ('My calling feels heavy.', 'My calling feels like overflow.')],
         questions=['Why do you think Jesus asked Peter three times?', 'Which of your assignments has drifted from attachment into burden?', 'What would it look like to hear “Do you love me?” before your next big task?'],
         practice='Before each major task this week, pause and pray, “Jesus, I love You. I’m doing this with You.” Notice what changes.',
         gem='Every assignment is meant to flow from attachment, not compensate for the lack of it.'),
    dict(n=7, title='The Work vs. the Walk', ref='Micah 6:6–8 · Colossians 2:6–7 · Genesis 5:24',
         big='God isn’t asking for more offerings. He’s asking for a walk: His pace, His direction, His company.',
         read='I don’t just want to work for God. I want to walk with Him.',
         open=('In Micah 6, the people ask what they should bring God: burnt offerings, thousands of rams, rivers of oil?', 'God answers: none of that. Act justly, love mercy, and walk humbly with your God.'),
         icebreaker='Who is someone you’ve walked a long way with: a friend, a mentor, your wife? What made it work?',
         verses=[MIC68, COL26, GEN524],
         teach=[
             ('Walking is relational', '<p>Work can be done alone. A walk is done with someone. Walking means sharing a pace, a direction and a conversation. Enoch’s whole life was summed up in one line: he walked faithfully with God.</p><p>Colossians says the same thing: just as you received Christ, keep walking in Him. The Christian life doesn’t start with grace and then switch to effort. It keeps walking in the same grace.</p>'),
             ('The pace of Jesus', '<p>Jesus was never in a hurry, yet He finished His work. Many men are working so fast for God that they’ve lost the pace of walking with Him. 1 John 2:6 says if we claim to live in Him, we must live as Jesus did. Walking is the evidence of abiding.</p>'),
         ],
         activities=[
             ('Prayer walk', '12 minutes', 'Space to walk, inside or outside.', 'Send men out in pairs for ten minutes. For the first five, walk in silence and talk to God about one thing you’ve been working on alone. For the last five, tell your partner what you prayed.', 'What was different about praying while walking with someone?'),
             ('Pace check', '6 minutes', 'A line of tape on the floor, or the handout.', 'Mark one end “sprinting” and the other “stopped.” Each man stands, or marks the handout, where his pace has been this month. Then he moves to where he thinks Jesus would set it.', 'How far did you have to move? What would it take?'),
             ('Micah 6:8 check', '6 minutes', 'Handouts.', 'Each man picks one area of life (work, home or church) and rates himself 1 to 5 on act justly, love mercy and walk humbly. Share the lowest score and one step to raise it.', 'Which of the three is hardest for men? Why?'),
         ],
         check=[('I do a lot for God, mostly on my own.', 'I do what I do with God, in conversation.'),
                ('My pace leaves no margin for people.', 'My pace leaves room for interruptions.'),
                ('I bring God my results.', 'I bring God my company.'),
                ('Grace got me started; now it’s up to me.', 'I keep walking in the same grace I started with.')],
         questions=['If your life were summed up in one line like Enoch’s, what would it say right now?', 'Where are you working for God at a pace He never set?', 'What would walking humbly with God look like in your hardest relationship?'],
         practice='Take one 20-minute walk this week with no headphones. Talk to God the whole way. Then take a walk with another man.',
         gem='Work can be done alone. A walk is done with Someone.'),
    dict(n=8, title='The Sending vs. the Staying', ref='John 20:21 · Matthew 28:19–20 · Acts 1:8',
         big='God forms men in order to send them. A reservoir holds what it receives. A river passes it on.',
         read='God never intended for you to become a reservoir. He intended for you to become a river. What He pours into you was always meant to flow through you.',
         open=('Imagine spending years preparing for a mission, and then never leaving home.', 'That would be absurd. Yet many believers do exactly that: learn, grow, heal, attend and improve, and then stop. Tonight is about leaving home.'),
         icebreaker='Who is one man who made you stronger in your faith? What did he do?',
         verses=[JOHN2021, MATT2819, ACTS18],
         teach=[
             ('Maturity is preparation, not the destination', '<p>Many believers assume the goal is to become spiritually mature. But maturity is preparation. A tree matures so it can bear fruit. A soldier trains so he can serve. A disciple grows so he can make disciples. The question stops being “What is God doing in me?” and becomes “What does God want to do through me?”</p><p>Jesus’ last command wasn’t “Become knowledgeable.” It was “Go and make disciples.” Power, then witness (Acts 1:8).</p>'),
             ('The sending paradox', '<p>Many men spend years asking, “How do I grow?” Eventually the better question is, “Who am I helping grow?” Healthy trees produce fruit. Healthy fruit produces seed. Healthy seed produces more trees. The surface thought says, “I’m still working on myself.” The deeper question is, “Who is stronger because God placed me in their life?”</p>'),
         ],
         activities=[
             ('Reservoir or river', '5 minutes', 'A pitcher of water, a sealed jar of water and a few empty cups.', 'Hold up the sealed jar: “Full, but going nowhere.” Then pour from the pitcher into each man’s empty cup until the pitcher is empty. Say: “The pitcher didn’t lose its purpose when it emptied. It fulfilled it.”', 'Are you more like the jar or the pitcher right now?'),
             ('Who’s next?', '10 minutes', 'Cards and pens.', 'Each man writes the name of one man who is stronger because of him. Then, on the other side, the name of one man God may be asking him to invest in next, with one first step. Share the second name with the group if he’s willing.', 'What’s the first step with that man, and when?'),
             ('Commissioning circle', '10 minutes', 'Nothing but the men.', 'Stand in a circle, each man with a hand on the shoulder of the man next to him. Go around: each man says the first name on his “Who’s next?” card. After each one, the group says together, “As the Father has sent Me, I am sending you.” Close with the leader praying over the whole circle.', 'Optional: send each man home with his card as a reminder.'),
         ],
         check=[('I’m still waiting until I’m ready to help someone else grow.', 'I’m helping someone grow, even while I’m growing.'),
                ('My faith is mostly about what God is doing in me.', 'My faith is also about what God wants to do through me.'),
                ('I take in a lot: sermons, podcasts, books.', 'I pass on what I take in.'),
                ('I can’t name a man who’s stronger because of me.', 'I can name a man who’s stronger because of me.')],
         questions=['What has God poured into you over these eight weeks?', 'What’s your “I’m still working on myself” excuse?', 'Who is one man you will invest in, starting this week? What’s the first step?'],
         practice='Make the first move with the man on your “Who’s next?” card: a call, a text, a meal. Then tell someone from this group you did it.',
         gem='Transformation that stops with you was never the goal.'),
]


def pair(title):
    """'The Performance vs. the Presence' -> ('Performance', 'Presence')."""
    a, b = title.split(' vs. ')
    strip = lambda x: x[4:] if x.startswith('The ') else (x[4:] if x.startswith('the ') else x)
    return strip(a), strip(b)


def activities_html(s):
    out = '<h3>Do it together</h3><p>Pick one or two of these, depending on time and room. Each one ends with a debrief question.</p>'
    for i, (name, mins, needs, how, debrief) in enumerate(s['activities'], 1):
        out += f"""
        <div class="st-act"><span class="st-act-meta">Activity {i} · {mins}</span><h4>{name}</h4>
          <p><strong>You’ll need:</strong> {needs}</p><p>{how}</p>
          <p class="st-act-debrief"><strong>Debrief:</strong> {debrief}</p></div>"""
    return out


def check_html(s):
    a, b = pair(s['title'])
    rows = ''.join(f"""<li><div class="st-check-opts" role="group" aria-label="Statement {i}">
            <button type="button" data-v="a" aria-pressed="false">{x}</button><span class="st-check-or">or</span>
            <button type="button" data-v="b" aria-pressed="false">{y}</button></div></li>""" for i, (x, y) in enumerate(s['check'], 1))
    return f"""
        <div class="st-check" data-a="{a}" data-b="{b}">
          <h3>Quick check</h3>
          <p class="st-check-intro">For each pair, tap the one that’s more true of you right now. Be honest. Your answers stay on your screen.</p>
          <ol>{rows}</ol>
          <p class="st-check-result" aria-live="polite"></p>
          <button type="button" class="st-check-reset pt-no-print">Start over</button>
        </div>"""


SHEETS = {
    5: """<div class="st-sheet"><h4>Stage or tent?</h4><table class="st-table st-two"><thead><tr><th>Where I perform</th><th>Where I’m present with God</th></tr></thead><tbody>"""
       + '<tr><td>&nbsp;</td><td>&nbsp;</td></tr>' * 4 + """</tbody></table>
       <h4>My one thing (Psalm 27:4 in my words)</h4><p>“One thing I ask of You, Lord…”</p><div class="st-lines"></div><div class="st-lines"></div></div>""",
    6: """<div class="st-sheet"><h4>My assignment card</h4><p><strong>My biggest assignment right now:</strong></p><div class="st-lines"></div>
       <p><strong>Staying attached to Jesus while I do it looks like:</strong></p><div class="st-lines"></div><div class="st-lines"></div>
       <h4>The three questions</h4><p>“Do you love Jesus?” 1. Why I love Him. 2. What’s in the way right now. 3. What loving Him looks like this week.</p><div class="st-lines"></div></div>""",
    7: """<div class="st-sheet"><h4>Pace check</h4><p>Circle where your pace has been this month, then put an X where Jesus would set it.</p>
       <p class="st-pace"><span>Stopped</span><span>Strolling</span><span>Walking</span><span>Rushing</span><span>Sprinting</span></p>
       <h4>Micah 6:8 check</h4><p>Area of life: ____________________</p><table class="st-table"><thead><tr><th>&nbsp;</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th></tr></thead><tbody>"""
       + ''.join(f'<tr><td>{x}</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>' for x in ('Act justly', 'Love mercy', 'Walk humbly with God')) + """</tbody></table>
       <p><strong>One step to raise my lowest score:</strong></p><div class="st-lines"></div></div>""",
    8: """<div class="st-sheet"><h4>Who’s next?</h4><p><strong>A man who is stronger because God placed me in his life:</strong></p><div class="st-lines"></div>
       <p><strong>A man God may be asking me to invest in next:</strong></p><div class="st-lines"></div>
       <p><strong>My first step, and when:</strong></p><div class="st-lines"></div>
       <p class="st-commission">“As the Father has sent me, I am sending you.” (John 20:21)</p></div>""",
}


def leader_guide():
    out = S.hero(f'<a href="/resources.html">Resources</a> / <a href="/studies/">Group Studies</a> / <a href="/studies/{SLUG}/">The Doing vs. the Dwelling</a> / Leader guide',
                 'Leader guide · Eight sessions · 60–75 minutes each', f'{TITLE}: <em>leader guide</em>',
                 'All eight sessions, with what to say, what to ask, Scripture and a practice for each week. Sessions 5–8 add hands-on activities and a quick check on the phone. Print it, or open it on your phone while you lead.')
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
          <h3>Sessions 5–8 are hands-on</h3>
          <p>The second half moves from listening to doing. Each session has a short <strong>quick check</strong> (four statements men tap through on the handout, on their phones or on paper) and two or three <strong>room activities</strong>. Pick one or two activities and trim the discussion to fit. Check the “You’ll need” lines a few days ahead.</p>
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
        {activities_html(s) if s.get('activities') else ''}
        {('<h3>Quick check</h3><p>Have each man open the handout at Session ' + str(s['n']) + ' and tap through the four statements (2 minutes). Then ask: which one statement would you most like to move to the other side?</p>') if s.get('check') else ''}
        {ask(*s['questions'], label='Discussion')}
        <h3>This week’s practice</h3>
        <p>{s['practice']}</p>
        <div class="st-gem">{s['gem']}</div>"""
    out += f"""
        <h2>Closing prayer (any session)</h2>
        {say('Jesus, we confess how easily we get busy for You and forget to be with You. Teach us to return, again and again. Let our serving flow from surrender, our ministry from knowing You, and our fruit from abiding in You. Make Your character visible in us, and use it to feed others. Amen.')}
        <div class="st-card pt-no-print"><h3>Going further</h3>
          <p>After Session 8, encourage each man to follow through with the man on his “Who’s next?” card, and consider taking a few of them through this series yourselves. For more on John 15, see the Dailies <a href="/daily/John-15-4-5_dont-just-keep-coming-home-learn-to-live-there_2026-08-28.html">Don’t Just Keep Coming Home. Learn to Live There.</a> and <a href="/daily/John-15-5_what-are-you-remaining-in_2026-08-07.html">What Are You Remaining In?</a></p>
        </div>
        {S.rights()}
      </div>
    </section>"""
    return S.page(f'studies/{SLUG}/leader-guide/', f'{TITLE}: Leader Guide', 'A complete leader guide for an eight-session men’s Bible study on John 15: from activity vs. abiding to sending vs. staying, with hands-on group activities. Free to print and use.', out, og=OG)


def handout():
    ret = ''.join(f'<li><strong>{a},</strong> {b}</li>' for a, b in RETURN)
    log = ''.join(f'<tr><td>Day {d}</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>' for d in range(1, 8))
    out = S.hero(f'<a href="/resources.html">Resources</a> / <a href="/studies/">Group Studies</a> / <a href="/studies/{SLUG}/">The Doing vs. the Dwelling</a> / Handout',
                 'Participant handout · Eight sessions', 'Busy for God, or <em>with</em> Him?', 'Your notes for each session, quick checks and activity sheets for Sessions 5–8, and the Return log for the weeks in between.')
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
        <h2{' class="st-newpage"' if s.get('check') else ''}>Session {s['n']}: {s['title']}</h2><span class="st-min">{s['ref']}</span>
        <p><strong>Read this out loud:</strong> {s['read']}</p>
        {check_html(s) if s.get('check') else ''}
        {SHEETS.get(s['n'], '')}
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
    return S.page(f'studies/{SLUG}/handout/', f'{TITLE}: Participant Handout', 'Participant notes for The Doing vs. the Dwelling, an eight-session men’s study on John 15, with quick checks, activity sheets, the Return practice and a weekly log. Free to print.', out, og=OG)


def overview():
    rows = ''.join(f'<li><strong>{s["n"]}</strong><span><strong>{s["title"]}</strong> · {s["ref"]}<br>{s["big"]}</span></li>' for s in SESSIONS)
    out = S.hero('<a href="/resources.html">Resources</a> / <a href="/studies/">Group Studies</a> / The Doing vs. the Dwelling',
                 'Group study · Eight sessions · John 15', 'The Doing vs. the Dwelling: <em>busy for God, or with Him?</em>',
                 'A ready-to-run eight-week men’s study that moves from abiding in Jesus to being sent by Him. Hands-on activities in the second half. Free for any men’s group or church.')
    out += f"""
    <section class="st-section">
      <div class="pt-narrow">
        {S.share_bar(f'studies/{SLUG}/', f'{TITLE}: An Eight-Week Men’s Study')}
        <div class="st-card">
          <h2 class="pt-h3">The teaching</h2>
          <p>Many ministries teach men how to do more for God. Scripture certainly calls us to serve. But the deeper invitation is this: become the kind of man who walks with God. When a man truly walks with God, service becomes the overflow rather than the substitute.</p>
          <p>Abiding isn’t passive. It’s active attentiveness: returning the heart’s attention to Jesus, again and again, all day long. And the greatest threat to intimacy with Jesus isn’t always sin. Sometimes it’s becoming so busy doing things for Him that you stop being with Him.</p>
        </div>
        <div class="st-card">
          <h2 class="pt-h3">The eight sessions</h2>
          <ul class="st-time st-sessions">{rows}</ul>
          <p>Sessions 1–4 dwell on John 15. Sessions 5–8 are hands-on: silence, prayer walks, object lessons, a commissioning circle and a quick check men take on their phones.</p>
        </div>
        <div class="st-card">
          <h2 class="pt-h3">What’s in the kit</h2>
          <ul><li><strong>Leader guide:</strong> all eight sessions, with what to say, what to ask, Scripture, room activities and a weekly practice.</li><li><strong>Participant handout:</strong> notes for each session, tap-through quick checks and activity sheets, the Return practice and a weekly Return log.</li></ul>
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
    return S.page(f'studies/{SLUG}/', f'{TITLE}: An Eight-Week Men’s Study on John 15', 'A free, ready-to-run eight-week men’s Bible study on John 15: why many men are busy for God but rarely with Him, and how abiding leads to being sent. Leader guide, handout and group activities.', out, og=OG)


if __name__ == '__main__':
    S.write(f'studies/{SLUG}/index.html', overview())
    S.write(f'studies/{SLUG}/leader-guide/index.html', leader_guide())
    S.write(f'studies/{SLUG}/handout/index.html', handout())
    if '--pdf' in sys.argv:
        S.make_pdfs([(f'studies/{SLUG}/leader-guide/', f'downloads/{SLUG}-leader-guide.pdf'),
                     (f'studies/{SLUG}/handout/', f'downloads/{SLUG}-handout.pdf')])
