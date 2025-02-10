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

const formatPhoneNumber = (number: string) => {
  const phoneNumber = number.split("");
  const phoneFormatNumber = `(${phoneNumber[0]}${phoneNumber[1]}${phoneNumber[2]}) ${phoneNumber[3]}${phoneNumber[4]}${phoneNumber[5]}-${phoneNumber[6]}${phoneNumber[7]}-${phoneNumber[8]}${phoneNumber[9]}`;
  return phoneFormatNumber;
};

const normalizedString = (query: string): string => {
  if (!query) return "";
  return query.trim().toLowerCase();
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
      const query = action.payload;
      const regex = new RegExp(`^[0-9]{10}$`);
      const isPhone = regex.test(query);
      const search = isPhone ? formatPhoneNumber(query) : query;

      state.items = filterData([...state.originalItems], search, [
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
    setFilters: (state, action: PayloadAction<TPersonsFilters>) => {
      const query = action.payload;
      console.log(query);
      const filteredItems = [...state.originalItems].filter((item) => {
        const conditions = [
          query.isNotEmptySurname
            ? item.surname
            : query.isEmptySurname
            ? !item.surname
            : query.surname
            ? normalizedString(item.surname) === normalizedString(query.surname)
            : true,
          query.name
            ? normalizedString(item.name) === normalizedString(query.name)
            : true,
          query.isNotEmptyPatronymic
            ? item.patronymic
            : query.isEmptyPatronymic
            ? !item.patronymic
            : query.patronymic
            ? normalizedString(item.patronymic) ===
              normalizedString(query.patronymic)
            : true,
          query.isNotEmptyBirthday
            ? item.birthday
            : query.isEmptyBirthday
            ? !item.birthday
            : query.birthday
            ? item.birthday ===
              formatDateToString(new Date(query.birthday), "YYYY-MM-DD")
            : true,
            query.isNotEmptyPhone
            ? item.phone
            : query.isEmptyPhone
            ? !item.phone
            : query.phone
            ? item.phone === query.phone
            : true,
          query.isNotEmptyEmail
            ? item.email
            : query.isEmptyEmail
            ? !item.email
            : query.email
            ? normalizedString(item.email) === normalizedString(query.email)
            : true,
          query.districts?.length
            ? item.districts.some((district) =>
                query.districts?.some(
                  (d: TDistrict) => d.toString() === district.id.toString()
                )
              )
            : true,
          query.isNotEmptyRoles
            ? item.roles.length > 0
            : query.isEmptyRoles
            ? !item.roles.length
            : query.roles?.length
            ? item.roles.some((role) => query.roles?.some((r) => r === role))
            : true,
          query.isNotEmptyProjects
            ? item.projects.length > 0
            : query.isEmptyProjects
            ? !item.projects.length
            : query.projects?.length
            ? item.projects.some((project) =>
                query.projects?.some(
                  (p: TProject) => p.toString() === project.id.toString()
                )
              )
            : true,
          query.isNotEmptyCar
            ? item.car
            : query.isEmptyCar
            ? !item.car
            : query.car
            ? item.car &&
              normalizedString(item.car).includes(normalizedString(query.car))
            : true,
          query.isNotEmptyOrganization
            ? item.organization
            : query.isEmptyOrganization
            ? !item.organization
            : query.organization
            ? item.organization &&
              normalizedString(item.organization).includes(
                normalizedString(query.organization)
              )
            : true,
          query.isNotEmptyNote
            ? item.note
            : query.isEmptyNote
            ? !item.note
            : query.note
            ? item.note &&
              normalizedString(item.note).includes(normalizedString(query.note))
            : true,
        ];
        state.isFiltered = true;
        return conditions.every((condition) => condition);
      });

      state.items = filteredItems;
      state.count = filteredItems.length;
      state.filterValues = query;
    },
    resetFilters: (state) => {
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
