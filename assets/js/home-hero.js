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

  // ---- Waterline: just below the first line of the headline ----
  function placeWaterline() {
    if (!l1) return;
    // Measure the untransformed layout (the first line slides in on load, so its box moves)
    const h1 = l1.parentElement;
    const h = hero.getBoundingClientRect();
    const top = h1.getBoundingClientRect().top - h.top;
    const fs = parseFloat(getComputedStyle(l1).fontSize) || 60;
    // Just under the first line, so descenders ("g") stay above the water
    const wl = Math.round(top + l1.offsetHeight + fs * 0.06);
    hero.style.setProperty('--wl', wl + 'px');
  }
  placeWaterline();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(placeWaterline);
  if ('ResizeObserver' in window) new ResizeObserver(placeWaterline).observe(hero);
  else window.addEventListener('resize', placeWaterline);

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
