import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createPerson,
  deletePerson,
  getAllPersons,
  updatePerson,
} from "./action";
import { TPerson } from "../../types/person.types";
import { filterData, pagination, sortData } from "../../utils/index";
import { handleAllChecked, handleOneChecked } from "./checked-handlers";

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
  items: TPerson[];
  originalItems: TPerson[];
  sortBy: keyof TPerson;
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
  rangeOnPage: 5,
  error: null,
};

const currentState = (state: TInitialStateTable) => {
  return pagination(
    sortData(state.originalItems, state.sortBy, state.sortOrder),
    state.activePage,
    state.rangeOnPage
  );
};

const updatedData = (items: TPerson[], action: PayloadAction<TPerson>) => {
  const index = items.findIndex((item) => item.id === action.payload.id);
  if (index !== -1) {
    items[index] = action.payload;
  }
};

export const PersonSlice = createSlice({
  name: "person",
  initialState,
  reducers: {
    setSort: (
      state,
      action: PayloadAction<{
        sortBy: keyof TPerson;
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
      state.items = filterData([...state.originalItems], action.payload, [
        "fullName",
        "phone",
        "email",
        "birthday",
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
    setOneChecked: (state, action: PayloadAction<string>) =>
      handleOneChecked(state, action),
    setAllChecked: (state) => handleAllChecked(state),
    resetAllChecked: (state) => {
      state.checkedIds = [];
      state.items = currentState(state);
    },
  },
  selectors: {
    getPersonsStatus: (state) => state.status,
    getPersons: (state) => state.items,
    getSortOrder: (state) => state.sortOrder,
    getSortBy: (state) => state.sortBy,
    getCountPersons: (state) => state.count,
    getActivePage: (state) => state.activePage,
    getRangeOnPage: (state) => state.rangeOnPage,
    getOneChecked: (state) => state.checkedIds,
    getErrors: (state) => state.error,
  },
  extraReducers(builder) {
    builder // Create
      .addCase(createPerson.pending, (state) => {
        state.status.create = statusPending;
        state.error = null;
      })
      .addCase(createPerson.fulfilled, (state, action) => {
        state.status.create = statusFulfilled;
        state.error = null;
        state.originalItems = [action.payload, ...state.originalItems];
        state.items = currentState(state);
        state.count = state.originalItems.length;
      })
      .addCase(createPerson.rejected, (state, action) => {
        state.status.create = defaultStatus;
        state.error = action.error.message;
      });

    builder // Update
      .addCase(updatePerson.pending, (state) => {
        state.status.update = statusPending;
        state.error = null;
      })
      .addCase(updatePerson.fulfilled, (state, action) => {
        state.status.update = statusFulfilled;
        state.error = null;
        updatedData(state.items, action);
        updatedData(state.originalItems, action);
      })
      .addCase(updatePerson.rejected, (state, action) => {
        state.status.update = defaultStatus;
        state.error = action.error.message;
      });

    builder // Find all
      .addCase(getAllPersons.pending, (state) => {
        state.status.read = statusPending;
        state.error = null;
        state.sortBy = "createdAt";
        state.sortOrder = "desc";
      })
      .addCase(getAllPersons.fulfilled, (state, action) => {
        state.status.read = statusFulfilled;
        state.error = null;
        state.originalItems = action.payload;
        state.items = currentState(state);
        state.count = state.originalItems.length;
      })
      .addCase(getAllPersons.rejected, (state, action) => {
        state.status.read = defaultStatus;
        state.error = action.error.message;
      });

    builder // Delete
      .addCase(deletePerson.pending, (state) => {
        state.status.delete = statusPending;
        state.error = null;
      })
      .addCase(deletePerson.fulfilled, (state, action) => {
        state.status.delete = statusFulfilled;
        state.error = null;
        state.originalItems = state.originalItems.filter(
          (item) => item.id !== action.payload.id
        );
        state.items = state.originalItems;
        state.items = currentState(state);
        state.count = state.originalItems.length;
      })
      .addCase(deletePerson.rejected, (state, action) => {
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
  setOneChecked,
  setAllChecked,
  resetAllChecked,
} = PersonSlice.actions;
export const {
  getPersonsStatus,
  getPersons,
  getSortOrder,
  getSortBy,
  getCountPersons,
  getActivePage,
  getRangeOnPage,
  getOneChecked,
  getErrors,
} = PersonSlice.selectors;
export default PersonSlice;