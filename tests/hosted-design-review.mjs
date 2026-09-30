// Actual Shopify-hosted evidence for the placeholder-first design review.
// No fixture server, store mutation, catalog publication or checkout is used.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdir, writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
const base = process.argv[2];
assert.match(base || '', /^https:\/\/[^/]+\.shopifypreview\.com\/?$/);
const interactionsOnly = process.argv.includes('--interactions-only');
const directory = 'test-results/v12-shopify-native/design-review' + (interactionsOnly ? '-supplement' : '');
await mkdir(directory, {recursive: true});
const report = {scope: interactionsOnly ? 'settled interactions and sticky PDP' : 'surface matrix and interactions', base, checkedAt: new Date().toISOString(), sourceCommit: execFileSync('git', ['rev-parse', 'HEAD'], {encoding: 'utf8'}).trim(), captures: [], interactions: [], localeProbes: [], errors: [], commerceRequests: []};
const browser = await chromium.launch({executablePath: process.env.BTS_CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const context = await browser.newContext();
context.on('page', page => page.on('pageerror', error => report.errors.push(error.message)));
context.on('request', request => { if (/\/cart\/(?:add|change|update|clear)(?:\.js)?(?:\?|$)|\/checkout(?:\?|$)/.test(request.url())) report.commerceRequests.push(request.url()); });
const page = await context.newPage();
const capture = async (name, fullPage = false) => {
  const path = `${directory}/${name}.png`; await page.screenshot({path, fullPage}); return path;
};
try {
  await page.setViewportSize({width:1440,height:900});
  await page.goto(base,{waitUntil:'networkidle'});
  const hideBar=page.frameLocator('#PBarNextFrame').getByRole('button',{name:'Hide bar',exact:true});
  if (await hideBar.isVisible()) {await hideBar.click();report.previewToolbarHidden=true;}
  const surfaces = [['home', '/'], ['collection', '/collections/all'], ...['daily-reset-cleanser', 'clarity-serum', 'daily-barrier-moisturizing-cream', 'daily-defense-sunscreen-spf-50'].map(handle => [handle, `/search?view=product&q=${handle}`])];
  for (const viewport of [{width:375,height:667},{width:390,height:844},{width:1024,height:600},{width:1440,height:900}]) {
    await page.setViewportSize(viewport);
    for (const [surface, path] of (interactionsOnly ? [] : surfaces)) {
      const response = await page.goto(new URL(path, base).href, {waitUntil: 'networkidle', timeout: 60000});
      assert.equal(response.status(), 200);
      await page.waitForFunction(() => Boolean(window.BTS?.adapter));
      assert.equal(await page.evaluate(() => window.Shopify?.theme?.id), 166903251202);
      assert.equal(await page.evaluate(() => window.Shopify?.theme?.role), 'unpublished');
      await page.locator('footer').scrollIntoViewIfNeeded();
      await page.locator('footer img').evaluate(node => node.decode());
      await page.evaluate(() => scrollTo(0, 0));
      const geometry = await page.evaluate(() => ({width: innerWidth, documentWidth: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight, lang: document.documentElement.lang, direction: document.documentElement.dir, products: [...document.querySelectorAll('.pf__name')].map(node => ({text: node.innerText, y: node.getBoundingClientRect().y})), adds: [...document.querySelectorAll('[data-bts-add]')].map(node => ({handle: node.dataset.btsAdd, y: node.getBoundingClientRect().y, disabled: node.disabled}))}));
      assert.ok(geometry.documentWidth <= viewport.width + 1, `${surface} overflow`);
      const stem = `${surface}-en-${viewport.width}x${viewport.height}`;
      report.captures.push({surface, viewport, url: page.url(), geometry, fold: await capture(stem+'-fold'), full: await capture(stem+'-full', true)});
    }
  }
  await page.setViewportSize({width:1440,height:900});
  await page.goto(new URL('/', base).href, {waitUntil:'networkidle'});
  const previewBar = page.frameLocator('#PBarNextFrame').getByRole('button', {name:'Hide bar', exact:true});
  if (await previewBar.isVisible()) {
    await previewBar.click();
    report.previewToolbarHidden = true;
  }
  await page.setViewportSize({width:390,height:844});
  await page.locator('.bts-shelf [data-part="turn"]').first().click();
  assert.equal(await page.locator('.bts-shelf bts-product-face').first().getAttribute('data-side'), 'back');
  await page.waitForTimeout(400);
  report.interactions.push({action:'mobile back face', screenshot:await capture('mobile-back')});
  for (const id of ['bts-menu', 'bts-routine', 'bts-drawer']) {
    const opener = page.locator(`[data-bts-open="${id}"]:visible`).first();
    await opener.click(); assert.equal(await page.locator(`#${id}`).evaluate(node => node.open), true);
    await page.locator(`#${id}`).evaluate(node => Promise.all(node.getAnimations().map(animation => animation.finished)));
    const settled = await page.locator(`#${id}`).evaluate(node => ({opacity:getComputedStyle(node).opacity,translate:getComputedStyle(node).translate,activeAnimations:node.getAnimations().filter(animation=>animation.playState==='running').length}));
    assert.equal(settled.opacity, '1'); assert.equal(settled.activeAnimations, 0);
    report.interactions.push({action:id, settled, screenshot:await capture(id)});
    await page.keyboard.press('Escape'); assert.equal(await page.locator(`#${id}`).evaluate(node => node.open), false);
    assert.equal(await opener.evaluate(node => document.activeElement === node), true, id+' focus return');
  }
  await page.goto(new URL('/search?view=product&q=daily-reset-cleanser', base).href, {waitUntil:'networkidle'});
  const inci = page.locator('#inci-daily-reset-cleanser'); await inci.scrollIntoViewIfNeeded(); await inci.locator('summary').click();
  assert.equal(await inci.evaluate(node => node.open), true);
  report.interactions.push({action:'native INCI disclosure and scrolled PDP', screenshot:await capture('mobile-inci')});
  await page.locator('[data-bts-primary-add]').evaluate(node=>scrollBy(0,Math.max(0,node.getBoundingClientRect().bottom+24)));
  await page.waitForFunction(()=>document.querySelector('[data-bts-primary-add]').getBoundingClientRect().bottom<0);
  const sticky = page.locator('[data-bts-sticky-add]');
  assert.equal(await sticky.isHidden(), true, 'review sticky stays hidden with disabled primary Add');
  assert.equal(await sticky.evaluate(node=>node.inert), true);
  assert.equal(await sticky.locator('[data-bts-add]').isDisabled(), true);
  const primaryPassed = await page.locator('[data-bts-primary-add]').evaluate(node=>node.getBoundingClientRect().bottom<0);
  assert.equal(primaryPassed, true);
  report.interactions.push({action:'scrolled mobile PDP: review sticky correctly hidden with disabled primary Add', screenshot:await capture('mobile-scrolled-pdp'), primaryPassed, stickyHidden:true, stickyInert:true});
  await page.goto(new URL('/', base).href, {waitUntil:'networkidle'});
  await page.evaluate(() => {document.documentElement.style.fontSize='200%';});
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth<=innerWidth+1));
  report.interactions.push({action:'mobile 200% root text size', screenshot:await capture('mobile-text-200',true)});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto(new URL('/', base).href, {waitUntil:'networkidle'});
  await page.locator('.bts-shelf [data-part="turn"]').first().click();
  report.interactions.push({action:'mobile reduced motion back', screenshot:await capture('mobile-reduced-back')});
  for (const path of ['/ar','/ar/collections/all']) {
    const response=await page.goto(new URL(path,base).href,{waitUntil:'domcontentloaded'});
    report.localeProbes.push({path,status:response.status(),url:page.url(),lang:await page.locator('html').getAttribute('lang'),direction:await page.locator('html').getAttribute('dir'),screenshot:await capture(path==='/ar'?'arabic-route':'arabic-collection-route')});
  }
  assert.deepEqual(report.errors, []); assert.deepEqual(report.commerceRequests, []);
  report.passed = true;
} catch (error) { report.passed=false;report.failure=error.stack;throw error; }
finally { await writeFile(`${directory}/index.json`,JSON.stringify(report,null,2));await browser.close(); }
console.log(JSON.stringify(report,null,2));
