import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ContactState {
  isLoading: boolean;
  error: string | null;
  isSubmitted: boolean;
}

const initialState: ContactState = {
  isLoading: false,
  error: null,
  isSubmitted: false,
};

export const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    setLoading: (state: ContactState, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state: ContactState, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSubmitted: (state: ContactState, action: PayloadAction<boolean>) => {
      state.isSubmitted = action.payload;
    },
    clearError: (state: ContactState) => {
      state.error = null;
    },
    resetContact: (state: ContactState) => {
      state.error = null;
      state.isLoading = false;
      state.isSubmitted = false;
    },
  },
});

export const { setLoading, setError, setSubmitted, clearError, resetContact } = contactSlice.actions;

export default contactSlice.reducer;

