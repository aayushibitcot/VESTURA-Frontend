"use client"

import { CartProvider as ShoppingCartProvider, useShoppingCart } from "use-shopping-cart"
import { Product } from "@/types/products"
import { addToCart as addToCartAPI, fetchCart, clearCart as clearCartAPI, removeCartItem, updateCartItemQuantity as updateCartItemQuantityAPI } from "@/store/cart/action"
import { useRouter } from "next/navigation"
import { PRIVATE_PATH, PUBLIC_PATH } from "@/utils/constant"
import { useEffect, useRef, useCallback } from "react"

interface CartProviderProps {
  children: React.ReactNode
}

// Internal component to handle cart initialization
// This ensures cart syncs only once when CartProvider mounts
function CartInitializer() {
  const {
    addItem: addItemToCart,
    clearCart: clearCartState,
  } = useShoppingCart()
  
  // Use ref to track initialization and prevent multiple calls
  const hasInitialized = useRef(false)
  const isInitializing = useRef(false)

  useEffect(() => {
    // Prevent multiple initializations (handles React StrictMode double-render)
    if (hasInitialized.current || isInitializing.current) {
      return
    }

    const initializeCart = async () => {
      try {
        isInitializing.current = true
        const res = await fetchCart()
        if (res.success && res.data?.items) {
          // Clear current cart first
          clearCartState()
          
          // Add all items from API to cart
          if (res.data.items.length > 0) {
            res.data.items.forEach((item: any) => {
              addItemToCart(
                {
                  id: item.product.sku,
                  name: item.product.name,
                  description: item.product.description || "",
                  price: item.product.price,
                  currency: item.product.currency || "USD",
                  image: item.product.image,
                  product_data: {
                    selectedSize: item.selectedSize,
                    selectedColor: item.selectedColor,
                    category: item.product.category || "",
                    cartItemId: item.id,
                  },
                },
                { count: item.quantity }
              )
            })
          }
        }
        hasInitialized.current = true
      } catch (error) {
        console.error("Error initializing cart from API:", error)
        // Allow retry on error
        hasInitialized.current = false
      } finally {
        isInitializing.current = false
      }
    }

    initializeCart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run once on mount

  return null
}

export default function CartProvider({ children }: CartProviderProps) {
  return (
    <ShoppingCartProvider
      mode="payment"
      cartMode="client-only"
      stripe={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""}
      currency="USD"
      shouldPersist={true}
      language="en-US"
      successUrl={PRIVATE_PATH.ORDER_SUCCESS}
      cancelUrl={PRIVATE_PATH.CART}
    >
      <CartInitializer />
      {children}
    </ShoppingCartProvider>
  )
}

// Custom hook to use cart with API integration
export function useCart() {
  const {
    addItem: addItemToCart,
    removeItem: removeItemFromCart,
    clearCart: clearCartState,
    cartCount,
    totalPrice,
    cartDetails,
    setItemQuantity,
  } = useShoppingCart()

  const router = useRouter()
  
  // Use ref to prevent concurrent syncs
  const isSyncing = useRef(false)

  // Sync cart from API - can be called manually after operations
  // Memoized with useCallback to prevent recreation on every render
  const syncCartFromAPI = useCallback(async () => {
    // Prevent concurrent syncs
    if (isSyncing.current) {
      return
    }
    
    try {
      isSyncing.current = true
      const res = await fetchCart()
      if (res.success && res.data?.items) {
        // Clear current cart first
        clearCartState()
        
        // Add all items from API to cart
        if (res.data.items.length > 0) {
          res.data.items.forEach((item: any) => {
            addItemToCart(
              {
                id: item.product.sku,
                name: item.product.name,
                description: item.product.description || "",
                price: item.product.price,
                currency: item.product.currency || "USD",
                image: item.product.image,
                product_data: {
                  selectedSize: item.selectedSize,
                  selectedColor: item.selectedColor,
                  category: item.product.category || "",
                  cartItemId: item.id,
                },
              },
              { count: item.quantity }
            )
          })
        }
      }
    } catch (error) {
      console.error("Error syncing cart from API:", error)
    } finally {
      isSyncing.current = false
    }
  }, [clearCartState, addItemToCart])

  // Note: Initial cart sync is now handled by CartInitializer component
  // This prevents multiple API calls when useCart is called from multiple components

  // Convert cartDetails to array format compatible with existing code
  const cartItems = Object.values(cartDetails || {}).map((item: any) => ({
    id: item.product_data?.cartItemId ?? item.id,
    sku: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    currency: item.currency || "USD",
    image: item.image,
    quantity: item.quantity,
    selectedSize: item.product_data?.selectedSize,
    selectedColor: item.product_data?.selectedColor,
    inStock: true,
    category: item.product_data?.category || "",
  }))

  // Add item with API integration
  const addItem = async (product: Product & { quantity: number; selectedSize?: string; selectedColor?: string }) => {
    try {
      // Call API first
      const res = await addToCartAPI({
        productSku: product.sku,
        quantity: product.quantity,
        selectedSize: product.selectedSize,
        selectedColor: product.selectedColor,
      })

      if (!res.success) {
        if (res.error === 'UNAUTHORIZED') {
          router.push(PUBLIC_PATH.LOGIN)
          return
        }
        throw new Error(res.message || "Failed to add to cart")
      }

      // Sync cart from API to ensure accurate count and state
      await syncCartFromAPI()
    } catch (error) {
      console.error("Error adding to cart:", error)
      throw error
    }
  }

  // Remove item with API integration
  const removeItem = async (sku: string) => {
    try {
      // Find cart item ID from API cart
      const cartRes = await fetchCart()
      if (cartRes.success && cartRes.data?.items) {
        const item = cartRes.data.items.find((item: any) => item.product.sku === sku)
        if (item?.id) {
          await removeCartItem(item.id)
          // Sync cart from API after successful removal
          await syncCartFromAPI()
        }
      } else {
        // If fetch fails, still try to remove from local state
        removeItemFromCart(sku)
      }
    } catch (error) {
      console.error("Error removing from cart:", error)
      // Still remove from local state even if API fails
      removeItemFromCart(sku)
    }
  }

  // Remove item by ID (for cart-items component)
  const removeItemById = async (itemId: string, fallbackSku?: string) => {
    const cartEntry = Object.values(cartDetails || {}).find(
      (item: any) => item.product_data?.cartItemId === itemId
    ) as any
    const sku = cartEntry?.id ?? fallbackSku

    try {
      if (sku) {
        removeItemFromCart(sku)
      }
      await removeCartItem(itemId)
    } catch (error) {
      console.error("Error removing item by ID:", error)
      if (sku) {
        await syncCartFromAPI()
      }
      throw error
    }
  }

  // Update quantity
  const updateQuantity = async (sku: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(sku)
      return
    }

    try {
      // Find cart item ID from API cart
      const cartRes = await fetchCart()
      if (cartRes.success && cartRes.data?.items) {
        const item = cartRes.data.items.find((item: any) => item.product.sku === sku)
        if (item?.id) {
          // Call API to update quantity
          const res = await updateCartItemQuantityAPI(item.id, quantity)
          if (res.success) {
            // Sync cart from API after successful update
            await syncCartFromAPI()
          } else {
            throw new Error(res.message || "Failed to update quantity")
          }
        } else {
          // If item not found in API, just update local state
          setItemQuantity(sku, quantity)
        }
      } else {
        // If fetch fails, update local state anyway
        setItemQuantity(sku, quantity)
      }
    } catch (error) {
      console.error("Error updating quantity:", error)
      // Still update local state even if API fails
      setItemQuantity(sku, quantity)
    }
  }

  // Update quantity by item ID (for cart-items component)
  const updateQuantityById = async (itemId: string, quantity: number, fallbackSku?: string) => {
    if (quantity < 1) {
      await removeItemById(itemId, fallbackSku)
      return
    }

    const cartEntry = Object.values(cartDetails || {}).find(
      (item: any) => item.product_data?.cartItemId === itemId
    ) as any

    const sku = cartEntry?.id ?? fallbackSku
    const previousQuantity = cartEntry?.quantity

    if (sku) {
      setItemQuantity(sku, quantity)
    }

    try {
      const res = await updateCartItemQuantityAPI(itemId, quantity)
      if (!res.success) {
        throw new Error(res.message || "Failed to update quantity")
      }
    } catch (error) {
      console.error("Error updating quantity by ID:", error)
      if (sku && typeof previousQuantity === "number") {
        setItemQuantity(sku, previousQuantity)
      } else {
        await syncCartFromAPI()
      }
      throw error
    }
  }

  // Clear cart with API integration
  const clearCart = async () => {
    try {
      await clearCartAPI()
      clearCartState()
    } catch (error) {
      console.error("Error clearing cart:", error)
      // Still clear local state
      clearCartState()
    }
  }

  // Redirect to checkout
  const redirectToCheckout = async () => {
    if (cartCount === 0) {
      alert("Your cart is empty")
      return
    }
    router.push(PRIVATE_PATH.CHECKOUT)
  }

  return {
    cartItems,
    cartCount,
    totalPrice,
    addItem,
    removeItem,
    removeItemById,
    updateQuantity,
    updateQuantityById,
    clearCart,
    redirectToCheckout,
    syncCartFromAPI,
  }
}

