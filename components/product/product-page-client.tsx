"use client";

import { useEffect, useMemo } from "react";
import { useProduct, useProducts } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import Product from "@/components/product";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ProductPageClientProps {
  sku: string;
}

export default function ProductPageClient({ sku }: ProductPageClientProps) {
  const { product, isLoading, error, refetch } = useProduct(sku);
  const { categories } = useCategories();
  
  // Find category slug from categories store
  const categorySlug = useMemo(() => {
    if (!product?.category) return undefined;
    
    // Try to find category by slug first
    const categoryBySlug = categories.find((cat) => cat.slug === product.category);
    if (categoryBySlug) return categoryBySlug.slug;
    
    // Try to find by name (case-insensitive)
    const categoryByName = categories.find(
      (cat) => cat.name.toLowerCase() === product.category.toLowerCase()
    );
    if (categoryByName) return categoryByName.slug;
    
    // Fallback to product.category (might already be a slug)
    return product.category;
  }, [product?.category, categories]);
  
  // Fetch related products when product is loaded
  const { products: relatedProducts } = useProducts({
    category: categorySlug,
    limit: 4,
    autoFetch: !!product && !!categorySlug, // Only fetch when product and category are loaded
  });

  // Filter out the current product from related products
  const filteredRelatedProducts = relatedProducts
    .filter((p) => p.sku !== sku)
    .slice(0, 4);

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          <Skeleton className="aspect-square w-full" />
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading product</AlertTitle>
          <AlertDescription>
            <div className="space-y-2">
              <p>{error || "Product not found"}</p>
              <Button
                onClick={() => refetch()}
                variant="outline"
                size="sm"
              >
                Try Again
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <Product product={product} relatedProducts={filteredRelatedProducts} />;
}

