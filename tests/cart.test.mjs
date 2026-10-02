import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
const code=await readFile(new URL('../assets/bts-core.js',import.meta.url),'utf8');
const config=JSON.parse(await readFile(new URL('../data/prototype/config.json',import.meta.url),'utf8'));
const catalog={};
for(const [handle,price] of Object.entries(config.scenarios.B.prices)) catalog[handle]={name:'label name '+handle,role:'',size:'',colour:''};
catalog['the-full-routine']={name:'The Full Routine'};
function setup({stored='[]',blocked=false,data=config,locale='en',catalogData=catalog,reviewOnly=false}={}) {
 const sandbox={document:{body:{dataset:{btsReview:String(reviewOnly)}},documentElement:{lang:locale},getElementById:id=>({textContent:JSON.stringify(id==='bts-proto'?data:id==='bts-catalog'?catalogData:{pattern:locale==='en'?'__CURRENCY__ __AMOUNT__':'__AMOUNT__ __CURRENCY__',currency_label:locale==='en'?'EGP':'ج.م'})}),querySelectorAll:()=>[],addEventListener:()=>{}},window:{addEventListener:()=>{}},localStorage:{getItem(){if(blocked)throw Error('denied');return stored;},setItem(k,v){if(blocked)throw Error('denied');stored=v;}},console,URLSearchParams,location:{search:'?founder=1'}};
 vm.runInNewContext(code,sandbox);return sandbox.window.BTS;
}
test('catalog names and price totals come from approved metadata/config; unknown handles rejected',async()=>{
 const bts=setup();await bts.adapter.add([{handle:'daily-reset-cleanser',qty:2},{handle:'unknown',qty:1}]);const cart=await bts.adapter.get();
 assert.equal(cart.count,2);assert.equal(cart.total,config.scenarios.B.prices['daily-reset-cleanser']*100*2);assert.equal(cart.lines[0].title,catalog['daily-reset-cleanser'].name);
 await bts.adapter.change('daily-reset-cleanser',999);assert.equal((await bts.adapter.get()).count,6);await bts.adapter.remove('daily-reset-cleanser');assert.equal((await bts.adapter.get()).count,0);
});
test('explicit routine swap consumes one of each single and is idempotent',async()=>{
 const bts=setup();await bts.adapter.add(Object.keys(config.scenarios.B.prices).map(handle=>({handle,qty:2})));await bts.adapter.swapToRoutine();const cart=await bts.adapter.get();
 assert.equal(cart.count,5);assert.equal(cart.lines.filter(l=>l.isBundle).length,1);assert.equal(cart.routineSaving,config.scenarios.B.routine.save*100);await bts.adapter.swapToRoutine();assert.equal((await bts.adapter.get()).count,5);
});
test('missing catalog/config, corrupt storage and denied storage remain safe',async()=>{
 for(const options of [{data:null},{catalogData:{}},{stored:'malformed'},{stored:'[null, {"handle":"unknown","qty":2}]'},{blocked:true}]) {
  const bts=setup(options);assert.equal((await bts.adapter.get()).count,0);await bts.adapter.add([{handle:'unknown',qty:2}]);assert.equal((await bts.adapter.get()).count,0);
 }
});
test('stored carts resolve current scenario; normalized money has same explicit pattern',async()=>{
 const a=structuredClone(config);a.scenario='A';const handle='daily-reset-cleanser';const bts=setup({data:a,stored:JSON.stringify([{handle,qty:1}])});assert.equal((await bts.adapter.get()).total,a.scenarios.A.prices[handle]*100);
 assert.equal(bts.money(166100,'EGP'),'EGP 1,661');assert.equal(setup({locale:'ar'}).money(166100,'EGP'),'1,661 ج.م');assert.equal(bts.money(166149,'EGP'),'EGP 1,661');assert.equal(bts.money(166150,'EGP'),'EGP 1,662');assert.equal(bts.money(NaN,'EGP'),'—');assert.equal(bts.money(0,''),'—');
});
test('dormant launch adapter refuses mutations and does not expose checkout',async()=>{
 const bts=setup();assert.equal(bts.mode,'prototype');const launch=new bts.ShopifyCartAdapter();for(const action of ['add','change','remove','swapToRoutine'])await assert.rejects(launch[action]());assert.equal('checkout' in bts.adapter,false);
});

test('explicit Shopify review ignores stored bag items and refuses prototype additions',async()=>{
 const handle='daily-reset-cleanser';const bts=setup({reviewOnly:true,stored:JSON.stringify([{handle,qty:2}])});
 assert.equal((await bts.adapter.get()).count,0);await bts.adapter.add([{handle,qty:1}]);await bts.adapter.swapToRoutine();assert.equal((await bts.adapter.get()).count,0);
});
