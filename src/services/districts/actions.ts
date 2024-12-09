import { TDistrict } from "@/types/district.types";
import {
  createDataFromApi,
  deleteDataFromApi,
  getAllDataFromApi,
  getOneDataFromApi,
  updateDataFromApi,
} from "@/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";

const path = "districts";

export const createDistrict = createAsyncThunk(
  "district/create",
  async (data: Partial<TDistrict>) =>
    await createDataFromApi<TDistrict>(path, data)
);

export const getAllDistricts = createAsyncThunk(
  "districts/findAll",
  async () => await getAllDataFromApi<TDistrict[]>(path)
);

export const getOneDistrict = createAsyncThunk(
  "district/findOne",
  async (id: string) => await getOneDataFromApi<TDistrict>(path, id)
);

export const updateDistrict = createAsyncThunk(
  "district/update",
  async ({ id, data }: { id: string; data: Partial<TDistrict> }) =>
    updateDataFromApi<TDistrict>(path, id, data)
);

export const deleteDistrict = createAsyncThunk(
  "district/delete",
  async (id: string) => await deleteDataFromApi<{ id: string }>(path, id)
);
