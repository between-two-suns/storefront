import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const base=process.argv[2];
assert.ok(base?.startsWith('https://'),'Pass the Shopify preview URL');
const directory='test-results/v12-shopify-native';await mkdir(directory,{recursive:true});
const handles=['daily-reset-cleanser','clarity-serum','daily-barrier-moisturizing-cream','daily-defense-sunscreen-spf-50'];
const names=await Promise.all(handles.map(async handle=>JSON.parse(await readFile(`data/content/products/${handle}.json`,'utf8')).fields.name));
const browser=await chromium.launch({headless:true,channel:'chrome',timeout:30000});
const report={previewURL:base,themeID:166903251202,checkedAt:new Date().toISOString(),surfaces:[],assets:[],pageErrors:[],commerceRequests:[]};
try{
 const context=await browser.newContext({viewport:{width:1440,height:900}});
 await context.addInitScript(()=>localStorage.setItem('bts:proto-cart',JSON.stringify([{handle:'daily-reset-cleanser',qty:2}])));
 context.on('page',page=>page.on('pageerror',error=>report.pageErrors.push(error.message)));
 const assetResponses=new Map();
 context.on('response',response=>{if(/\/assets\/bts-[^?]+/.test(response.url()))assetResponses.set(response.url(),response.status());});
 context.on('request',request=>{if(/\/cart\/(?:add|change|update|clear)(?:\.js)?(?:\?|$)|\/checkout(?:\?|$)/.test(request.url()))report.commerceRequests.push({method:request.method(),url:request.url()});});
 const page=await context.newPage();
 async function visit(path,label){
  const response=await page.goto(new URL(path,base).href,{waitUntil:'domcontentloaded',timeout:60000});
  assert.equal(response.status(),200,label+' status');
  const source=await response.text();await writeFile(`${directory}/${label}.html`,source);
  assert.doesNotMatch(source,/Liquid (?:error|syntax error)/i,label+' Liquid errors');
  await page.waitForFunction(()=>Boolean(window.BTS?.adapter),null,{timeout:15000});
  const theme=await page.evaluate(()=>window.Shopify?.theme);
  assert.equal(theme?.id,166903251202,label+' theme identity');assert.equal(theme?.role,'unpublished');
  assert.equal(await page.locator('body').getAttribute('data-bts-review'),'true',label+' explicit review mode');
  assert.equal((await page.evaluate(()=>window.BTS.adapter.get())).count,0,label+' ignores stale review bag');
  await page.waitForTimeout(400);
  const adds=await page.evaluate(()=>window.BTS.adapter.add([{handle:'daily-reset-cleanser',qty:1}]));
 await page.locator('[data-bts-add]').evaluateAll(nodes=>nodes.map(n=>({handle:n.dataset.btsAdd,disabled:n.disabled,purchasable:n.dataset.btsPurchasable})));
  assert.ok(adds.every(n=>n.disabled&&n.purchasable==='false'),label+' draft Add controls');
  assert.equal(await page.locator('form[action*="cart/add"],a[href="/checkout"]').count(),0);
  const entry={label,url:page.url(),status:response.status(),theme,bytes:source.length,liquidErrors:0,adds};report.surfaces.push(entry);return {source,entry};
 }
 const home=await visit('/','home-desktop');
 for(const name of names)assert.ok(home.source.includes(name),'SSR name '+name);
 const wordmark=page.locator('.bts-home__brand img');await wordmark.waitFor({state:'visible'});
 await page.waitForFunction(()=>document.querySelector('.bts-home__brand img')?.naturalWidth>0);
 assert.equal(await page.locator('.bts-shelf > li').count(),4);
 assert.equal(await page.locator('.bts-shelf [data-placeholder="true"]').count(),4);
 assert.equal(await page.locator('.bts-shelf [data-editorial-product]').count(),4);
 assert.equal(await page.locator('[data-media-slot="T2"]').count(),4);
 for(const selector of ['.bts-story__campaign','.bts-story__texture','.bts-story__proof','.bts-routine-editorial','[data-routine-offer="strip"]'])assert.equal(await page.locator(selector).count(),1,selector);
 home.entry.sections={wordmark:true,shelf:4,productPlaceholders:4,campaign:1,texturePlaceholders:4,formula:1,routine:1};
 home.entry.prices=(await page.locator('.bts-shelf [data-bts-money]').allTextContents()).map(text=>text.trim());assert.deepEqual(home.entry.prices,['EGP 399','EGP 499','EGP 449','EGP 499']);
 assert.equal(await page.locator('.bts-shelf').getAttribute('data-composition-scale'),'physical-preview');
 await page.screenshot({path:`${directory}/home-desktop.png`,fullPage:true});
 await page.locator('.bts-shelf [data-part="turn"]').first().click();assert.equal(await page.locator('.bts-shelf bts-product-face').first().getAttribute('data-side'),'back');await page.waitForTimeout(450);await page.screenshot({path:`${directory}/home-back.png`,fullPage:true});
 await page.locator('[data-bts-open="bts-routine"]').first().click();assert.ok(await page.locator('#bts-routine').evaluate(n=>n.open));await page.screenshot({path:`${directory}/routine-sheet.png`});await page.locator('#bts-routine [data-bts-close]').click();
 await page.locator('[data-bts-add]').evaluateAll(nodes=>nodes.forEach(n=>n.dispatchEvent(new MouseEvent('click',{bubbles:true}))));
 assert.equal((await page.evaluate(()=>window.BTS.adapter.get())).count,0,'disabled Add cannot alter review bag');
 await page.setViewportSize({width:390,height:844});await visit('/','home-mobile');await page.screenshot({path:`${directory}/home-mobile.png`,fullPage:true});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'mobile page overflow');
 await page.setViewportSize({width:1440,height:900});
 for(let i=0;i<handles.length;i++){
  const pdp=await visit(`/search?view=product&q=${handles[i]}`,`pdp-${handles[i]}`);assert.ok(pdp.source.includes(names[i]));assert.equal(await page.locator('h1.pf__name').innerText(),names[i]);assert.equal(await page.locator(`#inci-${handles[i]}`).count(),1);assert.equal(await page.locator('.bts-pdp [data-placeholder="true"]').count(),4);await page.screenshot({path:`${directory}/pdp-${handles[i]}.png`,fullPage:true});
 }
 await visit('/collections/all','collection');assert.equal(await page.locator('.bts-collection__grid [data-placeholder="true"]').count(),4);
 await visit('/search?view=routine','routine');assert.equal(await page.locator('.bts-collection__grid [data-placeholder="true"]').count(),4);
 await visit('/search?q=clarity','search');assert.equal(await page.locator('.pf__name').count(),1);assert.equal(await page.locator('.pf__name').innerText(),'Clarity Serum');
 await visit('/search?view=product&q=unknown-product','unknown-product');assert.equal(await page.locator('.bts-pdp').count(),0);
 await visit('/','navigation-home');report.navigation=[];
 await page.locator('.bts-header__nav a[href="/collections/all"]').click();await page.waitForURL('**/collections/all');assert.equal(await page.locator('.bts-collection__grid [data-placeholder="true"]').count(),4);report.navigation.push({action:'header Shop',url:page.url()});
 await page.locator('.pf__name a').first().click();await page.waitForFunction(()=>Boolean(document.querySelector('h1.pf__name')));assert.equal(await page.locator('h1.pf__name').innerText(),names[0]);report.navigation.push({action:'product card to PDP',url:page.url()});
 await page.locator('.bts-header__nav a[href="/#bts-home-routine"]').click();await page.waitForURL('**/#bts-home-routine');assert.equal(await page.locator('#bts-home-routine [data-routine-offer]').count(),1);report.navigation.push({action:'header routine anchor',url:page.url()});
 await page.locator('[data-bts-open="bts-menu"]').click();await page.locator('#BtsMenuSearch').fill('clarity');await page.locator('.bts-menu-search button').click();await page.waitForURL('**/search?q=clarity');assert.equal(await page.locator('.pf__name').innerText(),names[1]);report.navigation.push({action:'menu search submission',url:page.url()});assert.equal(await page.evaluate(()=>window.Shopify?.theme?.id),166903251202);
 const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:1440,height:900}});const nojsPage=await nojs.newPage();const nojsResponse=await nojsPage.goto(base,{waitUntil:'domcontentloaded'});const nojsSource=await nojsResponse.text();assert.doesNotMatch(nojsSource,/Liquid (?:error|syntax error)/i);assert.equal(await nojsPage.locator('.bts-shelf [data-placeholder="true"]').count(),4);for(const name of names)assert.ok(nojsSource.includes(name));await nojsPage.screenshot({path:`${directory}/home-no-js.png`,fullPage:true});report.noJavaScript={products:4,placeholders:4,liquidErrors:0};await nojs.close();
 for(const [url,status] of assetResponses){assert.equal(status,200,'theme asset response '+url);const response=await context.request.get(url);assert.equal(response.status(),200);const body=await response.body();const name=new URL(url).pathname.split('/').pop();const local=await readFile('assets/'+name);const hash=b=>createHash('sha256').update(b).digest('hex');let semanticMatch=false;
  if(name.endsWith('.css')) {
    semanticMatch=await page.evaluate(({remote,local})=>{const a=new CSSStyleSheet(),b=new CSSStyleSheet();a.replaceSync(remote);b.replaceSync(local);const normalize=text=>text.replace(/'([^']*)'/g,'"$1"').replace(/(-?\d*\.?\d+)ms\b/g,(_,n)=>String(Number(n)/1000)+'s').replace(/(?<![\w\d])0?\.(\d+)/g,'0.$1');return JSON.stringify([...a.cssRules].map(r=>normalize(r.cssText)))===JSON.stringify([...b.cssRules].map(r=>normalize(r.cssText)));},{remote:body.toString(),local:local.toString()});
    assert.ok(semanticMatch,'Shopify CSS semantics '+name);
  } else assert.equal(hash(body),hash(local),'remote/local asset '+name);
  report.assets.push({name,url,status,bytes:body.length,sha256:hash(body),localSHA256:hash(local),cssSemanticMatch:semanticMatch});}
 assert.ok(report.assets.some(a=>a.name==='bts-wordmark-ink.svg'));for(const name of ['bts-core.js','bts-face.js','bts-shelf.js','bts-home.css','bts-editorial.css','bts-pdp.js'])assert.ok(report.assets.some(a=>a.name===name),name);
 assert.deepEqual(report.pageErrors,[]);assert.deepEqual(report.commerceRequests,[]);report.passed=true;
 await writeFile(`${directory}/remote-verification.json`,JSON.stringify(report,null,2));console.log(JSON.stringify({passed:true,surfaces:report.surfaces.length,assets:report.assets.length,liquidErrors:0,pageErrors:0,commerceRequests:0,previewURL:base},null,2));
}catch(error){report.passed=false;report.failure=error.stack;await writeFile(`${directory}/remote-verification.json`,JSON.stringify(report,null,2));throw error;}finally{await browser.close();}
