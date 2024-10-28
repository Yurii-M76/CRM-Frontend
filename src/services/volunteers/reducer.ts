import { TVolunteer } from "@/utils/types";
import { createSlice } from "@reduxjs/toolkit";
import { getVolunteers } from "./action";

type TInitialState = {
  loading: boolean;
  count: number;
  items: TVolunteer[];
  error?: string | null;
};

const initialState: TInitialState = {
  loading: false,
  count: 0,
  items: [],
};

export const VolunteerSlice = createSlice({
  name: "volunteer",
  initialState,
  reducers: {},
  selectors: {
    getAllVolunteers: (state) => state.items,
    getVoluntreesLoading: (state) => state.loading,
  },
  extraReducers(builder) {
    builder
      .addCase(getVolunteers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVolunteers.fulfilled, (state, action) => {
        state.loading = false;
        state.count = action.payload.count;
        state.items = action.payload.items;
        state.error = null;
      })
      .addCase(getVolunteers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { getAllVolunteers, getVoluntreesLoading } =
  VolunteerSlice.selectors;
export default VolunteerSlice;
