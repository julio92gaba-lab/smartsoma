-- Preparation only: do not apply in production until the complete billing and
-- account-deletion flows, scheduler, monitoring and real tests are ready.
ALTER TABLE public.google_play_purchases
  ADD COLUMN next_reconcile_at timestamptz NOT NULL DEFAULT now();
CREATE INDEX google_play_purchases_reconcile_idx
  ON public.google_play_purchases (next_reconcile_at, purchase_token_hash);

-- A short database transaction claims at most ten server-owned tokens. It
-- never performs network calls. A crashed worker can retry after 30 minutes.
-- No public role can execute this function or read its returned tokens.
CREATE FUNCTION public.claim_google_play_reconciliation(p_limit integer)
RETURNS TABLE (user_id uuid, purchase_token text)
LANGUAGE sql SECURITY INVOKER SET search_path = '' AS $$
  WITH due AS (
    SELECT p.purchase_token_hash
    FROM public.google_play_purchases AS p
    WHERE p.next_reconcile_at <= statement_timestamp()
      AND (p.subscription_state <> 'SUBSCRIPTION_STATE_EXPIRED'
        OR p.expires_at > statement_timestamp() - interval '60 days')
    ORDER BY p.next_reconcile_at, p.purchase_token_hash
    FOR UPDATE SKIP LOCKED
    LIMIT CASE WHEN p_limit BETWEEN 1 AND 10 THEN p_limit ELSE 0 END
  ), claimed AS (
    UPDATE public.google_play_purchases AS p
    SET next_reconcile_at = statement_timestamp() + interval '30 minutes'
    FROM due
    WHERE p.purchase_token_hash = due.purchase_token_hash
    RETURNING p.user_id, p.purchase_token
  )
  SELECT claimed.user_id, claimed.purchase_token FROM claimed;
$$;
REVOKE ALL ON FUNCTION public.claim_google_play_reconciliation(integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_google_play_reconciliation(integer) TO service_role;
