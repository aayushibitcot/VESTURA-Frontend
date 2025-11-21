import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

let access_token = null
let refresh_token = null
let user = null
let token = null

access_token = Cookies.get("access_token");
refresh_token = Cookies.get("refresh_token");
token = Cookies.get("token");
user = Cookies.get("user") ? JSON.parse(Cookies.get("user") || "{}") : null;

const initialState: any = {
  access_token: access_token ?? null,
  refresh_token: refresh_token ?? null,
  user: user ?? null,
  token: token ?? null
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state :any, action: PayloadAction<any>) => {
      Cookies.set("access_token", action.payload.access_token);
      Cookies.set("refresh_token", action.payload.refresh_token);
      Cookies.set("token", action.payload.token);
      Cookies.set("user", JSON.stringify(action.payload.user))
      state.access_token = action.payload.access_token;
      state.refresh_token = action.payload.refresh_token;
      state.user = action.payload.user;
      state.token = action.payload.token
      
    },
    updateUser: (state:any, action: PayloadAction<any>) => {
      Cookies.set("user", JSON.stringify({ ...state.user, ...action.payload.user }))
      state.user = { ...state.user, ...action.payload.user };
    },
    logout: (state:any) => {
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      Cookies.remove("user");
      Cookies.remove("token");
      state.access_token = "";
      state.refresh_token = "";
      state.user = "";
      state.token = ""
    },
  }
});
export const { login, updateUser, logout } = authSlice.actions;

export default authSlice.reducer;
