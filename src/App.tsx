import { MantineProvider } from "@mantine/core";
import { useDispatch, useSelector } from "@services/store";
import { useEffect, useState } from "react";
import { Router } from "./router";
import { theme } from "./theme";
import { LoginPage } from "./pages";
import { getIsAuthChecked, setIsAuthChecked } from "./services/user/reducer";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import { getCookie, refreshTokens } from "./utils";
import { AuthLoader } from "@components";
import "@mantine/core/styles.css";

function App() {
  const dispatch = useDispatch();
  const isAuth = useSelector(getIsAuthChecked);
  const [isLoading, setIsLoading] = useState(true);

  const checkIsAuth = createAsyncThunk(
    "user/checkUserAuth",
    async (_, { dispatch, rejectWithValue }) => {
      try {
        const token = getCookie("accessToken");

        if (token) {
          const { exp } = jwtDecode(token);
          const currentTime = Math.floor(Date.now() / 1000);

          if (exp! > currentTime) {
            dispatch(setIsAuthChecked(true));
          } else {
            await refreshTokens();
            dispatch(setIsAuthChecked(true));
          }
        } else {
          dispatch(setIsAuthChecked(false));
        }
      } catch (error) {
        dispatch(setIsAuthChecked(false));
        return rejectWithValue(error);
      } finally {
        setIsLoading(false);
      }
    }
  );

  useEffect(() => {
    dispatch(checkIsAuth());
  }, [checkIsAuth, dispatch]);

  const loginPage = isLoading ? <AuthLoader /> : <LoginPage />

  return (
    <MantineProvider theme={theme}>
      {!isAuth ? loginPage : <Router />}
    </MantineProvider>
  );
}

export default App;
