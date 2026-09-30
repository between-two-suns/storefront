import test from 'node:test';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {canonicalCSS} from './css-asset-parity.mjs';

test('hosted CSS parity accepts minification and rejects cascade or value changes', async () => {
  const browser = await chromium.launch({executablePath: process.env.BTS_CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
  try {
    const page = await browser.newPage();
    const canonical = source => page.evaluate(canonicalCSS, source);
    const source = `.a { width: min(100%, calc(2px * var(--n))); transition-duration: 300ms; }
      .b[hidden] { visibility: hidden; } .c[hidden] { visibility: hidden; }
      @media (min-width: 990px) { .a:is([data-x="one"], [data-x="two"]) { opacity: .8; } }`;
    const minified = `.a{width:min(100%,calc(2px * var(--n)));transition-duration:.3s}
      .b[hidden],.c[hidden]{visibility:hidden}
      @media(min-width:990px){.a:is([data-x='one'],[data-x='two']){opacity:.8}}`;
    assert.equal(await canonical(source), await canonical(minified));
    assert.notEqual(await canonical(source), await canonical(minified.replace('2px', '3px')));
    assert.notEqual(await canonical(source), await canonical(minified.replace('990px', '991px')));
    assert.notEqual(await canonical(source), await canonical(minified.replace('.c[hidden]', '.d[hidden]')));
    assert.notEqual(await canonical('.a{color:red}.a{color:blue}'), await canonical('.a{color:blue}.a{color:red}'));
    assert.notEqual(await canonical('.a .b{color:red}'), await canonical('.a.b{color:red}'));
    assert.notEqual(await canonical('.a{content:"a, b"}'), await canonical('.a{content:"a,b"}'));
    assert.notEqual(await canonical('.a{content:"300ms"}'), await canonical('.a{content:"0.3s"}'));
  } finally { await browser.close(); }
});
