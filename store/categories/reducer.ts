import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category, CategoriesResponse } from "@/types/categories";

interface CategoriesState {
  categories: Category[]; 
  pagination: {
    page: number;
    limit: number;
    total?: number;
    totalPages?: number;
  } | null;
  error: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  pagination: null,
  error: null,
};

export const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategories: (state: CategoriesState, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
      state.pagination = null;
      state.error = null;
    },
    setCategoriesWithPagination: (state: CategoriesState, action: PayloadAction<CategoriesResponse>) => {
      state.categories = action.payload.categories;
      state.pagination = action.payload.pagination || null;
      state.error = null;
    },
  },
});
export const { setCategories, setCategoriesWithPagination } = categoriesSlice.actions;
export default categoriesSlice.reducer;
