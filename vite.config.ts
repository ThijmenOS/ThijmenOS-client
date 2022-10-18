import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  server: {
    cors: false,
  },
  resolve: {
    alias: {
      "@interface": path.resolve(__dirname, "./src/interfaces/"),
      "@core": path.resolve(__dirname, "./src/core/"),
      "@utils": path.resolve(__dirname, "./src/utils/"),
      "@app": path.resolve(__dirname, "./src/app-regestry/"),
      "@static": path.resolve(__dirname, "./src/static/"),
      "@root": path.resolve(__dirname, "./src/"),
    },
  },
});
