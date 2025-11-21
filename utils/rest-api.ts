'use client';

import Cookies from 'js-cookie';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

const getApiBaseUrl = (): string => {
  // Use environment variable or default to localhost:4000
  return process.env.NEXT_PUBLIC_REST_API_URL || 'http://localhost:4000';
};

const getAuthHeaders = (): Record<string, string> => {
  const token = Cookies.get('access_token') || Cookies.get('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export const restApiClient = {
  async post<T = any>(
    endpoint: string,
    data: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const baseUrl = getApiBaseUrl();
      const url = `${baseUrl}${endpoint}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          ...options?.headers,
        },
        body: JSON.stringify(data),
        ...options,
      });

      const result = await response.json();

      if (!response.ok) {
        // Extract error message from various possible response formats
        let errorMessage = result.message || result.error || 'Request failed';
        
        // Handle Prisma/database errors more gracefully
        if (typeof errorMessage === 'string') {
          if (errorMessage.includes('Can\'t reach database server') || errorMessage.includes('database server')) {
            errorMessage = 'Unable to connect to the server. Please try again later.';
          } else if (errorMessage.includes('Invalid') && errorMessage.includes('invocation')) {
            errorMessage = 'Server error occurred. Please try again later.';
          }
        }
        
        return {
          success: false,
          message: errorMessage,
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
  },

  async get<T = any>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const baseUrl = getApiBaseUrl();
      const url = `${baseUrl}${endpoint}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          ...getAuthHeaders(),
          ...options?.headers,
        },
        ...options,
      });

      const result = await response.json();

      if (!response.ok) {
        // Extract error message from various possible response formats
        let errorMessage = result.message || result.error || 'Request failed';
        
        // Handle Prisma/database errors more gracefully
        if (typeof errorMessage === 'string') {
          if (errorMessage.includes('Can\'t reach database server') || errorMessage.includes('database server')) {
            errorMessage = 'Unable to connect to the server. Please try again later.';
          } else if (errorMessage.includes('Invalid') && errorMessage.includes('invocation')) {
            errorMessage = 'Server error occurred. Please try again later.';
          }
        }
        
        return {
          success: false,
          message: errorMessage,
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
  },

  async put<T = any>(
    endpoint: string,
    data: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const baseUrl = getApiBaseUrl();
      const url = `${baseUrl}${endpoint}`;

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          ...options?.headers,
        },
        body: JSON.stringify(data),
        ...options,
      });

      const result = await response.json();

      if (!response.ok) {
        // Extract error message from various possible response formats
        let errorMessage = result.message || result.error || 'Request failed';
        
        // Handle Prisma/database errors more gracefully
        if (typeof errorMessage === 'string') {
          if (errorMessage.includes('Can\'t reach database server') || errorMessage.includes('database server')) {
            errorMessage = 'Unable to connect to the server. Please try again later.';
          } else if (errorMessage.includes('Invalid') && errorMessage.includes('invocation')) {
            errorMessage = 'Server error occurred. Please try again later.';
          }
        }
        
        return {
          success: false,
          message: errorMessage,
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
  },
};

