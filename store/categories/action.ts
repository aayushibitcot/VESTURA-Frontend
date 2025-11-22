"use client";

import { get } from "../serverApiAction/serverApis";
import { DEFAULT_PAGINATION } from "@/utils/constant";
import { AppDispatch } from "../store";
import { log } from "console";

export const fetchCategories = async (dispatch: AppDispatch) => {
  try {
    const res = await get('/api/categories');
    console.log('categories',res);
    if (!res.success) {
      return {
        message: res.message || 'Failed to fetch categories',
        success: false
      };
    }
    
    return {
      message: res.message || 'Categories fetched successfully',
      success: true,
      data: res.data
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
    return {
      message: errorMessage,
      success: false
    };
  }
};

export const fetchProductsByCategory = async (dispatch: AppDispatch,categoryName: string,params?: {page?: number,limit?: number}) => {
  try {
    const res = await get(`/api/products/category/${encodeURIComponent(categoryName)}`, {
      page: params?.page?.toString() || DEFAULT_PAGINATION.PAGE.toString(),
      limit: params?.limit?.toString() || DEFAULT_PAGINATION.LIMIT.toString()
    });
    
    if (!res.success) {
      return {
        message: res.message || 'Failed to fetch products by category',
        success: false
      };
    }
    
    if (!res.success) {
      return {
        message: res.message || 'Failed to fetch products by category',
        success: false
      };
    }
    
    return {
      message: res.message || 'Products fetched successfully',
      success: true,
      data: res.data
    };
  } catch (err) {
    let errorMessage = 'An unexpected error occurred';
    
    if (err instanceof Error) {
      if (err.message.includes('fetch') || err.message.includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (err.message.includes('Failed to fetch')) {
        errorMessage = 'Unable to reach the server. Please try again later.';
      } else {
        errorMessage = err.message;
      }
    }
    
    return {
      message: errorMessage,
      success: false
    };
  }
};

