import { createSlice } from "@reduxjs/toolkit";
import { uploadFile } from "./actions";

type TStatus = {
  loading: boolean;
  success: boolean;
};

type TStatuses = {
  upload: TStatus;
  download: TStatus;
  error: string | undefined;
};

type TInitialState = {
  status: TStatuses;
  data: File | null;
};

const defaultStatus = { loading: false, success: false };
const statusPending = { loading: true, success: false };
const statusFulfilled = { loading: false, success: true };

const initialState: TInitialState = {
  status: {
    upload: defaultStatus,
    download: defaultStatus,
    error: undefined,
  },
  data: null,
};

export const filesSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    resetFilesErrors: (state) => state.status.error = undefined,
  },
  selectors: {
    getStatusFile: (state) => state.status,
  },
  extraReducers(builder) {
    builder
      // upload
      .addCase(uploadFile.pending, (state) => {
        state.status.upload = statusPending;
        state.status.error = undefined;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.status.upload = statusFulfilled;
        state.data = action.payload;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.status.upload = defaultStatus;
        state.status.error = action.error.message;
      });
  },
});

export const { resetFilesErrors } = filesSlice.actions;
export const { getStatusFile } = filesSlice.selectors;
export default filesSlice;
