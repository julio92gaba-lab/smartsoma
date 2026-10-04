const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');



/* ── Validação das variáveis de ambiente no arranque ── */
const REQUIRED_VARS = ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY', 'CREEM_WEBHOOK_SECRET'];
for (const v of REQUIRED_VARS) {
  if (!process.env[v]) {
    console.error(`FATAL: variável de ambiente "${v}" em falta.`);
  }
}

const supabase = createClient(
  process.env.SUPABASE_URL  || '',
  process.env.SUPABASE_SERVICE_KEY || '',
  {
    auth: { persistSession: false },
    db:   { schema: 'public' }
  }
);

/* ══════════════════════════════════════════════════════════════════════
   VALIDAÇÃO DE ASSINATURA DO CREEM
   O Creem envia o header "creem-signature" com o HMAC-SHA256 do corpo
   cru (raw body). Calculamos o mesmo e comparamos. Se não bater, o
   pedido é rejeitado com 401.
   Requer que a Vercel não faça parse do body antes deste handler —
   ver nota em vercel.json abaixo.
══════════════════════════════════════════════════════════════════════ */
function validarAssinatura(rawBody, signatureHeader) {
  const secret = process.env.CREEM_WEBHOOK_SECRET;
  if (!secret) {
    console.error('CREEM_WEBHOOK_SECRET não definido — assinatura não validada!');
    return false;
  }
  if (!signatureHeader) {
    console.error('Header creem-signature ausente.');
    return false;
  }

  /* O Creem pode enviar "sha256=<hex>" ou só o hex directamente */
  const received = signatureHeader.startsWith('sha256=')
    ? signatureHeader.slice(7)
    : signatureHeader;

  const expected = crypto
    .createHmac('sha256', secret)
    .update(rawBody, 'utf8')
    .digest('hex');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(received, 'hex'),
      Buffer.from(expected, 'hex')
    );
  } catch {
    return false;
  }
}

/* ── Upsert com retry (protege contra timeouts pontuais do Supabase) ── */
async function upsertComRetry(payload, tentativas = 3) {
  for (let i = 0; i < tentativas; i++) {
    const { error } = await supabase
      .from('subscriptions')
      .upsert(payload, { onConflict: 'user_id' });

    if (!error) return null;
    if (error.code === '42501') return error; /* permissão — inútil repetir */

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

/* ── Extrai plan de qualquer parte do payload do Creem ── */
function extrairPlan(obj) {
  return obj?.metadata?.plan
      || obj?.subscription?.metadata?.plan
      || obj?.order?.metadata?.plan
      || null;
}

/* ── Calcula data de fim de trial (agora + 15 dias) ── */
function trialEndsAt() {
  const d = new Date();
  d.setDate(d.getDate() + 15);
  return d.toISOString();
}

/* ── Extrai current_period_end do payload do Creem (se existir) ── */
function extrairPeriodEnd(obj) {
  /* O Creem pode enviar como Unix timestamp (segundos) ou ISO string */
  const raw = obj?.current_period_end
           || obj?.subscription?.current_period_end
           || null;
  if (!raw) return null;
  if (typeof raw === 'number') return new Date(raw * 1000).toISOString();
  return raw; /* já é string ISO */
}

/* ── Idempotência: registo de eventos já processados (por instância) ── */
const eventosProcessados = new Set();

/* ════════════════════════════════════════════════════════════════════
   HANDLER PRINCIPAL
   NOTA: Para que a validação de assinatura funcione, o Vercel não
   deve fazer parse automático do body nesta rota. Adiciona em
   vercel.json:
     "functions": { "api/webhook.js": { "bodyParser": false } }
   O handler lê o corpo cru do stream e depois faz JSON.parse.
════════════════════════════════════════════════════════════════════ */
async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  /* ── Leitura do corpo cru (necessário para validar assinatura) ── */
  let rawBody = '';
  try {
    rawBody = await new Promise((resolve, reject) => {
      let data = '';
      req.on('data', chunk => { data += chunk; });
      req.on('end',  () => resolve(data));
      req.on('error', reject);
    });
  } catch (err) {
    console.error('Erro ao ler body:', err);
    return res.status(400).json({ error: 'Erro ao ler pedido' });
  }

  /* ── Validação de assinatura ── */
  const signatureHeader = req.headers['creem-signature'] || '';
  if (!validarAssinatura(rawBody, signatureHeader)) {
    console.error('Assinatura inválida — pedido rejeitado.');
    return res.status(401).json({ error: 'Assinatura inválida' });
  }

  /* ── Parse do JSON ── */
  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    console.error('Body não é JSON válido');
    return res.status(400).json({ error: 'Payload inválido' });
  }

  try {
    const eventType = event.eventType;
    const eventId   = event.id;
    const obj       = event.object;

    console.log('Webhook recebido:', eventType, '| event.id:', eventId);

    /* ── Idempotência ── */
    if (eventId && eventosProcessados.has(eventId)) {
      console.log('Evento duplicado ignorado:', eventId);
      return res.status(200).json({ ok: true, duplicado: true });
    }
    if (eventId) eventosProcessados.add(eventId);

    /* ── Variáveis de ambiente ── */
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      console.error('Variáveis de ambiente Supabase em falta');
      return res.status(500).json({ error: 'Configuração incompleta no servidor' });
    }

    /* Valida formato UUID básico */
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    /* ══════════════════════════════════════════════════════════════
       CHECKOUT CONCLUÍDO → iniciar trial de 15 dias
       O utilizador acabou de inserir o cartão. Fica em "trialing"
       durante 15 dias. Só passa a "active" quando o Creem confirmar
       o primeiro pagamento real (subscription.active).
    ══════════════════════════════════════════════════════════════ */
    if (eventType === 'checkout.completed') {
      const userId         = extrairUserId(obj);
      const customerId     = obj?.customer?.id     || null;
      const subscriptionId = obj?.subscription?.id || null;
      const plan           = extrairPlan(obj);

      if (!userId) {
        console.error('user_id em falta no payload checkout.completed:', JSON.stringify(obj));
        return res.status(200).json({ ok: false, motivo: 'user_id em falta' });
      }
      if (!uuidRegex.test(userId)) {
        console.error('user_id com formato inválido:', userId);
        return res.status(200).json({ ok: false, motivo: 'user_id inválido' });
      }

      const erro = await upsertComRetry({
        user_id:               userId,
        plan:                  plan,
        status:                'trialing',
        trial_ends_at:         trialEndsAt(),
        current_period_end:    null,
        creem_customer_id:     customerId,
        creem_subscription_id: subscriptionId,
        updated_at:            new Date().toISOString()
      });

      if (erro) {
        console.error('Supabase erro final (checkout.completed):', erro);
        return res.status(500).json({ error: 'Erro ao activar trial' });
      }

      console.log('✅ Trial iniciado (' + plan + '):', userId);
    }

    /* ══════════════════════════════════════════════════════════════
       SUBSCRIÇÃO ACTIVA → primeiro pagamento real confirmado
       O trial terminou e o Creem cobrou com sucesso. Passa a "active"
       e guarda a data do próximo pagamento (current_period_end).
    ══════════════════════════════════════════════════════════════ */
    if (eventType === 'subscription.active') {
      const userId         = extrairUserId(obj);
      const customerId     = obj?.customer_id || obj?.customer?.id || null;
      const subscriptionId = obj?.id          || null;
      const planActive     = extrairPlan(obj);
      const periodEnd      = extrairPeriodEnd(obj);

      if (userId) {
        const erro = await upsertComRetry({
          user_id:               userId,
          plan:                  planActive,
          status:                'active',
          trial_ends_at:         null,
          current_period_end:    periodEnd,
          creem_customer_id:     customerId,
          creem_subscription_id: subscriptionId,
          updated_at:            new Date().toISOString()
        });
        if (erro) console.error('Supabase erro (subscription.active):', erro);
        else console.log('✅ Subscrição activa confirmada (' + planActive + '):', userId, '| fim:', periodEnd);
      }
    }

    /* ══════════════════════════════════════════════════════════════
       RENOVAÇÃO / PAGAMENTO BEM-SUCEDIDO
       Actualiza current_period_end para a próxima renovação e
       garante que o status é "active".
    ══════════════════════════════════════════════════════════════ */
    if (eventType === 'subscription.renewed' || eventType === 'payment.succeeded') {
      const userId    = extrairUserId(obj);
      const periodEnd = extrairPeriodEnd(obj);

      if (userId) {
        const erro = await updateComRetry(userId, {
          status:             'active',
          current_period_end: periodEnd
        });
        if (erro) console.error('Supabase erro (renovação):', erro);
        else console.log('🔄 Renovação registada:', userId, '| próximo fim:', periodEnd);
      }
    }

    /* ══════════════════════════════════════════════════════════════
       TRIAL TERMINADO SEM PAGAMENTO
       O utilizador não foi cobrado (cartão recusado ou cancelou antes).
       Passa directamente a "inactive".
    ══════════════════════════════════════════════════════════════ */
    if (eventType === 'subscription.trial_ended') {
      const userId = extrairUserId(obj);

      if (userId) {
        const erro = await updateComRetry(userId, {
          status:             'inactive',
          trial_ends_at:      null,
          current_period_end: null,
          plan:               null
        });
        if (erro) console.error('Supabase erro (trial_ended):', erro);
        else console.log('⏰ Trial expirado sem pagamento:', userId);
      }
    }

    /* ══════════════════════════════════════════════════════════════
       CANCELAMENTO AGENDADO
       O utilizador cancelou mas o período já pago ainda está a correr.
       NÃO revogamos o acesso agora — o acesso mantém-se até
       current_period_end. Registamos que está "canceled" para quando
       a app perguntar ao Supabase já mostrar a mensagem correcta.
    ══════════════════════════════════════════════════════════════ */
    if (
      eventType === 'subscription.cancelled' ||
      eventType === 'subscription.canceled'
    ) {
      const userId    = extrairUserId(obj);
      const periodEnd = extrairPeriodEnd(obj);

      if (userId) {
        /* "canceled" = cancelado mas ainda com acesso até period_end   */
        /* "inactive" = sem acesso (tratado em subscription.expired)    */
        const erro = await updateComRetry(userId, {
          status:             'canceled',
          current_period_end: periodEnd
        });
        if (erro) console.error('Supabase erro (cancelamento):', erro);
        else console.log('🚫 Subscrição cancelada (acesso até', periodEnd, '):', userId);
      } else {
        console.warn('Cancelamento recebido sem user_id:', JSON.stringify(obj));
      }
    }

    /* ══════════════════════════════════════════════════════════════
       EXPIRAÇÃO DEFINITIVA
       O período pago terminou. Revoga o acesso agora.
    ══════════════════════════════════════════════════════════════ */
    if (eventType === 'subscription.expired') {
      const userId = extrairUserId(obj);

      if (userId) {
        const erro = await updateComRetry(userId, {
          status:             'inactive',
          current_period_end: null,
          plan:               null
        });
        if (erro) console.error('Supabase erro (expiração):', erro);
        else console.log('⛔ Acesso revogado (expiração):', userId);
      }
    }

    /* ── Regista eventos não tratados para diagnóstico ── */
    const eventosConhecidos = [
      'checkout.completed',
      'subscription.active',
      'subscription.renewed',
      'subscription.trial_ended',
      'subscription.cancelled',
      'subscription.canceled',
      'subscription.expired',
      'payment.succeeded'
    ];
    if (!eventosConhecidos.includes(eventType)) {
      console.log('Evento não tratado (ignorado):', eventType);
    }

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error('Webhook erro geral não esperado:', err);
    return res.status(200).json({ ok: false, error: 'Erro interno' });
  }
}

/* ── Desactiva o body parser automático da Vercel para esta rota ──
   Sem isto a Vercel consome o stream antes do handler e não é possível
   ler o corpo cru para validar a assinatura do Creem.              ── */
module.exports = handler;
module.exports.config = { api: { bodyParser: false } };