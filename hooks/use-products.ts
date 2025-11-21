"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProducts, fetchProductBySku } from "@/store/actions/productsAction";
import { fetchProductsByCategory } from "@/store/actions/categoriesAction";
import { getCategoryBySlug } from "@/lib/products";

interface UseProductsParams {
  page?: number;
  limit?: number;
  category?: string; // Category slug
  search?: string;
  autoFetch?: boolean; // Whether to automatically fetch on mount
}

/**
 * Hook to fetch and access products from Redux store
 * Automatically fetches products on mount if not already loaded (when autoFetch is true)
 * 
 * When category is provided, uses /api/products/category/{categoryName} endpoint
 * When no category (All), uses /api/products endpoint
 */
export function useProducts(params?: UseProductsParams) {
  const dispatch = useAppDispatch();
  const { products, pagination, isLoading, error } = useAppSelector((state) => state.products);
  const { categories, isLoading: categoriesLoading } = useAppSelector((state) => state.categories);
  const autoFetch = params?.autoFetch !== false; // Default to true
  
  // Track last fetched params to prevent duplicate calls
  const lastFetchedParams = useRef<string>("");

  useEffect(() => {
    // Don't fetch if already loading or if autoFetch is disabled
    if (!autoFetch || isLoading) {
      return;
    }

    // Create a unique key for current params to detect changes
    const paramsKey = JSON.stringify({
      category: params?.category || "all",
      page: params?.page || 1,
      limit: params?.limit || 100,
      search: params?.search || "",
    });

    // Skip if params haven't changed (prevent duplicate calls)
    if (lastFetchedParams.current === paramsKey) {
      return;
    }

    // If category is provided, use category-specific endpoint
    if (params?.category) {
      // Find category by slug to get the category name
      const categoryData = getCategoryBySlug(categories, params.category);
      if (categoryData) {
        // Use category name for the API endpoint
        lastFetchedParams.current = paramsKey;
        fetchProductsByCategory(dispatch, categoryData.name, params.page, params.limit);
      } else if (categoriesLoading || categories.length === 0) {
        // Categories haven't loaded yet, wait for them
        // The effect will re-run when categories are loaded
        // Don't reset tracking - keep the paramsKey so we don't fetch again
        return;
      } else {
        // Categories loaded but category not found, try with slug as fallback
        // This handles edge cases where slug might work
        lastFetchedParams.current = paramsKey;
        fetchProductsByCategory(dispatch, params.category, params.page, params.limit);
      }
    } else {
      // No category (All) - fetch all products without category param
      lastFetchedParams.current = paramsKey;
      fetchProducts(dispatch, {
        page: params?.page,
        limit: params?.limit,
        search: params?.search,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, params?.category, params?.page, params?.limit, params?.search, autoFetch, categories, categoriesLoading, isLoading]);

  const refetch = () => {
    // Reset tracking to allow refetch
    lastFetchedParams.current = "";
    
    if (params?.category) {
      const categoryData = getCategoryBySlug(categories, params.category);
      if (categoryData) {
        fetchProductsByCategory(dispatch, categoryData.name, params.page, params.limit);
      } else {
        // Fallback: try with slug if category not found
        fetchProductsByCategory(dispatch, params.category, params.page, params.limit);
      }
    } else {
      fetchProducts(dispatch, {
        page: params?.page,
        limit: params?.limit,
        search: params?.search,
      });
    }
  };

  return { products, pagination, isLoading, error, refetch };
}

/**
 * Hook to fetch and access a single product by SKU
 * Uses Redux store to manage product state
 */
export function useProduct(sku: string) {
  const dispatch = useAppDispatch();
  const { currentProduct, isLoading, error } = useAppSelector((state) => state.products);
  const lastFetchedSku = useRef<string>("");
  
  // Check if the current product matches the requested SKU
  const product = currentProduct?.sku === sku ? currentProduct : null;

  useEffect(() => {
    // Don't fetch if already loading, if it's the same SKU already fetched, or if product is already loaded
    if (isLoading || lastFetchedSku.current === sku || (product && product.sku === sku)) {
      return;
    }

    // Fetch product if it's not already loaded or if it's a different product
    if (sku && (!product || product.sku !== sku)) {
      lastFetchedSku.current = sku;
      fetchProductBySku(dispatch, sku);
    }
  }, [dispatch, product, isLoading, sku]);

  const refetch = () => {
    // Reset tracking to allow refetch
    lastFetchedSku.current = "";
    fetchProductBySku(dispatch, sku);
  };

  return { product, isLoading, error, refetch };
}

