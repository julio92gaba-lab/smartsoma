const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM, VirtualConsole } = require('jsdom');

const source = fs.readFileSync('scripts/native-auth.js', 'utf8');
const original = fs.readFileSync('login.html', 'utf8');
const html = original
  .replace("const LINK_PARAMS = (window.location.hash || '') + '&' + (window.location.search || '');", "const LINK_PARAMS = (window.location.hash || '') + '&' + (window.location.search || '');\n    const IS_NATIVE_AUTH_CALLBACK = /[?&]native_oauth_(?:code|error)=/.test(window.location.search);")
  .replace("if (!data.session || IS_RECOVERY_LINK || modo === 'novaSenha') return;", "if (!data.session || IS_RECOVERY_LINK || IS_NATIVE_AUTH_CALLBACK || modo === 'novaSenha') return;")
  .replace('</body>', '<script>' + source + '</script></body>');

function openLogin(t, { callback = false } = {}) {
  const calls = { errors: [] };
  let resolveExchange;
  const session = { access_token: 'fake-access', refresh_token: 'fake-refresh' };
  const base = { auth: {
    async getSession() { return { data: { session: callback ? session : null } }; },
    async getUser() { calls.getUser = true; return { data: { user: {} }, error: null }; },
    onAuthStateChange() {},
    async setSession(tokens) { calls.tokens = tokens; return { data: { session }, error: null }; }
  } };
  const oauth = { auth: {
    async resetPasswordForEmail(email, options) { calls.reset = { email, options }; return { error: null }; },
    exchangeCodeForSession(code) { calls.code = code; return new Promise(resolve => { resolveExchange = resolve; }); }
  } };
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => calls.errors.push(error.message));
  const dom = new JSDOM(html, {
    url: 'https://localhost/login.html' + (callback ? '?native_oauth_code=test-code' : ''),
    runScripts: 'dangerously', virtualConsole,
    beforeParse(window) {
      if (callback) window.localStorage.setItem('smartsoma-android-auth-flow', 'recovery');
      window.supabase = { createClient: (url, key, options) => options ? oauth : base };
      window.Capacitor = { Plugins: { NativeAuth: {} } };
    }
  });
  t.after(() => dom.window.close());
  return { w: dom.window, calls, finishExchange: () => resolveExchange({ data: { session }, error: null }) };
}

const settle = () => new Promise(resolve => setImmediate(resolve));

test('native login form sends recovery to the Android callback', async t => {
  const { w, calls } = openLogin(t);
  w.document.getElementById('btnForgot').click();
  w.document.getElementById('inputEmail').value = 'teste@example.invalid';
  w.document.getElementById('btnMain').click();
  await settle();
  assert.equal(calls.reset.email, 'teste@example.invalid');
  assert.equal(calls.reset.options.redirectTo, 'pt.smartsoma.app://auth/callback');
  assert.equal(w.localStorage.getItem('smartsoma-android-auth-flow'), 'recovery');
  assert.deepEqual(calls.errors, []);
});

test('native recovery waits for the code exchange even with an existing session', async t => {
  const { w, calls, finishExchange } = openLogin(t, { callback: true });
  await settle();
  assert.equal(calls.getUser, undefined);
  assert.equal(w.document.getElementById('btnMain').disabled, true);
  assert.notEqual(w.document.getElementById('loginTitle').textContent, 'Nova palavra-passe');
  finishExchange();
  await settle();
  assert.equal(w.document.getElementById('loginTitle').textContent, 'Nova palavra-passe');
  assert.equal(w.document.getElementById('btnMain').disabled, false);
  assert.equal(calls.tokens.access_token, 'fake-access');
  assert.equal(w.localStorage.getItem('smartsoma-android-auth-flow'), null);
  assert.deepEqual(calls.errors, []);
});
