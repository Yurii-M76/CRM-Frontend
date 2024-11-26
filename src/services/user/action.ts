import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getMeApi,
  loginUserApi,
  logoutUserApi,
} from "../../utils/api";
import { getCookie } from "../../utils/cookie";
import { setIsAuthChecked } from "./reducer";
import { TLoginData } from "@/types";

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
  "auth/login",
  async (data: TLoginData) => await loginUserApi(data)
);

export const logout = createAsyncThunk(
  "auth/logout",
  async () => await logoutUserApi()
);

export const getMe = createAsyncThunk("user/me", async () => await getMeApi());
