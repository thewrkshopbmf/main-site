#!/usr/bin/env python3
"""Build the Prayer Formation section (/prayer/).

Sources (edit these, then rebuild):
  scripts/prayer/articles/<slug>.html  body of each foundation article (Daily voice)
  scripts/prayer/pages/<name>.html     <main> content of the hub, tools, guides

Output: prayer/**/index.html. Shared styles: prayer/prayer.css.
Tool behaviour: prayer/prayer-tools.js (everything stays in the browser).

Run from the repository root:  python3 scripts/prayer/build-prayer.py
"""
import html
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
SRC = ROOT / "scripts" / "prayer"
SITE = "https://thewrkshop.com"
GA_ID = "G-N48478JV2Z"
CSS_V = "4"
JS_V = "2"

NIV = ("Scripture quotations are taken from the Holy Bible, New International Version®, NIV®. "
       "Copyright © 1973, 1978, 1984, 2011 by Biblica, Inc.™ Used by permission. All rights reserved worldwide.")

# Order matters: it sets "n of 5" and previous/next links.
ARTICLES = [
    {
        "slug": "what-is-biblical-prayer",
        "title": "What Is Biblical Prayer?",
        "h1": "What is <em>biblical prayer?</em>",
        "lead": "Prayer isn't a technique for getting God to act. It's a son talking to his Father.",
        "description": "Prayer isn't a technique for getting God to act. What Matthew 6, Romans 8 and Hebrews 4 teach about praying as a son to a Father, through Jesus.",
        "next": [("/prayer/guided-prayer/#path=words", "Pray it: a five-minute guided prayer"),
                 ("/prayer/pattern-finder/", "Find what's happening beneath your prayers")],
        "session": 1,
    },
    {
        "slug": "after-you-give-it-to-god",
        "title": "What Do I Do After I Give It to God?",
        "h1": "What do I do after <em>I give it to God?</em>",
        "lead": "Surrender doesn't end your part. It ends your claim to run the outcome.",
        "description": "Surrender doesn't end your part. It ends your claim to run the outcome. What Gethsemane, James 4 and 1 Peter 5 teach about giving it to God, then getting up.",
        "next": [("/prayer/surrender/", "Sort it: the Surrender Tool"),
                 ("/prayer/guided-prayer/#path=control", "Pray it: a five-minute guided prayer")],
        "session": 3,
    },
    {
        "slug": "when-god-seems-silent",
        "title": "When God Seems Silent",
        "h1": "When God <em>seems silent</em>",
        "lead": "Feeling forsaken isn't the same as being forsaken. Even Jesus prayed the question.",
        "description": "Feeling forsaken isn't the same as being forsaken. Psalm 13, Psalm 88, Paul's thorn and the cross give you words for unanswered prayer.",
        "next": [("/prayer/guided-prayer/#path=silence", "Pray it: a guided lament"),
                 ("/prayer/7-day/", "Walk it out: seven days of prayer")],
        "session": 4,
    },
    {
        "slug": "how-do-i-know-what-to-pray-for",
        "title": "How Do I Know What to Pray For?",
        "h1": "How do I know <em>what to pray for?</em>",
        "lead": "Ask. Then let Him reshape the asking.",
        "description": "Not sure what to pray for? James 4, the Lord's Prayer, Philippians 4 and John 15 show how to ask honestly and let God reshape your desires.",
        "next": [("/prayer/pattern-finder/", "Find what's happening beneath your prayers"),
                 ("/prayer/guided-prayer/#path=unsure", "Pray it: a five-minute guided prayer")],
        "session": 2,
    },
    {
        "slug": "when-waiting-begins-to-define-you",
        "title": "When Waiting Begins to Define You",
        "h1": "When waiting begins <em>to define you</em>",
        "lead": "You can wait for something without waiting to become someone.",
        "description": "When an unanswered prayer starts to name you. Hannah, Romans 8, Psalm 27 and Jesus' baptism on waiting without losing who you are.",
        "next": [("/prayer/guided-prayer/#path=waiting", "Pray it: a guided prayer for waiting"),
                 ("/prayer/7-day/", "Walk it out: seven days of prayer")],
        "session": 5,
    },
]

# Hub, tools and guides. "path" is the folder under /prayer/ ("" = the hub).
PAGES = [
    {"src": "hub", "path": "", "title": "Prayer Formation: Go Deeper Than the Request",
     "description": "Free, private prayer resources from TheWrkShop: five foundations, a Prayer Pattern Finder, a Surrender Tool, guided prayer, seven days of prayer and a six-session group guide.",
     "og": "prayer", "type": "CollectionPage", "body_class": "pr-hub"},
    {"src": "pattern-finder", "path": "pattern-finder", "title": "The Prayer Pattern Finder",
     "description": "What's happening beneath your prayers? Two questions, then Scripture, a prayer and a next step for what you're carrying and how you tend to respond. Private: nothing is saved or sent.",
     "og": "prayer", "type": "WebApplication", "body_class": "pr-tool", "niv": True},
    {"src": "surrender", "path": "surrender", "title": "The Surrender Tool: What's Mine, What's Theirs, What's God's",
     "description": "Sort what you keep picking back up into four columns: mine to do, mine to influence, theirs to decide, God's to determine. Leave with one step and a prayer. Private: nothing is saved or sent.",
     "og": "prayer-after-you-give-it-to-god", "type": "WebApplication", "body_class": "pr-tool", "niv": True},
    {"src": "guided-prayer", "path": "guided-prayer", "title": "Guided Prayer: Five Minutes With Your Father",
     "description": "A five-minute guided prayer from TheWrkShop. Be still, name the burden, read Scripture, pray it, take one faithful step. No timer, no score, nothing saved.",
     "og": "prayer", "type": "WebPage", "body_class": "pr-tool", "niv": True},
    {"src": "7-day", "path": "7-day", "title": "Seven Days of Prayer",
     "description": "Seven days, one passage and one practice a day: from Our Father to lament to getting up and doing your part. No streaks. Start anywhere.",
     "og": "prayer", "type": "WebPage", "body_class": "pr-tool", "niv": True},
    {"src": "for-groups", "path": "for-groups", "title": "Prayer Formation: Six-Session Group Guide",
     "description": "A six-session leader guide for men's groups, small groups and classes: discussion questions, exercises, a 45-minute rhythm and pastoral safeguards.",
     "og": "prayer", "type": "WebPage", "body_class": "pr-guide", "niv": True},
    {"src": "privacy", "path": "privacy", "title": "Prayer Formation: Privacy and Safeguarding",
     "description": "What the Prayer Formation tools do and don't collect, and what to do if you or someone else needs help.",
     "og": "prayer", "type": "WebPage", "body_class": "pr-guide"},
]

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
      </nav>
      <div class="footer-logo"><img src="/assets/images/thewrkshop-logo-transparent-trimmed.png" alt="TheWrkShop" width="233" height="180" loading="lazy"></div>
      <p>&copy; 2026 <span class="sitename"></span>. All rights reserved.</p>
    </div>
  </footer>"""

HEAD = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>{title} | TheWrkShop</title>
  <link rel="stylesheet" href="/style.css"/>
  <link rel="stylesheet" href="/patterns/patterns.css"/>
  <link rel="stylesheet" href="/prayer/prayer.css?v={css_v}"/>
  <link rel="icon" type="image/x-icon" href="/assets/favicon/favicon.ico?v=2">
  <meta name="description" content="{description}"/>
  <link rel="canonical" href="{url}"/>
  <meta property="og:site_name" content="TheWrkShop"/>
  <meta property="og:type" content="{og_type}"/>
  <meta property="og:title" content="{title}"/>
  <meta property="og:description" content="{og_description}"/>
  <meta property="og:url" content="{url}"/>
  <meta property="og:image" content="{site}/assets/og/{og}.png"/>
  <meta property="og:image:width" content="1200"/>
  <meta property="og:image:height" content="630"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <script type="application/ld+json">
{jsonld}
  </script>
  <!-- Google Analytics: page views only. The address is sent without anything after ? or #,
       so tool choices (e.g. #path=silence) never reach analytics. -->
  <script async src="https://www.googletagmanager.com/gtag/js?id={ga}"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments);}}gtag('js',new Date());gtag('config','{ga}',{{page_location:location.origin+location.pathname}});</script>
</head>
<body class="pt-page pr-page {body_class}">
  <div id="site-header"></div>
  <main>
"""

TAIL = """  </main>

{footer}

  <script src="/script.js"></script>
{scripts}</body>
</html>
"""


def jsonld(kind, title, desc, url, og):
    data = {
        "@context": "https://schema.org",
        "@type": kind,
        "name" if kind != "Article" else "headline": title,
        "description": desc,
        "url": url,
        "image": f"{SITE}/assets/og/{og}.png",
        "inLanguage": "en-US",
        "isAccessibleForFree": True,
        "publisher": {"@id": f"{SITE}/#organization", "@type": "Organization", "name": "TheWrkShop", "url": SITE},
        "isPartOf": {"@id": f"{SITE}/#website"},
    }
    if kind == "Article":
        data["author"] = {"@id": f"{SITE}/#organization"}
    if kind == "WebApplication":
        data.update({"applicationCategory": "LifestyleApplication", "operatingSystem": "Any",
                     "browserRequirements": "Requires JavaScript",
                     "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"}})
    return json.dumps(data, indent=2, ensure_ascii=False)


def head(title, description, url, og, kind, body_class, og_description=None):
    return HEAD.format(
        title=html.escape(title), description=html.escape(description, quote=True), url=url,
        og_type="article" if kind == "Article" else "website",
        og_description=html.escape(og_description or description, quote=True),
        site=SITE, og=og, jsonld=jsonld(kind, title, og_description or description, url, og),
        ga=GA_ID, body_class=body_class, css_v=CSS_V)


def tail(scripts):
    return TAIL.format(footer=FOOTER, scripts="".join(f'  <script src="{s}"></script>\n' for s in scripts))


def fine_print(niv=True):
    return (f'<p class="pr-fine">{NIV + " " if niv else ""}Prayer Formation is for spiritual reflection. '
            "It isn't counseling or emergency help. If you or someone else is in danger, call 911. "
            '<a href="/prayer/privacy/">Privacy &amp; safeguarding</a></p>')


def build_articles():
    total = len(ARTICLES)
    for i, a in enumerate(ARTICLES):
        body = (SRC / "articles" / f"{a['slug']}.html").read_text().rstrip() + "\n"
        prev_a, next_a = ARTICLES[i - 1], ARTICLES[(i + 1) % total]
        url = f"{SITE}/prayer/{a['slug']}/"
        og = f"prayer-{a['slug']}"
        next_links = "\n".join(
            f'        <a{" class=\"pr-ghost\"" if j else ""} href="{href}">{html.escape(label)}</a>'
            for j, (href, label) in enumerate(a["next"]))
        page = head(a["title"], a["description"], url, og, "Article", "pr-article-page", a["lead"])
        page += f"""    <section class="pt-hero">
      <div class="pt-narrow">
        <nav class="pt-crumbs" aria-label="Breadcrumb"><a href="/prayer/">Prayer Formation</a> / Foundations</nav>
        <span class="pt-eyebrow">Foundations · {i + 1} of {total}</span>
        <h1 class="pt-h1" id="dTitle">{a['h1']}</h1>
        <p class="pt-lead">{html.escape(a['lead'])}</p>
      </div>
    </section>

    <article class="pr-article">
{body}
      <h2>Keep Going</h2>
      <div class="pr-next">
{next_links}
        <a class="pr-ghost" href="/prayer/for-groups/#session-{a['session']}">Leading a group? Session {a['session']} uses this article</a>
      </div>
      <nav class="pt-crumbs pr-pager" aria-label="More foundations"><a href="/prayer/{prev_a['slug']}/">← {html.escape(prev_a['title'])}</a> · <a href="/prayer/{next_a['slug']}/">{html.escape(next_a['title'])} →</a></nav>

      {fine_print()}
    </article>
"""
        page += tail(["/assets/js/daily-share.js"])
        write(f"prayer/{a['slug']}/index.html", page)


def build_pages():
    for p in PAGES:
        body = (SRC / "pages" / f"{p['src']}.html").read_text().rstrip() + "\n"
        body = body.replace("{{FINE_PRINT}}", fine_print(p.get("niv", False)))
        url = f"{SITE}/prayer/{p['path'] + '/' if p['path'] else ''}"
        page = head(p["title"], p["description"], url, p["og"], p["type"], p["body_class"])
        page += body
        page += tail([f"/prayer/prayer-tools.js?v={JS_V}"])
        out = f"prayer/{p['path']}/index.html" if p["path"] else "prayer/index.html"
        write(out, page)


def write(rel, text):
    out = ROOT / rel
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(text)
    print("wrote", rel)


if __name__ == "__main__":
    build_articles()
    build_pages()
