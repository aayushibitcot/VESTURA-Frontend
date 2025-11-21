import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

export interface UserProfile {
  id?: string | number;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  avatar?: string;
  role?: string;
  username?: string;
  isActive?: boolean;
  [key: string]: any;
}

interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

// Get initial user from cookies (synced with auth state)
const getInitialUser = (): UserProfile | null => {
  const userCookie = Cookies.get("user");
  return userCookie ? JSON.parse(userCookie) : null;
};

const initialState: UserState = {
  profile: getInitialUser(),
  isLoading: false,
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateProfile: (state: UserState, action: PayloadAction<UserProfile>) => {
      const updatedProfile = { ...state.profile, ...action.payload };
      state.profile = updatedProfile;
      state.error = null;
      
      // Sync with auth state by updating the user cookie
      // This ensures consistency between auth and user reducers
      const authUser = Cookies.get("user") ? JSON.parse(Cookies.get("user") || "{}") : {};
      const mergedUser = { ...authUser, ...action.payload };
      Cookies.set("user", JSON.stringify(mergedUser));
    },
    setLoading: (state: UserState, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state: UserState, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state: UserState) => {
      state.error = null;
    },
    resetProfile: (state: UserState) => {
      state.profile = null;
      state.error = null;
      state.isLoading = false;
    },
  },
});

export const { updateProfile, setLoading, setError, clearError, resetProfile } = userSlice.actions;

export default userSlice.reducer;

