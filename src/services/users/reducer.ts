import { createSlice } from "@reduxjs/toolkit";
import {
  createUser,
  deleteUser,
  findAllUsers,
  findOneUser,
  updateUser,
} from "./actions";
import { TUser } from "@/types";

type TInitialState = {
  loading: boolean;
  error?: string | null;
  items: TUser[];
};

const initialState: TInitialState = {
  loading: false,
  error: null,
  items: [],
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  selectors: {
    getIsLoadingUsers: (state) => state.loading,
    getUsers: (state) => state.items,
  },
  extraReducers(builder) {
    builder
      // create
      .addCase(createUser.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.items = [...state.items, action.payload];
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      // find all
      .addCase(findAllUsers.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(findAllUsers.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(findAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      // find one
      .addCase(findOneUser.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(findOneUser.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
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
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      // update
      .addCase(updateUser.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      // delete
      .addCase(deleteUser.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.items.filter((item) => item.id !== action.payload.id);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// export const {} = nameSlice.actions;
export const { getIsLoadingUsers, getUsers } = usersSlice.selectors;
export default usersSlice;
