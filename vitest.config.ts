import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom", "lucide-react"],
    // Packages such as react-remove-scroll ship CommonJS under "main", which Node would load with its own
    // require; their "module" build goes through Vite, so the dedupe above reaches it.
    mainFields: ["module", "jsnext:main", "jsnext", "main"],
    alias: [
      { find: "@", replacement: fileURLToPath(new URL("./src", import.meta.url)) },
    ],
  },
  server: {
    fs: {
      // @misty/ui is linked from ../misty-ui, so its own files (images included) load from there.
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
        // @misty/ui's own packages (Radix, cmdk…) sit in ../misty-ui/node_modules beside a React of its
        // own. Run them through Vite, whose dedupe hands them the site's React, rather than letting Node
        // load that second copy.
        inline: [/misty-ui\/node_modules\//],
      },
    },
  },
});
