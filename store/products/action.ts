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

export const fetchProductBySku = async ( dispatch: AppDispatch,sku: string) => {
  try {

    const res = await get(API_PATH.PRODUCTS + `/${sku}`);
    
    if (!res.success) {
      let errorMessage = res.message || VALIDATION_ERROR_MESSAGE.FAILED_TO_FETCH_PRODUCT;      
      return {
        message: errorMessage,
        success: false
      };
    }
    
    let product = res.data as Product;
    const relatedProducts = product.relatedProducts || [];
    
    // Ensure sizes and colors are always arrays
    const normalizedProduct = {
      ...product,
      sizes: product.sizes || [],
      colors: product.colors || [],
    };
    
    // Normalize related products to ensure sizes and colors are arrays
    const normalizedRelatedProducts = relatedProducts.map((relatedProduct) => ({
      ...relatedProduct,
      sizes: relatedProduct.sizes || [],
      colors: relatedProduct.colors || [],
    }));
    
    // Remove relatedProducts from product object before storing
    const { relatedProducts: _, ...productWithoutRelated } = normalizedProduct;
    
    dispatch(productsSlice.actions.setCurrentProduct(productWithoutRelated as Product));
    dispatch(productsSlice.actions.setRelatedProducts(normalizedRelatedProducts));

    return {
      message: res.message || VALIDATION_ERROR_MESSAGE.PRODUCT_FETCHED_SUCCESSFULLY,
      success: true,
      data: productWithoutRelated as Product,
      relatedProducts: normalizedRelatedProducts
    };
  } catch (err) {
    let errorMessage = err instanceof Error ? err.message : VALIDATION_ERROR_MESSAGE.UNEXPECTED_ERROR;
    
    return {
      message: errorMessage,
      success: false
    };
  }
};