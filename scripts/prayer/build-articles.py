#!/usr/bin/env python3
"""Build the Prayer Formation foundation articles.

Article bodies live in scripts/prayer/articles/<slug>.html (written in the
Daily's voice). This script wraps each body in the shared site page (header,
footer, metadata, next-step links) and writes prayer/<slug>/index.html.

Run from the repository root:  python3 scripts/prayer/build-articles.py
"""
import html
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
SRC = ROOT / "scripts" / "prayer" / "articles"
SITE = "https://thewrkshop.com"
GA_ID = "G-N48478JV2Z"

# Order matters: it sets "n of 5" and previous/next links.
ARTICLES = [
    {
        "slug": "what-is-biblical-prayer",
        "title": "What Is Biblical Prayer?",
        "h1": "What is <em>biblical prayer?</em>",
        "lead": "Prayer isn't a technique for getting God to act. It's a son talking to his Father.",
        "description": "Prayer isn't a technique for getting God to act. What Matthew 6, Romans 8 and Hebrews 4 teach about praying as a son to a Father, through Jesus.",
        "next": [
            ("/prayer/guided-prayer/", "Pray it: a five-minute guided prayer"),
            ("/prayer/pattern-finder/", "Find what's happening beneath your prayers"),
        ],
        "session": 1,
    },
    {
        "slug": "after-you-give-it-to-god",
        "title": "What Do I Do After I Give It to God?",
        "h1": "What do I do after <em>I give it to God?</em>",
        "lead": "Surrender doesn't end your part. It ends your claim to run the outcome.",
        "description": "Surrender doesn't end your part. It ends your claim to run the outcome. What Gethsemane, James 4 and 1 Peter 5 teach about giving it to God, then getting up.",
        "next": [
            ("/prayer/surrender/", "Sort it: the Surrender Tool"),
            ("/prayer/guided-prayer/", "Pray it: a five-minute guided prayer"),
        ],
        "session": 3,
    },
    {
        "slug": "when-god-seems-silent",
        "title": "When God Seems Silent",
        "h1": "When God <em>seems silent</em>",
        "lead": "Feeling forsaken isn't the same as being forsaken. Even Jesus prayed the question.",
        "description": "Feeling forsaken isn't the same as being forsaken. Psalm 13, Psalm 88, Paul's thorn and the cross give you words for unanswered prayer.",
        "next": [
            ("/prayer/guided-prayer/?path=silence", "Pray it: a guided lament"),
            ("/prayer/7-day/", "Walk it out: seven days of prayer"),
        ],
        "session": 4,
    },
    {
        "slug": "how-do-i-know-what-to-pray-for",
        "title": "How Do I Know What to Pray For?",
        "h1": "How do I know <em>what to pray for?</em>",
        "lead": "Ask. Then let Him reshape the asking.",
        "description": "Not sure what to pray for? James 4, the Lord's Prayer, Philippians 4 and John 15 show how to ask honestly and let God reshape your desires.",
        "next": [
            ("/prayer/pattern-finder/", "Find what's happening beneath your prayers"),
            ("/prayer/guided-prayer/", "Pray it: a five-minute guided prayer"),
        ],
        "session": 2,
    },
    {
        "slug": "when-waiting-begins-to-define-you",
        "title": "When Waiting Begins to Define You",
        "h1": "When waiting begins <em>to define you</em>",
        "lead": "You can wait for something without waiting to become someone.",
        "description": "When an unanswered prayer starts to name you. Hannah, Romans 8, Psalm 27 and Jesus' baptism on waiting without losing who you are.",
        "next": [
            ("/prayer/guided-prayer/?path=waiting", "Pray it: a guided prayer for waiting"),
            ("/prayer/7-day/", "Walk it out: seven days of prayer"),
        ],
        "session": 5,
    },
]

NIV = ("Scripture quotations are taken from the Holy Bible, New International Version®, NIV®. "
       "Copyright © 1973, 1978, 1984, 2011 by Biblica, Inc.™ Used by permission. All rights reserved worldwide.")

PAGE = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>{title} | TheWrkShop</title>
  <link rel="stylesheet" href="/style.css"/>
  <link rel="stylesheet" href="/patterns/patterns.css"/>
  <link rel="stylesheet" href="/prayer/prayer.css?v=1"/>
  <link rel="icon" type="image/x-icon" href="/assets/favicon/favicon.ico?v=2">
  <meta name="description" content="{description}"/>
  <link rel="canonical" href="{url}"/>
  <meta property="og:site_name" content="TheWrkShop"/>
  <meta property="og:type" content="article"/>
  <meta property="og:title" content="{title}"/>
  <meta property="og:description" content="{lead_attr}"/>
  <meta property="og:url" content="{url}"/>
  <meta property="og:image" content="{site}/assets/og/prayer-{slug}.png"/>
  <meta property="og:image:width" content="1200"/>
  <meta property="og:image:height" content="630"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <script type="application/ld+json">
{jsonld}
  </script>
  <!-- Google Analytics: page views only. -->
  <script async src="https://www.googletagmanager.com/gtag/js?id={ga}"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments);}}gtag('js',new Date());gtag('config','{ga}');</script>
</head>
<body class="pt-page pr-page">
  <div id="site-header"></div>
  <main>
    <section class="pt-hero">
      <div class="pt-narrow">
        <nav class="pt-crumbs" aria-label="Breadcrumb"><a href="/prayer/">Prayer Formation</a> / Foundations</nav>
        <span class="pt-eyebrow">Foundations · {n} of {total}</span>
        <h1 class="pt-h1" id="dTitle">{h1}</h1>
        <p class="pt-lead">{lead}</p>
      </div>
    </section>

    <article class="pr-article">
{body}
      <h2>Keep Going</h2>
      <div class="pr-next">
{next_links}
        <a class="pr-ghost" href="/prayer/for-groups/#session-{session}">Leading a group? Session {session} uses this article</a>
      </div>
      <nav class="pt-crumbs pr-pager" aria-label="More foundations"><a href="/prayer/{prev_slug}/">← {prev_title}</a> · <a href="/prayer/{next_slug}/">{next_title} →</a></nav>

      <p class="pr-fine">{niv} Prayer Formation is for spiritual reflection. It isn't counseling or emergency help. If you or someone else is in danger, call 911. <a href="/prayer/privacy/">Privacy &amp; safeguarding</a></p>
    </article>
  </main>

  <footer>
    <div class="footer-content">
      <nav class="footer-links" aria-label="Browse">
        <a href="/upstream/">Start Here</a>
        <a href="/daily.html">The Daily</a>
        <a href="/leadership/">Leadership</a>
        <a href="/get-known.html">Groups</a>
        <a href="/library/">Library</a>
        <a href="/blog-archive.html">Blog</a>
        <a href="/podcasts.html">Podcast</a>
        <a href="/products.html">Store</a>
        <a href="/#contact">Contact</a>
      </nav>
      <div class="footer-logo"><img src="/assets/images/thewrkshop-logo-transparent-trimmed.png" alt="TheWrkShop" width="233" height="180" loading="lazy"></div>
      <p>&copy; 2026 <span class="sitename"></span>. All rights reserved.</p>
    </div>
  </footer>

  <script src="/script.js"></script>
  <script src="/assets/js/daily-share.js"></script>
</body>
</html>
"""


def main():
    total = len(ARTICLES)
    for i, a in enumerate(ARTICLES):
        body = (SRC / f"{a['slug']}.html").read_text().rstrip() + "\n"
        prev_a = ARTICLES[i - 1]
        next_a = ARTICLES[(i + 1) % total]
        url = f"{SITE}/prayer/{a['slug']}/"
        jsonld = json.dumps({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": a["title"],
            "description": a["lead"],
            "url": url,
            "image": f"{SITE}/assets/og/prayer-{a['slug']}.png",
            "inLanguage": "en-US",
            "isAccessibleForFree": True,
            "author": {"@id": f"{SITE}/#organization"},
            "publisher": {"@id": f"{SITE}/#organization", "@type": "Organization", "name": "TheWrkShop", "url": SITE},
            "isPartOf": {"@id": f"{SITE}/#website"},
        }, indent=2, ensure_ascii=False)
        next_links = "\n".join(
            f'        <a{" class=\"pr-ghost\"" if j else ""} href="{href}">{html.escape(label)}</a>'
            for j, (href, label) in enumerate(a["next"]))
        page = PAGE.format(
            title=html.escape(a["title"]), description=html.escape(a["description"], quote=True),
            lead_attr=html.escape(a["lead"], quote=True), url=url, site=SITE, jsonld=jsonld, ga=GA_ID,
            n=i + 1, total=total, h1=a["h1"], lead=html.escape(a["lead"]), body=body,
            next_links=next_links, session=a["session"],
            slug=a["slug"], prev_slug=prev_a["slug"], prev_title=html.escape(prev_a["title"]),
            next_slug=next_a["slug"], next_title=html.escape(next_a["title"]), niv=NIV)
        out = ROOT / "prayer" / a["slug"] / "index.html"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(page)
        print("wrote", out.relative_to(ROOT))


if __name__ == "__main__":
    main()
