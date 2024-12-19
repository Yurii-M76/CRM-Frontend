import { describe, expect, it } from "vitest";
import {
  createPerson,
  deletePerson,
  getAllPersons,
  updatePerson,
} from "./action";
import { PersonSlice } from "./reducer";
import { TPerson } from "@/types";

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

describe("Test Persons Slice", () => {
  describe("Create new", () => {
    it("should return state CREATE pending", async () => {
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
        sortBy: "createdAt",
        sortOrder: "desc",
        activePage: 1,
        rangeOnPage: 5,
        checkedIds: [],
        error: null,
      };

      const action = { type: createPerson.pending.type };
      const state = PersonSlice.reducer(initialState, action);

      expect(state.status.create).toEqual(statusPending);
      expect(state.error).toBeNull();
    });
    it("should return state CREATE fulfilled", async () => {
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
        sortBy: "createdAt",
        sortOrder: "desc",
        activePage: 1,
        rangeOnPage: 5,
        checkedIds: [],
        error: null,
      };

      const newData = {
        id: "3",
        surname: "Яблокова",
        name: "Виктория",
        patronymic: "Сергеевна",
        fullName: "Яблокова Виктория Сергеевна",
        birthday: "13.11.1975",
        phone: "9157418596",
        email: "test3@mail.ru",
        roles: [],
        districts: [],
        projects: [],
        createdAt: new Date("1982-03-05"),
      };

      const expectedData = [
        {
          id: "3",
          surname: "Яблокова",
          name: "Виктория",
          patronymic: "Сергеевна",
          fullName: "Яблокова Виктория Сергеевна",
          birthday: "13.11.1975",
          phone: "9157418596",
          email: "test3@mail.ru",
          roles: [],
          districts: [],
          projects: [],
          createdAt: new Date("1982-03-05"),
        },
      ];

      const action = {
        type: createPerson.fulfilled.type,
        payload: newData,
      };
      const state = PersonSlice.reducer(initialState, action);

      expect(state.status.create).toEqual(statusFulfilled);
      expect(state.error).toBeNull();
      expect(state.originalItems).toEqual(expectedData);
    });
    it("should return state CREATE rejected", async () => {
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
        sortBy: "createdAt",
        sortOrder: "desc",
        activePage: 1,
        rangeOnPage: 5,
        checkedIds: [],
        error: null,
      };

      const action = {
        type: createPerson.rejected.type,
        error: { message: "Filed to fetch" },
      };
      const state = PersonSlice.reducer(initialState, action);

      expect(state.status.create).toEqual(defaultStatus);
      expect(state.error).toBe("Filed to fetch");
    });
  });

  describe("Update", () => {
    it("should return state UPDATE pending", async () => {
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
        sortBy: "createdAt",
        sortOrder: "desc",
        activePage: 1,
        rangeOnPage: 5,
        checkedIds: [],
        error: null,
      };

      const action = { type: updatePerson.pending.type };
      const state = PersonSlice.reducer(initialState, action);

      expect(state.status.update).toEqual(statusPending);
      expect(state.error).toBeNull();
    });
    it("should return state UPDATE fulfilled", async () => {
      const mockData = [
        {
          id: "f40df72a-8fe2-41cd-96f1-b91e2edbedda",
          surname: "Иванов",
          name: "Иван",
          patronymic: "Иванович",
          fullName: "Иванов Иван Иванович",
          birthday: "01.01.1990",
          phone: "9201234567",
          email: "test1@mail.ru",
          roles: [],
          districts: [],
          projects: [],
          createdAt: new Date("1990-01-01"),
        },
      ];
      const updateDate = {
        id: "f40df72a-8fe2-41cd-96f1-b91e2edbedda",
        surname: "Крайонв",
        name: "Сергей",
        patronymic: "Петрович",
        fullName: "Крайнов Сергей Петрович",
        birthday: "01.01.1990",
        phone: "9201234567",
        email: "test1@mail.ru",
        roles: [],
        districts: [],
        projects: [],
        createdAt: new Date("1990-01-01"),
      };
      const initialState: TInitialStateTable = {
        status: {
          create: defaultStatus,
          read: defaultStatus,
          update: defaultStatus,
          delete: defaultStatus,
        },
        count: 0,
        items: [],
        originalItems: mockData,
        sortBy: "createdAt",
        sortOrder: "desc",
        activePage: 1,
        rangeOnPage: 5,
        checkedIds: [],
        error: null,
      };

      const action = {
        type: updatePerson.fulfilled.type,
        payload: updateDate,
      };
      const state = PersonSlice.reducer(initialState, action);

      expect(state.originalItems).toEqual([updateDate]);
    });
    it("should return state UPDATE rejected", async () => {
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
        sortBy: "createdAt",
        sortOrder: "desc",
        activePage: 1,
        rangeOnPage: 5,
        checkedIds: [],
        error: null,
      };

      const action = {
        type: updatePerson.rejected.type,
        error: { message: "Filed to fetch" },
      };
      const state = PersonSlice.reducer(initialState, action);

      expect(state.status.update).toEqual(defaultStatus);
      expect(state.error).toBe("Filed to fetch");
    });
  });
  describe("Find all", () => {
    it("should return state FIND ALL pending", async () => {
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
        sortBy: "createdAt",
        sortOrder: "desc",
        activePage: 1,
        rangeOnPage: 5,
        checkedIds: [],
        error: null,
      };

      const action = { type: getAllPersons.pending.type };
      const state = PersonSlice.reducer(initialState, action);

      expect(state.status.read).toEqual(statusPending);
      expect(state.error).toBeNull();
    });

    it("should return state FIND ALL fulfilled", async () => {
      const mockData = [
        {
          id: "1",
          surname: "Иванов",
          name: "Иван",
          patronymic: "Иванович",
          fullName: "Иванов Иван Иванович",
          birthday: "01.01.1990",
          phone: "9201234567",
          email: "test1@mail.ru",
          roles: [],
          districts: [],
          projects: [],
          createdAt: new Date("1990-01-01"),
        },
      ];

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
        sortBy: "createdAt",
        sortOrder: "desc",
        activePage: 1,
        rangeOnPage: 5,
        checkedIds: [],
        error: null,
      };

      const action = { type: getAllPersons.fulfilled.type, payload: mockData };
      const state = PersonSlice.reducer(initialState, action);

      expect(state.status.read).toEqual(statusFulfilled);
      expect(state.error).toBeNull();

      expect(state.originalItems).toEqual(mockData);
      expect(state.count).toBe(mockData.length);
    });

    it("should return state FIND ALL rejected", async () => {
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
        sortBy: "createdAt",
        sortOrder: "desc",
        activePage: 1,
        rangeOnPage: 5,
        checkedIds: [],
        error: null,
      };

      const action = {
        type: getAllPersons.rejected.type,
        error: { message: "Filed to fetch" },
      };
      const state = PersonSlice.reducer(initialState, action);

      expect(state.status.read).toEqual(defaultStatus);
      expect(state.error).toBe("Filed to fetch");
    });
  });

  describe("Delete", () => {
    it("should return state DELETE pending", async () => {
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
        sortBy: "createdAt",
        sortOrder: "desc",
        activePage: 1,
        rangeOnPage: 5,
        checkedIds: [],
        error: null,
      };

      const action = { type: deletePerson.pending.type };
      const state = PersonSlice.reducer(initialState, action);

      expect(state.status.delete).toEqual(statusPending);
      expect(state.error).toBeNull();
    });
    it("should return state DELETE fulfilled", async () => {
      const mockData = [
        {
          id: "f40df72a-8fe2-41cd-96f1-b91e2edbedda",
          surname: "Иванов",
          name: "Иван",
          patronymic: "Иванович",
          fullName: "Иванов Иван Иванович",
          birthday: "01.01.1990",
          phone: "9201234567",
          email: "test1@mail.ru",
          roles: [],
          districts: [],
          projects: [],
          createdAt: new Date("1990-01-01"),
        },
      ];
      const initialState: TInitialStateTable = {
        status: {
          create: defaultStatus,
          read: defaultStatus,
          update: defaultStatus,
          delete: defaultStatus,
        },
        count: 0,
        items: [],
        originalItems: mockData,
        sortBy: "createdAt",
        sortOrder: "desc",
        activePage: 1,
        rangeOnPage: 5,
        checkedIds: [],
        error: null,
      };

      const action = {
        type: deletePerson.fulfilled.type,
        payload: { id: "f40df72a-8fe2-41cd-96f1-b91e2edbedda" },
      };
      const state = PersonSlice.reducer(initialState, action);

      expect(state.status.delete).toEqual(statusFulfilled);
      expect(state.error).toBeNull();
      expect(state.originalItems).toEqual([]);
    });
    it("should return state DELETE rejected", async () => {
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
        sortBy: "createdAt",
        sortOrder: "desc",
        activePage: 1,
        rangeOnPage: 5,
        checkedIds: [],
        error: null,
      };

      const action = {
        type: deletePerson.rejected.type,
        error: { message: "Filed to fetch" },
      };
      const state = PersonSlice.reducer(initialState, action);

      expect(state.status.delete).toEqual(defaultStatus);
      expect(state.error).toBe("Filed to fetch");
    });
  });
});
