'use strict';

const { googlePlayAccountId, fetchGooglePlaySubscription, evaluateGooglePlaySubscription,
  acknowledgeGooglePlaySubscription } = require('./google-play-entitlement.cjs');

const STATES = new Set(['SUBSCRIPTION_STATE_ACTIVE', 'SUBSCRIPTION_STATE_IN_GRACE_PERIOD',
  'SUBSCRIPTION_STATE_CANCELED', 'SUBSCRIPTION_STATE_PENDING', 'SUBSCRIPTION_STATE_ON_HOLD',
  'SUBSCRIPTION_STATE_PAUSED', 'SUBSCRIPTION_STATE_EXPIRED', 'SUBSCRIPTION_STATE_PENDING_PURCHASE_CANCELED']);

// Only call for a token and user obtained from the server-only ledger. Events
// are hints, never proof: ownership, product and state are read from Google.
async function reconcileGooglePlayPurchase({ record, supabase, accountSecret, productIds,
  getGoogleAccessToken, packageName = 'pt.smartsoma.app', fetchImpl = fetch, clock = Date.now }) {
  try {
    const checkedAt = new Date(clock()).toISOString();
    const accountId = googlePlayAccountId(record.user_id, accountSecret);
    const accessToken = await getGoogleAccessToken();
    const purchase = await fetchGooglePlaySubscription({ packageName, purchaseToken: record.purchase_token, accessToken, fetchImpl });
    if (!STATES.has(purchase?.subscriptionState) || purchase.linkedPurchaseToken || purchase.outOfAppPurchaseContext ||
        !['ACKNOWLEDGEMENT_STATE_PENDING', 'ACKNOWLEDGEMENT_STATE_ACKNOWLEDGED'].includes(purchase.acknowledgementState)) {
      return { status: 'unsupported' };
    }
    // Reuse the strict account, product and timestamp checks, including for an
    // inactive or expired subscription. This is not an access decision.
    const details = evaluateGooglePlaySubscription({ ...purchase, subscriptionState: 'SUBSCRIPTION_STATE_ACTIVE' },
      { accountId, productIds, now: -8640000000000000 });
    if (!details.hasAccess) return { status: 'unsupported' };
    const saved = await supabase.rpc('save_verified_google_play_purchase', {
      p_purchase_token: record.purchase_token, p_user_id: record.user_id, p_product_id: details.productId,
      p_subscription_state: purchase.subscriptionState, p_expires_at: details.expiresAt,
      p_acknowledgement_state: details.acknowledgementState, p_checked_at: checkedAt
    });
    if (saved.error) throw new Error('Storage unavailable');
    if (saved.data !== true) return { status: 'conflict' };

    const current = evaluateGooglePlaySubscription(purchase, { accountId, productIds, now: clock() });
    if (current.hasAccess && details.acknowledgementState === 'ACKNOWLEDGEMENT_STATE_PENDING') {
      try {
        await acknowledgeGooglePlaySubscription({ packageName, productId: details.productId,
          purchaseToken: record.purchase_token, accessToken, fetchImpl });
      } catch {
        return { status: 'confirmation_pending' };
      }
    }
    return { status: 'refreshed' };
  } catch {
    // Do not include provider responses or purchase tokens in logs or results.
    throw new Error('Google Play reconciliation unavailable');
  }
}

// Parse only after authenticating the Pub/Sub sender. This is a hint for a
// fresh Google API lookup; it never grants access and is not a public endpoint.
function parseGooglePlayNotification(message, packageName = 'pt.smartsoma.app') {
  if (!message || typeof message.data !== 'string' || message.data.length > 16384 ||
      !/^[A-Za-z0-9+/]*={0,2}$/.test(message.data)) return null;
  try {
    const value = JSON.parse(Buffer.from(message.data, 'base64').toString('utf8'));
    const token = value?.subscriptionNotification?.purchaseToken;
    if (value.packageName !== packageName || typeof token !== 'string' || !token || token.length > 8192 ||
        token === '.' || token === '..') return null;
    return { purchaseToken: token };
  } catch { return null; }
}

module.exports = { reconcileGooglePlayPurchase, parseGooglePlayNotification };
