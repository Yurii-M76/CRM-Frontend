import { createSlice } from "@reduxjs/toolkit";
import { getMe, login, logout } from "./action";
import { deleteCookie, setCookie } from "@/utils/cookie";
import { TUser } from "@/types";

type TInitialState = {
  isLoading: boolean;
  isAuthChecked: boolean;
  error?: string | null;
  user: TUser | null;
};

const initialState: TInitialState = {
  isLoading: false,
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
    getIsLoadinAuth: (state) => state.isLoading,
    getIsAuthChecked: (state) => state.isAuthChecked,
    getMeData: (state) => state.user,
    getAuthErrors: (state) => state.error,
  },
  extraReducers(builder) {
    builder
      // Авторизация
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isAuthChecked = false;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.error = null;
        setCookie("accessToken", action.payload.accessToken);
        setCookie("refreshToken", action.payload.refreshToken.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = false;
        state.error = action.error.message;
      });

    builder
      // Выход
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = false;
        state.error = null;
        if (action.payload.success) {
          deleteCookie("accessToken");
          deleteCookie("refreshToken");
        }
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
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
export const { getIsLoadinAuth, getIsAuthChecked, getMeData, getAuthErrors } =
  authSlice.selectors;
export default authSlice;
