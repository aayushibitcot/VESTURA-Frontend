import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category } from "@/lib/types";

interface CategoriesState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  isLoading: false,
  error: null,
};

export const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategories: (state: CategoriesState, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
      state.error = null;
    },
    setLoading: (state: CategoriesState, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state: CategoriesState, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state: CategoriesState) => {
      state.error = null;
    },
    resetCategories: (state: CategoriesState) => {
      state.categories = [];
      state.error = null;
      state.isLoading = false;
    },
  },
});

export const { setCategories, setLoading, setError, clearError, resetCategories } = categoriesSlice.actions;

export default categoriesSlice.reducer;

