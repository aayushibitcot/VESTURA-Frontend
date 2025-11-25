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
  const [sortOrder, setSortOrder] = useState<string>("featured")
  const [sortedProducts, setSortedProducts] = useState<Product[]>(products)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [totalProductsCount, setTotalProductsCount] = useState<number>(totalProducts)
  const [totalCategoriesCount, setTotalCategoriesCount] = useState<number>(categories.length)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [pagination, setPagination] = useState<any>({ page: DEFAULT_PAGINATION.PAGE, limit: DEFAULT_PAGINATION.LIMIT })
  // Use ref to track if we're filtering by category (to prevent products prop from resetting filtered state)
  const isCategoryFiltered = useRef<boolean>(!!initialCategory)

  const handleCategoryChange = useCallback(async (category: string) => {
    setIsLoading(true)
    try {
      if (category === "all") {
        isCategoryFiltered.current = false
        const response = await fetchProducts(dispatch, { page: DEFAULT_PAGINATION.PAGE, limit: DEFAULT_PAGINATION.LIMIT })
        if (response.success) {
          setSortedProducts(response.data?.products || [])
          setTotalProductsCount(response.data?.pagination?.total || totalProducts)
          setSelectedCategory(null)
          router.push(`${PRIVATE_PATH.SHOP}`)
        }
      } else {
        isCategoryFiltered.current = true
        const response = await fetchProductsByCategory(dispatch, category)
        if (response.success) {
          setSortedProducts(response.data.products || [])
          setTotalCategoriesCount(response.data.products?.length || 0)
          setSelectedCategory(category)
          router.push(`${PRIVATE_PATH.SHOP}?category=${category}`)
        }
      }
    } finally {
      setIsLoading(false)
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
      handleCategoryChange(initialCategory)
    }
  }, []) // Only run on mount

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category')
    if (categoryFromUrl) {
      if (categoryFromUrl !== selectedCategory) {
        handleCategoryChange(categoryFromUrl)
      }
    } else {
      // Only reset to all products if category was previously selected
      if (selectedCategory !== null) {
        handleCategoryChange("all")
      }
    }
  }, [searchParams]) // Only depend on searchParams - handleCategoryChange is stable
  
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
