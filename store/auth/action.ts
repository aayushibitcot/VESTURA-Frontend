"use client";
import { AppDispatch } from "@/store/store";
import { authSlice } from "./reducer";
import { SignInInput, SignupFormType } from "@/types/authType";
import { VALIDATION_ERROR_MESSAGE } from "@/utils/constant";
import { post } from "../serverApiAction/serverApis";

export const signUp = async (userData: SignupFormType) => {
  try {
    const res = await post('/api/auth/signup', userData);
    
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

export const signIn = async (credentials: SignInInput, dispatch: AppDispatch) => {
  const data = {
    email : (credentials.email).toLowerCase(),
    password : credentials.password}

  try {
    const res = await post('/api/auth/signin', data);
    if (!res.success) {
      return {
        message: res.message,
        success: false
      };
    }
    const responseData = res.data || res;
    const token = responseData?.token;
    const user = responseData?.user;
    
    const finalToken = token;
    if (finalToken) {
      dispatch(authSlice.actions.login({ token: finalToken, user: user || {}, access_token: finalToken }));
    } else {
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
      message: err instanceof Error ? err.message : 'An unexpected error occurred',
      success: false
    };
  }
};

export const appLogout = async (dispatch: AppDispatch) => {
  dispatch(authSlice.actions.logout());  
}

export const forgotPassword = async (username: string) => {
  try {
    const res = await post('/api/auth/forgot-password', { username });
    if (typeof res === "string") {
      return {
        message: res,
        success: false
      };
    }
    return res;
  } catch (err) {
    return {
      message: err as string,
      success: false
    };
  }
};

export const resetPassword = async (data: { code: string; newPassword: string; username: string }) => {
  try {
    const res = await post('/api/auth/reset-password', data);
    if (typeof res === "string") {
      return {
        message: res,
        success: false
      };
    }
    return res;
  } catch (err) {
    return {
      message: err as string,
      success: false
    };
  }
};

export const changePassword = async (formData: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
  try {
    const res = await post('/api/auth/change-password', formData);
    if (typeof res === "string") {
      return {
        message: res,
        success: false
      };
    }
    return res;
  } catch (err) {
    return {
      message: err as string,
      success: false
    };
  }
};