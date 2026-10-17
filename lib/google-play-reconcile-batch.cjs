'use strict';

const { reconcileGooglePlayPurchase } = require('./google-play-reconcile.cjs');

// Server-only preparation: the caller must be authenticated and scheduled.
// The database lease persists even if this process stops or Google fails.
async function runGooglePlayReconciliationBatch(options, reconcile = reconcileGooglePlayPurchase) {
  const { supabase, limit = 10 } = options;
  if (!Number.isInteger(limit) || limit < 1 || limit > 10) throw new Error('Invalid reconciliation batch size');
  let claimed;
  try {
    const result = await supabase.rpc('claim_google_play_reconciliation', { p_limit: limit });
    if (result.error || !Array.isArray(result.data) || result.data.length > limit) throw new Error();
    claimed = result.data;
  } catch { throw new Error('Google Play reconciliation queue unavailable'); }

  const summary = { claimed: claimed.length, refreshed: 0, confirmation_pending: 0, unsupported: 0, conflict: 0, failed: 0 };
  for (const record of claimed) {
    try {
      const result = await reconcile({ ...options, record });
      if (['refreshed', 'confirmation_pending', 'unsupported', 'conflict'].includes(result?.status)) summary[result.status]++;
      else summary.failed++;
    } catch { summary.failed++; }
  }
  // Do not return tokens, user IDs, provider errors or credentials.
  return summary;
}

module.exports = { runGooglePlayReconciliationBatch };
