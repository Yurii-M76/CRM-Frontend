import { createAsyncThunk } from "@reduxjs/toolkit";
import { setIsAuthChecked } from "./reducer";
import { loginUserApi, logoutApi, TLoginData } from "@/utils/api";
import { getCookie } from "@/utils/cookie";

export const checkUserAuth = createAsyncThunk(
  "user/checkUserAuth",
  async (_, { dispatch }) => {
    if (getCookie("accessToken")) {
      dispatch(setIsAuthChecked(true));
    } else {
      dispatch(setIsAuthChecked(false));
    }
  }
);

export const login = createAsyncThunk(
  "user/login",
  async (data: TLoginData) => await loginUserApi(data)
);

export const logout = createAsyncThunk(
  "user/logout",
  async () => await logoutApi()
);
