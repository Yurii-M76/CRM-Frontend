import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createDataFromApi,
  deleteDataFromApi,
  getAllDataFromApi,
  getOneDataFromApi,
  updateDataFromApi,
} from "@/utils";
import { TUser } from "@/types";

export const createUser = createAsyncThunk(
  "users/create",
  async (data: Partial<TUser>) => await createDataFromApi<TUser>("users", data)
);

export const findAllUsers = createAsyncThunk(
  "users/findAll",
  async () => await getAllDataFromApi<TUser[]>("users")
);

export const findOneUser = createAsyncThunk(
  "users/findOne",
  async (id: string) => await getOneDataFromApi<TUser>("users", id)
);

export const updateUser = createAsyncThunk(
  "users/update",
  async ({ id, data }: { id: string; data: Partial<TUser> }) =>
    await updateDataFromApi<TUser>("users", id, data)
);

export const deleteUser = createAsyncThunk(
  "users/delete",
  async (id: string) => await deleteDataFromApi<{ id: string }>("users", id)
);
