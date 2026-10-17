const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

test('Android billing purchases are hard-disabled and not wired to checkout', () => {
  const source = fs.readFileSync('android/app/src/main/java/pt/smartsoma/app/NativeBillingPlugin.java', 'utf8');
  const activity = fs.readFileSync('android/app/src/main/java/pt/smartsoma/app/MainActivity.java', 'utf8');
  const app = fs.readFileSync('app.html', 'utf8');
  const gradle = fs.readFileSync('android/app/build.gradle', 'utf8');
  assert.match(gradle, /com\.android\.billingclient:billing:9\.1\.0/);
  assert.match(activity, /registerPlugin\(NativeBillingPlugin\.class\)/);
  assert.match(source, /queryProductDetailsAsync/);
  assert.match(source, /queryPurchasesAsync/);
  assert.match(source, /includeSuspendedSubscriptions\(true\)/);
  assert.match(source, /entry\.put\("suspended", purchase\.isSuspended\(\)\)/);
  assert.match(source, /private static final boolean PURCHASES_ENABLED = false/);
  assert.match(source, /if \(!PURCHASES_ENABLED\)[\s\S]*?return;[\s\S]*?launchBillingFlow/);
  assert.match(source, /setObfuscatedAccountId\(accountId\)/);
  assert.match(source, /Purchase\.PurchaseState\.PENDING/);
  assert.doesNotMatch(source, /acknowledgePurchase/);
  assert.doesNotMatch(app, /NativeBilling/);
});
