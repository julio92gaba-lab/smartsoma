const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

test('Android billing preparation is read-only and not wired to checkout', () => {
  const source = fs.readFileSync('android/app/src/main/java/pt/smartsoma/app/NativeBillingPlugin.java', 'utf8');
  const activity = fs.readFileSync('android/app/src/main/java/pt/smartsoma/app/MainActivity.java', 'utf8');
  const app = fs.readFileSync('app.html', 'utf8');
  const gradle = fs.readFileSync('android/app/build.gradle', 'utf8');
  assert.match(gradle, /com\.android\.billingclient:billing:9\.1\.0/);
  assert.match(activity, /registerPlugin\(NativeBillingPlugin\.class\)/);
  assert.match(source, /queryProductDetailsAsync/);
  assert.match(source, /queryPurchasesAsync/);
  assert.doesNotMatch(source, /launchBillingFlow|acknowledgePurchase/);
  assert.doesNotMatch(app, /NativeBilling/);
});
