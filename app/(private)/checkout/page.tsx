import Checkout from "@/components/checkout"
import { createOrder } from "@/store/order/action"

export default function CheckoutPage() {
  return <Checkout onCreateOrder={createOrder} />
}
