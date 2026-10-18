const { createClient } = require('@supabase/supabase-js');

const supabaseUrl        = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY;
const creemApiKey        = process.env.CREEM_API_KEY;

const supabase = createClient(
  supabaseUrl        || '',
  supabaseServiceKey || '',
  {
    auth: { persistSession: false },
    db:   { schema: 'public' }
  }
);

async function consumeRateLimit(scope, identifier, limit, windowSeconds) {
  const { data, error } = await supabase.rpc('consume_rate_limit', {
    p_scope: scope,
    p_identifier: identifier,
    p_limit: limit,
    p_window_seconds: windowSeconds
  });
  if (error) throw error;
  return data === true;
}

function getClientIp(req) {
  const raw = String(req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || '').split(',')[0].trim();
  return /^[0-9a-fA-F:.]{3,45}$/.test(raw) ? raw : 'unknown';
}

async function deleteSupportAttachments(userId) {
  const bucket = supabase.storage.from('support-attachments');
  // Each page starts at zero because the previous page has been removed.
  for (let page = 0; page < 100; page++) {
    const { data, error } = await bucket.list(userId, { limit: 100 });
    if (error) throw error;
    if (!Array.isArray(data)) throw new Error('Lista de anexos inválida');
    if (data.length === 0) return;
    const paths = data.map(item => {
      if (!item.name || !/^[0-9a-f-]{36}\.(jpg|png|webp|mp4|mov|webm)$/i.test(item.name)) {
        throw new Error('Caminho de anexo inválido');
      }
      return `${userId}/${item.name}`;
    });
    const removed = await bucket.remove(paths);
    if (removed.error) throw removed.error;
  }
  throw new Error('Demasiados anexos para eliminar');
}

/* ── Cancela a subscrição no Creem ──────────────────────────────────────
   Chama a API do Creem para cancelar imediatamente.
   Se o utilizador não tiver subscrição no Creem (novo registo, trial
   sem subscrição gravada), devolve { ok: true } sem fazer nada.
   Se o Creem devolver erro, devolve { ok: false, error }.
──────────────────────────────────────────────────────────────────────── */
async function cancelarSubscricaoNoCreem(subscriptionId) {
  if (!subscriptionId) {
    console.log('Sem creem_subscription_id — nada a cancelar no Creem.');
    return { ok: true };
  }
  if (!creemApiKey) {
    console.error('CREEM_API_KEY não definida — não é possível cancelar no Creem.');
    return { ok: false, error: 'CREEM_API_KEY em falta' };
  }

  try {
    /* Endpoint de cancelamento do Creem:
       POST https://api.creem.io/v1/subscriptions/{id}/cancel
       Autenticação: cabeçalho x-api-key (o Creem não usa Bearer). */
    const res = await fetch(
      `https://api.creem.io/v1/subscriptions/${subscriptionId}/cancel`,
      {
        method: 'POST',
        headers: {
          'x-api-key':    creemApiKey,
          'Content-Type': 'application/json'
        }
      }
    );

    if (res.ok) {
      console.log('✅ Subscrição cancelada no Creem:', subscriptionId);
      return { ok: true };
    }

    /* Lê o corpo do erro para diagnóstico */
    let detail = '';
    try { detail = await res.text(); } catch { /* ignora */ }

    /* 404 significa que a subscrição já não existe no Creem —
       consideramos isto como sucesso (não há nada a cancelar). */
    if (res.status === 404) {
      console.warn('Subscrição não encontrada no Creem (já cancelada?):', subscriptionId);
      return { ok: true };
    }

    console.error(`Creem devolveu ${res.status}:`, detail);
    return { ok: false, error: `Creem ${res.status}: ${detail}` };

  } catch (err) {
    console.error('Erro de rede ao contactar o Creem:', err.message);
    return { ok: false, error: err.message };
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (Number(req.headers['content-length'] || 0) > 1024) {
    return res.status(413).json({ error: 'Pedido demasiado grande' });
  }
  res.setHeader('Cache-Control', 'no-store');

  try {
    /* ── Variáveis de ambiente ── */
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('FATAL: SUPABASE_URL ou service role key em falta.');
      return res.status(500).json({ error: 'Configuração incompleta no servidor' });
    }

    /* ── 1. Verificar o token do utilizador ── */
    const authHeader = req.headers.authorization || '';
    const token      = authHeader.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Token em falta' });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: 'Sessão inválida' });
    }

    const withinUserLimit = await consumeRateLimit('delete-account-user', user.id, 3, 3600);
    const withinIpLimit = await consumeRateLimit('delete-account-ip', getClientIp(req), 10, 3600);
    if (!withinUserLimit || !withinIpLimit) {
      return res.status(429).json({ error: 'Demasiadas tentativas. Tenta novamente mais tarde.' });
    }

    /* ── 2. Ler o creem_subscription_id antes de apagar qualquer coisa ── */
    const { data: subData, error: subError } = await supabase
      .from('subscriptions')
      .select('creem_subscription_id, status')
      .eq('user_id', user.id)
      .maybeSingle();

    if (subError) {
      console.error('Erro ao ler subscrição:', subError);
      return res.status(500).json({ error: 'Erro ao ler dados da subscrição' });
    }

    const subscriptionId = subData?.creem_subscription_id || null;
    const subStatus      = subData?.status || null;

    /* ── 3. Cancelar no Creem (só se houver subscrição activa ou em trial) ──
       Se já estiver "inactive" ou "canceled", não vale a pena chamar o Creem.
       Se não houver linha de subscrição, também não há nada a cancelar. */
    const deveContactarCreem = subscriptionId && subStatus !== 'inactive' && subStatus !== 'canceled';

    if (deveContactarCreem) {
      const resultado = await cancelarSubscricaoNoCreem(subscriptionId);

      if (!resultado.ok) {
        /* O Creem não cancelou — não avançamos para não deixar o
           utilizador sem conta e ainda a ser cobrado.             */
        console.error('Falha ao cancelar no Creem — eliminação abortada.');
        return res.status(500).json({
          error: 'Não foi possível cancelar a subscrição. Tenta novamente ou contacta o suporte.'
        });
      }
    }

    /* Os anexos do contacto são privados e também devem ser removidos. */
    try {
      await deleteSupportAttachments(user.id);
    } catch (err) {
      console.error('Erro ao eliminar anexos de contacto:', err);
      return res.status(500).json({ error: 'Erro ao eliminar anexos da conta' });
    }

    /* O Storage impede a eliminação de um utilizador que seja dono de objetos.
       Este é o único caminho de avatar criado pela aplicação. */
    const { error: storageError } = await supabase.storage.from('avatars').remove([`${user.id}/avatar.jpg`]);
    if (storageError) {
      console.error('Erro ao eliminar avatar:', storageError);
      return res.status(500).json({ error: 'Erro ao eliminar foto da conta' });
    }

    /* A migração user_data_user_id_fkey e a FK existente de subscriptions
       eliminam ambas as tabelas na mesma transação que o utilizador Auth. */
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);

    if (deleteError) {
      console.error('Erro ao eliminar utilizador:', deleteError);
      return res.status(500).json({ error: 'Erro ao eliminar conta' });
    }

    // An upload started just before deletion may have finished during the first cleanup.
    try {
      await deleteSupportAttachments(user.id);
    } catch (err) {
      console.error('Conta eliminada, mas a verificação final dos anexos falhou:', err);
      return res.status(200).json({ ok: true, warning: 'Conta eliminada. Contacta contacto@smartsoma.pt para confirmar a remoção dos anexos.' });
    }

    console.log('🗑️ Conta eliminada com sucesso:', user.id);
    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error('Erro interno:', err);
    return res.status(500).json({ error: 'Erro interno' });
  }
};
