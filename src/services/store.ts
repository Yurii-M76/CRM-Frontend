import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook,
} from "react-redux";
import authSlice from "./auth/reducer";
import PersonSlice from "./person/reducer";
import projectSlice from "./project/reducer";
import districtsSlice from "./districts/reducer";
import usersSlice from "./users/reducer";

export const rootReducer = combineReducers({
  [authSlice.reducerPath]: authSlice.reducer,
  [PersonSlice.reducerPath]: PersonSlice.reducer,
  [projectSlice.reducerPath]: projectSlice.reducer,
  [districtsSlice.reducerPath]: districtsSlice.reducer,
  [usersSlice.reducerPath]: usersSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
