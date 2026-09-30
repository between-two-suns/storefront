import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
import { renderFixture } from './render-fixture.mjs';
import { syntheticMedia } from './synthetic-media.mjs';
const root = resolve(import.meta.dirname, '..');
const report = { renderer:'LiquidJS with explicit Shopify stand-ins; synthetic geometry image only', browser:'system Google Chrome (local)', checks:[], failures:[], geometry:[], screenshots:[] };
const server = createServer(async (request,response) => {
  try {
    const url = new URL(request.url,'http://127.0.0.1');
    if(url.pathname.startsWith('/assets/')) {
      const path = resolve(root,'.'+url.pathname);
      if(!path.startsWith(root+'/assets/')) throw new Error('path');
      const type = path.endsWith('.js')?'text/javascript':path.endsWith('.css')?'text/css':'image/svg+xml';
      response.writeHead(200,{'Content-Type':type});response.end(await readFile(path));return;
    }
    if(url.pathname==='/fixtures/contract-media.svg') {
      response.writeHead(200,{'Content-Type':'image/svg+xml'});response.end(syntheticMedia(Number(url.searchParams.get('ratio')) || 600/760).svg);return;
    }
    response.writeHead(200,{'Content-Type':'text/html'});
    response.end(await renderFixture({locale:url.searchParams.get('locale')||'en',surface:url.searchParams.get('surface')||(url.pathname.endsWith('/search')?(url.searchParams.get('view')==='routine'?'routine':'search'):'home'),media:url.searchParams.get('media')==='1',missingConfig:url.searchParams.get('config')==='0',missingContent:url.searchParams.get('content')==='0',stale:url.searchParams.get('stale')==='1',ratio:url.searchParams.has('ratio')?Number(url.searchParams.get('ratio')):600/760,measurements:url.searchParams.get('scale')==='founder'?'seed':url.searchParams.get('scale')==='1'?{'daily-reset-cleanser':210,'clarity-serum':175,'daily-barrier-moisturizing-cream':195,'daily-defense-sunscreen-spf-50':205}:null,extra:{search:{terms:url.searchParams.get('q')||''}}}));
  } catch(error) {response.writeHead(500);response.end(String(error));}
});
await new Promise(done=>server.listen(0,'127.0.0.1',done));
const origin='http://127.0.0.1:'+server.address().port;
const browser = await chromium.launch({headless:true,args:['--window-size=1920,1080'],executablePath:process.env.BTS_CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
report.browser = await browser.version();
const capture = async (page, stem) => {
  if(process.env.BTS_BROWSER_CAPTURE === '0') return;
  await mkdir(resolve(root,'test-results/screenshots'),{recursive:true});
  const state=await page.evaluate(()=>({sides:[...document.querySelectorAll('bts-product-face')].map(face=>({key:face.dataset.key,side:face.dataset.side})),shelfScroll:document.querySelector('.bts-shelf')?.scrollLeft || 0,rootFontSize:document.documentElement.style.fontSize}));
  const snapshot=await page.context().newPage();
  const snapshotErrors=[];snapshot.on('pageerror',error=>snapshotErrors.push(String(error)));
  const url=new URL(page.url());url.searchParams.delete('bts_debug');
  try {
    await snapshot.goto(url.toString());
    await snapshot.evaluate(size=>{document.documentElement.style.fontSize=size;},state.rootFontSize);
    await snapshot.waitForFunction(()=>window.BTS?.money);
    await snapshot.waitForFunction(()=>[...document.querySelectorAll('bts-product-face')].every(face=>face.dataset.backOverflow==='false') && [...document.querySelectorAll('.pf[data-variant="shelf"]')].every(face=>face.dataset.infoOverflow==='false'));
    await snapshot.evaluate(state=>{
      for(const side of state.sides) document.querySelector(`bts-product-face[data-key="${side.key}"]`)?.turn(side.side);
      const shelf=document.querySelector('.bts-shelf');if(shelf) shelf.scrollLeft=state.shelfScroll;
      scrollTo(0,0);
    },state);
    await snapshot.waitForFunction(()=>[...document.querySelectorAll('bts-product-face')].every(face=>face.dataset.backOverflow==='false') && [...document.querySelectorAll('.pf[data-variant="shelf"]')].every(face=>face.dataset.infoOverflow==='false'));
    await snapshot.waitForTimeout(340);
    const viewport=await snapshot.evaluate(()=>[innerWidth,innerHeight]);
    for (const [suffix,fullPage] of [['fold',false],['full',true]]) {
      const path=`test-results/screenshots/${stem}-${suffix}.png`;
      await snapshot.screenshot({path:resolve(root,path),fullPage});report.screenshots.push(path);
      assert.deepEqual(await snapshot.evaluate(()=>[innerWidth,innerHeight]),viewport,'capture restores the review viewport');
      await snapshot.waitForFunction(()=>[...document.querySelectorAll('bts-product-face')].every(face=>face.dataset.backOverflow==='false') && [...document.querySelectorAll('.pf[data-variant="shelf"]')].every(face=>face.dataset.infoOverflow==='false'));
    }
    assert.deepEqual(snapshotErrors,[]);
  } finally {await snapshot.close();}
};
try {
  for(const cell of [{width:375,height:667},{width:390,height:844},{width:430,height:932},{width:1440,height:900},{width:1440,height:768},{width:1366,height:640},{width:667,height:375},{width:375,height:620},{width:1366,height:620},{width:1280,height:720},{width:1024,height:768},{width:1024,height:600},{width:1100,height:768},{width:1152,height:864},{width:1440,height:900,textScale:2},{width:390,height:844,textScale:2}]) {
    const {textScale=1,...viewport}=cell;
    for(const locale of ['en','ar']) for(const reducedMotion of ['no-preference','reduce']) for(const surface of ['home','pdp']) {
      const label=`${surface} ${locale} ${viewport.width}x${viewport.height} ${reducedMotion}${textScale===2?' text-200':''}`;
      if(process.env.BTS_BROWSER_CELL && label!==process.env.BTS_BROWSER_CELL) continue;
      if(process.env.BTS_BROWSER_CELLS && !process.env.BTS_BROWSER_CELLS.split(';').includes(label)) continue;
      const context = await browser.newContext({viewport,reducedMotion});
      const page = await context.newPage();
      let phase='initial layout';
      const errors=[];page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error'||m.type()==='assert'||m.text().includes('[bts]'))errors.push(`${phase}: ${m.text()}`);});
      await page.addInitScript(()=>{
        window.btsAssertionTrace=[];
        const nativeAssert=console.assert.bind(console);
        console.assert=(condition,...args)=>{
          if(!condition) window.btsAssertionTrace.push({message:args,ready:document.readyState,viewport:[innerWidth,innerHeight],sheets:[...document.styleSheets].map(sheet=>sheet.href),faces:[...document.querySelectorAll('.pf')].map(face=>({key:face.dataset.key,backHeight:face.querySelector('.pf__back')?.clientHeight,backScroll:face.querySelector('.pf__back')?.scrollHeight,infoHeight:face.querySelector('.pf__info')?.clientHeight,infoScroll:face.querySelector('.pf__info')?.scrollHeight}))});
          nativeAssert(condition,...args);
        };
      });
      try {
        await page.goto(`${origin}/?surface=${surface}&locale=${locale}&media=1&founder=1&bts_debug=${textScale===2 || (viewport.width>=990 && viewport.width<1280)?'0':'1'}`);
        await page.waitForFunction(()=>window.BTS?.money);
        if(textScale===2) await page.evaluate(()=>{document.documentElement.style.fontSize='200%';});
        await page.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));
        assert.equal(await page.locator('header').count(),1);assert.equal(await page.locator('footer').count(),1);assert.equal(await page.locator('main').count(),1);
        assert.equal(await page.locator('[data-bts-count]').count(),1);assert.equal(await page.locator('[data-bts-marker]').count(),1);assert.ok(await page.locator('[data-bts-marker]').isVisible());
        assert.equal((await page.locator('header').boundingBox()).height,52);
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'horizontal overflow');
        const firstPrice=page.locator('.pf__buy [data-bts-money]').first();const beforeText=await firstPrice.textContent();
        assert.equal(await firstPrice.evaluate(node=>node.textContent),await firstPrice.evaluate(node=>window.BTS.money(Number(node.dataset.amount),node.dataset.currency)));
        const rows = await page.locator('.pf__buy').evaluateAll(nodes => nodes.filter(n=>n.closest('.pf')).map(n=>({top:n.getBoundingClientRect().top,bottom:n.getBoundingClientRect().bottom})));
        const firstRowCount=surface==='pdp'?1:viewport.width>=990 && viewport.width<1280?2:rows.length;
        if (viewport.height>=620 && textScale===1) assert.ok(rows.slice(0,firstRowCount).every(row=>row.bottom<=viewport.height), `commerce outside viewport ${JSON.stringify(rows)}`);
        const stages=await page.locator('.pf__stage').evaluateAll(nodes=>nodes.map(n=>({height:n.getBoundingClientRect().height,bottom:n.getBoundingClientRect().bottom})));
        assert.ok(stages.every(stage=>stage.height>=200),'stage floor');
        if (surface==='home') {
          await page.waitForFunction(()=>[...document.querySelectorAll('.pf[data-variant="shelf"]')].every(n=>n.dataset.infoOverflow==='false'));
          if(viewport.width>=990) for(let i=0;i<stages.length;i+=firstRowCount) {
            const row=stages.slice(i,i+firstRowCount);
            assert.ok(Math.max(...row.map(s=>s.bottom))-Math.min(...row.map(s=>s.bottom))<1,'shared stage floor in each row');
          }
          assert.ok((await page.locator('.bts-home__brand img').boundingBox()).width>(await page.locator('.bts-footer__wordmark').boundingBox()).width,'Home wordmark dominates footer');
          assert.ok(await page.locator('.bts-home__band').evaluate(band=>{
            const box=band.getBoundingClientRect();
            return [...band.children].filter(n=>getComputedStyle(n).display!=='none').every(n=>{const child=n.getBoundingClientRect();return child.top>=box.top-1 && child.bottom<=box.bottom+1;});
          }),'brand and offer stay inside yielding band');
        } else if (viewport.width>=990) {
          const info=await page.locator('.pf__info').first().boundingBox();
          assert.ok(rows[0].top-info.y-info.height<=16,'PDP info and commerce stay together');
        }
        if(locale==='en') {
          await page.waitForFunction(()=>[...document.querySelectorAll('bts-product-face')].every(n=>n.dataset.backOverflow==='false'));
          assert.ok(await page.locator('.pf__back').evaluateAll(backs=>backs.every(back=>{
            const box=back.getBoundingClientRect(),css=getComputedStyle(back);
            const floor=box.bottom-parseFloat(css.paddingBottom);
            return [...back.querySelectorAll('p,li,a')].every(node=>{const r=node.getBoundingClientRect();return r.bottom<=floor+1 && r.top>=box.top-1 && r.left>=box.left-1 && r.right<=box.right+1;});
          })),'approved back sentences, pills and links stay wholly inside face');
          for(const turn of await page.locator('[data-part="turn"]').all()) assert.ok(await turn.isVisible(),'visible turn');
        }
        if(surface==='home' && viewport.width>=990) for(let i=0;i<rows.length;i+=firstRowCount) {
          const row=rows.slice(i,i+firstRowCount);
          assert.ok(Math.max(...row.map(r=>r.top))-Math.min(...row.map(r=>r.top))<1,'shared commerce baseline in each row');
        }
        assert.ok(await page.locator('.pf').evaluateAll(faces=>faces.every(face=>{
          const info=face.querySelector('.pf__info'),buy=face.querySelector('.pf__buy');
          return !info || [...info.children].every(child=>child.getBoundingClientRect().bottom<=buy.getBoundingClientRect().top+1);
        })),'info children never overlap commerce');
        report.geometry.push({label,rows,stages,info:await page.locator('.pf[data-variant="shelf"]').evaluateAll(nodes=>nodes.map(n=>n.dataset.infoOverflow)),backs:await page.locator('bts-product-face').evaluateAll(nodes=>nodes.map(n=>n.dataset.backOverflow))});
        const stem=`${surface}-${locale}-${viewport.width}x${viewport.height}-${reducedMotion}${textScale===2?'-text-200':''}`;
        phase='front captures';
        await capture(page,stem);
        assert.equal(await page.locator('.pf__stage img').count(),surface==='home'?(locale==='en'?8:4):(locale==='en'?5:4));
        if(locale==='en') {
          phase='turn and INCI';
          const face=page.locator('bts-product-face').first();await face.locator('[data-part="turn"]').waitFor({state:'visible'});
          const add=page.locator('.pf__buy [data-bts-add]').first();
          const turn=face.locator('[data-part="turn"]');await turn.scrollIntoViewIfNeeded();await turn.focus();const before=await add.boundingBox();await turn.press('Enter');
          assert.equal(await turn.getAttribute('aria-pressed'),'true');assert.ok(await turn.evaluate(node=>node===document.activeElement));
          assert.ok(await face.locator('[data-part="front"]').evaluate(node=>node.inert));assert.ok(!await face.locator('[data-part="back"]').evaluate(node=>node.inert));
          assert.deepEqual(await add.boundingBox(),before);assert.equal(await firstPrice.textContent(),beforeText);
          const overflow=await face.locator('[data-part="back"]').evaluate(node=>({scroll:node.scrollHeight,height:node.clientHeight,contained:[...node.querySelectorAll('p,li,a')].every(child=>{const box=node.getBoundingClientRect(),r=child.getBoundingClientRect();return r.bottom<=box.bottom-parseFloat(getComputedStyle(node).paddingBottom)+1 && r.top>=box.top-1;})}));
          assert.ok(overflow.scroll<=overflow.height+1 && overflow.contained,`back overflow ${JSON.stringify(overflow)}`);
          await page.waitForTimeout(reducedMotion==='reduce'?140:340);
          await capture(page,`${stem}-${await face.getAttribute('data-key')}-back`);
          await face.locator('[data-part="inci"]').click();assert.ok(await page.locator('#bts-inci').evaluate(node=>node.open));
          assert.ok(await page.evaluate(()=>document.documentElement.classList.contains('bts-scroll-locked')));
          await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.getElementById('bts-inci').open);assert.ok(await face.locator('[data-part="inci"]').evaluate(node=>node===document.activeElement));
          await turn.click();
          phase='all SKU turns';
          for (const other of await page.locator('bts-product-face').all()) {
            const control=other.locator('[data-part="turn"]');
            await control.click();
            const size=await other.locator('[data-part="back"]').evaluate(node=>({scroll:node.scrollHeight,height:node.clientHeight,contained:[...node.querySelectorAll('p,li,a')].every(child=>{const box=node.getBoundingClientRect(),r=child.getBoundingClientRect();return r.bottom<=box.bottom-parseFloat(getComputedStyle(node).paddingBottom)+1 && r.top>=box.top-1;})}));
            assert.ok(size.scroll<=size.height+1 && size.contained,`SKU back overflow ${await other.getAttribute('data-key')} ${JSON.stringify(size)}`);
            if (surface==='home' && reducedMotion==='no-preference' && (viewport.width===375 || viewport.width>=990) && await other.getAttribute('data-key')!==await face.getAttribute('data-key')) {
              await page.waitForTimeout(340);
              await capture(page,`${stem}-${await other.getAttribute('data-key')}-back`);
            }
            await control.click();
          }
        } else {
          assert.equal(await page.locator('bts-product-face').count(),0);assert.equal(await page.locator('.pf__front img').first().getAttribute('alt'),'Daily Reset Cleanser');assert.equal(await page.locator('.pf__turn').count(),0);assert.equal(await page.locator('html').getAttribute('dir'),'rtl');
          assert.ok(!await page.getByText('Removes oil. Maintains hydration. Feels fresh.',{exact:true}).count());
          assert.ok(beforeText.endsWith('ج.م'));
        }
        phase='cart and sheets';
        await page.locator('.pf__buy [data-bts-add]').first().click();
        if(surface==='home') {
          assert.ok(!await page.locator('#bts-drawer').evaluate(node=>node.open));
          assert.equal(await page.locator('[data-bts-count]').textContent(),'1');
          assert.equal(await page.locator('.pf__buy [data-bts-add]').first().textContent(),locale==='en'?'Added ✓':'تمت الإضافة ✓');
          await page.locator('[data-bts-open="bts-drawer"]').click();
        }
        await page.waitForFunction(()=>document.getElementById('bts-drawer').open);
        assert.equal(await page.locator('[data-bts-count]').textContent(),'1');assert.equal(await page.locator('#bts-drawer [data-title]').textContent(),'Daily Reset Cleanser');
        assert.equal(await page.locator('#bts-drawer [data-chip]').getAttribute('data-colour'),'reset');
        assert.ok(await page.locator('#BtsBagTitle').evaluate(node=>node===document.activeElement));
        await page.waitForTimeout(reducedMotion==='reduce'?140:260);
        const sheetBox=await page.locator('#bts-drawer').boundingBox();
        if(locale==='ar') assert.ok(sheetBox.x<5);else assert.ok(Math.abs(sheetBox.x+sheetBox.width-viewport.width)<20);
        await page.locator('#bts-drawer [data-qty]').fill('2');await page.locator('#bts-drawer [data-qty]').press('Tab');await page.waitForFunction(()=>document.querySelector('[data-bts-count]').textContent==='2');
        await page.locator('#bts-drawer [data-bts-close]').click();await page.waitForFunction(()=>!document.documentElement.classList.contains('bts-scroll-locked'));
        if(viewport.width<990) await page.locator('[data-bts-open="bts-menu"]').click(); else await page.evaluate(()=>window.BTS.sheet.open('bts-menu',document.querySelector('.bts-header__nav a')));await page.waitForFunction(()=>document.getElementById('bts-menu').open);
        await page.waitForTimeout(reducedMotion==='reduce'?140:260);
        const menuBox=await page.locator('#bts-menu').boundingBox();
        if(locale==='en') assert.ok(menuBox.x<5);else assert.ok(Math.abs(menuBox.x+menuBox.width-viewport.width)<20);
        // Opening a second sheet closes the first and retains one lock/focus owner.
        await page.evaluate(()=>window.BTS.sheet.open('bts-drawer',document.querySelector('[data-bts-open="bts-drawer"]')));
        assert.equal(await page.locator('dialog[open]').count(),1);
        phase='bag axe';
        const axe = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
        assert.deepEqual(axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);
        await page.keyboard.press('Escape');
        phase='main axe';
        const mainAxe = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
        assert.deepEqual(mainAxe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);
        assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--bts-turn').trim()),locale==='ar'?'-1':'1');
        assert.ok(await page.evaluate(()=>[...document.querySelectorAll('.pf__media img')].every(image=>getComputedStyle(image).transform==='none')));
        assert.deepEqual(errors,[]);
        report.checks.push(label);console.log('PASS '+label);
      } catch(error) {report.failures.push({label,error:String(error),assertions:await page.evaluate(()=>window.btsAssertionTrace)});console.error('FAIL '+label+' '+error);}
      finally {await context.close();}
    }
  }
  for(const surface of ['home','pdp','collection','compact']) {
    const page = await browser.newPage();
    await page.goto(`${origin}/?surface=${surface}`);
    assert.equal(await page.locator('.pf__stage[data-placeholder]').count(),surface==='compact'?0:4);assert.equal(await page.locator('[data-part="turn"]').count(),surface==='compact'||surface==='collection'?0:surface==='home'?4:1);
    await page.goto(`${origin}/?surface=${surface}&media=1&stale=1`);assert.equal(await page.locator('.pf__stage[data-placeholder]').count(),surface==='compact'?0:4);assert.equal(await page.locator('.pf__media img').count(),0);
    await page.close();report.checks.push('absent/stale media '+surface);
  }
  for(const locale of ['en','ar']) {
    const context=await browser.newContext({viewport:{width:375,height:667}});
    const page=await context.newPage();
    await page.goto(`${origin}/?locale=${locale}&media=1&ratio=${2/3}`);
    await page.waitForFunction(()=>window.BTS?.money);
    assert.ok((await page.locator('.pf__buy').first().boundingBox()).y+(await page.locator('.pf__buy').first().boundingBox()).height<=667,'2:3 crop commerce clamp');
    await page.locator('.bts-routine-line [data-bts-open="bts-routine"]').click();
    await page.locator('#bts-routine [data-bts-add="the-full-routine"]').click();
    await page.waitForFunction(()=>document.getElementById('bts-drawer').open);
    assert.equal(await page.locator('#bts-drawer [data-title]').textContent(),'The Full Routine');
    assert.equal(await page.locator('#bts-drawer [data-bts-saving-amount]').textContent(),locale==='en'?'EGP 185':'185 ج.م');
    await page.keyboard.press('Escape');
    await page.goto(`${origin}/search?view=routine&locale=${locale}`);
    assert.equal(await page.locator('main [data-bts-add="the-full-routine"]').count(),1);
    await page.goto(`${origin}/search?q=clarity&locale=${locale}`);
    assert.equal(await page.locator('main .pf__name').count(),1);
    assert.equal(await page.locator('main .pf__name').textContent(),'Clarity Serum');
    assert.equal(await page.locator('.pf__stage').count(),0);
    const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();assert.deepEqual(axe.violations,[]);
    report.checks.push('routine sheet/route, search route and 2:3 crop '+locale);
    await context.close();
  }
  // Exercise every integer width in E1's failure band in production, including live turned resizes.
  for(const locale of ['en','ar']) {
    const context=await browser.newContext({viewport:{width:990,height:600},reducedMotion:'reduce'});
    const page=await context.newPage();
    await page.goto(`${origin}/?locale=${locale}&media=1`);
    await page.waitForFunction(()=>window.BTS?.money);
    for(const face of await page.locator('bts-product-face').all()) await face.locator('[data-part="turn"]').click();
    for(const height of [600,768,864]) for(let width=990;width<=1280;width++) {
      await page.setViewportSize({width,height});
      // The following bounding-box reads force layout; do not depend on background-tab animation-frame scheduling.
      assert.ok(await page.locator('.pf[data-variant="shelf"]').evaluateAll(faces=>faces.every(face=>{
        const info=face.querySelector('.pf__info'),buy=face.querySelector('.pf__buy'),stage=face.querySelector('.pf__stage'),back=face.querySelector('.pf__back'),turn=face.querySelector('.pf__turn');
        if(stage.getBoundingClientRect().height<200) return false;
        if([...info.children].some(n=>n.getBoundingClientRect().bottom>buy.getBoundingClientRect().top+1)) return false;
        if(!back) return !turn;
        const box=back.getBoundingClientRect();
        return !turn.hidden && back.scrollHeight<=back.clientHeight+1 && [...back.querySelectorAll('p,li,a')].every(n=>n.getBoundingClientRect().bottom<=box.bottom-parseFloat(getComputedStyle(back).paddingBottom)+1);
      })),`production turned-resize band ${locale} ${width}x${height}`);
    }
    report.checks.push(`production live turned-resize sweep 990–1280 at 600/768/864 ${locale} (873 geometries)`);
    await context.close();
  }
  const founderContext=await browser.newContext({viewport:{width:1440,height:900}});
  const founderPage=await founderContext.newPage();
  await founderPage.goto(`${origin}/?media=1&scale=founder`);
  await founderPage.waitForFunction(()=>[...document.querySelectorAll('.pf[data-variant="shelf"]')].every(n=>n.dataset.infoOverflow==='false' && n.dataset.backOverflow==='false'));
  assert.equal(await founderPage.locator('.bts-shelf').getAttribute('data-pack-scale'),'measured');
  const founderPacks=await founderPage.locator('.pf__stage').evaluateAll(stages=>stages.map(stage=>({mm:Number(stage.style.getPropertyValue('--pf-mm')),packHeight:stage.querySelector('.pf__front').getBoundingClientRect().height,stageHeight:stage.getBoundingClientRect().height,floor:stage.getBoundingClientRect().bottom})));
  assert.deepEqual(founderPacks.map(pack=>pack.mm),[180,96,116,116]);
  assert.ok(founderPacks.every(pack=>pack.stageHeight>=200),'measured stage floor preserves D1 while smaller packs keep truthful photograph scale');
  const founderUnits=founderPacks.map(pack=>pack.packHeight/pack.mm);
  assert.ok(Math.max(...founderUnits)-Math.min(...founderUnits)<.001,'founder physical geometry preserves one photograph scale while backs grow');
  assert.ok(Math.max(...founderPacks.map(pack=>pack.floor))-Math.min(...founderPacks.map(pack=>pack.floor))<1,'founder measured shared floor');
  report.geometry.push({label:'Founder measurements with SYNTHETIC geometry media only; no photographic approval',packs:founderPacks});
  await capture(founderPage,'home-en-1440x900-founder-mm-synthetic-media');
  report.checks.push('founder mm source, shared bottle heights and photograph scale with intrinsic back growth');
  await founderContext.close();
  const scaleContext=await browser.newContext({viewport:{width:1440,height:900}});
  const scalePage=await scaleContext.newPage();
  await scalePage.goto(`${origin}/?media=1&scale=1`);
  await scalePage.waitForFunction(()=>window.BTS?.money);
  assert.equal(await scalePage.locator('.bts-shelf').getAttribute('data-pack-scale'),'measured');
  await scalePage.waitForFunction(()=>[...document.querySelectorAll('.pf[data-variant="shelf"]')].every(n=>n.dataset.infoOverflow==='false' && n.dataset.backOverflow==='false'));
  await capture(scalePage,'home-en-1440x900-synthetic-measured');
  const scales=await scalePage.locator('.pf__stage').evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().height/Number(n.style.getPropertyValue('--pf-mm'))));
  assert.ok(Math.max(...scales)-Math.min(...scales)<.001,'one px/mm scale');
  assert.ok(Math.abs((await scalePage.locator('.pf__stage').first().boundingBox()).height-300)<1,'tallest synthetic pack reaches shared height cap');
  const floors=await scalePage.locator('.pf__stage').evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().bottom));
  assert.ok(Math.max(...floors)-Math.min(...floors)<1,'shared shelf floor');
  report.geometry.push({label:'SYNTHETIC mm mechanics only',scales,floors});
  await scalePage.locator('bts-product-face').first().locator('[data-part="turn"]').click();
  await scalePage.locator('footer').scrollIntoViewIfNeeded();await scalePage.waitForTimeout(750);
  assert.equal(await scalePage.locator('bts-product-face').first().getAttribute('data-side'),'back','chosen turn state persists');
  await scalePage.goto(`${origin}/?surface=pdp&media=1`);
  await scalePage.locator('footer').scrollIntoViewIfNeeded();assert.ok(!await scalePage.locator('[data-bts-sticky-add]').isVisible(),'desktop sticky absent');
  report.checks.push('synthetic physical scale/floor; turn persistence; desktop sticky absent');
  await scaleContext.close();
  const wideContext=await browser.newContext({viewport:{width:1440,height:900}});
  const widePage=await wideContext.newPage();
  await widePage.goto(`${origin}/?media=1&scale=1&ratio=1.5`);
  await widePage.waitForFunction(()=>[...document.querySelectorAll('.pf[data-variant="shelf"]')].every(n=>n.dataset.infoOverflow==='false' && n.dataset.backOverflow==='false'));
  const widthGeometry=await widePage.locator('.bts-shelf').evaluate(shelf=>{
    const css=getComputedStyle(shelf);
    const contentWidth=shelf.clientWidth-parseFloat(css.paddingLeft)-parseFloat(css.paddingRight);
    const trackWidth=(contentWidth-3*parseFloat(css.columnGap))/4;
    const stages=[...shelf.querySelectorAll('.pf__stage')];
    return {contentWidth,trackWidth,expectedUnit:trackWidth/Number(shelf.style.getPropertyValue('--pf-max-width-mm')),units:stages.map(n=>n.querySelector('.pf__front').getBoundingClientRect().height/Number(n.style.getPropertyValue('--pf-mm'))),widths:stages.map(n=>n.querySelector('.pf__front').getBoundingClientRect().height*Number(n.style.getPropertyValue('--pf-ratio'))),stageHeights:stages.map(n=>n.getBoundingClientRect().height)};
  });
  assert.ok(widthGeometry.stageHeights.every(height=>height>=200),'width-bound measured stage floor');
  assert.ok(widthGeometry.units.every(unit=>Math.abs(unit-widthGeometry.expectedUnit)<.001),'cqw content-box padding counted once');
  assert.ok(Math.abs(Math.max(...widthGeometry.widths)-widthGeometry.trackWidth)<.1,'widest synthetic crop fills one track');
  await capture(widePage,'home-en-1440x900-synthetic-measured-wide');
  report.geometry.push({label:'SYNTHETIC width-bound cqw mechanics only',...widthGeometry});
  report.checks.push('width-bound measured cqw uses content box once');
  await wideContext.close();
  const infoContext=await browser.newContext({viewport:{width:375,height:667}});
  const infoPage=await infoContext.newPage();
  const infoAssertions=[];infoPage.on('console',message=>{if(message.type()==='assert')infoAssertions.push(message.text());});
  await infoPage.goto(`${origin}/?locale=ar&media=1`);
  await infoPage.waitForFunction(()=>[...document.querySelectorAll('.pf[data-variant="shelf"]')].every(n=>n.dataset.infoOverflow==='false'));
  const name=infoPage.locator('.pf__name bdi').first();
  const approvedName=await name.textContent();
  await name.evaluate(node=>{node.textContent='SYNTHETIC info overflow fixture '.repeat(30);});
  await infoPage.waitForFunction(()=>document.querySelector('.pf__info').getBoundingClientRect().height>136);
  assert.ok(await infoPage.locator('.pf').first().evaluate(face=>{
    const info=face.querySelector('.pf__info'),buy=face.querySelector('.pf__buy');
    return [...info.children].every(child=>child.getBoundingClientRect().bottom<=buy.getBoundingClientRect().top);
  }),'production growth pushes commerce below excess text');
  assert.deepEqual(infoAssertions,[]);
  await name.evaluate((node,text)=>{node.textContent=text;},approvedName);
  await infoPage.waitForFunction(()=>document.querySelector('.pf').dataset.infoOverflow==='false');
  report.checks.push('AR 375 production info growth resolves synthetic excess and shrinks on restore');
  await infoContext.close();
  const stickyContext=await browser.newContext({viewport:{width:375,height:667}});
  const stickyPage=await stickyContext.newPage();
  try {
    await stickyPage.goto(`${origin}/?surface=pdp&media=1`);
    await stickyPage.waitForFunction(()=>document.querySelector('[data-bts-primary-add] button[data-bts-add]').disabled===false);
    assert.ok(!await stickyPage.locator('[data-bts-sticky-add]').isVisible());
    await stickyPage.evaluate(()=>{const row=document.querySelector('[data-bts-primary-add]');scrollTo(0,row.getBoundingClientRect().bottom+scrollY+12);});
    await stickyPage.locator('[data-bts-sticky-add]').waitFor({state:'visible'});
    await stickyPage.locator('[data-bts-sticky-add] button').click();
    await stickyPage.waitForFunction(()=>document.getElementById('bts-drawer').open);
    assert.ok(!await stickyPage.locator('[data-bts-sticky-add]').isVisible());
    assert.equal(await stickyPage.locator('[data-bts-count]').textContent(),'1');
    await stickyPage.keyboard.press('Escape');
    await stickyPage.locator('[data-bts-sticky-add]').waitFor({state:'visible'});
    assert.ok(await stickyPage.locator('[data-bts-sticky-add] button').evaluate(node=>node===document.activeElement));
    await stickyPage.locator('footer').scrollIntoViewIfNeeded();
    await stickyPage.locator('[data-bts-sticky-add]').waitFor({state:'hidden'});
    report.checks.push('PDP sticky add shares cart, respects sheets/footer, returns focus');
  } catch(error) {report.failures.push({label:'PDP sticky flow',error:String(error)});console.error('FAIL PDP sticky '+error);}
  finally {await stickyContext.close();}
  const noJs = await browser.newContext({javaScriptEnabled:false,viewport:{width:375,height:667}});
  const page = await noJs.newPage();
  for(const locale of ['en','ar']) for(const surface of ['home','pdp']) {
    await page.goto(`${origin}/?surface=${surface}&locale=${locale}&media=1`);
    assert.ok(await page.locator('.pf__buy [data-bts-add]').first().isDisabled());assert.equal(await page.locator('[data-part="turn"]:visible').count(),0);
    assert.ok(await page.locator('[data-bts-marker]').isVisible());
    if(surface==='pdp') assert.ok(await page.locator('[id="inci-daily-reset-cleanser"]').isVisible());
    report.checks.push('no-JS '+locale+' '+surface);
  }
  await noJs.close();
} catch(error) {
  report.failures.push({label:'additional browser checks',error:String(error)});console.error('FAIL additional checks '+error);
} finally {
  await browser.close();await new Promise(done=>server.close(done));
  await mkdir(resolve(root,'test-results'),{recursive:true});await writeFile(resolve(root,process.env.BTS_BROWSER_CELLS?'test-results/browser-rerun-report.json':'test-results/browser-report.json'),JSON.stringify(report,null,2));
}
console.log(`${report.checks.length} local browser cells passed; ${report.failures.length} failed.`);
if(report.failures.length) process.exitCode=1;
