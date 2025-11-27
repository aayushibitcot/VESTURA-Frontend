"use client"

import { ChevronLeft, Package, Truck, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SectionHeading } from "../ui/section-heading"
import OrderDetailsItem from "./order-details-item"
import { PRIVATE_PATH, getStatusColor } from "@/utils/constant"
import { Order as OrderType } from "@/types/order"

function getStatusIcon(status: string) {
  switch (status) {
    case "Delivered":
      return <CheckCircle2 className="h-5 w-5" />
    case "Shipped":
      return <Truck className="h-5 w-5" />
    case "Processing":
      return <Package className="h-5 w-5" />
    default:
      return <Package className="h-5 w-5" />
  }
}

interface OrderDetailsProps {
  order: OrderType
}

export default function OrderDetails({ order }: OrderDetailsProps) {

  return (
    <main className="flex-1 py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Back button */}
        <Link href={PRIVATE_PATH.MY_ORDERS} className="inline-flex items-center gap-2 text-sm hover:underline mb-6">
          <ChevronLeft className="h-4 w-4" />
          Back to Orders
        </Link>

        {/* Order header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <SectionHeading title={`Order #${order.id}`} description={`Placed on ${order.date}`} align="left" className="mb-2" />
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Payment:</span>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  order.paymentStatus || "",
                )}`}
              >
                {order.paymentStatus}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Delivery:</span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  order.deliveryStatus || "",
                )}`}
              >
                {getStatusIcon(order.deliveryStatus || "")}
                {order.deliveryStatus}
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="border border-border rounded-lg">
              <div className="border-b border-border px-6 py-4">
                <h2 className="text-xl font-medium">Order Items</h2>
              </div>
              <div className="p-6 space-y-4">
                {order.items?.map((item: any) => (
                  <OrderDetailsItem key={item.productSku || item.sku || "unknown-sku"} item={item} />
                ))}
              </div>  
            </div>  
          </div>

          {/* Order summary & shipping */}
          <div className="space-y-6">
            {/* Order summary */}
            <div className="border border-border rounded-lg">
              <div className="border-b border-border px-6 py-4">
                <h2 className="text-xl font-medium">Order Summary</h2>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${order.subtotal?.toFixed(2)}</span> 
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{order.shipping === 0 ? "Free" : `$${order.shipping?.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${order.tax?.toFixed(2)}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>${order.total?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Shipping address */}
            <div className="border border-border rounded-lg">
              <div className="border-b border-border px-6 py-4">
                <h2 className="text-xl font-medium">Shipping Address</h2>
              </div>
              <div className="p-6 text-sm space-y-1">
                <p className="font-medium">{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</p>
                <p className="text-muted-foreground">{order.shippingAddress?.address}</p>
                <p className="text-muted-foreground">
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}
                </p>
                <p className="text-muted-foreground pt-2">{order.shippingAddress?.phone}</p>
              </div>
            </div>

            {/* Action button */}
            <Link href={PRIVATE_PATH.SHOP}>
              <Button className="w-full bg-foreground text-background hover:bg-foreground/90">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

