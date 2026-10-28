/*
 * Prayer Formation tools: Pattern Finder, Surrender Tool, Guided Prayer,
 * Seven Days and the printable group guide.
 *
 * Privacy: everything happens on the page. Nothing is sent to a server and
 * nothing is written to cookies, localStorage or sessionStorage. Tool choices
 * travel between pages only in the "#" part of the address, which analytics
 * on these pages leaves off (see the gtag config in each page head).
 *
 * Scripture quotations: NIV (see the notice at the foot of each page).
 */
(function () {
  'use strict';

  /* ---------- data ---------- */

  // What you're carrying (Pattern Finder question 1; Guided Prayer paths).
  var SEASONS = {
    control: {
      option: "I've prayed about it, but I can't stop trying to control it.",
      title: 'Control and surrender',
      truth: "Surrender doesn't end your part. It ends your claim to run the outcome.",
      verse: { text: 'Cast all your anxiety on him because he cares for you.', ref: '1 Peter 5:7' },
      line: 'Casting your worry is how you humble yourself. And the very next line says, “Be alert.” Give it to God, and stay awake.',
      reflect: 'What do I keep picking back up?',
      prayer: ['Father, here is what I keep holding: ______.', 'Show me my part. Help me release the rest.', 'Not my will, but Yours be done.'],
      step: 'Name one thing that is clearly yours to do. Do only that today.',
      article: { href: '/prayer/after-you-give-it-to-god/', title: 'What Do I Do After I Give It to God?' },
      tool: { href: '/prayer/surrender/', label: 'Sort it with the Surrender Tool' }
    },
    next: {
      option: "I've prayed. I don't know what to do next.",
      title: 'Prayer and your next step',
      truth: "Grabbing what's God's and dropping what's yours both sound spiritual.",
      verse: { text: 'Do not merely listen to the word, and so deceive yourselves. Do what it says.', ref: 'James 1:22' },
      line: 'Jesus prayed “not my will,” then said, “Rise! Let us go!” Surrender sent Him toward the hardest thing, not away from it.',
      reflect: 'What one thing is clearly mine to do?',
      prayer: ['Father, I gave this to You: ______.', 'Give me courage for my part and trust for the rest.', 'Show me the next right thing, and help me do it.'],
      step: 'Write the one next step. If anyone is in danger, getting help is the step.',
      article: { href: '/prayer/after-you-give-it-to-god/', title: 'What Do I Do After I Give It to God?' },
      tool: { href: '/prayer/surrender/', label: 'Find your part with the Surrender Tool' }
    },
    silence: {
      option: "I've prayed and prayed. God seems silent.",
      title: 'Silence and lament',
      truth: "Feeling forsaken isn't the same as being forsaken.",
      verse: { text: 'How long, LORD? Will you forget me forever? How long will you hide your face from me?', ref: 'Psalm 13:1' },
      line: 'Lament is faith that refuses to stop talking to God. Even on the cross, Jesus prayed the question, and still said “my God.”',
      reflect: 'What have I concluded about God, or about myself, from what hasn’t happened?',
      prayer: ['Lord, how long?', "I don't understand, and I'm not going to pretend I do.", "I'm still talking to You. Even here, You are my God."],
      step: 'Tell one man what you’ve been carrying. You don’t need him to explain it. You need him to sit with you.',
      article: { href: '/prayer/when-god-seems-silent/', title: 'When God Seems Silent' },
      tool: { href: '/prayer/7-day/#day-5', label: 'Write your own Psalm 13 (Day 5)' }
    },
    unsure: {
      option: "I don't know what to pray for.",
      title: 'Not sure what to pray',
      truth: 'Ask. Then let Him reshape the asking.',
      verse: { text: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.', ref: 'Philippians 4:6' },
      line: 'You don’t need pure motives to pray. Prayer is where motives get purified. And Jesus is already praying for you (Hebrews 7:25).',
      reflect: 'What do I want that I’ve never actually asked God for?',
      prayer: ['Father, here is what I want: ______.', "I'm not going to hide it from You.", 'Show me what’s underneath it, and change the man who’s asking.'],
      step: 'Write the real request in one sentence. Then write why you want it.',
      article: { href: '/prayer/how-do-i-know-what-to-pray-for/', title: 'How Do I Know What to Pray For?' },
      tool: { href: '/prayer/7-day/#day-2', label: 'Say what you want (Day 2)' }
    },
    waiting: {
      option: "I've been waiting so long it's changing how I see myself.",
      title: 'Identity while waiting',
      truth: 'You can wait for something without waiting to become someone.',
      verse: { text: 'Wait for the LORD; be strong and take heart and wait for the LORD.', ref: 'Psalm 27:14' },
      line: 'Jesus heard “This is my Son” before He had done anything. Your identity doesn’t wait on your answered prayer.',
      reflect: 'What would getting this prove about me?',
      prayer: ['Father, You know what I’ve been waiting for, and how long.', "Don't let this waiting become my name.", "You've already called me son. Help me believe it before anything changes."],
      step: 'Choose one faithful thing for today: call a friend, serve someone, rest, or ask for help.',
      article: { href: '/prayer/when-waiting-begins-to-define-you/', title: 'When Waiting Begins to Define You' },
      tool: { href: '/prayer/guided-prayer/#path=waiting', label: 'Pray it now' }
    },
    words: {
      option: "I don't know how to pray, or I'm not sure I'm doing it right.",
      title: 'Learning to pray',
      truth: "Prayer isn't a technique for getting God to act. It's a son talking to his Father.",
      verse: { text: 'We do not know what we ought to pray for, but the Spirit himself intercedes for us through wordless groans.', ref: 'Romans 8:26' },
      line: 'Paul included himself: “We do not know.” A groan counts. Silence counts. “Help” counts.',
      reflect: 'When I can’t find words, what do I assume God thinks of me?',
      prayer: ['Father, I come through Jesus, not through my words.', 'Teach me to pray.', 'Where I have no words, Spirit, pray for me.'],
      step: 'Pray the Lord’s Prayer slowly (Matthew 6:9–13), one line at a time.',
      article: { href: '/prayer/what-is-biblical-prayer/', title: 'What Is Biblical Prayer?' },
      tool: { href: '/prayer/7-day/', label: 'Start the seven days' }
    }
  };
  var SEASON_ORDER = ['control', 'next', 'silence', 'unsure', 'waiting', 'words'];

  var GENERAL = {
    title: 'Just want to pray',
    verse: { text: '“Our Father in heaven, hallowed be your name, your kingdom come, your will be done, on earth as it is in heaven.”', ref: 'Matthew 6:9–10' },
    line: 'His name first. His kingdom first. Then everything else, in His light.',
    prayer: ['Father, I come through Jesus.', 'Your name first. Your kingdom first. Your will first.', 'Here is what’s on me today: ______.', 'Give me what I need for today, and help me do my part.'],
    step: 'Choose one thing that’s yours to do today. Do it.'
  };

  // How you tend to respond under weight (Pattern Finder question 2).
  // Names and ids match the Practice Library at /patterns/.
  var PATTERNS = {
    controller: {
      option: 'Take charge. Make a plan. Fix it now.',
      name: 'The Controller',
      prays: 'Your prayers can sound like a plan you need God to sign off on. Under pressure you may pray instructions, then take the burden right back.',
      shift: 'Pray the outcome you want, out loud. Then pray Jesus’ words: “Yet not what I will, but what you will.” Then do only what’s clearly yours.',
      verse: 'Matthew 6:34'
    },
    protector: {
      option: 'Defend my decisions. Replay what I should have said.',
      name: 'The Protector',
      prays: 'You may pray your defense: replaying the conversation and building your case before God.',
      shift: 'Ask God to search you before you ask Him to vindicate you. Pray Psalm 139:23–24.',
      verse: 'Psalm 139:23–24'
    },
    pleaser: {
      option: 'Keep everyone okay, even if I’m not.',
      name: 'The Pleaser',
      prays: 'You may pray what sounds right instead of what’s true, and carry everyone else’s feelings into the room with you.',
      shift: 'Tell God the thing you’d never say in a group. He already knows.',
      verse: 'Galatians 1:10'
    },
    avoider: {
      option: 'Stay busy. Don’t think about it.',
      name: 'The Avoider',
      prays: 'You may not pray about the thing at all. Or you pray around it.',
      shift: 'Name it out loud in one sentence. That sentence is the prayer.',
      verse: 'Psalm 62:8'
    },
    prover: {
      option: 'Work harder. Prove I can handle it.',
      name: 'The Prover',
      prays: 'You may pray to perform, or wait to pray until you feel you’ve earned it.',
      shift: 'Come as a son, not an employee. Start with “Abba, Father” (Romans 8:15).',
      verse: 'Romans 8:15'
    },
    reactor: {
      option: 'Get short with people. Snap, then regret it.',
      name: 'The Reactor',
      prays: 'You may only pray when it boils over, or pray against the people involved.',
      shift: 'Before you respond, take one breath and pray one sentence. Quick to listen, slow to speak (James 1:19).',
      verse: 'James 1:19'
    }
  };
  var PATTERN_ORDER = ['controller', 'protector', 'pleaser', 'avoider', 'prover', 'reactor'];

  /* ---------- helpers ---------- */

  // Build elements without ever parsing user text as HTML.
  function h(tag, attrs, kids) {
    var el = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k === 'text') el.textContent = v;
      else if (k === 'class') el.className = v;
      else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    });
    (kids || []).forEach(function (c) {
      if (c === null || c === undefined || c === false) return;
      el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return el;
  }
  function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); }
  function focusHeading(root) {
    var head = root.querySelector('[data-focus]');
    if (head) { head.setAttribute('tabindex', '-1'); head.focus({ preventScroll: true }); }
    root.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }
  function hashParams() {
    var out = {};
    (location.hash || '').replace(/^#/, '').split('&').forEach(function (pair) {
      var i = pair.indexOf('=');
      if (i > 0) out[decodeURIComponent(pair.slice(0, i))] = decodeURIComponent(pair.slice(i + 1));
    });
    return out;
  }
  function verseBlock(v) {
    return h('blockquote', { class: 'pr-verse' }, [v.text, h('cite', { text: v.ref })]);
  }
  function lines(arr, cls) {
    var p = h('p', { class: cls || 'pr-lines' });
    arr.forEach(function (t, i) { if (i) p.appendChild(h('br')); p.appendChild(document.createTextNode(t)); });
    return p;
  }
  function copyText(text, btn) {
    var done = function () { var old = btn.textContent; btn.textContent = 'Copied'; setTimeout(function () { btn.textContent = old; }, 1800); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallback(); });
    } else fallback();
    function fallback() {
      var ta = h('textarea', { class: 'pr-copybox', readonly: true, 'aria-label': 'Your prayer, ready to copy' });
      ta.value = text;
      btn.parentNode.insertAdjacentElement('afterend', ta);
      ta.focus(); ta.select();
      btn.textContent = 'Select and copy';
    }
  }
  function radioList(name, legend, items, selected, onChange) {
    var fs = h('fieldset', { class: 'pt-fieldset' }, [h('legend', { class: 'pt-legend', text: legend, 'data-focus': true })]);
    items.forEach(function (it) {
      var input = h('input', { type: 'radio', name: name, value: it.value });
      if (selected === it.value) input.checked = true;
      input.addEventListener('change', function () { onChange(it.value); });
      fs.appendChild(h('label', { class: 'pt-option' }, [input, h('span', { text: it.label })]));
    });
    return fs;
  }
  function btn(label, cls, onClick, extra) {
    var b = h('button', Object.assign({ type: 'button', class: 'pt-btn ' + (cls || ''), text: label }, extra || {}));
    b.addEventListener('click', onClick);
    return b;
  }

  /* ---------- Pattern Finder ---------- */

  function patternFinder(root) {
    var state = { step: 1, season: null, pattern: null };
    function render(moveFocus) {
      clear(root);
      if (state.step === 3) return renderResult(moveFocus);
      var isFirst = state.step === 1;
      root.appendChild(h('div', { class: 'pt-tool-top' }, [
        h('span', { class: 'pt-label', text: 'Question ' + state.step + ' of 2' })
      ]));
      root.appendChild(h('div', { class: 'pt-track' }, [h('div', { style: 'width:' + (isFirst ? 50 : 100) + '%' })]));
      var next = btn(isFirst ? 'Next' : 'See what this means', 'pt-btn--ember', function () {
        state.step += 1; render(true);
      }, { disabled: isFirst ? !state.season : !state.pattern });
      if (isFirst) {
        root.appendChild(radioList('season', 'What are you carrying into prayer right now?',
          SEASON_ORDER.map(function (k) { return { value: k, label: SEASONS[k].option }; }), state.season,
          function (v) { state.season = v; next.disabled = false; }));
      } else {
        var items = PATTERN_ORDER.map(function (k) { return { value: k, label: PATTERNS[k].option }; });
        items.push({ value: 'none', label: 'None of these, or not sure.' });
        root.appendChild(radioList('pattern', 'When it’s heavy, what do you usually do?', items, state.pattern,
          function (v) { state.pattern = v; next.disabled = false; }));
        root.appendChild(h('p', { class: 'pt-small pt-muted', text: 'Pick the one that sounds most like you lately. Most men see themselves in more than one.' }));
      }
      var actions = h('div', { class: 'pt-actions' });
      if (!isFirst) actions.appendChild(btn('Back', 'pt-btn--ghost pr-dark-ghost', function () { state.step = 1; render(true); }));
      actions.appendChild(next);
      root.appendChild(actions);
      if (moveFocus) focusHeading(root);
    }
    function renderResult(moveFocus) {
      var s = SEASONS[state.season];
      var p = PATTERNS[state.pattern];
      root.appendChild(h('span', { class: 'pt-label', text: 'What you’re carrying' }));
      root.appendChild(h('h2', { class: 'pt-h3', text: s.title, 'data-focus': true }));
      root.appendChild(h('p', { class: 'pr-callout', text: s.truth }));
      root.appendChild(verseBlock(s.verse));
      root.appendChild(h('p', { text: s.line }));
      root.appendChild(h('p', {}, [h('strong', { text: 'Reflect: ' }), s.reflect]));
      root.appendChild(h('div', { class: 'pr-prayer' }, [h('p', { class: 'pt-label', text: 'Pray' }), lines(s.prayer)]));
      if (p) {
        root.appendChild(h('div', { class: 'pr-lens' }, [
          h('span', { class: 'pt-label', text: 'How your pattern may show up' }),
          h('h3', { class: 'pt-h3', text: p.name }),
          h('p', { text: p.prays }),
          h('p', {}, [h('strong', { text: 'Try this: ' }), p.shift]),
          h('p', {}, [h('a', { href: '/patterns/' + state.pattern + '/', text: 'Explore ' + p.name + ' in the Practice Library →' })])
        ]));
      }
      root.appendChild(h('p', { class: 'pt-small pt-muted', text: 'This is an invitation to reflect, not a verdict about you. You can start over and explore another path.' }));
      var guided = '/prayer/guided-prayer/#path=' + state.season + (p ? '&pattern=' + state.pattern : '');
      root.appendChild(h('div', { class: 'pr-next' }, [
        h('a', { href: guided, text: 'Pray it now: five-minute guided prayer' }),
        h('a', { class: 'pr-ghost', href: s.article.href, text: 'Read: ' + s.article.title }),
        h('a', { class: 'pr-ghost', href: s.tool.href, text: s.tool.label })
      ]));
      root.appendChild(h('div', { class: 'pt-actions' }, [
        btn('Start over', 'pt-btn--ghost pr-dark-ghost', function () { state = { step: 1, season: null, pattern: null }; render(true); })
      ]));
      if (moveFocus) focusHeading(root);
    }
    render(false);
  }

  /* ---------- Surrender Tool ---------- */

  var COLUMNS = [
    { id: 'do', name: 'Mine to do', hint: 'What you can actually do. Honest, safe, within your capacity.', eg: 'Apologize. Make the call. Set the appointment. Ask for help.' },
    { id: 'influence', name: 'Mine to influence', hint: 'You can ask, invite, advise or offer. You can’t make it happen.', eg: 'Invite him to dinner. Share my concern once. Offer to help.' },
    { id: 'theirs', name: 'Theirs to decide', hint: 'Another person’s choices belong to them.', eg: 'Whether he calls back. How she responds. What they believe.' },
    { id: 'gods', name: 'God’s to determine', hint: 'Timing. Outcomes. Tomorrow.', eg: 'The test results. When it changes. How it all turns out.' }
  ];

  function surrenderTool(root) {
    var state = { step: 1, burden: '', items: [], pick: null, custom: '', when: '' };
    var STEPS = 5;
    function colName(id) { for (var i = 0; i < COLUMNS.length; i++) if (COLUMNS[i].id === id) return COLUMNS[i].name; return ''; }
    function of(id) { return state.items.filter(function (it) { return it.col === id; }); }

    function header(title, lead) {
      root.appendChild(h('div', { class: 'pt-tool-top' }, [h('span', { class: 'pt-label', text: 'Step ' + state.step + ' of ' + STEPS })]));
      root.appendChild(h('div', { class: 'pt-track' }, [h('div', { style: 'width:' + (state.step / STEPS * 100) + '%' })]));
      root.appendChild(h('h2', { class: 'pt-h3', text: title, 'data-focus': true }));
      if (lead) root.appendChild(h('p', { text: lead }));
    }
    function nav(nextLabel, canNext, onNext) {
      var a = h('div', { class: 'pt-actions' });
      if (state.step > 1) a.appendChild(btn('Back', 'pt-btn--ghost pr-dark-ghost', function () { state.step -= 1; render(true); }));
      var n = btn(nextLabel, 'pt-btn--ember', onNext || function () { state.step += 1; render(true); }, { disabled: !canNext });
      a.appendChild(n);
      root.appendChild(a);
      return n;
    }
    function board(editable) {
      var wrap = h('div', { class: 'pr-board' });
      COLUMNS.forEach(function (c) {
        var list = h('ul', { class: 'pr-col-list', 'aria-label': c.name });
        of(c.id).forEach(function (it) {
          var li = h('li', {}, [h('span', { class: 'pr-item-text', text: it.text })]);
          if (editable) {
            var sel = h('select', { 'aria-label': 'Move “' + it.text + '” to another column', class: 'pr-move' });
            COLUMNS.forEach(function (o) {
              var opt = h('option', { value: o.id, text: o.id === c.id ? 'Move…' : o.name });
              if (o.id === c.id) opt.selected = true;
              sel.appendChild(opt);
            });
            sel.addEventListener('change', function () {
              it.col = sel.value;
              if (state.pick === it.id && it.col !== 'do') state.pick = null;
              render(false, 'Moved to ' + colName(it.col) + '.');
            });
            li.appendChild(sel);
            li.appendChild(btn('×', 'pr-remove', function () {
              state.items = state.items.filter(function (x) { return x !== it; });
              if (state.pick === it.id) state.pick = null;
              render(false, 'Removed.');
            }, { 'aria-label': 'Remove “' + it.text + '”' }));
          }
          list.appendChild(li);
        });
        if (!of(c.id).length) list.appendChild(h('li', { class: 'pr-empty', text: editable ? 'e.g. ' + c.eg : 'Nothing here yet.' }));
        wrap.appendChild(h('div', { class: 'pr-col pr-col-' + c.id }, [
          h('h3', { text: c.name }), h('p', { class: 'pr-col-hint', text: c.hint }), list
        ]));
      });
      return wrap;
    }
    var nextId = 1;
    var liveMsg = h('p', { class: 'pt-sr', role: 'status', 'aria-live': 'polite' });

    function render(moveFocus, msg) {
      clear(root);
      root.appendChild(liveMsg);
      liveMsg.textContent = msg || '';
      if (state.step === 1) {
        header('What do you keep picking back up?', 'One phrase is enough. You can skip this.');
        var input = h('input', { type: 'text', id: 'prBurden', maxlength: '140', class: 'pr-input', placeholder: 'e.g. my son’s distance, the layoff, my marriage', 'aria-label': 'What you keep picking back up' });
        input.value = state.burden;
        input.addEventListener('input', function () { state.burden = input.value; });
        root.appendChild(input);
        nav('Next', true);
      } else if (state.step === 2) {
        header('Sort it into four columns.', 'Add each piece of the situation, then choose where it belongs. You can move things later.');
        var add = h('input', { type: 'text', maxlength: '140', class: 'pr-input', placeholder: 'Add a piece of it…', 'aria-label': 'A piece of the situation' });
        var addRow = h('div', { class: 'pr-add' }, [add]);
        var btns = h('div', { class: 'pr-add-btns', role: 'group', 'aria-label': 'Add to column' });
        COLUMNS.forEach(function (c) {
          btns.appendChild(btn('+ ' + c.name, 'pt-btn--ghost pr-dark-ghost pr-small-btn', function () {
            var t = add.value.trim();
            if (!t) { add.focus(); liveMsg.textContent = 'Type something first.'; return; }
            state.items.push({ id: nextId++, text: t, col: c.id });
            render(false, 'Added to ' + c.name + '.');
            var again = root.querySelector('.pr-add input'); if (again) again.focus();
          }));
        });
        addRow.appendChild(btns);
        root.appendChild(addRow);
        root.appendChild(board(true));
        nav('Next', state.items.length > 0);
      } else if (state.step === 3) {
        header('Now check it.', 'Two honest questions. Move anything that’s in the wrong place.');
        root.appendChild(h('div', { class: 'pr-checks' }, [
          h('p', {}, [h('strong', { text: 'Grabbing? ' }), 'Look at “Mine to do.” Is anything there really someone else’s choice?']),
          h('p', {}, [h('strong', { text: 'Dropping? ' }), 'Look at “God’s to determine.” Is anything there actually yours to do?'])
        ]));
        root.appendChild(board(true));
        root.appendChild(h('p', { class: 'pr-callout', text: 'Do your part. Offer your influence. Respect their choice. Trust God with the rest.' }));
        nav('Next', state.items.length > 0);
      } else if (state.step === 4) {
        header('Choose one step.', 'Pick one thing from “Mine to do,” or write it. Asking for help counts.');
        var mine = of('do');
        var nextBtn;
        var fs = h('fieldset', { class: 'pt-fieldset' }, [h('legend', { class: 'pt-sr', text: 'Your one step' })]);
        function setPick(v) { state.pick = v; if (nextBtn) nextBtn.disabled = !canGo(); }
        mine.forEach(function (it) {
          var r = h('input', { type: 'radio', name: 'pick', value: String(it.id) });
          if (state.pick === it.id) r.checked = true;
          r.addEventListener('change', function () { setPick(it.id); });
          fs.appendChild(h('label', { class: 'pt-option' }, [r, h('span', { text: it.text })]));
        });
        var rc = h('input', { type: 'radio', name: 'pick', value: 'custom' });
        if (state.pick === 'custom') rc.checked = true;
        rc.addEventListener('change', function () { setPick('custom'); custom.focus(); });
        var custom = h('input', { type: 'text', maxlength: '140', class: 'pr-input pr-inline', placeholder: 'Something else…', 'aria-label': 'Write your own step' });
        custom.value = state.custom;
        custom.addEventListener('input', function () { state.custom = custom.value; rc.checked = true; setPick('custom'); });
        fs.appendChild(h('label', { class: 'pt-option' }, [rc, custom]));
        root.appendChild(fs);
        var when = h('select', { class: 'pr-select', id: 'prWhen' });
        [['', 'When? (optional)'], ['today', 'Today'], ['this week', 'This week'], ['before I talk to them', 'Before I talk to them'], ['after I get counsel', 'After I get wise counsel']].forEach(function (o) {
          var opt = h('option', { value: o[0], text: o[1] }); if (state.when === o[0]) opt.selected = true; when.appendChild(opt);
        });
        when.addEventListener('change', function () { state.when = when.value; });
        root.appendChild(h('label', { class: 'pr-field-label', for: 'prWhen', text: 'When will you do it?' }));
        root.appendChild(when);
        root.appendChild(h('p', { class: 'pt-small pt-muted', text: 'If anyone is in danger, getting help is the step. Call 911.' }));
        function canGo() { return state.pick !== null && (state.pick !== 'custom' || state.custom.trim().length > 0); }
        nextBtn = nav('See my prayer', canGo());
      } else {
        renderResult();
      }
      if (moveFocus) focusHeading(root);
    }
    function stepText() {
      if (state.pick === 'custom') return state.custom.trim();
      var it = state.items.filter(function (x) { return x.id === state.pick; })[0];
      return it ? it.text : '';
    }
    // Mid-sentence, "Invite him" reads better as "invite him" (but keep "I", acronyms and names like "Mark").
    function lowerFirst(t) {
      return /^[A-Z][a-z]/.test(t) && !/^(I'|I\s)/.test(t) && /^(A|An|The|My|Our|His|Her|Their|Whether|When|What|How|If|Ask|Call|Make|Set|Take|Tell|Talk|Invite|Offer|Share|Apologize|Pray|Get|Go|Stop|Start|Keep|Be|Do|Find|Write|Send|Give|Help|Let|See|Book|Schedule|Pay|Read|Rest|Walk|Visit|Text|Email)\b/.test(t) ? t.charAt(0).toLowerCase() + t.slice(1) : t;
    }
    function joinList(arr, lower) {
      var t = arr.map(function (x) { return lower ? lowerFirst(x.text) : x.text; });
      if (t.length < 2) return t.join('');
      return t.slice(0, -1).join(', ') + ' and ' + t[t.length - 1];
    }
    function prayerLines() {
      var out = ['Father,'];
      if (state.burden.trim()) out.push('This is what I keep picking back up: ' + state.burden.trim() + '.');
      var s = stepText();
      if (s) out.push('Here is my part: ' + lowerFirst(s) + (state.when ? ', ' + state.when : '') + '. Give me courage to do it.');
      var inf = of('influence'); if (inf.length) out.push('I will offer this without trying to force it: ' + joinList(inf, true) + '.');
      var th = of('theirs'); if (th.length) out.push(joinList(th) + ': that’s not mine to decide. Help me respect their choices and love them well.');
      var gd = of('gods'); if (gd.length) out.push('And I give You ' + joinList(gd, true) + '. Timing, outcomes, tomorrow. They’re Yours.');
      out.push('Not my will, but Yours be done.');
      out.push('When I pick it back up, I’ll bring it back to You.');
      out.push('In Jesus’ name, amen.');
      return out;
    }
    function renderResult() {
      root.appendChild(h('div', { class: 'pt-tool-top' }, [h('span', { class: 'pt-label', text: 'Your surrender' })]));
      root.appendChild(h('h2', { class: 'pt-h3', text: state.burden.trim() ? 'Surrendering: ' + state.burden.trim() : 'What’s yours, what’s theirs, what’s God’s', 'data-focus': true }));
      root.appendChild(board(false));
      var s = stepText();
      root.appendChild(h('div', { class: 'pr-onestep' }, [h('span', { class: 'pt-label', text: 'Your one step' }), h('p', { text: s + (state.when ? ' (' + state.when + ')' : '') })]));
      var pl = prayerLines();
      root.appendChild(h('div', { class: 'pr-prayer' }, [h('span', { class: 'pt-label', text: 'Your prayer' }), lines(pl)]));
      var copyBtn = btn('Copy my prayer', 'pt-btn--ember', function () {
        copyText(pl.join('\n') + '\n\n— TheWrkShop.com Surrender Tool', copyBtn);
      });
      root.appendChild(h('div', { class: 'pt-actions pt-no-print' }, [
        copyBtn,
        btn('Print', 'pt-btn--ghost pr-dark-ghost', function () { window.print(); }),
        btn('Back', 'pt-btn--ghost pr-dark-ghost', function () { state.step = 4; render(true); }),
        btn('Start over', 'pt-btn--ghost pr-dark-ghost', function () { state = { step: 1, burden: '', items: [], pick: null, custom: '', when: '' }; render(true); })
      ]));
      root.appendChild(h('p', { class: 'pt-small pt-muted', text: 'Do the one step. When you pick it back up tonight, come back and pray it again. Jesus prayed the same prayer three times.' }));
      root.appendChild(h('div', { class: 'pr-next pt-no-print' }, [
        h('a', { href: '/prayer/guided-prayer/#path=control', text: 'Pray it now: five-minute guided prayer' }),
        h('a', { class: 'pr-ghost', href: '/prayer/after-you-give-it-to-god/', text: 'Read: What Do I Do After I Give It to God?' })
      ]));
    }
    render(false);
  }

  /* ---------- Guided Prayer ---------- */

  function guidedPrayer(root) {
    var picker = document.getElementById('prPathPick');
    var select = document.getElementById('prPathSelect');
    var current = 0, showAll = false;
    function data() {
      var p = hashParams();
      var key = SEASONS[p.path] ? p.path : 'general';
      return { key: key, d: key === 'general' ? GENERAL : SEASONS[key], pattern: PATTERNS[p.pattern] ? PATTERNS[p.pattern] : null };
    }
    function steps(x) {
      var d = x.d;
      var pray = [lines(d.prayer)];
      if (x.pattern) pray.push(h('p', { class: 'pt-small' }, [h('strong', { text: x.pattern.name + ': ' }), x.pattern.shift]));
      return [
        { title: 'Be still', body: [
          h('p', { text: 'Take a breath. Then another.' }),
          h('p', { text: 'You’re not talking to a judge or an audience. You’re talking to your Father, through Jesus.' }),
          h('p', { text: 'You don’t have to impress Him. You don’t have to feel anything. You just have to come.' })
        ] },
        { title: 'Name it', body: [
          h('p', { text: 'Say what you’re carrying in one sentence. Out loud if you can.' }),
          h('p', { text: 'Not the polished version. The real one.' }),
          h('p', { class: 'pt-small pt-muted', text: 'Nothing you say or think here is recorded. If writing helps, use paper.' })
        ] },
        { title: 'Read', body: [verseBlock(d.verse), h('p', { text: d.line }), h('p', { class: 'pt-small pt-muted', text: 'Read it slowly. Then read the verses around it in your own Bible.' })] },
        { title: 'Pray', body: [h('p', { text: 'Use these words, or your own.' }), h('div', { class: 'pr-prayer' }, pray), h('p', { class: 'pt-small pt-muted', text: 'Silence is welcome. A groan counts (Romans 8:26).' })] },
        { title: 'One faithful step', body: [
          h('p', { text: d.step }),
          h('p', { text: 'When it comes back tonight, pray it again. Coming back isn’t failing.' }),
          h('div', { class: 'pr-next' }, [
            x.d.article ? h('a', { href: x.d.article.href, text: 'Go deeper: ' + x.d.article.title }) : h('a', { href: '/prayer/what-is-biblical-prayer/', text: 'Go deeper: What Is Biblical Prayer?' }),
            h('a', { class: 'pr-ghost', href: '/prayer/surrender/', text: 'Sort it with the Surrender Tool' }),
            h('a', { class: 'pr-ghost', href: '/prayer/7-day/', text: 'Seven days of prayer' })
          ])
        ] }
      ];
    }
    function render(moveFocus) {
      var x = data();
      if (select) select.value = x.key;
      clear(root);
      var all = steps(x);
      root.appendChild(h('div', { class: 'pt-tool-top' }, [
        h('span', { class: 'pt-label', text: showAll ? 'All five parts' : 'Part ' + (current + 1) + ' of 5' }),
        h('span', { class: 'pt-label', text: x.key === 'general' ? '' : x.d.title })
      ]));
      root.appendChild(h('div', { class: 'pt-track' }, [h('div', { style: 'width:' + (showAll ? 100 : (current + 1) * 20) + '%' })]));
      all.forEach(function (s, i) {
        if (!showAll && i !== current) return;
        var sec = h('section', { class: 'pr-gstep' }, [h('h2', { class: 'pt-h3', text: (i + 1) + '. ' + s.title, 'data-focus': i === (showAll ? 0 : current) ? true : null })]);
        s.body.forEach(function (b) { sec.appendChild(b); });
        root.appendChild(sec);
      });
      var a = h('div', { class: 'pt-actions pt-no-print' });
      if (!showAll) {
        if (current > 0) a.appendChild(btn('Back', 'pt-btn--ghost pr-dark-ghost', function () { current -= 1; render(true); }));
        if (current < 4) a.appendChild(btn('Next', 'pt-btn--ember', function () { current += 1; render(true); }));
        else a.appendChild(btn('Begin again', 'pt-btn--ember', function () { current = 0; render(true); }));
      }
      a.appendChild(btn(showAll ? 'One part at a time' : 'Show all parts', 'pt-btn--ghost pr-dark-ghost', function () { showAll = !showAll; current = 0; render(true); }, { 'aria-pressed': showAll ? 'true' : 'false' }));
      root.appendChild(a);
      if (moveFocus) focusHeading(root);
    }
    if (picker && select) {
      picker.hidden = false;
      select.addEventListener('change', function () {
        var p = hashParams();
        var hash = select.value === 'general' ? '' : '#path=' + select.value + (p.pattern ? '&pattern=' + p.pattern : '');
        history.replaceState(null, '', location.pathname + hash);
        current = 0; render(false);
      });
    }
    window.addEventListener('hashchange', function () { current = 0; render(false); });
    render(false);
  }

  /* ---------- Seven Days + printable guides ---------- */

  function sevenDays() {
    var checks = Array.prototype.slice.call(document.querySelectorAll('.pr-check'));
    var status = document.getElementById('prDaysStatus');
    if (!checks.length || !status) return;
    status.hidden = false;
    function update() {
      var n = checks.filter(function (c) { return c.querySelector('input').checked; }).length;
      status.textContent = n + ' of 7 prayed during this visit. No streak required.';
    }
    checks.forEach(function (c) {
      c.hidden = false;
      var i = c.querySelector('input');
      i.checked = false; // undo any browser form restore
      i.addEventListener('change', update);
    });
    update();
    var id = (location.hash || '').slice(1);
    if (/^day-[1-7]$/.test(id)) { var d = document.getElementById(id); if (d) { d.open = true; d.scrollIntoView(); } }
  }

  function printButton(id) {
    var b = document.getElementById(id);
    if (!b) return;
    b.hidden = false;
    b.addEventListener('click', function () { window.print(); });
  }

  // Open every collapsed section while printing, then put them back.
  var priorOpen = [];
  window.addEventListener('beforeprint', function () {
    priorOpen = Array.prototype.map.call(document.querySelectorAll('details'), function (d) { return [d, d.open]; });
    priorOpen.forEach(function (p) { p[0].open = true; });
  });
  window.addEventListener('afterprint', function () { priorOpen.forEach(function (p) { p[0].open = p[1]; }); });

  function openSessionFromHash() {
    var id = (location.hash || '').slice(1);
    if (/^session-[1-6]$/.test(id)) { var d = document.getElementById(id); if (d) { d.open = true; d.scrollIntoView(); } }
  }

  /* ---------- start ---------- */

  function start() {
    var f = document.getElementById('prFinder'); if (f) patternFinder(f);
    var s = document.getElementById('prSurrender'); if (s) surrenderTool(s);
    var g = document.getElementById('prGuided'); if (g) guidedPrayer(g);
    sevenDays();
    printButton('prDaysPrint');
    printButton('prGuidePrint');
    openSessionFromHash();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
