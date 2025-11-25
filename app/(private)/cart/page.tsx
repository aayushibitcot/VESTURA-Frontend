import Cart from "@/components/cart"
import { fetchCart } from "@/store/cart/action"
import { CartData } from "@/types/cart"

export default async function CartPage() {
  const res = await fetchCart()
  
  const cartData: CartData = res.success && res.data ? {
    items: res.data.items || [],
    total: res.data.total || 0,
    currency: res.data.currency
  } : {
    items: [],
    total: 0
  }

  return <Cart cartData={cartData} />
}
