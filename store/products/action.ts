"use server";
import { DEFAULT_PAGINATION, VALIDATION_ERROR_MESSAGE } from "@/utils/constant";
import { AppDispatch } from "../store";
import { productsSlice } from "./reducer";
import { Product } from "@/types/products";
import { get } from "../serverApiAction/serverApis";
import { API_PATH } from "@/utils/constant";

interface FetchProductsParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}

export const fetchProducts = async (dispatch: AppDispatch, params?: FetchProductsParams) => {
  try {
    const res = await get(API_PATH.PRODUCTS, params);
    if (!res.success) {
      return {
        message: res.message,
        success: false
      };
    }
    return {
      message: res.message,
      success: true,
      data: res.data
    };
  } catch (err) {
    return {
      message: err instanceof Error ? err.message : VALIDATION_ERROR_MESSAGE.UNEXPECTED_ERROR,
      success: false
    };
  }
};



export const fetchProductBySku = async (
  dispatch: AppDispatch,
  sku: string
) => {
  try {

    const res = await get(`/api/products/${sku}`);
    
    if (!res.success) {
      let errorMessage = res.message || 'Failed to fetch product';      
      return {
        message: errorMessage,
        success: false
      };
    }
    
    let product = res.data as Product;
    
    dispatch(productsSlice.actions.setCurrentProduct(product));

    return {
      message: res.message || 'Product fetched successfully',
      success: true,
      data: product
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