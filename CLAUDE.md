# TheWrkShop site: working rules for Claude

## How changes go live
- Every change goes to the `staging` branch first (work branches merge into `staging`).
  Netlify builds it at https://staging--curious-profiterole-fae7e1.netlify.app.
- S reviews there. Only after S approves does `staging` get merged into `main` (live).
- No per-PR deploy previews, no other preview links.

## Adding or editing a Daily (content/daily/*.json): make it search-ready every time
Follow docs/SEARCH-SYSTEM.md. In short, every new Daily, leadership post and weekend 4-3-2-1 post gets:
1. `search_phrase`: what a man would type into Google about this problem, in readers' words
   (e.g. "accountability", not "ownership gap"). Put it first in `keywords`.
2. `seo_title` (~60 chars): topic or search phrase first, then the hook. Never lead with the
   series name ("The Battle Before the Battle").
3. `seo_description` (140–160 chars): the problem in plain words plus the promise.
4. `topics`: 1–3 slugs from content/topics.json.
5. One plain sentence in The Truth that says the search phrase, written in S's Daily voice
   (short, direct). Keep his indirect style everywhere else. This sentence goes out to the men,
   so list each new one for S to approve in your reply.

Then run, before committing:
- `npm run search:fill -- --upcoming` (fills any missing search_phrase / topics / seo_title)
- `npm run check:search` (should report 0 with suggestions)
- `npm run check:links` after a build (should report 0 broken)

If S pastes Dailies into insert_content/input/ and runs `python3 insert_content/daily_insert.py`,
the same fill runs automatically and the report in insert_content/output.txt lists any post
still missing its plain-words sentence.

## Writing
- S's own wording stays his. Don't rewrite a Daily's body beyond the one plain-words sentence
  unless he asks.
- Scripture: NIV unless the post says otherwise.
