"use client";

import { get } from "../serverApiAction/serverApis";
import { DEFAULT_PAGINATION, VALIDATION_ERROR_MESSAGE } from "@/utils/constant";
import { AppDispatch } from "../store";

export const fetchCategories = async (dispatch: AppDispatch) => {
  try {
    const res = await get('/api/categories');
    if (!res.success) {
      return {
        message: res.message || VALIDATION_ERROR_MESSAGE.FAILED_TO_FETCH_CATEGORIES,
        success: false
      };
    }
    
    return {
      message: res.message || VALIDATION_ERROR_MESSAGE.CATEGORIES_FETCHED_SUCCESSFULLY,
      success: true,
      data: res.data
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : VALIDATION_ERROR_MESSAGE.UNEXPECTED_ERROR;
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
        message: res.message || VALIDATION_ERROR_MESSAGE.FAILED_TO_FETCH_PRODUCTS_BY_CATEGORY,
        success: false
      };
    }
    return {
        message: res.message || VALIDATION_ERROR_MESSAGE.PRODUCTS_FETCHED_SUCCESSFULLY,
        success: true,
      data: res.data
    };
  } catch (err) {
    let errorMessage = VALIDATION_ERROR_MESSAGE.UNEXPECTED_ERROR;
    if (err instanceof Error) {
      errorMessage = err.message;
    }
    return {
      message: errorMessage,
      success: false
    };
  }
};

