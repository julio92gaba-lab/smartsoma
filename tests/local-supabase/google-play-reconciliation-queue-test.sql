-- Run only in a disposable, isolated database with the billing migrations.
BEGIN;
INSERT INTO auth.users (id) VALUES ('11111111-1111-4111-8111-111111111111');

DO $$
BEGIN
  IF has_function_privilege('anon', 'public.claim_google_play_reconciliation(integer)', 'EXECUTE') OR
     has_function_privilege('authenticated', 'public.claim_google_play_reconciliation(integer)', 'EXECUTE') OR
     NOT has_function_privilege('service_role', 'public.claim_google_play_reconciliation(integer)', 'EXECUTE') THEN
    RAISE EXCEPTION 'Incorrect queue permissions';
  END IF;
END $$;

SET LOCAL ROLE service_role;
INSERT INTO public.google_play_purchases (purchase_token, purchase_token_hash, user_id, product_id,
  subscription_state, expires_at, acknowledgement_state, checked_at, next_reconcile_at)
SELECT 'fake-' || n, encode(sha256(convert_to('fake-' || n, 'UTF8')), 'hex'),
  '11111111-1111-4111-8111-111111111111', 'pro-monthly', 'SUBSCRIPTION_STATE_ACTIVE',
  now() + interval '1 day', 'ACKNOWLEDGEMENT_STATE_PENDING', now(), now() - interval '1 hour'
FROM generate_series(1, 12) AS n;
INSERT INTO public.google_play_purchases (purchase_token, purchase_token_hash, user_id, product_id,
  subscription_state, expires_at, acknowledgement_state, checked_at, next_reconcile_at)
VALUES ('too-old', encode(sha256(convert_to('too-old', 'UTF8')), 'hex'),
  '11111111-1111-4111-8111-111111111111', 'pro-monthly', 'SUBSCRIPTION_STATE_EXPIRED',
  now() - interval '61 days', 'ACKNOWLEDGEMENT_STATE_ACKNOWLEDGED', now(), now() - interval '1 hour');

DO $$
DECLARE count_claimed integer;
BEGIN
  SELECT count(*) INTO count_claimed FROM public.claim_google_play_reconciliation(11);
  IF count_claimed <> 0 THEN RAISE EXCEPTION 'Invalid batch size accepted'; END IF;
  SELECT count(*) INTO count_claimed FROM public.claim_google_play_reconciliation(10);
  IF count_claimed <> 10 THEN RAISE EXCEPTION 'Incorrect first batch'; END IF;
  SELECT count(*) INTO count_claimed FROM public.claim_google_play_reconciliation(10);
  IF count_claimed <> 2 THEN RAISE EXCEPTION 'Claimed records repeated or stale token selected'; END IF;
  SELECT count(*) INTO count_claimed FROM public.claim_google_play_reconciliation(10);
  IF count_claimed <> 0 THEN RAISE EXCEPTION 'Lease did not prevent immediate retry'; END IF;
  UPDATE public.google_play_purchases SET next_reconcile_at = now() - interval '1 minute' WHERE purchase_token = 'fake-1';
  SELECT count(*) INTO count_claimed FROM public.claim_google_play_reconciliation(10);
  IF count_claimed <> 1 THEN RAISE EXCEPTION 'Expired lease was not retried'; END IF;
END $$;
ROLLBACK;
