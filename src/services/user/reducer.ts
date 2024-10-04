import { createSlice } from "@reduxjs/toolkit";
import { getMe, login, logout } from "./action";
import { deleteCookie, setCookie } from "../../utils/cookie";
import { TUser } from "../../utils/types";

export type TInitialState = {
  user: TUser | undefined;
  isAuthChecked: boolean;
  error?: string | null;
};

const initialState: TInitialState = {
  user: undefined,
  isAuthChecked: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setMeData: (state, action) => {
      state.user = action.payload;
    },
    setIsAuthChecked: (state, action) => {
      state.isAuthChecked = action.payload;
    },
  },
  selectors: {
    getMeData: (state) => state.user,
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
        localStorage.setItem("refreshToken", action.payload.refreshToken);
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
        state.user = undefined;
        localStorage.removeItem("refreshToken");
        deleteCookie("accessToken");
        state.isAuthChecked = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.error.message;
        state.isAuthChecked = true;
      })

      // Пользователь
      .addCase(getMe.pending, (state) => {
        state.error = null;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.error = action.error.message;
      })
  },
});

export const { setMeData, setIsAuthChecked } = userSlice.actions;
export const { getMeData, getIsAuthChecked } = userSlice.selectors;
export default userSlice;
