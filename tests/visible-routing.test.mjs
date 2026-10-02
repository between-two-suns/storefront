import test from 'node:test';
import assert from 'node:assert/strict';
import { renderFixture } from './render-fixture.mjs';

test('absent preview Pages link to the localized native product view; unknown handles reveal no product', async () => {
  for (const locale of ['en', 'ar']) {
    const routes = { root_url: locale === 'ar' ? '/ar' : '/', search_url: locale === 'ar' ? '/ar/search' : '/search', all_products_collection_url: '/collections/all', cart_url: '/cart' };
    const html = await renderFixture({ locale, extra: { pages: {}, routes } });
    assert.ok(html.includes(`href="${routes.search_url}?view=product&q=clarity-serum"`));
    const native = await renderFixture({ locale, surface: 'pdp', extra: { page: {}, product: {}, pages: {}, routes, template: { name: 'search', suffix: 'product' }, search: { terms: 'clarity-serum' } } });
    assert.match(native, /<h1[^>]*[\s\S]*Clarity Serum/);
    assert.match(native, /data-presentation="placeholder"/);
    assert.doesNotMatch(native, /contract-media/);
    const unknown = await renderFixture({ locale, surface: 'pdp', extra: { page: {}, product: {}, template: { name: 'search', suffix: 'product' }, search: { terms: 'unknown-product' } } });
    assert.doesNotMatch(unknown, /data-bts-primary-add|data-editorial-product/);
  }
});
