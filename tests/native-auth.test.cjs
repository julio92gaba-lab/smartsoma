const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync('scripts/native-auth.js', 'utf8');
function harness(search = '', options = {}) {
  const calls = { messages: [], removed: [], loading: [], modes: [] };
  const storage = new Map(options.recovery ? [['smartsoma-android-auth-flow', 'recovery']] : []);
  const button = { disabled: false };
  const window = {
    location: { search, pathname: '/login.html', replace: url => { calls.navigate = url; } },
    history: { replaceState: (...args) => { calls.history = args; } },
    localStorage: {
      getItem: key => storage.get(key) || null,
      setItem: (key, value) => storage.set(key, value),
      removeItem: key => { calls.removed.push(key); storage.delete(key); }
    },
    Capacitor: { Plugins: { NativeAuth: { async openBrowser(arg) { calls.browser = arg; } } } }
  };
  const document = {
    addEventListener(type, handler, capture) { calls.handler = handler; assert.equal(capture, true); },
    getElementById() { return button; }
  };
  const oauth = { auth: {
    async signInWithOAuth(arg) { calls.oauth = arg; return { data: { url: 'https://example.invalid/authorize' }, error: null }; },
    async exchangeCodeForSession(code) { calls.code = code; return options.exchangeError ? { data: { session: null }, error: new Error('invalid') } : { data: { session: { access_token: 'access', refresh_token: 'refresh' } }, error: null }; },
    async resetPasswordForEmail(email, arg) { calls.reset = { email, ...arg }; return { error: options.resetError ? new Error('failed') : null }; }
  } };
  const sb = { auth: { async setSession(tokens) { calls.tokens = tokens; return { data: { session: {} }, error: null }; } } };
  const supabase = { createClient(url, key, options) { calls.clientOptions = options; return oauth; } };
  vm.runInNewContext(source, {
    window, document, sb, supabase, SUPABASE_URL: 'https://example.invalid', SUPABASE_KEY: 'public', URLSearchParams,
    modo: options.mode || 'login', submittingUntil: 0, inputEmail: { value: options.email || 'teste@example.invalid' },
    clearHints() {}, validateEmail: () => options.invalidEmail !== true,
    setLoading: value => calls.loading.push(value), setModo: value => calls.modes.push(value),
    handleError: error => { calls.error = error.message; }, setTimeout: fn => { calls.timer = fn; },
    toast: (...args) => calls.messages.push(args)
  });
  return { calls, button, storage };
}

test('Android Google login opens the system browser with a PKCE callback', async () => {
  const { calls, button } = harness();
  await calls.handler({ target: { closest: () => button }, preventDefault() {}, stopImmediatePropagation() {} });
  assert.equal(calls.oauth.provider, 'google');
  assert.equal(calls.oauth.options.redirectTo, 'pt.smartsoma.app://auth/callback');
  assert.equal(calls.oauth.options.skipBrowserRedirect, true);
  assert.equal(calls.clientOptions.auth.flowType, 'pkce');
  assert.equal(calls.browser.url, 'https://example.invalid/authorize');
  assert.equal(button.disabled, false);
});

test('Android callback removes the code from the URL and exchanges it for a session', async () => {
  const { calls } = harness('?native_oauth_code=test-code');
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(calls.code, 'test-code');
  assert.equal(calls.history[2], '/login.html');
  assert.equal(calls.tokens.access_token, 'access');
  assert.ok(calls.removed.includes('smartsoma-android-oauth'));
  assert.equal(calls.navigate, 'app.html');
});

test('Android recovery sends a PKCE email to the existing app callback', async () => {
  const { calls, button, storage } = harness('', { mode: 'recuperar' });
  let stopped = false;
  await calls.handler({ target: { closest: selector => selector === '#btnMain' ? button : null }, preventDefault() {}, stopImmediatePropagation() { stopped = true; } });
  assert.equal(stopped, true);
  assert.equal(calls.reset.email, 'teste@example.invalid');
  assert.equal(calls.reset.redirectTo, 'pt.smartsoma.app://auth/callback');
  assert.equal(storage.get('smartsoma-android-auth-flow'), 'recovery');
  assert.deepEqual(calls.loading, [true, false]);
  assert.match(calls.messages[0][2], /neste telemóvel/);
});

test('Android recovery opens the password form only after exchanging the PKCE code', async () => {
  const { calls, storage } = harness('?native_oauth_code=recovery-code', { recovery: true });
  assert.deepEqual(calls.loading, [true]);
  assert.equal(calls.modes.length, 0);
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(calls.code, 'recovery-code');
  assert.equal(calls.tokens.access_token, 'access');
  assert.deepEqual(calls.modes, ['novaSenha']);
  assert.deepEqual(calls.loading, [true, false]);
  assert.equal(calls.navigate, undefined);
  assert.equal(storage.has('smartsoma-android-auth-flow'), false);
});

test('Android recovery fails safely for an invalid or expired link', async () => {
  const { calls, storage } = harness('?native_oauth_code=expired', { recovery: true, exchangeError: true });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(calls.tokens, undefined);
  assert.equal(calls.modes.length, 0);
  assert.equal(calls.navigate, undefined);
  assert.match(calls.messages[0][1], /inválido ou expirado/);
  assert.equal(storage.has('smartsoma-android-auth-flow'), false);
});

test('Android recovery does not send invalid email or retain state on request failure', async () => {
  const invalid = harness('', { mode: 'recuperar', invalidEmail: true });
  await invalid.calls.handler({ target: { closest: selector => selector === '#btnMain' ? invalid.button : null }, preventDefault() {}, stopImmediatePropagation() {} });
  assert.equal(invalid.calls.reset, undefined);
  const failed = harness('', { mode: 'recuperar', resetError: true });
  await failed.calls.handler({ target: { closest: selector => selector === '#btnMain' ? failed.button : null }, preventDefault() {}, stopImmediatePropagation() {} });
  assert.equal(failed.calls.error, 'failed');
  assert.equal(failed.storage.has('smartsoma-android-auth-flow'), false);
});

test('Android callback works on cold launch without changing the web login', () => {
  const activity = fs.readFileSync('android/app/src/main/java/pt/smartsoma/app/MainActivity.java', 'utf8');
  const prepare = fs.readFileSync('scripts/prepare-capacitor.cjs', 'utf8');
  const login = fs.readFileSync('login.html', 'utf8');
  assert.match(activity, /handleAuthCallback\(getIntent\(\)\)/);
  assert.match(activity, /onNewIntent[\s\S]*handleAuthCallback\(intent\)/);
  assert.match(activity, /intent\.setData\(null\)/);
  assert.match(prepare, /IS_NATIVE_AUTH_CALLBACK/);
  assert.doesNotMatch(login, /IS_NATIVE_AUTH_CALLBACK/);
});

test('Android callback reports cancellation without opening the app', () => {
  const { calls } = harness('?native_oauth_error=1');
  assert.equal(calls.messages.length, 1);
  assert.equal(calls.navigate, undefined);
});
