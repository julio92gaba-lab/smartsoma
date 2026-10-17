'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { runGooglePlayReconciliationBatch } = require('../lib/google-play-reconcile-batch.cjs');

test('claims a bounded batch and continues after individual failures without leaking tokens', async () => {
  const records = ['refreshed', 'confirmation_pending', 'unsupported', 'conflict', 'error', 'unknown']
    .map(status => ({ user_id: 'fake-user', purchase_token: `secret-${status}`, status }));
  const calls = [];
  const options = { supabase: { rpc: async (name, params) => { calls.push([name, params]); return { data: records }; } }, limit: 6 };
  const result = await runGooglePlayReconciliationBatch(options, async ({ record }) => {
    if (record.status === 'error') throw new Error(record.purchase_token);
    return { status: record.status };
  });
  assert.deepEqual(calls, [['claim_google_play_reconciliation', { p_limit: 6 }]]);
  assert.deepEqual(result, { claimed: 6, refreshed: 1, confirmation_pending: 1, unsupported: 1, conflict: 1, failed: 2 });
  assert.doesNotMatch(JSON.stringify(result), /secret|fake-user/);
});

test('invalid batches and database failures fail closed without exposing details', async () => {
  for (const limit of [0, -1, 11, 1.5, '10']) {
    await assert.rejects(runGooglePlayReconciliationBatch({ supabase: {}, limit }), /Invalid reconciliation batch size/);
  }
  for (const data of [{ error: new Error('secret') }, { data: null }, { data: Array(11).fill({}) }]) {
    await assert.rejects(runGooglePlayReconciliationBatch({ supabase: { rpc: async () => data } }),
      { message: 'Google Play reconciliation queue unavailable' });
  }
  await assert.rejects(runGooglePlayReconciliationBatch({ supabase: { rpc: async () => { throw new Error('secret'); } } }),
    { message: 'Google Play reconciliation queue unavailable' });
});

test('an empty queue makes no provider calls', async () => {
  const result = await runGooglePlayReconciliationBatch({ supabase: { rpc: async () => ({ data: [] }) } },
    () => { throw new Error('must not be called'); });
  assert.deepEqual(result, { claimed: 0, refreshed: 0, confirmation_pending: 0, unsupported: 0, conflict: 0, failed: 0 });
});
