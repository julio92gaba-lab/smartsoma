import { createClient } from "https://esm.sh/@supabase/supabase-js@2.117.2"
import { createCleanupHandler } from "./handler.mjs"

function makeClient() {
  const url = Deno.env.get("SUPABASE_URL")
  try {
    const key = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") || "{}").default
    if (!url || !key) return null
    return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
  } catch { return null }
}

Deno.serve(createCleanupHandler({ makeClient, getEnv: (name: string) => Deno.env.get(name) }))
