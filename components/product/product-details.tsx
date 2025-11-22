"use client"

import type { Product } from "@/types/products"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { PRIVATE_PATH } from "@/utils/constant"

interface ProductDetailsProps {
  product: Product
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { addItem } = useCart()
  const { toast } = useToast()
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>("")

  // Find category by matching product.category (which could be name or slug) with categories
  // const category = categories.find(
  //   (cat) => cat.slug === product.category || cat.name.toLowerCase() === product.category.toLowerCase()
  // ) || categories.find((cat) => cat.name.toLowerCase().includes(product.category.toLowerCase()))
  
  // const categorySlug = category?.slug || product.category
  // const categoryName = category?.name || product.category
  //   .split("-")
  //   .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  //   .join(" ")

  const handleAddToCart = () => {
    if (product.sizes.length > 0 && !selectedSize) {
      toast({
        title: "Please select a size",
        description: "You must select a size before adding to cart.",
        variant: "destructive",
      })
      return
    }

    if (product.colors.length > 0 && !selectedColor) {
      toast({
        title: "Please select a color",
        description: "You must select a color before adding to cart.",
        variant: "destructive",
      })
      return
    }

    addItem(product, quantity)

    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name}${selectedSize ? ` (Size: ${selectedSize})` : ""}${selectedColor ? `, ${selectedColor}` : ""} added to your cart.`,
    })
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href={PRIVATE_PATH.HOME} className="hover:text-foreground transition-colors">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={PRIVATE_PATH.SHOP} className="hover:text-foreground transition-colors">
          Shop
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="relative aspect-square bg-secondary rounded-lg overflow-hidden">
          <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
          {!product.inStock && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <span className="text-xl font-medium uppercase tracking-wide">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <p className="text-sm uppercase tracking-wide text-muted-foreground mb-2">SKU: {product.sku}</p>
            <h1 className="font-serif text-3xl md:text-4xl mb-4">{product.name}</h1>
            <p className="text-3xl font-medium">${product.price.toFixed(2)}</p>
          </div>

          <div className="border-t border-b border-border py-6 space-y-4">
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            <div className="space-y-2">
              <p className="text-sm font-medium">Category:</p>
              {/* <Link
                href={`/shop?category=${categorySlug}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
              >
                {categoryName}
                <ChevronRight className="h-3 w-3" />
              </Link> */}
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Availability:</p>
              <p className="text-sm text-muted-foreground">{product.inStock ? "In Stock" : "Out of Stock"}</p>
            </div>
          </div>

          <div className="space-y-4">
            {product.colors.length > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-medium">
                  Color: {selectedColor && <span className="text-muted-foreground ml-2">{selectedColor}</span>}
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => {
                    // Handle both string and object color formats
                    const colorName = typeof color === 'string' ? color : color.name;
                    const colorHex = typeof color === 'string' ? '#000000' : color.hex;
                    
                    return (
                      <button
                        key={colorName}
                        onClick={() => setSelectedColor(colorName)}
                        className={`relative w-12 h-12 rounded-full border-2 transition-all cursor-pointer ${
                          selectedColor === colorName
                            ? "border-foreground scale-110"
                            : "border-border hover:border-muted-foreground hover:scale-105"
                        }`}
                        style={{ backgroundColor: colorHex }}
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

            {product.sizes.length > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-medium">
                  Size: {selectedSize && <span className="text-muted-foreground ml-2">{selectedSize}</span>}
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border transition-all cursor-pointer ${
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
                <span className="px-6 py-2 border-x border-border min-w-[60px] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-accent transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="w-full bg-foreground text-background hover:bg-foreground/90 uppercase tracking-wide py-6 text-base cursor-pointer"
            >
              Add to Cart
            </Button>
          </div>

          <div className="border-t border-border pt-6 space-y-4 text-sm">
            <div className="flex gap-4">
              <span className="text-muted-foreground">Free Shipping:</span>
              <span>On orders over $100</span>
            </div>
            <div className="flex gap-4">
              <span className="text-muted-foreground">Free Returns:</span>
              <span>30-day return policy</span>
            </div>
            <div className="flex gap-4">
              <span className="text-muted-foreground">Secure Payment:</span>
              <span>Encrypted checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
