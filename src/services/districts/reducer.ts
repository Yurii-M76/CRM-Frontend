import { createSlice } from "@reduxjs/toolkit";
import {
  createDistrict,
  deleteDistrict,
  getAllDistricts,
  updateDistrict,
} from "./action";
import { TDistrict } from "@/types/district.types";

type TStatusData = {
  loading: boolean;
  success: boolean;
  error?: string | null;
};

type TInitialState = {
  status: {
    create: TStatusData;
    read: TStatusData;
    update: TStatusData;
    delete: TStatusData;
  };
  items: TDistrict[];
};

const initialState: TInitialState = {
  status: {
    create: {
      loading: false,
      success: false,
    },
    read: {
      loading: false,
      success: false,
    },
    update: {
      loading: false,
      success: false,
    },
    delete: {
      loading: false,
      success: false,
    },
  },
  items: [],
};

export const districtsSlice = createSlice({
  name: "districts",
  initialState,
  reducers: {},
  selectors: {
    getDistrictsStatus: (state) => state.status,
  },
  extraReducers(builder) {
    // create
    builder
      .addCase(createDistrict.pending, (state) => {
        state.status.create = { loading: true, success: false, error: null };
      })
      .addCase(createDistrict.fulfilled, (state, action) => {
        state.status.create = { loading: false, success: true, error: null };
        state.items.push(action.payload);
      })
      .addCase(createDistrict.rejected, (state, action) => {
        state.status.create = {
          loading: false,
          success: false,
          error: action.error.message,
        };
      });

    // find all
    builder
      .addCase(getAllDistricts.pending, (state) => {
        state.status.read = { loading: true, success: false, error: null };
      })
      .addCase(getAllDistricts.fulfilled, (state, action) => {
        state.status.read = { loading: false, success: true, error: null };
        state.items = action.payload;
      })
      .addCase(getAllDistricts.rejected, (state, action) => {
        state.status.read = {
          loading: false,
          success: false,
          error: action.error.message,
        };
      });

    // update
    builder
      .addCase(updateDistrict.pending, (state) => {
        state.status.update = { loading: true, success: false, error: null };
      })
      .addCase(updateDistrict.fulfilled, (state, action) => {
        state.status.update = { loading: false, success: true, error: null };
        const { id, name } = action.payload;
        state.items = state.items.map((item) =>
          item.id === id ? { ...item, name } : item
        );
      })
      .addCase(updateDistrict.rejected, (state, action) => {
        state.status.update = {
          loading: false,
          success: false,
          error: action.error.message,
        };
      });

    // delete
    builder
      .addCase(deleteDistrict.pending, (state) => {
        state.status.delete = { loading: true, success: false, error: null };
      })
      .addCase(deleteDistrict.fulfilled, (state, action) => {
        state.status.delete = { loading: false, success: true, error: null };
        const { id } = action.payload;
        state.items = state.items.filter((item) => item.id !== id);
      })
      .addCase(deleteDistrict.rejected, (state, action) => {
        state.status.delete = {
          loading: false,
          success: false,
          error: action.error.message,
        };
      });
  },
});

export const { getDistrictsStatus } = districtsSlice.selectors;
export default districtsSlice;
