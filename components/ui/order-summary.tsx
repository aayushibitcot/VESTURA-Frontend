"use client"

import { useCart } from "@/lib/cart-provider"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CartItemFromAPI } from "@/types/cart"

interface OrderItem {
  name: string
  price: number
  quantity: number
  image: string
  sku?: string
}

interface OrderSummaryProps {
  variant?: "cart" | "checkout" | "success"
  showItems?: boolean
  shippingCost?: number
  isProcessing?: boolean
  submitButtonText?: string
  className?: string
  orderItems?: OrderItem[] | CartItemFromAPI[]
  orderTotal?: number
  useApiData?: boolean
}

export default function OrderSummary({
  variant = "cart",
  showItems = false,
  shippingCost,
  isProcessing = false,
  submitButtonText,
  className = "",
  orderItems,
  orderTotal,
  useApiData = false,
}: OrderSummaryProps) {
  const { cartItems, cartCount, totalPrice, redirectToCheckout } = useCart()

  const convertToOrderItems = (items: OrderItem[] | CartItemFromAPI[]): OrderItem[] => {
    if (!items || items.length === 0) return []
    
    if (items[0] && 'product' in items[0]) {
      return (items as CartItemFromAPI[]).map(item => ({
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
        sku: item.product.sku,
      }))
    }
    return items as OrderItem[]
  }

  const calculateTotalFromItems = (items: OrderItem[] | CartItemFromAPI[]): number => {
    if (!items || items.length === 0) return 0
    
    if (items[0] && 'product' in items[0]) {
      return (items as CartItemFromAPI[]).reduce((sum, item) => sum + item.subtotal, 0)
    }
    return (items as OrderItem[]).reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  const calculateCartCount = (items: OrderItem[] | CartItemFromAPI[]): number => {
    if (!items || items.length === 0) return 0
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }

  const isCartPage = variant === "cart"
  const hasLiveCartItems = Array.isArray(cartItems) && cartItems.length > 0

  // Prefer live cart data on the cart page for instant updates; fallback to provided items
  const rawItems =
    isCartPage && hasLiveCartItems
      ? cartItems
      : (variant === "success" || useApiData) && orderItems
      ? orderItems
      : cartItems

  const items = convertToOrderItems(rawItems)
  
  const displayTotal =
    isCartPage && hasLiveCartItems
      ? totalPrice
      : orderTotal !== undefined 
      ? orderTotal 
      : (variant === "success" || useApiData) && orderItems
      ? calculateTotalFromItems(orderItems)
      : totalPrice

  // Calculate item count from live cart when available; otherwise, use provided items
  const itemCount =
    isCartPage && hasLiveCartItems
      ? calculateCartCount(cartItems as any)
      : (variant === "success" || useApiData) && orderItems
      ? calculateCartCount(orderItems)
      : calculateCartCount(items)

  // Ensure consistent default shipping cost between Cart and Checkout
  const finalShippingCost = shippingCost !== undefined ? shippingCost : 5.99
  const finalTotal = variant === "success" ? displayTotal : (displayTotal || 0) + finalShippingCost

  const containerClass = variant === "checkout" 
    ? "bg-muted/30 border border-border p-6 sticky top-4"
    : variant === "success"
    ? "border border-border p-6 mb-8"
    : "border border-border p-6 h-fit space-y-4"

  return (
    <div className={`${containerClass} ${className}`}>
      <h2 className={
        variant === "checkout" || variant === "success"
          ? "text-sm font-medium uppercase tracking-wide mb-6"
          : "font-serif text-2xl"
      }>
        {variant === "checkout" || variant === "success" ? "ORDER SUMMARY" : "Order Summary"}
      </h2>

      {showItems && (variant === "checkout" || variant === "success") && (
        <div className="space-y-4 mb-6">
          {items.map((item, index) => (
            <div key={item.sku || index} className="flex gap-3"> 
                <div className={`relative w-16 h-16 flex-shrink-0 ${variant === "success" ? "bg-muted" : "bg-background"}`}>
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className={variant === "success" ? "flex-1" : "flex-1 min-w-0"}>
                  <p className={`font-medium text-sm ${variant === "checkout" ? "uppercase tracking-wide line-clamp-2" : ""}`}>
                    {item.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Qty: {item.quantity}</p>
                </div>  
              <div className="text-right">
                <p className={`font-medium ${variant === "success" ? "" : "text-sm"}`}>
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {variant !== "success" && (
        <div className={variant === "checkout" ? "space-y-2 py-4 border-t border-border" : "space-y-2 py-4 border-t border-b border-border"}>
          <div className="flex justify-between text-sm">
            <span className={variant === "checkout" ? "" : "text-muted-foreground"}>
              {variant === "checkout" ? "Subtotal" : `Subtotal (${itemCount} ${itemCount === 1 ? "item" : "items"})`}
            </span>
            <span>${(displayTotal || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className={variant === "checkout" ? "" : "text-muted-foreground"}>Shipping</span>
            <span className={variant === "checkout" ? "" : finalShippingCost === 0 ? "text-green-600" : ""}>
              {variant === "checkout" ? `$${finalShippingCost.toFixed(2)}` : finalShippingCost === 0 ? "FREE" : `$${finalShippingCost.toFixed(2)}`}
            </span>
          </div>
          {variant === "cart" && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax</span>
              <span>Calculated at checkout</span>
            </div>
          )}
        </div>
      )}

      <div className={`flex justify-between ${
        variant === "checkout" 
          ? "text-base font-medium pt-4 border-t border-border mb-6" 
          : variant === "success"
          ? "text-base font-medium pt-4 border-t border-border"
          : "text-lg font-medium"
      }`}>
        <span className={variant === "checkout" || variant === "success" ? "uppercase tracking-wide" : ""}>TOTAL</span>
        <span>${(finalTotal || 0).toFixed(2)}</span>
      </div>

      {variant === "checkout" && (
        <Button
          type="submit"
          disabled={isProcessing}
          className="w-full bg-foreground text-background hover:bg-foreground/90 uppercase tracking-wide py-6 cursor-pointer" 
        >
          {isProcessing ? "Processing..." : submitButtonText || "PLACE ORDER"}
        </Button>
      )}
      
      {variant === "cart" && (
        <>
          <Button
            onClick={redirectToCheckout}
            className="w-full bg-foreground text-background hover:bg-foreground/90 uppercase tracking-wide py-6 cursor-pointer"
          >
            Proceed to Checkout
          </Button>

          <Link
            href="/shop"
            className="block text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Continue Shopping
          </Link>

          <div className="pt-4 space-y-2 text-xs text-muted-foreground">
            <p>✓ Secure checkout powered by Stripe</p>
            <p>✓ Free shipping on all orders</p>
            <p>✓ 30-day return policy</p>
          </div>
        </>
      )}
      
    </div>
  )
}

