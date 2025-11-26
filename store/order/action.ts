"use server";
import { VALIDATION_ERROR_MESSAGE } from "@/utils/constant";
import { post, get } from "../serverApiAction/serverApis";
import { API_PATH } from "@/utils/constant";
import { cookies } from "next/headers";
import { CreateOrderParams, OrderResponse, Order, OrdersListResponse } from "@/types/order";

const isAuthenticated = async (): Promise<boolean> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value || cookieStore.get('access_token')?.value;
    return !!token;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

export const createOrder = async (params: CreateOrderParams): Promise<OrderResponse> => {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return {
        message: VALIDATION_ERROR_MESSAGE.AUTHENTICATION_REQUIRED,
        success: false,
        error: 'UNAUTHORIZED'
      };
    }

    const res = await post(API_PATH.ORDERS, params);
    console.log('response', res);
    if (res.error === 'UNAUTHORIZED' || res.message?.toLowerCase().includes('unauthorized')) {
      return {
        message: VALIDATION_ERROR_MESSAGE.UNAUTHORIZED_ACCESS,
        success: false,
        error: 'UNAUTHORIZED'
      };
    }

    if (!res.success) {
      return {
        message: res.message || VALIDATION_ERROR_MESSAGE.FAILED_TO_CREATE_ORDER,
        success: false,
        error: res.error
      };
    }
    
    return {
      message: res.message || VALIDATION_ERROR_MESSAGE.ORDER_CREATED_SUCCESSFULLY,
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

export const getOrderById = async (orderId: string): Promise<OrderResponse> => {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return {
        message: VALIDATION_ERROR_MESSAGE.AUTHENTICATION_REQUIRED,
        success: false,
        error: 'UNAUTHORIZED'
      };
    }

    const res = await get(`${API_PATH.ORDERS}/${orderId}`);
    
    if (res.error === 'UNAUTHORIZED' || res.message?.toLowerCase().includes('unauthorized')) {
      return {
        message: VALIDATION_ERROR_MESSAGE.UNAUTHORIZED_ACCESS,
        success: false,
        error: 'UNAUTHORIZED'
      };
    }

    if (!res.success) {
      return {
        message: res.message || "Failed to fetch order",
        success: false,
        error: res.error
      };
    }
    
    return {
      message: res.message || "Order fetched successfully",
      success: true,
      data: res.data as Order
    };
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : VALIDATION_ERROR_MESSAGE.UNEXPECTED_ERROR,
      success: false,
      error: 'UNEXPECTED_ERROR'
    };
  }
}

export interface GetOrdersParams {
  page?: number;
  limit?: number;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const getOrders = async (params?: GetOrdersParams): Promise<OrdersListResponse> => {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return {
        message: VALIDATION_ERROR_MESSAGE.AUTHENTICATION_REQUIRED,
        success: false,
        error: 'UNAUTHORIZED'
      };
    }

    const queryParams: Record<string, string> = {};
    if (params?.page) queryParams.page = String(params.page);
    if (params?.limit) queryParams.limit = String(params.limit);
    if (params?.status) queryParams.status = params.status;
    if (params?.sortBy) queryParams.sortBy = params.sortBy;
    if (params?.sortOrder) queryParams.sortOrder = params.sortOrder;

    const res = await get(API_PATH.ORDERS, queryParams);
    
    if (res.error === 'UNAUTHORIZED' || res.message?.toLowerCase().includes('unauthorized')) {
      return {
        message: VALIDATION_ERROR_MESSAGE.UNAUTHORIZED_ACCESS,
        success: false,
        error: 'UNAUTHORIZED'
      };
    }

    if (!res.success) {
      return {
        message: res.message || "Failed to fetch orders",
        success: false,
        error: res.error
      };
    }
    
    return {
      message: res.message || "Orders fetched successfully",
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

