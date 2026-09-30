// Local reviews-only acceptance captures. No real customers or Shopify preview.
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
import { renderFixture } from './render-fixture.mjs';
const root = resolve(import.meta.dirname, '..');
const fixture = JSON.parse(await readFile(resolve(root, 'tests/fixtures/reviews.json'), 'utf8'));
const report = { renderer: 'Local LiquidJS contract only; review fixtures explicitly internal', checks: [], failures: [], screenshots: [] };
const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://127.0.0.1');
    if (url.pathname.startsWith('/assets/')) {
      const path = resolve(root, '.' + url.pathname);
      if (!path.startsWith(root + '/assets/')) throw new Error('Invalid asset');
      response.writeHead(200, { 'Content-Type': path.endsWith('.js') ? 'text/javascript' : path.endsWith('.css') ? 'text/css' : 'image/svg+xml' });
      response.end(await readFile(path));
      return;
    }
    const internal = url.searchParams.get('fixture') === '1';
    let html = await renderFixture({ surface: 'pdp', locale: url.searchParams.get('locale'), reviewFeed: internal ? fixture.feed : null });
    if (internal) html = html.replace('<body ', '<body data-internal-fixture="true" ').replace('<main id="MainContent" tabindex="-1">', '<main id="MainContent" tabindex="-1"><p>INTERNAL FIXTURE — NOT CUSTOMER REVIEWS</p>');
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end(html);
  } catch (error) { response.writeHead(500); response.end(String(error)); }
});
await new Promise(done => server.listen(0, '127.0.0.1', done));
const browser = await chromium.launch({ headless: true, executablePath: process.env.BTS_CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
report.browser = await browser.version();
await mkdir(resolve(root, 'test-results/production-layer'), { recursive: true });
try {
  for (const viewport of [{ width: 375, height: 667 }, { width: 1024, height: 768 }]) {
    for (const locale of ['en', 'ar']) for (const scale of [1, 2]) for (const internal of [false, true]) {
      const label = `reviews-${locale}-${viewport.width}x${viewport.height}-text-${scale * 100}-${internal ? 'internal-fixture' : 'empty'}`;
      const context = await browser.newContext({ viewport });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(String(error)));
      try {
        await page.goto(`http://127.0.0.1:${server.address().port}/?locale=${locale}&fixture=${Number(internal)}`);
        await page.evaluate(scale => { document.documentElement.style.fontSize = `${scale * 100}%`; }, scale);
        if(!internal) { assert.equal(await page.locator('.bts-reviews').count(),0); report.checks.push(label); continue; }
        await page.locator('.bts-reviews').scrollIntoViewIfNeeded();
        assert.equal(await page.locator('.bts-reviews__item').count(), internal ? 5 : 0);
        assert.equal(await page.locator('.bts-reviews__empty').count(), 0);
        if (internal) assert.match(await page.locator('.bts-reviews').textContent(), /INTERNAL FIXTURE/);
        else assert.doesNotMatch(await page.locator('.bts-reviews').textContent(), /out of 5|من 5|Verified purchase|شراء مؤكّد/);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        const contained = await page.locator('.bts-reviews').evaluate(root => [...root.querySelectorAll('p,h2,h3')].every(node => {
          const box = node.getBoundingClientRect();
          const parent = (node.closest('article') || root).getBoundingClientRect();
          return box.top >= parent.top - 1 && box.bottom <= parent.bottom + 1 && node.scrollWidth <= node.clientWidth;
        }));
        assert.ok(contained, 'Review text fully contained in growing document flow');
        const axe = await new AxeBuilder({ page }).include('.bts-reviews').withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
        assert.deepEqual(axe.violations, []);
        assert.deepEqual(errors, []);
        const path = 'test-results/production-layer/' + label + '.png';
        await page.locator('.bts-reviews').evaluate(node => scrollTo(0, node.getBoundingClientRect().top + scrollY - 72));
        await page.screenshot({ path: resolve(root, path), fullPage: false });
        report.screenshots.push(path); report.checks.push(label);
      } catch (error) { report.failures.push({ label, error: String(error) }); }
      finally { await context.close(); }
    }
  }
} finally {
  await browser.close(); await new Promise(done => server.close(done));
  await writeFile(resolve(root, 'test-results/production-layer/browser-report.json'), JSON.stringify(report, null, 2));
}
console.log(`${report.checks.length} reviews browser checks passed; ${report.failures.length} failed.`);
if (report.failures.length) { console.error(report.failures); process.exitCode = 1; }
