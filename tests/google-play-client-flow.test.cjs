'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createGooglePlayClientFlow } = require('../lib/google-play-client-flow.cjs');

function fixture() {
  const calls = [];
  const adapters = {
    billing: {
      async startSubscriptionPurchase(input) { calls.push(['start', input]); return { status: 'purchased', purchaseToken: 'token' }; },
      async getOwnedSubscriptions() { return { purchases: [] }; }
    },
    async getAccountId() { calls.push(['account']); return 'a'.repeat(64); },
    async verifyPurchase(token) { calls.push(['verify', token]); return { status: 'purchase_recorded' }; },
    async refreshAccess() { calls.push(['refresh']); }
  };
  return { calls, adapters };
}

test('purchase is submitted to the server before refreshing access', async () => {
  const f = fixture();
  const result = await createGooglePlayClientFlow(f.adapters).buy({ productId: 'monthly', basePlanId: 'base' });
  assert.deepEqual(result, { status: 'recorded' });
  assert.deepEqual(f.calls.map(c => c[0]), ['account', 'start', 'verify', 'refresh']);
  assert.equal(f.calls[1][1].accountId, 'a'.repeat(64));
  assert.doesNotMatch(JSON.stringify(result), /token/);
});

test('pending, canceled, confirmation failure and invalid identity never grant access', async () => {
  for (const status of ['pending', 'canceled', 'unknown']) {
    const f = fixture(); f.adapters.billing.startSubscriptionPurchase = async () => ({ status, purchaseToken: 'token' });
    const result = await createGooglePlayClientFlow(f.adapters).buy({});
    assert.equal(result.status, status === 'unknown' ? 'unavailable' : status);
    assert.ok(!f.calls.some(c => c[0] === 'verify' || c[0] === 'refresh'));
  }
  const f = fixture(); f.adapters.verifyPurchase = async () => ({ status: 'confirmation_pending' });
  assert.equal((await createGooglePlayClientFlow(f.adapters).buy({})).status, 'confirmation_pending');
  assert.ok(!f.calls.some(c => c[0] === 'refresh'));
  const bad = fixture(); bad.adapters.getAccountId = async () => 'invalid';
  assert.equal((await createGooglePlayClientFlow(bad.adapters).buy({})).status, 'unavailable');
  assert.deepEqual(bad.calls, []);
});

test('restore verifies purchased tokens individually and keeps failures isolated', async () => {
  const f = fixture();
  f.adapters.billing.getOwnedSubscriptions = async () => ({ purchases: [
    { purchaseState: 1, purchaseToken: 'ok' }, { purchaseState: 2, purchaseToken: 'pending' },
    { purchaseState: 1, suspended: true, purchaseToken: 'suspended' }, { purchaseState: 1, purchaseToken: 'bad' }
  ] });
  f.adapters.verifyPurchase = async token => { f.calls.push(['verify', token]); if (token === 'bad') throw Error('secret'); return { status: 'purchase_recorded' }; };
  assert.deepEqual(await createGooglePlayClientFlow(f.adapters).restore(), { status: 'checked', recorded: 1, pending: 1, failed: 2 });
  assert.deepEqual(f.calls, [['verify', 'ok'], ['verify', 'bad'], ['refresh']]);
});

test('concurrent purchase and restore do not overlap', async () => {
  const f = fixture(); let release;
  f.adapters.getAccountId = () => new Promise(resolve => { release = resolve; });
  const flow = createGooglePlayClientFlow(f.adapters);
  const pending = flow.buy({});
  assert.deepEqual(await flow.restore(), { status: 'busy' });
  release('a'.repeat(64));
  assert.equal((await pending).status, 'recorded');
});
