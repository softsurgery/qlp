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
      "@qlp/api-client",
      "@qlp/components",
      "@qlp/contexts",
      "@qlp/datatable-builder",
      "@qlp/form-builder",
      "@qlp/hooks",
      "@qlp/lib",
      "@qlp/ui",
    ],
  },
  server: {
    port: 5174,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
