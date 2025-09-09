# 🛠️ TheWrkShop — Building Men of Purpose and Excellence

[![Netlify Status](https://api.netlify.com/api/v1/badges/6ddad013-bae5-4d9b-8786-c631c2e5d439/deploy-status)](https://app.netlify.com/projects/curious-profiterole-fae7e1/deploys)

---

## 📚 Table of Contents
- [✨ Features](#-features)
- [🖼️ Preview](#-preview)
- [⚙️ Tech Stack](#-tech-stack)
- [🛠️ Development](#️-development)
- [🚀 Deployment](#-deployment)
- [📂 Project Structure](#-project-structure)
- [🙌 Contributing](#-contributing)
- [📧 Contact](#-contact)
- [📥 Adding Content](#-adding-content)
  - [🗓️ Daily Devotionals](#️-daily-devotionals)
  - [✍️ Weekly Blogs](#-weekly-blogs)

---

Welcome to **TheWrkShop** — a site designed to **equip Christian men with tools, teachings, and community** to live with faith, purpose, and integrity.  

The project includes a growing set of resources: **Daily Devotionals, Weekly 4-3-2-1 Blogs, Podcasts, and a Resource Hub** — all dynamically generated and automatically deployed via Netlify.  

---

## ✨ Features

- 📖 **Daily Devotionals** — fresh scripture-centered insights every day.  
- 📝 **Weekly Blog (4-3-2-1)** — 4 Scriptures, 3 Ways to Live, 2 Reflective Questions, 1 Action Step.  
- 🎙️ **Podcast Integration** — pulls the latest episodes directly from Spotify for Podcasters.  
- 🧰 **Resource Hub** — Bible study tools, habit trackers, PDFs, and book recommendations.  
- 📱 **Responsive UI** — optimized for desktop and mobile, with a simple, engaging design.  
- 🚀 **Continuous Deployment** — every commit to `main` triggers a Netlify build + deployment.  

---

## 🖼️ Preview

> _(Add screenshots or GIFs of your site here for extra appeal)_

Example sections:  
- **Homepage hero** with subscription form  
- **Daily devotional snippet**  
- **Blog article layout**  
- **Podcast cards**  

---

## ⚙️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript  
- **Static Generation Scripts:** Node.js (`fs`, `path`, `fast-xml-parser`)  
- **Deployment:** [Netlify](https://www.netlify.com/)  
- **Data Sources:**  
  - JSON for devotionals and blog posts (`/content/daily`, `/content/blog`)  
  - RSS feed for podcasts (parsed from Spotify/Podcasters)  

---
---

## 📥 Adding Content

Both **Daily Devotionals** and **Weekly Blogs** are stored as JSON in the `content/` folder.  
The build scripts use these files to generate static HTML + JSON archives automatically.

### 🗓️ Daily Devotionals

- **File path:**  
  `content/daily/<SCRIPTURE-SLUG>_<TITLE-SLUG>_<YYYY-MM-DD>.json`

  > Example:  
  `content/daily/Psalm-119-37_scroll-or-soul_2025-09-22.json`

- **Slug rules:**  
  - Base on **scripture reference** + **title** + **date**  
  - Replace apostrophes (e.g., `doesn't → doesnt`)  
  - Replace spaces and non-alphanumeric characters with `-`  

- **Body format:**

```json
{
  "date": "2025-09-22",
  "title": "Scroll or Soul?",
  "verse_ref": "Psalm 119:37",
  "verse_text": "Turn my eyes from worthless things; preserve my life according to your word.",
  "insight": [
    "Our world fights for attention, and every scroll shapes your soul. Psalm 119:37 calls us to guard our eyes from worthless things that steal time and peace.",
    "Every scroll is a seed. What you watch, read, and consume takes root. Over time, it grows into confidence or chaos. Don’t trade depth with God for endless digital distraction."
  ],
  "one_minute_win": "Replace one 5-minute scroll break with one 5-minute Scripture break.",
  "declaration": "My soul deserves better than endless scrolls."
}
```
### ✍️ Weekly Blogs

- **File path:**  
  `content/blog/<YYYY-MM-DD>_<TITLE-SLUG>.json`

  > Example:  
  `content/blog/2025-08-30_renewed-why-god-doesnt-move-at-your-pace.json`

- **Slug rules:**  
  - Based on **date** + **title**  
  - Lowercase, spaces → `-`  
  - Remove apostrophes (`doesn't → doesnt`)  
  - Strip other non-alphanumeric characters  

- **Body format:**

```json
{
  "date": "2025-08-30",
  "title": "RENEWED: Why God Doesn’t Move at Your Pace",
  "category": "Weekend 4-3-2-1",
  "excerpt": "We want ASAP from an eternal God. This weekend we trade speed for depth.",
  "reading_minutes": 7,
  "author": "TheWrkShop Team",

  "kicker": "TheWrkShop Happy 4-3-2-1 Weekend Edition",
  "salutation": "Dear WorkShopper,",

  "intro": [
    "We want ASAP results from an eternal God who’s building us for the long game.",
    "That’s the real battlefield, between our demand for speed and God’s design for depth."
  ],

  "one_minute_win": "Don’t confuse spiritual activity with spiritual intimacy. Pick one passage and dwell.",

  "picture_this": [
    "Two men stand at a crossroads.",
    "One grabs a microwave meal. The other waits for a slow-cooked feast."
  ],

  "scriptures": [
    {
      "ref": "Ephesians 4:23-24",
      "text": "Be made new in the attitude of your minds...",
      "insight": "Your mindset is the gate to your identity.",
      "gem": "You don’t become new by trying harder; you become new by thinking truer."
    },
    {
      "ref": "John 15:4",
      "text": "Abide in me, and I in you.",
      "insight": "You can’t bear fruit on the run.",
      "gem": "Fruit grows in the abiding, not the hustling."
    }
  ],

  "ways_to_live": [
    { "title": "Rewire a Loop", "body": "Pick one frustrating thought pattern and replace it with Scripture." },
    { "title": "Set a Dwell Time", "body": "15 minutes: Scripture, worship, stillness. No scrolling." },
    { "title": "Fast from Fast", "body": "Give up one rush trigger and sit with God in unhurried honesty." }
  ],

  "insights": [
    "Isolation isn’t rest; it’s starvation.",
    "Defaults reveal discipline.",
    "God works like a slow cooker."
  ],

  "reflective_questions": [
    "Where have I been demanding instant from a God who’s forming me eternally?",
    "What’s one way I can trade activity for alignment this weekend?"
  ],

  "action_step": "Write a Dwelling Declaration and say it each morning.",

  "bonus_title": "How Rewiring Happens",
  "bonus_body": [
    "This is spiritual and neurological warfare. Rewiring is a practice.",
    "The 5-Step Rewire Formula:"
  ],
  "bonus_list": [
    "Identify the Lie",
    "Find the Truth (Scripture)",
    "Repeat It Daily",
    "Act Accordingly",
    "Reinforce It in Community"
  ],

  "prayer": "Father, reset my pace to match Yours... In Jesus’ name, amen.",
  "declaration": "I walk at God’s pace, not mine.",
  "weekly_challenge": "Replace 30 minutes of scrolling with 30 minutes of Scripture and stillness.",
  "invitation": "If this hit home, share it with a brother.",
  "gem_to_carry": "You’re not stuck—you’re rehearsing the wrong script. God’s giving you a new one."
}
