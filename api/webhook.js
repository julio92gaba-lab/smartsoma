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
    const event = req.body;

    console.log('Webhook recebido:', event.event_type);
    console.log('Payload completo:', JSON.stringify(event, null, 2));

    /* ── Pagamento/checkout concluído ── */
    if (event.event_type === 'checkout.completed') {
      /* O Creem envia o userId que passámos no checkout (campo metadata) */
      const userId         = event.data?.metadata?.userId
                          || event.data?.metadata?.user_id
                          || event.data?.customer?.metadata?.userId
                          || event.data?.customer?.metadata?.user_id;

      const customerId     = event.data?.customer_id
                          || event.data?.customer?.id;

      const subscriptionId = event.data?.subscription_id
                          || event.data?.subscription?.id
                          || event.data?.id;

      console.log('userId extraído:', userId);

      if (!userId) {
        console.error('user_id em falta no payload:', JSON.stringify(event.data));
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
        console.error('Supabase upsert erro:', error);
        return res.status(500).json({ error: 'Erro ao actualizar Supabase' });
      }

      console.log('Utilizador actualizado para Pro:', userId);
    }

    /* ── Subscrição activa (confirmação posterior do Creem) ── */
    if (event.event_type === 'subscription.active') {
      const userId         = event.data?.metadata?.userId
                          || event.data?.metadata?.user_id;
      const customerId     = event.data?.customer_id;
      const subscriptionId = event.data?.id;

      if (userId) {
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

        if (error) console.error('Supabase upsert erro (subscription.active):', error);
        else console.log('Subscrição activa confirmada para:', userId);
      }
    }

    /* ── Subscrição cancelada ou expirada ── */
    if (
      event.event_type === 'subscription.cancelled' ||
      event.event_type === 'subscription.canceled'  ||
      event.event_type === 'subscription.expired'
    ) {
      const userId = event.data?.metadata?.userId
                  || event.data?.metadata?.user_id;
      if (userId) {
        await supabase
          .from('subscriptions')
          .update({ status: 'inactive', updated_at: new Date().toISOString() })
          .eq('user_id', userId);
        console.log('Subscrição desactivada para:', userId);
      }
    }

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error('Webhook erro geral:', err);
    return res.status(500).json({ error: 'Erro interno' });
  }
};