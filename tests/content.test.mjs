import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateProduct } from '../scripts/check-label-parity.mjs';
import { renderFixture } from './render-fixture.mjs';
const source = await readFile(new URL('../opus-brand-pack/FINAL_LABEL_SOURCE_OF_TRUTH.md',import.meta.url),'utf8');
const labels = JSON.parse(await readFile(new URL('../data/labels.json',import.meta.url),'utf8'));
const original = JSON.parse(await readFile(new URL('../data/content/products/clarity-serum.json',import.meta.url),'utf8'));
const block = source.split(/## 0[1-4] — /).find(s=>s.startsWith('CLARITY SERUM'));
test('parity rejects foreign claims, reordered INCI, foreign ingredient and unapproved alias/Arabic', () => {
  for (const mutate of [p=>p.claims.push({label:{en:'Non-stripping'}}),p=>p.fields.inci=p.fields.inci.split(',').reverse().join(','),p=>p.key_ingredients[0].inci_name='Centella Asiatica Extract',p=>p.key_ingredients[2].consumer_alias_approved=false,p=>p.translations.does.ar='unapproved']) {
    const p=structuredClone(original);mutate(p); assert.ok(validateProduct(p,labels.clarity,block).length);
  }
});
test('SSR rejects missing/stale media while labelled placeholder interaction survives',async()=>{
  for(const stale of [false,true]) {
    const html=await renderFixture({media:stale,stale});
    assert.doesNotMatch(html,/contract-media\.svg/);
    assert.equal((html.match(/data-placeholder="true"/g)||[]).length,4);
    assert.match(html,/data-media-approved="false"/);
    assert.match(html,/data-pack-scale="neutral"/);
    assert.match(html,/Removes oil\. Maintains hydration\. Feels fresh\./);
    assert.equal((html.match(/data-bts-marker/g)||[]).length,1);
    assert.match(html,/noindex,nofollow/);
    assert.match(html,/data-bts-mode="prototype"/); // settings switches cannot enable launch
  }
});
test('approved Home/PDP media enable signature; compact and collection stay static',async()=>{
  const home=await renderFixture({media:true});assert.equal((home.match(/<bts-product-face/g)||[]).length,4);
  const pdp=await renderFixture({surface:'pdp',media:true});assert.equal((pdp.match(/<bts-product-face/g)||[]).length,1);assert.match(pdp,/id="inci-daily-reset-cleanser"/);
  for(const surface of ['compact','cart']) assert.doesNotMatch(await renderFixture({surface,media:true}),/<bts-product-face|data-part="back"|class="pf__stage"|class="pf__card"/);
});
test('Arabic fields hide without English fallback; Latin label names/INCI remain isolated',async()=>{
  for(const locale of ['ar','ar-EG']) {
    const html=await renderFixture({locale,media:true,surface:'pdp'});
    assert.match(html,/dir="rtl"/);assert.doesNotMatch(html,/Removes oil|Non-stripping|Soap-free|In this formula|Turn over/);
    assert.match(html,/lang="en" dir="ltr"/);assert.match(html,/daily-reset-cleanser/);assert.match(html,/__AMOUNT__ __CURRENCY__/);
  }
});
test('Liquid money contract matches grouping/rounding/pattern and missing config hides amounts',async()=>{
  for(const locale of ['en','ar']) {
    const html=await renderFixture({locale});const amount=locale==='en'?'EGP 399':'399 ج.م';assert.ok(html.includes('>'+amount+'</bdi>'));
    assert.doesNotMatch(await renderFixture({locale,missingConfig:true}),/data-bts-money/);
  }
  const html=await renderFixture({missingContent:true});assert.doesNotMatch(html,/data-bts-add=/);
});

test('Liquid formatter groups and rounds minor units identically to the JS contract',async()=>{
  for(const locale of ['en','ar']) for(const amount of [0,99900,166100,166149,166150,98765400]) {
    const text=Math.round(amount/100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const expected=locale==='en'?'EGP '+text:text+' ج.م';
    assert.ok((await renderFixture({locale,surface:'money',extra:{money_amount:amount}})).includes('>'+expected+'</bdi>'));
  }
});


test('ingredient why rejects formula attribution even with exact approved source wording', () => {
  const p=structuredClone(original);
  p.key_ingredients[0].why={en:'Helps even skin tone',ar:null,approved:{en:true,ar:false}};
  assert.ok(validateProduct(p,labels.clarity,block).includes('why ingredient attribution'));
  p.key_ingredients[0].attribution_approved=true;
  assert.deepEqual(validateProduct(p,labels.clarity,block),[]);
});
test('AR H1 uses proper-name alt, no back or English alt sentence; invalid ratio hides stage',async()=>{
  const html=await renderFixture({locale:'ar',media:true});
  assert.match(html,/alt="Daily Reset Cleanser"/);
  assert.equal((html.match(/data-part="stage"/g)||[]).length,4);
  assert.doesNotMatch(html,/<bts-product-face|data-part="back"/);
  for(const ratio of [null,0,-1]) { const rejected=await renderFixture({media:true,ratio}); assert.doesNotMatch(rejected,/contract-media.svg/); assert.match(rejected,/data-placeholder="true"/); }
});
test('pack scale requires all sourced exact measurements; never estimate missing dimensions',async()=>{
  const heights={'daily-reset-cleanser':210,'clarity-serum':175,'daily-barrier-moisturizing-cream':195,'daily-defense-sunscreen-spf-50':205};
  assert.match(await renderFixture({media:true}),/data-pack-scale="neutral"/);
  assert.match(await renderFixture({media:true,measurements:'seed'}),/data-pack-scale="measured"/);
  assert.match(await renderFixture({measurements:'seed'}),/data-pack-scale="neutral"/);
  assert.match(await renderFixture({media:true,measurements:heights}),/data-pack-scale="measured"/);
  for(const value of [null,0,-1,2.5]) assert.match(await renderFixture({media:true,measurements:{...heights,'clarity-serum':value}}),/data-pack-scale="neutral"/);
});
test('routine and SSR search work without Page creation, savings hide on missing config',async()=>{
  const home=await renderFixture();assert.match(home,/\/search\?view=routine/);assert.match(home,/data-routine-offer="strip"/);
  const routine=await renderFixture({surface:'routine'});assert.match(routine,/data-bts-add="the-full-routine"/);
  assert.match(routine,/EGP 1,661/);assert.match(routine,/EGP 185/);
  assert.doesNotMatch(await renderFixture({surface:'routine',missingConfig:true}),/data-routine-offer|data-bts-add="the-full-routine"/);
  const search=await renderFixture({surface:'search',extra:{search:{terms:'clarity'}}});assert.match(search,/pf__name[^>]*[\s\S]*Clarity Serum/);assert.doesNotMatch(search,/id="pf-fixture-main-1-name"/);
  assert.match(await renderFixture({surface:'search',extra:{search:{terms:'zzzz'}}}),/No results/);
});

test('every shelf back renders the complete approved description without a sentence transformation',async()=>{
  const html=await renderFixture({media:true});
  const escaped=text=>text.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const descriptions=[...html.matchAll(/<p class="pf__description">([^<]*)<\/p>/g)].map(match=>match[1]);
  assert.deepEqual(descriptions,Object.values(labels).map(label=>escaped(label.back_description)));
});

test('global Routine navigation uses the localized Home strip and the strip keeps its route fallback',async()=>{
  for(const locale of ['en','ar']) {
    const home=await renderFixture({locale});
    const root=locale==='ar'?'/ar':'/';
    assert.ok(home.includes(`href="${root}#bts-home-routine"`));
    assert.match(home,/id="bts-home-routine"/);
    assert.match(home,/href="\/search\?view=routine"[^>]*data-bts-open="bts-routine"/);
    const pdp=await renderFixture({locale,surface:'pdp'});
    assert.ok(pdp.includes(`href="${root}#bts-home-routine"`));
  }
});

 test('placeholder AR turn contains no translated claims and collection retains portrait static frames', async()=>{
 const ar=await renderFixture({locale:'ar'}); assert.equal((ar.match(/<bts-product-face/g)||[]).length,4); assert.match(ar,/data-media-approved="false"/); assert.doesNotMatch(ar,/Removes oil|Controls oil|Non-stripping/);
 const grid=await renderFixture({surface:'collection'});assert.equal((grid.match(/data-placeholder="true"/g)||[]).length,4);assert.doesNotMatch(grid,/<bts-product-face|data-part="back"/);
 const missing=await renderFixture({missingConfig:true});assert.doesNotMatch(missing,/bts-routine-panel|bts-routine-totals|data-routine-offer/);
 });
