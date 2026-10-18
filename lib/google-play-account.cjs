'use strict';

const { googlePlayAccountId } = require('./google-play-entitlement.cjs');

// Preparation only: expose only after endpoint-level size and IP limits exist.
// The account ID is derived from the verified session, never the request body.
function createGooglePlayAccountHandler({ supabase, accountSecret }) {
  return async function account(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método inválido' });
    const auth = typeof req.headers?.authorization === 'string' &&
      req.headers.authorization.match(/^Bearer ([^\s]{1,4096})$/i);
    if (!auth) return res.status(401).json({ error: 'Sessão inválida' });
    if (req.body != null && (typeof req.body !== 'object' || Array.isArray(req.body) || Object.keys(req.body).length)) {
      return res.status(400).json({ error: 'Pedido inválido' });
    }
    try {
      const { data, error } = await supabase.auth.getUser(auth[1]);
      if (error || !data?.user?.id) return res.status(401).json({ error: 'Sessão inválida' });
      const limit = await supabase.rpc('consume_rate_limit', {
        p_scope: 'google-play-account-user', p_identifier: data.user.id, p_limit: 30, p_window_seconds: 3600
      });
      if (limit.error) throw new Error('Rate limit unavailable');
      if (limit.data !== true) return res.status(429).json({ error: 'Demasiadas tentativas' });
      return res.status(200).json({ accountId: googlePlayAccountId(data.user.id, accountSecret) });
    } catch {
      return res.status(503).json({ error: 'Serviço temporariamente indisponível' });
    }
  };
}

module.exports = { createGooglePlayAccountHandler };
