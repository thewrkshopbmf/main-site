/*
 * Hidden Gem sharing.
 *
 * Every Hidden Gem on a daily gets a share button. Sharing (text message,
 * the phone's share sheet, social, email or copy) sends the gem as a
 * TheWrkShop.com quote with a link back to that daily. Copying text from
 * the Hidden Gems section also adds the attribution and link.
 *
 * Static daily pages run this on load. The Daily page (/daily.html) renders
 * its content after fetching it, so it calls TWSGems.enhance(root, url)
 * once the sections are on the page.
 */
(function () {
  'use strict';

  var BRAND = 'TheWrkShop.com';
  var GEM_SELECTOR = '.daily-section-hidden_gems .daily-callout, .daily-section-gem blockquote';
  var SECTION_SELECTOR = '.daily-section-hidden_gems, .daily-section-gem';

  var CSS = [
    '.gem-shareable{position:relative;padding-right:2.6rem;border-radius:8px;transition:background .3s}',
    '.gem-shareable.gem-highlight{background:#f3e7d8}',
    '.gem-share-btn{position:absolute;top:50%;right:0;transform:translateY(-50%);width:2.1rem;height:2.1rem;',
    'display:inline-flex;align-items:center;justify-content:center;border:1px solid rgba(62,44,35,.25);',
    'border-radius:999px;background:#fff;color:#3e2c23;cursor:pointer;padding:0}',
    '.gem-share-btn:hover,.gem-share-btn[aria-expanded="true"]{background:#ece5df}',
    '.gem-share-btn svg{width:1rem;height:1rem}',
    '.gem-share-hint{font-size:.85rem;color:#6b5b53;margin:-.25rem 0 .75rem}',
    '.gem-menu{position:absolute;z-index:50;right:0;top:calc(100% + .35rem);min-width:13.5rem;background:#fff;',
    'border:1px solid rgba(62,44,35,.18);border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.14);padding:.4rem;',
    'display:flex;flex-direction:column;font-weight:400;text-transform:none;letter-spacing:normal}',
    '.gem-menu-title{font-size:.75rem;letter-spacing:.06em;text-transform:uppercase;color:#8a7466;padding:.35rem .6rem .25rem}',
    '.gem-menu a,.gem-menu button{font:inherit;font-size:.92rem;text-align:left;color:#3e2c23;background:none;border:0;',
    'border-radius:8px;padding:.5rem .6rem;cursor:pointer;text-decoration:none}',
    '.gem-menu a:hover,.gem-menu button:hover{background:#f4f1ee}',
    '.gem-menu-note{font-size:.8rem;color:#6b5b53;padding:.25rem .6rem .4rem}'
  ].join('');

  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7"/><path d="M16 6l-4-4-4 4"/><path d="M12 2v14"/></svg>';

  var openMenu = null;
  var pageUrl = '';

  function injectCss() {
    if (document.getElementById('gem-share-css')) return;
    var s = document.createElement('style');
    s.id = 'gem-share-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function track(method) {
    try { if (window.gtag) window.gtag('event', 'share', { content_type: 'hidden_gem', method: method }); } catch (e) {}
  }

  function defaultUrl() {
    var c = document.querySelector('link[rel="canonical"]');
    var u = (c && c.href) || location.href;
    return u.split('#')[0];
  }

  function gemText(el) {
    var clone = el.cloneNode(true);
    // Drop the 👉 / 💎 prefix and anything this script added
    var first = clone.firstElementChild;
    if (first && first.tagName === 'SPAN') first.remove();
    Array.prototype.forEach.call(clone.querySelectorAll('.gem-share-btn, .gem-menu'), function (n) { n.remove(); });
    return clone.textContent.replace(/\s+/g, ' ').trim();
  }

  function quoted(text) {
    return /^[“"]/.test(text) && /[”"]$/.test(text) ? text : '“' + text + '”';
  }

  function shareText(text) { return quoted(text) + ' — ' + BRAND; }

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

  function closeMenu() {
    if (!openMenu) return;
    openMenu.menu.remove();
    openMenu.btn.setAttribute('aria-expanded', 'false');
    openMenu = null;
  }

  function buildMenu(btn, text, url) {
    var full = shareText(text);
    var body = full + '\n' + url;
    var enc = encodeURIComponent;
    var menu = document.createElement('div');
    menu.className = 'gem-menu';
    menu.setAttribute('role', 'menu');

    function item(label, opts) {
      var el;
      if (opts.href) {
        el = document.createElement('a');
        el.href = opts.href;
        if (opts.external) { el.target = '_blank'; el.rel = 'noopener'; }
      } else {
        el = document.createElement('button');
        el.type = 'button';
      }
      el.setAttribute('role', 'menuitem');
      el.textContent = label;
      el.addEventListener('click', function (ev) {
        track(opts.method);
        if (opts.onClick) opts.onClick(ev, el);
        if (opts.copyFirst) copy(body).catch(function () {});
        if (!opts.keepOpen) setTimeout(closeMenu, 50);
      });
      menu.appendChild(el);
      return el;
    }

    var title = document.createElement('div');
    title.className = 'gem-menu-title';
    title.textContent = 'Share this gem';
    menu.appendChild(title);

    if (navigator.share) {
      item('Share…', { method: 'native', onClick: function () {
        navigator.share({ text: full, url: url }).catch(function () {});
      } });
    }
    if (isTouch()) {
      item('Text message', { method: 'sms', href: 'sms:?&body=' + enc(body) });
    }
    item('Copy quote', { method: 'copy', keepOpen: true, onClick: function (ev, el) {
      copy(body).then(function () {
        el.textContent = 'Copied ✓';
        setTimeout(closeMenu, 900);
      }, function () { window.prompt('Copy this quote:', body); });
    } });
    item('X', { method: 'x', external: true,
      href: 'https://twitter.com/intent/tweet?text=' + enc(full) + '&url=' + enc(url) });
    item('Facebook', { method: 'facebook', external: true, copyFirst: true,
      href: 'https://www.facebook.com/sharer/sharer.php?u=' + enc(url) });
    item('LinkedIn', { method: 'linkedin', external: true, copyFirst: true,
      href: 'https://www.linkedin.com/sharing/share-offsite/?url=' + enc(url) });
    item('Email', { method: 'email',
      href: 'mailto:?subject=' + enc('A Hidden Gem from ' + BRAND) + '&body=' + enc(body) });

    var note = document.createElement('div');
    note.className = 'gem-menu-note';
    note.textContent = 'Facebook and LinkedIn: the quote is copied for you, so just paste it into your post.';
    menu.appendChild(note);
    return menu;
  }

  function enhanceGem(el, index, url) {
    if (el.dataset.gemReady) return;
    var text = gemText(el);
    if (!text) return;
    el.dataset.gemReady = '1';
    el.id = el.id || 'gem-' + (index + 1);
    el.classList.add('gem-shareable');
    var gemUrl = url + '#' + el.id;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'gem-share-btn';
    btn.setAttribute('aria-label', 'Share this gem');
    btn.setAttribute('aria-haspopup', 'menu');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = ICON;
    btn.addEventListener('click', function (ev) {
      ev.stopPropagation();
      var same = openMenu && openMenu.btn === btn;
      closeMenu();
      if (same) return;
      var menu = buildMenu(btn, text, gemUrl);
      el.appendChild(menu);
      btn.setAttribute('aria-expanded', 'true');
      openMenu = { btn: btn, menu: menu };
      var first = menu.querySelector('a,button');
      if (first) first.focus({ preventScroll: true });
    });
    el.appendChild(btn);
  }

  function addHint(section) {
    if (section.querySelector('.gem-share-hint')) return;
    var h = section.querySelector('h3');
    if (!h) return;
    var p = document.createElement('p');
    p.className = 'gem-share-hint';
    p.textContent = 'Tap the share button on any gem to send it to a friend.';
    h.insertAdjacentElement('afterend', p);
  }

  function highlightFromHash() {
    var id = (location.hash || '').slice(1);
    if (!/^gem-\d+$/.test(id)) return;
    var el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ block: 'center' });
    el.classList.add('gem-highlight');
    setTimeout(function () { el.classList.remove('gem-highlight'); }, 3000);
  }

  // Copying from the Hidden Gems section carries the attribution and link with it.
  function onCopy(ev) {
    var sel = window.getSelection && window.getSelection();
    if (!sel || sel.isCollapsed || !ev.clipboardData) return;
    var node = sel.anchorNode && (sel.anchorNode.nodeType === 1 ? sel.anchorNode : sel.anchorNode.parentElement);
    var section = node && node.closest && node.closest(SECTION_SELECTOR);
    if (!section) return;
    var text = sel.toString().trim();
    if (!text) return;
    var gem = node.closest('.gem-shareable');
    var url = pageUrl + (gem ? '#' + gem.id : '');
    ev.clipboardData.setData('text/plain', text + '\n\n— ' + BRAND + '\n' + url);
    ev.clipboardData.setData('text/html',
      text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\n/g, '<br>') +
      '<br><br>— <a href="' + url + '">' + BRAND + '</a>');
    ev.preventDefault();
    track('copy_selection');
  }

  function enhance(root, url) {
    injectCss();
    pageUrl = (url || defaultUrl()).split('#')[0];
    root = root || document;
    Array.prototype.forEach.call(root.querySelectorAll(SECTION_SELECTOR), function (section) {
      var gems = section.querySelectorAll('.daily-callout, blockquote');
      if (!gems.length) return;
      addHint(section);
      Array.prototype.forEach.call(gems, function (g, i) { enhanceGem(g, i, pageUrl); });
    });
    highlightFromHash();
  }

  document.addEventListener('click', function (ev) {
    if (openMenu && !openMenu.menu.contains(ev.target)) closeMenu();
  });
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' && openMenu) { var b = openMenu.btn; closeMenu(); b.focus(); }
  });
  document.addEventListener('copy', onCopy);

  window.TWSGems = { enhance: enhance };

  if (window.__gemsPending) {
    enhance(window.__gemsPending.root, window.__gemsPending.url);
    window.__gemsPending = null;
  } else if (!document.documentElement.hasAttribute('data-gems-manual')) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { enhance(); });
    else enhance();
  }
})();
