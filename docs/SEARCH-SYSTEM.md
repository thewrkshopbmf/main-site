# TheWrkShop Search System

How TheWrkShop gets found on Google, Bing and AI search (ChatGPT, Perplexity, Google's AI answers),
without flattening the writing.

## Why this exists

"Nobody Owns It" (Nov 10, 2026) never used the word *accountability*. Nearly every reader reply opened
with it. The indirect style is why the post landed, so keep it. But the people we want to reach type
the plain word into Google. Search engines and AI tools match on meaning, so a post on ownership gets
*considered* for "accountability". What wins the result, and gets quoted in an AI answer, is the plain
phrase in the title, the snippet and at least one clear sentence on the page.

**The rule: write indirectly, label plainly.**

## Before you publish (every Daily, leadership post, weekend post and Question)

1. **Search phrase.** Ask: *what would a man type into Google about this problem?* Put it in
   `"search_phrase"`. Use readers' words, not ours ("accountability", not "ownership gap").
2. **Google title** (`"seo_title"`, about 60 characters): lead with the topic or the search phrase,
   then the hook. Never lead with the series name.
   e.g. `Nobody Owns It: The Accountability Gap at Work and Church`
3. **Google snippet** (`"seo_description"`, 140–160 characters): the problem in plain words plus the promise.
4. **Say it once on the page.** One plain sentence with the phrase, usually in The Truth.
   e.g. *"This is what an accountability gap looks like."* Once is enough; don't stuff it.
5. **Topics** (`"topics"`): 1–3 slugs from `content/topics.json`. The page shows a
   "Topics: …" line linking to each hub, and the post joins those hubs automatically.
6. **Keywords** (`"keywords"`): 4–6 phrases people search, including the Scripture reference.

Run `npm run check:search` to check upcoming posts. It runs in every build too. It only warns;
it never blocks a release.

### Example (top of a Daily's JSON)

```json
"seo_title": "Nobody Owns It: The Accountability Gap at Work and Church",
"seo_description": "Everyone sees the problem. No one takes the next step. A biblical look at ownership, accountability gaps and concerns lost between handoffs at work and church.",
"search_phrase": "accountability",
"keywords": ["accountability", "lack of ownership", "diffusion of responsibility", "Ezekiel 22:30", "Christian leadership"],
"topics": ["accountability", "leadership"],
```

## What the site does automatically

| What | Where | Why it helps |
|---|---|---|
| Topic hubs | `/topics/` and `/topics/<slug>/` | One strong page per subject (tools, Questions, every post) tends to outrank any single post, and tells AI engines what TheWrkShop is about |
| "Topics:" line | Bottom of every Daily, leadership post, weekend post and Question | Puts the plain words on every page and links posts to their hub |
| Structured data | Every post | Topic names are added to the post's keywords; hubs carry `CollectionPage` + breadcrumb data |
| Devotional archive filter | `/daily-archive.html` | "All topics" now filters by the new topics, not just Leadership |
| llms.txt | `/llms.txt` | The Topics section (the summary AI tools read) is rebuilt from the hubs every build |
| Sitemap | `/sitemap.xml` | Hubs are included, dated by their newest post |
| IndexNow | `netlify/shared/indexnow.js` | After each production deploy, tells Bing (which feeds ChatGPT search and Copilot) about today's post and its hubs right away |
| Social cards | `assets/og/topics/<slug>.png` | Each hub has its own share image |

## Weekend 4-3-2-1 posts

Same checklist. The weekend post is the best place to *name* the week's theme plainly, since it
gathers the week's Dailies: e.g. "This week was about accountability." Give it `topics` and
`keywords` like a Daily.

## Tools, studies and resource pages

These are hand-built pages, so the checklist is manual:

1. `<title>`: the search phrase first, e.g. *What's Feeding It? A Private Self-Check on Lust*.
2. `<meta name="description">`: 140–160 characters, plain words.
3. Add the page's path to the `resources` list of 1–3 topics in `content/topics.json`. It then appears
   under "Start here" on those hubs, with its own title and description.
4. Link to it from a Question page (`"tool"` or `"related"`).
5. Add one line for it to `llms.txt` under Resources.

## Questions Men Ask

A Question page answers one real search directly, and the hubs list them first. When readers keep
replying with the same word (like *accountability*), that's a Question to write. Add
`content/questions/<slug>.json` (see the top of `scripts/build-questions.js`) and give it `topics`.

## Adding a new topic

Add an entry to `content/topics.json` with `slug`, `name`, `title`, `description`, `intro`,
`search_phrases`, `match` and `resources`. Make its social card:

```
python3 scripts/og/make-og-card.py --eyebrow "TOPIC · THEWRKSHOP" --title "<title before the colon>" \
  --tagline "<title after the colon>" --out assets/og/topics/<slug>.png
```

Add a topic only when it will have at least 5–6 posts; a thin hub doesn't help.

## The feedback loop (monthly, 15 minutes)

1. **Google Search Console → Performance → Queries.** The words people actually used to find
   TheWrkShop. If men find a post with a phrase it doesn't use, add the phrase to its `seo_title`
   or `seo_description` and use it in the next post on that subject.
2. **Bing Webmaster Tools** (sign in, then import the site from Search Console). Bing feeds ChatGPT
   search and Copilot. Submit `https://thewrkshop.com/sitemap.xml`.
3. **Reader replies.** The words men use when they reply ("this is about accountability") are
   search phrases. Note them in the next post's `search_phrase`.
4. **Pages with impressions but few clicks**: rewrite the `seo_title`/`seo_description`.

## The archive

`npm run check:search -- --all` lists every past post whose main phrase never appears in the visible
text. `docs/search-archive-worklist.md` is a snapshot of that list from Nov 10, 2026. Work through it
a few posts at a time, adding one plain sentence where it reads naturally. The Topics line already
puts the topic words on every page, so this is polish, not a fix.
