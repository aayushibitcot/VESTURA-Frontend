"use client"

import { useCart } from "@/lib/cart-context"
import Link from "next/link"
import { Trash2, Plus, Minus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { PRIVATE_PATH } from "@/utils/constant"

export default function CartItems({}) {
  const { cartItems, updateQuantity, removeItem } = useCart()
  const { toast } = useToast()

  if (!cartItems || cartItems.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {cartItems.map((item) => {
        const itemPrice = typeof item.price === "number" && !isNaN(item.price) ? item.price : 0

        return (
          <div key={item.sku} className="flex gap-4 border border-border p-4">
            <div className="relative w-24 h-24 flex-shrink-0 bg-secondary">
              <img
                src={item.image || "/placeholder.svg?height=96&width=96"}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <Link
                href={`${PRIVATE_PATH.PRODUCT}/${item.sku}`}
                className="font-medium hover:text-muted-foreground transition-colors"
              >
                {item.name}
              </Link>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
              <p className="text-sm font-medium mt-2">${itemPrice.toFixed(2)}</p>
            </div>

            <div className="flex flex-col items-end justify-between">
              <button
                onClick={() => {
                  removeItem(item.sku)
                  toast({
                    title: "Item removed",
                    description: `${item.name} has been removed from your cart.`,
                  })
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Remove item"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              <div className="flex items-center border border-border">
                <button
                  onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                  className="px-3 py-1 hover:bg-accent transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="px-4 py-1 border-x border-border min-w-[50px] text-center text-sm">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                  className="px-3 py-1 hover:bg-accent transition-colors"
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

