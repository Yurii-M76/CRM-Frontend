import { TVolunteer } from "@/types";
import {
  createDataFromApi,
  deleteDataFromApi,
  getAllDataFromApi,
} from "@/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createVolunteer = createAsyncThunk(
  "volunteer/create",
  async (data: Partial<TVolunteer>) =>
    await createDataFromApi<TVolunteer>("volunteers", data)
);

export const getAllVolunteers = createAsyncThunk(
  "volunteer/findAll",
  async () => await getAllDataFromApi<TVolunteer[]>("volunteers")
);

export const deleteVolunteer = createAsyncThunk(
  "volunteer/delete",
  async (id: string) =>
    await deleteDataFromApi<{id: string}>("volunteers", id)
);
