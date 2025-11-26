"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { SectionHeading } from "../ui/section-heading"
import CartItems from "./cart-items"
import OrderSummary from "@/components/ui/order-summary"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { PRIVATE_PATH, VALIDATION_ERROR_MESSAGE, PUBLIC_PATH } from "@/utils/constant"
import { useRouter } from "next/navigation"
import { CartData, CartItemFromAPI } from "@/types/cart"
import { useState, useEffect } from "react"
import { useCart } from "@/lib/cart-provider"

interface CartProps {
  cartData?: CartData
}

export default function Cart({ cartData }: CartProps) {
  const { toast } = useToast()
  const router = useRouter()
  const { clearCart } = useCart()
  const [cartItems, setCartItems] = useState<CartItemFromAPI[]>(cartData?.items || [])
  const [cartTotal, setCartTotal] = useState<number>(cartData?.total || 0)

  const handleClearCart = async () => {
    try {
      await clearCart()
      setCartItems([])
      setCartTotal(0)

      toast({
        title: VALIDATION_ERROR_MESSAGE.CART_CLEARED_SUCCESSFULLY,
        description: VALIDATION_ERROR_MESSAGE.CART_CLEARED_SUCCESSFULLY,
      })
    } catch (error: any) {
      if (error?.message?.toLowerCase().includes('unauthorized') || error?.error === 'UNAUTHORIZED') {
        toast({
          title: VALIDATION_ERROR_MESSAGE.AUTHENTICATION_REQUIRED,
          description: VALIDATION_ERROR_MESSAGE.UNAUTHORIZED_ACCESS,
          variant: "destructive",
        })
        router.push(PUBLIC_PATH.LOGIN)
        return
      }
      
      toast({
        title: VALIDATION_ERROR_MESSAGE.FAILED_TO_CLEAR_CART,
        description: error?.message || VALIDATION_ERROR_MESSAGE.FAILED_TO_CLEAR_CART,
        variant: "destructive",
      })
    }
  }

  // Update cart items and total when cartData changes
  useEffect(() => {
    if (cartData) {
      setCartItems(cartData.items || [])
      setCartTotal(cartData.total || 0)
    }
  }, [cartData])

  if (!cartItems || cartItems.length === 0) {
    return (
      <main className="flex-1 py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SectionHeading
          title="Shopping Cart"
          description="Your cart is empty"
          align="center"
          className="mb-8"
        />
        <div className="text-center">
          <Link href={PRIVATE_PATH.SHOP}>
            <Button className="bg-foreground text-background hover:bg-foreground/90 mx-auto">Continue Shopping</Button>
          </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex justify-between items-center"> 
        <SectionHeading align="left" className="font-serif text-4xl mb-0" title="Shopping Cart" />
        <div className="flex justify-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                Clear Cart
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear Shopping Cart?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to remove all items from your cart?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClearCart}
                >
                  Clear Cart
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-8">
        <CartItems 
          cartItems={cartItems} 
          onItemsChange={(items, total) => {
            setCartItems(items)
            // Use total from API if provided, otherwise calculate from items
            setCartTotal(total !== undefined ? total : items.reduce((sum, item) => sum + (item.subtotal || 0), 0))
          }}
        />
        <OrderSummary 
          orderItems={cartItems} 
          orderTotal={cartTotal} 
          useApiData={true}
          variant="cart"
        />
      </div>
    </div>
  )
}
