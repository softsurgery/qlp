import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  publicDir: path.resolve(__dirname, "../../packages/ui/public"),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: [
      "@qlp/datatable-builder",
      "@qlp/form-builder",
      "@qlp/ui",
    ],
  },
  server: {
    port: 5175,
  },
});
