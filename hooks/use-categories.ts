"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCategories } from "@/store/actions/categoriesAction";

/**
 * Hook to fetch and access categories from Redux store
 * Automatically fetches categories on mount if not already loaded
 */
export function useCategories() {
  const dispatch = useAppDispatch();
  const { categories, isLoading, error } = useAppSelector((state) => state.categories);
  const hasFetched = useRef<boolean>(false);

  useEffect(() => {
    // Fetch categories if not already loaded and not currently loading
    // Only fetch once per mount
    if (categories.length === 0 && !isLoading && !hasFetched.current) {
      hasFetched.current = true;
      fetchCategories(dispatch);
    }
  }, [dispatch, categories.length, isLoading]);

  const refetch = () => {
    hasFetched.current = false;
    fetchCategories(dispatch);
  };

  return { categories, isLoading, error, refetch };
}

