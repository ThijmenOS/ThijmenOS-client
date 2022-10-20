import { defineConfig } from "vite";
import eslintPlugin from "vite-plugin-eslint";
import path from "path";

export default defineConfig({
  plugins: [eslintPlugin()],
  server: {
    cors: false,
  },
  resolve: {
    alias: {
      "@interface": path.resolve(__dirname, "./src/interfaces/"),
      "@core": path.resolve(__dirname, "./src/core/"),
      "@utils": path.resolve(__dirname, "./src/utils/"),
      "@fileIcon": path.resolve(__dirname, "./src/fileIcon/"),
      "@window": path.resolve(__dirname, "./src/window/"),
      "@static": path.resolve(__dirname, "./src/static/"),
      "@root": path.resolve(__dirname, "./src/"),
      "@icon": path.resolve(__dirname, "./src/fileIcon"),
    },
  },
});
