import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  checkEmail,
  checkPhone,
  createPerson,
  deletePerson,
  getAllPersons,
  updatePerson,
} from "./action";
import {
  filterData,
  formatDateToString,
  pagination,
  sortData,
} from "@utils/index";
import { handleAllChecked, handleOneChecked } from "./checked-handlers";
import { TPerson, TPersonsFilters, TDistrict, TProject } from "@/types";

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
  count: number;
  items: TPerson[];
  searchedItems: TPerson[];
  filteredItems: TPerson[];
  originalItems: TPerson[];
  sortBy: keyof TPerson;
  sortOrder: "asc" | "desc";
  activePage: number;
  rangeOnPage: number;
  checkedIds: string[];
  error?: string | null;
  checkPhone: { id: string } | null;
  checkEmail: { id: string } | null;
  isFiltered: boolean;
  filterValues: Partial<TPersonsFilters> | undefined;
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
  count: 0,
  items: [],
  searchedItems: [],
  filteredItems: [],
  originalItems: [],
  checkedIds: [],
  sortBy: "createdAt",
  sortOrder: "desc",
  activePage: 1,
  rangeOnPage: 25,
  error: null,
  checkPhone: null,
  checkEmail: null,
  isFiltered: false,
  filterValues: {
    surname: "",
    name: "",
    patronymic: "",
    birthday: "",
    phone: "",
    email: "",
    districts: [],
    roles: [],
    projects: [],
    car: "",
    organization: "",
    note: "",
    isNotEmptySurname: false,
    isNotEmptyPatronymic: false,
    isNotEmptyBirthday: false,
    isNotEmptyPhone: false,
    isNotEmptyEmail: false,
    isNotEmptyRoles: false,
    isNotEmptyProjects: false,
    isNotEmptyCar: false,
    isNotEmptyOrganization: false,
    isNotEmptyNote: false,
    isEmptySurname: false,
    isEmptyPatronymic: false,
    isEmptyBirthday: false,
    isEmptyPhone: false,
    isEmptyEmail: false,
    isEmptyRoles: false,
    isEmptyProjects: false,
    isEmptyCar: false,
    isEmptyOrganization: false,
    isEmptyNote: false,
  },
};

const currentState = (state: TInitialState) => {
  const items = state.searchedItems.length
    ? state.searchedItems
    : state.filteredItems.length
    ? state.filteredItems
    : state.originalItems;

  return pagination(
    sortData(items, state.sortBy, state.sortOrder),
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

const formatPhoneNumber = (number: string) => {
  const phoneNumber = number.replace(/\D+/g, "");
  const phoneFormatNumber = `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
    3,
    6
  )}-${phoneNumber.slice(6, 8)}-${phoneNumber.slice(8, 10)}`;
  return phoneFormatNumber;
};

const normalizedString = (query: string | undefined): string | undefined => {
  if (!query) return undefined;
  return query.trim().toLowerCase();
};

const resetSorting = (state: TInitialState) => {
  state.sortBy = "createdAt";
  state.sortOrder = "desc";
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
      resetSorting(state);
      state.items = currentState(state);
    },
    setSearch: (state, action: PayloadAction<string>) => {
      const query = action.payload;
      const regex = new RegExp(`^[0-9]{10}$`);
      const isPhone = regex.test(query);
      const search = isPhone ? formatPhoneNumber(query) : query;

      state.searchedItems = filterData([...state.originalItems], search, [
        "fullName",
        "phone",
        "email",
        "birthday",
      ]);
      state.items = state.searchedItems;
      state.count = state.items.length;
    },
    resetSearch: (state) => {
      state.searchedItems = [];
      resetSorting(state);
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

    setFilters: (state, action: PayloadAction<TPersonsFilters>) => {
      const query = action.payload;

      const checkCondition = (
        itemValue: string | undefined,
        queryValue: string | undefined,
        isNotEmpty: boolean,
        isEmpty: boolean
      ) => {
        if (isNotEmpty) return !!itemValue;
        if (isEmpty) return !itemValue;
        return queryValue
          ? normalizedString(itemValue) === normalizedString(queryValue)
          : true;
      };

      const filteredItems = [...state.originalItems].filter((item) => {
        const conditions = [
          checkCondition(
            item.surname,
            query.surname,
            query.isNotEmptySurname,
            query.isEmptySurname
          ),
          checkCondition(item.name, query.name, false, false),
          checkCondition(
            item.patronymic,
            query.patronymic,
            query.isNotEmptyPatronymic,
            query.isEmptyPatronymic
          ),
          query.isNotEmptyBirthday
            ? item.birthday
            : query.isEmptyBirthday
            ? !item.birthday
            : checkCondition(
                String(item.birthday),
                query.birthday
                  ? formatDateToString(new Date(query.birthday), "YYYY-MM-DD")
                  : undefined,
                false,
                false
              ),
          checkCondition(
            item.phone,
            query.phone,
            query.isNotEmptyPhone,
            query.isEmptyPhone
          ),
          checkCondition(
            item.email,
            query.email,
            query.isNotEmptyEmail,
            query.isEmptyEmail
          ),
          checkCondition(
            item.car,
            query.car,
            query.isNotEmptyCar,
            query.isEmptyCar
          ),
          checkCondition(
            item.organization,
            query.organization,
            query.isNotEmptyOrganization,
            query.isEmptyOrganization
          ),
          checkCondition(
            item.note,
            query.note,
            query.isNotEmptyNote,
            query.isEmptyNote
          ),
          query.districts?.length
            ? item.districts.some((district) =>
                query.districts?.some(
                  (d: TDistrict) => d.toString() === district.id.toString()
                )
              )
            : true,
          query.isNotEmptyRoles
            ? item.roles.length
            : query.isEmptyRoles
            ? !item.roles.length
            : query.roles?.length
            ? item.roles.some((role) => query.roles?.some((r) => r === role))
            : true,
          query.isNotEmptyProjects
            ? item.projects.length
            : query.isEmptyProjects
            ? !item.projects.length
            : query.projects?.length
            ? item.projects.some((project) =>
                query.projects?.some(
                  (d: TProject) => d.toString() === project.id.toString()
                )
              )
            : true,
        ];
        state.isFiltered = true;
        return conditions.every((condition) => condition);
      });

      state.filteredItems = filteredItems;
      state.items = state.filteredItems;
      state.count = filteredItems.length;
      state.filterValues = query;
    },
    resetFilters: (state) => {
      state.filteredItems = [];
      resetSorting(state);
      state.items = currentState(state);
      state.count = state.originalItems.length;
      state.isFiltered = false;
      state.filterValues = undefined;
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
    getCheckPhone: (state) => state.checkPhone,
    getCheckEmail: (state) => state.checkEmail,
    getIsFiltered: (state) => state.isFiltered,
    getFilterValues: (state) => state.filterValues,
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
        resetSorting(state);
        state.status.read = statusPending;
        state.error = null;
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

    builder // Check phone
      .addCase(checkPhone.pending, (state) => {
        state.checkPhone = null;
      })
      .addCase(checkPhone.fulfilled, (state, action) => {
        state.checkPhone = action.payload;
      });

    builder // Check email
      .addCase(checkEmail.pending, (state) => {
        state.checkEmail = null;
      })
      .addCase(checkEmail.fulfilled, (state, action) => {
        state.checkEmail = action.payload;
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
  setFilters,
  resetFilters,
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
  getCheckPhone,
  getCheckEmail,
  getIsFiltered,
  getFilterValues,
} = PersonSlice.selectors;
export default PersonSlice;
