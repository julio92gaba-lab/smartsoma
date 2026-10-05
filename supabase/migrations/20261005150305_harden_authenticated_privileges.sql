-- Defense in depth: the REST API does not expose DDL, but application roles
-- should not retain privileges they never need.
REVOKE TRUNCATE, TRIGGER, REFERENCES ON TABLE
  public.profiles,
  public.ganhos,
  public.despesas,
  public.metas,
  public.user_data
FROM authenticated;

-- Payment-provider identifiers are server-only. Revoke an older table-level
-- SELECT grant before granting the intentionally filtered response shape.
REVOKE ALL PRIVILEGES ON TABLE public.subscriptions FROM authenticated;
GRANT SELECT (id, user_id, plan, status, updated_at, trial_ends_at, current_period_end)
  ON TABLE public.subscriptions TO authenticated;
