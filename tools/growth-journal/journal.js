/* The Growth Journal. Entries live only in this browser (localStorage) and are never sent anywhere.
   ?pattern=<id> preselects a pattern. Pattern data comes from /patterns/patterns-data.js. */
(function () {
  'use strict';
  var KEY = 'thewrkshop-growth-journal-v1';
  var P = window.TWS_PATTERNS || [];
  var FIELDS = { date: 'gjDate', pattern: 'gjPattern', moment: 'gjMoment', story: 'gjStory', threat: 'gjThreat', response: 'gjResponse', practice: 'gjPractice', outcome: 'gjOutcome' };
  var LIMITS = { moment: 1500, story: 1500, response: 1500, practice: 1500, outcome: 1000, threat: 40 };
  var $ = function (id) { return document.getElementById(id); };
  var entries = [];
  var storageOk = true;

  function track(name) { try { if (window.gtag) window.gtag('event', name); } catch (e) {} }
  function pad(n) { return String(n).padStart(2, '0'); }
  function iso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function today() { return iso(new Date()); }
  function daysAgo(n) { var d = new Date(); d.setDate(d.getDate() - n); return iso(d); }
  function byId(id) { return P.filter(function (p) { return p.id === id; })[0] || null; }
  function shortName(id) { var p = byId(id); return p ? p.name.replace(/^The /, '') : 'Not sure'; }
  function niceDate(s) {
    var d = new Date(s + 'T12:00:00');
    return isNaN(d) ? s : d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  }

  // Older backups saved pattern names ("Protector", "Not sure"); store ids now.
  function normPattern(v) {
    var s = String(v || '').trim().toLowerCase().replace(/^the /, '');
    return byId(s) ? s : 'unsure';
  }
  function clean(raw) {
    if (!raw || typeof raw !== 'object') return null;
    var date = String(raw.date || '');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
    var e = {
      id: String(raw.id || (Date.now() + '-' + Math.random().toString(36).slice(2))).slice(0, 80),
      created: String(raw.created || new Date().toISOString()).slice(0, 40),
      date: date,
      pattern: normPattern(raw.pattern),
      scripture: raw.scripture === true
    };
    Object.keys(LIMITS).forEach(function (k) { e[k] = String(raw[k] || '').slice(0, LIMITS[k]); });
    if (!e.moment && !e.response && !e.practice) return null;
    return e;
  }

  function load() {
    try {
      var parsed = JSON.parse(localStorage.getItem(KEY) || '[]');
      entries = (Array.isArray(parsed) ? parsed : []).map(clean).filter(Boolean);
    } catch (e) { storageOk = false; entries = []; }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(entries)); return true; }
    catch (e) {
      $('gjMessage').textContent = 'This browser won’t let the journal save (storage is off or full). Export your entries and check your browser settings.';
      return false;
    }
  }

  function el(tag, text, cls) {
    var n = document.createElement(tag);
    if (text != null) n.textContent = text;
    if (cls) n.className = cls;
    return n;
  }

  /* ---------- form ---------- */
  $('gjPattern').innerHTML = '<option value="unsure">Not sure yet</option>' +
    P.map(function (p) { return '<option value="' + p.id + '">' + p.name + ' — ' + p.theme.toLowerCase() + '</option>'; }).join('');
  var pre = new URLSearchParams(location.search).get('pattern');
  if (pre && byId(pre)) $('gjPattern').value = pre;

  function resetDate() { $('gjDate').value = today(); $('gjDate').max = today(); }
  function practiceHint() {
    var p = byId($('gjPattern').value);
    var h = $('gjPracticeHelp');
    if (!p) { h.hidden = true; return; }
    h.textContent = 'Idea from ' + p.name + ': ' + p.tryInstead + ' ';
    var a = el('a', 'See the 7-day practice');
    a.href = '/patterns/' + p.id + '/#practice';
    h.appendChild(a);
    h.hidden = false;
  }
  resetDate();
  practiceHint();
  $('gjPattern').addEventListener('change', practiceHint);

  $('gjForm').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var missing = [['gjMoment', 'what happened'], ['gjResponse', 'how you responded'], ['gjPractice', 'what you’ll practice next time']]
      .filter(function (f) { return !$(f[0]).value.trim(); });
    var date = $('gjDate').value;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) { $('gjError').textContent = 'Please choose a date.'; $('gjDate').focus(); return; }
    if (date > today()) { $('gjError').textContent = 'The date can’t be in the future.'; $('gjDate').focus(); return; }
    if (missing.length) {
      $('gjError').textContent = 'Please add ' + missing.map(function (m) { return m[1]; }).join(', ') + '.';
      $(missing[0][0]).focus();
      return;
    }
    $('gjError').textContent = '';
    var raw = { id: (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : Date.now() + '-' + Math.random().toString(36).slice(2), created: new Date().toISOString(), scripture: $('gjScripture').checked };
    Object.keys(FIELDS).forEach(function (k) { raw[k] = $(FIELDS[k]).value.trim(); });
    var entry = clean(raw);
    entries.push(entry);
    if (save()) {
      track('growth_journal_entry');
      $('gjForm').reset();
      setTimeout(function () {
        resetDate();
        if (pre && byId(pre)) $('gjPattern').value = pre;
        practiceHint();
        $('gjMessage').textContent = 'Reflection saved on this device.';
      }, 0);
      render();
    } else {
      entries.pop();
    }
  });
  $('gjForm').addEventListener('reset', function () {
    setTimeout(function () { resetDate(); practiceHint(); $('gjMessage').textContent = ''; $('gjError').textContent = ''; }, 0);
  });

  /* ---------- review + history ---------- */
  function render() {
    var from = daysAgo(6), to = today();
    var recent = entries.filter(function (e) { return e.date >= from && e.date <= to; });
    $('gjTotal').textContent = recent.length;
    $('gjDays').textContent = new Set(recent.map(function (e) { return e.date; })).size;

    var counts = {};
    recent.forEach(function (e) { if (e.pattern !== 'unsure') counts[e.pattern] = (counts[e.pattern] || 0) + 1; });
    var max = Math.max.apply(null, [0].concat(Object.keys(counts).map(function (k) { return counts[k]; })));
    var top = Object.keys(counts).filter(function (k) { return counts[k] === max; });
    $('gjCommon').textContent = top.length ? top.map(shortName).join(' & ') : '—';

    var review = $('gjReview');
    review.textContent = '';
    if (!recent.length) {
      review.textContent = entries.length
        ? 'No reflections in the past seven days. One small moment is enough to start again.'
        : 'Record your first moment to begin your seven-day review.';
    } else {
      review.appendChild(document.createTextNode('Look for situations that keep recurring and small changes in how you respond. What would be worth practicing this coming week?'));
      if (top.length === 1) {
        review.appendChild(document.createTextNode(' '));
        var a = el('a', 'Revisit the ' + byId(top[0]).name + ' practice.');
        a.href = '/patterns/' + top[0] + '/#practice';
        review.appendChild(a);
      }
    }

    var root = $('gjHistory');
    root.textContent = '';
    if (!storageOk) {
      root.appendChild(el('p', 'This browser is blocking storage, so entries can’t be saved here. Try a regular (not private) window.', 'gj-empty'));
      return;
    }
    if (!entries.length) {
      root.appendChild(el('p', 'No reflections saved yet. Your first entry can be a small moment, not a major event.', 'gj-empty'));
      return;
    }
    entries.slice().sort(function (a, b) { return b.date.localeCompare(a.date) || b.created.localeCompare(a.created); }).forEach(function (e) {
      var art = el('article', null, 'gj-entry');
      var h = el('h3', niceDate(e.date) + ' · ', 'gj-entry-title');
      var p = byId(e.pattern);
      if (p) { var link = el('a', p.name); link.href = '/patterns/' + p.id + '/'; h.appendChild(link); }
      else h.appendChild(document.createTextNode('Pattern not sure yet'));
      art.appendChild(h);
      [['What happened', e.moment], ['The story I told myself', e.story], ['What felt important', e.threat === 'Unsure' ? '' : e.threat],
       ['How I responded', e.response], ['Next time I’ll practice', e.practice], ['What went well', e.outcome]].forEach(function (row) {
        if (!row[1]) return;
        var para = el('p');
        para.appendChild(el('strong', row[0] + ': '));
        para.appendChild(document.createTextNode(row[1]));
        art.appendChild(para);
      });
      if (e.scripture) art.appendChild(el('p', 'Scripture reflection: What would it look like to listen carefully, examine your heart, and respond with wisdom? (Proverbs 4:23; James 1:19–20)', 'pt-small pt-muted'));
      var del = el('button', 'Delete this entry', 'gj-link-danger pt-no-print');
      del.type = 'button';
      del.addEventListener('click', function () {
        if (!window.confirm('Delete this journal entry? This can’t be undone.')) return;
        entries = entries.filter(function (x) { return x.id !== e.id; });
        save(); render();
      });
      art.appendChild(del);
      root.appendChild(art);
    });
  }

  /* ---------- backup ---------- */
  $('gjExport').addEventListener('click', function () {
    if (!entries.length) { $('gjIoMessage').textContent = 'There are no entries to export yet.'; return; }
    var blob = new Blob([JSON.stringify({ app: 'TheWrkShop Growth Journal', version: 2, exported: new Date().toISOString(), entries: entries }, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'thewrkshop-growth-journal-' + today() + '.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    $('gjIoMessage').textContent = 'Backup downloaded. Keep it somewhere private.';
  });

  $('gjImportBtn').addEventListener('click', function () { $('gjImport').click(); });
  $('gjImport').addEventListener('change', function () {
    var file = this.files && this.files[0];
    this.value = '';
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { $('gjIoMessage').textContent = 'That file is too large to be a journal backup.'; return; }
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var data = JSON.parse(reader.result);
        var list = Array.isArray(data) ? data : (data && Array.isArray(data.entries) ? data.entries : null);
        if (!list) throw new Error('not a backup');
        var have = new Set(entries.map(function (e) { return e.id; }));
        var added = 0;
        list.map(clean).filter(Boolean).forEach(function (e) {
          if (have.has(e.id)) return;
          entries.push(e); have.add(e.id); added++;
        });
        if (added && !save()) return;
        render();
        $('gjIoMessage').textContent = added
          ? 'Imported ' + added + ' entr' + (added === 1 ? 'y' : 'ies') + '.'
          : 'Nothing new to import. Those entries are already here.';
      } catch (err) {
        $('gjIoMessage').textContent = 'That file isn’t a Growth Journal backup.';
      }
    };
    reader.readAsText(file);
  });

  $('gjPrint').addEventListener('click', function () {
    $('gjPrintDate').textContent = 'Printed ' + niceDate(today());
    window.print();
  });

  $('gjDeleteAll').addEventListener('click', function () {
    if (!entries.length) return;
    if (!window.confirm('Permanently delete ALL journal entries saved in this browser? Export a backup first if you want to keep them.')) return;
    entries = [];
    save(); render();
    $('gjIoMessage').textContent = 'All entries deleted from this browser.';
  });

  load();
  render();
})();
