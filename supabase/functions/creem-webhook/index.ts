import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  const signature = req.headers.get("creem-signature")

  if (signature !== Deno.env.get("CREEM_WEBHOOK_SECRET")) {
    return new Response("Unauthorized", { status: 401 })
  }

  const event = await req.json()
  const userId = event.object?.metadata?.user_id

  if (!userId) return new Response("ok", { status: 200 })

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  )

  if (event.eventType === "subscription.active") {
    await supabase.from("subscriptions").upsert({
      user_id: userId,
      plan: "pro",
      status: "active",
      creem_subscription_id: event.object.id,
      updated_at: new Date().toISOString()
    }, { onConflict: "user_id" })
  }

  if (["subscription.canceled", "subscription.expired"].includes(event.eventType)) {
    await supabase.from("subscriptions").upsert({
      user_id: userId,
      plan: "free",
      status: "inactive",
      updated_at: new Date().toISOString()
    }, { onConflict: "user_id" })
  }

  return new Response("ok", { status: 200 })
})