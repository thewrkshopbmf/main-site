  // Generate pages
  const tpl = await fs.readFile(TPL_PATH, 'utf-8');
  for (let i=0; i<visible.length; i++){
    const e = visible[i];
    const prev = visible[i-1];
    const next = visible[i+1];

    // Build BODY_HTML from structured fields
    const bodyParts = [];

    if (e.kicker) bodyParts.push(`<p class="kicker">${e.kicker}</p>`);
    if (Array.isArray(e.intro)) bodyParts.push(e.intro.map(p => `<p>${p}</p>`).join('\n'));

    if (e.one_minute_win) {
      bodyParts.push(`
        <section class="section callout">
          <h2 class="h2">One-Minute Win</h2>
          <p>${e.one_minute_win}</p>
        </section>`);
    }

    if (Array.isArray(e.picture_this) && e.picture_this.length) {
      bodyParts.push(`
        <section class="section">
          <h2 class="h2">Picture This</h2>
          ${e.picture_this.map(p => `<p>${p}</p>`).join('\n')}
        </section>`);
    }

    if (Array.isArray(e.scriptures) && e.scriptures.length) {
      bodyParts.push(`
        <section class="section">
          <h2 class="h2">Scriptures</h2>
          <div class="kv">
            ${e.scriptures.map(s => `
              <div>
                <div class="k">${s.ref}</div>
                <div class="v">${s.text}</div>
                ${s.insight ? `<p><em>${s.insight}</em></p>` : ''}
                ${s.gem ? `<p><strong>${s.gem}</strong></p>` : ''}
              </div>`).join('\n')}
          </div>
        </section>`);
    }

    if (Array.isArray(e.ways_to_live) && e.ways_to_live.length) {
      bodyParts.push(`
        <section class="section">
          <h2 class="h2">Ways to Live</h2>
          <ul class="list">
            ${e.ways_to_live.map(w => `<li><strong>${w.title}:</strong> ${w.body}</li>`).join('\n')}
          </ul>
        </section>`);
    }

    if (Array.isArray(e.insights) && e.insights.length) {
      bodyParts.push(`
        <section class="section callout">
          <h2 class="h2">Insights</h2>
          ${e.insights.map(p => `<p>${p}</p>`).join('\n')}
        </section>`);
    }

    if (Array.isArray(e.reflective_questions) && e.reflective_questions.length) {
      bodyParts.push(`
        <section class="section">
          <h2 class="h2">Reflective Questions</h2>
          <ul class="list">
            ${e.reflective_questions.map(q => `<li>${q}</li>`).join('\n')}
          </ul>
        </section>`);
    }

    if (e.action_step) {
      bodyParts.push(`
        <section class="section">
          <h2 class="h2">Action Step</h2>
          <p>${e.action_step}</p>
        </section>`);
    }

    if (e.bonus_title || e.bonus_body || e.bonus_list) {
      bodyParts.push(`
        <section class="section">
          <h2 class="h2">${e.bonus_title || 'Bonus'}</h2>
          ${Array.isArray(e.bonus_body) ? e.bonus_body.map(p => `<p>${p}</p>`).join('\n') : ''}
          ${Array.isArray(e.bonus_list) ? `<ul class="list">${e.bonus_list.map(b => `<li>${b}</li>`).join('\n')}</ul>` : ''}
        </section>`);
    }

    if (e.prayer) {
      bodyParts.push(`
        <section class="section">
          <h2 class="h2">Prayer</h2>
          <p>${e.prayer}</p>
        </section>`);
    }

    if (e.declaration) {
      bodyParts.push(`
        <section class="section callout">
          <h2 class="h2">Declaration</h2>
          <p>${e.declaration}</p>
        </section>`);
    }

    if (e.weekly_challenge) {
      bodyParts.push(`
        <section class="section">
          <h2 class="h2">Weekly Challenge</h2>
          <p>${e.weekly_challenge}</p>
        </section>`);
    }

    if (e.invitation) {
      bodyParts.push(`<p class="section">${e.invitation}</p>`);
    }

    if (e.gem_to_carry) {
      bodyParts.push(`
        <section class="section callout">
          <h2 class="h2">Gem to Carry</h2>
          <p>${e.gem_to_carry}</p>
        </section>`);
    }

    const bodyHTML = bodyParts.filter(Boolean).join('\n');

    const html = fill(tpl, {
      TITLE: e.title || 'Untitled',
      CATEGORY: e.category || 'Article',
      DATE: e.date,
      HUMAN_DATE: toHuman(e.date),
      EXCERPT: e.excerpt || '',
      AUTHOR: e.author || '',
      READING_MIN: String(e.reading_minutes || 0),
      BODY_HTML: bodyHTML,
      PREV_HREF: prev ? `./${fileNameFor(prev)}` : '#',
      NEXT_HREF: next ? `./${fileNameFor(next)}` : '#'
    });

    await fs.writeFile(path.join(BLOG_DIR, fileNameFor(e)), html, 'utf-8');
  }
