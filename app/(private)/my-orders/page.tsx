import MyOrdersList from "@/components/orders"
import { getOrders } from "@/store/order/action"

interface MyOrdersPageProps {
  searchParams: Promise<{ page?: string; status?: string }>
}

export default async function MyOrdersPage({ searchParams }: MyOrdersPageProps) {
  const params = await searchParams
  const page = params.page ? parseInt(params.page) : 1
  const status = params.status

  const ordersResponse = await getOrders({
    page,
    limit: 20,
    status,
  })

  const orders = ordersResponse.success && ordersResponse.data?.orders
    ? ordersResponse.data.orders
    : []

  return <MyOrdersList orders={orders} />
}