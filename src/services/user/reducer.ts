import { createSlice } from "@reduxjs/toolkit";
import { login, logout } from "./action";
import { deleteCookie, setCookie } from "../../utils/cookie";

export type TInitialState = {
  isAuthChecked: boolean;
  error?: string | null;
};

const initialState: TInitialState = {
  isAuthChecked: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setIsAuthChecked: (state, action) => {
      state.isAuthChecked = action.payload;
    },
  },
  selectors: {
    getIsAuthChecked: (state) => state.isAuthChecked,
  },
  extraReducers(builder) {
    builder
      // Авторизация
      .addCase(login.pending, (state) => {
        state.error = null;
        state.isAuthChecked = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        setCookie("accessToken", action.payload.accessToken);
        setCookie("refreshToken", action.payload.refreshToken.token);
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
        deleteCookie("accessToken");
        deleteCookie("refreshToken");
        state.isAuthChecked = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.error.message;
        state.isAuthChecked = true;
      })
  },
});

export const { setIsAuthChecked } = userSlice.actions;
export const { getIsAuthChecked } = userSlice.selectors;
export default userSlice;
