"use server";
import { VALIDATION_ERROR_MESSAGE } from "@/utils/constant";
import { get, post, del, put } from "../serverApiAction/serverApis";
import { API_PATH } from "@/utils/constant";
import { cookies } from "next/headers";
import { AddToCartParams } from "@/types/cart";

const isAuthenticated = async (): Promise<boolean> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    return !!token;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

export const fetchCart = async () => {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return {
        message: VALIDATION_ERROR_MESSAGE.AUTHENTICATION_REQUIRED,
        success: false,
        error: 'UNAUTHORIZED'
      };
    }

    const res = await get(API_PATH.CART);
    
    if (res.error === 'UNAUTHORIZED' || res.message?.toLowerCase().includes('unauthorized')) {
      return {
        message: VALIDATION_ERROR_MESSAGE.UNAUTHORIZED_ACCESS,
        success: false,
        error: 'UNAUTHORIZED'
      };
    }

    if (!res.success) {
      return {
        message: res.message || VALIDATION_ERROR_MESSAGE.FAILED_TO_FETCH_CART,
        success: false,
        error: res.error
      };
    }
    return {
      message: res.message || VALIDATION_ERROR_MESSAGE.CART_FETCHED_SUCCESSFULLY,
      success: true,
      data: res.data
    };
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : VALIDATION_ERROR_MESSAGE.UNEXPECTED_ERROR,
      success: false,
      error: 'UNEXPECTED_ERROR'
    };
  }
}

export const addToCart = async (params: AddToCartParams) => {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return {
        message: VALIDATION_ERROR_MESSAGE.AUTHENTICATION_REQUIRED,
        success: false,
        error: 'UNAUTHORIZED'
      };
    }

    const res = await post(API_PATH.ADD_TO_CART, params);
    
    if (res.error === 'UNAUTHORIZED' || res.message?.toLowerCase().includes('unauthorized')) {
      return {
        message: VALIDATION_ERROR_MESSAGE.UNAUTHORIZED_ACCESS,
        success: false,
        error: 'UNAUTHORIZED'
      };
    }

    if (!res.success) {
      return {
        message: res.message || VALIDATION_ERROR_MESSAGE.FAILED_TO_ADD_TO_CART,
        success: false,
        error: res.error
      };
    }
    return {
      message: res.message || VALIDATION_ERROR_MESSAGE.ITEM_ADDED_TO_CART_SUCCESSFULLY,
      success: true,
      data: res.data
    };
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : VALIDATION_ERROR_MESSAGE.UNEXPECTED_ERROR,
      success: false,
      error: 'UNEXPECTED_ERROR'
    };
  }
}

export const clearCart = async () => {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return {
        message: VALIDATION_ERROR_MESSAGE.AUTHENTICATION_REQUIRED,
        success: false,
        error: 'UNAUTHORIZED'
      };
    }

    const res = await del(API_PATH.CART);
    
    if (res.error === 'UNAUTHORIZED' || res.message?.toLowerCase().includes('unauthorized')) {
      return {
        message: VALIDATION_ERROR_MESSAGE.UNAUTHORIZED_ACCESS,
        success: false,
        error: 'UNAUTHORIZED'
      };
    }

    if (!res.success) {
      return {
        message: res.message || VALIDATION_ERROR_MESSAGE.FAILED_TO_CLEAR_CART,
        success: false,
        error: res.error
      };
    }
    return {
      message: res.message || VALIDATION_ERROR_MESSAGE.CART_CLEARED_SUCCESSFULLY,
      success: true,
      data: res.data
    };
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : VALIDATION_ERROR_MESSAGE.UNEXPECTED_ERROR,
      success: false,
      error: 'UNEXPECTED_ERROR'
    };
  }
}

export const removeCartItem = async (itemId: string) => {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return {
        message: VALIDATION_ERROR_MESSAGE.AUTHENTICATION_REQUIRED,
        success: false,
        error: 'UNAUTHORIZED'
      };
    }

    const res = await del(`${API_PATH.ADD_TO_CART}/${itemId}`);
    
    if (res.error === 'UNAUTHORIZED' || res.message?.toLowerCase().includes('unauthorized')) {
      return {
        message: VALIDATION_ERROR_MESSAGE.UNAUTHORIZED_ACCESS,
        success: false,
        error: 'UNAUTHORIZED'
      };
    }

    if (!res.success) {
      return {
        message: res.message || VALIDATION_ERROR_MESSAGE.FAILED_TO_REMOVE_CART_ITEM,
        success: false,
        error: res.error
      };
    }
    return {
      message: res.message || VALIDATION_ERROR_MESSAGE.ITEM_REMOVED_FROM_CART_SUCCESSFULLY,
      success: true,
      data: res.data
    };
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : VALIDATION_ERROR_MESSAGE.UNEXPECTED_ERROR,
      success: false,
      error: 'UNEXPECTED_ERROR'
    };
  }
}

export const updateCartItemQuantity = async (itemId: string, quantity: number) => {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return {
        message: VALIDATION_ERROR_MESSAGE.AUTHENTICATION_REQUIRED,
        success: false,
        error: 'UNAUTHORIZED'
      };
    }

    if (quantity < 1) {
      return {
        message: "Quantity must be at least 1",
        success: false,
        error: 'INVALID_QUANTITY'
      };
    }

    const res = await put(`${API_PATH.ADD_TO_CART}/${itemId}`, { quantity });
    
    if (res.error === 'UNAUTHORIZED' || res.message?.toLowerCase().includes('unauthorized')) {
      return {
        message: VALIDATION_ERROR_MESSAGE.UNAUTHORIZED_ACCESS,
        success: false,
        error: 'UNAUTHORIZED'
      };
    }

    if (!res.success) {
      return {
        message: res.message || VALIDATION_ERROR_MESSAGE.FAILED_TO_UPDATE_CART_ITEM_QUANTITY,
        success: false,
        error: res.error
      };
    }
    return {
      message: res.message || VALIDATION_ERROR_MESSAGE.CART_ITEM_QUANTITY_UPDATED_SUCCESSFULLY,
      success: true,
      data: res.data
    };
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : VALIDATION_ERROR_MESSAGE.UNEXPECTED_ERROR,
      success: false,
      error: 'UNEXPECTED_ERROR'
    };
  }
}