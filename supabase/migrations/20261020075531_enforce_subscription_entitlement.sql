-- Entitlement is evaluated in PostgreSQL, never trusted from the client.
-- Existing rows are preserved; an expired subscription only loses access.
CREATE OR REPLACE FUNCTION public.has_valid_subscription(p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.subscriptions AS s
    WHERE s.user_id = p_user_id
      AND (
        (s.status = 'trialing' AND COALESCE(s.trial_ends_at, s.current_period_end) > statement_timestamp())
        OR (s.status IN ('active', 'canceled') AND s.current_period_end > statement_timestamp())
      )
  );
$$;

REVOKE ALL ON FUNCTION public.has_valid_subscription(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_valid_subscription(uuid) TO authenticated;

DROP POLICY IF EXISTS "user_data_own_rows_with_valid_subscription" ON public.user_data;
CREATE POLICY "user_data_own_rows_with_current_subscription"
  ON public.user_data FOR ALL TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    AND public.has_valid_subscription((SELECT auth.uid()))
  )
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND public.has_valid_subscription((SELECT auth.uid()))
  );

-- These tables contain the paid service itself. Profiles and subscriptions
-- stay readable so an authenticated, blocked user can recover access or leave.
DROP POLICY IF EXISTS "ganhos_own_rows" ON public.ganhos;
CREATE POLICY "ganhos_own_rows_with_current_subscription"
  ON public.ganhos FOR ALL TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    AND public.has_valid_subscription((SELECT auth.uid()))
  )
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND public.has_valid_subscription((SELECT auth.uid()))
  );

DROP POLICY IF EXISTS "despesas_own_rows" ON public.despesas;
CREATE POLICY "despesas_own_rows_with_current_subscription"
  ON public.despesas FOR ALL TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    AND public.has_valid_subscription((SELECT auth.uid()))
  )
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND public.has_valid_subscription((SELECT auth.uid()))
  );

DROP POLICY IF EXISTS "metas_own_rows" ON public.metas;
CREATE POLICY "metas_own_rows_with_current_subscription"
  ON public.metas FOR ALL TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    AND public.has_valid_subscription((SELECT auth.uid()))
  )
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND public.has_valid_subscription((SELECT auth.uid()))
  );

-- The webhook ledger makes duplicate deliveries harmless and allows older
-- provider events to be ignored without deleting subscription history.
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS provider_event_at timestamptz;

CREATE TABLE IF NOT EXISTS public.creem_webhook_events (
  event_id text PRIMARY KEY CHECK (char_length(event_id) BETWEEN 1 AND 200),
  event_type text NOT NULL CHECK (char_length(event_type) BETWEEN 1 AND 100),
  received_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.creem_webhook_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.creem_webhook_events FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT ON TABLE public.creem_webhook_events TO service_role;

CREATE OR REPLACE FUNCTION public.apply_creem_subscription_event(
  p_event_id text,
  p_event_type text,
  p_event_at timestamptz,
  p_user_id uuid,
  p_plan text,
  p_status text,
  p_customer_id text,
  p_subscription_id text,
  p_trial_ends_at timestamptz,
  p_current_period_end timestamptz
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  IF p_event_id IS NULL OR p_event_type IS NULL OR p_event_at IS NULL
     OR p_user_id IS NULL OR p_status NOT IN ('active', 'trialing', 'canceled', 'paused', 'unpaid', 'refunded') THEN
    RAISE EXCEPTION 'invalid Creem webhook event';
  END IF;

  INSERT INTO public.creem_webhook_events (event_id, event_type)
  VALUES (p_event_id, p_event_type)
  ON CONFLICT (event_id) DO NOTHING;
  IF NOT FOUND THEN RETURN false; END IF;

  INSERT INTO public.subscriptions AS current_subscription
    (user_id, plan, status, creem_customer_id, creem_subscription_id,
     trial_ends_at, current_period_end, provider_event_at, updated_at)
  VALUES
    (p_user_id, COALESCE(p_plan, 'pro'), p_status, p_customer_id, p_subscription_id,
     p_trial_ends_at, p_current_period_end, p_event_at, statement_timestamp())
  ON CONFLICT (user_id) DO UPDATE SET
    plan = EXCLUDED.plan,
    status = EXCLUDED.status,
    creem_customer_id = COALESCE(EXCLUDED.creem_customer_id, current_subscription.creem_customer_id),
    creem_subscription_id = COALESCE(EXCLUDED.creem_subscription_id, current_subscription.creem_subscription_id),
    trial_ends_at = EXCLUDED.trial_ends_at,
    current_period_end = EXCLUDED.current_period_end,
    provider_event_at = EXCLUDED.provider_event_at,
    updated_at = statement_timestamp()
  WHERE current_subscription.provider_event_at IS NULL
     OR current_subscription.provider_event_at <= EXCLUDED.provider_event_at;
  RETURN true;
END;
$$;
REVOKE ALL ON FUNCTION public.apply_creem_subscription_event(text, text, timestamptz, uuid, text, text, text, text, timestamptz, timestamptz)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.apply_creem_subscription_event(text, text, timestamptz, uuid, text, text, text, text, timestamptz, timestamptz)
  TO service_role;
