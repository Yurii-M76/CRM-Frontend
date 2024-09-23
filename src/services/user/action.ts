import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginUserApi, logoutApi, TLoginData } from "../../utils/api";
import { setIsAuthChecked } from "./reducer";

export const checkUserAuth = createAsyncThunk(
  "user/checkUserAuth",
  async (_, { dispatch }) => {
    if (localStorage.getItem("refreshToken")) {
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
