import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom", "lucide-react"],
    mainFields: ["module", "jsnext:main", "jsnext", "main"],
    alias: [
      { find: "@", replacement: fileURLToPath(new URL("./src", import.meta.url)) },
    ],
  },
  server: {
    fs: {
      allow: [process.cwd(), fileURLToPath(new URL("../misty-ui", import.meta.url))],
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    clearMocks: true,
    restoreMocks: true,
    server: {
      deps: {
        inline: [/misty-ui\/node_modules\//],
      },
    },
  },
});
