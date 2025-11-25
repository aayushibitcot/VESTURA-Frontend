"use client"

import Link from "next/link"
import { Trash2, Plus, Minus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { PRIVATE_PATH, VALIDATION_ERROR_MESSAGE, PUBLIC_PATH } from "@/utils/constant"
import { fetchCart, removeCartItem, updateCartItemQuantity } from "@/store/cart/action"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CartItemFromAPI } from "@/types/cart"

interface CartItemsProps {
  cartItems?: CartItemFromAPI[]
  onItemsChange?: (items: CartItemFromAPI[], total?: number) => void
}

export default function CartItems({ cartItems: cartItemsProp, onItemsChange }: CartItemsProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [cartItemsData, setCartItemsData] = useState<CartItemFromAPI[]>(cartItemsProp || [])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCartData = async () => {
      setIsLoading(true)
      const res = await fetchCart()
      if (res.success && res.data) {
        const fetchedItems = res.data.items || []
        setCartItemsData(fetchedItems)
        // Notify parent of fetched items with total from API
        if (onItemsChange) {
          onItemsChange(fetchedItems, res.data.total)
        }
      } else {
        if (res.error === 'UNAUTHORIZED' || res.message?.toLowerCase().includes('unauthorized')) {
          toast({
            title: VALIDATION_ERROR_MESSAGE.AUTHENTICATION_REQUIRED,
            description: VALIDATION_ERROR_MESSAGE.UNAUTHORIZED_ACCESS,
            variant: "destructive",
          })
          router.push(PUBLIC_PATH.LOGIN)
          setIsLoading(false)
          return
        }
        toast({
          title: VALIDATION_ERROR_MESSAGE.FAILED_TO_FETCH_CART,
          description: res.message || VALIDATION_ERROR_MESSAGE.FAILED_TO_FETCH_CART,
          variant: "destructive",
        })
      }
      setIsLoading(false)
    }
    
    // If cartItems prop is provided and has items, use it; otherwise fetch
    if (cartItemsProp && cartItemsProp.length > 0) {
      setCartItemsData(cartItemsProp)
      setIsLoading(false)
    } else {
      fetchCartData()
    }
  }, [cartItemsProp, toast, router])

  // Notify parent when items change (calculate total from subtotals)
  useEffect(() => {
    if (onItemsChange && cartItemsData.length > 0) {
      const calculatedTotal = cartItemsData.reduce((sum, item) => sum + (item.subtotal || 0), 0)
      onItemsChange(cartItemsData, calculatedTotal)
    }
  }, [cartItemsData, onItemsChange])

  const handleRemoveItem = async (itemId: string) => {
    const res = await removeCartItem(itemId)
    
    if (!res.success) {
      if (res.error === 'UNAUTHORIZED' || res.message?.toLowerCase().includes('unauthorized')) {
        toast({
          title: VALIDATION_ERROR_MESSAGE.AUTHENTICATION_REQUIRED,
          description: VALIDATION_ERROR_MESSAGE.UNAUTHORIZED_ACCESS,
          variant: "destructive",
        })
        router.push(PUBLIC_PATH.LOGIN)
        return
      }
      
      toast({
        title: VALIDATION_ERROR_MESSAGE.FAILED_TO_REMOVE_CART_ITEM,
        description: res.message || VALIDATION_ERROR_MESSAGE.FAILED_TO_REMOVE_CART_ITEM,
        variant: "destructive",
      })
      return
    }

    // Fetch updated cart to get latest data including total
    const cartRes = await fetchCart()
    if (cartRes.success && cartRes.data) {
      const updatedItems = cartRes.data.items || []
      setCartItemsData(updatedItems)
      // Notify parent of updated items with total from API
      if (onItemsChange) {
        onItemsChange(updatedItems, cartRes.data.total)
      }
    } else {
      // Fallback: Remove item from local state if fetch fails
      setCartItemsData(prev => prev.filter(cartItem => cartItem.id !== itemId))
      if (onItemsChange) {
        onItemsChange(cartItemsData.filter(cartItem => cartItem.id !== itemId))
      }
    }
    
    toast({
      title: VALIDATION_ERROR_MESSAGE.ITEM_REMOVED_FROM_CART_SUCCESSFULLY,
      description: res.message || "Item has been removed from your cart.",
    })
  }

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      return
    }

    const res = await updateCartItemQuantity(itemId, newQuantity)
    
    if (!res.success) {
      if (res.error === 'UNAUTHORIZED' || res.message?.toLowerCase().includes('unauthorized')) {
        toast({
          title: VALIDATION_ERROR_MESSAGE.AUTHENTICATION_REQUIRED,
          description: VALIDATION_ERROR_MESSAGE.UNAUTHORIZED_ACCESS,
          variant: "destructive",
        })
        router.push(PUBLIC_PATH.LOGIN)
        return
      }
      
      toast({
        title: VALIDATION_ERROR_MESSAGE.FAILED_TO_UPDATE_CART_ITEM_QUANTITY,
        description: res.message || VALIDATION_ERROR_MESSAGE.FAILED_TO_UPDATE_CART_ITEM_QUANTITY,
        variant: "destructive",
      })
      return
    }

    // Fetch updated cart to get latest data including subtotal and total
    const cartRes = await fetchCart()
    if (cartRes.success && cartRes.data) {
      const updatedItems = cartRes.data.items || []
      setCartItemsData(updatedItems)
      // Notify parent of updated items with total from API so Order Summary can recalculate
      if (onItemsChange) {
        onItemsChange(updatedItems, cartRes.data.total)
      }
    } else {
      // Fallback: Update local state if fetch fails
      setCartItemsData(prev => 
        prev.map(cartItem => 
          cartItem.id === itemId 
            ? { 
                ...cartItem, 
                quantity: newQuantity,
                subtotal: cartItem.product.price * newQuantity
              }
            : cartItem
        )
      )
      if (onItemsChange) {
        const updatedLocalItems = cartItemsData.map(cartItem => 
          cartItem.id === itemId 
            ? { 
                ...cartItem, 
                quantity: newQuantity,
                subtotal: cartItem.product.price * newQuantity
              }
            : cartItem
        )
        onItemsChange(updatedLocalItems)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">Loading cart items...</p>
      </div>
    )
  }

  if (!cartItemsData || cartItemsData.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {cartItemsData.map((item) => {
        const product = item.product
        const itemPrice = typeof product.price === "number" && !isNaN(product.price) ? product.price : 0

        return (
          <div key={item.id} className="flex gap-4 border border-border p-4">
            <div className="relative w-24 h-24 flex-shrink-0 bg-secondary">
              <img
                src={product.image || "/placeholder.svg?height=96&width=96"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <Link
                href={`${PRIVATE_PATH.PRODUCT}/${product.sku}`}
                className="font-medium hover:text-muted-foreground transition-colors"
              >
                {product.name}
              </Link>
              {product.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
              )}
              {(item.selectedSize || item.selectedColor) && (
                <div className="text-xs text-muted-foreground mt-1">
                  {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                  {item.selectedSize && item.selectedColor && <span className="mx-1">•</span>}
                  {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                </div>
              )}
              <p className="text-sm font-medium mt-2">${itemPrice.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-1">Subtotal: ${item.subtotal.toFixed(2)}</p>
            </div>

            <div className="flex flex-col items-end justify-between">
              <button
                onClick={() => handleRemoveItem(item.id)}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                aria-label="Remove item"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              <div className="flex items-center border border-border">
                <button
                  onClick={() => {
                    const newQuantity = Math.max(1, item.quantity - 1)
                    handleUpdateQuantity(item.id, newQuantity)
                  }}
                  className="px-3 py-1 hover:bg-accent transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Decrease quantity"
                  disabled={item.quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="px-4 py-1 border-x border-border min-w-[50px] text-center text-sm">
                  {item.quantity}
                </span>
                <button
                  onClick={() => {
                    const newQuantity = item.quantity + 1
                    handleUpdateQuantity(item.id, newQuantity)
                  }}
                  className="px-3 py-1 hover:bg-accent transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
} 