import { MantineProvider } from "@mantine/core";
import { useEffect } from "react";
import { useDispatch } from "./services/store";
import { Router } from "./router";
import { theme } from "./theme";
import { checkUserAuth } from "./services/user/action";
import "@mantine/core/styles.css";

function App() {
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
