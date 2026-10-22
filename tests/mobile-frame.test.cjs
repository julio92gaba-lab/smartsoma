const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

test('the app uses a single fluid mobile layout in every browser viewport', () => {
  const html = fs.readFileSync('app.html', 'utf8');
  const css = fs.readFileSync('ui-v2.css', 'utf8');
  const sw = fs.readFileSync('sw.js', 'utf8');
  assert.doesNotMatch(html, /mobile-frame\.js/);
  assert.doesNotMatch(css, /--app-max-width/);
  assert.match(css, /html\.ui-v2 \{ --app-gutter:0px; background:var\(--paper\); \}/);
  assert.match(css, /body\.ui-v2 \{ width:100%; max-width:none; margin:0; min-height:100dvh;/);
  assert.match(css, /#homeListPageSemana \.semana-live-content,[\s\S]*\.semana-week-block \{ box-sizing:border-box; width:100%; max-width:100%; min-width:0; margin-inline:0; \}/);
  assert.match(css, /\.semana-goal-card-head,[\s\S]*\.semana-goal-card-footer \{ flex-wrap:wrap; min-width:0; \}/);
  assert.match(css, /\.ui-entry-dialog \{[^}]*inset:calc\(var\(--ui-header\) \+ 24px\) auto auto 50%;[^}]*transform:translateX\(-50%\)/);
  assert.match(css, /\.ss-driver-card \{ display:none !important; \}/);
  assert.doesNotMatch(sw, /mobile-frame/);
});

test('week filters reflow safely when the app font is enlarged', () => {
  const css = fs.readFileSync('ui-v2.css', 'utf8');
  assert.doesNotMatch(css, /text-size-adjust/);
  assert.match(css, /\.semana-filter-controls\.is-sticky\s*\{[^}]*display:flex;[^}]*flex-wrap:wrap;/);
  assert.match(css, /\.semana-live-content\s*\{\s*grid-template-columns:minmax\(0,1fr\);\s*\}/);
  assert.match(css, /\.semana-live-content > \*\s*\{\s*min-width:0;\s*max-width:100%;\s*\}/);
  assert.match(css, /\.semana-filter-fields\s*\{\s*flex:1 1 100%;\s*\}/);
  assert.match(css, /\.semana-view-controls\s*\{\s*flex:1 1 100%;\s*justify-content:center;\s*\}/);
  assert.match(css, /#subHeaderViewToggleGroup\s*\{[^}]*width:fit-content;[^}]*max-width:100%;/);
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
