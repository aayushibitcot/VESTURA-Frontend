import { Package } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import OrdersTable from "./orders-table"
import { SectionHeading } from "../ui/section-heading"
import { PRIVATE_PATH, capitalizeStatus } from "@/utils/constant"
import { OrderListItem } from "@/types/order"

interface MyOrdersListProps {
  orders: OrderListItem[]
}

export default function MyOrdersList({ orders }: MyOrdersListProps) {
  const transformedOrders = orders.map((order) => {
    const products = order.items
      ?.map((item) => item.product?.name || "Product")
      .join(", ") || "No products"

    const formattedDate = order.date
      ? new Date(order.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "N/A"

    return {
      id: order.orderNumber || order.id,
      date: formattedDate,
      total: order.total,
      paymentStatus: capitalizeStatus(order.paymentStatus),
      deliveryStatus: capitalizeStatus(order.deliveryStatus),
      products,
    }
  })

  const hasOrders = transformedOrders.length > 0

  return (
      <main className="flex-1 py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <SectionHeading title="My Orders" description="View and track your order history" align="left" className="mb-8" />
          {!hasOrders ? (
            // Empty state
            <div className="text-center py-16 border border-border rounded-lg">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <SectionHeading title="No orders yet" description="You haven't placed any orders yet. Start shopping now!" align="center" className="mb-8 text-center" />
              <Link href={PRIVATE_PATH.SHOP}>
                <Button className="bg-foreground text-background hover:bg-foreground/90">Shop Now</Button>
              </Link>
            </div>
          ) : (
            <OrdersTable orders={transformedOrders} />
          )}
        </div>
      </main>
  )
}

