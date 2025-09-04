import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const DIR = path.join(ROOT, 'content', 'blog');

let errors = 0;
let files = [];
try { files = (await fs.readdir(DIR)).filter(f => f.endsWith('.json')); } catch {}
for (const f of files){
  const raw = await fs.readFile(path.join(DIR, f),'utf-8');
  const j = JSON.parse(raw);
  const m = f.match(/^(\d{4}-\d{2}-\d{2})_/);
  const fnameDate = m ? m[1] : null;
  const inner = j.date;
  if (!fnameDate) { console.log(`❌ ${f}: filename missing YYYY-MM-DD`); errors++; continue; }
  if (!inner) { console.log(`❌ ${f}: missing "date"`); errors++; continue; }
  if (fnameDate !== inner) { console.log(`❌ ${f}: filename ${fnameDate} ≠ JSON ${inner}`); errors++; }
}
if (errors){ console.log(`Found ${errors} issue(s) in blog dates.`); process.exit(1); }
else console.log('✅ Blog dates OK.');
