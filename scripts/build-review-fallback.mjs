import {readFile,writeFile} from 'node:fs/promises';
const handles=['daily-reset-cleanser','clarity-serum','daily-barrier-moisturizing-cream','daily-defense-sunscreen-spf-50','the-full-routine'];
const config=JSON.parse(await readFile('data/prototype/config.json','utf8'));
const text=value=>String(value??'');
async function emit(file, content) {
  if(process.argv.includes('--check')) {
    if(await readFile(file,'utf8') !== content) throw new Error('Stale review fallback: '+file);
  } else await writeFile(file,content);
}
let output=`{% doc %}
Explicit review-setting field fallback generated from approved local seeds.
@param {string} handle - Approved product identity
@param {string} field - Scalar field name
@param {metaobject} [content] - Storefront-readable content
{% enddoc %}
{%- liquid
  assign language = request.locale.iso_code | split: '-' | first
  assign localized_fields = 'role,promise,suitability,back_description,does,feels_like,formula_logic,how_to_use' | split: ','
-%}
{%- if content != blank -%}
  {%- if localized_fields contains field -%}
    {%- render 'bts-localized', field: content[field].value -%}
  {%- elsif field == 'usage_times' or field == 'components' -%}
    {{- content[field].value | join: '|' -}}
  {%- else -%}{{- content[field].value -}}{%- endif -%}
{%- elsif settings.bts_review_fallback == true -%}
  {%- case handle -%}\n`;
for(const handle of handles){
 const p=JSON.parse(await readFile(`data/content/products/${handle}.json`,'utf8'));
 const fields={...p.fields};
 for(const [key,value] of Object.entries(p.translations))fields[key]=value;
 fields.claim_labels=p.claims?.filter(c=>c.approved.en&&c.label.approved.en).map(c=>c.label.en).join('|')||'';
 const suffix=p.fields.key||'routine';
 const snippet='bts-review-'+suffix+'-fields';
 output+=`  {%- when '${handle}' -%}{%- render '${snippet}', field: field, language: language -%}\n`;
 let entry=`{% doc %}\nGenerated approved review scalars.\n@param {string} field - Scalar key\n@param {string} language - Locale\n{% enddoc %}\n{%- case field -%}\n`;
 for(const [field,value] of Object.entries(fields)){
  if(value===null)continue;
  entry+=`    {%- when '${field}' -%}`;
  if(localized(fields[field])){
   const approved=value.approved.en&&value.en;
   if(approved)entry+=`{%- if language == 'en' -%}${text(approved).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')}{%- endif -%}`;
  }else if(field==='claim_labels')entry+=`{%- if language == 'en' -%}${text(value)}{%- endif -%}`;
  else entry+=text(Array.isArray(value)?value.join('|'):value);
  entry+='\n';
 }
 entry+=`{%- endcase -%}\n`;
 await emit('snippets/'+snippet+'.liquid',entry);
}
output+=`  {%- endcase -%}\n{%- endif -%}\n`;
await emit('snippets/bts-content-field.liquid',output);
let pricing=`{% doc %}
Scenario-derived review display value; does not set any Shopify price.
@param {string} [handle] - Product identity or routine
@param {string} [field] - routine_list, routine_save, currency, or config_json
{% enddoc %}
{%- liquid
  assign config = metaobjects.bts_prototype_config.default.config.value
  assign scenario = config.scenarios[config.scenario]
-%}
{%- if config != blank -%}
  {%- case field -%}
    {%- when 'config_json' -%}{{- config | json -}}
    {%- when 'currency' -%}{{- config.currency -}}
    {%- when 'routine_list' -%}{{- scenario.routine.list -}}
    {%- when 'routine_save' -%}{{- scenario.routine.save -}}
    {%- else -%}{%- if handle == 'the-full-routine' -%}{{- scenario.routine.price -}}{%- else -%}{{- scenario.prices[handle] -}}{%- endif -%}
  {%- endcase -%}
{%- elsif settings.bts_review_fallback == true -%}
  {%- case field -%}
    {%- when 'config_json' -%}${JSON.stringify(config)}
    {%- when 'currency' -%}${config.currency}
    {%- when 'routine_list' -%}${config.scenarios[config.scenario].routine.list}
    {%- when 'routine_save' -%}${config.scenarios[config.scenario].routine.save}
    {%- else -%}{%- case handle -%}\n`;
for(const [handle,price] of Object.entries({...config.scenarios[config.scenario].prices,'the-full-routine':config.scenarios[config.scenario].routine.price}))pricing+=`      {%- when '${handle}' -%}${price}\n`;
pricing+=`    {%- endcase -%}\n  {%- endcase -%}\n{%- endif -%}\n`;
await emit('snippets/bts-review-price-value.liquid',pricing);
function localized(value){return value&&typeof value==='object'&&!Array.isArray(value)&&value.approved;}
