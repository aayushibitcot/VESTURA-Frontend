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

interface OrderDesktopTableItemProps {
  order: Order
  index: number
}

export default function OrderDesktopTableItem({ order }: OrderDesktopTableItemProps) {
  return (
    <tr
      key={order.id}
    >
      <td className="px-6 py-4 text-sm max-w-xs truncate">#{order.id}</td>
      <td className="px-6 py-4 text-sm max-w-xs truncate" title={order.products}>
        {order.products}
        </td>
      <td className="px-6 py-4 text-sm max-w-xs truncate">{order.date}</td>
      <td className="px-6 py-4 text-sm max-w-xs truncate">${order.total.toFixed(2)}</td>
      <td className="px-6 py-4 text-sm max-w-xs truncate">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
            order.paymentStatus,
          )}`}
        >
          {order.paymentStatus}
        </span>
      </td>
      <td className="px-6 py-4 text-sm max-w-xs truncate">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
            order.deliveryStatus,
          )}`}
        >
          {order.deliveryStatus}
        </span>
      </td>
      <td className="px-6 py-4 text-sm max-w-xs truncate">
        <Link href={`${PRIVATE_PATH.ORDER_DETAILS.replace("[orderId]", order.id)}`}>
          <Button
            variant="ghost"
            size="sm"
            className="text-sm hover:underline flex items-center gap-1"
          >
            View Details
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </td>
    </tr>
  )
}

