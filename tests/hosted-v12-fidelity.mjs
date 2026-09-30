// Read-only acceptance of the recovered Route B on Shopify, never a fixture server.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';

const base = process.argv[2];
assert.match(base || '', /^https:\/\/[^/]+\.shopifypreview\.com\/?$/);
const directory = 'test-results/v12-recovery/fidelity';
await mkdir(directory, {recursive:true});
const report = {base, sourceCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(), checkedAt:new Date().toISOString(), cells:[], errors:[], commerceRequests:[]};
const browser = await chromium.launch({channel:'chrome'});
try {
  const context = await browser.newContext();
  context.on('page', page => page.on('pageerror', error => report.errors.push(error.message)));
  context.on('request', request => {
    if (/\/cart\/(?:add|change|update|clear)(?:\.js)?(?:\?|$)|\/checkout(?:\?|$)/.test(request.url())) report.commerceRequests.push(request.url());
  });
  const page = await context.newPage();
  for (const viewport of [{width:375,height:667},{width:390,height:844},{width:1024,height:600},{width:1440,height:900}]) {
    for (const scale of [1,2]) for (const reducedMotion of ['no-preference','reduce']) {
      await page.setViewportSize(viewport);
      await page.emulateMedia({reducedMotion});
      const response = await page.goto(base,{waitUntil:'networkidle'});
      assert.equal(response.status(),200);
      assert.equal(await page.evaluate(() => window.Shopify?.theme?.id),166903251202);
      assert.equal(await page.evaluate(() => window.Shopify?.theme?.role),'unpublished');
      await page.waitForFunction(() => window.BTS?.adapter && [...document.querySelectorAll('.bts-shelf bts-product-face')].every(n => n.dataset.ready));
      await page.evaluate(scale => document.documentElement.style.fontSize = `${scale * 100}%`,scale);
      await page.waitForTimeout(350);
      const measure = () => page.evaluate(() => {
        const box = n => {const r=n.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,bottom:r.bottom};};
        return {width:document.documentElement.scrollWidth,brand:box(document.querySelector('.bts-home__brand img')),footer:box(document.querySelector('.bts-footer__wordmark')),bandOfferVisible:document.querySelector('[data-routine-offer="band"]').checkVisibility(),stripOfferVisible:document.querySelector('[data-routine-offer="strip"]').checkVisibility(),faces:[...document.querySelectorAll('.bts-shelf bts-product-face')].map(n => ({handle:n.dataset.key,stage:box(n.querySelector('.pf__stage')),info:box(n.querySelector('.pf__info')),buy:box(n.querySelector('.pf__buy')),turnVisible:n.querySelector('[data-part="turn"]').checkVisibility(),backOverflow:n.dataset.backOverflow,infoOverflow:n.dataset.infoOverflow,disabled:n.querySelector('[data-bts-add]').disabled}))};
      });
      const before = await measure();
      assert.ok(before.width <= viewport.width+1,'page overflow');
      assert.ok(before.brand.width > before.footer.width,'Home mark dominates footer');
      if (viewport.width < 990 && viewport.height >= 667) assert.ok(before.brand.width >= Math.min(200,viewport.width*.52)-1,'approved mobile wordmark scale');
      assert.equal(before.bandOfferVisible,viewport.width>=990);
      assert.equal(before.stripOfferVisible,viewport.width<990);
      assert.equal(before.faces.length,4);
      for (const face of before.faces) {
        assert.ok(face.stage.height>=200,'stage floor');
        assert.ok(face.buy.y>=face.info.bottom-1,'commerce below information');
        assert.ok(face.turnVisible && face.disabled,'signature available, commerce disabled');
        assert.equal(face.backOverflow,'false');assert.equal(face.infoOverflow,'false');
      }
      if (viewport.width<990 && scale===1) assert.ok(before.faces[0].buy.bottom<=viewport.height,'initial phone commerce inside fold');
      const stem=`home-${viewport.width}x${viewport.height}-text-${scale*100}-${reducedMotion}`;
      const front=`${directory}/${stem}-front.png`;
      await page.screenshot({path:front});
      const full=`${directory}/${stem}-full.png`;
      if (scale===1 && reducedMotion==='no-preference') await page.screenshot({path:full,fullPage:true});
      // Use each component's public turn method so offscreen phone faces are covered too.
      await page.evaluate(() => document.querySelectorAll('.bts-shelf bts-product-face').forEach(n => n.turn('back')));
      await page.waitForTimeout(350);
      const after=await measure();
      assert.deepEqual(after.faces.map(n=>n.buy),before.faces.map(n=>n.buy),'turn preserves all commerce geometry');
      const seeds=await Promise.all(after.faces.map(async face=>JSON.parse(await readFile(`data/content/products/${face.handle}.json`,'utf8'))));
      const descriptions=await page.locator('.bts-shelf .pf__description').allTextContents();
      assert.deepEqual(descriptions.map(n=>n.trim()),seeds.map(n=>n.translations.back_description.en),'complete approved back descriptions');
      const back=`${directory}/${stem}-back.png`;await page.screenshot({path:back});
      await page.evaluate(() => document.querySelectorAll('.bts-shelf bts-product-face').forEach(n => n.turn('front')));
      await page.waitForTimeout(350);
      const offer=page.locator(viewport.width>=990?'[data-routine-offer="band"] a':'[data-routine-offer="strip"] a');
      await offer.click();assert.equal(await page.locator('#bts-routine').evaluate(n=>n.open),true);
      await page.keyboard.press('Escape');assert.equal(await offer.evaluate(n=>document.activeElement===n),true);
      assert.equal((await page.evaluate(()=>window.BTS.adapter.get())).count,0);
      report.cells.push({viewport,scale,reducedMotion,before,after,front,back,...(scale===1&&reducedMotion==='no-preference'?{full}:{})});
    }
  }
  assert.deepEqual(report.errors,[]);assert.deepEqual(report.commerceRequests,[]);
  report.passed=true;
} catch(error) {report.passed=false;report.failure=error.stack;throw error;}
finally {await writeFile(`${directory}/index.json`,JSON.stringify(report,null,2));await browser.close();}
console.log(JSON.stringify({passed:true,cells:report.cells.length,sourceCommit:report.sourceCommit,errors:report.errors,commerceRequests:report.commerceRequests}));
