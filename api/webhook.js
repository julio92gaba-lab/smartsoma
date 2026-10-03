import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const event = req.body;

    // Evento de subscrição ativa
    if (event.event_type === 'subscription.active') {
      const userId   = event.data?.metadata?.user_id;
      const customerId     = event.data?.customer_id;
      const subscriptionId = event.data?.id;

      if (!userId) {
        return res.status(400).json({ error: 'user_id em falta' });
      }

      await supabase
        .from('subscriptions')
        .upsert({
          user_id:               userId,
          plan:                  'pro',
          status:                'active',
          creem_customer_id:     customerId    || null,
          creem_subscription_id: subscriptionId || null,
          updated_at:            new Date().toISOString()
        }, { onConflict: 'user_id' });
    }

    // Evento de subscrição cancelada ou expirada
    if (
      event.event_type === 'subscription.cancelled' ||
      event.event_type === 'subscription.expired'
    ) {
      const userId = event.data?.metadata?.user_id;
      if