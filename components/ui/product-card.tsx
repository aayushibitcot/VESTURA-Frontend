"use client"

import type React from "react"
import Link from "next/link"
import { Product } from "@/types/products"
import { Button } from "@/components/ui/button"
import { PRIVATE_PATH } from "@/utils/constant"
import { useRouter } from "next/navigation"

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const router=useRouter();
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onAddToCart(product)
  }
  const handleClick = ( e: React.MouseEvent, sku: string) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(`${PRIVATE_PATH.PRODUCT}/${product.sku}`);
  }

  return (
    <div onClick={(e)=>handleClick(e,product.sku)} className="group w-full text-left">
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary mb-4 rounded-lg">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <span className="text-sm font-medium uppercase tracking-wide">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="font-medium text-lg group-hover:text-muted-foreground transition-colors">{product.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between pt-2">
          <span className="font-medium text-lg">${product.price.toFixed(2)}</span>
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="bg-foreground text-background hover:bg-foreground/90 text-sm px-4 cursor-pointer"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}

