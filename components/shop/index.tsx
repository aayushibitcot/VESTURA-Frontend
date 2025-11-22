"use client"

import ProductGrid from "@/components/shop/product-grid"
import { Product, ProductsResponse } from "@/types/products"
import { Category } from "@/types/categories"

export default function Shop({ products, pagination, categories }: { products: Product[], pagination: ProductsResponse['pagination'], categories: Category[] }) {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ProductGrid products={products} pagination={pagination || undefined} categories={categories} />
    </div>
  )
}

