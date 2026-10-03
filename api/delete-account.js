const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(
  supabaseUrl || '',
  supabaseServiceKey || '',
  {
    auth: { persistSession: false },
    db: { schema: 'public' }
  }
);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('FATAL: SUPABASE_URL ou service role key em falta.');
      return res.status(500).json({ error: 'Configuração incompleta no servidor' });
    }

    // Verificar o token do utilizador
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Token em falta' });
    }

    // Confirmar quem é o utilizador pelo token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: 'Sessão inválida' });
    }

    // Eliminar primeiro os dados da app para não deixar registos órfãos.
    const tablesToClean = ['user_data', 'subscriptions'];

    for (const table of tablesToClean) {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error(`Erro ao eliminar dados em ${table}:`, error);
        return res.status(500).json({ error: 'Erro ao eliminar dados da conta' });
      }
    }

    // Eliminar o utilizador do Supabase Auth no fim.
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);

    if (deleteError) {
      console.error('Erro ao eliminar utilizador:', deleteError);
      return res.status(500).json({ error: 'Erro ao eliminar conta' });
    }

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error('Erro interno:', err);
    return res.status(500).json({ error: 'Erro interno' });
  }
};
