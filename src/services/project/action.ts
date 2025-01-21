import { TProject } from "@/types";
import {
  createDataFromApi,
  deleteDataFromApi,
  getAllDataFromApi,
  updateDataFromApi,
} from "@/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";

const path = "projects";

export const findAllProjects = createAsyncThunk(
  "projects/findAll",
  async () => await getAllDataFromApi<TProject[]>(path)
);

export const createProject = createAsyncThunk(
  "project/create",
  async (data: TProject) => await createDataFromApi<TProject>(path, data)
);

export const updateProject = createAsyncThunk(
  "project/update",
  async ({ id, data }: { id: string; data: Partial<TProject> }) =>
    await updateDataFromApi<TProject>(path, id, data)
);

export const deleteProject = createAsyncThunk(
  "project/delete",
  async (id: string) => await deleteDataFromApi<{ id: string }>(path, id)
);
