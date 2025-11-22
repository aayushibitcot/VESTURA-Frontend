"use server";

import { cookies } from 'next/headers';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

const getApiBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_REST_API_URL || 'http://localhost:4000';
};

const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value || cookieStore.get('token')?.value;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export const post = async <T = any>(url: string, body: object): Promise<ApiResponse<T>> => {
  try {
    const baseUrl = getApiBaseUrl();
    const fullUrl = `${baseUrl}${url}`;
    const headers = await getAuthHeaders();

    const response = await fetch(fullUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || result.error || 'Request failed',
        error: result.error || 'UNKNOWN_ERROR',
        data: result.data,
      };
    }

    return {
      success: true,
      message: result.message,
      data: result.data || result,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error occurred',
      error: 'NETWORK_ERROR',
    };
  }
};

export const get = async <T = any>(url: string, params?: object): Promise<ApiResponse<T>> => {
  try {
    const baseUrl = getApiBaseUrl();
    let fullUrl = `${baseUrl}${url}`;
    
    // Add query parameters if provided
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        fullUrl += `?${queryString}`;
      }
    }

    const headers = await getAuthHeaders();

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers,
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || result.error || 'Request failed',
        error: result.error || 'UNKNOWN_ERROR',
        data: result.data,
      };
    }

    return {
      success: true,
      message: result.message,
      data: result.data || result,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error occurred',
      error: 'NETWORK_ERROR',
    };
  }
};

export const put = async <T = any>(url: string, body: object): Promise<ApiResponse<T>> => {
  try {
    const baseUrl = getApiBaseUrl();
    const fullUrl = `${baseUrl}${url}`;
    const headers = await getAuthHeaders();

    const response = await fetch(fullUrl, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || result.error || 'Request failed',
        error: result.error || 'UNKNOWN_ERROR',
        data: result.data,
      };
    }

    return {
      success: true,
      message: result.message,
      data: result.data || result,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error occurred',
      error: 'NETWORK_ERROR',
    };
  }
};