const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { createApp } = require('./app-harness.cjs');

const source = [...fs.readFileSync('app.html', 'utf8').matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/g)]
  .map(match => match[1]).find(script => script.includes("const btnEliminar  ="));
const gate = [...fs.readFileSync('app.html', 'utf8').matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/g)]
  .map(match => match[1]).find(script => script.includes('window.SmartSomaPro ='));
const settle = () => new Promise(resolve => setTimeout(resolve, 20));

function setup(t, native = false, status = 200, warning = null) {
  const app = createApp();
  t.after(app.close);
  const calls = [];
  app.w.supabaseClient = { auth: {
    getSession: async () => ({ data: { session: { access_token: 'test-token' } } }),
    signOut: async () => { calls.push(['signOut']); }
  } };
  app.w.alert = message => calls.push(['alert', message]);
  if (native) {
    app.w.Capacitor = { isNativePlatform: () => true, getPlatform: () => 'android', Plugins: {
      CapacitorHttp: { post: async options => { calls.push(['native', options]); return { status, data: status === 200 ? { ok: true, warning } : { error: 'falha' } }; } }
    } };
  } else {
    app.w.fetch = async (url, options) => { calls.push(['web', url, options]); return { ok: status === 200, json: async () => status === 200 ? { ok: true } : { error: 'falha' } }; };
  }
  app.w.eval(source);
  return { ...app, calls };
}

test('subscription gate opens the same confirmation without deleting and can cancel', t => {
  const a = setup(t);
  a.el('appRoot').inert = true;
  a.el('subExpiradaBackdrop').classList.add('visible');
  a.click('subExpiradaEliminarBtn');
  assert.equal(a.el('eliminarContaBackdrop').classList.contains('visible'), true);
  assert.ok(Number(a.el('eliminarContaBackdrop').style.zIndex) > 100000);
  assert.deepEqual(a.calls, []);
  a.click('eliminarContaCancelarBtn');
  assert.equal(a.el('eliminarContaBackdrop').classList.contains('visible'), false);
  assert.equal(a.el('subExpiradaBackdrop').classList.contains('visible'), true);
  assert.equal(a.el('appRoot').inert, true);
  assert.deepEqual(a.calls, []);
});

test('subscription rechecks do not dismiss the account deletion confirmation', async t => {
  const a = setup(t);
  let checks = 0;
  a.w._cacheReady = true;
  a.w.supabaseClient.auth.onAuthStateChange = () => {};
  a.w.supabaseClient.from = () => ({ select() { return this; }, eq() { return this; }, async maybeSingle() { checks++; return { data: null, error: null }; } });
  a.w.eval(gate);
  await settle();
  assert.equal(a.el('subExpiradaBackdrop').classList.contains('visible'), true);
  a.click('subExpiradaEliminarBtn');
  await settle();
  assert.equal(a.el('eliminarContaBackdrop').classList.contains('visible'), true);
  assert.equal(a.el('subExpiradaBackdrop').classList.contains('visible'), false);
  a.w.dispatchEvent(new a.w.Event('online'));
  await settle();
  await new Promise(resolve => setTimeout(resolve, 4200));
  assert.ok(checks >= 3);
  assert.equal(a.el('eliminarContaBackdrop').classList.contains('visible'), true);
  assert.equal(a.el('subExpiradaBackdrop').classList.contains('visible'), false);
  assert.equal(a.el('appRoot').inert, true);
  assert.deepEqual(a.calls, []);
  a.click('eliminarContaCancelarBtn');
  await settle();
  assert.equal(a.el('eliminarContaBackdrop').classList.contains('visible'), false);
  assert.equal(a.el('subExpiradaBackdrop').classList.contains('visible'), true);
  assert.equal(a.el('appRoot').inert, true);
});

test('web deletion preserves the same-origin endpoint and remains signed in on failure', async t => {
  const a = setup(t, false, 500);
  a.click('subExpiradaEliminarBtn');
  a.click('eliminarContaConfirmBtn');
  await settle();
  assert.equal(a.calls[0][0], 'web');
  assert.equal(a.calls[0][1], '/api/delete-account');
  assert.equal(a.calls[0][2].headers.Authorization, 'Bearer test-token');
  assert.deepEqual(a.calls.map(call => call[0]), ['web', 'alert']);
  assert.equal(a.el('eliminarContaConfirmBtn').disabled, false);
});

test('Android uses the native HTTP plugin for the authenticated endpoint', async t => {
  const a = setup(t, true);
  a.w.localStorage.setItem('ss_plano_offline:isolated-test', 'test');
  a.click('subExpiradaEliminarBtn');
  a.click('eliminarContaConfirmBtn');
  await settle();
  assert.equal(a.calls[0][0], 'native');
  assert.equal(a.calls[0][1].url, 'https://www.smartsoma.pt/api/delete-account');
  assert.equal(a.calls[0][1].headers.Authorization, 'Bearer test-token');
  assert.equal(a.calls[0][1].disableRedirects, true);
  assert.deepEqual(a.calls.map(call => call[0]), ['native', 'signOut']);
  assert.equal(a.w.localStorage.getItem('ss_plano_offline:isolated-test'), null);
});

test('Android does not sign out or clear local data when deletion fails', async t => {
  const a = setup(t, true, 500);
  a.w.localStorage.setItem('ss_plano_offline:isolated-test', 'test');
  a.click('subExpiradaEliminarBtn');
  a.click('eliminarContaConfirmBtn');
  await settle();
  assert.deepEqual(a.calls.map(call => call[0]), ['native', 'alert']);
  assert.equal(a.w.localStorage.getItem('ss_plano_offline:isolated-test'), 'test');
  assert.equal(a.el('eliminarContaConfirmBtn').disabled, false);
});

test('Android shows a cleanup warning before signing out', async t => {
  const a = setup(t, true, 200, 'Contacta o suporte sobre os anexos.');
  a.click('subExpiradaEliminarBtn');
  a.click('eliminarContaConfirmBtn');
  await settle();
  assert.deepEqual(a.calls.map(call => call[0]), ['native', 'alert', 'signOut']);
  assert.equal(a.calls[1][1], 'Contacta o suporte sobre os anexos.');
});
