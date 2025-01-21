import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { filterData, pagination, sortData } from "@/utils";
import {
  createProject,
  deleteProject,
  findAllProjects,
  updateProject,
} from "./action";
import { TProject } from "@/types";

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

type TInitialStateTable = {
  status: TStatuses;
  count: number;
  items: TProject[];
  originalItems: TProject[];
  sortBy: keyof TProject;
  sortOrder: "asc" | "desc";
  activePage: number;
  rangeOnPage: number;
  checkedIds: string[];
  error?: string | null;
};

const defaultStatus = { loading: false, success: false };
const statusPending = { loading: true, success: false };
const statusFulfilled = { loading: false, success: true };

const initialState: TInitialStateTable = {
  status: {
    create: defaultStatus,
    read: defaultStatus,
    update: defaultStatus,
    delete: defaultStatus,
  },
  count: 0,
  items: [],
  originalItems: [],
  checkedIds: [],
  sortBy: "createdAt",
  sortOrder: "desc",
  activePage: 1,
  rangeOnPage: 25,
  error: null,
};

const currentState = (state: TInitialStateTable) => {
  return pagination(
    sortData(state.originalItems, state.sortBy, state.sortOrder),
    state.activePage,
    state.rangeOnPage
  );
};

const updatedData = (items: TProject[], action: PayloadAction<TProject>) => {
  const index = items.findIndex((item) => item.id === action.payload.id);
  if (index !== -1) {
    items[index] = action.payload;
  }
};

export const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setSort: (
      state,
      action: PayloadAction<{
        sortBy: keyof TProject;
        sortOrder: "asc" | "desc";
      }>
    ) => {
      const { sortBy, sortOrder } = action.payload;
      state.sortBy = sortBy;
      state.sortOrder = sortOrder;
      state.items = currentState(state);
    },
    resetSort: (state) => {
      state.sortBy = "createdAt";
      state.sortOrder = "desc";
      state.items = currentState(state);
    },
    setSearch: (state, action: PayloadAction<string>) => {
      const query = action.payload;
      state.items = filterData([...state.originalItems], query, [
        "title",
        "description",
      ]);
      state.count = state.items.length;
    },
    resetSearch: (state) => {
      state.items = currentState(state);
      state.count = state.originalItems.length;
    },
    setActivePage: (state, action: PayloadAction<number>) => {
      state.activePage = action.payload;
      state.items = currentState(state);
    },
    setRangeOnPage: (state, action: PayloadAction<number>) => {
      state.rangeOnPage = action.payload;
    },
  },
  selectors: {
    getProjectsStatus: (state) => state.status,
    getProjects: (state) => state.items,
    getSortOrder: (state) => state.sortOrder,
    getSortBy: (state) => state.sortBy,
    getCountProjects: (state) => state.count,
    getActivePage: (state) => state.activePage,
    getRangeOnPage: (state) => state.rangeOnPage,
    getOneChecked: (state) => state.checkedIds,
    getErrors: (state) => state.error,
  },
  extraReducers(builder) {
    builder // Create
      .addCase(createProject.pending, (state) => {
        state.status.create = statusPending;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.status.create = statusFulfilled;
        state.error = null;
        state.originalItems = [action.payload, ...state.originalItems];
        state.items = currentState(state);
        state.count = state.originalItems.length;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.status.create = defaultStatus;
        state.error = action.error.message;
      });

    builder // Update
      .addCase(updateProject.pending, (state) => {
        state.status.update = statusPending;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.status.update = statusFulfilled;
        state.error = null;
        updatedData(state.items, action);
        updatedData(state.originalItems, action);
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.status.update = defaultStatus;
        state.error = action.error.message;
      });

    builder // Find all
      .addCase(findAllProjects.pending, (state) => {
        state.status.read = statusPending;
        state.error = null;
        state.sortBy = "createdAt";
        state.sortOrder = "desc";
      })
      .addCase(findAllProjects.fulfilled, (state, action) => {
        state.status.read = statusFulfilled;
        state.error = null;
        state.originalItems = action.payload;
        state.items = currentState(state);
        state.count = state.originalItems.length;
      })
      .addCase(findAllProjects.rejected, (state, action) => {
        state.status.read = defaultStatus;
        state.error = action.error.message;
      });

    builder // Delete
      .addCase(deleteProject.pending, (state) => {
        state.status.delete = statusPending;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.status.delete = statusFulfilled;
        state.error = null;
        state.originalItems = state.originalItems.filter(
          (item) => item.id !== action.payload.id
        );
        state.items = state.originalItems;
        state.items = currentState(state);
        state.count = state.originalItems.length;
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.status.delete = defaultStatus;
        state.error = action.error.message;
      });
  },
});

export const {
  setSort,
  resetSort,
  setSearch,
  resetSearch,
  setActivePage,
  setRangeOnPage,
} = projectSlice.actions;
export const {
  getProjectsStatus,
  getProjects,
  getSortOrder,
  getSortBy,
  getCountProjects,
  getActivePage,
  getRangeOnPage,
  getErrors,
} = projectSlice.selectors;
export default projectSlice;
