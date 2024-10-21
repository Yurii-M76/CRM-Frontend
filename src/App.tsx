import { MantineProvider } from "@mantine/core";
import { useDispatch } from "@services/store";
import { checkUserAuth } from "@services/user/action";
import { useEffect } from "react";
import { Router } from "./router";
import { theme } from "./theme";
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
