import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { renderFixture } from '../tests/render-fixture.mjs';
const root = resolve(import.meta.dirname, '..');
const port = Number(process.env.BTS_PREVIEW_PORT || 8787);
const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://127.0.0.1');
    if (url.pathname.startsWith('/assets/')) {
      const path = resolve(root, '.' + url.pathname);
      if (!path.startsWith(root + '/assets/')) throw new Error('Invalid asset path');
      const type = path.endsWith('.js') ? 'text/javascript' : path.endsWith('.css') ? 'text/css' : path.endsWith('.svg') ? 'image/svg+xml' : 'application/octet-stream';
      response.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' });
      response.end(await readFile(path)); return;
    }
    const locale = url.pathname.startsWith('/ar') ? 'ar' : 'en';
    const prefix = locale === 'ar' ? '/ar' : '';
    if (url.pathname === '/localization' && request.method === 'POST') {
      let body = ''; for await (const chunk of request) body += chunk;
      const language = new URLSearchParams(body).get('language_code');
      const referer = new URL(request.headers.referer || '/', `http://127.0.0.1:${port}`);
      const path = referer.pathname.replace(/^\/ar(?=\/|$)/, '') || '/';
      response.writeHead(303, { Location: (language === 'ar' ? '/ar' : '') + path + referer.search }); response.end(); return;
    }
    const nativeProduct = url.pathname.endsWith('/search') && url.searchParams.get('view') === 'product';
    const surface = nativeProduct ? 'pdp' : url.pathname.endsWith('/search') ? url.searchParams.get('view') === 'routine' ? 'routine' : 'search' : url.pathname.endsWith('/cart') ? 'cart' : url.pathname.includes('/collections/') ? 'collection' : 'home';
    const handle = nativeProduct ? url.searchParams.get('q') || '' : 'daily-reset-cleanser';
    const routes = { root_url: prefix || '/', search_url: prefix + '/search', cart_url: prefix + '/cart', all_products_collection_url: prefix + '/collections/all' };
    const html = await renderFixture({ locale, surface, handle, media: false, measurements: 'seed', extra: { pages: {}, page: {}, product: {}, routes, template: { name: surface === 'pdp' ? 'search' : surface, suffix: nativeProduct ? 'product' : '' }, search: { terms: url.searchParams.get('q') || '' }, canonical_url: `http://127.0.0.1:${port}${url.pathname}${url.search}` } });
    response.writeHead(200, { 'Content-Type': 'text/html', 'Cache-Control': 'no-store' }); response.end(html);
  } catch (error) { response.writeHead(500, { 'Content-Type': 'text/plain' }); response.end(String(error)); }
});
server.listen(port, '127.0.0.1', () => console.log(`BTS local fixture review: http://127.0.0.1:${port} | Arabic: /ar | Shopify drops simulated; no product imagery, Admin access or live checkout.`));
