import { MantineProvider } from '@mantine/core'
import { theme } from './theme';
import "@mantine/core/styles.css";

function App() {
  return <MantineProvider theme={theme}>
    app
  </MantineProvider>;
}

export default App;
