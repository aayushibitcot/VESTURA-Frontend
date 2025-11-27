"use client"

import { useState, useEffect } from "react"
import OrderDesktopTableItem from "./order-desktop-table-item"
import OrderMobileViewItem from "./order-mobile-view-item"
import { getStatusColor } from "@/utils/constant"

interface Order {
  id: string
  date: string
  total: number
  paymentStatus: string
  deliveryStatus: string
  products: string
}

interface OrdersTableProps {
  orders: Order[]
}

export default function OrdersTable({ orders }: OrdersTableProps) {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkWidth = () => {
      setIsDesktop(window.innerWidth >= 768)
    }
    checkWidth()
    window.addEventListener("resize", checkWidth)
    return () => {
      window.removeEventListener("resize", checkWidth)
    }
  }, [])

  return (
    <>
      {/* Desktop table view */}
      {isDesktop && (
        <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-medium">Order ID</th>
              <th className="text-left px-6 py-4 text-sm font-medium">Product Name</th>
              <th className="text-left px-6 py-4 text-sm font-medium">Date</th>
              <th className="text-left px-6 py-4 text-sm font-medium">Total</th>
              <th className="text-left px-6 py-4 text-sm font-medium">Payment Status</th>
              <th className="text-left px-6 py-4 text-sm font-medium">Delivery Status</th>
              <th className="text-left px-6 py-4 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <OrderDesktopTableItem
                key={order.id}
                order={order}
                index={index}
              />
            ))}
          </tbody>
        </table>
      </div>
      )}

      {/* Mobile card view */}
      {!isDesktop && (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderMobileViewItem
              key={order.id}
              order={order}
            />
          ))}
        </div>
      )}
    </>
  )
}

