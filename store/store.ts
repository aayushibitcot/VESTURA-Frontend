import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import authReducer from "./auth/reducer";
import userReducer from "./users/reducer";
import categoriesReducer from "./categories/reducer";
import productsReducer from "./products/reducer";
import orderReducer from "./order/reducer";
import contactReducer from "./contact/reducer";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    categories: categoriesReducer,
    products: productsReducer,
    order: orderReducer,
    contact: contactReducer,
  },
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppStore = ReturnType<typeof configureStore>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
