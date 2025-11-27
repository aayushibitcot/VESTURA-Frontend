import OrderDetails from "@/components/orders/order-details"
import { getOrderById } from "@/store/order/action"
import { redirect } from "next/navigation"
import { PUBLIC_PATH } from "@/utils/constant"
import { Order } from "@/types/order"

export default async function OrderDetailsPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params
  const normalizedId = decodeURIComponent(orderId).replace(/^#/, "")

  const orderResponse = await getOrderById(normalizedId)

  if (!orderResponse.success || !orderResponse.data) {
    redirect(PUBLIC_PATH.HOME)
  }

  const order = orderResponse.data

  const formattedDate = order.createdAt || order.date
    ? new Date(order.createdAt || order.date || "").toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A"

  const orderData = {
    ...order,
    date: formattedDate,
  }

  return <OrderDetails order={orderData as Order} />
}