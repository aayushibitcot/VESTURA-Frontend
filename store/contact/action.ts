"use server";
import { VALIDATION_ERROR_MESSAGE } from "@/utils/constant";
import { post } from "../serverApiAction/serverApis";
import { API_PATH } from "@/utils/constant";

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const submitContact = async (data: ContactFormData) => {
  try {
    const res = await post(API_PATH.CONTACT, data);
    
    if (!res.success) {
      return {
        message: res.message,
        success: false,
        error: res.error
      };
    }
    
    return {
      message: res.message,
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

