'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { googlePlayAccountId, stopGooglePlayPayments } = require('../lib/google-play-entitlement.cjs');
const { prepareGooglePlayAccountDeletion } = require('../lib/google-play-delete-guard.cjs');
const user = '11111111-1111-4111-8111-111111111111';
const secret = 'a1'.repeat(32);

function fixture() {
  const calls = [];
  let canceled = false, failCancel = false, skipTransition = false;
  const purchase = { subscriptionState: 'SUBSCRIPTION_STATE_ACTIVE',
    externalAccountIdentifiers: { obfuscatedExternalAccountId: googlePlayAccountId(user, secret) },
    lineItems: [{ productId: 'pro-monthly', expiryTime: '2026-11-17T10:00:00Z', autoRenewingPlan: { autoRenewEnabled: true } }] };
  const fetchImpl = async (url, options) => {
    calls.push({ url, method: options.method, body: options.body });
    if (options.method === 'POST') { canceled = true; return { ok: !failCancel }; }
    const result = structuredClone(purchase);
    if (canceled && !skipTransition) { result.subscriptionState = 'SUBSCRIPTION_STATE_CANCELED'; result.lineItems[0].autoRenewingPlan.autoRenewEnabled = false; }
    return { ok: true, json: async () => result };
  };
  const args = { userId: user, records: [{ user_id: user, purchase_token: 'secret-token' }], accountSecret: secret,
    productIds: ['pro-monthly'], getGoogleAccessToken: async () => 'secret-oauth', fetchImpl };
  return { args, purchase, calls, fail: () => { failCancel = true; }, delay: () => { skipTransition = true; } };
}

test('confirmed deletion stops future payments and rechecks Google before allowing deletion', async () => {
  const f = fixture();
  assert.deepEqual(await prepareGooglePlayAccountDeletion(f.args), { safe: true });
  assert.deepEqual(f.calls.map(x => x.method), ['GET', 'POST', 'GET']);
  assert.match(f.calls[1].url, /subscriptionsv2\/tokens\/secret-token:cancel$/);
  assert.deepEqual(JSON.parse(f.calls[1].body), { cancellationContext: { cancellationType: 'DEVELOPER_REQUESTED_STOP_PAYMENTS' } });
});

test('failed or unconfirmed cancellation stops deletion', async () => {
  for (const setup of [f => f.fail(), f => f.delay()]) {
    const f = fixture(); setup(f);
    assert.deepEqual(await prepareGooglePlayAccountDeletion(f.args), { safe: false });
  }
  const f = fixture(); f.purchase.subscriptionState = 'SUBSCRIPTION_STATE_PENDING';
  assert.deepEqual(await prepareGooglePlayAccountDeletion(f.args), { safe: false });
  assert.deepEqual(f.calls.map(x => x.method), ['GET']);
});

test('never cancels tokens of another account or unsupported replacements', async () => {
  for (const mutate of [
    f => { f.args.records[0].user_id = '22222222-2222-4222-8222-222222222222'; },
    f => { f.purchase.externalAccountIdentifiers.obfuscatedExternalAccountId = 'other'; },
    f => { f.purchase.linkedPurchaseToken = 'other'; },
    f => { f.purchase.lineItems[0].productId = 'other'; }
  ]) {
    const f = fixture(); mutate(f);
    assert.deepEqual(await prepareGooglePlayAccountDeletion(f.args), { safe: false });
    assert.equal(f.calls.some(x => x.method === 'POST'), false);
  }
});

test('already canceled or expired tokens require no second cancellation', async () => {
  for (const state of ['SUBSCRIPTION_STATE_CANCELED', 'SUBSCRIPTION_STATE_EXPIRED']) {
    const f = fixture(); f.purchase.subscriptionState = state; f.purchase.lineItems[0].autoRenewingPlan.autoRenewEnabled = false;
    assert.deepEqual(await prepareGooglePlayAccountDeletion(f.args), { safe: true });
    assert.deepEqual(f.calls.map(x => x.method), ['GET']);
  }
});

test('cancellation errors are generic and do not leak credentials', async () => {
  await assert.rejects(stopGooglePlayPayments({ packageName: 'pt.smartsoma.app', purchaseToken: 'secret-token', accessToken: 'secret-oauth',
    fetchImpl: async () => { throw new Error('secret-token secret-oauth'); } }), { message: 'Google Play cancellation unavailable' });
  assert.deepEqual(await prepareGooglePlayAccountDeletion({ userId: user, records: [] }), { safe: true });
  assert.deepEqual(await prepareGooglePlayAccountDeletion({ userId: user }), { safe: false });
});
