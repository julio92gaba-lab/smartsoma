'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { generateKeyPairSync } = require('node:crypto');
const { createGooglePlayAccessTokenProvider } = require('../lib/google-play-auth.cjs');

const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048,
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' }, publicKeyEncoding: { type: 'spki', format: 'pem' } });
const credentials = { type: 'service_account', client_email: 'billing@test-project.iam.gserviceaccount.com', private_key: privateKey };

test('authorization uses only trusted service account fields and the Android Publisher scope', async () => {
  let config, count = 0;
  class FakeAuth {
    constructor(options) { config = options; }
    async getAccessToken() { count++; return 'test-access-token'; }
  }
  const provider = createGooglePlayAccessTokenProvider({ ...credentials, token_uri: 'https://untrusted.invalid', project_id: 'untrusted' }, FakeAuth);
  assert.deepEqual(Object.keys(config.credentials).sort(), ['client_email', 'private_key', 'type']);
  assert.deepEqual(config.scopes, ['https://www.googleapis.com/auth/androidpublisher']);
  assert.equal(await provider(), 'test-access-token');
  assert.equal(await provider(), 'test-access-token');
  assert.equal(count, 2);
});

test('invalid credentials fail closed without revealing their contents', () => {
  const weak = generateKeyPairSync('rsa', { modulusLength: 1024,
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }, publicKeyEncoding: { type: 'spki', format: 'pem' } }).privateKey;
  for (const invalid of [null, { ...credentials, type: 'external_account' }, { ...credentials, client_email: 'test@example.com' },
    { ...credentials, private_key: 'sensitive-invalid-key' }, { ...credentials, private_key: '' }, { ...credentials, private_key: weak }]) {
    assert.throws(() => createGooglePlayAccessTokenProvider(invalid), { message: 'Invalid Google Play authorization configuration' });
  }
});

test('authorization failures are redacted and never return an invalid token', async () => {
  for (const value of [null, '', 'invalid token']) {
    class FakeAuth { async getAccessToken() { return value; } }
    await assert.rejects(createGooglePlayAccessTokenProvider(credentials, FakeAuth)(), { message: 'Google Play authorization unavailable' });
  }
  class BrokenAuth { async getAccessToken() { throw new Error('private-key-or-token'); } }
  await assert.rejects(createGooglePlayAccessTokenProvider(credentials, BrokenAuth)(), { message: 'Google Play authorization unavailable' });
});

test('the installed Google library accepts the restricted service account configuration without contacting Google', () => {
  assert.equal(typeof createGooglePlayAccessTokenProvider(credentials), 'function');
});
