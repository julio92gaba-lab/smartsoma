const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const event     = req.body;
    const eventType = event.eventType;   // ← camelCase, não event_type
    const obj       = event.object;      // ← event.object, não event.data

    console.log('Webhook recebido:', eventType);

    /* ── Checkout concluído ── */
    if (eventType === 'checkout.completed') {
      const userId         = obj?.metadata?.user_id
                          || obj?.customer?.metadata?.user_id
                          || obj?.subscription?.metadata?.user_id;

      const customerId     = obj?.customer?.id;
      const subscriptionId = obj?.subscription?.id;

      console.log('userId:', userId);

      if (!userId) {
        console.error('user_id em falta:', JSON.stringify(obj));
        return res.status(400).json({ error: 'user_id em falta' });
      }

      const { error } = await supabase
        .from('subscriptions')
        .upsert({
          user_id:               userId,
          plan:                  'pro',
          status:                'active',
          creem_customer_id:     customerId     || null,
          creem_subscription_id: subscriptionId || null,
          updated_at:            new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (error) {
        console.error('Supabase erro:', error);
        return res.status(500).json({ error: 'Erro Supabase' });
      }

      console.log('Utilizador activado Pro:', userId);
    }

    /* ── Subscrição cancelada ou expirada ── */
    if (
      eventType === 'subscription.cancelled' ||
      eventType === 'subscription.canceled'  ||
      eventType === 'subscription.expired'
    ) {
      const userId = obj?.metadata?.user_id
                  || obj?.customer?.metadata?.user_id;

      if (userId) {
        await supabase
          .from('subscriptions')
          .update({ status: 'inactive', updated_at: new Date().toISOString() })
          .eq('user_id', userId);
        console.log('Subscrição desactivada:', userId);
      }
    }

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error('Webhook erro geral:', err);
    return res.status(500).json({ error: 'Erro interno' });
  }
};