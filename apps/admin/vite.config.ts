import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { qlpWorkspaceAliases } from "../vite.workspace-aliases.mjs";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, "");

  return {
    plugins: [react()],
    publicDir: path.resolve(__dirname, "../../packages/ui/public"),
    resolve: {
      alias: [
        { find: "@", replacement: path.resolve(__dirname, "./src") },
        ...qlpWorkspaceAliases(),
      ],
    },
    optimizeDeps: {
      exclude: [
        "@qlp/api-client",
        "@qlp/components",
        "@qlp/contexts",
        "@qlp/curriculum",
        "@qlp/datatable-builder",
        "@qlp/form-builder",
        "@qlp/hooks",
        "@qlp/lib",
        "@qlp/ui",
      ],
    },
    server: {
      host: env.HOST || "localhost",
      port: Number(env.PORT) || 5174,
    },
    preview: {
      host: env.HOST || "localhost",
      port: Number(env.PORT) || 5174,
    },
  };
});
