"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import type { Product } from "@/types/products"
import { useRouter } from "next/navigation"
import { PRIVATE_PATH } from "@/utils/constant"

export interface CartItem extends Product {
  quantity: number
}

interface CartContextType {
  cartItems: CartItem[]
  cartCount: number
  totalPrice: number
  addItem: (product: Product, quantity?: number) => void
  removeItem: (sku: string) => void
  updateQuantity: (sku: string, quantity: number) => void
  clearCart: () => void
  redirectToCheckout: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const router = useRouter()

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const addItem = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.sku === product.sku)
      if (existingItem) {
        return prev.map((item) => (item.sku === product.sku ? { ...item, quantity: item.quantity + quantity } : item))
      }
      return [...prev, { ...product, quantity }]
    })
  }

  const removeItem = (sku: string) => {
    setCartItems((prev) => prev.filter((item) => item.sku !== sku))
  }

  const updateQuantity = (sku: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(sku)
      return
    }
    setCartItems((prev) => prev.map((item) => (item.sku === sku ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const redirectToCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty")
      return
    }

    router.push(PRIVATE_PATH.CHECKOUT)
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        totalPrice,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        redirectToCheckout,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
