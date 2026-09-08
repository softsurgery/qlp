import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, "");

  return {
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
        "@qlp/curriculum",
        "@qlp/datatable-builder",
        "@qlp/form-builder",
        "@qlp/contexts",
        "@qlp/hooks",
        "@qlp/lib",
        "@qlp/ui",
      ],
    },
    server: {
      host: env.HOST || "localhost",
      port: Number(env.PORT) || 5173,
    },
    preview: {
      host: env.HOST || "localhost",
      port: Number(env.PORT) || 5173,
    },
  };
});
