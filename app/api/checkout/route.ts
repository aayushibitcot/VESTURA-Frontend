import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { config } from "@/utils/config"

const stripe = new Stripe(config.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2025-10-29.clover",
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { items } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 })
    }

    const origin =
      req.headers.get("origin") ||
      req.headers.get("referer")?.split("/").slice(0, 3).join("/") ||
      "http://localhost:3000"

    console.log("[v0] Checkout origin:", origin)

    const lineItems = items.map((item: any) => {
      const price = Number.parseFloat(item.price)
      if (isNaN(price) || price <= 0) {
        throw new Error(`Invalid price for item: ${item.name}`)
      }

      const images: string[] = []
      if (item.image && (item.image.startsWith("http://") || item.image.startsWith("https://"))) {
        images.push(item.image)
      }

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            description: item.description || "",
            // Only include images array if we have valid URLs
            ...(images.length > 0 && { images }),
          },
          unit_amount: Math.round(price * 100), // Convert to cents
        },
        quantity: item.quantity,
      }
    })

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error("Stripe error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
