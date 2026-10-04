import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://www.smartsoma.pt",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  })
}

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

const products: Record<string, string> = {
  semanal: "prod_2ZbohJlonCxMO4f45xufqZ",
  mensal: "prod_6ybt2q5Rwe76WBL7GqpAEC",
}

serve(async (req) => {

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  try {
    if (req.method !== "POST") return json({ error: "Método não permitido" }, 405)

    const authorization = req.headers.get("Authorization") || ""
    const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : ""
    const secretKey = getDefaultSecretKey()
    const supabaseUrl = Deno.env.get("SUPABASE_URL")

    if (!token) return json({ error: "Sessão inválida" }, 401)
    if (!secretKey || !supabaseUrl) return json({ error: "Servidor mal configurado" }, 500)

    const supabase = createClient(supabaseUrl, secretKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
    const { data: authData, error: authError } = await supabase.auth.getUser(token)
    const user = authData.user
    if (authError || !user) return json({ error: "Sessão inválida" }, 401)

    const body = await req.json().catch(() => null)
    const plan = body && typeof body.plan === "string" ? body.plan : ""
    const productId = products[plan]
    if (!productId) return json({ error: "Plano inválido" }, 400)

    const { data: subscription, error: subscriptionError } = await supabase
      .from("subscriptions")
      .select("status,current_period_end")
      .eq("user_id", user.id)
      .maybeSingle()
    if (subscriptionError) return json({ error: "Não foi possível validar a subscrição" }, 500)

    const hasAccess = subscription && (
      subscription.status === "active" ||
      subscription.status === "trialing" ||
      (subscription.status === "canceled" && subscription.current_period_end &&
        new Date(subscription.current_period_end).getTime() > Date.now())
    )
    if (hasAccess) return json({ error: "Já existe uma subscrição válida" }, 409)

    const apiKey  = Deno.env.get("CREEM_API_KEY")
    const siteUrl = Deno.env.get("SITE_URL")

    if (!apiKey || !siteUrl) return json({ error: "Servidor mal configurado" }, 500)

    /* Corpo do pedido ao Creem — adiciona customer se tivermos email */
    const checkoutBody: Record<string, unknown> = {
      product_id  : productId,
      success_url : `${siteUrl}/obrigado.html`,
      metadata    : { user_id: user.id }
    }

    if (user.email) {
      const metadata = user.user_metadata || {}
      const userName = typeof metadata.full_name === "string"
        ? metadata.full_name
        : typeof metadata.name === "string" ? metadata.name : ""
      checkoutBody.customer = {
        email: user.email,
        ...(userName ? { name: userName } : {})
      }
    }

    const response = await fetch("https://api.creem.io/v1/checkouts", {
      method : "POST",
      headers: {
        "x-api-key"    : apiKey,
        "Content-Type" : "application/json"
      },
      body: JSON.stringify(checkoutBody)
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("Creem API error:", response.status)
      return json({ error: "Erro na API do Creem" }, 502)
    }

    if (!data || typeof data.checkout_url !== "string") return json({ error: "Resposta inválida do pagamento" }, 502)
    return json({ url: data.checkout_url })

  } catch (e) {
    console.error("Erro interno:", e)
    return json({ error: "Erro interno do servidor" }, 500)
  }
})
