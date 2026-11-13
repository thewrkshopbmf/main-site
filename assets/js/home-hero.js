// Homepage hero: keeps the waterline exactly under the headline's first line, adds gentle
// pointer parallax, and draws the light motes rising through the water. Everything here is
// an enhancement: the CSS already places the waterline and the page works without it.
(() => {
  const hero = document.getElementById('hh');
  if (!hero) return;
  const l1 = hero.querySelector('.hh-l1');
  const deep = hero.querySelector('.hh-deep');
  const canvas = hero.querySelector('.hh-motes');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  // ---- Waterline: centred in the gap between the two lines of the headline ----
  // Uses the real ink of the letters (the "g" in "begins" above, the tops of "beneath" below),
  // so the wave never cuts into either line at any screen size.
  const l2 = hero.querySelector('.hh-l2');
  const meter = document.createElement('canvas').getContext('2d');
  function placeWaterline() {
    if (!l1) return;
    // Measure the untransformed layout (the lines slide in on load, so their boxes move)
    const h1 = l1.parentElement;
    const heroTop = hero.getBoundingClientRect().top;
    const top = h1.getBoundingClientRect().top - heroTop;
    const cs = getComputedStyle(l1);
    const fs = parseFloat(cs.fontSize) || 60;
    let wl = top + l1.offsetHeight + fs * 0.06;   // fallback: just under the first line
    if (l2 && meter) {
      meter.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      const m1 = meter.measureText(l1.textContent);
      const m2 = meter.measureText(l2.textContent);
      if (m1.fontBoundingBoxAscent && m1.actualBoundingBoxDescent != null) {
        const lh = parseFloat(cs.lineHeight) || fs * 1.04;
        const lead = (lh - (m1.fontBoundingBoxAscent + m1.fontBoundingBoxDescent)) / 2;
        const base1 = top + lead + m1.fontBoundingBoxAscent;
        const base2 = top + l1.offsetHeight + (parseFloat(getComputedStyle(l2).paddingTop) || 0) + lead + m1.fontBoundingBoxAscent;
        const inkBottom = base1 + m1.actualBoundingBoxDescent;
        const inkTop = base2 - m2.actualBoundingBoxAscent;
        // The drawn surface line rides about 2px above --wl
        wl = (inkBottom + inkTop) / 2 + 2;
      }
    }
    hero.style.setProperty('--wl', Math.round(wl) + 'px');
  }
  // ---- Keep "The work begins" on one line inside the margins, whatever font the phone uses ----
  function fitHeadline() {
    if (!l1) return;
    const h1 = l1.parentElement;
    h1.style.fontSize = '';
    const avail = h1.clientWidth;
    const range = document.createRange();
    range.selectNodeContents(l1);
    const used = range.getBoundingClientRect().width;
    if (avail > 0 && used > avail) {
      const fs = parseFloat(getComputedStyle(h1).fontSize) || 48;
      h1.style.fontSize = Math.floor(fs * (avail / used) * 0.98 * 10) / 10 + 'px';
    }
  }
  function layout() { fitHeadline(); placeWaterline(); }
  layout();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
  let lastW = 0;
  const onResize = () => { const w = hero.clientWidth; if (w !== lastW) { lastW = w; layout(); } else placeWaterline(); };
  if ('ResizeObserver' in window) new ResizeObserver(onResize).observe(hero);
  else window.addEventListener('resize', layout);

  // ---- Pointer parallax (mouse/trackpad only) ----
  if (window.matchMedia('(pointer: fine)').matches && !reduce.matches) {
    let raf = 0;
    hero.addEventListener('pointermove', (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const b = hero.getBoundingClientRect();
        hero.style.setProperty('--px', (((e.clientX - b.left) / b.width) * 2 - 1).toFixed(3));
        hero.style.setProperty('--py', (((e.clientY - b.top) / b.height) * 2 - 1).toFixed(3));
      });
    });
    hero.addEventListener('pointerleave', () => { hero.style.setProperty('--px', 0); hero.style.setProperty('--py', 0); });
  }

  // ---- Light motes rising through the water, and glints on the surface under the sun ----
  if (!canvas || !deep || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0, dpr = 1, motes = [], running = false, visible = true, last = 0;

  let sunPos = 0;
  function sunX() { return sunPos; }
  function measureSun() {
    // The light rays are anchored at --sun-x in CSS; read their position once per resize
    const probe = hero.querySelector('.hh-rays');
    sunPos = probe ? probe.getBoundingClientRect().left - hero.getBoundingClientRect().left : w * 0.7;
  }

  function size() {
    const b = deep.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = Math.max(1, b.width); h = Math.max(1, b.height);
    measureSun();
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round(Math.min(70, Math.max(24, w * h / 16000)));
    motes = Array.from({ length: count }, () => spawn(true));
  }

  function spawn(anywhere) {
    const sx = sunX();
    const nearSun = Math.random() < 0.55;
    return {
      x: nearSun ? sx + (Math.random() - 0.5) * w * 0.45 : Math.random() * w,
      y: anywhere ? Math.random() * h : h + Math.random() * 40,
      r: 0.6 + Math.random() * 1.9,
      v: 6 + Math.random() * 16,           // px per second upward
      a: 0.25 + Math.random() * 0.55,
      ph: Math.random() * Math.PI * 2,
      sw: 6 + Math.random() * 16           // sideways sway
    };
  }

  function draw(t, dt) {
    ctx.clearRect(0, 0, w, h);
    // Motes
    for (const m of motes) {
      if (dt) { m.y -= m.v * dt; if (m.y < -6) Object.assign(m, spawn(false)); }
      const x = m.x + Math.sin(t / 1000 * 0.6 + m.ph) * m.sw;
      const depth = Math.min(1, Math.max(0, m.y / h));
      const fade = Math.min(1, m.y / 60) * (1 - depth * 0.55);
      const g = ctx.createRadialGradient(x, m.y, 0, x, m.y, m.r * 4);
      g.addColorStop(0, `rgba(246, 226, 180, ${m.a * fade})`);
      g.addColorStop(1, 'rgba(246, 226, 180, 0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, m.y, m.r * 4, 0, Math.PI * 2); ctx.fill();
    }
    // Glints: short flickering dashes just under the surface beneath the sun
    const sx = sunX();
    for (let i = 0; i < 14; i++) {
      const s = Math.sin(t / 1000 * (1.3 + i * 0.17) + i * 2.1);
      if (s < 0.35) continue;
      const gx = sx + Math.sin(i * 12.9898) * w * 0.16;
      const gy = 4 + ((i * 7) % 26);
      ctx.strokeStyle = `rgba(255, 240, 205, ${(s - 0.35) * 0.9})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(gx - 9 - i % 3 * 4, gy); ctx.lineTo(gx + 9 + i % 4 * 3, gy); ctx.stroke();
    }
  }

  function frame(t) {
    if (!running) return;
    const dt = last ? Math.min(0.05, (t - last) / 1000) : 0;
    last = t;
    draw(t, dt);
    requestAnimationFrame(frame);
  }
  function start() { if (running || reduce.matches || !visible || document.hidden) return; running = true; last = 0; requestAnimationFrame(frame); }
  function stop() { running = false; }

  size();
  draw(0, 0);
  if ('ResizeObserver' in window) new ResizeObserver(() => { size(); draw(performance.now(), 0); }).observe(deep);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop(); }).observe(hero);
  }
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  reduce.addEventListener?.('change', () => (reduce.matches ? stop() : start()));
  start();
})();
