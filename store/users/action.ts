"use client";

import { AppDispatch } from "@/store/store";
import * as userReducer from "./reducer";
import * as authReducer from "../auth/reducer";
import { put } from "../serverApiAction/serverApis";

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

