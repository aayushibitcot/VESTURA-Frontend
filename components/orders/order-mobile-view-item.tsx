"use client"

import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PRIVATE_PATH, getStatusColor } from "@/utils/constant"

interface Order {
  id: string
  date: string
  total: number
  paymentStatus: string
  deliveryStatus: string
  products: string
}

interface OrderMobileViewItemProps {
  order: Order
}

export default function OrderMobileViewItem({
  order,
}: OrderMobileViewItemProps) {
  return (
    <div key={order.id} className="border border-border rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-medium text-sm text-muted-foreground">Order ID</div>
          <div className="font-semibold text-sm max-w-xs truncate">#{order.id}</div>
        </div>
        <div className="text-right">
          <div className="font-medium text-sm text-muted-foreground">Date</div>
          <div className="text-sm max-w-xs truncate">{order.date}</div>
        </div>
      </div>

      <div>
        <div className="font-medium text-sm text-muted-foreground mb-1">Products</div>
        <div className="text-sm max-w-xs truncate">{order.products}</div>
      </div>

      <div className="border-t border-border pt-3 space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Total:</span>
          <span className="font-semibold">${order.total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Payment:</span>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
              order.paymentStatus,
            )}`}
          >
            {order.paymentStatus}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Delivery:</span>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
              order.deliveryStatus,
            )}`}
          >
            {order.deliveryStatus}
          </span>
        </div>
      </div>

      <Link href={`${PRIVATE_PATH.ORDER_DETAILS.replace("[orderId]", order.id)}`}>
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 bg-transparent"
        >
          View Details
          <ChevronRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  )
}

