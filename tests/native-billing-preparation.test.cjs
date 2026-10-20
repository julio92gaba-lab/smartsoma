const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

test('Android package has no Google Play billing implementation', () => {
  const activity = fs.readFileSync('android/app/src/main/java/pt/smartsoma/app/MainActivity.java', 'utf8');
  const gradle = fs.readFileSync('android/app/build.gradle', 'utf8');
  assert.doesNotMatch(gradle, /billingclient/);
  assert.doesNotMatch(activity, /NativeBilling/);
  assert.equal(fs.existsSync('android/app/src/main/java/pt/smartsoma/app/NativeBillingPlugin.java'), false);
});
