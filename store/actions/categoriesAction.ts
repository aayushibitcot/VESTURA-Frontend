"use client";
import { AppDispatch } from "../store";
import * as categoriesReducer from "../reducers/categoriesReducer";
import * as productsReducer from "../reducers/productsReducer";
import { Category, Product, ProductsResponse } from "@/lib/types";

export const fetchCategories = async (dispatch: AppDispatch) => {
  try {
    // Set loading state
    dispatch(categoriesReducer.setLoading(true));
    dispatch(categoriesReducer.clearError());

    const { restApiClient } = await import('@/utils/rest-api');
    
    const res = await restApiClient.get<Category[]>('/api/categories');
    
    if (!res.success) {
      dispatch(categoriesReducer.setError(res.message || 'Failed to fetch categories'));
      dispatch(categoriesReducer.setLoading(false));
      return {
        message: res.message || 'Failed to fetch categories',
        success: false
      };
    }
    
    // Update Redux state with categories
    dispatch(categoriesReducer.setCategories(res.data || []));
    dispatch(categoriesReducer.setLoading(false));
    
    return {
      message: res.message || 'Categories fetched successfully',
      success: true,
      data: res.data
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
    dispatch(categoriesReducer.setError(errorMessage));
    dispatch(categoriesReducer.setLoading(false));
    return {
      message: errorMessage,
      success: false
    };
  }
};

export const fetchProductsByCategory = async (
  dispatch: AppDispatch,
  categoryName: string,
  page?: number,
  limit?: number
) => {
  try {
    // Set loading state for products
    dispatch(productsReducer.setLoading(true));
    dispatch(productsReducer.clearError());

    const { restApiClient } = await import('@/utils/rest-api');
    
    // Build query params for pagination
    const queryParams = new URLSearchParams();
    if (page) queryParams.append('page', page.toString());
    if (limit) queryParams.append('limit', limit.toString());
    
    const queryString = queryParams.toString();
    const endpoint = `/api/products/category/${encodeURIComponent(categoryName)}${queryString ? `?${queryString}` : ''}`;
    
    const res = await restApiClient.get<{
      products: Product[];
      pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
      category?: {
        id: string;
        name: string;
      };
    }>(endpoint);
    
    if (!res.success) {
      // Extract user-friendly error message
      let errorMessage = res.message || 'Failed to fetch products by category';
      
      // Handle database connection errors more gracefully
      if (errorMessage.includes('Can\'t reach database server') || errorMessage.includes('database server')) {
        errorMessage = 'Unable to connect to the server. Please try again later.';
      } else if (errorMessage.includes('Invalid') && errorMessage.includes('invocation')) {
        errorMessage = 'Server error occurred. Please try again later.';
      }
      
      dispatch(productsReducer.setError(errorMessage));
      dispatch(productsReducer.setLoading(false));
      return {
        message: errorMessage,
        success: false
      };
    }
    
    // Transform colors from string array to object array if needed
    const transformedProducts: Product[] = (res.data?.products || []).map(product => {
      // If colors is a string array, convert to object array format
      if (Array.isArray(product.colors) && product.colors.length > 0) {
        const firstColor = product.colors[0];
        if (typeof firstColor === 'string') {
          // Convert string array to object array with default hex values
          const colorMap: Record<string, string> = {
            'White': '#ffffff',
            'Black': '#000000',
            'Navy': '#1e3a5f',
            'Grey': '#808080',
            'Heather Grey': '#b5b5b5',
            'Red': '#ff0000',
            'Blue': '#0000ff',
            'Brown': '#8b4513',
            'Tan': '#d2b48c',
            'Off-White': '#faf9f6',
            'Burgundy': '#800020',
            'Forest Green': '#228b22',
            'Olive': '#808000',
            'Cream': '#fffdd0',
            'Beige': '#f5f5dc',
            'Charcoal': '#36454f',
            'Camel': '#c19a6b',
            'Dark Wash': '#1c2841',
            'Medium Wash': '#5b7c99',
            'Light Wash': '#a4c8e1',
            'Dark Indigo': '#1c2841',
            'Vintage Blue': '#6a8caf',
            'Ecru': '#c2b280',
            'Navy/White': '#1e3a5f',
            'Black/Grey': '#36454f',
            'Red/White': '#dc143c',
          };
          
          product.colors = (product.colors as string[]).map(colorName => ({
            name: colorName,
            hex: colorMap[colorName] || '#000000'
          }));
        }
      }
      return product;
    });
    
    // Update Redux state with products and pagination
    const productsResponse: ProductsResponse = {
      products: transformedProducts,
      pagination: res.data?.pagination
    };
    
    dispatch(productsReducer.setProductsWithPagination(productsResponse));
    dispatch(productsReducer.setLoading(false));
    
    return {
      message: res.message || 'Products fetched successfully',
      success: true,
      data: {
        products: productsResponse,
        category: res.data?.category
      }
    };
  } catch (err) {
    let errorMessage = 'An unexpected error occurred';
    
    if (err instanceof Error) {
      // Handle network errors
      if (err.message.includes('fetch') || err.message.includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (err.message.includes('Failed to fetch')) {
        errorMessage = 'Unable to reach the server. Please try again later.';
      } else {
        errorMessage = err.message;
      }
    }
    
    dispatch(productsReducer.setError(errorMessage));
    dispatch(productsReducer.setLoading(false));
    return {
      message: errorMessage,
      success: false
    };
  }
};

