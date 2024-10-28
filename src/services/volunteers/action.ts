import { createAsyncThunk } from "@reduxjs/toolkit";
import { getVolunteersApi } from "@/utils/api";

export const getVolunteers = createAsyncThunk(
  "volunteers/fetch",
  async () => await getVolunteersApi()
);
