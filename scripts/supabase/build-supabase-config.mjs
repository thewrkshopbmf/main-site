import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const templatePath = path.join(root, 'scripts', 'supabase', 'supabaseConfig.template.js');
const outputPath = path.join(root, 'scripts', 'supabase', 'supabaseConfig.js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY.');
  process.exit(1);
}

const template = fs.readFileSync(templatePath, 'utf8');

const output = template
  .replace('__SUPABASE_URL__', supabaseUrl)
  .replace('__SUPABASE_ANON_KEY__', supabaseAnonKey);

fs.writeFileSync(outputPath, output, 'utf8');

console.log('Generated scripts/supabase/supabaseConfig.js');