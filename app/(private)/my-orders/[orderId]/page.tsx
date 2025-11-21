import OrderDetails from "@/components/orders/order-details"

export default async function OrderDetailsPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params
  const normalizedId = decodeURIComponent(orderId).replace(/^#/, "")

  return <OrderDetails orderId={normalizedId} />
}