import { createSlice } from "@reduxjs/toolkit";
import { TUser } from "../../utils/types";
import { login, logout } from "./action";
import { deleteCookie, setCookie } from "../../utils/cookie";

export type TInitialState = {
  user: TUser | null;
  isAuthChecked: boolean;
  error?: string | null;
};

const initialState: TInitialState = {
  user: null,
  isAuthChecked: false
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setIsAuthChecked: (state, action) => {
      state.isAuthChecked = action.payload;
    }
  },
  selectors: {
    getUser: (state) => state.user,
    getIsAuthChecked: (state) => state.isAuthChecked
  },
  extraReducers(builder) {
    builder
      // Авторизация
      .addCase(login.pending, (state) => {
        state.error = null;
        state.isAuthChecked = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        setCookie('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        state.isAuthChecked = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.error.message;
        state.isAuthChecked = false;
      })
      
      // Выход
      .addCase(logout.pending, (state) => {
        state.error = null;
        state.isAuthChecked = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        localStorage.removeItem('refreshToken');
        deleteCookie('accessToken');
        state.isAuthChecked = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.error.message;
        state.isAuthChecked = true;
      })
  },
});

export const { setUser, setIsAuthChecked } = userSlice.actions;
export const { getUser, getIsAuthChecked } = userSlice.selectors;
export default userSlice.reducer;
