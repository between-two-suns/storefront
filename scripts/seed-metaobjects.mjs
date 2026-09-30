// Offline review plan only. No token, API client, network call, mutation or publication path exists.
import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '..');
if (process.argv.slice(2).some(arg => arg !== '--dry-run')) {
  console.error('Dry-run only. Admin writes are not implemented or authorized.');
  process.exit(1);
}
const config = JSON.parse(await readFile(resolve(root, 'data/prototype/config.json'), 'utf8'));
const contract = JSON.parse(await readFile(resolve(root, 'data/content/product-contract.json'), 'utf8'));
const products = [];
for (const file of await readdir(resolve(root, 'data/content/products'))) {
  if (!file.endsWith('.json')) continue;
  const seed = JSON.parse(await readFile(resolve(root, 'data/content/products', file), 'utf8'));
  const values = { ...seed.fields, ...seed.translations, claims: seed.claims, key_ingredients: seed.key_ingredients || [] };
  const fields = [];
  for (const [key, value] of Object.entries(values)) {
    if (value === null || value === undefined) continue; // no invalid reference placeholders
    if (!(key in contract.fields)) throw new Error('Unmapped content key: ' + key);
    fields.push({ key, value: contract.fields[key] === 'json' ? JSON.stringify(value) : String(value) });
  }
  products.push({ type: seed.type, handle: seed.handle, fields });
}
console.log(JSON.stringify({ dry_run: true, admin_calls: 0, proposed_definition: contract, proposed_review_definition: JSON.parse(await readFile(resolve(root, 'data/content/reviews/review-contract.json'), 'utf8')), proposed_reviews: [], proposed_media_definition: JSON.parse(await readFile(resolve(root, 'data/content/media-contract.json'), 'utf8')), proposed_config: { type: 'bts_prototype_config', handle: 'default', fields: [{ key: 'config', value: JSON.stringify(config) }] }, proposed_products: products, note: 'Local plan only. No definitions, entries, media or preview Pages have been created. Public storefront access/entry approval, real H1 media and authored Arabic require a later authorized content operation.' }, null, 2));
