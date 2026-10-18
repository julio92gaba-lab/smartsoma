const { test } = require('node:test');
const assert = require('node:assert/strict');
const { webcrypto } = require('node:crypto');

if (!globalThis.crypto) globalThis.crypto = webcrypto;
const modulePromise = import('../supabase/functions/support-cleanup/handler.mjs');
const secret = 'fake-secret-for-tests-only-1234567890';
const user = '123e4567-e89b-42d3-a456-426614174000';
const id = '123e4567-e89b-42d3-a456-426614174001';
const path = `${user}/${id}.jpg`;
const currentTime = Date.parse('2026-10-18T12:00:00Z');

function fixture(rows, options = {}) {
  const calls = [], remaining = rows.map(row => ({ ...row }));
  let clientCalls = 0;
  const client = {
    from(table) {
      assert.equal(table, 'support_contacts');
      return {
        select() { return { lt(field, cutoff) { return { order() { return { async limit(limit) {
          calls.push(['query', cutoff, limit]);
          return { data: remaining.filter(row => row.created_at < cutoff).slice(0, limit), error: null };
        } }; } }; } }; },
        delete() { return { eq(field, rowId) { return { async lt(field2, cutoff) {
          calls.push(['delete', rowId]);
          if (options.deleteError) return { error: 'delete failed' };
          const index = remaining.findIndex(row => row.id === rowId && row.created_at < cutoff);
          if (index >= 0) remaining.splice(index, 1);
          return { error: null };
        } }; } }; }
      };
    },
    storage: { from(bucket) {
      assert.equal(bucket, 'support-attachments');
      return { async remove(paths) { calls.push(['remove', paths]); return { error: options.storageError || null }; } };
    } }
  };
  return {
    calls, remaining, clientCalls: () => clientCalls,
    async handle(token = secret, method = 'POST') {
      const { createCleanupHandler } = await modulePromise;
      const handler = createCleanupHandler({ makeClient: () => { clientCalls++; return client; }, getEnv: () => secret, now: () => currentTime });
      return handler(new Request('https://example.invalid/cleanup', { method, headers: { 'x-support-cleanup-secret': token } }));
    }
  };
}

test('cleanup rejects unauthorized requests before accessing any data', async () => {
  const f = fixture([]);
  assert.equal((await f.handle('wrong')).status, 401);
  assert.equal((await f.handle(secret, 'GET')).status, 405);
  assert.equal(f.clientCalls(), 0);
});

test('cleanup deletes only contacts older than 90 days and their attachments', async () => {
  const f = fixture([
    { id, user_id: user, attachment_path: path, created_at: '2026-07-19T11:59:59.000Z' },
    { id: 'newer', user_id: user, attachment_path: null, created_at: '2026-07-20T12:00:00.000Z' }
  ]);
  const response = await f.handle();
  assert.equal(response.status, 200);
  assert.equal((await response.json()).completed, 1);
  assert.deepEqual(f.calls, [['query', '2026-07-20T12:00:00.000Z', 30], ['remove', [path]], ['delete', id]]);
  assert.equal(f.remaining.length, 1);
});

test('cleanup leaves messages in place when attachment deletion fails', async () => {
  const f = fixture([{ id, user_id: user, attachment_path: path, created_at: '2026-01-01T00:00:00.000Z' }], { storageError: 'unavailable' });
  const response = await f.handle();
  assert.equal(response.status, 503);
  assert.equal((await response.json()).failed, 1);
  assert.equal(f.remaining.length, 1);
  assert.equal(f.calls.some(call => call[0] === 'delete'), false);
});

test('cleanup rejects an attachment path belonging to a different message', async () => {
  const f = fixture([{ id, user_id: user, attachment_path: `${user}/123e4567-e89b-42d3-a456-426614174002.jpg`, created_at: '2026-01-01T00:00:00.000Z' }]);
  assert.equal((await f.handle()).status, 503);
  assert.equal(f.remaining.length, 1);
  assert.equal(f.calls.some(call => call[0] === 'remove'), false);
});
