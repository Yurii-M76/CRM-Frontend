import { createAsyncThunk } from "@reduxjs/toolkit";
import { getMeApi, loginUserApi, logoutUserApi } from "../../utils/api";
import { TLoginData } from "@/types";

export const login = createAsyncThunk(
  "auth/login",
  async (data: TLoginData) => await loginUserApi(data)
);

export const logout = createAsyncThunk(
  "auth/logout",
  async () => await logoutUserApi()
);

export const getMe = createAsyncThunk(
  "user/me",
  async (id: string) => await getMeApi(id)
);
