"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import ProductCard from "@/components/ui/product-card"
import { DEFAULT_PAGINATION, PRIVATE_PATH, SORT_OPTIONS } from "@/utils/constant"
import { Product } from "@/types/products"
import { Category } from "@/types/categories"
import { fetchProductsByCategory } from "@/store/categories/action"
import { fetchProducts } from "@/store/products/action"
import { useAppDispatch } from "@/store/hooks"
import LoadMore from "../ui/load-more"

interface ProductGridProps {
  products: Product[];
  categories: Category[];
  totalProducts: number;
}

export default function ProductGrid({ products, categories, totalProducts }: ProductGridProps) {

  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const router = useRouter()

  // Initialize selectedCategory from URL on mount
  const initialCategory = searchParams.get('category')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory)
  const [urlCategory, setUrlCategory] = useState<string | null>(initialCategory)
  const [sortOrder, setSortOrder] = useState<string>("featured")
  const [sortedProducts, setSortedProducts] = useState<Product[]>(products)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [totalProductsCount, setTotalProductsCount] = useState<number>(totalProducts)
  const [totalCategoriesCount, setTotalCategoriesCount] = useState<number>(categories.length)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [pagination, setPagination] = useState<any>({ page: DEFAULT_PAGINATION.PAGE, limit: DEFAULT_PAGINATION.LIMIT })
  // Use ref to track if we're filtering by category (to prevent products prop from resetting filtered state)
  const isCategoryFiltered = useRef<boolean>(!!initialCategory)
  // Use ref to prevent infinite loops - track if we're currently processing a category change
  const isProcessingCategoryChange = useRef<boolean>(false)
  // Track the last processed category to avoid duplicate calls
  const lastProcessedCategory = useRef<string | null>(initialCategory)

  const handleCategoryChange = useCallback(async (category: string, skipUrlUpdate = false) => {
    // Prevent duplicate calls
    if (isProcessingCategoryChange.current) {
      return
    }

    // Check if this category is already selected
    const targetCategory = category === "all" ? null : category
    if (lastProcessedCategory.current === targetCategory) {
      return
    }

    isProcessingCategoryChange.current = true
    setIsLoading(true)
    try {
      if (category === "all") {
        isCategoryFiltered.current = false
        const response = await fetchProducts(dispatch, { page: DEFAULT_PAGINATION.PAGE, limit: DEFAULT_PAGINATION.LIMIT })
        if (response.success) {
          setSortedProducts(response.data?.products || [])
          setTotalProductsCount(response.data?.pagination?.total || totalProducts)
          setSelectedCategory(null)
          lastProcessedCategory.current = null
          if (!skipUrlUpdate) {
            router.push(`${PRIVATE_PATH.SHOP}`)
          }
        }
      } else {
        isCategoryFiltered.current = true
        const response = await fetchProductsByCategory(dispatch, category)
        if (response.success) {
          setSortedProducts(response.data.products || [])
          setTotalCategoriesCount(response.data.products?.length || 0)
          setSelectedCategory(category)
          lastProcessedCategory.current = category
          if (!skipUrlUpdate) {
            router.push(`${PRIVATE_PATH.SHOP}?category=${category}`)
          }
        }
      }
    } finally {
      setIsLoading(false)
      // Reset processing flag after a short delay to allow URL update to complete
      setTimeout(() => {
        isProcessingCategoryChange.current = false
      }, 300)
    }
  }, [dispatch, totalProducts, router])

  // Initialize products when component mounts - only if no category is selected
  useEffect(() => {
    if (!initialCategory && products && products.length > 0) {
      setSortedProducts(products)
      setTotalProductsCount(totalProducts)
      isCategoryFiltered.current = false
    } else if (initialCategory && initialCategory !== selectedCategory) {
      // If category is in URL on mount, fetch that category's products
      isCategoryFiltered.current = true
      lastProcessedCategory.current = initialCategory
      handleCategoryChange(initialCategory, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run on mount

  // Update urlCategory state when searchParams changes (but only if value actually changed)
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category')
    if (categoryFromUrl !== urlCategory) {
      setUrlCategory(categoryFromUrl)
    }
  }, [searchParams, urlCategory])

  // Handle URL category changes (only when urlCategory state changes)
  useEffect(() => {
    // Skip if we're already processing a category change
    if (isProcessingCategoryChange.current) {
      return
    }

    // Skip if this category was already processed
    if (urlCategory === lastProcessedCategory.current) {
      return
    }

    // Only handle URL changes that don't match current processed category (e.g., browser back/forward)
    if (urlCategory) {
      // Only fetch if this is a different category than what we last processed
      if (urlCategory !== lastProcessedCategory.current) {
        // Skip URL update since URL already matches - this is a browser navigation
        handleCategoryChange(urlCategory, true)
      }
    } else {
      // Only reset to all products if we had a category before
      if (lastProcessedCategory.current !== null) {
        // Skip URL update since URL already matches - this is a browser navigation
        handleCategoryChange("all", true)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlCategory]) // Only depend on urlCategory state, not searchParams object
  
  const getFilteredproduct = async (pagination: any, append: boolean = false) => {
    const response = await fetchProducts(dispatch, pagination)
    if (response.success) {
      setSortedProducts(append ? [...sortedProducts, ...response.data.products] : response.data.products)
    }
  }

  const getSortedProducts = () => {
    const productsToSort = [...sortedProducts]
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
  }

  const handleLoadMore = () => {
    const newPagination = { ...pagination, page: pagination.page + 1 };
    setPagination(newPagination);
    getFilteredproduct(newPagination);
  }

  return (
    <div>
      <div className="flex items-center justify-between border-b border-border mb-8">
        <div className="flex gap-8">
          <button
            onClick={() => handleCategoryChange("all")}
            className={`text-sm uppercase tracking-wide pb-4 border-b-2 transition-colors ${!selectedCategory
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
              className={`text-sm uppercase tracking-wide pb-4 border-b-2 transition-colors ${selectedCategory === cat.slug
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
            Showing {selectedCategory === "all" || !selectedCategory ? totalProductsCount : totalCategoriesCount}{" "}
            {(selectedCategory === "all" || !selectedCategory ? totalProductsCount : totalCategoriesCount) === 1 ? "product" : "products"}
          </>
        </p>
        <select className="text-sm border border-border px-4 py-2 bg-background rounded-md" 
          value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
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
        <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {getSortedProducts().map((product) => (
            <ProductCard key={product.sku} product={product} />
          ))}
        </div>
        
        {/* <LoadMore
          isLoading={isLoading}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
        /> */}
      </>
      )}
    </div>
  )
}
