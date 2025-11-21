import { Package } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import OrdersTable from "./orders-table"
import { SectionHeading } from "../ui/section-heading"
import { PRIVATE_PATH } from "@/utils/constant"

// Sample orders data - in a real app, this would come from a database/API
const sampleOrders = [
  {
    id: "ORD-1024",
    date: "Nov 7, 2025",
    total: 329.98,
    paymentStatus: "Paid",
    deliveryStatus: "Delivered",
    products: "Winter Parka Coat, Leather Chelsea Boots",
  },
  {
    id: "ORD-1023",
    date: "Nov 5, 2025",
    total: 159.99,
    paymentStatus: "Paid",
    deliveryStatus: "Shipped",
    products: "White Leather Sneakers",
  },
  {
    id: "ORD-1022",
    date: "Nov 2, 2025",
    total: 89.99,
    paymentStatus: "Paid",
    deliveryStatus: "Processing",
    products: "Cotton T-Shirt Pack",
  },
  {
    id: "ORD-1021",
    date: "Oct 28, 2025",
    total: 249.97,
    paymentStatus: "Paid",
    deliveryStatus: "Delivered",
    products: "Slim Fit Denim Jeans, V-Neck Premium Tee",
  },
]

export default function MyOrdersList() {
  const hasOrders = sampleOrders.length > 0

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
            <OrdersTable orders={sampleOrders} />
          )}
        </div>
      </main>
  )
}

