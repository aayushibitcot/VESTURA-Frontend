import Cart from "@/components/cart"
import { fetchCart } from "@/store/cart/action"
import { CartData } from "@/types/cart"
import { redirect } from "next/navigation"
import { PUBLIC_PATH } from "@/utils/constant"

export default async function CartPage() {
  const res = await fetchCart()
  
  // If user is not authenticated, redirect to login instead of showing empty cart
  if (!res.success && res.error === "UNAUTHORIZED") {
    redirect(PUBLIC_PATH.LOGIN)
  }
  
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
