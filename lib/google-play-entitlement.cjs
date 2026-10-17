'use strict';

const { createHmac } = require('node:crypto');

// userId must come from a verified Supabase session, never from the request body.
// Keep the secret stable across deployments, or existing purchases cannot be matched.
function googlePlayAccountId(userId, secret) {
  if (typeof userId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId) ||
      typeof secret !== 'string' || !/^[0-9a-f]{64}$/i.test(secret)) {
    throw new Error('Invalid Google Play account configuration');
  }
  return createHmac('sha256', Buffer.from(secret, 'hex'))
    .update('smartsoma:google-play:account:v1:')
    .update(userId.toLowerCase())
    .digest('hex');
}

// The caller must obtain the OAuth access token on the server and must not
// accept packageName or the fetch implementation from an untrusted client.
async function fetchGooglePlaySubscription({ packageName, purchaseToken, accessToken, fetchImpl = fetch }) {
  if (typeof packageName !== 'string' || !/^[A-Za-z][A-Za-z0-9_]*(?:\.[A-Za-z][A-Za-z0-9_]*)+$/.test(packageName) ||
      typeof purchaseToken !== 'string' || !purchaseToken || purchaseToken.length > 8192 ||
      purchaseToken === '.' || purchaseToken === '..' ||
      typeof accessToken !== 'string' || !/^[A-Za-z0-9._~+/-]+=*$/.test(accessToken) ||
      typeof fetchImpl !== 'function') {
    throw new Error('Invalid Google Play verification configuration');
  }

  const url = 'https://androidpublisher.googleapis.com/androidpublisher/v3/applications/' +
    encodeURIComponent(packageName) + '/purchases/subscriptionsv2/tokens/' + encodeURIComponent(purchaseToken);
  let response;
  try {
    response = await fetchImpl(url, {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + accessToken, Accept: 'application/json' },
      redirect: 'error',
      signal: AbortSignal.timeout(10000)
    });
    if (!response.ok) throw new Error('Google Play request failed');
    return await response.json();
  } catch {
    // Do not propagate exceptions that could contain purchase or OAuth tokens.
    throw new Error('Google Play verification unavailable');
  }
}

// Call only after verification and an atomic, durable association of token to
// the authenticated account. Failed acknowledgements must be retried durably.
async function acknowledgeGooglePlaySubscription({ packageName, productId, purchaseToken, accessToken, fetchImpl = fetch }) {
  if (typeof packageName !== 'string' || !/^[A-Za-z][A-Za-z0-9_]*(?:\.[A-Za-z][A-Za-z0-9_]*)+$/.test(packageName) ||
      typeof productId !== 'string' || !/^[a-z0-9][a-z0-9._-]{0,99}$/.test(productId) || productId === '..' ||
      typeof purchaseToken !== 'string' || !purchaseToken || purchaseToken.length > 8192 || purchaseToken === '.' || purchaseToken === '..' ||
      typeof accessToken !== 'string' || !/^[A-Za-z0-9._~+/-]+=*$/.test(accessToken) || typeof fetchImpl !== 'function') {
    throw new Error('Invalid Google Play acknowledgement configuration');
  }
  const url = 'https://androidpublisher.googleapis.com/androidpublisher/v3/applications/' +
    encodeURIComponent(packageName) + '/purchases/subscriptions/' + encodeURIComponent(productId) +
    '/tokens/' + encodeURIComponent(purchaseToken) + ':acknowledge';
  try {
    const response = await fetchImpl(url, {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + accessToken, 'Content-Type': 'application/json' },
      body: '{}',
      redirect: 'error',
      signal: AbortSignal.timeout(10000)
    });
    if (!response.ok) throw new Error('Google Play request failed');
  } catch {
    throw new Error('Google Play acknowledgement unavailable');
  }
}

// Account deletion must not leave a renewable Google subscription behind.
// This stops future payments; it does not revoke or refund the paid period.
async function stopGooglePlayPayments({ packageName, purchaseToken, accessToken, fetchImpl = fetch }) {
  if (typeof packageName !== 'string' || !/^[A-Za-z][A-Za-z0-9_]*(?:\.[A-Za-z][A-Za-z0-9_]*)+$/.test(packageName) ||
      typeof purchaseToken !== 'string' || !purchaseToken || purchaseToken.length > 8192 || purchaseToken === '.' || purchaseToken === '..' ||
      typeof accessToken !== 'string' || !/^[A-Za-z0-9._~+/-]+=*$/.test(accessToken) || typeof fetchImpl !== 'function') {
    throw new Error('Invalid Google Play cancellation configuration');
  }
  const url = 'https://androidpublisher.googleapis.com/androidpublisher/v3/applications/' +
    encodeURIComponent(packageName) + '/purchases/subscriptionsv2/tokens/' + encodeURIComponent(purchaseToken) + ':cancel';
  try {
    const response = await fetchImpl(url, {
      method: 'POST', headers: { Authorization: 'Bearer ' + accessToken, 'Content-Type': 'application/json' },
      body: JSON.stringify({ cancellationContext: { cancellationType: 'DEVELOPER_REQUESTED_STOP_PAYMENTS' } }),
      redirect: 'error', signal: AbortSignal.timeout(10000)
    });
    if (!response.ok) throw new Error('Google Play request failed');
  } catch { throw new Error('Google Play cancellation unavailable'); }
}

// Only interpret a response obtained by the server directly from Google Play.
// This function does not verify a purchase token, prevent replay, or grant access.
function evaluateGooglePlaySubscription(purchase, { accountId, productIds, now = Date.now() } = {}) {
  const denied = reason => ({ hasAccess: false, reason });

  if (typeof accountId !== 'string' || !accountId || !Array.isArray(productIds) ||
      productIds.length === 0 || productIds.some(id => typeof id !== 'string' || !id) ||
      !Number.isFinite(now)) return denied('invalid_configuration');

  if (!purchase || typeof purchase !== 'object' ||
      purchase.externalAccountIdentifiers?.obfuscatedExternalAccountId !== accountId) {
    return denied('account_mismatch');
  }

  // Multiple line items may represent deferred replacements or add-ons. They
  // require explicit lifecycle handling before they can grant access.
  if (!Array.isArray(purchase.lineItems) || purchase.lineItems.length !== 1) {
    return denied('unsupported_line_items');
  }
  const item = purchase.lineItems[0];
  if (!item || !productIds.includes(item.productId)) return denied('unknown_product');

  const allowedStates = ['SUBSCRIPTION_STATE_ACTIVE', 'SUBSCRIPTION_STATE_IN_GRACE_PERIOD', 'SUBSCRIPTION_STATE_CANCELED'];
  if (!allowedStates.includes(purchase.subscriptionState)) return denied('inactive_state');

  const expiresAt = parseRfc3339(item.expiryTime);
  if (!Number.isFinite(expiresAt)) return denied('invalid_expiry');
  if (expiresAt <= now) return denied('expired');

  return {
    hasAccess: true,
    productId: item.productId,
    state: purchase.subscriptionState,
    expiresAt: new Date(expiresAt).toISOString(),
    acknowledgementState: purchase.acknowledgementState || null
  };
}

// Require a real calendar date and an explicit timezone; Date.parse alone
// normalizes invalid dates such as February 30.
function parseRfc3339(value) {
  const parts = typeof value === 'string' && value.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(?:Z|[+-](\d{2}):(\d{2}))$/
  );
  if (!parts) {
    return NaN;
  }
  const [, year, month, day, hour, minute, second, offsetHour = 0, offsetMinute = 0] =
    parts.map(value => value === undefined ? undefined : Number(value));
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month < 1 || month > 12 || day < 1 || day > days[month - 1] || hour > 23 ||
      minute > 59 || second > 59 || offsetHour > 23 || offsetMinute > 59) return NaN;
  return Date.parse(value);
}

module.exports = { googlePlayAccountId, fetchGooglePlaySubscription, acknowledgeGooglePlaySubscription, stopGooglePlayPayments, evaluateGooglePlaySubscription, parseRfc3339 };
