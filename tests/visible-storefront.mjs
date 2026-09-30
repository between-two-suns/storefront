// Drive the running local preview. No synthetic product media or Shopify calls.
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const origin=process.env.BTS_REVIEW_ORIGIN || 'http://127.0.0.1:8787';
const out='test-results/v12-post-opus-live';await mkdir(out,{recursive:true});
const handles=['daily-reset-cleanser','clarity-serum','daily-barrier-moisturizing-cream','daily-defense-sunscreen-spf-50'];
const report={origin,renderer:'LIVE local LiquidJS server; Shopify drops simulated. No H1 or customer imagery. Colors provisional, not color-accurate. System fallback typography, not C8 approval.',checks:[],failures:[],screenshots:[],geometry:[],fonts:[]};
const browser=await chromium.launch({executablePath:process.env.BTS_CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});report.browser=await browser.version();
const capture=async(page,name,fullPage=false)=>{const path=`${out}/${name}.png`;await page.screenshot({path,fullPage,timeout:30000});report.screenshots.push(path);};
const close=async(page,id,opener)=>{await page.keyboard.press('Escape');await page.waitForFunction(id=>!document.getElementById(id).open,id);if(opener) assert.ok(await opener.evaluate(n=>n===document.activeElement),'dialog returns focus');};
const jobs=[];
for(const viewport of [{width:375,height:667},{width:390,height:844},{width:1024,height:600},{width:1440,height:900}]) for(const locale of ['en','ar']) for(const scale of [1,2]) for(const motion of ['no-preference','reduce']) for(const surface of ['home','collection',...handles]) jobs.push({viewport,locale,scale,motion,surface});
async function runCell({viewport,locale,scale,motion,surface}) {
 const label=`${surface}-${locale}-${viewport.width}x${viewport.height}-text-${scale*100}-${motion}`;
 if(process.env.BTS_VISIBLE_CELL && label!==process.env.BTS_VISIBLE_CELL)return;
 if(process.env.BTS_VISIBLE_SURFACES && !process.env.BTS_VISIBLE_SURFACES.split(',').includes(surface)) return;
 const context=await browser.newContext({viewport,reducedMotion:motion,hasTouch:viewport.width<990});const page=await context.newPage();page.setDefaultTimeout(7000);page.setDefaultNavigationTimeout(30000);
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(['error','assert'].includes(m.type()))errors.push(m.text());});
 let phase='load';
 try {
  const prefix=locale==='ar'?'/ar':'';const pdp=handles.includes(surface);
  const path=pdp?`/search?view=product&q=${surface}`:surface==='collection'?'/collections/all':'';
  const response=await page.goto(origin+prefix+path);assert.equal(response.status(),200);await page.waitForFunction(()=>window.BTS?.money);
  await page.evaluate(s=>document.documentElement.style.fontSize=`${s*100}%`,scale);await page.waitForTimeout(80);
  assert.equal(await page.locator('html').getAttribute('dir'),locale==='ar'?'rtl':'ltr');
  assert.equal(await page.locator('main .pf__stage[data-placeholder="true"]').count(),4);
  assert.equal(await page.locator('main .pf__media img').count(),0);
  assert.equal(await page.locator('.bts-reviews').count(),0);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'document overflow');
  assert.ok(await page.locator('.pf__info').evaluateAll(nodes=>nodes.every(n=>[...n.children].every(c=>c.getBoundingClientRect().bottom<=n.parentElement.querySelector('.pf__buy').getBoundingClientRect().top+1))),'identity grows above Add');
  assert.ok(await page.locator('[data-editorial-product]').evaluateAll(nodes=>nodes.every(n=>{const r=n.getBoundingClientRect();return r.height>r.width && [...n.children].every(c=>{const b=c.getBoundingClientRect();return b.bottom<=r.bottom+1&&b.right<=r.right+1&&b.left>=r.left-1;});})),'portrait crop and contained marks');
  assert.ok(await page.locator('.bts-editorial-product__name').evaluateAll(nodes=>nodes.every(n=>parseFloat(getComputedStyle(n).fontSize)>=12)),'visible placeholder mark size');
  if(locale==='ar') assert.doesNotMatch(await page.locator('main').textContent(),/Removes oil|Controls oil|Invisible\.|fresh skin|Non-stripping/);
  if(surface==='home') {
   assert.equal(await page.locator('.bts-shelf').getAttribute('data-pack-scale'),'neutral');assert.equal(await page.locator('.bts-shelf').getAttribute('data-composition-scale'),'physical-preview');
   const geometry=await page.locator('.bts-shelf > li').evaluateAll(ns=>ns.map(n=>({li:n.getBoundingClientRect().toJSON(),frame:n.querySelector('[data-editorial-product]').getBoundingClientRect().toJSON(),info:n.querySelector('.pf__info').getBoundingClientRect().toJSON(),buy:n.querySelector('.pf__buy').getBoundingClientRect().toJSON()})));report.geometry.push({label,geometry,scrollHeight:await page.evaluate(()=>document.documentElement.scrollHeight)});
   if(viewport.width>=1280)assert.ok(Math.max(...geometry.map(n=>n.frame.bottom))-Math.min(...geometry.map(n=>n.frame.bottom))<1,'shared contact floor');
   if(scale===1&&viewport.width===375)assert.ok(geometry[0].buy.bottom<=667,'primary commerce in 667px fold');
  }
  if(pdp&&scale===1&&viewport.width===375)assert.ok((await page.locator('[data-bts-primary-add]').boundingBox()).y+(await page.locator('[data-bts-primary-add]').boundingBox()).height<=667,'PDP commerce in fold');
  const axe=await new AxeBuilder({page}).include('main').withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();assert.deepEqual(axe.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),[]);
  await capture(page,label);await capture(page,label+'-full',true);
  if(scale===1&&surface==='home'&&motion==='no-preference') {
   const cdp=await context.newCDPSession(page);await cdp.send('DOM.enable');await cdp.send('CSS.enable');const doc=await cdp.send('DOM.getDocument');const node=await cdp.send('DOM.querySelector',{nodeId:doc.root.nodeId,selector:'.pf__name bdi'});report.fonts.push({label,...await cdp.send('CSS.getPlatformFontsForNode',{nodeId:node.nodeId})});await cdp.detach();
  }
  phase='turn';
  for(const face of await page.locator('bts-product-face').all()) {
   const turn=face.locator('[data-part="turn"]');await turn.scrollIntoViewIfNeeded();await turn.focus();const before=await face.locator('.pf__buy').boundingBox();
   await turn.press('Enter');await page.waitForTimeout(motion==='reduce'?145:345);
   assert.equal(await turn.getAttribute('aria-pressed'),'true');assert.equal(await face.locator('[data-part="front"]').evaluate(n=>n.hidden&&n.inert),true);assert.equal(await face.locator('[data-part="back"]').evaluate(n=>!n.hidden&&!n.inert),true);
   const after=await face.locator('.pf__buy').boundingBox();assert.ok(Math.abs(before.y-after.y)<1&&Math.abs(before.height-after.height)<1,'Add motionless');
   assert.ok(await face.locator('[data-part="back"]').evaluate(n=>n.scrollHeight<=n.clientHeight+1),'back fits');
   if(motion==='reduce')assert.equal(await face.locator('[data-part="card"]').evaluate(n=>getComputedStyle(n).transform),'none');
   await face.locator('[data-part="inci"]').click();assert.ok(await page.locator('#bts-inci').evaluate(n=>n.open));await close(page,'bts-inci',face.locator('[data-part="inci"]'));
   if(scale===1)await capture(page,label+'-'+await face.getAttribute('data-key')+'-back');
   await turn.press('Space');await page.waitForTimeout(motion==='reduce'?145:345);assert.equal(await turn.getAttribute('aria-pressed'),'false');assert.ok(await face.locator('[data-part="back"]').evaluate(n=>n.hidden&&n.inert));
  }
  if(surface==='home'&&viewport.width<990) {
   phase='shelf';await page.locator('.bts-shelf > li').first().evaluate(n=>n.scrollIntoView({block:'nearest',inline:'start',behavior:'instant'}));await page.waitForFunction(()=>document.querySelector('[data-shelf-direction="previous"]').disabled);await page.locator('[data-shelf-direction="next"]').click();await page.waitForFunction(()=>document.querySelector('[data-shelf-target="bts-shelf-clarity-serum"]').getAttribute('aria-current')==='true');
   assert.ok(await page.locator('.bts-shelf-nav__links').isHidden());await page.locator('[data-shelf-direction="previous"]').click();
  }
  if(pdp) {
   phase='INCI and sticky';assert.equal(await page.locator('.bts-neighbour-grid .pf').count(),3);await page.locator('.bts-inci-details summary').click();assert.ok(await page.locator('.bts-inci-details p').isVisible());
   if(viewport.width<990) {
    await page.evaluate(()=>{const r=document.querySelector('[data-bts-primary-add]').getBoundingClientRect();scrollTo(0,scrollY+r.bottom+20);});await page.locator('[data-bts-sticky-add]').waitFor({state:'visible'});await capture(page,label+'-sticky');
    await page.locator('[data-bts-sticky-add] [data-bts-add]').click();await page.waitForFunction(()=>document.getElementById('bts-drawer').open);assert.ok(await page.locator('[data-bts-sticky-add]').evaluate(n=>n.hidden&&n.inert));await close(page,'bts-drawer');
    await page.locator('footer').scrollIntoViewIfNeeded();await page.locator('[data-bts-sticky-add]').waitFor({state:'hidden'});
   }
  }
  phase='bag';const add=page.locator('.pf__buy [data-bts-add]').first();await add.click();if(await page.locator('#bts-drawer').evaluate(n=>!n.open))await page.locator('[data-bts-open="bts-drawer"]').click();
  await page.waitForFunction(()=>document.getElementById('bts-drawer').open);assert.ok(await page.locator('#bts-drawer button:disabled').count()>0);assert.ok(Number(await page.locator('[data-bts-count]').textContent())>=1);await capture(page,label+'-bag');await close(page,'bts-drawer');
  phase='menu';const menu=page.locator('.bts-header__menu');if(viewport.width<990)await menu.click();else {assert.ok(await menu.isHidden());await page.evaluate(()=>window.BTS.sheet.open('bts-menu',document.querySelector('.bts-header__nav a')));}
  assert.ok(await page.locator('#bts-menu').evaluate(n=>n.open));assert.equal(await page.locator('#bts-menu input[type="search"]').count(),1);await capture(page,label+'-menu');await close(page,'bts-menu',viewport.width<990?menu:null);
  if(surface==='home'||pdp) {
   phase='routine';const opener=page.locator('[data-routine-offer] [data-bts-open="bts-routine"]').first();await opener.click();assert.ok(await page.locator('#bts-routine').evaluate(n=>n.open));assert.equal(await page.locator('.bts-routine-panel li').count(),4);assert.equal(await page.locator('.bts-routine-totals dd').count(),3);
   assert.ok(await page.locator('#bts-routine').evaluate(n=>n.scrollWidth<=n.clientWidth),'routine horizontal overflow');
   await page.locator('#bts-routine [data-bts-add="the-full-routine"]').scrollIntoViewIfNeeded();await capture(page,label+'-routine');
   for(let i=0;i<20;i++){await page.keyboard.press('Tab');assert.ok(await page.locator('#bts-routine').evaluate(n=>n.contains(document.activeElement)),'focus stays in sheet');}
   await close(page,'bts-routine',opener);
  }
  if(surface==='home') {
   phase='locale';const count=await page.locator('[data-bts-count]').textContent();await page.locator('.bts-header__tools [name="language_code"]').click();await page.waitForURL(url=>url.origin===origin&&(url.pathname.replace(/\/$/,'')||'/')===(locale==='en'?'/ar':'/')); await page.waitForFunction(()=>window.BTS?.money);assert.equal(await page.locator('html').getAttribute('dir'),locale==='en'?'rtl':'ltr');assert.equal(await page.locator('[data-bts-count]').textContent(),count);
  }
  assert.deepEqual(errors,[]);report.checks.push(label);console.log('PASS '+label);
 }catch(e){report.failures.push({label,phase,error:String(e)});console.error('FAIL '+label+' '+phase+' '+e);try{await capture(page,label+'-failure');}catch(captureError){console.error('Failure capture unavailable: '+captureError);}}
 finally{await context.close();}
}
try {
 let next=0;await Promise.all(Array.from({length:Number(process.env.BTS_REVIEW_WORKERS||3)},async()=>{while(next<jobs.length)await runCell(jobs[next++]);}));
for(const locale of ['en','ar']) {
 const context=await browser.newContext({viewport:{width:375,height:667},javaScriptEnabled:false});const page=await context.newPage();const prefix=locale==='ar'?'/ar':'';
 try {await page.goto(origin+prefix);assert.ok(await page.locator('[data-editorial-product]').first().isVisible());assert.equal(await page.locator('.pf__turn:visible').count(),0);assert.ok(await page.locator('.pf__buy [data-bts-add]').first().isDisabled());assert.ok(await page.locator('.bts-shelf-nav__links').isVisible());await page.locator('[data-editorial-product]').first().click();await page.locator('h1.pf__name').waitFor({state:'visible'});assert.equal(await page.locator('h1.pf__name').count(),1);await page.locator('.bts-inci-details summary').click();assert.ok(await page.locator('.bts-inci-details p').isVisible());report.checks.push('no-JS '+locale);}catch(e){report.failures.push({label:'no-JS '+locale,error:String(e)});}await context.close();
}
}finally{await browser.close();await writeFile(`${out}/${process.env.BTS_VISIBLE_SURFACES ? 'browser-home-rereview-report' : process.env.BTS_VISIBLE_CELL ? 'browser-targeted-report' : 'browser-report'}.json`,JSON.stringify(report,null,2));}
console.log(`${report.checks.length} live visible checks passed; ${report.failures.length} failed`);if(report.failures.length){console.error(JSON.stringify(report.failures,null,2));process.exitCode=1;}
