-- Fronteira de acesso da aplicação: cada pessoa só vê e altera os próprios dados.
-- O serviço de pagamento continua a operar com a chave de servidor (service role).

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ganhos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.despesas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "utilizador vê o seu perfil" ON public.profiles;
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = id);
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "utilizador vê os seus ganhos" ON public.ganhos;
CREATE POLICY "ganhos_own_rows"
  ON public.ganhos FOR ALL TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "utilizador vê as suas despesas" ON public.despesas;
CREATE POLICY "despesas_own_rows"
  ON public.despesas FOR ALL TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "utilizador vê as suas metas" ON public.metas;
CREATE POLICY "metas_own_rows"
  ON public.metas FOR ALL TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "acesso com subscricao valida" ON public.user_data;
CREATE POLICY "user_data_own_rows_with_valid_subscription"
  ON public.user_data FOR ALL TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    AND EXISTS (
      SELECT 1 FROM public.subscriptions s
      WHERE s.user_id = (SELECT auth.uid())
        AND (
          s.status IN ('active', 'trialing')
          OR (s.status = 'canceled' AND s.current_period_end > now())
        )
    )
  )
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND EXISTS (
      SELECT 1 FROM public.subscriptions s
      WHERE s.user_id = (SELECT auth.uid())
        AND (
          s.status IN ('active', 'trialing')
          OR (s.status = 'canceled' AND s.current_period_end > now())
        )
    )
  );

DROP POLICY IF EXISTS "utilizador le a sua subscricao" ON public.subscriptions;
CREATE POLICY "subscriptions_select_own"
  ON public.subscriptions FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- Remove o acesso implícito de visitantes. Concede apenas as operações usadas
-- pelo cliente autenticado e nunca expõe identificadores do fornecedor de pagamento.
REVOKE ALL ON TABLE public.profiles, public.ganhos, public.despesas, public.metas,
  public.user_data, public.subscriptions FROM anon;

GRANT SELECT (id, email, nome, plano, created_at, updated_at) ON public.profiles TO authenticated;
GRANT UPDATE (nome) ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ganhos, public.despesas, public.metas TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_data TO authenticated;
GRANT SELECT (id, user_id, plan, status, updated_at, trial_ends_at, current_period_end)
  ON public.subscriptions TO authenticated;

-- Funções de gatilho internas não são endpoints RPC públicos.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated;
