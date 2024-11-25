import { findDataApi } from "@/utils/api";
import { TProject } from "@/utils/types";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const findAllProjects = createAsyncThunk(
  "projects/findAll",
  async () => await findDataApi<TProject[]>({ path: "projects", method: "GET" })
);
