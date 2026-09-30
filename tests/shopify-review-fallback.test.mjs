import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {renderFixture} from './render-fixture.mjs';
const theme={id:166903251202};
const fallback={missingContent:true,missingConfig:true,extra:{theme,pages:{},page:{},product:{},all_products:{}}};
const handles=['daily-reset-cleanser','clarity-serum','daily-barrier-moisturizing-cream','daily-defense-sunscreen-spf-50'];
test('native review fallback renders four sourced identities and prices without products or metaobjects',async()=>{
 const html=await renderFixture(fallback);
 assert.equal((html.match(/data-placeholder="true"/g)||[]).length,4);
 for(const handle of handles){const seed=JSON.parse(await readFile(`data/content/products/${handle}.json`,'utf8'));assert.ok(html.includes(seed.fields.name));assert.ok(html.includes(seed.translations.promise.en));assert.ok(html.includes(seed.fields.inci));}
 for(const price of ['39900','49900','44900','166100','18500'])assert.ok(html.includes(`data-amount="${price}"`));
 assert.match(html,/bts-story__campaign/);assert.match(html,/bts-story__texture/);assert.match(html,/bts-story__proof/);assert.match(html,/bts-routine-editorial/);
 assert.match(html,/data-composition-scale="physical-preview"/);assert.match(html,/data-pack-scale="neutral"/);
 assert.equal((html.match(/data-bts-purchasable="false"/g)||[]).length,9);
 assert.doesNotMatch(html,/<form[^>]+action="[^\"]*cart\/add|href="\/checkout|contract-media/);
});
test('review fallback stays scoped to the unpublished theme, preserves Arabic approval gates, and rejects unknown PDP handles',async()=>{
 const other=await renderFixture({...fallback,extra:{...fallback.extra,theme:{id:166832668930}}});assert.doesNotMatch(other,/data-placeholder="true"|data-bts-add=/);
 const ar=await renderFixture({...fallback,locale:'ar'});assert.equal((ar.match(/data-placeholder="true"/g)||[]).length,4);assert.doesNotMatch(ar,/Removes oil|Controls oil|Non-stripping|Non-comedogenic/);
 const unknown=await renderFixture({...fallback,surface:'pdp',extra:{...fallback.extra,template:{name:'search',suffix:'product'},search:{terms:'unknown'}}});assert.doesNotMatch(unknown,/data-bts-primary-add|data-editorial-product/);
 const pdp=await renderFixture({...fallback,surface:'pdp',extra:{...fallback.extra,template:{name:'search',suffix:'product'},search:{terms:'clarity-serum'}}});assert.match(pdp,/<h1[^>]+class="pf__name"/);assert.match(pdp,/id="inci-clarity-serum"/);
});
