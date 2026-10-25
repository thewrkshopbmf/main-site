/*
 * Daily sharing: Hidden Gems and charts.
 *
 * Hidden Gems: each gem gets a share button. Sharing sends the gem as a
 * TheWrkShop.com quote with a link back to that day (#gem-N). Copying text
 * from the Hidden Gems section also adds the attribution and link.
 *
 * Charts (flow progressions): each chart gets a "Share this chart" button.
 * The whole chart is drawn as one branded picture (heading, every step,
 * closing line, logo, thewrkshop.com) that can be sent from the phone's
 * share sheet or saved, plus a link back to that day (#chart-N).
 *
 * Static daily pages run this on load. The Daily page (/daily.html) renders
 * after fetching its content, so it calls TWSShare.enhance(root, url) once
 * the sections are on the page (or leaves window.__gemsPending for us).
 */
(function () {
  'use strict';

  var BRAND = 'TheWrkShop.com';
  var GEM_SECTIONS = '.daily-section-hidden_gems, .daily-section-gem';
  var LOGO_SRC = '/assets/images/thewrkshop-logo-share.png';

  var BROWN = '#3e2c23', CREAM = '#f4f1ee', TAN = '#c9aa8c';
  var SERIF = 'Georgia, "Times New Roman", serif';
  var SANS = '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif';

  var CSS = [
    '.gem-shareable{position:relative;padding-right:2.6rem;border-radius:8px;transition:background .3s}',
    '.share-highlight{background:#f3e7d8;border-radius:10px;transition:background .3s}',
    '.gem-share-btn{position:absolute;top:50%;right:0;transform:translateY(-50%);width:2.1rem;height:2.1rem;',
    'display:inline-flex;align-items:center;justify-content:center;border:1px solid rgba(62,44,35,.25);',
    'border-radius:999px;background:#fff;color:#3e2c23;cursor:pointer;padding:0}',
    '.gem-share-btn:hover,.gem-share-btn[aria-expanded="true"],.chart-share-btn:hover,.chart-share-btn[aria-expanded="true"]{background:#ece5df}',
    '.gem-share-btn svg,.chart-share-btn svg{width:1rem;height:1rem;flex:none}',
    '.gem-share-hint{font-size:.85rem;color:#6b5b53;margin:-.25rem 0 .75rem}',
    '.chart-share{position:relative;display:flex;justify-content:center;margin:.85rem 0 0}',
    '.chart-share-btn{display:inline-flex;align-items:center;gap:.45rem;font:inherit;font-size:.9rem;color:#3e2c23;',
    'background:#fff;border:1px solid rgba(62,44,35,.25);border-radius:999px;padding:.4rem .9rem;cursor:pointer}',
    '.share-menu{position:absolute;z-index:50;right:0;top:calc(100% + .35rem);min-width:13.5rem;max-width:calc(100vw - 2rem);background:#fff;',
    'border:1px solid rgba(62,44,35,.18);border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.14);padding:.4rem;',
    'display:flex;flex-direction:column;font-weight:400;font-style:normal;text-transform:none;letter-spacing:normal;text-align:left}',
    '.chart-share .share-menu{right:auto;left:50%;transform:translateX(-50%)}',
    '.share-menu-title{font-size:.75rem;letter-spacing:.06em;text-transform:uppercase;color:#8a7466;padding:.35rem .6rem .25rem}',
    '.share-menu a,.share-menu button{font:inherit;font-size:.92rem;text-align:left;color:#3e2c23;background:none;border:0;',
    'border-radius:8px;padding:.5rem .6rem;cursor:pointer;text-decoration:none}',
    '.share-menu a:hover,.share-menu button:hover{background:#f4f1ee}',
    '.share-menu-note{font-size:.8rem;color:#6b5b53;padding:.25rem .6rem .4rem}'
  ].join('');

  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7"/><path d="M16 6l-4-4-4 4"/><path d="M12 2v14"/></svg>';

  var openMenu = null;
  var pageUrl = '';
  var shareBase = '';

  /* ---------- helpers ---------- */

  function injectCss() {
    if (document.getElementById('daily-share-css')) return;
    var s = document.createElement('style');
    s.id = 'daily-share-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function track(type, method) {
    try { if (window.gtag) window.gtag('event', 'share', { content_type: type, method: method }); } catch (e) {}
  }

  function defaultUrl() {
    var c = document.querySelector('link[rel="canonical"]');
    return ((c && c.href) || location.href).split('#')[0];
  }

  function clean(s) { return String(s || '').replace(/\s+/g, ' ').trim(); }

  // Leave gems that already contain quotation marks as they are
  function quoted(text) {
    return /[“”"]/.test(text) ? text : '“' + text + '”';
  }

  // Each gem and chart has its own page (/share/<key>/gem-N/) whose link
  // preview shows just that piece. Without one, link to the day at #gem-N.
  function itemUrl(id) {
    return shareBase ? shareBase + id + '/' : pageUrl + '#' + id;
  }

  function copy(str) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(str);
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = str;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy') ? resolve() : reject(); } catch (e) { reject(e); } finally { ta.remove(); }
    });
  }

  function isTouch() { return window.matchMedia && window.matchMedia('(pointer: coarse)').matches; }

  function slugify(s) {
    return clean(s).toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'chart';
  }

  /* ---------- share menu (shared by gems and charts) ---------- */

  function closeMenu() {
    if (!openMenu) return;
    openMenu.menu.remove();
    openMenu.btn.setAttribute('aria-expanded', 'false');
    openMenu = null;
  }

  // opts: { type, title, text, url, image: function returning Promise<{blob, name}> }
  function buildMenu(opts) {
    var body = opts.text + '\n' + opts.url;
    var enc = encodeURIComponent;
    var menu = document.createElement('div');
    menu.className = 'share-menu';
    menu.setAttribute('role', 'menu');

    function item(label, cfg) {
      var el;
      if (cfg.href) {
        el = document.createElement('a');
        el.href = cfg.href;
        if (cfg.external) { el.target = '_blank'; el.rel = 'noopener'; }
      } else {
        el = document.createElement('button');
        el.type = 'button';
      }
      el.setAttribute('role', 'menuitem');
      el.textContent = label;
      el.addEventListener('click', function (ev) {
        track(opts.type, cfg.method);
        if (cfg.copyFirst) copy(body).catch(function () {});
        if (cfg.onClick) cfg.onClick(ev, el);
        if (!cfg.keepOpen) setTimeout(closeMenu, 50);
      });
      menu.appendChild(el);
      return el;
    }

    var title = document.createElement('div');
    title.className = 'share-menu-title';
    title.textContent = opts.title;
    menu.appendChild(title);

    if (opts.image) {
      // Share the picture itself where the phone supports it; otherwise save it.
      var probe = new File([''], 'x.png', { type: 'image/png' });
      var canShareFiles = !!(navigator.canShare && navigator.share && navigator.canShare({ files: [probe] }));
      if (canShareFiles) {
        item('Share picture…', { method: 'image_native', keepOpen: true, onClick: function (ev, el) {
          el.textContent = 'Preparing…';
          opts.image().then(function (img) {
            var file = new File([img.blob], img.name, { type: 'image/png' });
            closeMenu();
            return navigator.share({ files: [file], text: body });
          }).catch(function () { closeMenu(); });
        } });
      }
      item('Save picture', { method: 'image_save', keepOpen: true, onClick: function (ev, el) {
        el.textContent = 'Preparing…';
        opts.image().then(function (img) {
          var a = document.createElement('a');
          a.href = URL.createObjectURL(img.blob);
          a.download = img.name;
          document.body.appendChild(a);
          a.click();
          setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
          closeMenu();
        }).catch(function () { el.textContent = 'Could not make picture'; });
      } });
    }

    if (navigator.share && !opts.image) {
      item('Share…', { method: 'native', onClick: function () {
        // One message with the link inside, so apps can't keep the link and drop the quote
        navigator.share({ text: body }).catch(function () {});
      } });
    }
    if (isTouch()) {
      item('Text message', { method: 'sms', href: 'sms:?&body=' + enc(body) });
    }
    item(opts.image ? 'Copy link' : 'Copy quote', { method: 'copy', keepOpen: true, onClick: function (ev, el) {
      copy(body).then(function () {
        el.textContent = 'Copied ✓';
        setTimeout(closeMenu, 900);
      }, function () { window.prompt('Copy this:', body); });
    } });
    item('X', { method: 'x', external: true,
      href: 'https://twitter.com/intent/tweet?text=' + enc(opts.text) + '&url=' + enc(opts.url) });
    item('Facebook', { method: 'facebook', external: true, copyFirst: true,
      href: 'https://www.facebook.com/sharer/sharer.php?u=' + enc(opts.url) });
    item('LinkedIn', { method: 'linkedin', external: true, copyFirst: true,
      href: 'https://www.linkedin.com/sharing/share-offsite/?url=' + enc(opts.url) });
    item('Email', { method: 'email',
      href: 'mailto:?subject=' + enc(opts.emailSubject) + '&body=' + enc(body) });

    var note = document.createElement('div');
    note.className = 'share-menu-note';
    note.textContent = opts.image
      ? 'Posting the picture to Instagram or Facebook? Save it, then add it to your post. The link is copied for you on Facebook and LinkedIn.'
      : 'Facebook and LinkedIn: the quote is copied for you, so just paste it into your post.';
    menu.appendChild(note);
    return menu;
  }

  function wireButton(btn, host, getOpts) {
    btn.setAttribute('aria-haspopup', 'menu');
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', function (ev) {
      ev.stopPropagation();
      var same = openMenu && openMenu.btn === btn;
      closeMenu();
      if (same) return;
      var menu = buildMenu(getOpts());
      host.appendChild(menu);
      btn.setAttribute('aria-expanded', 'true');
      openMenu = { btn: btn, menu: menu };
      var first = menu.querySelector('a,button');
      if (first) first.focus({ preventScroll: true });
    });
  }

  /* ---------- Hidden Gems ---------- */

  function gemText(el) {
    var c = el.cloneNode(true);
    var first = c.firstElementChild;
    if (first && first.tagName === 'SPAN') first.remove(); // the 👉 / 💎 prefix
    Array.prototype.forEach.call(c.querySelectorAll('.gem-share-btn, .share-menu'), function (n) { n.remove(); });
    return clean(c.textContent);
  }

  function enhanceGem(el, index) {
    if (el.dataset.shareReady) return;
    var text = gemText(el);
    if (!text) return;
    el.dataset.shareReady = '1';
    el.id = el.id || 'gem-' + (index + 1);
    el.classList.add('gem-shareable');
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'gem-share-btn';
    btn.setAttribute('aria-label', 'Share this gem');
    btn.innerHTML = ICON;
    wireButton(btn, el, function () {
      return {
        type: 'hidden_gem',
        title: 'Share this gem',
        text: quoted(text) + ' — ' + BRAND,
        url: itemUrl(el.id),
        emailSubject: 'A Hidden Gem from ' + BRAND
      };
    });
    el.appendChild(btn);
  }

  function addGemHint(section) {
    if (section.querySelector('.gem-share-hint')) return;
    var h = section.querySelector('h3');
    if (!h) return;
    var p = document.createElement('p');
    p.className = 'gem-share-hint';
    p.textContent = 'Tap the share button on any gem to send it to a friend.';
    h.insertAdjacentElement('afterend', p);
  }

  // Copying from the Hidden Gems section carries the attribution and link with it.
  function onCopy(ev) {
    var sel = window.getSelection && window.getSelection();
    if (!sel || sel.isCollapsed || !ev.clipboardData) return;
    var node = sel.anchorNode && (sel.anchorNode.nodeType === 1 ? sel.anchorNode : sel.anchorNode.parentElement);
    var section = node && node.closest && node.closest(GEM_SECTIONS);
    if (!section) return;
    var text = sel.toString().trim();
    if (!text) return;
    var gem = node.closest('.gem-shareable');
    var url = gem ? itemUrl(gem.id) : pageUrl;
    ev.clipboardData.setData('text/plain', text + '\n\n— ' + BRAND + '\n' + url);
    ev.clipboardData.setData('text/html',
      text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\n/g, '<br>') +
      '<br><br>— <a href="' + url + '">' + BRAND + '</a>');
    ev.preventDefault();
    track('hidden_gem', 'copy_selection');
  }

  /* ---------- Charts ---------- */

  function readChart(fig) {
    var section = fig.closest('section');
    var heading = section && section.querySelector('h3');
    var titleEl = fig.querySelector('.daily-flow-title');
    var steps = Array.prototype.map.call(fig.querySelectorAll('.daily-flow-box'), function (box) {
      var l = box.querySelector('.daily-flow-label');
      var n = box.querySelector('.daily-flow-note');
      return { label: clean(l ? l.textContent : box.textContent), note: clean(n && n.textContent) };
    });
    var loop = fig.querySelector('.daily-flow-loop');
    var cap = fig.querySelector('.daily-flow-caption');
    var headline = document.getElementById('dTitle');
    return {
      heading: clean(heading && heading.textContent) || clean(titleEl && titleEl.textContent) || 'Watch the Progression',
      subtitle: clean(titleEl && titleEl.textContent),
      steps: steps,
      loop: clean(loop && loop.textContent),
      caption: clean(cap && cap.textContent),
      eyebrow: clean(headline && headline.textContent)
    };
  }

  function shade(i, n) {
    if (i === n - 1) return { bg: BROWN, fg: CREAM, note: '#e8dccf', border: BROWN };
    var t = n <= 2 ? 0 : i / (n - 2);
    var from = [255, 255, 255], to = [234, 217, 200];
    var c = from.map(function (f, k) { return Math.round(f + (to[k] - f) * t); });
    return { bg: 'rgb(' + c.join(',') + ')', fg: BROWN, note: '#6b5b53', border: 'rgba(62,44,35,.22)' };
  }

  function wrap(ctx, text, maxW) {
    var words = String(text).split(' '), lines = [], cur = '';
    words.forEach(function (w) {
      var test = cur ? cur + ' ' + w : w;
      if (ctx.measureText(test).width <= maxW || !cur) cur = test;
      else { lines.push(cur); cur = w; }
    });
    if (cur) lines.push(cur);
    return lines;
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  var logoPromise = null;
  function loadLogo() {
    if (!logoPromise) {
      logoPromise = new Promise(function (resolve) {
        var img = new Image();
        img.onload = function () { resolve(img); };
        img.onerror = function () { resolve(null); };
        img.src = LOGO_SRC;
      });
    }
    return logoPromise;
  }

  // Lays out (and optionally draws) the chart at scale s. Returns the height used.
  function layoutChart(ctx, chart, W, s, draw) {
    var pad = 90, boxW = W - pad * 2 - 80, boxX = (W - boxW) / 2;
    var y = 96 * s;

    // eyebrow
    ctx.font = '700 ' + Math.round(24 * s) + 'px ' + SANS;
    var eyebrow = (chart.eyebrow || 'Leadership & Culture').toUpperCase();
    var eyeLines = wrap(ctx, eyebrow, W - pad * 2);
    eyeLines.forEach(function (l) {
      if (draw) { ctx.fillStyle = '#8a6a52'; ctx.fillText(l, W / 2, y); }
      y += 34 * s;
    });
    y += 16 * s;

    // heading
    ctx.font = '700 ' + Math.round(62 * s) + 'px ' + SERIF;
    wrap(ctx, chart.heading, W - pad * 2).forEach(function (l) {
      y += 62 * s;
      if (draw) { ctx.fillStyle = BROWN; ctx.fillText(l, W / 2, y); }
      y += 12 * s;
    });
    if (chart.subtitle && chart.subtitle !== chart.heading) {
      ctx.font = 'italic ' + Math.round(30 * s) + 'px ' + SERIF;
      wrap(ctx, chart.subtitle, W - pad * 2).forEach(function (l) {
        y += 34 * s;
        if (draw) { ctx.fillStyle = '#6b5b53'; ctx.fillText(l, W / 2, y); }
        y += 6 * s;
      });
    }
    y += 22 * s;
    if (draw) { ctx.fillStyle = TAN; ctx.fillRect(W / 2 - 45, y, 90, 4); }
    y += 44 * s;

    // steps
    var n = chart.steps.length;
    var labelSize = Math.round(34 * s), noteSize = Math.round(27 * s);
    var innerW = boxW - 56;
    chart.steps.forEach(function (step, i) {
      if (i) {
        var ay = y;
        if (draw) {
          ctx.strokeStyle = TAN; ctx.fillStyle = TAN; ctx.lineWidth = 4;
          ctx.beginPath(); ctx.moveTo(W / 2, ay + 8 * s); ctx.lineTo(W / 2, ay + 34 * s); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(W / 2 - 11 * s, ay + 28 * s); ctx.lineTo(W / 2 + 11 * s, ay + 28 * s);
          ctx.lineTo(W / 2, ay + 44 * s); ctx.closePath(); ctx.fill();
        }
        y += 52 * s;
      }
      ctx.font = '700 ' + labelSize + 'px ' + SANS;
      var ll = wrap(ctx, step.label, innerW);
      ctx.font = 'italic ' + noteSize + 'px ' + SANS;
      var nl = step.note ? wrap(ctx, step.note, innerW) : [];
      var h = 26 * s * 2 + ll.length * labelSize * 1.28 + (nl.length ? 8 * s + nl.length * noteSize * 1.35 : 0);
      if (draw) {
        var c = shade(i, n);
        roundRect(ctx, boxX, y, boxW, h, 18);
        ctx.fillStyle = c.bg; ctx.fill();
        ctx.strokeStyle = c.border; ctx.lineWidth = 2; ctx.stroke();
        var ty = y + 26 * s;
        ctx.font = '700 ' + labelSize + 'px ' + SANS; ctx.fillStyle = c.fg;
        ll.forEach(function (l) { ty += labelSize; ctx.fillText(l, W / 2, ty - labelSize * 0.18); ty += labelSize * 0.28; });
        if (nl.length) {
          ty += 8 * s;
          ctx.font = 'italic ' + noteSize + 'px ' + SANS; ctx.fillStyle = c.note;
          nl.forEach(function (l) { ty += noteSize; ctx.fillText(l, W / 2, ty - noteSize * 0.18); ty += noteSize * 0.35; });
        }
      }
      y += h;
    });

    // loop + caption
    if (chart.loop) {
      y += 30 * s;
      ctx.font = '700 ' + Math.round(30 * s) + 'px ' + SANS;
      wrap(ctx, '↻ ' + chart.loop.replace(/^↻\s*/, ''), W - pad * 2).forEach(function (l) {
        y += 32 * s;
        if (draw) { ctx.fillStyle = '#6b4a36'; ctx.fillText(l, W / 2, y); }
        y += 10 * s;
      });
    }
    if (chart.caption) {
      y += 30 * s;
      ctx.font = 'italic ' + Math.round(34 * s) + 'px ' + SERIF;
      wrap(ctx, chart.caption, W - pad * 2).forEach(function (l) {
        y += 36 * s;
        if (draw) { ctx.fillStyle = '#6b5b53'; ctx.fillText(l, W / 2, y); }
        y += 12 * s;
      });
    }
    return y;
  }

  function renderChartImage(chart) {
    var W = 1080, FOOT = 190, MIN_H = 1350, MAX_H = 1920;
    return loadLogo().then(function (logo) {
      var c = document.createElement('canvas');
      var ctx = c.getContext('2d');
      ctx.textAlign = 'center';
      // Shrink the type until the chart fits a tall phone-friendly picture.
      var s = 1, contentH;
      for (; s > 0.55; s -= 0.05) {
        contentH = layoutChart(ctx, chart, W, s, false) + 70;
        if (contentH + FOOT <= MAX_H) break;
      }
      var H = Math.max(MIN_H, Math.ceil(contentH + FOOT));
      c.width = W; c.height = H;
      ctx = c.getContext('2d');
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';

      ctx.fillStyle = CREAM; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(62,44,35,.15)'; ctx.lineWidth = 2;
      ctx.strokeRect(28, 28, W - 56, H - FOOT - 28);

      // centre the chart in the space above the footer
      var offset = Math.max(0, (H - FOOT - contentH) / 2);
      ctx.save(); ctx.translate(0, offset);
      layoutChart(ctx, chart, W, s, true);
      ctx.restore();

      // footer band
      ctx.fillStyle = BROWN; ctx.fillRect(0, H - FOOT, W, FOOT);
      var lh = 120;
      if (logo) {
        var lw = logo.width * lh / logo.height;
        ctx.drawImage(logo, 80, H - FOOT + (FOOT - lh) / 2, lw, lh);
      }
      ctx.textAlign = 'right';
      ctx.fillStyle = TAN;
      ctx.font = '700 40px ' + SANS;
      ctx.fillText('thewrkshop.com', W - 80, H - FOOT / 2 + 4);
      ctx.fillStyle = '#e8dccf';
      ctx.font = 'italic 26px ' + SERIF;
      ctx.fillText('Read the whole daily there', W - 80, H - FOOT / 2 + 44);

      return new Promise(function (resolve, reject) {
        c.toBlob(function (blob) {
          blob ? resolve({ blob: blob, name: 'thewrkshop-' + slugify(chart.heading) + '.png' }) : reject();
        }, 'image/png');
      });
    });
  }

  function enhanceChart(fig, index) {
    if (fig.dataset.shareReady) return;
    var chart = readChart(fig);
    if (chart.steps.length < 2) return;
    fig.dataset.shareReady = '1';
    fig.id = fig.id || 'chart-' + (index + 1);

    var wrapEl = document.createElement('div');
    wrapEl.className = 'chart-share';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chart-share-btn';
    btn.innerHTML = ICON + '<span>Share this chart</span>';
    var cached = null;
    wireButton(btn, wrapEl, function () {
      return {
        type: 'chart',
        title: 'Share this chart',
        text: chart.heading + ' — ' + BRAND,
        url: itemUrl(fig.id),
        emailSubject: chart.heading + ' — ' + BRAND,
        image: function () { return cached || (cached = renderChartImage(chart)); }
      };
    });
    wrapEl.appendChild(btn);
    fig.appendChild(wrapEl);
  }

  /* ---------- page wiring ---------- */

  function highlightFromHash() {
    var id = (location.hash || '').slice(1);
    if (!/^(gem|chart)-\d+$/.test(id)) return;
    var el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ block: 'center' });
    el.classList.add('share-highlight');
    setTimeout(function () { el.classList.remove('share-highlight'); }, 3000);
  }

  function enhance(root, url, base) {
    injectCss();
    pageUrl = (url || defaultUrl()).split('#')[0];
    var meta = document.querySelector('meta[name="tws-share-base"]');
    shareBase = base || (meta && meta.content) || '';
    root = root || document;
    Array.prototype.forEach.call(root.querySelectorAll(GEM_SECTIONS), function (section) {
      var gems = section.querySelectorAll('.daily-callout, blockquote');
      if (!gems.length) return;
      addGemHint(section);
      Array.prototype.forEach.call(gems, enhanceGem);
    });
    Array.prototype.forEach.call(root.querySelectorAll('.daily-flow'), enhanceChart);
    highlightFromHash();
  }

  document.addEventListener('click', function (ev) {
    if (openMenu && !openMenu.menu.contains(ev.target)) closeMenu();
  });
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' && openMenu) { var b = openMenu.btn; closeMenu(); b.focus(); }
  });
  document.addEventListener('copy', onCopy);

  window.TWSShare = { enhance: enhance, renderChartImage: renderChartImage, readChart: readChart };
  window.TWSGems = window.TWSShare; // older name

  if (window.__gemsPending) {
    enhance(window.__gemsPending.root, window.__gemsPending.url, window.__gemsPending.base);
    window.__gemsPending = null;
  } else if (!document.documentElement.hasAttribute('data-gems-manual')) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { enhance(); });
    else enhance();
  }
})();
