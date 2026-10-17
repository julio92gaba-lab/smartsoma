'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { selectSubscriptionAccess } = require('../lib/subscription-access.cjs');

const now = Date.parse('2026-10-17T10:00:00Z');
const creem = { provider: 'creem', status: 'active', expiresAt: '2026-11-17T10:00:00Z', checkedAt: '2026-10-17T10:00:00Z' };
const google = { provider: 'google_play', status: 'SUBSCRIPTION_STATE_ACTIVE', acknowledgementState: 'ACKNOWLEDGEMENT_STATE_ACKNOWLEDGED',
  expiresAt: '2026-10-18T10:00:00Z', checkedAt: '2026-10-17T10:00:00Z' };

test('access can come from either provider without overwriting the other', () => {
  assert.equal(selectSubscriptionAccess([creem], now).provider, 'creem');
  assert.equal(selectSubscriptionAccess([google], now).provider, 'google_play');
  assert.equal(selectSubscriptionAccess([google, creem], now).provider, 'creem');
  assert.equal(selectSubscriptionAccess([{ ...creem, status: 'inactive' }, google], now).provider, 'google_play');
});

test('access expires at the earlier of provider expiry and 72 hours after verification', () => {
  assert.equal(selectSubscriptionAccess([creem], now).offlineUntil, '2026-10-20T10:00:00.000Z');
  assert.equal(selectSubscriptionAccess([google], now).offlineUntil, '2026-10-18T10:00:00.000Z');
  assert.equal(selectSubscriptionAccess([{ ...google, expiresAt: '2026-10-17T10:00:00Z' }], now), null);
  assert.equal(selectSubscriptionAccess([{ ...creem, checkedAt: '2026-10-14T10:00:00Z' }], now), null);
});

test('pending, paused, on-hold, expired, unacknowledged and malformed records fail closed', () => {
  for (const state of ['SUBSCRIPTION_STATE_PENDING', 'SUBSCRIPTION_STATE_ON_HOLD', 'SUBSCRIPTION_STATE_PAUSED', 'SUBSCRIPTION_STATE_EXPIRED', 'UNKNOWN']) {
    assert.equal(selectSubscriptionAccess([{ ...google, status: state }], now), null);
  }
  for (const bad of [{ acknowledgementState: 'ACKNOWLEDGEMENT_STATE_PENDING' }, { checkedAt: '2026-10-18T10:00:00Z' },
    { expiresAt: '' }, { expiresAt: '2027-02-30T10:00:00Z' }, { checkedAt: '2026-10-17T10:00:00' }, { provider: 'unknown' }]) {
    assert.equal(selectSubscriptionAccess([{ ...google, ...bad }], now), null);
  }
  assert.equal(selectSubscriptionAccess(null, now), null);
});

test('a canceled subscription remains available only until its paid expiry', () => {
  const result = selectSubscriptionAccess([{ ...google, status: 'SUBSCRIPTION_STATE_CANCELED' }], now);
  assert.equal(result.offlineUntil, '2026-10-18T10:00:00.000Z');
  assert.equal(selectSubscriptionAccess([{ ...creem, status: 'canceled', expiresAt: '2026-10-16T10:00:00Z' }], now), null);
});
