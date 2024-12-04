import { TProject } from "@/types";
import { getAllDataFromApi } from "@/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const findAllProjects = createAsyncThunk(
  "projects/findAll",
  async () => await getAllDataFromApi<TProject[]>("projects")
);
