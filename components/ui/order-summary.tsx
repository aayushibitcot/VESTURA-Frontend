"use client"

import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"

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
  // For success variant - static order data
  orderItems?: OrderItem[]
  orderTotal?: number
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
}: OrderSummaryProps) {
  const { cartItems, cartCount, totalPrice, redirectToCheckout } = useCart()

  // Use orderItems if provided (success variant), otherwise use cartItems
  const items = variant === "success" && orderItems ? orderItems : cartItems
  const displayTotal = variant === "success" && orderTotal !== undefined ? orderTotal : totalPrice

  const finalShippingCost = shippingCost !== undefined ? shippingCost : variant === "checkout" ? 5.99 : 0
  const finalTotal = variant === "success" ? displayTotal : displayTotal + finalShippingCost

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
            <div key={item.sku || index} className={variant === "success" ? "flex justify-between items-center" : "flex gap-3"}>
              <div className={variant === "success" ? "flex gap-3 flex-1" : ""}>
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
              {variant === "checkout" ? "Subtotal" : `Subtotal (${cartCount} items)`}
            </span>
            <span>${displayTotal.toFixed(2)}</span>
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
        <span>${finalTotal.toFixed(2)}</span>
      </div>

      {variant === "checkout" && (
        <Button
          type="submit"
          disabled={isProcessing}
          className="w-full bg-foreground text-background hover:bg-foreground/90 uppercase tracking-wide py-6"
        >
          {isProcessing ? "Processing..." : submitButtonText || "PLACE ORDER"}
        </Button>
      )}
      
      {variant === "cart" && (
        <>
          <Button
            onClick={redirectToCheckout}
            className="w-full bg-foreground text-background hover:bg-foreground/90 uppercase tracking-wide py-6"
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
      
      {/* Success variant shows no buttons - order is already placed */}
    </div>
  )
}

