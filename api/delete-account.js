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

    // Eliminar o utilizador do Supabase Auth
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