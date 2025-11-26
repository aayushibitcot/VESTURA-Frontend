import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Order, OrderState } from "@/types/order";

const initialState: OrderState = {
  currentOrder: null,
  isLoading: false,
  error: null,
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setCurrentOrder: (state: OrderState, action: PayloadAction<Order | null>) => {
      state.currentOrder = action.payload;
      state.error = null;
    },
    setLoading: (state: OrderState, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state: OrderState, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state: OrderState) => {
      state.error = null;
    },
    resetOrder: (state: OrderState) => {
      state.currentOrder = null;
      state.error = null;
      state.isLoading = false;
    },
  },
});

export const { setCurrentOrder, setLoading, setError, clearError, resetOrder } = orderSlice.actions;

export default orderSlice.reducer;

