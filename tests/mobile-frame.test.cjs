const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

test('the app uses a single mobile layout with a bounded responsive width', () => {
  const html = fs.readFileSync('app.html', 'utf8');
  const css = fs.readFileSync('ui-v2.css', 'utf8');
  const sw = fs.readFileSync('sw.js', 'utf8');
  assert.doesNotMatch(html, /mobile-frame\.js/);
  assert.match(css, /--app-max-width:600px/);
  assert.match(css, /width:min\(100%,var\(--app-max-width\)\)/);
  assert.match(css, /max-width:var\(--app-max-width\)/);
  assert.match(css, /--app-gutter:max\(0px,calc\(\(100vw - var\(--app-max-width\)\) \/ 2\)\)/);
  assert.match(css, /#homeListPageSemana \.semana-live-content,[\s\S]*margin-inline:0/);
  assert.match(css, /\.ui-entry-dialog \{[^}]*inset:calc\(var\(--ui-header\) \+ 24px\) auto auto 50%;[^}]*transform:translateX\(-50%\)/);
  assert.match(css, /\.ss-driver-card \{ display:none !important; \}/);
  assert.doesNotMatch(sw, /mobile-frame/);
});

test('old frame links safely redirect once to the original app route', () => {
  const shell = fs.readFileSync('mobile-frame-shell.js', 'utf8');
  function redirect(target) {
    let result;
    const window = { location: { origin:'https://example.test', hash:'#'+encodeURIComponent(target), replace(value) { result=value; } } };
    vm.runInNewContext(shell, { window, URL });
    return result;
  }
  assert.equal(redirect('/app.html?x=1#result'), '/app.html?x=1#result');
  assert.equal(redirect('https://evil.test/app'), '/app');
  assert.equal(redirect('/login'), '/app');
  assert.doesNotMatch(shell, /addEventListener|resize|iframe/i);
  assert.doesNotMatch(fs.readFileSync('mobile-frame.html', 'utf8'), /<iframe/i);
});

test('the app remains protected from external framing', () => {
  const headers = JSON.parse(fs.readFileSync('vercel.json', 'utf8')).headers[0].headers;
  assert.match(headers.find(h => h.key === 'Content-Security-Policy').value, /frame-ancestors 'none'/);
  assert.equal(headers.find(h => h.key === 'X-Frame-Options').value, 'DENY');
});
