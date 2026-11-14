/*
 * Post actions for blog posts: "Like this post" and the share row.
 *
 * Like: one tap likes, a second tap takes it back. This browser remembers that it
 * liked the post (localStorage, no sign-in); the site keeps only a running count per
 * post through /api/like (netlify/functions/post-like.mjs).
 *
 * Share: same buttons as the Dailies (phone share sheet, copy link, LinkedIn, Facebook,
 * X, email). Likes and shares are sent to Google Analytics so the weekly report can
 * show which posts men act on.
 */
(function () {
  'use strict';

  function track(name, params) {
    try { if (window.gtag) window.gtag('event', name, params || {}); } catch (e) {}
  }

  // ---------- Like ----------
  function initLike(box) {
    var key = box.getAttribute('data-post-key');
    var btn = box.querySelector('.like-btn');
    var countEl = box.querySelector('.like-count');
    if (!key || !btn) return;
    var store = 'tws-liked:' + key;
    var liked = false, count = 0, busy = false;
    try { liked = localStorage.getItem(store) === '1'; } catch (e) {}

    function render() {
      btn.classList.toggle('is-liked', liked);
      btn.setAttribute('aria-pressed', String(liked));
      btn.querySelector('.like-label').textContent = liked ? 'You liked this' : 'Like this post';
      if (countEl) {
        countEl.textContent = count > 0 ? (count === 1 ? '1 like' : count + ' likes') : '';
        countEl.hidden = count < 1;
      }
    }

    function remember(v) {
      try { if (v) localStorage.setItem(store, '1'); else localStorage.removeItem(store); } catch (e) {}
    }

    render();
    fetch('/api/like?key=' + encodeURIComponent(key), { cache: 'no-store' })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d && d.ok) { count = Math.max(Number(d.likes) || 0, liked ? 1 : 0); render(); }
      })
      .catch(function () {});

    btn.addEventListener('click', function () {
      if (busy) return;
      busy = true;
      var next = !liked;
      var before = { liked: liked, count: count };
      liked = next; count = Math.max(0, count + (next ? 1 : -1));
      remember(next);
      render();
      if (next) {
        btn.classList.remove('pop'); void btn.offsetWidth; btn.classList.add('pop');
        track('post_like', { post: key });
      }
      fetch('/api/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: key, action: next ? 'like' : 'unlike' })
      })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (!d || !d.ok) throw new Error('like failed');
          count = Math.max(Number(d.likes) || 0, liked ? 1 : 0);
          render();
        })
        .catch(function () {
          liked = before.liked; count = before.count;
          remember(liked);
          render();
        })
        .then(function () { busy = false; });
    });
  }

  // ---------- Share ----------
  function initShare(row) {
    var nativeBtn = row.querySelector('.share-native');
    if (nativeBtn) {
      if (!navigator.share) {
        nativeBtn.style.display = 'none';
      } else {
        nativeBtn.addEventListener('click', function () {
          track('share', { method: 'native', content_type: 'blog', item_id: nativeBtn.dataset.url });
          navigator.share({ title: nativeBtn.dataset.title, url: nativeBtn.dataset.url }).catch(function () {});
        });
      }
    }
    var copyBtn = row.querySelector('.share-copy');
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        var url = copyBtn.dataset.url;
        track('share', { method: 'copy_link', content_type: 'blog', item_id: url });
        var done = function () {
          copyBtn.textContent = 'Copied ✓';
          setTimeout(function () { copyBtn.textContent = 'Copy link'; }, 2000);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(done, function () { window.prompt('Copy this link:', url); });
        } else {
          window.prompt('Copy this link:', url);
        }
      });
    }
    row.querySelectorAll('a[data-share]').forEach(function (a) {
      a.addEventListener('click', function () {
        track('share', { method: a.getAttribute('data-share'), content_type: 'blog', item_id: location.pathname });
      });
    });
  }

  function init() {
    document.querySelectorAll('.post-like').forEach(initLike);
    document.querySelectorAll('.post-actions .share-row').forEach(initShare);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
