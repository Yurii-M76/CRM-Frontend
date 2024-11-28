import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllVolunteers } from "./action";
import { TVolunteer } from "@/types";
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

const initialState: TInitialState<TVolunteer> = {
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

export const VolunteerSlice = createSlice({
  name: "volunteer",
  initialState,
  reducers: {
    setSort: (
      state,
      action: PayloadAction<{
        sortBy: keyof TVolunteer;
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
        ["surname", "name", "patronymic", "phone", "email", "birthday"]
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
    setOneChecked: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.checkedIds.includes(id)) {
        state.checkedIds = state.checkedIds.filter((item) => item !== id);
      } else {
        state.checkedIds.push(id);
      }
    },
    setAllChecked: (state) => {
      // Проверяем, все ли текущие элементы уже выбраны
      const allChecked = state.items.every((item) =>
        state.checkedIds.includes(item.id)
      );
      if (allChecked) {
        // Если все текущие элементы выбраны, снимаем отметки
        state.checkedIds = state.checkedIds.filter(
          (id) => !state.items.some((item) => item.id === id)
        );
      } else {
        // Если есть невыбранные элементы, добавляем их в checkedIds
        state.items.forEach((item) => {
          if (!state.checkedIds.includes(item.id)) {
            state.checkedIds.push(item.id);
          }
        });
      }
    },
    resetAllChecked: (state) => {
      state.checkedIds = [];
      state.items = processedData(state);
    },
  },
  selectors: {
    getVolunteersLoading: (state) => state.loading,
    getVolunteers: (state) => state.items,
    getSortOrder: (state) => state.sortOrder,
    getSortBy: (state) => state.sortBy,
    getCountVolunteers: (state) => state.count,
    getActivePage: (state) => state.activePage,
    getRangeOnPage: (state) => state.rangeOnPage,
    getOneChecked: (state) => state.checkedIds,
    getErrors: (state) => state.error,
  },
  extraReducers(builder) {
    builder
      // Find all volunteer
      .addCase(getAllVolunteers.pending, (state) => {
        state.loading = true;
        state.count = 0;
        state.error = null;
        state.sortBy = "createdAt";
        state.sortOrder = "asc";
        state.searchResult = [];
      })
      .addCase(getAllVolunteers.fulfilled, (state, action) => {
        state.loading = false;
        state.count = action.payload.length;
        state.originalItems = action.payload;
        state.items = processedData(state);
        state.error = null;
      })
      .addCase(getAllVolunteers.rejected, (state, action) => {
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
  setOneChecked,
  setAllChecked,
  resetAllChecked,
} = VolunteerSlice.actions;
export const {
  getVolunteersLoading,
  getVolunteers,
  getSortOrder,
  getSortBy,
  getCountVolunteers,
  getActivePage,
  getRangeOnPage,
  getOneChecked,
  getErrors,
} = VolunteerSlice.selectors;
export default VolunteerSlice;
