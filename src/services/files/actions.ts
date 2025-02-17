import { createAsyncThunk } from "@reduxjs/toolkit";
import { uploadFileOnApi } from "@/utils";

export const uploadFile = createAsyncThunk(
  "files/upload",
  async (file: File) => await uploadFileOnApi("files/upload", file)
);
