/* The Pattern Interruption Lab. Nothing typed here is sent anywhere.
   Pattern data comes from /patterns/patterns-data.js. ?pattern=<id> preselects a pattern. */
(function () {
  'use strict';
  var P = window.TWS_PATTERNS || [];
  var S = window.TWS_LAB_SETTINGS || {};
  var $ = function (id) { return document.getElementById(id); };
  var stage = 0, ctx = '', pat = null;

  function track(name) { try { if (window.gtag) window.gtag('event', name); } catch (e) {} }

  $('labContext').innerHTML = Object.keys(S).map(function (k) { return '<option value="' + k + '">' + S[k].label + '</option>'; }).join('');
  $('labPattern').innerHTML = P.map(function (p) { return '<option value="' + p.id + '">' + p.name + ' — ' + p.theme.toLowerCase() + '</option>'; }).join('');
  var pre = new URLSearchParams(location.search).get('pattern');
  if (pre && P.some(function (p) { return p.id === pre; })) $('labPattern').value = pre;

  function show(which) {
    $('labIntro').hidden = which !== 'intro';
    $('labRun').hidden = which !== 'run';
    $('labResult').hidden = which !== 'result';
  }

  function feedback(text) { $('labFeedback').textContent = text; $('labFeedback').hidden = false; $('labNext').hidden = false; }

  function options(list, onPick) {
    var box = $('labChoices');
    box.innerHTML = '';
    list.forEach(function (o) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'pt-option';
      b.setAttribute('aria-pressed', 'false');
      b.textContent = o[0];
      b.addEventListener('click', function () {
        box.querySelectorAll('.pt-option').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
        onPick(o[1]);
      });
      box.appendChild(b);
    });
  }

  function render() {
    var s = S[ctx];
    $('labStep').textContent = 'Step ' + (stage + 1) + ' of 3';
    $('labWhere').textContent = pat.name + ' · ' + s.label;
    $('labBar').style.width = (stage / 3 * 100) + '%';
    $('labFeedback').hidden = true;
    $('labNext').hidden = true;
    $('labWrite').hidden = true;
    $('labNext').textContent = 'Continue →';
    $('labBack').textContent = stage === 0 ? 'Start over' : 'Back';

    if (stage === 0) {
      $('labHeading').textContent = 'The moment';
      $('labPrompt').textContent = s.setup + ' What is your most likely first instinct?';
      options([[pat.instinct, 'pattern'], ['I would slow down and ask a clarifying question.', 'pause'], ['I’m not sure; it depends on the circumstances.', 'unsure']], function (v) {
        feedback(v === 'pattern'
          ? 'That response may reflect the pattern you chose. Noticing the impulse creates room for a choice.'
          : v === 'pause'
            ? 'You already named a constructive first step. Think about what it might protect or accomplish.'
            : 'Context matters. Your uncertainty is useful information; there’s no need to force a label.');
      });
    } else if (stage === 1) {
      $('labHeading').textContent = 'Look beneath the impulse';
      $('labPrompt').textContent = 'One possible concern beneath this pattern is: ' + pat.need.toLowerCase() + '. Does that fit this situation?';
      options([['Yes, that resonates.', 'yes'], ['Partly, but there’s more to it.', 'partly'], ['No, something else seems more accurate.', 'no']], function (v) {
        feedback(v === 'yes'
          ? 'Notice the concern without judging yourself for having it.'
          : 'Good observation. Your own understanding of the situation matters more than a suggested category.');
      });
    } else {
      $('labHeading').textContent = 'Rehearse a better response';
      $('labPrompt').innerHTML = '';
      $('labChoices').innerHTML =
        '<span class="pt-label">Try this internal pause</span><p class="pt-quote"></p>' +
        '<span class="pt-label">A possible spoken response</span><p class="pt-quote"></p>';
      var qs = $('labChoices').querySelectorAll('.pt-quote');
      qs[0].textContent = '“' + pat.pauseThought + '”';
      qs[1].textContent = pat.response;
      $('labWrite').hidden = false;
      $('labNext').hidden = false;
      $('labNext').textContent = 'Create my practice card →';
    }
    $('labHeading').focus({ preventScroll: true });
  }

  function cardLines() {
    var s = S[ctx];
    return [
      ['Situation', s.challenge],
      ['Pattern to watch', pat.name + ' (' + pat.theme.toLowerCase() + ')'],
      ['Pause', pat.pauseThought],
      ['Try saying', pat.response],
      ['My own words', $('labNotes').value.trim() || '(not added)'],
      ['Optional Scripture', pat.labVerse]
    ];
  }

  $('labStart').addEventListener('click', function () {
    ctx = $('labContext').value;
    pat = P.filter(function (p) { return p.id === $('labPattern').value; })[0];
    stage = 0;
    $('labNotes').value = '';
    track('interruption_lab_start');
    show('run');
    render();
    $('labRun').scrollIntoView({ block: 'start', behavior: 'smooth' });
  });

  $('labNext').addEventListener('click', function () {
    if (stage < 2) { stage++; render(); return; }
    var card = $('labCard');
    card.innerHTML = '';
    cardLines().forEach(function (l) {
      var p = document.createElement('p');
      var b = document.createElement('strong');
      b.textContent = l[0] + ':';
      p.appendChild(b);
      p.appendChild(document.createTextNode(' ' + l[1]));
      card.appendChild(p);
    });
    $('labPatternLink').href = '/patterns/' + pat.id + '/';
    $('labJournalLink').href = '/tools/growth-journal/?pattern=' + pat.id;
    $('labCopied').textContent = '';
    track('interruption_lab_complete');
    show('result');
    $('labResultTitle').focus({ preventScroll: true });
    $('labResult').scrollIntoView({ block: 'start', behavior: 'smooth' });
  });

  $('labBack').addEventListener('click', function () {
    if (stage === 0) { show('intro'); return; }
    stage--; render();
  });
  $('labAgain').addEventListener('click', function () { show('intro'); $('labIntro').scrollIntoView({ block: 'start', behavior: 'smooth' }); });
  $('labPrint').addEventListener('click', function () { window.print(); });
  $('labCopy').addEventListener('click', function () {
    var text = ['Notice. Pause. Choose. | TheWrkShop.com'].concat(cardLines().map(function (l) { return l[0] + ': ' + l[1]; })).join('\n');
    var fb = $('labCopied');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(function () { fb.textContent = 'Practice card copied.'; },
        function () { fb.textContent = 'Copy isn’t available in this browser. Use Print / save PDF instead.'; });
    } else fb.textContent = 'Copy isn’t available in this browser. Use Print / save PDF instead.';
  });
})();
