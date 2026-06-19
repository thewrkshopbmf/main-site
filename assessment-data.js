export const ASSESSMENT_SLUG = 'spiritual-gifts-assessment';

export const GIFTS = {
  teaching: {
    name: 'Teaching',
    category: 'Word & Ministry',
    desc: "You break down Scripture and complex truth in ways that stick. People walk away understanding what they didn't before. You likely over-prepare and feel something is wrong when explanation lacks depth.",
    scripture: { text: 'He who teaches, in his teaching.', ref: 'Romans 12:7' },
    shadow: ['knowledge', 'wisdom'],
    shadowNote: "Teaching without the Word of Knowledge produces polished lectures with no revelation. The gift of Knowledge is what drives you into the text at 2am, and Wisdom helps you know what people are actually ready to carry.",
    shadowLow: {
      knowledge: 'Without consistent revelation in the text, your teaching risks becoming commentary on other teachers rather than fresh encounter with the Word.',
      wisdom: "Without Wisdom, strong Teaching can load people with truth they don't know what to do with."
    }
  },
  prophecy: {
    name: 'Prophecy',
    category: 'Word & Ministry',
    desc: "You see spiritual drift quickly and feel compelled to say what others avoid. Your words often land harder than you intend because you carry a strong instinct for truth.",
    scripture: { text: 'The one who prophesies speaks to people for their upbuilding and encouragement and consolation.', ref: '1 Corinthians 14:3' },
    shadow: ['discernment', 'wisdom'],
    shadowNote: 'Prophetic gifting needs Discernment to verify what is being sensed and Wisdom to know when and how to deliver it.',
    shadowLow: {
      discernment: 'A prophetic voice without discernment can damage trust over time. Submit strong impressions to mature believers.',
      wisdom: 'Prophetic accuracy without Wisdom in delivery can wound the very people God was trying to reach.'
    }
  },
  evangelism: {
    name: 'Evangelism',
    category: 'Word & Ministry',
    desc: "Conversations about faith come naturally to you and you feel unusual urgency around people who don't know Christ.",
    scripture: { text: 'Do the work of an evangelist, fulfill your ministry.', ref: '2 Timothy 4:5' },
    shadow: ['faith', 'mercy'],
    shadowNote: 'Evangelists need Faith to keep sowing when fruit is delayed and Mercy to care about people, not just outcomes.',
    shadowLow: {
      faith: 'Evangelism without Faith can become results-driven and burn out when visible response is slow.',
      mercy: 'Evangelism without Mercy can become efficient but cold.'
    }
  },
  exhortation: {
    name: 'Exhortation',
    category: 'Word & Ministry',
    desc: "You read people's capacity and call them higher. You are often the reason someone didn't quit.",
    scripture: { text: 'The one who exhorts, in his exhortation.', ref: 'Romans 12:8' },
    shadow: ['discernment', 'wisdom'],
    shadowNote: 'Discernment tells you who needs pressure and who needs gentleness. Wisdom gives your encouragement direction.',
    shadowLow: {
      discernment: 'Without Discernment, Exhortation becomes a blunt instrument.',
      wisdom: 'Without Wisdom, Exhortation can be loud but shallow.'
    }
  },
  pastor: {
    name: 'Shepherding',
    category: 'Word & Ministry',
    desc: "You feel responsible for people in a way others don't. You notice who is missing and carry burdens longer than is reasonable.",
    scripture: { text: 'Pay careful attention to yourselves and to all the flock, in which the Holy Spirit has made you overseers.', ref: 'Acts 20:28' },
    shadow: ['mercy', 'discernment'],
    shadowNote: 'Shepherding needs Mercy to feel people and Discernment to know what is really happening spiritually.',
    shadowLow: {
      mercy: 'Without Mercy, Shepherding becomes administrative.',
      discernment: 'Without Discernment, a shepherd can protect people from the wrong things while missing the real threat.'
    }
  },
  apostleship: {
    name: 'Apostleship',
    category: 'Word & Ministry',
    desc: "You are most alive when you are building something from nothing in new territory. Established structures often feel confining.",
    scripture: { text: 'God has appointed in the church first apostles...', ref: '1 Corinthians 12:28' },
    shadow: ['faith', 'evangelism'],
    shadowNote: 'Pioneer ministry runs on Faith and Evangelism. One fuels risk; the other keeps the mission person-centered.',
    shadowLow: {
      faith: 'Without Faith, apostolic drive can become safe entrepreneurship rather than real pioneering.',
      evangelism: 'Without Evangelism, apostleship can drift toward institution-building rather than people-reaching.'
    }
  },
  helps: {
    name: 'Helps / Service',
    category: 'Practical & Service',
    desc: "You notice what needs to be done and do it. You are energized by supporting other people's callings and feel system breakdowns personally.",
    scripture: { text: '...varieties of service, but the same Lord.', ref: '1 Corinthians 12:5' },
    shadow: ['mercy', 'faith'],
    shadowNote: 'Service needs Mercy to stay personal and Faith to keep going when no one sees the work.',
    shadowLow: {
      mercy: 'Without Mercy, Helps can serve the task while missing the person.',
      faith: 'Without Faith, Helps is vulnerable to burnout and resentment.'
    }
  },
  administration: {
    name: 'Administration',
    category: 'Practical & Service',
    desc: 'You see order inside chaos, organize people instinctively, and turn goals into plans quickly.',
    scripture: { text: '...the one who leads, with zeal.', ref: 'Romans 12:8' },
    shadow: ['wisdom', 'discernment'],
    shadowNote: 'Administration needs Wisdom for direction and Discernment for people placement.',
    shadowLow: {
      wisdom: 'Administration without Wisdom creates organizations that are excellent at the wrong things.',
      discernment: 'Without Discernment, an administrator can build teams full of the wrong people.'
    }
  },
  leadership: {
    name: 'Leadership',
    category: 'Practical & Service',
    desc: "People follow you, often before you have formal authority. You cast vision in a way that moves people.",
    scripture: { text: '...the one who leads, with zeal.', ref: 'Romans 12:8' },
    shadow: ['wisdom', 'faith'],
    shadowNote: 'Leadership needs Wisdom for direction and Faith to call people into what cannot yet be seen.',
    shadowLow: {
      wisdom: 'Without Wisdom, strong Leadership can move people quickly in the wrong direction.',
      faith: "Without Faith, Leadership defaults to what is merely achievable rather than what is actually called."
    }
  },
  giving: {
    name: 'Giving',
    category: 'Practical & Service',
    desc: 'You give with unusual joy and can identify resource needs before they are spoken.',
    scripture: { text: 'The one who contributes, in generosity.', ref: 'Romans 12:8' },
    shadow: ['faith', 'wisdom'],
    shadowNote: 'Giving needs Faith to release what feels risky and Wisdom to place resources where they matter most.',
    shadowLow: {
      faith: 'Without Faith, Giving gets hedged at the edge of discomfort.',
      wisdom: 'Without Wisdom, generosity can fund the wrong things with great enthusiasm.'
    }
  },
  mercy: {
    name: 'Mercy',
    category: 'Practical & Service',
    desc: "You move toward suffering people, feel others' pain deeply, and have unusual capacity to absorb emotional weight.",
    scripture: { text: 'The one who does acts of mercy, with cheerfulness.', ref: 'Romans 12:8' },
    shadow: ['discernment', 'faith'],
    shadowNote: 'Mercy needs Discernment to know where compassion belongs and Faith to keep hope alive in the dark.',
    shadowLow: {
      discernment: 'Without Discernment, Mercy is one of the most exploitable gifts in the body.',
      faith: 'Without Faith, Mercy becomes grief with no horizon.'
    }
  },
  faith: {
    name: 'Faith',
    category: 'Faith & Power',
    desc: "You believe God will move before the evidence arrives and often become an anchor for others in crisis.",
    scripture: { text: 'To another faith by the same Spirit.', ref: '1 Corinthians 12:9' },
    shadow: ['wisdom', 'discernment'],
    shadowNote: 'Faith needs Wisdom and Discernment so bold belief does not turn into presumption.',
    shadowLow: {
      wisdom: 'Faith without Wisdom can lead people into real harm with sincere conviction.',
      discernment: 'Without Discernment, Faith can be hijacked by the wrong voice or opportunity.'
    }
  },
  healing: {
    name: 'Healing',
    category: 'Faith & Power',
    desc: 'You are moved by suffering in a way that compels you to pray, act, and expect God to meet people.',
    scripture: { text: 'To another gifts of healing by the one Spirit.', ref: '1 Corinthians 12:9' },
    shadow: ['faith', 'mercy'],
    shadowNote: 'Healing ministry runs on Mercy and Faith together. One moves you toward pain; the other moves you to pray boldly.',
    shadowLow: {
      faith: 'Healing without Faith becomes empathy without expectation.',
      mercy: 'Without Mercy, healing ministry can feel performed rather than given.'
    }
  },
  miracles: {
    name: 'Miracles',
    category: 'Faith & Power',
    desc: 'You carry a durable expectation that God can act supernaturally in ordinary situations.',
    scripture: { text: 'To another the working of miracles.', ref: '1 Corinthians 12:10' },
    shadow: ['faith', 'discernment'],
    shadowNote: 'The miraculous needs Faith for courage and Discernment for timing, target, and motive.',
    shadowLow: {
      faith: 'Without Faith, the miraculous may be admired but rarely released consistently.',
      discernment: 'Without Discernment, power gifts can drift toward showmanship.'
    }
  },
  tongues: {
    name: 'Tongues',
    category: 'Faith & Power',
    desc: 'You may have a prayer language that bypasses your intellect and deepens your connection to God.',
    scripture: { text: 'To another various kinds of tongues.', ref: '1 Corinthians 12:10' },
    shadow: ['interpretation', 'faith'],
    shadowNote: 'Tongues and Interpretation function together in gathered settings, while Faith helps sustain private practice.',
    shadowLow: {
      interpretation: 'Without Interpretation in the room, public tongues should remain private devotion.',
      faith: 'Without Faith, this gift can be experienced and then quietly shelved.'
    }
  },
  interpretation: {
    name: 'Interpretation of Tongues',
    category: 'Faith & Power',
    desc: 'You receive understanding of what is spoken in tongues and can convey its meaning to the body.',
    scripture: { text: 'To another the interpretation of tongues.', ref: '1 Corinthians 12:10' },
    shadow: ['tongues', 'discernment'],
    shadowNote: 'Interpretation runs alongside Tongues, while Discernment helps verify source and usefulness.',
    shadowLow: {
      tongues: 'Interpretation without Tongues has no raw material to work with in the assembly.',
      discernment: 'Without Discernment, Interpretation can be sincere but inaccurate.'
    }
  },
  discernment: {
    name: 'Discernment of Spirits',
    category: 'Faith & Power',
    desc: 'You read rooms, motives, and spirits quickly and often accurately.',
    scripture: { text: 'To another the ability to distinguish between spirits.', ref: '1 Corinthians 12:10' },
    shadow: ['wisdom', 'prophecy'],
    shadowNote: 'Discernment needs Wisdom for action and the Prophetic gift for language.',
    shadowLow: {
      wisdom: 'Without Wisdom, Discernment sees clearly but struggles to move wisely.',
      prophecy: 'Without Prophetic language, Discernment often stays interior and inactive.'
    }
  },
  knowledge: {
    name: 'Word of Knowledge',
    category: 'Faith & Power',
    desc: 'You receive insight about people, Scripture, or situations in ways that feel received rather than deduced.',
    scripture: { text: 'To one is given through the Spirit the utterance of knowledge.', ref: '1 Corinthians 12:8' },
    shadow: ['wisdom', 'teaching'],
    shadowNote: 'Knowledge is revelation. Wisdom applies it. Teaching helps it reach the body clearly.',
    shadowLow: {
      wisdom: 'Without Wisdom, the gift of Knowledge can become an overwhelming pile of undeployed insight.',
      teaching: 'Without Teaching, revelatory insight may never get shared at the depth it deserves.'
    }
  },
  wisdom: {
    name: 'Word of Wisdom',
    category: 'Faith & Power',
    desc: 'You know not just what is true but what to do with it, especially in complex situations.',
    scripture: { text: 'To one is given through the Spirit the utterance of wisdom.', ref: '1 Corinthians 12:8' },
    shadow: ['knowledge', 'discernment'],
    shadowNote: 'Wisdom needs revelatory raw material and a clear reading of the terrain before it can map the right path.',
    shadowLow: {
      knowledge: 'Without Knowledge, Wisdom risks becoming pragmatic rather than prophetic.',
      discernment: "Without Discernment, Wisdom can be applied to situations you don't fully understand."
    }
  }
};

export const QUESTIONS = [
  { gift: 'teaching', text: "When I explain a concept from Scripture, people say things clicked that hadn't before." },
  { gift: 'teaching', text: "I prepare more than is necessary and can't help it. Depth matters to me." },
  { gift: 'teaching', text: 'I feel frustrated when truth is presented without context or careful handling of the text.' },
  { gift: 'teaching', text: 'Others have told me I make complex things simple without dumbing them down.' },
  { gift: 'prophecy', text: 'I often see spiritual drift or compromise in a group before it becomes obvious to others.' },
  { gift: 'prophecy', text: 'I feel a compulsion to speak truth even when I know it will be unwelcome.' },
  { gift: 'prophecy', text: 'I am grieved when the church softens its message to avoid offense.' },
  { gift: 'prophecy', text: 'People have told me my words cut to the heart in ways that surprised even me.' },
  { gift: 'evangelism', text: 'I find natural opportunities to share the gospel in everyday conversations.' },
  { gift: 'evangelism', text: "I feel genuine urgency around people who don't know Christ." },
  { gift: 'evangelism', text: "Rejection in gospel conversations doesn't discourage me for long." },
  { gift: 'evangelism', text: "I've seen people come to faith as a direct result of my conversations with them." },
  { gift: 'exhortation', text: "I can see someone's potential and feel compelled to call it out even when they cannot see it." },
  { gift: 'exhortation', text: 'People often say I gave them what they needed to keep going.' },
  { gift: 'exhortation', text: "I'm drawn to people who are discouraged or about to quit." },
  { gift: 'exhortation', text: "I can challenge people without them feeling attacked because something usually lands." },
  { gift: 'pastor', text: "I feel responsible for people in my community in a way that doesn't fully turn off." },
  { gift: 'pastor', text: 'I notice when someone is missing from a group and feel compelled to check on them.' },
  { gift: 'pastor', text: "I carry others' burdens long after they stop talking about them." },
  { gift: 'pastor', text: 'I tend to stay with people through long-term struggle rather than moving on quickly.' },
  { gift: 'apostleship', text: "I am most alive when I'm building something that did not exist before." },
  { gift: 'apostleship', text: "Established structures feel limiting to me. I'm always thinking about what could be." },
  { gift: 'apostleship', text: "I've started or significantly launched ministries, teams, or organizations." },
  { gift: 'apostleship', text: 'I have a sense of assignment to a region or people group that drives me.' },
  { gift: 'helps', text: 'I notice what needs to be done and do it without needing to be asked.' },
  { gift: 'helps', text: "I get energy from supporting someone else's calling, not just my own." },
  { gift: 'helps', text: 'I feel personally responsible when a system or event breaks down.' },
  { gift: 'helps', text: 'Others say I make everything run better even when I am not in charge.' },
  { gift: 'administration', text: 'I can see a system in what looks like chaos to other people.' },
  { gift: 'administration', text: 'I naturally organize people and resources toward a goal without being asked to lead.' },
  { gift: 'administration', text: 'I can hold many moving parts in my head at once and track them all.' },
  { gift: 'administration', text: "When I'm given a goal, I immediately start building the plan to get there." },
  { gift: 'leadership', text: "People follow me before I've earned formal authority." },
  { gift: 'leadership', text: "I feel a weight of responsibility for the people under my care that doesn't leave me." },
  { gift: 'leadership', text: "I can cast a vision that moves people toward something they couldn't see before." },
  { gift: 'leadership', text: "I'm willing to take ground that others are waiting for someone else to take." },
  { gift: 'giving', text: 'I give with unusual freedom and joy. Resources move through me without much friction.' },
  { gift: 'giving', text: 'I can identify financial or material needs before they are spoken.' },
  { gift: 'giving', text: "I feel drawn to fund Kingdom work and it doesn't feel like sacrifice." },
  { gift: 'giving', text: 'People have described my generosity as unusual or beyond what made sense.' },
  { gift: 'mercy', text: "I feel others' pain almost as if it were my own." },
  { gift: 'mercy', text: 'I move toward suffering people when others tend to move away.' },
  { gift: 'mercy', text: "I'm drawn to the overlooked, people others have written off or passed by." },
  { gift: 'mercy', text: "I can absorb emotional weight from others and it doesn't crush me. It mobilizes me." },
  { gift: 'faith', text: 'I believe God will move before the evidence arrives, and that confidence is stable.' },
  { gift: 'faith', text: "In a crisis, I become more certain of God's faithfulness, not less." },
  { gift: 'faith', text: 'Others look to me as an anchor when things are uncertain.' },
  { gift: 'faith', text: "I've believed God for things that seemed impossible and seen them come to pass." },
  { gift: 'healing', text: 'I am moved by physical or emotional suffering in a way that compels me to act.' },
  { gift: 'healing', text: 'I pray for the sick with genuine authority and expectation, not just hope.' },
  { gift: 'healing', text: "I've witnessed healing in response to prayer that had no natural explanation." },
  { gift: 'healing', text: 'I am drawn to hospital rooms, hospice settings, or places of physical brokenness.' },
  { gift: 'miracles', text: "I've been part of events that could not be explained naturally." },
  { gift: 'miracles', text: 'I carry a consistent expectation that God will act supernaturally in ordinary situations.' },
  { gift: 'miracles', text: "People around me seem to encounter more of God's power when I'm present." },
  { gift: 'miracles', text: 'I have a boldness to pray for impossible situations without embarrassment.' },
  { gift: 'tongues', text: 'I have or have had a prayer language that goes beyond my natural ability with words.' },
  { gift: 'tongues', text: 'I experience deep spiritual release and connection to God through tongues.' },
  { gift: 'tongues', text: "I've spoken in tongues in a gathered setting as proclamation." },
  { gift: 'tongues', text: 'My prayer life feels qualitatively deeper when I pray in the Spirit.' },
  { gift: 'interpretation', text: 'When someone speaks in tongues, I have received understanding of what was communicated.' },
  { gift: 'interpretation', text: "I've expressed the meaning of a tongue message in a way the body confirmed." },
  { gift: 'interpretation', text: 'I can tell in a gathered setting when a tongue message carries content for the group.' },
  { gift: 'interpretation', text: 'I feel a pull to interpret when tongues are spoken in a community context.' },
  { gift: 'discernment', text: 'I read motives and spiritual conditions in people quickly and usually accurately.' },
  { gift: 'discernment', text: 'I sense when something is spiritually wrong before it can be explained or proven.' },
  { gift: 'discernment', text: "I've been in situations where I knew something was off and others confirmed it later." },
  { gift: 'discernment', text: 'I can tell the difference between a genuine move of God and a counterfeit.' },
  { gift: 'knowledge', text: "I receive insight about people or situations that I didn't learn through normal means." },
  { gift: 'knowledge', text: 'I find things in Scripture that others miss because something opens it.' },
  { gift: 'knowledge', text: "I've said something to someone about their situation that I could not have known naturally." },
  { gift: 'knowledge', text: 'Revelation comes to me in study, prayer, or conversation in ways that feel received rather than deduced.' },
  { gift: 'wisdom', text: 'When people are at a crossroads, they seek me out, and what I say usually helps them move.' },
  { gift: 'wisdom', text: 'I know not just what is true but what to do with it in complex situations.' },
  { gift: 'wisdom', text: 'I can translate theological truth into practical direction for real life.' },
  { gift: 'wisdom', text: 'People describe my counsel as unusually clarifying.' }
];

export const CLUSTERS = {
  'Word & Ministry': {
    name: 'The Proclamation Cluster',
    identity: 'You are built for the ministry of the Word in one of its forms.',
    desc: 'Your strongest gifts tend to move truth from God to people through teaching, exhortation, shepherding, proclamation, or spiritual direction.',
    strengths: [
      'You carry the voice of God in a way the body needs.',
      "People are often changed by encounter with you because you don't just share information.",
      'Your gift reproduces as others grow under your influence.'
    ],
    dangers: [
      'Isolation from people who will challenge your content.',
      'Platform pride replacing care for people.',
      'Neglecting service gifts that make the ministry sustainable.'
    ],
    placement: 'Small groups, mentoring, teaching environments, preaching, one-on-one discipleship, pastoral care settings.',
    partners: 'You need builders and organizers around you so proclamation does not echo in empty rooms.'
  },
  'Practical & Service': {
    name: 'The Builder Cluster',
    identity: 'You are built to make things work: people, systems, resources, and organizations.',
    desc: 'These gifts often become the infrastructure of healthy ministry and help vision turn into something durable.',
    strengths: [
      'You make the body actually work, not just talk about working.',
      'You create sustainable structures that can outlast personalities.',
      'You free others to do what they are called to do.'
    ],
    dangers: [
      'Burnout from doing without being refilled.',
      'Undervaluing your contribution because it has little stage presence.',
      'Letting efficiency become the mission instead of people.'
    ],
    placement: 'Operations, organizational leadership, financial stewardship, team building, events, elder or deacon roles.',
    partners: "You need people who keep the 'why' in front of what you are building."
  },
  'Faith & Power': {
    name: 'The Power Cluster',
    identity: 'You operate at the intersection of the natural and supernatural.',
    desc: 'These gifts often carry heightened sensitivity to spiritual reality and are especially important in prayer, healing, discernment, and spiritually contested environments.',
    strengths: [
      'You help bring the body into contact with the power of God in real time.',
      'You can sense threats and opportunities others miss.',
      "Your presence often raises the spiritual temperature of a room."
    ],
    dangers: [
      'Isolation from accountability and theological grounding.',
      'Mysticism without mission.',
      'Pride of revelation or overconfidence in what you sense.'
    ],
    placement: 'Prayer teams, healing ministry, prophetic communities, counseling, intercession, spiritual direction.',
    partners: 'You need structure, accountability, and men rooted in the Word around you.'
  }
};
