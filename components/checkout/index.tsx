"use client"

import { useEffect } from "react"
import { useCart } from "@/lib/cart-context"
import CheckoutForm from "@/components/checkout/checkout-form"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { SectionHeading } from "../ui/section-heading"
import { PUBLIC_PATH } from "@/utils/constant"

export default function Checkout() {
  const { cartItems, cartCount } = useCart()
  const router = useRouter()

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      router.push("/cart")
    }
  }, [cartItems, router])

  if (!cartItems || cartItems.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-6xl mx-auto">
            <SectionHeading title="Checkout" align="left" />

            <div className="bg-muted/30 border border-border p-4 mb-8 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Returning customer?</span>
              <Link href={PUBLIC_PATH.LOGIN} className="text-sm underline hover:no-underline">
                Click here to login
              </Link>
            </div>

            <CheckoutForm />
          </div>
        </div>
      </main>
    </div>
  )
}

