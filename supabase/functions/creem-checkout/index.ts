import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

/* ── Headers CORS — enviados em TODAS as respostas ── */
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://www.smartsoma.pt",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

serve(async (req) => {

  /* ── Preflight OPTIONS — o browser envia isto antes do POST ── */
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  try {
    const { productId, userId } = await req.json()

    if (!productId || !userId) {
      return new Response(
        JSON.stringify({ error: "productId e userId são obrigatórios" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      )
    }

    const apiKey  = Deno.env.get("CREEM_API_KEY")
    const siteUrl = Deno.env.get("SITE_URL")

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "CREEM_API_KEY não configurada" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      )
    }

    const response = await fetch("https://api.creem.io/v1/checkouts", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        product_id: productId,
        success_url: `${siteUrl}/obrigado.html`,
        metadata: { user_id: userId }
      })
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("Creem API error:", response.status, data)
      return new Response(
        JSON.stringify({ error: "Erro na API do Creem", details: data }),
        { status: 502, headers: { "Content-Type": "application/json", ...corsHeaders } }
      )
    }

    return new Response(
      JSON.stringify({ url: data.checkout_url }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    )

  } catch (e) {
    console.error("Erro interno:", e)
    return new Response(
      JSON.stringify({ error: "Erro interno do servidor" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    )
  }
})