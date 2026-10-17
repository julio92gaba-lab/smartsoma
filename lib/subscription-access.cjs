'use strict';

const { parseRfc3339 } = require('./google-play-entitlement.cjs');

// Server-side preparation only. Each entry must be read from a trusted server
// record; never accept entitlement, provider or checkedAt from the client.
const MAX_OFFLINE_MS = 72 * 60 * 60 * 1000;
function selectSubscriptionAccess(records, now = Date.now()) {
  if (!Array.isArray(records) || !Number.isFinite(now)) return null;
  const eligible = [];
  for (const record of records) {
    if (!record || !['creem', 'google_play'].includes(record.provider)) continue;
    const allowed = record.provider === 'creem'
      ? ['active', 'trialing', 'canceled'].includes(record.status)
      : ['SUBSCRIPTION_STATE_ACTIVE', 'SUBSCRIPTION_STATE_IN_GRACE_PERIOD', 'SUBSCRIPTION_STATE_CANCELED'].includes(record.status) &&
        record.acknowledgementState === 'ACKNOWLEDGEMENT_STATE_ACKNOWLEDGED';
    if (!allowed) continue;
    const expires = parseRfc3339(record.expiresAt), checked = parseRfc3339(record.checkedAt);
    if (!Number.isFinite(expires) || !Number.isFinite(checked) || checked > now || expires <= now) continue;
    const offlineUntil = Math.min(expires, checked + MAX_OFFLINE_MS);
    if (offlineUntil <= now) continue;
    eligible.push({ provider: record.provider, status: record.status, expiresAt: new Date(expires).toISOString(),
      checkedAt: new Date(checked).toISOString(), offlineUntil: new Date(offlineUntil).toISOString() });
  }
  eligible.sort((a, b) => Date.parse(b.offlineUntil) - Date.parse(a.offlineUntil));
  return eligible[0] || null;
}

module.exports = { selectSubscriptionAccess, MAX_OFFLINE_MS };
