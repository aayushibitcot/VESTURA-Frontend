import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

let access_token = null
let refresh_token = null
let user = null
let token = null

access_token = Cookies.get("access_token");
refresh_token = Cookies.get("refresh_token");
token = Cookies.get("token");
const userCookie = Cookies.get("user");
if (userCookie && userCookie !== "undefined" && userCookie !== "null") {
  try {
    user = JSON.parse(userCookie);
  } catch (error) {
    console.error("Error parsing user cookie:", error);
    user = null;
  }
} else {
  user = null;
}

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
      Cookies.set("token", action.payload.token);
      Cookies.set("user", JSON.stringify(action.payload.user))

      state.user = action.payload.user;
      state.token = action.payload.token
      
    },
    updateUser: (state:any, action: PayloadAction<any>) => {
      Cookies.set("user", JSON.stringify({ ...state.user, ...action.payload.user }))
      state.user = { ...state.user, ...action.payload.user };
    },
    logout: (state:any) => {
      Cookies.remove("user");
      Cookies.remove("token");
      state.user = "";
      state.token = ""
    },
  }
});
export const { login, updateUser, logout } = authSlice.actions;

export default authSlice.reducer;
