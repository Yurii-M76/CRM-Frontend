import {
  deleteVolunteerApi,
  getAllVolunteersApi,
  getOneVolunteerApi,
} from "@/utils/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllVolunteers = createAsyncThunk(
  "volunteer/findAll",
  async () => await getAllVolunteersApi()
);

export const getOneVolunteer = createAsyncThunk(
  "volunteer/findAll",
  async (id: string) => await getOneVolunteerApi(id)
);

// export const updateVolunteer = createAsyncThunk(
//   "volunteer/findAll",
//   async (id: string, data: Partial<TVolunteer>) =>
//     await updateVolunteerApi({ id, data })
// );

export const deleteVolunteer = createAsyncThunk(
  "volunteer/findAll",
  async (id: string) => await deleteVolunteerApi(id)
);
