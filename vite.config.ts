import { defineConfig } from "vite";
import eslintPlugin from "vite-plugin-eslint";
import nodePolyfills from "vite-plugin-node-stdlib-browser";
import path from "path";

export default defineConfig({
  plugins: [eslintPlugin(), nodePolyfills()],
  server: {
    cors: false,
  },
  resolve: {
    alias: {
      "@ostypes": path.resolve(__dirname, "./src/types/"),
      "@core": path.resolve(__dirname, "./src/core/"),
      "@utils": path.resolve(__dirname, "./src/utils/"),
      "@inversify": path.resolve(__dirname, "./"),
    },
  },
});
