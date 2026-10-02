// Read-only Shopify captures for the concrete Opus polish conditions.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
const base=process.argv[2];assert.match(base||'',/^https:\/\/[^/]+\.shopifypreview\.com\/?$/);
const directory='test-results/v12-recovery/polish';await mkdir(directory,{recursive:true});
const report={base,sourceCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),checkedAt:new Date().toISOString(),cells:[],errors:[],commerceRequests:[]};
const browser=await chromium.launch({channel:'chrome'});
try {
  const context=await browser.newContext({viewport:{width:1440,height:900}});
  context.on('page',page=>page.on('pageerror',error=>report.errors.push(error.message)));
  context.on('request',request=>{if(/\/cart\/(?:add|change|update|clear)(?:\.js)?(?:\?|$)|\/checkout(?:\?|$)/.test(request.url()))report.commerceRequests.push(request.url());});
  const page=await context.newPage();await page.goto(base,{waitUntil:'networkidle'});
  const hide=page.frameLocator('#PBarNextFrame').getByRole('button',{name:'Hide bar',exact:true});if(await hide.isVisible())await hide.click();
  for(const viewport of [{width:375,height:667},{width:390,height:844},{width:1440,height:900}])for(const scale of [1,2]) {
    await page.setViewportSize(viewport);await page.goto(base,{waitUntil:'networkidle'});await page.waitForFunction(()=>window.BTS?.adapter);
    assert.equal(await page.evaluate(()=>window.Shopify.theme.id),166903251202);assert.equal(await page.evaluate(()=>window.Shopify.theme.role),'unpublished');
    await page.evaluate(scale=>document.documentElement.style.fontSize=`${scale*100}%`,scale);
    const cell={viewport,scale,captures:[]};
    if(viewport.width>=990){const path=`${directory}/desktop-offer-text-${scale*100}.png`;await page.screenshot({path});cell.captures.push(path);}
    for(const id of (viewport.width>=990?['bts-routine','bts-drawer']:['bts-menu','bts-routine','bts-drawer'])) {
      await page.locator(`[data-bts-open="${id}"]:visible`).first().click();
      const sheet=page.locator(`#${id}`);assert.equal(await sheet.evaluate(n=>n.open),true);
      await sheet.evaluate(n=>Promise.all(n.getAnimations().map(a=>a.finished)));
      const geometry=await sheet.evaluate(n=>({width:n.clientWidth,scroll:n.scrollWidth,buttons:[...n.querySelectorAll('button')].map(b=>({text:b.textContent.trim(),height:b.getBoundingClientRect().height,border:getComputedStyle(b).borderTopStyle,disabled:b.disabled}))}));
      assert.ok(geometry.scroll<=geometry.width+1,'sheet overflow at enlarged text');
      assert.ok(geometry.buttons.every(b=>b.height>=44&&!['outset','inset'].includes(b.border)),'readable controls without browser bevels');
      if(id==='bts-menu') {
        const lines=await sheet.locator('button[type="submit"]').evaluate(n=>{const r=document.createRange();r.selectNodeContents(n);return [...r.getClientRects()].map(b=>b.y);});
        assert.equal(new Set(lines).size,1,'Search label remains whole on one line');
        assert.ok(await sheet.locator('input').evaluate(n=>n.getBoundingClientRect().width>=44),'search input remains usable');
      }
      if(id==='bts-routine')assert.ok(geometry.buttons.filter(b=>b.text==='Add to bag').every(b=>b.disabled));
      const path=`${directory}/${id}-${viewport.width}x${viewport.height}-text-${scale*100}.png`;await page.screenshot({path});cell.captures.push(path);
      cell[id]=geometry;await page.keyboard.press('Escape');assert.equal(await sheet.evaluate(n=>n.open),false);
    }
    await page.goto(new URL('/collections/all',base).href,{waitUntil:'networkidle'});
    await page.evaluate(scale=>document.documentElement.style.fontSize=`${scale*100}%`,scale);
    assert.ok(await page.evaluate(()=>getComputedStyle(document.querySelector('.bts-collection h1')).fontFamily===getComputedStyle(document.querySelector('.pf__name')).fontFamily),'Shop heading uses the existing display role');
    const path=`${directory}/shop-${viewport.width}x${viewport.height}-text-${scale*100}.png`;await page.screenshot({path});cell.captures.push(path);report.cells.push(cell);
  }
  assert.deepEqual(report.errors,[]);assert.deepEqual(report.commerceRequests,[]);report.passed=true;
}catch(error){report.passed=false;report.failure=error.stack;throw error;}
finally{await writeFile(`${directory}/index.json`,JSON.stringify(report,null,2));await browser.close();}
console.log(JSON.stringify({passed:true,cells:report.cells.length,sourceCommit:report.sourceCommit,errors:report.errors,commerceRequests:report.commerceRequests}));
