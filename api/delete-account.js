const { createClient } = require('@supabase/supabase-js');

const supabaseUrl        = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const creemApiKey        = process.env.CREEM_API_KEY;

const supabase = createClient(
  supabaseUrl        || '',
  supabaseServiceKey || '',
  {
    auth: { persistSession: false },
    db:   { schema: 'public' }
  }
);

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

    /* ── 4. Apagar os dados da app e a linha de subscrição ── */
    for (const table of ['user_data', 'subscriptions']) {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error(`Erro ao eliminar dados em ${table}:`, error);
        return res.status(500).json({ error: 'Erro ao eliminar dados da conta' });
      }
    }

    /* ── 5. Apagar o utilizador do Supabase Auth ── */
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);

    if (deleteError) {
      console.error('Erro ao eliminar utilizador:', deleteError);
      return res.status(500).json({ error: 'Erro ao eliminar conta' });
    }

    console.log('🗑️ Conta eliminada com sucesso:', user.id);
    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error('Erro interno:', err);
    return res.status(500).json({ error: 'Erro interno' });
  }
};