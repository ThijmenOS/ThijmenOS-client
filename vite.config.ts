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
      "@ostypes": path.resolve(__dirname, "./src/types/"),
      "@drivers": path.resolve(__dirname, "./src/drivers/"),
      "@core": path.resolve(__dirname, "./src/core/"),
      "@utils": path.resolve(__dirname, "./src/utils/"),
      "@fileIcon": path.resolve(__dirname, "./src/fileIcon/"),
      "@window": path.resolve(__dirname, "./src/window/"),
      "@static": path.resolve(__dirname, "./src/static/"),
      "@config": path.resolve(__dirname, "./src/config"),
      "@icon": path.resolve(__dirname, "./src/fileIcon"),
    },
  },
});
