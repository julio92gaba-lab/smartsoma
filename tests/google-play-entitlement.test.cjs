'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { googlePlayAccountId, fetchGooglePlaySubscription, acknowledgeGooglePlaySubscription, evaluateGooglePlaySubscription } = require('../lib/google-play-entitlement.cjs');

const now = Date.parse('2026-10-17T12:00:00Z');
const config = { accountId: 'hashed-account', productIds: ['pro-weekly', 'pro-monthly'], now };
const purchase = (state = 'SUBSCRIPTION_STATE_ACTIVE', expiryTime = '2026-10-18T12:00:00Z') => ({
  subscriptionState: state,
  acknowledgementState: 'ACKNOWLEDGEMENT_STATE_PENDING',
  externalAccountIdentifiers: { obfuscatedExternalAccountId: 'hashed-account' },
  lineItems: [{ productId: 'pro-monthly', expiryTime }]
});

test('account binding is stable, private, distinct and requires a secret and UUID', () => {
  const user = '12345678-abcd-4321-9876-0123456789ab';
  const secret = 'a1'.repeat(32);
  const id = googlePlayAccountId(user, secret);
  assert.match(id, /^[a-f0-9]{64}$/);
  assert.equal(id, googlePlayAccountId(user.toUpperCase(), secret));
  assert.notEqual(id, googlePlayAccountId('12345678-abcd-4321-9876-0123456789ac', secret));
  assert.notEqual(id, googlePlayAccountId(user, 'b2'.repeat(32)));
  for (const [badUser, badSecret] of [['email@example.com', secret], [user, 'short'], [user, 'zz'.repeat(32)]]) {
    assert.throws(() => googlePlayAccountId(badUser, badSecret), { message: 'Invalid Google Play account configuration' });
  }
});

test('acknowledgement uses the official endpoint and never leaks credentials in errors', async () => {
  const args = { packageName: 'pt.smartsoma.app', productId: 'pro-monthly', purchaseToken: 'secret/token', accessToken: 'secret-oauth' };
  let request;
  await acknowledgeGooglePlaySubscription({ ...args, fetchImpl: async (url, options) => { request = { url, options }; return { ok: true }; } });
  assert.equal(request.url, 'https://androidpublisher.googleapis.com/androidpublisher/v3/applications/pt.smartsoma.app/purchases/subscriptions/pro-monthly/tokens/secret%2Ftoken:acknowledge');
  assert.equal(request.options.method, 'POST');
  assert.equal(request.options.body, '{}');
  assert.equal(request.options.redirect, 'error');
  assert.equal(request.options.headers.Authorization, 'Bearer secret-oauth');
  for (const fetchImpl of [async () => ({ ok: false }), async () => { throw new Error('secret/token secret-oauth'); }]) {
    await assert.rejects(acknowledgeGooglePlaySubscription({ ...args, fetchImpl }), { message: 'Google Play acknowledgement unavailable' });
  }
  for (const bad of [{ packageName: '../other' }, { productId: '../other' }, { purchaseToken: '..' }, { accessToken: 'x\ny' }]) {
    await assert.rejects(acknowledgeGooglePlaySubscription({ ...args, ...bad }), { message: 'Invalid Google Play acknowledgement configuration' });
  }
});

test('server fetches the subscription directly from Google with encoded token and no redirect', async () => {
  const sample = purchase();
  let request;
  const result = await fetchGooglePlaySubscription({
    packageName: 'pt.smartsoma.app', purchaseToken: 'token/with?chars', accessToken: 'oauth-token',
    fetchImpl: async (url, options) => { request = { url, options }; return { ok: true, json: async () => sample }; }
  });
  assert.equal(request.url, 'https://androidpublisher.googleapis.com/androidpublisher/v3/applications/pt.smartsoma.app/purchases/subscriptionsv2/tokens/token%2Fwith%3Fchars');
  assert.equal(request.options.headers.Authorization, 'Bearer oauth-token');
  assert.equal(request.options.redirect, 'error');
  assert.equal(result, sample);
});

test('Google errors and invalid configuration never return purchase data or expose tokens', async () => {
  const args = { packageName: 'pt.smartsoma.app', purchaseToken: 'secret-purchase', accessToken: 'secret-oauth' };
  for (const fetchImpl of [async () => ({ ok: false }), async () => { throw new Error('secret-purchase secret-oauth'); }]) {
    await assert.rejects(fetchGooglePlaySubscription({ ...args, fetchImpl }), { message: 'Google Play verification unavailable' });
  }
  for (const bad of [{ packageName: '../other' }, { purchaseToken: '..' }, { accessToken: 'x\ny' }]) {
    await assert.rejects(fetchGooglePlaySubscription({ ...args, ...bad }), { message: 'Invalid Google Play verification configuration' });
  }
});

test('verified active, grace-period and canceled subscriptions retain access until expiry', () => {
  for (const state of ['SUBSCRIPTION_STATE_ACTIVE', 'SUBSCRIPTION_STATE_IN_GRACE_PERIOD', 'SUBSCRIPTION_STATE_CANCELED']) {
    assert.deepEqual(evaluateGooglePlaySubscription(purchase(state), config), {
      hasAccess: true, productId: 'pro-monthly', state,
      expiresAt: '2026-10-18T12:00:00.000Z', acknowledgementState: 'ACKNOWLEDGEMENT_STATE_PENDING'
    });
  }
});

test('pending, paused, on-hold, expired and unknown states never grant access', () => {
  for (const state of ['SUBSCRIPTION_STATE_PENDING', 'SUBSCRIPTION_STATE_PAUSED', 'SUBSCRIPTION_STATE_ON_HOLD',
    'SUBSCRIPTION_STATE_EXPIRED', 'SUBSCRIPTION_STATE_PENDING_PURCHASE_CANCELED', 'UNKNOWN']) {
    assert.deepEqual(evaluateGooglePlaySubscription(purchase(state), config), { hasAccess: false, reason: 'inactive_state' });
  }
});

test('expiry is mandatory, timezone-aware, and strictly later than the evaluation time', () => {
  for (const expiry of [null, '', '2026-10-18', '2026-10-18T12:00:00', '2026-02-30T12:00:00Z', 'invalid']) {
    assert.equal(evaluateGooglePlaySubscription(purchase('SUBSCRIPTION_STATE_ACTIVE', expiry), config).reason, 'invalid_expiry');
  }
  for (const expiry of ['2026-10-17T12:00:00Z', '2026-10-17T11:59:59Z']) {
    assert.equal(evaluateGooglePlaySubscription(purchase('SUBSCRIPTION_STATE_CANCELED', expiry), config).reason, 'expired');
  }
  assert.equal(evaluateGooglePlaySubscription(purchase('SUBSCRIPTION_STATE_ACTIVE', '2026-10-18T13:00:00+01:00'), config).hasAccess, true);
});

test('purchase must belong to the authenticated account and an explicitly allowed product', () => {
  assert.equal(evaluateGooglePlaySubscription(purchase(), { ...config, accountId: 'another-account' }).reason, 'account_mismatch');
  const missingAccount = purchase();
  delete missingAccount.externalAccountIdentifiers;
  assert.equal(evaluateGooglePlaySubscription(missingAccount, config).reason, 'account_mismatch');
  const otherProduct = purchase();
  otherProduct.lineItems[0].productId = 'other-product';
  assert.equal(evaluateGooglePlaySubscription(otherProduct, config).reason, 'unknown_product');
});

test('unsupported multi-item replacements and invalid configuration fail closed', () => {
  const multiple = purchase();
  multiple.lineItems.push({ productId: 'pro-weekly', expiryTime: '2026-11-01T00:00:00Z' });
  assert.equal(evaluateGooglePlaySubscription(multiple, config).reason, 'unsupported_line_items');
  assert.equal(evaluateGooglePlaySubscription({ ...purchase(), lineItems: [] }, config).reason, 'unsupported_line_items');
  for (const invalid of [{}, { ...config, productIds: [] }, { ...config, now: NaN }, { ...config, accountId: '' }]) {
    assert.equal(evaluateGooglePlaySubscription(purchase(), invalid).reason, 'invalid_configuration');
  }
});
