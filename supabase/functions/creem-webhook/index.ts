import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

type Json = Record<string, unknown>

function getDefaultSecretKey(): string | null {
  const rawKeys = Deno.env.get("SUPABASE_SECRET_KEYS")
  if (!rawKeys) return null
  try {
    const keys = JSON.parse(rawKeys)
    return typeof keys.default === "string" ? keys.default : null
  } catch { return null }
}

function object(value: unknown): Json { return value && typeof value === "object" && !Array.isArray(value) ? value as Json : {} }
function string(value: unknown): string | null { return typeof value === "string" && value.length > 0 ? value : null }
function isoDate(value: unknown): string | null {
  if (typeof value === "number" && Number.isFinite(value)) return new Date(value).toISOString()
  if (typeof value !== "string" || !Number.isFinite(new Date(value).getTime())) return null
  return new Date(value).toISOString()
}
function eventDate(value: unknown): string | null {
  return typeof value === "number" && Number.isFinite(value) ? isoDate(value) : null
}

async function verifySignature(rawBody: string, signature: string, secret: string) {
  if (!/^[a-f0-9]{64}$/i.test(signature)) return false
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"])
  const bytes = new Uint8Array((signature.match(/.{1,2}/g) || []).map(byte => Number.parseInt(byte, 16)))
  return crypto.subtle.verify("HMAC", key, bytes, new TextEncoder().encode(rawBody))
}

serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 })
  const rawBody = await req.text()
  const secret = Deno.env.get("CREEM_WEBHOOK_SECRET")
  const signature = req.headers.get("creem-signature") || ""
  if (!secret || !(await verifySignature(rawBody, signature, secret))) return new Response("Unauthorized", { status: 401 })

  let event: Json
  try { event = object(JSON.parse(rawBody)) } catch { return new Response("Invalid payload", { status: 400 }) }
  const eventId = string(event.id)
  const eventType = string(event.eventType)
  const occurredAt = eventDate(event.created_at)
  if (!eventId || !eventType || !occurredAt) return new Response("Invalid event", { status: 400 })

  const payload = object(event.object)
  const subscription = object(payload.subscription)
  const metadata = object(payload.metadata)
  const subscriptionMetadata = object(subscription.metadata)
  const customer = object(payload.customer)
  const nestedCustomer = object(subscription.customer)
  const subscriptionId = string(subscription.id) || string(payload.id)
  const customerId = string(customer.id) || string(nestedCustomer.id)
  const plan = string(object(payload.product).id) || string(object(subscription.product).id) || "pro"
  const periodEnd = isoDate(payload.current_period_end_date) || isoDate(subscription.current_period_end_date)
  const userId = string(metadata.user_id) || string(subscriptionMetadata.user_id)

  const secretKey = getDefaultSecretKey()
  const url = Deno.env.get("SUPABASE_URL")
  if (!secretKey || !url) return new Response("Server misconfigured", { status: 500 })
  const supabase = createClient(url, secretKey)

  let resolvedUserId = userId
  if (!resolvedUserId && subscriptionId) {
    const { data, error } = await supabase.from("subscriptions").select("user_id").eq("creem_subscription_id", subscriptionId).maybeSingle()
    if (error) return new Response("Database lookup failed", { status: 500 })
    resolvedUserId = data?.user_id || null
  }
  if (!resolvedUserId) return new Response("Unknown subscription", { status: 202 })

  let status: string | null = null
  let trialEndsAt: string | null = null
  let accessEnd = periodEnd
  const providerStatus = string(subscription.status) || string(payload.status)
  if (eventType === "checkout.completed" || eventType === "subscription.trialing") {
    status = "trialing"; trialEndsAt = periodEnd
  } else if (["subscription.paid", "subscription.active", "subscription.update"].includes(eventType) && providerStatus === "active") {
    status = "active"
  } else if (eventType === "subscription.update" && providerStatus === "unpaid") {
    status = "unpaid"
  } else if (eventType === "subscription.canceled") {
    status = "canceled"
  } else if (eventType === "subscription.paused") {
    status = "paused"
  } else if (["refund.created", "dispute.created"].includes(eventType)) {
    status = "refunded"; accessEnd = new Date(0).toISOString()
  } else if (eventType === "subscription.expired") {
    // Creem may retry. The expiry timestamp blocks access until a later paid event restores it.
    return new Response("ok", { status: 200 })
  } else {
    return new Response("ok", { status: 200 })
  }

  const { error } = await supabase.rpc("apply_creem_subscription_event", {
    p_event_id: eventId, p_event_type: eventType, p_event_at: occurredAt,
    p_user_id: resolvedUserId, p_plan: plan, p_status: status,
    p_customer_id: customerId, p_subscription_id: subscriptionId,
    p_trial_ends_at: trialEndsAt, p_current_period_end: accessEnd,
  })
  if (error) return new Response("Database update failed", { status: 500 })
  return new Response("ok", { status: 200 })
})
