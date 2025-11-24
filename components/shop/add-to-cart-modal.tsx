"use client"

import { Product } from "@/types/products"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { addToCart } from "@/store/cart/action"
import { PUBLIC_PATH, VALIDATION_ERROR_MESSAGE } from "@/utils/constant"

interface AddToCartModalProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AddToCartModal({ product, open, onOpenChange }: AddToCartModalProps) {
  const { addItem } = useCart()
  const { toast } = useToast()
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>("")

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setQuantity(1)
      setSelectedSize("")
      setSelectedColor("")
    }
    onOpenChange(newOpen)
  }

  const handleAddToCart = async () => {
    if (!product) return;
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast({
        title: VALIDATION_ERROR_MESSAGE.PLEASE_SELECT_A_SIZE,
        description: VALIDATION_ERROR_MESSAGE.PLEASE_SELECT_A_SIZE,
        variant: "destructive",
      })
      return
    }
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast({
        title: VALIDATION_ERROR_MESSAGE.PLEASE_SELECT_A_COLOR,
        description: VALIDATION_ERROR_MESSAGE.PLEASE_SELECT_A_COLOR,
        variant: "destructive",
      })
      return
    }

    const res = await addToCart({ productSku: product.sku, quantity: quantity, selectedSize: selectedSize, selectedColor: selectedColor });
    if (!res.success) {
      if (res.error === 'UNAUTHORIZED' || res.message?.toLowerCase().includes('unauthorized')) {
        toast({
          title: VALIDATION_ERROR_MESSAGE.AUTHENTICATION_REQUIRED,
          description: VALIDATION_ERROR_MESSAGE.UNAUTHORIZED_ACCESS,
          variant: "destructive",
        })
        handleOpenChange(false)
        router.push(PUBLIC_PATH.LOGIN)
        return
      }
      
      toast({
        title: VALIDATION_ERROR_MESSAGE.FAILED_TO_ADD_TO_CART,
        description: res.message || VALIDATION_ERROR_MESSAGE.FAILED_TO_ADD_TO_CART,
        variant: "destructive",
      })
      return
    }

    addItem({
      ...product,
      quantity: quantity,
      selectedSize: selectedSize,
      selectedColor: selectedColor,
    })

    toast({
      title: VALIDATION_ERROR_MESSAGE.ITEM_ADDED_TO_CART_SUCCESSFULLY,
      description: `${quantity} × ${product.name}${selectedSize ? ` (Size: ${selectedSize})` : ""}${selectedColor ? `, ${selectedColor}` : ""} added to your cart.`,
    })

    handleOpenChange(false)
  }

  if (!product) return null

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 py-4 items-start">
          {/* Product Image */}
          <div className="relative aspect-square bg-secondary rounded-lg overflow-hidden">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {!product.inStock && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                <span className="text-sm font-medium uppercase tracking-wide">Out of Stock</span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col min-h-full space-y-4">
            <div>
              <p className="text-sm uppercase tracking-wide text-muted-foreground mb-2">
                SKU: {product.sku}
              </p>
              <p className="text-2xl font-medium mb-2">${product.price.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{product.description}</p>
            </div>

            <div className="flex-1 space-y-4">
              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Color: {selectedColor && <span className="text-muted-foreground ml-2">{selectedColor}</span>}
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color) => {
                      const colorName = color as string;
                      return (
                        <button
                          key={colorName}
                          onClick={() => setSelectedColor(colorName)}
                          className={`relative w-12 h-12 rounded-full border-2 transition-all cursor-pointer ${
                            selectedColor === colorName
                              ? "border-foreground scale-110"
                              : "border-border hover:border-muted-foreground hover:scale-105"
                          }`}
                          style={{ backgroundColor: colorName.toLowerCase() }}
                          title={colorName}
                          aria-label={`Select ${colorName} color`}
                        >
                          {selectedColor === colorName && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full shadow-md" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Size: {selectedSize && <span className="text-muted-foreground ml-2">{selectedSize}</span>}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-2 border transition-all text-sm cursor-pointer ${
                          selectedSize === size
                            ? "border-foreground bg-foreground text-background"
                            : "border-border hover:border-foreground"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium">Quantity:</label>
                <div className="flex items-center border border-border">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-accent transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 border-x border-border min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-accent transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            className="flex-1 sm:flex-initial cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="flex-1 sm:flex-initial bg-foreground text-background hover:bg-foreground/90 uppercase tracking-wide cursor-pointer"
          >
            Add to Cart
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

