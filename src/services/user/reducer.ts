import { createSlice } from "@reduxjs/toolkit";
import { getMe, login, logout } from "./action";
import { deleteCookie, setCookie } from "../../utils/cookie";
import { TMe } from "@/types";

type TInitialState = {
  isAuthChecked: boolean;
  error?: string | null;
  user: TMe | null;
};

const initialState: TInitialState = {
  isAuthChecked: false,
  error: null,
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsAuthChecked: (state, action) => {
      state.isAuthChecked = action.payload;
    },
  },
  selectors: {
    getIsAuthChecked: (state) => state.isAuthChecked,
    getMeData: (state) => state.user,
  },
  extraReducers(builder) {
    builder
      // Авторизация
      .addCase(login.pending, (state) => {
        state.isAuthChecked = false;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.error = null;
        setCookie("accessToken", action.payload.accessToken);
        setCookie("refreshToken", action.payload.refreshToken.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.isAuthChecked = false;
        state.error = action.error.message;
      });

    builder
      // Выход
      .addCase(logout.pending, (state) => {
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isAuthChecked = false;
        state.error = null;
        if (action.payload.success) {
          deleteCookie("accessToken");
          deleteCookie("refreshToken");
        }
      })
      .addCase(logout.rejected, (state, action) => {
        state.isAuthChecked = true;
        state.error = action.error.message;
      });

    builder
      // User
      .addCase(getMe.pending, (state) => {
        state.error = null;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.error = null;
        state.user = action.payload;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const { setIsAuthChecked } = authSlice.actions;
export const { getIsAuthChecked, getMeData } = authSlice.selectors;
export default authSlice;
