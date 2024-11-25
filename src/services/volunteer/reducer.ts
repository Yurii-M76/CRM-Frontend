import { TVolunteer } from "@/utils/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllVolunteers } from "./action";

type TInitialState = {
  loading: boolean;
  count: number;
  items: TVolunteer[];
  originalItems: TVolunteer[];
  searchResult: TVolunteer[];
  sortBy: keyof TVolunteer;
  sortOrder: "asc" | "desc";
  activePage: number;
  rangeOnPage: number;
  checkedIds: string[];
  error?: string | null;
};

const initialState: TInitialState = {
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
  sortOrder: string
) => {
  return data.sort((a, b) => {
    const aVal =
      sortBy === "surname"
        ? `${a.surname} ${a.name} ${a.patronymic}`
        : sortBy === "projects" // условие для сортировки проектов
        ? a.projects.map((tag) => tag.title).join(", ")
        : a[sortBy];

    const bVal =
      sortBy === "surname"
        ? `${b.surname} ${b.name} ${b.patronymic}`
        : sortBy === "projects"
        ? b.projects.map((tag) => tag.title).join(", ")
        : b[sortBy];

    // Улучшенное сравнение с учетом типа данных
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortOrder === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    } else if (typeof aVal === "number" && typeof bVal === "number") {
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    } else {
      // Если типы не совпадают, возвращаем 0
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

const filterItems = (items: TVolunteer[], query: string) => {
  return items.filter((item) => {
    const allFields =
      `${item.surname} ${item.name} ${item.patronymic} ${item.phone} ${item.email}`.toLowerCase();
    return allFields.includes(query.trim().toLowerCase());
  });
};

const updatePagination = (state: TInitialState) => {
  const currentItems = checkCurrentItems(
    sortedItems([...state.originalItems], state.sortBy, state.sortOrder),
    [...state.searchResult]
  );

  state.items = sliceItems(currentItems, state.activePage, state.rangeOnPage);
  state.count = currentItems.length;
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
      updatePagination(state);
    },
    resetSort: (state) => {
      state.sortBy = "createdAt";
      state.sortOrder = "asc";
      updatePagination(state);
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.searchResult = filterItems(state.originalItems, action.payload);
      updatePagination(state);
    },
    resetSearch: (state) => {
      state.searchResult = [];
      updatePagination(state);
    },
    setActivePage: (state, action: PayloadAction<number>) => {
      state.activePage = action.payload;
      updatePagination(state);
    },
    setRangeOnPage: (state, action: PayloadAction<number>) => {
      state.rangeOnPage = action.payload;
      updatePagination(state);
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
      updatePagination(state);
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
      })
      .addCase(getAllVolunteers.fulfilled, (state, action) => {
        state.loading = false;
        state.count = action.payload.length;
        state.originalItems = action.payload;
        state.items = sliceItems(
          sortedItems([...state.originalItems], state.sortBy, state.sortOrder),
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
