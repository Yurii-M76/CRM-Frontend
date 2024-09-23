import { Router } from "./router";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import { useDispatch } from "./services/store";
import { useEffect } from "react";
import { checkUserAuth } from "./services/user/action";

import "@mantine/core/styles.css";

function App() {
  // localStorage.clear();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkUserAuth());
  }, [dispatch]);

  return (
    <MantineProvider theme={theme}>
      <Router />
    </MantineProvider>
  );
}

export default App;
