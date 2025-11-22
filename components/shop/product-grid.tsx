"use client"

import { useState } from "react"
import ProductCard from "@/components/ui/product-card"
import { SORT_OPTIONS } from "@/utils/constant"
import { Product, ProductsResponse } from "@/types/products"
import { Category } from "@/types/categories"
import { usePathname } from "next/navigation"

export default function ProductGrid({ products, pagination, categories }: { products: Product[], pagination?: ProductsResponse['pagination'], categories: Category[] }) {
  const [sortOrder, setSortOrder] = useState<string>("featured")
  const [localCategory, setLocalCategory] = useState<string | null>(null)
  const pathname = usePathname()
  
  const handleCategoryChange = (categorySlug: string) => {
    const newCategory = categorySlug === "all" ? null : categorySlug
    if (newCategory === localCategory) return
    
    setLocalCategory(newCategory)

    const params = new URLSearchParams()
    if (categorySlug !== "all") {
      params.set("category", categorySlug)
    }
    const queryString = params.toString()
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname
    
    // Update URL without triggering Next.js navigation
    if (window.history.replaceState) {
      window.history.replaceState(
        { ...window.history.state },
        '',
        newUrl
      )
    }
  }
  // Filter products by category if selected
  const filteredProducts = localCategory
    ? products.filter(product => product.category === localCategory)
    : products

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOrder) {
      case "price-low-high":
        return a.price - b.price
      case "price-high-low":
        return b.price - a.price
      case "name-az":
        return a.name.localeCompare(b.name)
      case "featured":
      default:
        return 0
    }
  })

  return (
    <div>
      <div className="flex items-center justify-between border-b border-border mb-8">
        <div className="flex gap-8">
          <button
            onClick={() => handleCategoryChange("all")}
            className={`text-sm uppercase tracking-wide pb-4 border-b-2 transition-colors ${
              !localCategory
                ? "border-foreground font-medium"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          {Array.isArray(categories) && categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.slug)}
              className={`text-sm uppercase tracking-wide pb-4 border-b-2 transition-colors ${
                localCategory === cat.slug
                  ? "border-foreground font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          <>
            Showing {sortedProducts.length} {sortedProducts.length === 1 ? "product" : "products"}
            {/* {pagination && ` (${pagination.total} total)`} */}
          </>
        </p>
        <select
          className="text-sm border border-border px-4 py-2 bg-background rounded-md"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      {sortedProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {sortedProducts.map((product) => (
            <ProductCard key={product.sku} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
