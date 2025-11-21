export const PUBLIC_PATH = {
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  CHANGE_PASSWORD: "/change-password",
  HOME: "/",
};

export const PRIVATE_PATH = {
  HOME: "/",
  PROFILE: "/profile",
  MY_ORDERS: "/my-orders",
  CONTACT: "/contact",
  CART: "/cart",
  CHECKOUT: "/checkout",
  ORDERS: "/orders",
  ORDER_DETAILS: "/my-orders/[orderId]",
  SHOP: "/shop",
  PRODUCT: "/product",
  CATEGORY: "/category",
  ORDER_SUCCESS: "/order-success",
}

export const ERROR_PATH = {
  NOT_FOUND: "/not-found",
};

export const ROUTES_PATH = {
  ...PUBLIC_PATH,
  ...PRIVATE_PATH,
  ...ERROR_PATH,
};

export const FIREBASE_QUERY_NAME = {
  ARRAY_CONTAINS: "array-contains",
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER: "user",
};

export const VALIDATION_ERROR_MESSAGE = {
  REQUIRED: " is required",
  INVALID_EMAIL: "Invalid email format",
  REGISTRATION_SUCCESS: "Registration successful",
  REGISTRATION_FAILED: "Registration failed",
  PASSWORD_MIN_LENGTH: "must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.",
  UNEXPECTED_ERROR: "Unexpected error occurred.",
  INVALID_URL: "Invalid URL",
  INVALID_PHONE: "Invalid phone number",
  LOGIN_SUCCESS_DESCRIPTION: "Welcome back to BITCOT!",
  UPDATE_FAILED: "Update failed",
  UPDATE_SUCCESS: "Update successful",
  UPDATE_FAILED_USER_ID_NOT_FOUND: "User ID not found",

};

// Default pagination
export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 10,
} as const;

export const GAP_OPTIONS = [5, 10, 15, 30];

export const STRONG_PASSWORD_REGEX = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])(?=.{8,})";