"use client";

import { get } from "../serverApiAction/serverApis";
import { API_PATH, DEFAULT_PAGINATION, VALIDATION_ERROR_MESSAGE } from "@/utils/constant";

export const fetchCategories = async () => {
  try {
    const res = await get(API_PATH.CATEGORIES);
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

export const fetchProductsByCategory = async (categoryName: string,params?: {page?: number,limit?: number}) => {
  try {
    const res = await get(`${API_PATH.PRODUCTS_BY_CATEGORY}/${encodeURIComponent(categoryName)}`, {
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

