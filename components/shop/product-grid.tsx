"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import ProductCard from "@/components/ui/product-card"
import AddToCartModal from "@/components/shop/add-to-cart-modal"
import LoadMore from "@/components/ui/load-more"
import { PRIVATE_PATH, SORT_OPTIONS } from "@/utils/constant"
import { Product } from "@/types/products"
import { Category } from "@/types/categories"

interface ProductGridProps {
  products: Product[];
  categories: Category[];
  totalProducts: number;
}

export default function ProductGrid({ products, categories, totalProducts }: ProductGridProps) {

  const searchParams = useSearchParams()
  const router = useRouter()

  // Get category from URL
  const selectedCategory = searchParams.get('category')
  const [sortOrder, setSortOrder] = useState<string>("featured")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [displayCount, setDisplayCount] = useState<number>(10)
  
  // Simple function to update URL when category changes
  const handleCategoryChange = (category: string) => {
    if (category === "all") {
      router.push(`${PRIVATE_PATH.SHOP}`)
    } else {
      router.push(`${PRIVATE_PATH.SHOP}?category=${category}`)
    }
  }
  
  const getSortedProducts = useMemo(() => {
    const productsToSort = [...products]
    switch (sortOrder) {
      case "price-low-high":
        return productsToSort.sort((a, b) => a.price - b.price)
      case "price-high-low":
        return productsToSort.sort((a, b) => b.price - a.price)
      case "name-az":
        return productsToSort.sort((a, b) => a.name.localeCompare(b.name))
      case "featured":
      default:
        return productsToSort
    }
  }, [products, sortOrder])

  useEffect(() => {
    setDisplayCount(10)
  }, [products, selectedCategory])

  const displayedProducts = useMemo(() => {
    return getSortedProducts.slice(0, displayCount)
  }, [getSortedProducts, displayCount])

  const hasMore = displayCount < getSortedProducts.length

  const handleLoadMore = useCallback(() => {
    setDisplayCount(prev => prev + 10)
  }, [])

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
    <div>
      <div className="flex items-center justify-between border-b border-border mb-8">
        <div className="flex gap-8">
          <button
            onClick={() => handleCategoryChange("all")}
            className={`text-sm uppercase tracking-wide pb-4 border-b-2 transition-colors cursor-pointer ${!selectedCategory
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
              className={`text-sm uppercase tracking-wide pb-4 border-b-2 transition-colors cursor-pointer ${selectedCategory === cat.slug
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
          Showing {displayedProducts.length} of {getSortedProducts.length}{" "}
          {getSortedProducts.length === 1 ? "product" : "products"}
        </p>
        <select className="text-sm border border-border px-4 py-2 bg-background rounded-md" 
          value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found.</p>
        </div>
      ) : (
        <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayedProducts.map((product) => (
            <ProductCard key={product.sku} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
        
        <LoadMore
          isLoading={false}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
        />
      </>
      )}
      <AddToCartModal product={selectedProduct} open={isModalOpen} onOpenChange={handleModalClose} />
    </div>
  )
}
