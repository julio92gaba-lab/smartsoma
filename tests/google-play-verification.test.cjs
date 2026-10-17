'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { googlePlayAccountId } = require('../lib/google-play-entitlement.cjs');
const { createGooglePlayVerificationHandler } = require('../lib/google-play-verification.cjs');

const userId = '11111111-1111-4111-8111-111111111111';
const otherUserId = '22222222-2222-4222-8222-222222222222';
const secret = 'a1'.repeat(32);
const now = Date.parse('2026-10-17T10:00:00Z');

function fixture() {
  const events = [];
  const purchase = {
    subscriptionState: 'SUBSCRIPTION_STATE_ACTIVE',
    acknowledgementState: 'ACKNOWLEDGEMENT_STATE_PENDING',
    externalAccountIdentifiers: { obfuscatedExternalAccountId: googlePlayAccountId(userId, secret) },
    lineItems: [{ productId: 'pro-monthly', expiryTime: '2026-11-17T10:00:00Z' }]
  };
  const supabase = {
    auth: { getUser: async token => { events.push(['auth', token]); return token === 'valid-session' ? { data: { user: { id: userId } } } : { data: {}, error: true }; } },
    rpc: async (name, args) => { events.push([name, args]); return { data: true }; }
  };
  let ackFails = false;
  const fetchImpl = async (url, options) => {
    events.push([options.method, url]);
    if (options.method === 'POST') return { ok: !ackFails };
    return { ok: true, json: async () => purchase };
  };
  const options = { supabase, getGoogleAccessToken: async () => 'oauth-token', accountSecret: secret,
    productIds: ['pro-monthly'], fetchImpl, clock: () => now };
  return { events, purchase, supabase, options, failAck: () => { ackFails = true; } };
}

async function request(f, { method = 'POST', authorization = 'Bearer valid-session', body = { purchaseToken: 'purchase-token' } } = {}) {
  const response = { headers: {}, setHeader(key, value) { this.headers[key] = value; },
    status(code) { this.code = code; return this; }, json(value) { this.body = value; return this; } };
  await createGooglePlayVerificationHandler(f.options)({ method, headers: { authorization }, body }, response);
  return response;
}

test('authenticated verification records the Google response before acknowledgement', async () => {
  const f = fixture();
  const response = await request(f);
  assert.equal(response.code, 200);
  assert.deepEqual(response.body, { status: 'purchase_recorded' });
  assert.equal(response.headers['Cache-Control'], 'no-store');
  assert.deepEqual(f.events.map(e => e[0]), ['auth', 'consume_rate_limit', 'GET', 'save_verified_google_play_purchase', 'POST']);
  const saved = f.events.find(e => e[0] === 'save_verified_google_play_purchase')[1];
  assert.equal(saved.p_user_id, userId);
  assert.equal(saved.p_purchase_token, 'purchase-token');
  assert.equal(saved.p_checked_at, '2026-10-17T10:00:00.000Z');
  assert.equal(saved.p_acknowledgement_state, 'ACKNOWLEDGEMENT_STATE_PENDING');
});

test('session and ownership cannot be supplied by the client', async () => {
  for (const bad of [
    { authorization: '' }, { authorization: 'valid-session' }, { authorization: 'Bearer invalid' }
  ]) {
    const f = fixture();
    assert.equal((await request(f, bad)).code, 401);
    assert.ok(!f.events.some(e => e[0] === 'GET'));
  }
  const f = fixture();
  assert.equal((await request(f, { body: { purchaseToken: 'purchase-token', userId: otherUserId } })).code, 400);
  assert.deepEqual(f.events, []);
});

test('only verified account, known product, supported state and valid acknowledgement are recorded', async () => {
  const mutate = [
    p => { p.externalAccountIdentifiers.obfuscatedExternalAccountId = googlePlayAccountId(otherUserId, secret); },
    p => { p.lineItems[0].productId = 'other'; },
    p => { p.subscriptionState = 'SUBSCRIPTION_STATE_PENDING'; },
    p => { p.lineItems[0].expiryTime = '2026-01-01T00:00:00Z'; },
    p => { p.acknowledgementState = 'UNKNOWN'; },
    p => { p.linkedPurchaseToken = 'old'; },
    p => { p.outOfAppPurchaseContext = {}; }
  ];
  for (const change of mutate) {
    const f = fixture(); change(f.purchase);
    assert.equal((await request(f)).code, 422);
    assert.ok(!f.events.some(e => e[0] === 'save_verified_google_play_purchase' || e[0] === 'POST'));
  }
});

test('failed or conflicting persistence never acknowledges a purchase', async () => {
  for (const result of [{ error: new Error('secret') }, { data: false }]) {
    const f = fixture();
    f.supabase.rpc = async name => { f.events.push([name]); return name === 'consume_rate_limit' ? { data: true } : result; };
    assert.equal((await request(f)).code, result.error ? 503 : 409);
    assert.ok(!f.events.some(e => e[0] === 'POST'));
  }
});

test('acknowledgement failures leave a durable pending record without leaking secrets', async () => {
  const f = fixture(); f.failAck();
  const response = await request(f);
  assert.equal(response.code, 202);
  assert.deepEqual(response.body, { status: 'confirmation_pending' });
  assert.ok(f.events.some(e => e[0] === 'save_verified_google_play_purchase'));
  assert.doesNotMatch(JSON.stringify(response.body), /token|secret/);
});

test('already acknowledged purchases are not acknowledged twice', async () => {
  const f = fixture(); f.purchase.acknowledgementState = 'ACKNOWLEDGEMENT_STATE_ACKNOWLEDGED';
  assert.equal((await request(f)).code, 200);
  assert.ok(!f.events.some(e => e[0] === 'POST'));
});

test('a purchase that expires during Google verification is not recorded', async () => {
  const f = fixture();
  let calls = 0;
  f.purchase.lineItems[0].expiryTime = '2026-10-17T10:00:01Z';
  f.options.clock = () => now + (calls++ === 0 ? 0 : 2000);
  assert.equal((await request(f)).code, 422);
  assert.ok(!f.events.some(e => e[0] === 'save_verified_google_play_purchase' || e[0] === 'POST'));
});

test('rate limits and provider failures fail closed without exposing secrets', async () => {
  const limited = fixture();
  limited.supabase.rpc = async () => ({ data: false });
  assert.equal((await request(limited)).code, 429);
  assert.ok(!limited.events.some(e => e[0] === 'GET'));
  const failed = fixture();
  failed.options.getGoogleAccessToken = async () => { throw new Error('secret-purchase secret-oauth'); };
  const response = await request(failed);
  assert.equal(response.code, 503);
  assert.doesNotMatch(JSON.stringify(response.body), /secret|token/);
  assert.ok(!failed.events.some(e => e[0] === 'save_verified_google_play_purchase'));
});
