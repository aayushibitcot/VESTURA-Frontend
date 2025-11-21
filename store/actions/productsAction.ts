"use client";
import { AppDispatch } from "../store";
import * as productsReducer from "../reducers/productsReducer";
import { Product, ProductsResponse } from "@/lib/types";

interface FetchProductsParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}

export const fetchProducts = async (
  dispatch: AppDispatch,
  params?: FetchProductsParams
) => {
  try {
    // Set loading state
    dispatch(productsReducer.setLoading(true));
    dispatch(productsReducer.clearError());

    const { restApiClient } = await import('@/utils/rest-api');
    
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString();
    const endpoint = `/api/products${queryString ? `?${queryString}` : ''}`;
    
    const res = await restApiClient.get<ProductsResponse>(endpoint);
    
    if (!res.success) {
      // Extract user-friendly error message
      let errorMessage = res.message || 'Failed to fetch products';
      
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
      data: productsResponse
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

export const fetchProductBySku = async (
  dispatch: AppDispatch,
  sku: string
) => {
  try {
    dispatch(productsReducer.setLoading(true));
    dispatch(productsReducer.clearError());

    const { restApiClient } = await import('@/utils/rest-api');
    
    const res = await restApiClient.get<Product>(`/api/products/${sku}`);
    
    if (!res.success) {
      // Extract user-friendly error message
      let errorMessage = res.message || 'Failed to fetch product';
      
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
    
    // Transform colors if needed (same logic as fetchProducts)
    let product = res.data as Product;
    if (Array.isArray(product.colors) && product.colors.length > 0) {
      const firstColor = product.colors[0];
      if (typeof firstColor === 'string') {
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
    
    // Store the product in Redux state
    dispatch(productsReducer.setCurrentProduct(product));
    dispatch(productsReducer.setLoading(false));
    
    return {
      message: res.message || 'Product fetched successfully',
      success: true,
      data: product
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

