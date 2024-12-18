import { createTheme } from "@mantine/core";

export const theme = createTheme({
  components: {
    Modal: {
      styles: {
        title: {
          fontWeight: "bold",
          fontSize: "1.1rem",
          color: "var(--mantine-color-blue-light-color)",
        },
        close: {
          color: "var(--mantine-color-blue-light-color)",
        }
      },
    },
  },
});
