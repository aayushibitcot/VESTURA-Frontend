"use client"

import { useCart } from "@/lib/cart-provider"
import CheckoutForm from "@/components/checkout/checkout-form"
import Link from "next/link"
import { SectionHeading } from "../ui/section-heading"
import { PRIVATE_PATH, PUBLIC_PATH } from "@/utils/constant"
import { CreateOrderParams, OrderResponse } from "@/types/order"
import { Button } from "@/components/ui/button"

interface CheckoutProps {
  onCreateOrder: (params: CreateOrderParams) => Promise<OrderResponse>
}

export default function Checkout({ onCreateOrder }: CheckoutProps) {
  const { cartItems } = useCart()

  if (!cartItems || cartItems.length === 0) {
    return (
      <main className="flex-1 py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <SectionHeading
              title="Checkout"
              description="Your cart is empty"
              align="center"
              className="mb-8"
            />
            <div className="text-center">
              <Link href={PRIVATE_PATH.CART}>
                <Button className="bg-foreground text-background hover:bg-foreground/90 mx-auto">
                  View Cart
                </Button>
              </Link>
            </div>
          </div>
        </main>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex justify-between items-center"> 
        <SectionHeading title="Checkout" align="left" />

        <div className="bg-muted/30 border border-border p-4 mb-8 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Returning customer?</span>
          <Link href={PUBLIC_PATH.LOGIN} className="text-sm underline hover:no-underline">
            Click here to login
          </Link>
        </div>
          <CheckoutForm onCreateOrder={onCreateOrder} />
      </div>
    </div>
  )
}

