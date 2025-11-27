"use client";

import { AppDispatch } from "@/store/store";
import * as userReducer from "./reducer";
import * as authReducer from "../auth/reducer";
import { put } from "@/store/serverApiAction/serverApis";
import Cookies from "js-cookie";
import { config } from "@/utils/config";

export interface UpdateUserProfileData {
  firstName: string;
  lastName: string;
  phone: string;
  avatar?: string;
}

export interface UpdateUserProfileResponse {
  success: boolean;
  message?: string;
  data?: {
    user?: any;
  };
}

export interface UploadImageResponse {
  success: boolean;
  message?: string;
  data?: {
    image?: string;
  };
}

const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return Cookies.get('access_token') || Cookies.get('token') || null;
};

export const uploadImage = async (file: File): Promise<UploadImageResponse> => {
  try {
    const baseUrl = config.REST_API_URL;
    const fullUrl = `${baseUrl}/api/image/image-upload`;
    
    const formData = new FormData();
    formData.append('image', file);

    const token = getAuthToken();
    const headers: Record<string, string> = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(fullUrl, {
      method: 'POST',
      headers,
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || result.error || 'Failed to upload image',
        data: result.data,
      };
    }

    return {
      success: true,
      message: result.message || 'Image uploaded successfully',
      data: result.data || result,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error occurred while uploading image',
    };
  }
};

export const updateUserProfile = async (userId: string | number, userData: UpdateUserProfileData, dispatch: AppDispatch): 
  Promise<UpdateUserProfileResponse> => {
  try {
    const payload = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      avatar: userData.avatar,
    };
    
    const res = await put(`/api/users/${userId}`, payload);

    if (!res.success) {
      return { success: false, message: res.message || "Failed to update user profile" };
    }

    const updatedUser = res.data?.user || res.data;

    if (updatedUser) {
      const profileData = {
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        phone: updatedUser.phone,
        email: updatedUser.email,
        username: updatedUser.username,
        role: updatedUser.role,
        isActive: updatedUser.isActive,
        avatar: updatedUser.avatar || null,
      };

      dispatch(userReducer.updateProfile(profileData));
      dispatch(authReducer.updateUser({ user: profileData }));
    }

    return {
      success: true,
      message: res.message || "User updated successfully",
      data: res.data,
    };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "An unexpected error occurred",
    };
  }
};

