'use strict';

const { googlePlayAccountId, fetchGooglePlaySubscription, evaluateGooglePlaySubscription,
  acknowledgeGooglePlaySubscription } = require('./google-play-entitlement.cjs');

// Preparation only: no public endpoint or frontend uses this handler yet.
// Dependencies and configuration must come exclusively from the server.
function createGooglePlayVerificationHandler({ supabase, getGoogleAccessToken, accountSecret, productIds,
  packageName = 'pt.smartsoma.app', fetchImpl = fetch, clock = Date.now }) {
  return async function verify(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método inválido' });
    const auth = typeof req.headers?.authorization === 'string' && req.headers.authorization.match(/^Bearer ([^\s]{1,4096})$/i);
    if (!auth) return res.status(401).json({ error: 'Sessão inválida' });
    const body = req.body;
    if (!body || typeof body !== 'object' || Array.isArray(body) ||
        Object.keys(body).length !== 1 || typeof body.purchaseToken !== 'string' ||
        !body.purchaseToken || body.purchaseToken.length > 8192 || body.purchaseToken === '.' || body.purchaseToken === '..') {
      return res.status(400).json({ error: 'Pedido inválido' });
    }

    try {
      // getUser verifies the token with Supabase Auth; user_id is never read from the client.
      const { data, error } = await supabase.auth.getUser(auth[1]);
      if (error || !data?.user?.id) return res.status(401).json({ error: 'Sessão inválida' });
      const userId = data.user.id;
      const accountId = googlePlayAccountId(userId, accountSecret);
      if (!Array.isArray(productIds) || !productIds.length ||
          productIds.some(id => typeof id !== 'string' || !/^[a-z0-9][a-z0-9._-]{0,99}$/.test(id))) {
        throw new Error('Invalid product configuration');
      }
      const limit = await supabase.rpc('consume_rate_limit', {
        p_scope: 'google-play-verify-user', p_identifier: userId, p_limit: 30, p_window_seconds: 3600
      });
      if (limit.error) throw new Error('Rate limit unavailable');
      if (limit.data !== true) return res.status(429).json({ error: 'Demasiadas tentativas' });

      const checkedAt = new Date(clock()).toISOString();
      const accessToken = await getGoogleAccessToken();
      const purchase = await fetchGooglePlaySubscription({ packageName, purchaseToken: body.purchaseToken, accessToken, fetchImpl });
      // Replacements and out-of-app resubscriptions need separate lifecycle and ownership handling.
      if (purchase?.linkedPurchaseToken || purchase?.outOfAppPurchaseContext) {
        return res.status(422).json({ error: 'Compra ainda não suportada' });
      }
      // Expiry must be checked after the network call, not at its start.
      const result = evaluateGooglePlaySubscription(purchase, { accountId, productIds, now: clock() });
      if (!result.hasAccess || !['ACKNOWLEDGEMENT_STATE_PENDING', 'ACKNOWLEDGEMENT_STATE_ACKNOWLEDGED'].includes(result.acknowledgementState)) {
        return res.status(422).json({ error: 'Compra não validada' });
      }
      const saved = await supabase.rpc('save_verified_google_play_purchase', {
        p_purchase_token: body.purchaseToken, p_user_id: userId, p_product_id: result.productId,
        p_subscription_state: result.state, p_expires_at: result.expiresAt,
        p_acknowledgement_state: result.acknowledgementState, p_checked_at: checkedAt
      });
      if (saved.error) throw new Error('Purchase storage unavailable');
      if (saved.data !== true) return res.status(409).json({ error: 'Compra não associada' });

      if (result.acknowledgementState === 'ACKNOWLEDGEMENT_STATE_PENDING') {
        try {
          await acknowledgeGooglePlaySubscription({ packageName, productId: result.productId,
            purchaseToken: body.purchaseToken, accessToken, fetchImpl });
        } catch {
          // The durable record remains pending. A retry worker is required before enabling purchases.
          return res.status(202).json({ status: 'confirmation_pending' });
        }
      }
      // This does not grant app access. Entitlements and lifecycle reconciliation are still required.
      return res.status(200).json({ status: 'purchase_recorded' });
    } catch {
      // Neither provider errors nor tokens are returned or logged.
      return res.status(503).json({ error: 'Validação temporariamente indisponível' });
    }
  };
}

module.exports = { createGooglePlayVerificationHandler };
