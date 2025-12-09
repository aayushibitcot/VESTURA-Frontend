'use client'

import Link from "next/link"
import { Trash2, Plus, Minus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { PRIVATE_PATH, VALIDATION_ERROR_MESSAGE, PUBLIC_PATH } from "@/utils/constant"
import { useRouter } from "next/navigation"
import { CartItemFromAPI } from "@/types/cart"
import { useCart } from "@/lib/cart-provider"
import { useEffect, useState } from "react"

interface CartItemsProps {
  cartItems?: CartItemFromAPI[]
}

export default function CartItems({ cartItems }: CartItemsProps) {
  const { toast } = useToast()
  const router = useRouter()
  const { removeItemById, updateQuantityById } = useCart()
  const [localItems, setLocalItems] = useState<CartItemFromAPI[]>(cartItems ?? [])
  const [pendingItemIds, setPendingItemIds] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setLocalItems(cartItems ?? [])
  }, [cartItems])

  const handleRemoveItem = async (itemId: string) => {
    const previousItems = localItems
    setLocalItems((items) => items.filter((item) => item.id !== itemId))

    try {
      setPendingItemIds((prev) => ({ ...prev, [itemId]: true }))
      await removeItemById(itemId, previousItems.find(item => item.id === itemId)?.product.sku)
      
      toast({
        title: VALIDATION_ERROR_MESSAGE.ITEM_REMOVED_FROM_CART_SUCCESSFULLY,
        variant: "success",
      })
      
      router.refresh()
    } catch (error: any) {
      setLocalItems(previousItems)
      if (error?.message?.toLowerCase().includes('unauthorized') || error?.error === 'UNAUTHORIZED') {
        toast({
          title: VALIDATION_ERROR_MESSAGE.AUTHENTICATION_REQUIRED,
          variant: "destructive",
        })
        router.push(PUBLIC_PATH.LOGIN)
        setPendingItemIds((prev) => {
          const updated = { ...prev }
          delete updated[itemId]
          return updated
        })
        return
      }
      
      toast({
        title: VALIDATION_ERROR_MESSAGE.FAILED_TO_REMOVE_CART_ITEM,
        description: error?.message || VALIDATION_ERROR_MESSAGE.FAILED_TO_REMOVE_CART_ITEM,
        variant: "destructive",
      })
    } finally {
      setPendingItemIds((prev) => {
        const updated = { ...prev }
        delete updated[itemId]
        return updated
      })
    }
  }

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      return
    }

    const previousItems = localItems
    setLocalItems((items) =>
      items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: newQuantity,
              subtotal: (item.product.price || 0) * newQuantity,
            }
          : item
      )
    )

    try {
      setPendingItemIds((prev) => ({ ...prev, [itemId]: true }))
      await updateQuantityById(itemId, newQuantity, previousItems.find(item => item.id === itemId)?.product.sku)
      
      router.refresh()
    } catch (error: any) {
      setLocalItems(previousItems)
      if (error?.message?.toLowerCase().includes('unauthorized') || error?.error === 'UNAUTHORIZED') {
        toast({
          title: error?.message || VALIDATION_ERROR_MESSAGE.AUTHENTICATION_REQUIRED,
          variant: "destructive",
        })
        router.push(PUBLIC_PATH.LOGIN)
        setPendingItemIds((prev) => {
          const updated = { ...prev }
          delete updated[itemId]
          return updated
        })
        return
      }
      
      toast({
        title: error?.message || VALIDATION_ERROR_MESSAGE.FAILED_TO_UPDATE_CART_ITEM_QUANTITY,
        variant: "destructive",
      })
    } finally {
      setPendingItemIds((prev) => {
        const updated = { ...prev }
        delete updated[itemId]
        return updated
      })
    }
  }

  if (!localItems || localItems.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {localItems.map((item) => {
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
                  className="px-3 py-1 hover:bg-accent transition-colors cursor-pointer disabled:opacity-50"
                  aria-label="Decrease quantity"
                  disabled={item.quantity <= 1 || pendingItemIds[item.id]}
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
                  className="px-3 py-1 hover:bg-accent transition-colors cursor-pointer disabled:opacity-50"
                  aria-label="Increase quantity"
                  disabled={pendingItemIds[item.id]}
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