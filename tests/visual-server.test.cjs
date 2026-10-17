const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createVisualServer } = require('./serve-ui.cjs');

test('visual QA serves only the synthetic app and blocks production connections', async t => {
  const server = createVisualServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const base = 'http://127.0.0.1:' + server.address().port;
  const page = await fetch(base + '/__ui-test');
  const html = await page.text();
  assert.equal(page.status, 200);
  assert.match(page.headers.get('content-security-policy'), /connect-src 'none'/);
  assert.match(page.headers.get('content-security-policy'), /worker-src 'none'/);
  assert.match(html, /\/tests\/visual-fixture\.js/);
  assert.doesNotMatch(html, /<script[^>]+(?:cloud-init|supabase|pwa-install)/);
  for (const resource of ['/app.html','/login.html','/cloud-init.js','/supabase.min.js','/sw.js','/api/delete-account.js']) {
    assert.equal((await fetch(base + resource)).status, 404, resource);
  }
  for (const resource of ['/app.js','/ui-v2.js','/ui-v2.css','/car.png','/fonts/DMSans-latin.woff2']) {
    assert.equal((await fetch(base + resource)).status, 200, resource);
  }
  assert.equal((await fetch(base + '/__ui-test', {method:'POST'})).status, 405);
});
