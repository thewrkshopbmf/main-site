// scripts/shared/next-steps.js
// "Go deeper" pathways: connects each Daily, leadership post and blog post to the
// reflection tool, study or group step that fits its topic. Matching is by keywords
// in the post's own words, so new posts get sensible next steps automatically.
// To steer one post by hand, add  "next_steps": ["prayer", "groups"]  (topic keys
// below) to its content JSON; those are used first.

const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const TOPICS = {
  prayer: {
    href: '/prayer/', icon: '🙏', title: 'Prayer Formation',
    text: 'Go deeper than the request: short articles, a Surrender Tool and seven days of prayer.',
    words: ['pray', 'prayer', 'praying', 'prayers', 'god is silent', 'god feels silent', 'silence of god', 'waiting on god', 'wait on', 'unanswered', 'intercede']
  },
  afterAmen: {
    href: '/after-the-amen/', icon: '🕊️', title: 'After the Amen',
    text: 'What do you do after you give it to God? A private reflection on trusting Him after you pray.',
    words: ['let go', 'surrender', 'give it to god', 'when god says no', 'trust god', 'release', 'outcome', 'provide', 'provider']
  },
  belief: {
    href: '/belief/', icon: '✝️', title: 'The Belief Project',
    text: '“I believe. Help my unbelief.” See where trust holds and where it gives way under pressure.',
    words: ['doubt', 'doubts', 'unbelief', 'believe', 'belief', 'fear', 'fears', 'afraid', 'anxious', 'anxiety', 'worry', 'trust']
  },
  patterns: {
    href: '/tools/pattern-finder/', icon: '🧭', title: 'The Pattern Finder',
    text: 'What’s driving your reactions? A 3–5 minute reflection with a 7-day practice.',
    words: ['anger', 'angry', 'react', 'reacts', 'reaction', 'reactions', 'temper', 'control', 'controlling', 'defensive', 'defensiveness', 'approval', 'people-pleasing', 'liked', 'prove', 'proving', 'avoid', 'avoidance', 'conflict', 'disagree', 'disagreement', 'criticism', 'feedback', 'tongue', 'listen', 'listens']
  },
  kingdom: {
    href: '/tools/kingdom-first/', icon: '👑', title: 'What’s Really First?',
    text: 'A Matthew 6:33 reflection on what’s actually on the throne of your life.',
    words: ['seek first', 'kingdom', 'throne', 'first things', 'masters', 'money', 'riches', 'wealth', 'idol', 'idols', 'idolatry', 'loyalty', 'priority', 'priorities', 'treasure', 'treasures']
  },
  heart: {
    href: '/tools/unexamined-heart/', icon: '🪞', title: 'The Unexamined Heart',
    text: 'A 2 Kings 5 reflection on expectations, pride, defensiveness and obedience.',
    words: ['pride', 'proud', 'humble', 'humility', 'expectation', 'expectations', 'obey', 'obedience', 'admit', 'excuse', 'excuses', 'rules', 'integrity', 'guard your heart', 'guard the well', 'motives']
  },
  moments: {
    href: '/one-verse-man/diagnostic/', icon: '⏳', title: 'Are You Missing Your Moments?',
    text: 'A private reflection on pace, attention and presence, with an optional 7-day email plan.',
    words: ['scroll', 'scrolling', 'phone', 'distracted', 'distraction', 'attention', 'busy', 'busyness', 'hurry', 'pace', 'rest', 'be still', 'stillness', 'be present', 'presence', 'sabbath', 'looking back']
  },
  gifts: {
    href: '/assessment.html', icon: '🛠️', title: 'Spiritual Gifts Assessment',
    text: 'Discover how God built you to serve and where you might fit.',
    words: ['gift', 'gifts', 'gifted', 'calling', 'purpose', 'serve', 'serving', 'in your hand', 'entrusted', 'talents', 'sent', 'poured out', 'built to']
  },
  groups: {
    href: '/get-known.html', icon: '🤝', title: 'Don’t do this alone',
    text: 'Join an online group of men who will tell you the truth. Start with a short form and a 20-minute call.',
    words: ['brother', 'brotherhood', 'alone', 'isolation', 'isolated', 'confess', 'accountab', 'i need help', 'falls', 'together', 'one another', 'each other', 'room']
  },
  upstream: {
    href: '/upstream/', icon: '🔁', title: 'The Upstream Formation Framework',
    text: 'Five questions that catch a reaction before it happens: trigger, interpretation, agreement, response, formation.',
    words: []
  },
  infographics: {
    href: '/infographics/', icon: '🖼️', title: 'Free leadership infographics',
    text: 'Share the frameworks with your team: “Every Leader Trains the Room,” the Information Funnel and more.',
    words: []
  }
};

function textOf(entry) {
  const parts = [entry.title, entry.subtitle, entry.headline, entry.headline_sub, entry.tagline, entry.verse_ref, entry.verse_text, entry.excerpt];
  const walk = (v) => {
    if (!v) return;
    if (typeof v === 'string') parts.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (typeof v === 'object') Object.values(v).forEach(walk);
  };
  walk(entry.sections);
  walk(entry.body_html);
  return parts.filter(Boolean).join(' ').replace(/<[^>]+>/g, ' ').toLowerCase();
}

// Whole words and phrases only, so "rest" doesn't match "interest" and "sent" doesn't match "present".
const reCache = new Map();
function countHits(text, word) {
  let re = reCache.get(word);
  if (!re) {
    re = new RegExp(`(^|[^a-z])${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![a-z])`, 'g');
    reCache.set(word, re);
  }
  return (text.match(re) || []).length;
}

// Returns topic keys, best match first. kind: 'daily' | 'leadership' | 'blog'
export function pickNextSteps(entry, kind = 'daily') {
  const chosen = [];
  const add = (k) => { if (TOPICS[k] && !chosen.includes(k)) chosen.push(k); };
  (Array.isArray(entry.next_steps) ? entry.next_steps : []).forEach(add);

  const text = textOf(entry);
  const title = [entry.title, entry.subtitle, entry.headline, entry.headline_sub, entry.tagline].filter(Boolean).join(' ').toLowerCase();
  const scored = Object.entries(TOPICS)
    .filter(([k, t]) => t.words.length && k !== 'groups')
    // Leadership posts reach a mainstream audience: point them to the reflection tools, not prayer studies.
    .filter(([k]) => kind !== 'leadership' || !['prayer', 'afterAmen', 'gifts'].includes(k))
    .map(([k, t]) => [k, t.words.reduce((s, w) => s + countHits(text, w) + 3 * countHits(title, w), 0)])
    .filter(([, s]) => s >= 3)
    .sort((a, b) => b[1] - a[1]);

  for (const [k] of scored) { if (chosen.length >= 2) break; add(k); }
  for (const k of kind === 'leadership' ? ['upstream', 'patterns'] : ['patterns', 'upstream']) { if (chosen.length < 2) add(k); }

  // Third card: the relational next step.
  if (kind === 'leadership') add('infographics');
  else add('groups');
  return chosen.slice(0, 3);
}

export function nextStepsHtml(entry, kind = 'daily') {
  const keys = pickNextSteps(entry, kind);
  const heading = kind === 'leadership' ? 'Take this further' : 'Go deeper';
  const cards = keys.map((k) => {
    const t = TOPICS[k];
    return `      <a class="resource-card" href="${esc(t.href)}" data-next-step="${esc(k)}">
        <div class="rc-top" aria-hidden="true">${t.icon}</div>
        <div class="rc-body">
          <h3>${esc(t.title)}</h3>
          <p>${esc(t.text)}</p>
        </div>
      </a>`;
  }).join('\n');
  return `<section class="next-steps" aria-labelledby="nextStepsTitle">
      <h2 id="nextStepsTitle" class="next-steps-title">${heading}</h2>
      <div class="resource-grid next-steps-grid">
${cards}
      </div>
    </section>`;
}
