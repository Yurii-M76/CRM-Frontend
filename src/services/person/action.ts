import { TPerson } from "@/types";
import {
  createDataFromApi,
  deleteDataFromApi,
  getAllDataFromApi,
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

export const deletePerson = createAsyncThunk(
  "person/delete",
  async (id: string) =>
    await deleteDataFromApi<{id: string}>("persons", id)
);
