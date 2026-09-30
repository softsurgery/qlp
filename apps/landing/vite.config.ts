import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { qlpWorkspaceAliases } from "../vite.workspace-aliases.mjs";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, "");

  return {
    plugins: [tailwindcss(), react()],
    css: {
      postcss: {
        plugins: [],
      },
    },
    publicDir: path.resolve(__dirname, "public"),
    resolve: {
      alias: [
        { find: "@", replacement: path.resolve(__dirname, "./src") },
        ...qlpWorkspaceAliases(),
      ],
    },
    optimizeDeps: {
      include: [
        "@videojs/react",
        "@videojs/react/video",
        "@videojs/react/i18n",
        "@videojs/hlsjs-video",
        "@videojs/youtube-video",
      ],
      exclude: [
        "@qlp/datatable-builder",
        "@qlp/form-builder",
        "@qlp/ui",
      ],
    },
    server: {
      host: env.HOST || "localhost",
      port: Number(env.PORT) || 5175,
    },
    preview: {
      host: env.HOST || "localhost",
      port: Number(env.PORT) || 5175,
    },
  };
});
