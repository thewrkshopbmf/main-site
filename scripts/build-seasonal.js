// Out of season, seasonal pages (e.g. Easter.html) redirect to the homepage and leave the sitemap.
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { todayCentralISO } from './shared/render-content.js';
import { SEASONAL_PAGES, isInSeason } from './shared/seasonal.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REDIRECTS = path.join(ROOT, '_redirects');

const today = todayCentralISO();
let lines = [];
try { lines = (await fs.readFile(REDIRECTS, 'utf-8')).split('\n').filter(Boolean); } catch {}

const isSeasonalRule = (l) => SEASONAL_PAGES.some(p => l.split(/\s+/)[0] === p.path);
lines = lines.filter(l => !isSeasonalRule(l));

const off = SEASONAL_PAGES.filter(p => !isInSeason(p, today));
const rules = off.map(p => `${p.path}   /   302!`);

// Rules go ahead of the catch-all "200" passthroughs so they apply.
const isPassthrough = (l) => /\s200!?$/.test(l);
const ordered = [...lines.filter(l => !isPassthrough(l)), ...rules, ...lines.filter(isPassthrough)];
await fs.writeFile(REDIRECTS, ordered.join('\n') + '\n', 'utf-8');

for (const p of SEASONAL_PAGES) {
  console.log(`${p.file}: ${isInSeason(p, today) ? 'in season (live)' : 'out of season (redirects home)'} on ${today}`);
}
