import { readdir, readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '..');
const pattern = /\b(climate|humidity|humid|pollution|environmental)\b|المناخ|الرطوبة|التلوث/giu;
const fallbackCheck = spawnSync(process.execPath, ['scripts/build-review-fallback.mjs','--check'], {cwd:root,encoding:'utf8'});
if(fallbackCheck.status !== 0) throw new Error(fallbackCheck.stderr || 'Review fallback parity failed');
let errors = 0;
for (const dir of ['sections', 'snippets', 'locales']) {
  for (const file of await readdir(resolve(root, dir))) {
    if (!/\.(liquid|json)$/.test(file)) continue;
    if(dir === 'snippets' && /^bts-review-(reset|clarity|barrier|defense|routine)-fields\.liquid$/.test(file)) continue;
    const text = await readFile(resolve(root, dir, file), 'utf8');
    const count = [...text.matchAll(pattern)].length;
    if (count) { console.error(dir + '/' + file + ': climate vocabulary exceeds minimal-foundation budget (0)'); errors++; }
  }
}
if (errors) process.exitCode = 1;
else console.log('Minimal-foundation climate budget passed (zero additional climate copy; generated fallback retains exact approved label copy).');
