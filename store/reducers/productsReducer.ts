import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product, ProductsResponse } from "@/lib/types";

interface ProductsState {
  products: Product[];
  currentProduct: Product | null; // Store the currently viewed product
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  currentProduct: null,
  pagination: null,
  isLoading: false,
  error: null,
};

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state: ProductsState, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
      state.error = null;
    },
    setProductsWithPagination: (state: ProductsState, action: PayloadAction<ProductsResponse>) => {
      state.products = action.payload.products;
      if (action.payload.pagination) {
        state.pagination = action.payload.pagination;
      }
      state.error = null;
    },
    setLoading: (state: ProductsState, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state: ProductsState, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state: ProductsState) => {
      state.error = null;
    },
    setCurrentProduct: (state: ProductsState, action: PayloadAction<Product | null>) => {
      state.currentProduct = action.payload;
      state.error = null;
    },
    resetProducts: (state: ProductsState) => {
      state.products = [];
      state.currentProduct = null;
      state.pagination = null;
      state.error = null;
      state.isLoading = false;
    },
  },
});

export const { setProducts, setProductsWithPagination, setCurrentProduct, setLoading, setError, clearError, resetProducts } = productsSlice.actions;

export default productsSlice.reducer;

