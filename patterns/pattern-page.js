/* Pattern landing pages: 7-day checklist (saved in this browser), copy and print. */
(function () {
  'use strict';
  var id = document.body.getAttribute('data-pattern');
  var KEY = 'tws.pattern.' + id + '.days';
  var boxes = Array.prototype.slice.call(document.querySelectorAll('#ptDays input[type="checkbox"]'));
  var $ = function (x) { return document.getElementById(x); };

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; }
  }
  function save() {
    var done = boxes.filter(function (b) { return b.checked; }).map(function (b) { return Number(b.dataset.day); });
    try { localStorage.setItem(KEY, JSON.stringify(done)); } catch (e) {}
  }
  function progress() {
    var n = boxes.filter(function (b) { return b.checked; }).length;
    $('ptProgress').textContent = n === boxes.length
      ? 'All 7 practices checked. Take a moment to review what changed.'
      : n + ' of ' + boxes.length + ' practices checked';
  }

  var done = load();
  boxes.forEach(function (b) {
    b.checked = done.indexOf(Number(b.dataset.day)) >= 0;
    b.addEventListener('change', function () { save(); progress(); });
  });
  progress();

  $('ptClear').addEventListener('click', function () {
    boxes.forEach(function (b) { b.checked = false; });
    save(); progress();
  });
  $('ptPrint').addEventListener('click', function () { window.print(); });
  $('ptCopy').addEventListener('click', function () {
    var title = document.querySelector('.pt-name-pill').textContent.trim();
    var lines = [
      title + ' | TheWrkShop.com',
      document.querySelector('.pt-h1').textContent.trim(),
      ''
    ];
    boxes.forEach(function (b, i) {
      lines.push('Day ' + (i + 1) + ': ' + b.parentNode.querySelector('.pt-day-text').textContent);
    });
    lines.push('', location.href.split('#')[0]);
    var text = lines.join('\n');
    var fb = $('ptFeedback');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(function () { fb.textContent = 'Practice plan copied.'; },
        function () { fb.textContent = 'Copy isn’t available in this browser. Use Print / save as PDF instead.'; });
    } else {
      fb.textContent = 'Copy isn’t available in this browser. Use Print / save as PDF instead.';
    }
  });
})();
