import { TPerson } from "@/types";
import {
  createDataFromApi,
  deleteDataFromApi,
  getAllDataFromApi,
  updateDataFromApi,
} from "@/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createPerson = createAsyncThunk(
  "person/create",
  async (data: Partial<TPerson>) =>
    await createDataFromApi<TPerson>("persons", data)
);

export const getAllPersons = createAsyncThunk(
  "person/findAll",
  async () => await getAllDataFromApi<TPerson[]>("persons")
);

export const updatePerson = createAsyncThunk(
  "person/update",
  async ({ id, data }: { id: string; data: Partial<TPerson> }) =>
    await updateDataFromApi<TPerson>("persons", id, data)
);

export const deletePerson = createAsyncThunk(
  "person/delete",
  async (id: string) =>
    await deleteDataFromApi<{id: string}>("persons", id)
);
