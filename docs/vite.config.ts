import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const docsRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig(({ command }) => {
  if (command === "build") throw new Error("Docs are WIP and blocked from production. Use npm run dev:docs for the local preview.");
  return {
  root: docsRoot,
  cacheDir: fileURLToPath(new URL("../node_modules/.vite-docs", import.meta.url)),
  plugins: [react(), tailwindcss()],
  publicDir: fileURLToPath(new URL("../public", import.meta.url)),
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("../src", import.meta.url)),
      "@docs": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 5175,
  },
  };
});
