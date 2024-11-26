import { TProject } from "@/types";
import { findDataApi } from "@/utils/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const findAllProjects = createAsyncThunk(
  "projects/findAll",
  async () => await findDataApi<TProject[]>({ path: "projects", method: "GET" })
);
