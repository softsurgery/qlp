import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  css: {
    postcss: {
      plugins: [],
    },
  },
  publicDir: path.resolve(__dirname, "public"),
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
