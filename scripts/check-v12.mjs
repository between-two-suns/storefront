import { readFile,readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { gzipSync } from 'node:zlib';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
const root=resolve(import.meta.dirname,'..');
const files={};
const mediaSafety=JSON.parse(await readFile(resolve(root,'data/media-safety.json'),'utf8'));
for(const asset of await readdir(resolve(root,'assets'))) {
 if(!/\.(png|webp|jpg|jpeg|gif|avif)$/i.test(asset)) continue;
 assert.equal(asset,mediaSafety.allowed_interim.file,'Only the recorded Barrier interim raster is permitted');
 assert.equal(createHash('sha256').update(await readFile(resolve(root,'assets',asset))).digest('hex'),mediaSafety.allowed_interim.sha256,'Barrier byte parity');
}

for(const dir of ['assets','sections','snippets','templates','locales','layout','config']) {
 for(const file of await readdir(resolve(root,dir))) {
  if(!/\.(liquid|json|css|js)$/.test(file)) continue;
  const path=dir+'/'+file;const text=await readFile(resolve(root,path),'utf8');files[path]=text;
  if(file.endsWith('.json')) JSON.parse(text);
  if(file.endsWith('.liquid')) {
   const schema=text.match(/{%\s*schema\s*%}([\s\S]*?){%\s*endschema\s*%}/);
   if(schema) JSON.parse(schema[1]);
   for(const match of text.matchAll(/{%[-\s]*render\s+'([^']+)'/g)) assert.ok(await readFile(resolve(root,'snippets',match[1]+'.liquid'),'utf8'),'Missing snippet');
  }
 }
}
for(const [path,text] of Object.entries(files)) {
 assert.doesNotMatch(text,/bts-home-v|b11|clean-v11|bts\.css|bts\.js|Green Tea|Niacinimide|Prevents breakouts|Daily Face Sunscreen|SAMPLE|prototype_review|scaleX\(-1\)/,path);
 if(path.endsWith('.css')) {
  assert.doesNotMatch(text,/(?:^|[;{\s])(?:left|right|margin-left|margin-right|padding-left|padding-right|border-left|border-right|width|height|top|bottom)\s*:/,path+' logical CSS');
  assert.doesNotMatch(text,/transition:\s*all|@import/,path);
 }
 if(path.endsWith('.js')) assert.doesNotMatch(text,/innerHTML|setAttribute\(['"]aria-hidden|addEventListener\(['"]scroll['"]|scrollLeft/,path);
 if(path.startsWith('assets/')&&/\.(js|css)$/.test(path)) {
  const bytes=gzipSync(text,{level:9}).length;
  const limit=path.includes('tokens')?3072:path.includes('core')?9216:path.includes('face.js')?4096:path.includes('face.css')?5120:6144;
  assert.ok(bytes<=limit,path+' gzip budget');
  console.log(path+' gzip '+bytes+' B');
 }
}
for(const [path,text] of Object.entries(files)) if(path.startsWith('templates/')&&path.endsWith('.json')) {
 for(const section of Object.values(JSON.parse(text).sections)) assert.ok(files['sections/'+section.type+'.liquid'],path+' section reference');
}
const layout=files['layout/theme.liquid'];
assert.equal((layout.match(/{% section 'bts-header' %}/g)||[]).length,1);
assert.equal((layout.match(/{% section 'bts-footer' %}/g)||[]).length,1);
assert.equal((layout.match(/{% render 'bts-drawer' %}/g)||[]).length,1);
assert.doesNotMatch(layout,/{% sections/);
assert.equal(Object.values(files).join('').match(/data-bts-marker(?:>|\s)/g)?.length,1);
assert.equal(Object.values(files).join('').match(/data-bts-count>/g)?.length,1);
assert.doesNotMatch(files['snippets/bts-price.liquid'],/bts-internal-marker/);
assert.doesNotMatch(files['assets/bts-base.css'],/object-fit/);
assert.match(files['snippets/bts-face.liquid'],/variant == 'shelf' or variant == 'pdp'/);
assert.doesNotMatch(files['assets/bts-core.js'],/node\.hidden = true|fetch\(/);
const en=JSON.parse(files['locales/en.default.json']);const ar=JSON.parse(files['locales/ar.json']);
const paths=(v,p='')=>Object.entries(v).flatMap(([k,x])=>typeof x==='object'&&x!==null?paths(x,p+k+'.'):[p+k]);
assert.deepEqual(paths(en).sort(),paths(ar).sort());
const pendingArabic=new Set();
for(const [key,value] of Object.entries(ar.bts)) assert.ok(value || pendingArabic.has(key),'Unexpected empty Arabic UI: '+key);
for(const [path,text] of Object.entries(files)) {
 for(const m of text.matchAll(/'([\w.]+)'\s*\|\s*t(?:\s|[}:|])/g)) assert.ok(paths(en).includes(m[1]),path+' locale key '+m[1]);
}
const tokens=files['assets/bts-tokens.css'];
const value=key=>tokens.match(new RegExp('--'+key+':\\s*(#[0-9a-f]+)'))[1];
const luminance=hex=>{
 const channels=hex.slice(1).match(/../g).map(s=>parseInt(s,16)/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4);
 return channels[0]*.2126+channels[1]*.7152+channels[2]*.0722;
};
for(const key of ['reset','clarity','barrier','defense']) {
 const a=luminance(value('c-'+key));const b=luminance(value('on-'+key));const ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
 assert.ok(ratio>=4.5,key+' AA contrast');console.log(key+' ink contrast '+ratio.toFixed(2)+':1');
}
for(const name of ['bts-icon-ink.svg','bts-icon-white.svg','bts-wordmark-ink.svg','bts-wordmark-white.svg']) assert.deepEqual(await readFile(resolve(root,'assets',name)),await readFile(resolve(root,'opus-brand-pack/logos',name)));
const parts=JSON.parse(files['assets/bts-face.js'].match(/static parts = (\[[^;]+\]);/)[1].replace(/'/g,'"'));
for(const part of parts) assert.ok(files['snippets/bts-face.liquid'].includes('data-part="'+part+'"'),'Face part '+part);
const config=JSON.parse(await readFile(resolve(root,'data/prototype/config.json'),'utf8'));
for(const scenario of Object.values(config.scenarios)) {
 const list=Object.values(scenario.prices).reduce((sum,n)=>sum+n,0);
 assert.equal(list,scenario.routine.list);assert.equal(list-scenario.routine.price,scenario.routine.save);
 assert.ok(scenario.routine.save/list>=.095&&scenario.routine.save/list<=.105);
}
console.log('V12 structure, JSON/schemas/refs, shell, locale guards, token contrast, logos, selectors, prices and gzip checks passed.');
