"use client"

import { useState, useEffect } from "react"
import OrderDesktopTableItem from "./order-desktop-table-item"
import OrderMobileViewItem from "./order-mobile-view-item"

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

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    Paid: "text-green-600 bg-green-50",
    Pending: "text-yellow-600 bg-yellow-50",
    Canceled: "text-red-600 bg-red-50",
    Delivered: "text-green-600 bg-green-50",
    Shipped: "text-blue-600 bg-blue-50",
    Processing: "text-orange-600 bg-orange-50",
  }
  return colors[status] || "text-gray-600 bg-gray-50"
}

export default function OrdersTable({ orders }: OrdersTableProps) {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    // Set initial width
    const checkWidth = () => {
      setIsDesktop(window.innerWidth >= 768)
    }

    // Check on mount
    checkWidth()

    // Add event listener for window resize
    window.addEventListener("resize", checkWidth)

    // Cleanup event listener on unmount
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
                getStatusColor={getStatusColor}
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
              getStatusColor={getStatusColor}
            />
          ))}
        </div>
      )}
    </>
  )
}

