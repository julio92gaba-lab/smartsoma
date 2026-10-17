'use strict';

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

  // Google returns RFC 3339 timestamps. Require a timezone rather than
  // allowing Date.parse to silently interpret a local date.
  const expiry = item.expiryTime;
  const parts = typeof expiry === 'string' && expiry.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(?:Z|[+-](\d{2}):(\d{2}))$/
  );
  if (!parts) {
    return denied('invalid_expiry');
  }
  const [, year, month, day, hour, minute, second, offsetHour = 0, offsetMinute = 0] =
    parts.map(value => value === undefined ? undefined : Number(value));
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month < 1 || month > 12 || day < 1 || day > days[month - 1] || hour > 23 ||
      minute > 59 || second > 59 || offsetHour > 23 || offsetMinute > 59) return denied('invalid_expiry');
  const expiresAt = Date.parse(expiry);
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

module.exports = { fetchGooglePlaySubscription, evaluateGooglePlaySubscription };
