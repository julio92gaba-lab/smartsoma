'use strict';

// Isolated preparation. These adapters must use an authenticated server; this
// module neither grants access nor enables the native purchase flow.
function createGooglePlayClientFlow({ billing, getAccountId, verifyPurchase, refreshAccess }) {
  let busy = false;
  async function exclusive(action) {
    if (busy) return { status: 'busy' };
    busy = true;
    try { return await action(); }
    catch { return { status: 'unavailable' }; }
    finally { busy = false; }
  }
  async function submit(token) {
    if (typeof token !== 'string' || !token || token.length > 8192) return 'invalid';
    const result = await verifyPurchase(token);
    if (result?.status === 'purchase_recorded') return 'recorded';
    if (result?.status === 'confirmation_pending') return 'confirmation_pending';
    return 'unavailable';
  }
  return {
    buy({ productId, basePlanId, offerId = null }) {
      return exclusive(async () => {
        const accountId = await getAccountId();
        if (typeof accountId !== 'string' || !/^[a-f0-9]{64}$/.test(accountId)) return { status: 'unavailable' };
        const purchase = await billing.startSubscriptionPurchase({ productId, basePlanId, offerId, accountId });
        if (purchase?.status === 'canceled' || purchase?.status === 'pending') return { status: purchase.status };
        if (purchase?.status !== 'purchased') return { status: 'unavailable' };
        const status = await submit(purchase.purchaseToken);
        if (status === 'recorded') await refreshAccess();
        return { status };
      });
    },
    restore() {
      return exclusive(async () => {
        const result = await billing.getOwnedSubscriptions();
        if (!Array.isArray(result?.purchases) || result.purchases.length > 100) return { status: 'unavailable' };
        let recorded = 0, pending = 0, failed = 0;
        for (const purchase of result.purchases) {
          if (purchase?.purchaseState === 2) { pending++; continue; }
          if (purchase?.purchaseState !== 1 || purchase.suspended === true) { failed++; continue; }
          try {
            const status = await submit(purchase.purchaseToken);
            if (status === 'recorded') recorded++;
            else if (status === 'confirmation_pending') pending++;
            else failed++;
          } catch { failed++; }
        }
        if (recorded) await refreshAccess();
        return { status: 'checked', recorded, pending, failed };
      });
    }
  };
}

module.exports = { createGooglePlayClientFlow };
