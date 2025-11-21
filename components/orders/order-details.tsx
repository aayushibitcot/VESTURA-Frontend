import { ChevronLeft, Package, Truck, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SectionHeading } from "../ui/section-heading"
import OrderDetailsItem from "./order-details-item"
import { PRIVATE_PATH } from "@/utils/constant"

// Sample order details - in a real app, this would come from a database/API
const orderDetails: Record<string, any> = {
  "ORD-1024": {
    id: "ORD-1024",
    date: "Nov 7, 2025",
    total: 329.98,
    subtotal: 329.98,
    shipping: 0,
    tax: 0,
    paymentStatus: "Paid",
    deliveryStatus: "Delivered",
    shippingAddress: {
      name: "John Doe",
      address: "123 Fashion Street",
      city: "New York",
      state: "NY",
      zip: "10001",
      phone: "+1 (555) 123-4567",
    },
    items: [
      {
        id: 1,
        name: "Premium Wool Overcoat",
        image: "/premium-wool-overcoat.jpg",
        size: "L",
        color: "Charcoal",
        quantity: 1,
        price: 249.99,
      },
      {
        id: 2,
        name: "Graphic Print Tee",
        image: "/graphic-print-t-shirt-fashion-casual.jpg",
        size: "M",
        color: "White",
        quantity: 2,
        price: 39.99,
      },
    ],
  },
  "ORD-1023": {
    id: "ORD-1023",
    date: "Nov 5, 2025",
    total: 159.99,
    subtotal: 159.99,
    shipping: 0,
    tax: 0,
    paymentStatus: "Paid",
    deliveryStatus: "Shipped",
    shippingAddress: {
      name: "John Doe",
      address: "123 Fashion Street",
      city: "New York",
      state: "NY",
      zip: "10001",
      phone: "+1 (555) 123-4567",
    },
    items: [
      {
        id: 1,
        name: "Leather Chelsea Boots",
        image: "/leather-chelsea-boots.jpg",
        size: "10",
        color: "Brown",
        quantity: 1,
        price: 159.99,
      },
    ],
  },
  "ORD-1022": {
    id: "ORD-1022",
    date: "Nov 2, 2025",
    total: 89.99,
    subtotal: 89.99,
    shipping: 0,
    tax: 0,
    paymentStatus: "Paid",
    deliveryStatus: "Processing",
    shippingAddress: {
      name: "John Doe",
      address: "123 Fashion Street",
      city: "New York",
      state: "NY",
      zip: "10001",
      phone: "+1 (555) 123-4567",
    },
    items: [
      {
        id: 1,
        name: "White Leather Sneakers",
        image: "/white-leather-sneakers.png",
        size: "9",
        color: "White",
        quantity: 1,
        price: 89.99,
      },
    ],
  },
  "ORD-1021": {
    id: "ORD-1021",
    date: "Oct 28, 2025",
    total: 249.97,
    subtotal: 249.97,
    shipping: 0,
    tax: 0,
    paymentStatus: "Paid",
    deliveryStatus: "Delivered",
    shippingAddress: {
      name: "John Doe",
      address: "123 Fashion Street",
      city: "New York",
      state: "NY",
      zip: "10001",
      phone: "+1 (555) 123-4567",
    },
    items: [
      {
        id: 1,
        name: "Slim Fit Denim Jeans",
        image: "/slim-fit-denim-jeans.jpg",
        size: "32",
        color: "Dark Blue",
        quantity: 1,
        price: 119.99,
      },
      {
        id: 2,
        name: "V-Neck Premium Tee",
        image: "/v-neck-t-shirt-premium-cotton-fashion.jpg",
        size: "L",
        color: "Black",
        quantity: 3,
        price: 43.33,
      },
    ],
  },
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
  orderId: string
}

export default function OrderDetails({ orderId }: OrderDetailsProps) {
  const normalizedId = decodeURIComponent(orderId).replace(/^#/, "")
  const order = orderDetails[normalizedId]

  if (!order) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <SectionHeading title="Order Not Found" description="The order you're looking for doesn't exist." align="center" className="mb-8 text-center" />
      </div>
     
    )
  }

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
                  order.paymentStatus,
                )}`}
              >
                {order.paymentStatus}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Delivery:</span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  order.deliveryStatus,
                )}`}
              >
                {getStatusIcon(order.deliveryStatus)}
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
                {order.items.map((item: any) => (
                  <OrderDetailsItem key={item.id} item={item} />
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
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{order.shipping === 0 ? "Free" : `$${order.shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Shipping address */}
            <div className="border border-border rounded-lg">
              <div className="border-b border-border px-6 py-4">
                <h2 className="text-xl font-medium">Shipping Address</h2>
              </div>
              <div className="p-6 text-sm space-y-1">
                <p className="font-medium">{order.shippingAddress.name}</p>
                <p className="text-muted-foreground">{order.shippingAddress.address}</p>
                <p className="text-muted-foreground">
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                </p>
                <p className="text-muted-foreground pt-2">{order.shippingAddress.phone}</p>
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

