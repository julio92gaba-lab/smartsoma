-- Disposable database only. No production data or remote connection.
BEGIN;
INSERT INTO auth.users (id) VALUES
  ('11111111-1111-4111-8111-111111111111'),
  ('22222222-2222-4222-8222-222222222222');

DO $$
BEGIN
  IF has_table_privilege('anon', 'public.google_play_purchases', 'SELECT') OR
     has_table_privilege('authenticated', 'public.google_play_purchases', 'SELECT') OR
     has_table_privilege('authenticated', 'public.google_play_purchases', 'INSERT') OR
     has_function_privilege('authenticated', 'public.save_verified_google_play_purchase(text,uuid,text,text,timestamptz,text,timestamptz)', 'EXECUTE') OR
     has_function_privilege('anon', 'public.save_verified_google_play_purchase(text,uuid,text,text,timestamptz,text,timestamptz)', 'EXECUTE') THEN
    RAISE EXCEPTION 'Public roles have access to purchase ledger';
  END IF;
END $$;

SET LOCAL ROLE service_role;
DO $$
DECLARE saved boolean;
BEGIN
  SELECT public.save_verified_google_play_purchase(
    'fake-token', '11111111-1111-4111-8111-111111111111', 'pro-monthly',
    'SUBSCRIPTION_STATE_ACTIVE', '2027-01-01Z', 'ACKNOWLEDGEMENT_STATE_PENDING', '2026-10-17T10:00:00Z') INTO saved;
  IF NOT saved THEN RAISE EXCEPTION 'Verified purchase was not saved'; END IF;

  SELECT public.save_verified_google_play_purchase(
    'fake-token', '22222222-2222-4222-8222-222222222222', 'pro-monthly',
    'SUBSCRIPTION_STATE_ACTIVE', '2027-01-01Z', 'ACKNOWLEDGEMENT_STATE_ACKNOWLEDGED', '2026-10-17T11:00:00Z') INTO saved;
  IF saved THEN RAISE EXCEPTION 'A different account took ownership of the token'; END IF;

  SELECT public.save_verified_google_play_purchase(
    'fake-token', '11111111-1111-4111-8111-111111111111', 'pro-monthly',
    'SUBSCRIPTION_STATE_ACTIVE', '2028-01-01Z', 'ACKNOWLEDGEMENT_STATE_ACKNOWLEDGED', '2026-10-17T09:00:00Z') INTO saved;
  IF saved THEN RAISE EXCEPTION 'Older verification overwrote a newer one'; END IF;

  SELECT public.save_verified_google_play_purchase(
    'fake-token', '11111111-1111-4111-8111-111111111111', 'pro-monthly',
    'SUBSCRIPTION_STATE_CANCELED', '2027-02-01Z', 'ACKNOWLEDGEMENT_STATE_ACKNOWLEDGED', '2026-10-17T12:00:00Z') INTO saved;
  IF NOT saved THEN RAISE EXCEPTION 'New verification was not saved'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.google_play_purchases WHERE purchase_token = 'fake-token'
      AND user_id = '11111111-1111-4111-8111-111111111111'
      AND subscription_state = 'SUBSCRIPTION_STATE_CANCELED') THEN
    RAISE EXCEPTION 'Stored purchase does not match expected owner and state';
  END IF;

  SELECT public.save_verified_google_play_purchase(
    'fake-token', '11111111-1111-4111-8111-111111111111', 'pro-monthly',
    'SUBSCRIPTION_STATE_ON_HOLD', '2027-02-01Z', 'ACKNOWLEDGEMENT_STATE_ACKNOWLEDGED', '2026-10-17T13:00:00Z') INTO saved;
  IF NOT saved OR NOT EXISTS (SELECT 1 FROM public.google_play_purchases WHERE purchase_token = 'fake-token'
      AND subscription_state = 'SUBSCRIPTION_STATE_ON_HOLD') THEN
    RAISE EXCEPTION 'Payment failure state was not recorded';
  END IF;

  SELECT public.save_verified_google_play_purchase(
    repeat('x', 8192), '11111111-1111-4111-8111-111111111111', 'pro-monthly',
    'SUBSCRIPTION_STATE_ACTIVE', '2027-01-01Z', 'ACKNOWLEDGEMENT_STATE_PENDING', '2026-10-17T12:00:00Z') INTO saved;
  IF NOT saved THEN RAISE EXCEPTION 'Long token could not be stored'; END IF;
END $$;

RESET ROLE;
DO $$
BEGIN
  BEGIN
    DELETE FROM auth.users WHERE id = '11111111-1111-4111-8111-111111111111';
    RAISE EXCEPTION 'Account with Google purchase was deleted without handling billing';
  EXCEPTION WHEN foreign_key_violation THEN NULL;
  END;
END $$;
ROLLBACK;
