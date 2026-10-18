const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { createApp } = require('./app-harness.cjs');

const settle = () => new Promise(resolve => setTimeout(resolve, 40));
const gate = [...fs.readFileSync('app.html', 'utf8').matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/g)]
  .map(match => match[1]).find(source => source.includes('window.SmartSomaPro ='));
const key = 'ss_plano_offline:isolated-test';

async function startGate(t, control, saved, online = true) {
  const a = createApp();
  t.after(a.close);
  await settle();
  if (saved) a.w.localStorage.setItem(key, saved);
  Object.defineProperty(a.w.navigator, 'onLine', { value: online, configurable: true });
  a.w._cacheReady = true;
  a.w.supabaseClient = {
    auth: { onAuthStateChange() {} },
    from(table) {
      assert.equal(table, 'subscriptions');
      return { select() { return this; }, eq() { return this; }, maybeSingle() { return control.query(); } };
    }
  };
  a.w.eval(gate);
  await settle();
  return a;
}

test('valid trial is cached per user and supports a fresh offline launch', async t => {
  const end = new Date(Date.now() + 2 * 86400000).toISOString();
  const online = await startGate(t, { query: async () => ({ data: { status: 'trialing', trial_ends_at: end }, error: null }) });
  const saved = online.w.localStorage.getItem(key);
  assert.ok(saved);
  assert.equal(JSON.parse(saved).until, Date.parse(end));
  const offline = await startGate(t, { query: () => { throw new Error('unexpected request'); } }, saved, false);
  assert.equal(offline.w.SmartSomaPro.isPro, true);
  assert.equal(offline.w.SmartSomaPro.entitlementChecked, false);
  assert.equal(offline.el('subExpiradaBackdrop').classList.contains('visible'), false);
});

test('offline access expires when the trial ends, including while the app is open', async t => {
  const now = Date.now();
  const end = new Date(now + 60000).toISOString();
  const saved = JSON.stringify({ sub: { status: 'trialing', trial_ends_at: end }, checkedAt: now, until: Date.parse(end) });
  const a = await startGate(t, { query: () => { throw new Error('unexpected request'); } }, saved, false);
  assert.equal(a.w.SmartSomaPro.isPro, true);
  a.w.Date.now = () => Date.parse(end) + 1;
  a.w.dispatchEvent(new a.w.Event('offline'));
  assert.equal(a.w.SmartSomaPro.isPro, false);
  assert.match(a.el('subExpiradaTitle').textContent, /ligação necessária/i);
});

test('expired, future-dated and other-user caches cannot unlock offline access', async t => {
  const now = Date.now();
  for (const saved of [
    { sub: { status: 'trialing' }, checkedAt: now - 2000, until: now - 1000 },
    { sub: { status: 'active' }, checkedAt: now + 10000, until: now + 20000 },
    null
  ]) {
    const a = await startGate(t, { query: () => { throw new Error('unexpected request'); } }, saved && JSON.stringify(saved), false);
    assert.equal(a.w.SmartSomaPro.isPro, false);
    assert.equal(a.el('subExpiradaBackdrop').classList.contains('visible'), true);
    assert.match(a.el('subExpiradaTitle').textContent, /ligação necessária/i);
    assert.equal(a.w.document.querySelector('.sub-expired-plans').style.display, 'none');
  }
});

test('reconnection revalidates before confirming access and rejects cancelled entitlement', async t => {
  const now = Date.now();
  let resolveQuery;
  const control = { query: () => new Promise(resolve => { resolveQuery = resolve; }) };
  const saved = JSON.stringify({ sub: { status: 'active' }, checkedAt: now, until: now + 60000 });
  const a = await startGate(t, control, saved, false);
  Object.defineProperty(a.w.navigator, 'onLine', { value: true, configurable: true });
  a.w.dispatchEvent(new a.w.Event('online'));
  assert.equal(a.w.SmartSomaPro.entitlementChecked, false);
  resolveQuery({ data: { status: 'canceled', current_period_end: '2020-01-01' }, error: null });
  await settle();
  assert.equal(a.w.SmartSomaPro.isPro, false);
  assert.equal(a.w.localStorage.getItem(key), null);
  assert.equal(a.el('subExpiradaBackdrop').classList.contains('visible'), true);
});

test('network failures use the cache, but server errors do not', async t => {
  const now = Date.now();
  const saved = JSON.stringify({ sub: { status: 'active' }, checkedAt: now, until: now + 60000 });
  const network = await startGate(t, { query: async () => ({ data: null, error: { message: 'Failed to fetch' } }) }, saved);
  assert.equal(network.w.SmartSomaPro.isPro, true);
  assert.equal(network.w.SmartSomaPro.entitlementChecked, false);
  const denied = await startGate(t, { query: async () => ({ data: null, error: { message: 'permission denied', status: 403 } }) }, saved);
  assert.equal(denied.w.SmartSomaPro.isPro, false);
});

test('routine sync is silent and queued offline changes wait for server entitlement', async t => {
  const a = createApp({}, { cloudBoot: true });
  t.after(a.close);
  for (let i = 0; i < 20 && !a.w._cacheReady; i++) await settle();
  await a.w.cloudSet('silent-test', 'ok');
  const chip = a.el('cloudSyncChip');
  assert.ok(!chip || chip.style.opacity !== '1');
  const realSetTimeout=a.w.setTimeout.bind(a.w), realClearTimeout=a.w.clearTimeout.bind(a.w);
  let dismissOffline;
  a.w.setTimeout=(fn,delay)=>delay===4000?(dismissOffline=fn,987654):realSetTimeout(fn,delay);
  a.w.clearTimeout=id=>id===987654?undefined:realClearTimeout(id);
  Object.defineProperty(a.w.navigator, 'onLine', { value: false, configurable: true });
  a.w.dispatchEvent(new a.w.Event('offline'));
  await a.w.cloudSet('offline-test', 'saved');
  assert.match(a.el('cloudSyncChip').textContent, /sem rede/i);
  assert.equal(a.el('cloudSyncChip').style.opacity,'1');
  dismissOffline();
  assert.equal(a.el('cloudSyncChip').style.opacity,'0');
  await a.w.cloudFlushPendingWrites();
  assert.equal(a.el('cloudSyncChip').style.opacity,'0');
  a.w.SmartSomaPro.entitlementChecked = false;
  Object.defineProperty(a.w.navigator, 'onLine', { value: true, configurable: true });
  a.w.dispatchEvent(new a.w.Event('online'));
  await settle();
  assert.ok(!a.writes.some(row => row.key === 'offline-test'));
  assert.match(a.w.localStorage.getItem('ss_q:isolated-test'), /offline-test/);
  a.w.SmartSomaPro.entitlementChecked = true;
  await a.w.cloudFlushPendingWrites();
  assert.ok(a.writes.some(row => row.key === 'offline-test'));
  assert.equal(a.w.localStorage.getItem('ss_q:isolated-test'), null);
  assert.ok(a.el('cloudSyncChip').style.opacity !== '1');
});

test('offline boot renders the current interface even when the app script loads after DOM ready', async t => {
  const a = createApp({offlineSample:'guardado'}, {cloudBoot:true, ui:true, offlineStart:true, delayedAppScript:true});
  t.after(a.close);
  for (let i=0; i<30 && !a.w.document.body.classList.contains('ui-v2'); i++) await settle();
  assert.equal(a.w._cacheReady,true);
  assert.equal(a.w.cloudGet('offlineSample'),'guardado');
  assert.ok(a.w.document.body.classList.contains('ui-v2'));
  assert.ok(a.w.document.querySelector('.ui-header'));
  await a.w.cloudSet('offline-edit','novo');
  assert.match(a.w.localStorage.getItem('ss_q:isolated-test'),/offline-edit/);
  assert.equal(a.writes.length,0);
  assert.deepEqual(a.errors,[]);
});
