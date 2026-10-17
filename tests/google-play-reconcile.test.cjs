'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { googlePlayAccountId } = require('../lib/google-play-entitlement.cjs');
const { reconcileGooglePlayPurchase, parseGooglePlayNotification } = require('../lib/google-play-reconcile.cjs');

const user = '11111111-1111-4111-8111-111111111111';
const secret = 'a1'.repeat(32);
const now = Date.parse('2026-10-17T10:00:00Z');
function fixture(state = 'SUBSCRIPTION_STATE_ACTIVE', ack = 'ACKNOWLEDGEMENT_STATE_PENDING') {
  const events = [];
  const purchase = { subscriptionState: state, acknowledgementState: ack,
    externalAccountIdentifiers: { obfuscatedExternalAccountId: googlePlayAccountId(user, secret) },
    lineItems: [{ productId: 'pro-monthly', expiryTime: '2026-11-17T10:00:00Z' }] };
  let ackFails = false;
  const args = { record: { user_id: user, purchase_token: 'fake-secret-token' }, accountSecret: secret,
    productIds: ['pro-monthly'], clock: () => now, getGoogleAccessToken: async () => 'fake-oauth',
    supabase: { rpc: async (name, data) => { events.push([name, data]); return { data: true }; } },
    fetchImpl: async (url, options) => { events.push([options.method]);
      return options.method === 'POST' ? { ok: !ackFails } : { ok: true, json: async () => purchase }; } };
  return { args, events, purchase, failAck: () => { ackFails = true; } };
}

test('refreshes renewals and confirms only after recording the latest verified state', async () => {
  const f = fixture();
  assert.deepEqual(await reconcileGooglePlayPurchase(f.args), { status: 'refreshed' });
  assert.deepEqual(f.events.map(x => x[0]), ['GET', 'save_verified_google_play_purchase', 'POST']);
  assert.equal(f.events[1][1].p_user_id, user);
  assert.equal(f.events[1][1].p_subscription_state, 'SUBSCRIPTION_STATE_ACTIVE');
});

test('records canceled, suspended, pending and expired states without granting access', async () => {
  for (const state of ['SUBSCRIPTION_STATE_PENDING', 'SUBSCRIPTION_STATE_ON_HOLD', 'SUBSCRIPTION_STATE_PAUSED',
    'SUBSCRIPTION_STATE_EXPIRED', 'SUBSCRIPTION_STATE_PENDING_PURCHASE_CANCELED']) {
    const f = fixture(state);
    assert.deepEqual(await reconcileGooglePlayPurchase(f.args), { status: 'refreshed' });
    assert.equal(f.events[1][1].p_subscription_state, state);
    assert.equal(f.events.some(x => x[0] === 'POST'), false);
  }
  const canceled = fixture('SUBSCRIPTION_STATE_CANCELED', 'ACKNOWLEDGEMENT_STATE_ACKNOWLEDGED');
  assert.deepEqual(await reconcileGooglePlayPurchase(canceled.args), { status: 'refreshed' });
  assert.equal(canceled.events[1][1].p_subscription_state, 'SUBSCRIPTION_STATE_CANCELED');
});

test('never stores unsupported accounts, states, products, or linked purchases', async () => {
  const mutations = [
    p => { p.externalAccountIdentifiers.obfuscatedExternalAccountId = 'other'; },
    p => { p.subscriptionState = 'UNKNOWN'; },
    p => { p.acknowledgementState = 'UNKNOWN'; },
    p => { p.lineItems[0].productId = 'other'; },
    p => { p.lineItems[0].expiryTime = 'invalid'; },
    p => { p.linkedPurchaseToken = 'old-token'; },
    p => { p.outOfAppPurchaseContext = {}; }
  ];
  for (const mutate of mutations) {
    const f = fixture(); mutate(f.purchase);
    assert.deepEqual(await reconcileGooglePlayPurchase(f.args), { status: 'unsupported' });
    assert.deepEqual(f.events.map(x => x[0]), ['GET']);
  }
});

test('failed acknowledgement remains pending for a subsequent retry', async () => {
  const f = fixture(); f.failAck();
  assert.deepEqual(await reconcileGooglePlayPurchase(f.args), { status: 'confirmation_pending' });
  assert.equal(f.events[1][1].p_acknowledgement_state, 'ACKNOWLEDGEMENT_STATE_PENDING');
  assert.doesNotMatch(JSON.stringify(f.events[0]), /secret/);
});

test('storage conflicts and provider errors do not confirm a purchase or leak secrets', async () => {
  const f = fixture(); f.args.supabase.rpc = async () => ({ data: false });
  assert.deepEqual(await reconcileGooglePlayPurchase(f.args), { status: 'conflict' });
  assert.equal(f.events.some(x => x[0] === 'POST'), false);
  const broken = fixture(); broken.args.getGoogleAccessToken = async () => { throw new Error('fake-secret-token'); };
  await assert.rejects(reconcileGooglePlayPurchase(broken.args), { message: 'Google Play reconciliation unavailable' });
});

test('notification parser accepts only a bounded matching-package hint, never an entitlement', () => {
  const encode = obj => Buffer.from(JSON.stringify(obj)).toString('base64');
  const valid = { packageName: 'pt.smartsoma.app', subscriptionNotification: { purchaseToken: 'test-token', notificationType: 1 } };
  assert.deepEqual(parseGooglePlayNotification({ data: encode(valid) }), { purchaseToken: 'test-token' });
  for (const data of ['!', '', 'A'.repeat(16385), encode({ ...valid, packageName: 'other' }),
    encode({ ...valid, subscriptionNotification: { purchaseToken: '..' } }), encode({ packageName: valid.packageName })]) {
    assert.equal(parseGooglePlayNotification({ data }), null);
  }
});
