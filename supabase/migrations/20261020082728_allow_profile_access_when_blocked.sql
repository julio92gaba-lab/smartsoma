-- A pessoa continua autenticada mesmo sem entitlement. O perfil é necessário
-- para identificação, fotografia e recuperação da conta, mas não contém os
-- registos financeiros pagos.
DROP POLICY IF EXISTS "user_data_own_rows_with_current_subscription" ON public.user_data;
CREATE POLICY "user_data_own_rows_with_profile_access"
  ON public.user_data FOR ALL TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    AND (key = 'mydocs.profile' OR public.has_valid_subscription((SELECT auth.uid())))
  )
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND (key = 'mydocs.profile' OR public.has_valid_subscription((SELECT auth.uid())))
  );
