import OrderSuccess from "@/components/orders/order-success-content"
import { getOrderById } from "@/store/order/action"
import { redirect } from "next/navigation"
import { PUBLIC_PATH } from "@/utils/constant"

interface OrderSuccessPageProps {
  searchParams: Promise<{ orderId?: string }>
}

export default async function OrderSuccessPage({ searchParams }: OrderSuccessPageProps) {
  const params = await searchParams
  const orderId = params.orderId

  if (!orderId) {
    redirect(PUBLIC_PATH.HOME)
  }

  const orderResponse = await getOrderById(orderId)

  if (!orderResponse.success || !orderResponse.data) {
    redirect(PUBLIC_PATH.HOME)
  }

  const order = orderResponse.data

  const orderItems = order.items?.map((item: any) => {
    if (item.product) {
      return {
        name: item.product.name || "Product",
        price: item.price || item.product.price || 0,
        quantity: item.quantity || 1,
        image: item.product.image || "/placeholder.svg",
        sku: item.product.sku,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
      }
    }
    return {
      name: item.name || "Product",
      price: item.price || 0,
      quantity: item.quantity || 1,
      image: item.image || "/placeholder.svg",
      sku: item.sku || item.productSku,
      selectedSize: item.selectedSize,
      selectedColor: item.selectedColor,
    }
  }) || []

  const orderDetails = {
    orderNumber: order.orderNumber || order.id || `ARD-${Math.floor(Math.random() * 1000)}`,
    items: orderItems,
    total: order.total || 0,
  }

  return <OrderSuccess orderDetails={orderDetails} />
}
