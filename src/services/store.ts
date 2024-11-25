import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook,
} from "react-redux";
import userSlice from "./user/reducer";
import VolunteerSlice from "./volunteer/reducer";
import projectSlice from "./project/reducer";

export const rootReducer = combineReducers({
  [userSlice.reducerPath]: userSlice.reducer,
  [VolunteerSlice.reducerPath]: VolunteerSlice.reducer,
  [projectSlice.reducerPath]: projectSlice.reducer,
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
