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
  FAILED_TO_FETCH_PRODUCTS_BY_CATEGORY: "Failed to fetch products by category",
  PRODUCTS_FETCHED_SUCCESSFULLY: "Products fetched successfully",
  FAILED_TO_FETCH_CATEGORIES: "Failed to fetch categories",
  CATEGORIES_FETCHED_SUCCESSFULLY: "Categories fetched successfully",
  FAILED_TO_FETCH_CART: "Failed to fetch cart",
  CART_FETCHED_SUCCESSFULLY: "Cart fetched successfully",
  FAILED_TO_ADD_TO_CART: "Failed to add item to cart",
  ITEM_ADDED_TO_CART_SUCCESSFULLY: "Item added to cart successfully",
  FAILED_TO_CLEAR_CART: "Failed to clear cart",
  CART_CLEARED_SUCCESSFULLY: "Cart cleared successfully",
  FAILED_TO_REMOVE_CART_ITEM: "Failed to remove item from cart",
  ITEM_REMOVED_FROM_CART_SUCCESSFULLY: "Item removed from cart successfully",
  FAILED_TO_UPDATE_CART_ITEM_QUANTITY: "Failed to update cart item quantity",
  CART_ITEM_QUANTITY_UPDATED_SUCCESSFULLY: "Cart item quantity updated successfully",
  AUTHENTICATION_REQUIRED: "Authentication required. Please login to continue.",
  UNAUTHORIZED_ACCESS: "Unauthorized access. Please login again.",
  PLEASE_SELECT_A_SIZE: "Please select a size",
  PLEASE_SELECT_A_COLOR: "Please select a color",
  FAILED_TO_FETCH_PRODUCT: "Failed to fetch product",
  PRODUCT_FETCHED_SUCCESSFULLY: "Product fetched successfully",
  FAILED_TO_CREATE_ORDER: "Failed to create order",
  ORDER_CREATED_SUCCESSFULLY: "Order created successfully",
  PLEASE_FILL_IN_ALL_REQUIRED_FIELDS_CORRECTLY: "Please fill in all required fields correctly.",
};

// Default pagination
export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 10,
} as const;

export const GAP_OPTIONS = [5, 10, 15, 30];

export const STRONG_PASSWORD_REGEX = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])(?=.{8,})";

export const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-low-high" },
  { label: "Price: High to Low", value: "price-high-low" },
  { label: "Name: A-Z", value: "name-az" },
];

export const  API_PATH = {
  CATEGORIES: "/api/categories",
  PRODUCTS: "/api/products",
  PRODUCTS_BY_CATEGORY: "/api/products/category",
  CART: "/api/cart",
  ADD_TO_CART: "/api/cart/items",
  ORDERS: "/api/orders",

}

export const CONTENTFUL_URL = 
`${process.env.NEXT_PUBLIC_CONTENTFUL_BASE_URL}/spaces/${process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID}/environments/${process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT}/entries?access_token=${process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN}`
