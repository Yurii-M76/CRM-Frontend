import { MantineProvider } from "@mantine/core";
import { useDispatch, useSelector } from "@services/store";
import { checkUserAuth } from "@services/user/action";
import { useEffect } from "react";
import { Router } from "./router";
import { theme } from "./theme";
import { Login } from "./pages";
import { getIsAuthChecked } from "./services/user/reducer";
import "@mantine/core/styles.css";

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(getIsAuthChecked);
  useEffect(() => {
    dispatch(checkUserAuth());
  }, [dispatch]);


  return (
    <MantineProvider theme={theme}>
      {!isAuthenticated && <Login />}
      {isAuthenticated && <Router />}
    </MantineProvider>
  );
}

export default App;
