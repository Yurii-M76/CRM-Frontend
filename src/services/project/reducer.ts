import { createSlice } from "@reduxjs/toolkit";
import { findAllProjects } from "./action";
import { TProject } from "@/utils/types";

type TInitialState = {
  loading: boolean;
  error?: string | null;
  items: TProject[];
};

const initialState: TInitialState = {
  loading: false,
  error: null,
  items: [],
};

export const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  selectors: {
    getAllProjects: (state) => state.items,
  },
  extraReducers(builder) {
    builder
      .addCase(findAllProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(findAllProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.items = action.payload;
      })
      .addCase(findAllProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// export const {} = nameSlice.actions;
export const { getAllProjects } = projectSlice.selectors;
export default projectSlice;
