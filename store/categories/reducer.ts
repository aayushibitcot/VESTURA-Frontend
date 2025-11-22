import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category } from "@/types/categories";

interface CategoriesState {
  categories: Category[];
  error: string | null;
}

const initialState: CategoriesState = {
  categories: [],
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
    resetCategories: (state: CategoriesState) => {
      state.categories = [];
      state.error = null;
    },
  },
});

export const { setCategories, resetCategories } = categoriesSlice.actions;

export default categoriesSlice.reducer;

