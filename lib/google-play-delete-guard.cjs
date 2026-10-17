'use strict';

const { googlePlayAccountId, fetchGooglePlaySubscription, evaluateGooglePlaySubscription,
  stopGooglePlayPayments } = require('./google-play-entitlement.cjs');

// Preparation only: records must come from the server-only ledger after the
// user has explicitly confirmed deletion. This does not delete any data.
async function prepareGooglePlayAccountDeletion({ userId, records, accountSecret, productIds,
  getGoogleAccessToken, packageName = 'pt.smartsoma.app', fetchImpl = fetch }) {
  if (!Array.isArray(records)) return { safe: false };
  if (records.length === 0) return { safe: true };
  try {
    const accountId = googlePlayAccountId(userId, accountSecret);
    const accessToken = await getGoogleAccessToken();
    const get = purchaseToken => fetchGooglePlaySubscription({ packageName, purchaseToken, accessToken, fetchImpl });
    const verified = purchase => {
      if (!purchase || purchase.linkedPurchaseToken || purchase.outOfAppPurchaseContext) return false;
      return evaluateGooglePlaySubscription({ ...purchase, subscriptionState: 'SUBSCRIPTION_STATE_ACTIVE' },
        { accountId, productIds, now: -8640000000000000 }).hasAccess;
    };
    for (const record of records) {
      if (record.user_id !== userId) return { safe: false };
      let purchase = await get(record.purchase_token);
      if (!verified(purchase)) return { safe: false };
      if (['SUBSCRIPTION_STATE_ACTIVE', 'SUBSCRIPTION_STATE_IN_GRACE_PERIOD', 'SUBSCRIPTION_STATE_ON_HOLD',
        'SUBSCRIPTION_STATE_PAUSED'].includes(purchase.subscriptionState)) {
        await stopGooglePlayPayments({ packageName, purchaseToken: record.purchase_token, accessToken, fetchImpl });
        purchase = await get(record.purchase_token);
      }
      if (!verified(purchase) || !['SUBSCRIPTION_STATE_CANCELED', 'SUBSCRIPTION_STATE_EXPIRED'].includes(purchase.subscriptionState) ||
          purchase.lineItems[0].autoRenewingPlan?.autoRenewEnabled === true) return { safe: false };
    }
    return { safe: true };
  } catch { return { safe: false }; }
}

module.exports = { prepareGooglePlayAccountDeletion };
