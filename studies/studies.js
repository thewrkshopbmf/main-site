/* Group Studies: Share / Copy link / Text / Email / Print bar. */
(function () {
  'use strict';
  document.querySelectorAll('.st-share').forEach(function (bar) {
    var url = bar.getAttribute('data-url'), title = bar.getAttribute('data-title');
    var native = bar.querySelector('[data-share="native"]');
    if (native) {
      if (!navigator.share) native.style.display = 'none';
      else native.addEventListener('click', function () { navigator.share({ title: title, url: url }).catch(function () {}); });
    }
    var copy = bar.querySelector('[data-share="copy"]');
    if (copy) copy.addEventListener('click', function () {
      var done = function () { copy.textContent = 'Copied ✓'; setTimeout(function () { copy.textContent = 'Copy link'; }, 2000); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, function () { window.prompt('Copy this link:', url); });
      else window.prompt('Copy this link:', url);
    });
    var print = bar.querySelector('[data-share="print"]');
    if (print) print.addEventListener('click', function () { window.print(); });
  });
})();

/* Quick check: tap one of each pair; shows a result line. Nothing is stored or sent. */
(function () {
  'use strict';
  document.querySelectorAll('.st-check').forEach(function (box) {
    var a = box.getAttribute('data-a'), b = box.getAttribute('data-b');
    var rows = box.querySelectorAll('.st-check-opts');
    var out = box.querySelector('.st-check-result');
    var reset = box.querySelector('.st-check-reset');
    var started = false;
    function update() {
      var na = 0, nb = 0;
      rows.forEach(function (r) {
        var on = r.querySelector('[aria-pressed="true"]');
        if (on) { if (on.getAttribute('data-v') === 'a') na++; else nb++; }
      });
      var total = rows.length, done = na + nb;
      if (!done) { out.textContent = ''; return; }
      if (done < total) { out.textContent = done + ' of ' + total + ' answered.'; return; }
      var msg = 'Leaning ' + b + ': ' + nb + ' of ' + total + '. Leaning ' + a + ': ' + na + ' of ' + total + '. ';
      if (nb === total) msg += 'Good ground. Which of these is hardest to keep when life gets loud?';
      else if (na === total) msg += 'Honest answer, and that’s where growth starts. Pick one to bring to the group.';
      else msg += 'Which one would you most like to move? Bring it to the discussion.';
      out.textContent = msg;
      if (!started && window.gtag) { started = true; window.gtag('event', 'study_check_complete', { study: location.pathname }); }
    }
    rows.forEach(function (r) {
      r.querySelectorAll('button').forEach(function (btn) {
        btn.addEventListener('click', function () {
          r.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === btn ? 'true' : 'false'); });
          update();
        });
      });
    });
    if (reset) reset.addEventListener('click', function () {
      box.querySelectorAll('[aria-pressed]').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
      update();
    });
  });
})();
