"use server";
import { VALIDATION_ERROR_MESSAGE } from "@/utils/constant";
import { get } from "../serverApiAction/serverApis";
import { API_PATH } from "@/utils/constant";

export const fetchCart = async () => {
  try {
    const res = await get(API_PATH.CART);
    if (!res.success) {
      return {
        message: res.message || VALIDATION_ERROR_MESSAGE.FAILED_TO_FETCH_CART,
        success: false
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
      success: false
    };
  }
}