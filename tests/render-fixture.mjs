// Local contract harness. Shopify drops/filters are simulated; this is not a Shopify preview.
import { Liquid } from 'liquidjs';
import { readFile, readdir, writeFile, mkdtemp, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { syntheticMedia } from './synthetic-media.mjs';
const root = resolve(import.meta.dirname, '..');
const escape = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clean = s => s.replace(/{%\s*(doc|schema)\s*%}[\s\S]*?{%\s*end\1\s*%}/g, '').replace(/{%\s*form\s+[^%]*%}/g, '<form action="/localization" method="post">').replace(/{%\s*endform\s*%}/g, '</form>');
export async function renderFixture({locale = 'en', surface = 'home', media = false, mediaHandles = null, missingConfig = false, missingContent = false, stale = false, handle = 'daily-reset-cleanser', ratio = 600/760, measurements = null, reviewFeed = null, extra = {}} = {}) {
  const directory = await mkdtemp(join(tmpdir(), 'bts-liquid-'));
  try {
    for (const file of await readdir(join(root,'snippets'))) await writeFile(join(directory,file), clean(await readFile(join(root,'snippets',file),'utf8')));
    // Snippets are immutable within this render; reuse parsed templates across
    // repeated field captures without caching content or Shopify drop values.
    const engine = new Liquid({ root: directory, extname: '.liquid', cache: true });
    const en = JSON.parse(await readFile(join(root,'locales/en.default.json'),'utf8'));
    const ar = JSON.parse(await readFile(join(root,'locales/ar.json'),'utf8'));
    engine.registerFilter('json', v => JSON.stringify(v ?? null));
    engine.registerFilter('asset_url', v => '/assets/' + v);
    engine.registerFilter('stylesheet_tag', v => `<link rel="stylesheet" href="${v}">`);
    engine.registerFilter('image_url', v => v?.url || '');
    engine.registerFilter('image_tag', (url, ...options) => {
      const opts = Object.fromEntries(options.filter(Array.isArray));
      const geometry = syntheticMedia(Number(new URL(url,'http://fixture.local').searchParams.get('ratio')) || 600/760);
      return `<img src="${url}" width="${geometry.width}" height="${geometry.height}" alt="${escape(opts.alt)}" loading="${opts.loading}" ${opts.fetchpriority ? 'fetchpriority="high"' : ''}>`;
    });
    engine.registerFilter('t', function(key, ...options) {
      const language = this.context.getSync(['request','locale','iso_code']).split('-')[0];
      const value = key.split('.').reduce((a,k) => a?.[k], language === 'ar' ? ar : en);
      if (typeof value !== 'string' || !value) throw new Error(`Missing/unapproved rendered locale key: ${key}`);
      let text = value;
      for (const [name,arg] of options.filter(Array.isArray)) text = text.replaceAll(`{{ ${name} }}`,String(arg));
      return text;
    });
    const config = JSON.parse(await readFile(join(root,'data/prototype/config.json'),'utf8'));
    const entries = [];
    for (const file of await readdir(join(root,'data/content/products'))) {
      const seed = JSON.parse(await readFile(join(root,'data/content/products',file),'utf8'));
      const fields = { ...seed.fields, ...seed.translations, claims: seed.claims, key_ingredients: seed.key_ingredients };
      const entry = Object.fromEntries(Object.entries(fields).map(([k,value]) => [k,{value}]));
      // Numeric primitives are sortable drop stand-ins, as in Shopify's step fields.
      if (entry.step) entry.step.toString = () => String(entry.step.value);
      if (media && seed.fields.kind === 'single' && (!mediaHandles || mediaHandles.includes(seed.handle))) {
        const image = {url:'/fixtures/contract-media.svg?ratio='+ratio, aspect_ratio:ratio, media_type:'image'};
        const asset = {pack_crop_approved:{value:true},role:{value:'H1'},file:{value:image},approved:{value:true},label_version:{value:stale?'STALE':'FINAL-v5'},alt:{value:{en:seed.fields.name,ar:null,approved:{en:true,ar:false}}}};
        entry.media_front = {value:asset};
      }
      // Neutral contract fixtures deliberately omit geometry; 'seed' exercises founder measurements.
      if (measurements !== 'seed') {
        entry.pack_height_mm = {value:measurements?.[seed.handle] ?? null};
        entry.pack_height_source = {value:measurements?.[seed.handle] != null ? 'SYNTHETIC TEST ONLY' : null};
      }
      entries.push(entry);
    }
    entries.sort((a,b) => (a.step?.value || 99) - (b.step?.value || 99));
    const metaobjects = Object.fromEntries(entries.map(e => [e.product_handle.value,e]));
    metaobjects.values = missingContent ? [] : entries;
    if (missingContent) for (const key of Object.keys(metaobjects)) if (key !== 'values') delete metaobjects[key];
    const pages = Object.fromEntries(entries.map(e => ['preview-'+e.product_handle.value,{url:'/pages/preview-'+e.product_handle.value}]));
    const context = {
      request:{locale:{iso_code:locale}},localization:{available_languages:[{iso_code:'en',endonym_name:'English'},{iso_code:'ar',endonym_name:'العربية'}],language:{iso_code:locale.split('-')[0]}},
      shop:{metaobjects:{bts_product_content:metaobjects,bts_review_feed:reviewFeed?{[handle]:{product_handle:{value:handle},feed:{value:reviewFeed}}}:{},bts_prototype_config:{default:{config:{value:missingConfig?null:config}}}}},
      metaobjects:{bts_product_content:metaobjects,bts_review_feed:reviewFeed?{[handle]:{product_handle:{value:handle},feed:{value:reviewFeed}}}:{},bts_prototype_config:{default:{config:{value:missingConfig?null:config}}}},
      settings:{bts_mode:'launch',bts_launch_confirmed:true,bts_qty_max:6},
      routes:{root_url:locale.startsWith('ar')?'/ar':'/',cart_url:'/cart',all_products_collection_url:'/collections/all',search_url:'/search'},
      cart:{currency:{iso_code:'EGP'}},pages,
      search:{terms:extra.search?.terms || ''},
      page: surface === 'pdp' ? {handle:'preview-'+handle,metafields:{bts:{content:{value:metaobjects[handle]}}}} : {},
      section:{id:'fixture-main',settings:{}},page_title:'Local contract fixture',canonical_url:'http://127.0.0.1/',content_for_header:'', ...extra
    };
    engine.options.globals = context;
    const render = async (file, scope = context) => engine.parseAndRender(clean(await readFile(join(root,file),'utf8')),scope);
    context.content_for_layout = surface === 'money' ? await engine.parseAndRender("{% render 'bts-money', amount: money_amount, currency: 'EGP' %}", context) : surface === 'compact' ? await engine.parseAndRender("<h1>Local fixture</h1>{% render 'bts-face', content: shop.metaobjects.bts_product_content['daily-reset-cleanser'], variant: 'search', uid: 'compact' %}", context) : await render('sections/'+(surface==='pdp'?'bts-product':surface==='cart'?'bts-cart':surface==='collection'?'bts-collection':surface==='routine'?'bts-routine':surface==='search'?'bts-search':surface==='page'?'bts-page':'bts-home')+'.liquid');
    let shell = clean(await readFile(join(root,'layout/theme.liquid'),'utf8'));
    for (const name of ['bts-header','bts-footer']) shell = shell.replace(`{% section '${name}' %}`,'<div class="shopify-section '+(name==='bts-header'?'bts-global-header':'')+'">'+await render('sections/'+name+'.liquid',{...context,section:{id:name,settings:{}}})+'</div>');
    return await engine.parseAndRender(shell,context);
  } finally { await rm(directory,{recursive:true,force:true}); }
}
