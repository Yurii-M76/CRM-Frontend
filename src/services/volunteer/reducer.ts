import { TVolunteer } from "@/utils/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllVolunteers } from "./action";

type TInitialState = {
  loading: boolean;
  count: number;
  items: TVolunteer[];
  error?: string | null;
  sortBy: keyof TVolunteer | ""; // '' для состояния "без сортировки"
  sortOrder: "asc" | "desc" | null;
  originalItems: TVolunteer[]; // Храним оригинальный массив для сброса
};

const initialState: TInitialState = {
  loading: false,
  count: 0,
  items: [],
  error: null,
  sortBy: "",
  sortOrder: null,
  originalItems: [], // Инициализируем оригинальный массив
};

export const VolunteerSlice = createSlice({
  name: "volunteer",
  initialState,
  reducers: {
    // setVolunteers: (state, action: PayloadAction<TVolunteer[]>) => {
    //   state.items = action.payload;
    //   state.originalItems = [...action.payload]; // Сохраняем оригинальный массив
    // },
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
      if (!sortBy) {
        state.items = [...state.originalItems]; // Восстанавливаем оригинальный массив
        return;
      }

      state.items.sort((a, b) => {
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
    },
    resetSort: (state) => {
      state.items = [...state.originalItems];
      state.sortBy = "";
      state.sortOrder = null;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.items = [...state.originalItems].filter((item) => {
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
      state.count = state.items.length;
    },
    resetSearch: (state) => {
      state.items = [...state.originalItems];
      state.count = state.items.length;
    },
  },
  selectors: {
    getVolunteersLoading: (state) => state.loading,
    getVolunteers: (state) => state.items,
    getSortOrder: (state) => state.sortOrder,
    getSortBy: (state) => state.sortBy,
    getCountVolunteers: (state) => state.count,
  },
  extraReducers(builder) {
    builder
      // Find all volunteer
      .addCase(getAllVolunteers.pending, (state) => {
        state.loading = true;
        state.count = 0;
        state.error = null;
      })
      .addCase(getAllVolunteers.fulfilled, (state, action) => {
        state.loading = false;
        state.count = action.payload.length;
        state.items = action.payload;
        state.originalItems = [...action.payload];
        state.error = null;
      })
      .addCase(getAllVolunteers.rejected, (state, action) => {
        state.loading = false;
        state.count = 0;
        state.error = action.error.message;
      });
  },
});

export const { setSort, resetSort, setSearch, resetSearch } =
  VolunteerSlice.actions;
export const {
  getVolunteersLoading,
  getVolunteers,
  getSortOrder,
  getSortBy,
  getCountVolunteers,
} = VolunteerSlice.selectors;
export default VolunteerSlice;
