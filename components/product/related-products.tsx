"use client"

import { useState, useCallback } from "react"
import type { Product } from "@/types/products"
import ProductCard from "@/components/ui/product-card"
import AddToCartModal from "@/components/shop/add-to-cart-modal"
import { SectionHeading } from "../ui/section-heading"

interface RelatedProductsProps {
  products: Product[]
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleAddToCart = useCallback((product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }, [])

  const handleModalClose = useCallback((open: boolean) => {
    setIsModalOpen(open)
    if (!open) {
      setSelectedProduct(null)
    }
  }, [])

  return (
    <section className="border-t border-border py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Related Products" align="left" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.sku} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
      </div>
      <AddToCartModal product={selectedProduct} open={isModalOpen} onOpenChange={handleModalClose} />
    </section>
  )
}
