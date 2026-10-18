'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { googlePlayAccountId } = require('../lib/google-play-entitlement.cjs');
const { createGooglePlayAccountHandler } = require('../lib/google-play-account.cjs');

const userId = '11111111-1111-4111-8111-111111111111';
const secret = 'a1'.repeat(32);
function fixture() {
  const calls = [];
  const supabase = {
    auth: { async getUser(token) { calls.push(['auth', token]); return token === 'valid' ? { data: { user: { id: userId } } } : { error: true }; } },
    async rpc(name, args) { calls.push([name, args]); return { data: true }; }
  };
  return { calls, supabase };
}
async function request(f, overrides = {}, accountSecret = secret) {
  const res = { headers: {}, setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } };
  await createGooglePlayAccountHandler({ supabase: f.supabase, accountSecret })(
    { method: 'POST', headers: { authorization: 'Bearer valid' }, body: {}, ...overrides }, res);
  return res;
}

test('account ID is stable and derived from the authenticated user', async () => {
  const f = fixture();
  const result = await request(f);
  assert.equal(result.code, 200);
  assert.deepEqual(result.body, { accountId: googlePlayAccountId(userId, secret) });
  assert.equal(result.headers['Cache-Control'], 'no-store');
  assert.equal(f.calls[1][1].p_identifier, userId);
  assert.doesNotMatch(JSON.stringify(result.body), /11111111|a1a1a1/);
});

test('rejects forged users, methods and invalid sessions before calling Google', async () => {
  for (const value of [
    { method: 'GET' }, { headers: {} }, { headers: { authorization: 'Bearer invalid' } },
    { body: { userId } }, { body: [] }, { body: 'data' }
  ]) {
    const result = await request(fixture(), value);
    assert.ok([400, 401, 405].includes(result.code));
    assert.equal(result.body.accountId, undefined);
  }
});

test('rate limit, provider failure and invalid secret fail closed', async () => {
  const limited = fixture(); limited.supabase.rpc = async () => ({ data: false });
  assert.equal((await request(limited)).code, 429);
  const broken = fixture(); broken.supabase.rpc = async () => ({ error: new Error('sensitive') });
  const failed = await request(broken);
  assert.equal(failed.code, 503);
  assert.doesNotMatch(JSON.stringify(failed.body), /sensitive/);
  assert.equal((await request(fixture(), {}, 'bad')).code, 503);
});
