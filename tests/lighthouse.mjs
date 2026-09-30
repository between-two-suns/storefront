// Performance smoke on local Shopify stand-ins. Results are not release budgets or media/device QA.
import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { renderFixture } from './render-fixture.mjs';
const root=resolve(import.meta.dirname,'..');
const server=createServer(async(req,res)=>{
 try {
  const url=new URL(req.url,'http://127.0.0.1');
  if(url.pathname==='/robots.txt') { res.setHeader('Content-Type','text/plain');res.end('User-agent: *\nAllow: /\n');return; }
  if(url.pathname.startsWith('/assets/')) {
   const file=resolve(root,'.'+url.pathname);if(!file.startsWith(root+'/assets/'))throw Error('path');
   res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'image/svg+xml');res.end(await readFile(file));return;
  }
  res.setHeader('Content-Type','text/html');res.end(await renderFixture({locale:url.searchParams.get('locale')||'en',surface:url.searchParams.get('surface')||'home'}));
 } catch(error){res.statusCode=500;res.end(String(error));}
});
await new Promise(done=>server.listen(0,'127.0.0.1',done));
const chrome=await launch({chromePath:process.env.BTS_CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',chromeFlags:['--headless','--no-first-run','--no-default-browser-check']});
const summaries=[];
try {
 await mkdir(resolve(root,'test-results'),{recursive:true});
 for(const [surface,locale] of [['home','en'],['pdp','en'],['home','ar']]) {
  const result=await lighthouse(`http://127.0.0.1:${server.address().port}/?surface=${surface}&locale=${locale}`,{port:chrome.port,output:'json',logLevel:'error',onlyCategories:['performance','accessibility','best-practices','seo']});
  await writeFile(resolve(root,`test-results/lighthouse-${surface}-${locale}.json`),result.report);
  const lhr=result.lhr;
  const summary={surface,locale,scope:'LOCAL FIXTURE WITHOUT H1 MEDIA/SHOPIFY SCRIPTS/FONTS',scores:Object.fromEntries(Object.entries(lhr.categories).map(([k,v])=>[k,v.score*100])),LCP:lhr.audits['largest-contentful-paint'].numericValue,CLS:lhr.audits['cumulative-layout-shift'].numericValue,TBT:lhr.audits['total-blocking-time'].numericValue};
  summaries.push(summary);console.log(JSON.stringify(summary));
 }
} finally {
 await chrome.kill();await new Promise(done=>server.close(done));
 await writeFile(resolve(root,'test-results/lighthouse-summary.json'),JSON.stringify(summaries,null,2));
}
