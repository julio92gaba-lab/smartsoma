-- Server-only purchase ledger. It is intentionally separate from the Creem
-- subscriptions table; it does not grant access in the existing application.
CREATE TABLE public.google_play_purchases (
  purchase_token text NOT NULL CHECK (char_length(purchase_token) BETWEEN 1 AND 8192),
  purchase_token_hash text PRIMARY KEY CHECK (purchase_token_hash = encode(sha256(convert_to(purchase_token, 'UTF8')), 'hex')),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  product_id text NOT NULL CHECK (product_id ~ '^[a-z0-9][a-z0-9._-]{0,99}$'),
  subscription_state text NOT NULL CHECK (subscription_state IN (
    'SUBSCRIPTION_STATE_ACTIVE', 'SUBSCRIPTION_STATE_IN_GRACE_PERIOD', 'SUBSCRIPTION_STATE_CANCELED'
  )),
  expires_at timestamptz NOT NULL,
  acknowledgement_state text NOT NULL CHECK (acknowledgement_state IN (
    'ACKNOWLEDGEMENT_STATE_PENDING', 'ACKNOWLEDGEMENT_STATE_ACKNOWLEDGED'
  )),
  checked_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX google_play_purchases_user_id_idx ON public.google_play_purchases (user_id);
ALTER TABLE public.google_play_purchases ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.google_play_purchases FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.google_play_purchases TO service_role;

-- Atomic ownership check: a token cannot be moved between accounts. An older
-- verification cannot overwrite a newer one. The caller is server-side only.
CREATE FUNCTION public.save_verified_google_play_purchase(
  p_purchase_token text, p_user_id uuid, p_product_id text, p_subscription_state text,
  p_expires_at timestamptz, p_acknowledgement_state text, p_checked_at timestamptz
) RETURNS boolean
LANGUAGE sql SECURITY INVOKER SET search_path = '' AS $$
  WITH saved AS (
    INSERT INTO public.google_play_purchases AS current_purchase
      (purchase_token, purchase_token_hash, user_id, product_id, subscription_state, expires_at, acknowledgement_state, checked_at)
    VALUES
      (p_purchase_token, encode(sha256(convert_to(p_purchase_token, 'UTF8')), 'hex'), p_user_id, p_product_id,
       p_subscription_state, p_expires_at, p_acknowledgement_state, p_checked_at)
    ON CONFLICT (purchase_token_hash) DO UPDATE SET
      product_id = EXCLUDED.product_id,
      subscription_state = EXCLUDED.subscription_state,
      expires_at = EXCLUDED.expires_at,
      acknowledgement_state = EXCLUDED.acknowledgement_state,
      checked_at = EXCLUDED.checked_at,
      updated_at = now()
    WHERE current_purchase.user_id = EXCLUDED.user_id
      AND current_purchase.purchase_token = EXCLUDED.purchase_token
      AND current_purchase.checked_at < EXCLUDED.checked_at
    RETURNING 1
  )
  SELECT EXISTS (SELECT 1 FROM saved);
$$;
REVOKE ALL ON FUNCTION public.save_verified_google_play_purchase(text, uuid, text, text, timestamptz, text, timestamptz)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.save_verified_google_play_purchase(text, uuid, text, text, timestamptz, text, timestamptz)
  TO service_role;
