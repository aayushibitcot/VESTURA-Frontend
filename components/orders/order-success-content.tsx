"use client"

import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import OrderSummary from "@/components/ui/order-summary"
import { PRIVATE_PATH } from "@/utils/constant"
import { SectionHeading } from "../ui/section-heading"

interface OrderItem {
  name: string
  price: number
  quantity: number
  image: string
  sku?: string
  selectedSize?: string
  selectedColor?: string
}

interface OrderSuccessProps {
  orderDetails: {
    orderNumber: string
    items: OrderItem[]
    total: number
  }
}

export default function OrderSuccess({ orderDetails }: OrderSuccessProps) {
  const orderNumber = orderDetails?.orderNumber || `ARD-${Math.floor(Math.random() * 1000)}`

  return (
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500 mb-6">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <SectionHeading title="Thank you for your purchase" align="center" className="mb-2" 
            description="We've received your order and it'll ship in 5-7 business days."
            />
            <p className="text-sm text-muted-foreground">Your order confirmation is #{orderNumber}</p>
          </div>

          {/* Order Summary */}
          {orderDetails && orderDetails.items && orderDetails.items.length > 0 && (
            <OrderSummary
              variant="success"
              showItems={true}
              orderItems={orderDetails.items}
              orderTotal={orderDetails.total}
              useApiData={true}
            />
          )}

          <div className="text-center">
            <Link href={PRIVATE_PATH.HOME}>
              <Button variant="outline" className="uppercase tracking-wide px-8 bg-transparent cursor-pointer">
                BACK TO HOME
              </Button>
            </Link>
          </div>
        </div>
      </main>
  )
}

