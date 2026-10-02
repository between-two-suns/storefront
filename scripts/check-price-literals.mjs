import { readdir, readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { resolve, extname } from 'node:path';
const root = resolve(import.meta.dirname, '..');
const config = JSON.parse(await readFile(resolve(root, 'data/prototype/config.json'), 'utf8'));
const values = new Set(Object.values(config.scenarios).flatMap(s => [...Object.values(s.prices), s.routine.list, s.routine.price, s.routine.save]));
const escaped = [...values].map(n => String(n).split('').join('[,.]?'));
const pattern = new RegExp('(?<![\\w#])(?:' + escaped.join('|') + ')(?![\\w])', 'g');
const fallbackCheck = spawnSync(process.execPath, ['scripts/build-review-fallback.mjs','--check'], {cwd:root,encoding:'utf8'});
if(fallbackCheck.status !== 0) throw new Error(fallbackCheck.stderr || 'Review fallback parity failed');
let errors = 0;
async function scan(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = resolve(dir, entry.name);
    if (entry.isDirectory()) await scan(file);
    else if (['.liquid', '.json', '.css', '.js', '.mjs'].includes(extname(file))) {
      if(file === resolve(root,'snippets/bts-review-price-value.liquid')) continue;
      const text = await readFile(file, 'utf8');
      for (const match of text.matchAll(pattern)) { console.error(file + ': forbidden scenario literal ' + match[0]); errors++; }
    }
  }
}
for (const dir of ['assets','sections','snippets','templates','locales','layout','config']) await scan(resolve(root, dir));
if (errors) process.exitCode = 1;
else console.log('Price literal check passed.');
