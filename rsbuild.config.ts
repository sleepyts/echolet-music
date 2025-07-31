import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
export default defineConfig({
  plugins: [pluginReact()],
  html: {
    template: "./index.html",
  },
  source: {
    entry: {
      index: "./src/main.tsx",
    },
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        pathRewrite: { "^/api": "" },
      },
    },
  },
});
