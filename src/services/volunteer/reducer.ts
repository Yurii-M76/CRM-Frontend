import { TVolunteer } from "@/utils/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllVolunteers } from "./action";

// FIXME: Исправить поиск: находит только 5 значений (вероятно ищет по одной странице)

type TInitialState = {
  loading: boolean;
  count: number;
  items: TVolunteer[];
  originalItems: TVolunteer[];
  searchResult: TVolunteer[];
  sortBy: keyof TVolunteer | "";
  sortOrder: "asc" | "desc" | null;
  activePage: number;
  rangeOnPage: number;
  error?: string | null;
};

const initialState: TInitialState = {
  loading: false,
  count: 0,
  items: [],
  originalItems: [],
  searchResult: [],
  sortBy: "",
  sortOrder: null,
  activePage: 1,
  rangeOnPage: 5,
  error: null,
};

const sliceItems = <T>(
  data: T[],
  activePage: number,
  rangeOnPage: number
): T[] => {
  return [...data].slice(
    (activePage - 1) * rangeOnPage,
    activePage * rangeOnPage
  );
};

const sortedItems = (
  data: TVolunteer[],
  sortBy: keyof TVolunteer,
  sortOrder: string | null
) => {
  return data.sort((a, b) => {
    const aVal =
      sortBy === "surname"
        ? `${a.surname} ${a.name} ${a.patronymic}`
        : a[sortBy];
    const bVal =
      sortBy === "surname"
        ? `${b.surname} ${b.name} ${b.patronymic}`
        : b[sortBy];

    // Улучшенное сравнение с учетом типа данных
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortOrder === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    } else if (typeof aVal === "number" && typeof bVal === "number") {
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    } else {
      //Обработка других типов данных, если необходимо.  Возвращаем 0, если типы не совпадают.
      return 0;
    }
  });
};

const checkCurrentItems = (
  original: TVolunteer[],
  alternative: TVolunteer[]
) => {
  return alternative.length ? alternative : original;
};

export const VolunteerSlice = createSlice({
  name: "volunteer",
  initialState,
  reducers: {
    setSort: (
      state,
      action: PayloadAction<{
        sortBy: keyof TVolunteer | "";
        sortOrder: "asc" | "desc" | null;
      }>
    ) => {
      const { sortBy, sortOrder } = action.payload;
      state.sortBy = sortBy;
      state.sortOrder = sortOrder;

      // Сброс сортировки
      // if (!sortBy) {
      //   state.items = [...state.originalItems];
      //   return;
      // }
      const currentItems = checkCurrentItems(
        [...state.originalItems],
        [...state.searchResult]
      );
      const sortedItemsResult: TVolunteer[] = sortedItems(
        currentItems,
        state.sortBy,
        state.sortOrder
      );
      state.items = sliceItems(
        sortedItemsResult,
        state.activePage,
        state.rangeOnPage
      );
      state.count = currentItems.length;
    },
    resetSort: (state) => {
      const currentItems = checkCurrentItems(
        [...state.originalItems],
        [...state.searchResult]
      );
      state.items = sliceItems(
        currentItems,
        state.activePage,
        state.rangeOnPage
      );
      state.count = currentItems.length;
      state.sortBy = "";
      state.sortOrder = null;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.searchResult = [...state.originalItems].filter((item) => {
        if (
          item.surname ||
          item.name ||
          item.patronymic ||
          item.phone ||
          item.email
        ) {
          return (
            item.surname +
            " " +
            item.name +
            " " +
            item.patronymic +
            " " +
            item.phone +
            " " +
            item.email
          )
            .toLowerCase()
            .includes(action.payload.trim().toLowerCase());
        }
      });
      state.items = sliceItems(
        sortedItems([...state.searchResult], state.sortBy, state.sortOrder),
        state.activePage,
        state.rangeOnPage
      );
      state.count = state.searchResult.length;
    },
    resetSearch: (state) => {
      state.items = sliceItems(
        sortedItems([...state.originalItems], state.sortBy, state.sortOrder),
        state.activePage,
        state.rangeOnPage
      );
      state.searchResult = [];
      state.count = state.originalItems.length;
    },
    setActivePage: (state, action: PayloadAction<number>) => {
      const currentItems = checkCurrentItems(
        [...state.originalItems],
        [...state.searchResult]
      );
      state.activePage = action.payload;
      state.items = sliceItems(
        sortedItems(currentItems, state.sortBy, state.sortOrder),
        state.activePage,
        state.rangeOnPage
      );
    },
    setRangeOnPage: (state, action: PayloadAction<number>) => {
      const currentItems = checkCurrentItems(
        [...state.originalItems],
        [...state.searchResult]
      );
      state.rangeOnPage = action.payload;
      state.items = sliceItems(
        sortedItems(currentItems, state.sortBy, state.sortOrder),
        state.activePage,
        state.rangeOnPage
      );
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
  },
  extraReducers(builder) {
    builder
      // Find all volunteer
      .addCase(getAllVolunteers.pending, (state) => {
        state.loading = true;
        state.count = 0;
        state.error = null;
        state.sortOrder = null;
        state.sortBy = "";
      })
      .addCase(getAllVolunteers.fulfilled, (state, action) => {
        state.loading = false;
        state.count = action.payload.length;
        state.originalItems = action.payload;
        state.items = sliceItems(
          [...state.originalItems],
          state.activePage,
          state.rangeOnPage
        );
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
} = VolunteerSlice.actions;
export const {
  getVolunteersLoading,
  getVolunteers,
  getSortOrder,
  getSortBy,
  getCountVolunteers,
  getActivePage,
  getRangeOnPage,
} = VolunteerSlice.selectors;
export default VolunteerSlice;
