import { createSlice } from "@reduxjs/toolkit";
import {
  createUser,
  deleteUser,
  findAllUsers,
  findOneUser,
  updateUser,
} from "./actions";
import { TUser } from "@/types";

type TStatus = {
  loading: boolean;
  success: boolean;
};

type TStatuses = {
  create: TStatus;
  read: TStatus;
  update: TStatus;
  delete: TStatus;
};

type TInitialState = {
  status: TStatuses;
  error?: string | null;
  items: TUser[];
};

const defaultStatus = { loading: false, success: false };
const statusPending = { loading: true, success: false };
const statusFulfilled = { loading: false, success: true };

const initialState: TInitialState = {
  status: {
    create: defaultStatus,
    read: defaultStatus,
    update: defaultStatus,
    delete: defaultStatus,
  },
  error: null,
  items: [],
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  selectors: {
    getStatusUsers: (state) => state.status,
    getUsers: (state) => state.items,
  },
  extraReducers(builder) {
    builder
      // create
      .addCase(createUser.pending, (state) => {
        state.status.create = statusPending;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.status.create = statusFulfilled;
        state.error = null;
        state.items = [...state.items, action.payload];
      })
      .addCase(createUser.rejected, (state, action) => {
        state.status.create = defaultStatus;
        state.error = action.error.message;
      });

    builder
      // find all
      .addCase(findAllUsers.pending, (state) => {
        state.status.read = statusPending;
        state.error = null;
      })
      .addCase(findAllUsers.fulfilled, (state, action) => {
        state.status.read = statusFulfilled;
        state.error = null;
        state.items = action.payload;
      })
      .addCase(findAllUsers.rejected, (state, action) => {
        state.status.read = defaultStatus;
        state.error = action.error.message;
      });

    builder
      // find one
      .addCase(findOneUser.pending, (state) => {
        state.status.read = statusPending;
        state.error = null;
      })
      .addCase(findOneUser.fulfilled, (state, action) => {
        state.status.read = statusFulfilled;
        state.error = null;
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        } else {
          state.items = [...state.items, action.payload];
        }
      })
      .addCase(findOneUser.rejected, (state, action) => {
        state.status.read = defaultStatus;
        state.error = action.error.message;
      });

    builder
      // update
      .addCase(updateUser.pending, (state) => {
        state.status.update = statusPending;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status.update = statusFulfilled;
        state.error = null;
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status.update = defaultStatus;
        state.error = action.error.message;
      });

    builder
      // delete
      .addCase(deleteUser.pending, (state) => {
        state.status.delete = statusPending;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.status.delete = statusFulfilled;
        state.error = null;
        state.items = state.items.filter(
          (item) => item.id !== action.payload.id
        );
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status.delete = defaultStatus;
        state.error = action.error.message;
      });
  },
});

export const { getStatusUsers, getUsers } = usersSlice.selectors;
export default usersSlice;
