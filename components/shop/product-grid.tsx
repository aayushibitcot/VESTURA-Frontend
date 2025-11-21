"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useCategories } from "@/hooks/use-categories"
import ProductCard from "@/components/ui/product-card"
import { useProducts } from "@/hooks/use-products"

export default function ProductGrid() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const urlCategory = searchParams.get("category")
  const [sortOrder, setSortOrder] = useState("featured")
  // Use local state for category to avoid URL update delays and route requests
  const [localCategory, setLocalCategory] = useState<string | null>(urlCategory)
  const { categories } = useCategories()
  
  // Sync local category with URL params on mount and when URL changes externally
  useEffect(() => {
    if (urlCategory !== localCategory) {
      setLocalCategory(urlCategory)
    }
  }, [urlCategory])
  
  // Listen for popstate events (when URL changes via history API)
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search)
      const urlCategory = params.get("category")
      setLocalCategory(urlCategory)
    }
    
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])
  
  // Use local category for API calls to avoid waiting for URL updates
  const { products, isLoading, error, pagination, refetch } = useProducts({
    category: localCategory || undefined,
    page: 1,
    limit: 100, 
  })
  
  const handleCategoryChange = (categorySlug: string) => {
    // Update local state immediately (triggers API call via useProducts hook)
    const newCategory = categorySlug === "all" ? null : categorySlug
    if (newCategory === localCategory) return
    
    setLocalCategory(newCategory)
    
    // Update URL silently using history API to avoid Next.js route requests
    // This prevents shop?category=...&_rsc=... requests
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

  // Sort products (API handles filtering by category)
  const sortedProducts = [...products].sort((a, b) => {
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
          {categories.map((cat) => (
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
          {isLoading ? (
            "Loading products..."
          ) : error ? (
            `Error: ${error}`
          ) : (
            <>
              Showing {sortedProducts.length} {sortedProducts.length === 1 ? "product" : "products"}
              {pagination && ` (${pagination.total} total)`}
            </>
          )}
        </p>
        <select
          className="text-sm border border-border px-4 py-2 bg-background rounded-md"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          disabled={isLoading}
        >
          <option value="featured">Sort by: Featured</option>
          <option value="price-low-high">Price: Low to High</option>
          <option value="price-high-low">Price: High to Low</option>
          <option value="name-az">Name: A-Z</option>
        </select>
      </div>

      {error && !isLoading && (
        <div className="text-center py-8">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-destructive font-medium mb-2">Failed to load products</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <button
              onClick={() => refetch()}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-muted aspect-square rounded-lg mb-4"></div>
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : sortedProducts.length === 0 ? (
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
