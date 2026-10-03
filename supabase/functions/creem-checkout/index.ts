import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { productId, userId } = await req.json()

  const response = await fetch("https://api.creem.io/v1/checkouts", {
    method: "POST",
    headers: {
      "x-api-key": Deno.env.get("CREEM_API_KEY")!,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      product_id: productId,
      success_url: `${Deno.env.get("SITE_URL")}/obrigado.html`,
      metadata: { user_id: userId }
    })
  })

  const data = await response.json()

  return new Response(
    JSON.stringify({ url: data.checkout_url }),
    {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    }
  )
})