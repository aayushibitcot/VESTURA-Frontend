import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product, ProductsResponse } from "@/types/products";

interface ProductsState {
  products: Product[];
  currentProduct: Product | null;
  relatedProducts: Product[];
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
  relatedProducts: [],
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
      state.pagination = action.payload.pagination || null;
      state.error = null;
    },
    setCurrentProduct: (state: ProductsState, action: PayloadAction<Product | null>) => {
      state.currentProduct = action.payload;
      state.error = null;
    },
    setRelatedProducts: (state: ProductsState, action: PayloadAction<Product[]>) => {
      state.relatedProducts = action.payload;
      state.error = null;
    },
    resetProducts: (state: ProductsState) => {
      state.products = [];
      state.currentProduct = null;
      state.relatedProducts = [];
      state.pagination = null;
      state.error = null;
      state.isLoading = false;
    },
  },
});

export const { setProducts, setProductsWithPagination, setCurrentProduct, setRelatedProducts, resetProducts } = productsSlice.actions;

export default productsSlice.reducer;

