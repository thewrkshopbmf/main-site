// --------- Build/version marker ----------
console.log("script.js :: build=headerfix2");

// --------- Brand ----------
const siteName = "TheWrkShop";
document.querySelectorAll(".sitename").forEach(el => (el.textContent = siteName));

// --------- Utilities ----------
function todayCentralISO() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Chicago', year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(new Date());
}

// --------- Header injection (safe) ----------
async function injectHTML(selector, url) {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return;
    const text = await res.text();

    // skip if it looks like a whole HTML doc (e.g., 404 page)
    if (/<!doctype html/i.test(text) || /<html[\s>]/i.test(text)) return;

    const host = document.querySelector(selector);
    if (host) host.innerHTML = text;
  } catch (err) {
    console.warn("Header injection failed:", err);
  }
}

// --------- DOM Ready ----------
document.addEventListener("DOMContentLoaded", function () {
  // Hamburger menu rebinder
  function rebindNavToggle() {
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('nav-links');
    if (hamburger && navLinks) {
      hamburger.onclick = () => navLinks.classList.toggle('open');
    }
  }

  rebindNavToggle();

  // Kill any service worker that might cache stale pages
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(regs => regs.forEach(r => r.unregister()));
  }

  // ConvertKit subscription form
  const form = document.getElementById("emailForm");
  const successMessage = document.getElementById("successMessage");
  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const formId = "8460334";
      const apiKey = "qwXtdRjQfoLppDUjjcd_8Q";
      try {
        const response = await fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ api_key: apiKey, email })
        });
        if (response.ok) {
          if (successMessage) successMessage.style.display = "block";
          form.reset();
        } else {
          alert("Something went wrong. Please try again.");
        }
      } catch (err) {
        console.error(err);
        alert("There was a problem subscribing.");
      }
    });
  }

  // ✅ Inject header on any page that has #site-header (home + blog + others)
  const needsHeader = document.getElementById('site-header');
  if (needsHeader) {
    injectHTML('#site-header', '/pages/details/header.html').then(() => {
      // Fill brand after injection + rebind nav
      document.querySelectorAll(".sitename").forEach(el => (el.textContent = siteName));
      rebindNavToggle();
    });
  }
});

// --------- Daily Feature loader ----------
(async function loadDailyFeature(){
  const ctx = document.querySelector('.daily-feature');
  if (!ctx) return;

  const el = {
    title:   ctx.querySelector('.df-title'),
    teaser:  ctx.querySelector('.df-teaser'),
    date:    ctx.querySelector('.df-date'),
    ref:     ctx.querySelector('.verse-ref'),
    snip:    ctx.querySelector('.verse-snippet'),
    cta:     ctx.querySelector('.df-cta')
  };

  const baseSlug = (s='') => s.normalize('NFKD')
    .replace(/[\u0300-\u036f]/g,'')
    .replace(/['"]/g,'')
    .replace(/[^A-Za-z0-9\s:–—-]+/g,' ')
    .replace(/\s+/g,' ')
    .trim();

  const scriptureSlug = ref => baseSlug(ref).replace(/[:–—]/g,'-').replace(/\s+/g,'-').replace(/-+/g,'-');
  const titleSlug = t => baseSlug(t).replace(/[:–—]/g,'-').replace(/\s+/g,'-').replace(/-+/g,'-').slice(0,60).replace(/-+$/,'');

  const humanShort = iso => {
    const dt = new Date(iso + 'T00:00:00');
    return dt.toLocaleDateString(undefined,{month:'short', day:'numeric'});
  };

  try {
    const r = await fetch('/data/daily.json', { cache: 'no-store' });
    if (!r.ok) return;
    const d = await r.json();

    if (el.title && d.title) el.title.textContent = d.title;
    if (el.teaser) {
      const teaser = d.insight_teaser || (Array.isArray(d.insight) ? d.insight[0] : (d.insight || ''));
      el.teaser.textContent = (teaser || '').trim();
    }
    if (el.ref && d.verse_ref) el.ref.textContent = d.verse_ref;
    if (el.snip && d.verse_text) el.snip.textContent = '“' + d.verse_text + '”';
    if (el.date && d.date) {
      el.date.textContent = humanShort(d.date);
      el.date.setAttribute('datetime', d.date);
    }

    let href = 'daily.html';
    try {
      const ra = await fetch('/data/daily-archive.json', { cache: 'no-store' });
      if (ra.ok) {
        const list = await ra.json();
        const item = Array.isArray(list) ? list.find(x => x.date === d.date) : null;
        if (item && item.href) href = item.href;
      }
    } catch {}

    if (!href || href === 'daily.html') {
      if (d.verse_ref && d.title && d.date) {
        href = '/daily/' + scriptureSlug(d.verse_ref) + '_' + titleSlug(d.title) + '_' + d.date + '.html';
      }
    }

    if (d.date && d.date > todayCentralISO()) href = '/daily-archive.html';

    if (el.cta && href) el.cta.setAttribute('href', href);
  } catch {}
})();

// --------- Latest Blog mini-card ----------
(async function loadLatestBlog(){
  const card = document.getElementById('latestBlogCard');
  if (!card) return;

  const teaser = card.querySelector('.mini-teaser');
  const cta = card.querySelector('a.cta');

  try {
    const r = await fetch('/data/blog.json?ts=' + Date.now(), { cache:'no-store' });
    if (!r.ok) return;

    const b = await r.json();
    if (teaser && b.title) {
      teaser.textContent = `${b.title} • ${b.reading_minutes || 0} min`;
    }
    if (cta && b.href) {
      cta.setAttribute('href', b.href);
    }
  } catch(e) {
    if (teaser) teaser.textContent = 'See all blog posts';
    if (cta) cta.setAttribute('href', '/blog-archive.html');
  }
})();

// --------- Latest Podcast mini-card ----------
(async function loadLatestPodcast(){
  const card = document.getElementById('latestPodcastCard');
  if (!card) return;

  const teaser = card.querySelector('.mini-teaser');
  const cta    = card.querySelector('a.cta');

  // helper: normalize duration string
  function formatDuration(raw) {
    if (!raw) return '';
    // If it's already HH:MM:SS or MM:SS
    if (raw.includes(':')) {
      const parts = raw.split(':').map(x => parseInt(x, 10) || 0);
      let h=0, m=0, s=0;
      if (parts.length === 3) [h, m, s] = parts;
      else if (parts.length === 2) [m, s] = parts;
      // Round seconds if >=30
      if (s >= 30) m++;
      if (m >= 60) { h++; m -= 60; }
      if (h) return `${h}h ${m}m`;
      return `${m}m`;
    }
    // Otherwise assume it's total seconds
    const sec = parseInt(raw, 10);
    if (isNaN(sec)) return raw;
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60 + (sec % 60 >= 30 ? 1 : 0));
    if (h) return `${h}h ${m}m`;
    if (m) return `${m}m`;
    return `${sec}s`;
  }

  try {
    const r = await fetch('/data/podcast.json?ts=' + Date.now(), { cache:'no-store' });
    if (!r.ok) return;
    const p = await r.json();

    const mins = formatDuration(p.duration);
    if (teaser && p.title) teaser.textContent = `${p.title}${mins ? ' • ' + mins : ''}`;
    if (cta) {
      cta.href = p.page_url || p.audio_url || '#';
      cta.target = '_blank';
      cta.rel = 'noopener';
    }
  } catch {
    if (teaser) teaser.textContent = 'See all podcast episodes';
    if (cta) cta.href = '/podcasts.html';
  }
})();



// --------- Blog row (3 latest) ----------
(async function hydrateHomeBlogRow(){
  const wrap = document.getElementById('blogCards');
  if (!wrap) return;

  const todayISO = todayCentralISO();

  const cardHTML = (post) => {
    const mins = post.reading_minutes || 0;
    const cat  = post.category || 'Article';
    const href = post.href || '#';
    const title = post.title || 'Untitled';
    const excerpt = post.excerpt || '';
    return `
      <article class="blog-card">
        <h3><a href="${href}">${title}</a></h3>
        <p class="meta">${mins} min • ${cat}</p>
        <p class="excerpt">${excerpt}</p>
      </article>
    `;
  };

  try {
    const r = await fetch('/data/blog-archive.json?ts=' + Date.now(), { cache: 'no-store' });
    if (!r.ok) return;
    const list = await r.json();

    const posts = (Array.isArray(list) ? list : [])
      .filter(p => p.date && p.date <= todayISO)
      .sort((a,b) => b.date.localeCompare(a.date))
      .slice(0, 3);

    if (!posts.length) return;
    wrap.innerHTML = posts.map(cardHTML).join('');
  } catch {}
})();

// --------- Smooth-scroll on home ----------
(function () {
  const isHome = location.pathname === '/' || location.pathname.endsWith('/index.html');
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[data-scroll]').forEach(a => {
      a.addEventListener('click', (e) => {
        const sel = a.getAttribute('data-scroll');
        if (isHome) {
          const target = document.querySelector(sel);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (history.replaceState) history.replaceState(null, '', '/');
          }
        }
      });
    });
  });
})();
