import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { findAllProjects } from "./action";
import { TProject } from "@/types";
import { filterData, pagination, sortData } from "@/utils";

type TInitialState<T> = {
  loading: boolean;
  count: number;
  items: T[];
  originalItems: T[];
  searchResult: T[];
  sortBy: keyof T;
  sortOrder: "asc" | "desc";
  activePage: number;
  rangeOnPage: number;
  checkedIds: string[];
  error?: string | null;
};

const initialState: TInitialState<TProject> = {
  loading: false,
  count: 0,
  items: [],
  originalItems: [],
  searchResult: [],
  sortBy: "createdAt",
  sortOrder: "asc",
  activePage: 1,
  rangeOnPage: 10,
  checkedIds: [],
  error: null,
};

const processedData = <T>(state: TInitialState<T>) => {
  return pagination(
    sortData(
      state.searchResult.length
        ? [...state.searchResult]
        : [...state.originalItems],
      state.sortBy,
      state.sortOrder
    ),
    state.activePage,
    state.rangeOnPage
  );
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
      state.items = processedData(state);
    },
    resetSort: (state) => {
      state.sortBy = "createdAt";
      state.sortOrder = "asc";
      state.items = processedData(state);
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.searchResult = filterData(
        [...state.originalItems],
        action.payload,
        ["title", "describe"]
      );
      state.items = state.searchResult;
      state.count = state.searchResult.length;
    },
    resetSearch: (state) => {
      state.searchResult = [];
      state.items = processedData(state);
      state.count = state.originalItems.length;
    },
    setActivePage: (state, action: PayloadAction<number>) => {
      state.activePage = action.payload;
      state.items = processedData(state);
    },
    setRangeOnPage: (state, action: PayloadAction<number>) => {
      state.rangeOnPage = action.payload;
    },
  },
  selectors: {
    getProjectsLoading: (state) => state.loading,
    getProjects: (state) => state.items,
    getSortOrder: (state) => state.sortOrder,
    getSortBy: (state) => state.sortBy,
    getCountProjects: (state) => state.count,
    getActivePage: (state) => state.activePage,
    getRangeOnPage: (state) => state.rangeOnPage,
    getErrors: (state) => state.error,
  },
  extraReducers(builder) {
    builder
      .addCase(findAllProjects.pending, (state) => {
        state.loading = true;
        state.count = 0;
        state.error = null;
        state.sortBy = "createdAt";
        state.sortOrder = "asc";
        state.searchResult = [];
      })
      .addCase(findAllProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.count = action.payload.length;
        state.originalItems = action.payload;
        state.items = processedData(state);
        state.error = null;
      })
      .addCase(findAllProjects.rejected, (state, action) => {
        state.loading = false;
        state.count = 0;
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
  getProjectsLoading,
  getProjects,
  getSortOrder,
  getSortBy,
  getCountProjects,
  getActivePage,
  getRangeOnPage,
  getErrors,
} = projectSlice.selectors;
export default projectSlice;
