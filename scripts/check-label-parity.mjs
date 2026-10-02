import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '..');
const source = await readFile(resolve(root, 'opus-brand-pack/FINAL_LABEL_SOURCE_OF_TRUTH.md'), 'utf8');
const labels = JSON.parse(await readFile(resolve(root, 'data/labels.json'), 'utf8'));
const normalize = s => String(s).replace(/\s+/g, ' ').trim();
export function validateProduct(seed, label, block) {
  const errors = [];
  const eq = (key, a, b) => { if (normalize(a) !== normalize(b)) errors.push(key); };
  eq('name', seed.fields.name, label.name); eq('size_label', seed.fields.size_label, label.size); eq('size_display', seed.fields.size_display, label.size);
  if (seed.fields.pack_height_mm !== null && (!Number.isInteger(seed.fields.pack_height_mm) || seed.fields.pack_height_mm <= 0 || !seed.fields.pack_height_source)) errors.push('pack height exact/source');
  if (seed.translations.feels_like.en !== null) errors.push('unapproved texture');
  if (seed.translations.formula_logic.en === seed.translations.back_description.en) errors.push('duplicate formula logic');
  eq('inci', seed.fields.inci, label.inci); eq('inci_version', seed.fields.inci_version, 'FINAL-v5');
  eq('does', seed.translations.does.en, label.front_line); eq('promise', seed.translations.promise.en, label.front_line);
  eq('back_description', seed.translations.back_description.en, label.back_description);
  for (const key of ['name','front_line','hero_actives','size','back_description','inci']) {
    if (!normalize(block).includes(normalize(label[key]))) errors.push('label mirror ' + key);
  }
  for (const claim of seed.claims) if (claim.approved?.en !== true || claim.approved?.ar !== false || claim.source !== 'label_pill') errors.push('claim locale approval/source');
  const sourcePills = block.includes('Back claim pills:') ? block.split('Back claim pills:\n')[1].split('\n\n')[0].split('\n').map(s => s.replace(/^- /, '')) : [];
  eq('pill mirror', JSON.stringify(label.pills), JSON.stringify(sourcePills));
  eq('claims exact', JSON.stringify(seed.claims.map(c => c.label.en)), JSON.stringify(label.pills));
  if (seed.key_ingredients.length !== 3) errors.push('exactly three ingredients');
  const inciTokens = label.inci.replace(/\.$/, '').split(',').map(normalize);
  for (const ingredient of seed.key_ingredients) {
    if (!inciTokens.includes(ingredient.inci_name)) errors.push('foreign INCI ingredient');
    if (!block.includes(ingredient.display_name.en)) errors.push('foreign consumer ingredient');
    if (ingredient.display_name.en === 'Hyaluronic Acid' && !ingredient.consumer_alias_approved) errors.push('unapproved Hyaluronic Acid alias');
    const why = ingredient.why.en;
    if (why != null) {
      if (ingredient.why.approved.en !== true || !block.includes(why) || why.length > 80) errors.push('why provenance/limit');
      const sentences = label.back_description.match(/[^.!?]+[.!?]?/g) || [];
      const attributed = sentences.some(sentence => sentence.includes(ingredient.display_name.en) && sentence.includes(why));
      if (!attributed && ingredient.attribution_approved !== true) errors.push('why ingredient attribution');
    } else if (ingredient.why.approved.en !== false) errors.push('null why approval');
  }
  for (const field of Object.values(seed.translations)) if (field.en && !['Cleanse','Treat','Moisturize','Protect'].includes(field.en) && !block.includes(field.en)) errors.push('copy outside product label');
  const localized = [...Object.values(seed.translations), ...seed.claims.map(c => c.label), ...seed.key_ingredients.flatMap(i => [i.display_name,i.why])];
  for (const field of localized) if (field.ar !== null || field.approved.ar !== false) errors.push('Arabic unapproved');
  for (const field of ['media_front','media_back','media_swatch','media_application','media_emotional']) if (seed.fields[field] !== null) errors.push('unapproved media');
  return errors;
}
let errors = 0;
for (const file of await readdir(resolve(root, 'data/content/products'))) {
  const seed = JSON.parse(await readFile(resolve(root, 'data/content/products', file), 'utf8'));
  if (seed.fields.kind === 'bundle') continue;
  const label = labels[seed.fields.key];
  const block = source.split(/## 0[1-4] — /).find(b => b.startsWith(label.name.toUpperCase()));
  const failures = validateProduct(seed, label, block);
  if (failures.length) { console.error(file, failures); errors += failures.length; }
}
if (errors) process.exitCode = 1;
else console.log('Per-product exact label/INCI/pill/ingredient/excerpt parity and null AR/media passed.');
