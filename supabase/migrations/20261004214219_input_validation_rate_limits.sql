-- Limites que também valem para pedidos forjados diretamente na Data API.
-- NOT VALID preserva dados legados, mas valida todas as novas escritas.
ALTER TABLE public.user_data
  ADD CONSTRAINT user_data_key_format
    CHECK (key ~ '^[A-Za-z0-9:_-]{1,120}$') NOT VALID,
  ADD CONSTRAINT user_data_value_size
    CHECK (value IS NULL OR octet_length(value) <= 400000) NOT VALID;

CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;

CREATE TABLE IF NOT EXISTS private.rate_limit_windows (
  scope text NOT NULL,
  identifier text NOT NULL,
  window_started_at timestamptz NOT NULL DEFAULT now(),
  request_count integer NOT NULL DEFAULT 0 CHECK (request_count >= 0),
  PRIMARY KEY (scope, identifier)
);
REVOKE ALL ON TABLE private.rate_limit_windows FROM PUBLIC, anon, authenticated;

-- Só o código de servidor com service_role pode invocar esta função. O lock
-- transacional torna o contador atómico mesmo em execuções concorrentes.
CREATE OR REPLACE FUNCTION public.consume_rate_limit(
  p_scope text,
  p_identifier text,
  p_limit integer,
  p_window_seconds integer
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, private
AS $$
DECLARE
  v_count integer;
  v_window_started_at timestamptz;
BEGIN
  IF p_scope !~ '^[a-z0-9:_-]{1,64}$'
     OR length(p_identifier) NOT BETWEEN 1 AND 200
     OR p_limit NOT BETWEEN 1 AND 10000
     OR p_window_seconds NOT BETWEEN 1 AND 86400 THEN
    RETURN false;
  END IF;

  PERFORM pg_advisory_xact_lock(hashtext(p_scope || ':' || p_identifier));

  SELECT request_count, window_started_at
    INTO v_count, v_window_started_at
    FROM private.rate_limit_windows
    WHERE scope = p_scope AND identifier = p_identifier
    FOR UPDATE;

  IF NOT FOUND THEN
    INSERT INTO private.rate_limit_windows (scope, identifier, request_count)
      VALUES (p_scope, p_identifier, 1);
    RETURN true;
  END IF;

  IF v_window_started_at <= now() - make_interval(secs => p_window_seconds) THEN
    UPDATE private.rate_limit_windows
      SET window_started_at = now(), request_count = 1
      WHERE scope = p_scope AND identifier = p_identifier;
    RETURN true;
  END IF;

  UPDATE private.rate_limit_windows
    SET request_count = request_count + 1
    WHERE scope = p_scope AND identifier = p_identifier
    RETURNING request_count INTO v_count;

  RETURN v_count <= p_limit;
END;
$$;

REVOKE ALL ON FUNCTION public.consume_rate_limit(text, text, integer, integer)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_rate_limit(text, text, integer, integer)
  TO service_role;
