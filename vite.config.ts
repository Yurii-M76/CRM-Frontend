import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  base: "/",
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@forms": path.resolve(__dirname, "./src/components/forms"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@types": path.resolve(__dirname, "./src/types"),
      "@styles": path.resolve(__dirname, "./src/styles"),
    },
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            "react",
            "react-dom",
            "react-imask",
            "react-router-dom",
          ],
          redux: ["react-redux"],
          dayjs: ["dayjs"],
          exceljs: ["exceljs"],
          jwtDecode: ["jwt-decode"],
          utils: ["./src/utils"],
          types: ["./src/types"],
          store: ["./src/services/store.ts"],
        },
      },
    },
  },
});
