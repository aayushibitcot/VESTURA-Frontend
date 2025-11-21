"use client"

import { useEffect, useState } from "react"
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
}

export default function OrderSuccess() {
  const [orderDetails, setOrderDetails] = useState<{
    orderNumber: string
    items: OrderItem[]
    total: number
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const storedOrder = sessionStorage.getItem("lastOrder")

      if (storedOrder) {
        const parsed = JSON.parse(storedOrder)
        setOrderDetails(parsed)
        // Clear after retrieving
        sessionStorage.removeItem("lastOrder")
      }
    } catch (error) {
      console.error("Error loading order:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Generate random order number if none exists
  const orderNumber = orderDetails?.orderNumber || `ARD-${Math.floor(Math.random() * 1000)}`

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
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
          {orderDetails && orderDetails.items.length > 0 && (
            <OrderSummary
              variant="success"
              showItems={true}
              orderItems={orderDetails.items}
              orderTotal={orderDetails.total}
            />
          )}

          <div className="text-center">
            <Link href={PRIVATE_PATH.HOME}>
              <Button variant="outline" className="uppercase tracking-wide px-8 bg-transparent">
                BACK TO HOME
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

