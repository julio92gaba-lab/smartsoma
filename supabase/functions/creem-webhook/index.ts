import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

function getDefaultSecretKey(): string | null {
  const rawKeys = Deno.env.get("SUPABASE_SECRET_KEYS")
  if (!rawKeys) return null

  try {
    const keys = JSON.parse(rawKeys)
    return typeof keys.default === "string" ? keys.default : null
  } catch {
    return null
  }
}

serve(async (req) => {
  const signature = req.headers.get("creem-signature")
  const webhookSecret = Deno.env.get("CREEM_WEBHOOK_SECRET")
  const rawBody = await req.text()

  if (!signature || !webhookSecret) {
    return new Response("Unauthorized", { status: 401 })
  }

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(webhookSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  )
  const signatureBytes = new Uint8Array(
    (signature.match(/.{1,2}/g) || []).map((byte) => parseInt(byte, 16)),
  )
  const verified = await crypto.subtle.verify(
    "HMAC",
    key,
    signatureBytes,
    new TextEncoder().encode(rawBody),
  )
  if (!verified) return new Response("Unauthorized", { status: 401 })

  const event = JSON.parse(rawBody)
  const object = event.object || {}
  const subscriptionId = object.subscription?.id || object.id
  let userId = object.metadata?.user_id
    || event.object?.subscription?.metadata?.user_id

  const secretKey = getDefaultSecretKey()
  if (!secretKey) return new Response("Server misconfigured", { status: 500 })

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, secretKey)

  /* Alguns eventos de subscrição não repetem os metadados do checkout. */
  if (!userId && subscriptionId) {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("user_id")
      .eq("creem_subscription_id", subscriptionId)
      .maybeSingle()
    if (error) return new Response("Database lookup failed", { status: 500 })
    userId = data?.user_id
  }

  if (!userId) return new Response("ok", { status: 200 })

  const periodEnd = object.current_period_end_date
    || object.subscription?.current_period_end_date
    || null

  if (["checkout.completed", "subscription.active", "subscription.trialing", "subscription.paid"].includes(event.eventType)) {
    const status = object.subscription?.status || object.status
    if (status !== "active" && status !== "trialing") return new Response("ok", { status: 200 })

    const { error } = await supabase.from("subscriptions").upsert({
      user_id: userId,
      plan: "pro",
      status,
      creem_subscription_id: subscriptionId,
      current_period_end: periodEnd,
      trial_ends_at: status === "trialing" ? periodEnd : null,
      updated_at: new Date().toISOString()
    }, { onConflict: "user_id" })
    if (error) return new Response("Database update failed", { status: 500 })
  }

  if (event.eventType === "subscription.canceled") {
    const { error } = await supabase.from("subscriptions").upsert({
      user_id: userId,
      plan: "pro",
      status: "canceled",
      creem_subscription_id: subscriptionId,
      current_period_end: periodEnd,
      updated_at: new Date().toISOString()
    }, { onConflict: "user_id" })
    if (error) return new Response("Database update failed", { status: 500 })
  }

  return new Response("ok", { status: 200 })
})
