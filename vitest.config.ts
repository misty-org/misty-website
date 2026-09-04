import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@", replacement: fileURLToPath(new URL("./src", import.meta.url)) },
      {
        find: /^@misty\/store\/catalog$/,
        replacement: fileURLToPath(new URL("./vendor/misty-store/interface/catalog.ts", import.meta.url)),
      },
      {
        find: /^@misty\/store\/react$/,
        replacement: fileURLToPath(new URL("./vendor/misty-store/interface/react.tsx", import.meta.url)),
      },
      {
        find: /^@misty\/store\/store\.css$/,
        replacement: fileURLToPath(new URL("./vendor/misty-store/interface/store.css", import.meta.url)),
      },
      {
        find: /^@misty\/store\/store$/,
        replacement: fileURLToPath(new URL("./vendor/misty-store/interface/store.tsx", import.meta.url)),
      },
      {
        find: /^@misty\/store$/,
        replacement: fileURLToPath(new URL("./vendor/misty-store/interface/store.tsx", import.meta.url)),
      },
    ],
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    clearMocks: true,
    restoreMocks: true,
  },
});
