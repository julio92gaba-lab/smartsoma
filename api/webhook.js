const { createClient } = require('@supabase/supabase-js');

/* ── Validação das variáveis de ambiente no arranque ── */
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  console.error('FATAL: SUPABASE_URL ou SUPABASE_SERVICE_KEY em falta nas variáveis de ambiente.');
}

const supabase = createClient(
  process.env.SUPABASE_URL  || '',
  process.env.SUPABASE_SERVICE_KEY || '',
  {
    auth: { persistSession: false },
    db:   { schema: 'public' }
  }
);

/* ── Upsert com retry (protege contra timeouts pontuais do Supabase) ── */
async function upsertComRetry(payload, tentativas = 3) {
  for (let i = 0; i < tentativas; i++) {
    const { error } = await supabase
      .from('subscriptions')
      .upsert(payload, { onConflict: 'user_id' });

    if (!error) return null;

    /* Erro de permissão — inútil repetir */
    if (error.code === '42501') return error;

    console.warn(`Supabase upsert tentativa ${i + 1} falhou:`, error.message);
    if (i < tentativas - 1) await sleep(400 * (i + 1));
  }
  return { message: `Falhou após ${tentativas} tentativas` };
}

/* ── Update com retry ── */
async function updateComRetry(userId, campos, tentativas = 3) {
  for (let i = 0; i < tentativas; i++) {
    const { error } = await supabase
      .from('subscriptions')
      .update({ ...campos, updated_at: new Date().toISOString() })
      .eq('user_id', userId);

    if (!error) return null;
    if (error.code === '42501') return error;

    console.warn(`Supabase update tentativa ${i + 1} falhou:`, error.message);
    if (i < tentativas - 1) await sleep(400 * (i + 1));
  }
  return { message: `Update falhou após ${tentativas} tentativas` };
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* ── Extrai user_id de qualquer parte do payload do Creem ── */
function extrairUserId(obj) {
  return obj?.metadata?.user_id
      || obj?.customer?.metadata?.user_id
      || obj?.subscription?.metadata?.user_id
      || obj?.order?.metadata?.user_id
      || null;
}

/* ── Registo de eventos já processados (idempotência por event.id) ──
   Usa a própria tabela subscriptions para não precisar de tabela extra.
   Se o evento já foi processado, ignora silenciosamente.            ── */
const eventosProcessados = new Set(); // memória local (por instância Vercel)

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  /* ── Protecção: payload vazio ou não-JSON ── */
  if (!req.body || typeof req.body !== 'object') {
    console.error('Payload inválido recebido');
    return res.status(400).json({ error: 'Payload inválido' });
  }

  try {
    const event     = req.body;
    const eventType = event.eventType;
    const eventId   = event.id;
    const obj       = event.object;

    console.log('Webhook recebido:', eventType, '| event.id:', eventId);

    /* ── Idempotência: ignora eventos duplicados ── */
    if (eventId && eventosProcessados.has(eventId)) {
      console.log('Evento duplicado ignorado:', eventId);
      return res.status(200).json({ ok: true, duplicado: true });
    }
    if (eventId) eventosProcessados.add(eventId);

    /* ── Protecção: variáveis de ambiente em falta ── */
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      console.error('Variáveis de ambiente Supabase em falta');
      return res.status(500).json({ error: 'Configuração incompleta no servidor' });
    }

    /* ══════════════════════════════════════════
       CHECKOUT CONCLUÍDO → activar subscrição
    ══════════════════════════════════════════ */
    if (eventType === 'checkout.completed') {
      const userId         = extrairUserId(obj);
      const customerId     = obj?.customer?.id     || null;
      const subscriptionId = obj?.subscription?.id || null;
      const plan           = obj?.metadata?.plan
                          || obj?.subscription?.metadata?.plan
                          || obj?.order?.metadata?.plan
                          || null;

      if (!userId) {
        console.error('user_id em falta no payload checkout.completed:', JSON.stringify(obj));
        /* Retornamos 200 para o Creem não reenviar infinitamente */
        return res.status(200).json({ ok: false, motivo: 'user_id em falta' });
      }

      /* Valida formato UUID básico */
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(userId)) {
        console.error('user_id com formato inválido:', userId);
        return res.status(200).json({ ok: false, motivo: 'user_id inválido' });
      }

      const erro = await upsertComRetry({
        user_id:               userId,
        plan:                  plan,
        status:                'active',
        creem_customer_id:     customerId,
        creem_subscription_id: subscriptionId,
        updated_at:            new Date().toISOString()
      });

      if (erro) {
        console.error('Supabase erro final (checkout.completed):', erro);
        return res.status(500).json({ error: 'Erro ao activar subscrição' });
      }

      console.log('✅ Utilizador activado (' + plan + '):', userId);
    }

    /* ══════════════════════════════════════════
       SUBSCRIÇÃO ACTIVA — confirmar plano (semanal/mensal)
    ══════════════════════════════════════════ */
    if (eventType === 'subscription.active') {
      const userId         = extrairUserId(obj);
      const customerId     = obj?.customer_id || obj?.customer?.id || null;
      const subscriptionId = obj?.id          || null;

      const planActive = obj?.metadata?.plan
                      || obj?.subscription?.metadata?.plan
                      || null;
      if (userId) {
        const erro = await upsertComRetry({
          user_id:               userId,
          plan:                  planActive,
          status:                'active',
          creem_customer_id:     customerId,
          creem_subscription_id: subscriptionId,
          updated_at:            new Date().toISOString()
        });
        if (erro) console.error('Supabase erro (subscription.active):', erro);
        else console.log('✅ Subscrição activa confirmada (' + planActive + '):', userId);
      }
    }

    /* ══════════════════════════════════════════
       SUBSCRIÇÃO CANCELADA / EXPIRADA
    ══════════════════════════════════════════ */
    if (
      eventType === 'subscription.cancelled' ||
      eventType === 'subscription.canceled'  ||
      eventType === 'subscription.expired'
    ) {
      const userId = extrairUserId(obj);

      if (userId) {
        const erro = await updateComRetry(userId, { status: 'inactive', plan: null });
        if (erro) console.error('Supabase erro (cancelamento):', erro);
        else console.log('⛔ Subscrição desactivada:', userId);
      } else {
        console.warn('Cancelamento recebido sem user_id:', JSON.stringify(obj));
      }
    }

    /* ── Regista tipos de eventos desconhecidos para diagnóstico futuro ── */
    const eventosConhecidos = [
      'checkout.completed',
      'subscription.active',
      'subscription.cancelled',
      'subscription.canceled',
      'subscription.expired'
    ];
    if (!eventosConhecidos.includes(eventType)) {
      console.log('Evento não tratado (ignorado):', eventType);
    }

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error('Webhook erro geral não esperado:', err);
    /* Retorna 200 para evitar reenvios infinitos do Creem */
    return res.status(200).json({ ok: false, error: 'Erro interno' });
  }
};