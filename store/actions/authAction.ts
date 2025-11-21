"use client";
import { AppDispatch } from "../store";
import * as authReducer from "../reducers/authReducer";
import { 
  signInAction, 
  forgotPasswordAction, 
  resetPasswordAction, 
  changePasswordAction 
} from "@/utils/graphql/auth/action";
import { SignInInput, SignupFormType } from "@/lib/types";
import { ChangePasswordType } from "@/types/profile";


export const signUp = async (userData: SignupFormType) => {
  try {
    const { restApiClient } = await import('@/utils/rest-api');
    const res = await restApiClient.post('/api/auth/signup', userData);
    
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
      message: err instanceof Error ? err.message : 'An unexpected error occurred',
      success: false
    };
  }
};

export const signIn = async (credentials: SignInInput, dispatch: AppDispatch) => {
  try {
    const { restApiClient } = await import('@/utils/rest-api');
    const res = await restApiClient.post('/api/auth/signin', credentials);
    
    if (!res.success) {
      return {
        message: res.message,
        success: false
      };
    }
    
    // Map API response to match authReducer.login expected format
    // API returns: { success: true, message: "...", data: { token: "...", user: {...} } }
    // Reducer expects: { access_token, refresh_token, token, user }
    const authData = {
      token: res.data?.token || '',
      access_token: res.data?.token || '', // Use token as access_token if no separate access_token
      refresh_token: res.data?.refreshToken || res.data?.refresh_token || '',
      user: res.data?.user || {}
    };
    
    // Dispatch login action to update Redux state and cookies
    dispatch(authReducer.login(authData));
    
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
  dispatch(authReducer.logout());  
}

export const forgotPassword = async (username: string) => {
  try {
    const res = await forgotPasswordAction({ variables: { username } });
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
    const res = await resetPasswordAction({ 
      variables: { 
        code: data.code, 
        newPassword: data.newPassword, 
        username: data.username 
      } 
    });
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

export const changePassword = async (formData: ChangePasswordType) => {
  try {
    const res = await changePasswordAction(formData);
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