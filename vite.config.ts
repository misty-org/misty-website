import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
// misty-docs is mounted into the site (src/pages/Docs), so its sources resolve here too: the sibling
// checkouts it reads (misty-sdk, misty-ui), or the pinned clones in misty-docs's .sources.
// @ts-expect-error a plain script with no types
import { resolveSources } from '../misty-docs/scripts/sync-sources.mjs'

const docsSources = resolveSources() as Record<string, string>

function isLocalApiBase(value?: string) {
  const apiBase = value?.trim();
  if (!apiBase) {
    return false;
  }

  try {
    const url = new URL(apiBase);
    return ["localhost", "127.0.0.1", "::1"].includes(url.hostname);
  } catch {
    return /^https?:\/\/(?:localhost|127\.0\.0\.1|\[::1\])(?::|\/|$)/i.test(apiBase);
  }
}

function apiProxyTarget(value?: string) {
  const rawTarget = value?.trim();
  if (!rawTarget) {
    return undefined;
  }

  const target = new URL(rawTarget);
  if (
    !["http:", "https:"].includes(target.protocol) ||
    target.username ||
    target.password ||
    target.pathname !== "/" ||
    target.search ||
    target.hash
  ) {
    throw new Error(
      "VITE_API_PROXY_TARGET must be an HTTP(S) origin without credentials, a path, query, or fragment.",
    );
  }
  return target.origin;
}

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const proxyTarget = apiProxyTarget(
    env.VITE_API_PROXY_TARGET ||
      (command === "serve" ? "http://127.0.0.1:8081" : undefined),
  );
  const apiBase =
    env.MISTY_PUBLIC_API_URL?.trim() ||
    env.VITE_API_BASE?.trim() ||
    (command === "serve" ? "/v1" : undefined);
  if (command === "build" && mode === "production" && isLocalApiBase(apiBase)) {
    throw new Error(
      "Production builds cannot use a localhost MISTY_PUBLIC_API_URL. Set MISTY_PUBLIC_API_URL to the deployed API URL or omit it to use /api.",
    );
  }

  return {
    plugins: [react(), tailwindcss()],
    define: {
      "import.meta.env.MISTY_PUBLIC_API_URL": JSON.stringify(apiBase ?? ""),
    },
    // @misty/ui is linked from ../misty-ui as source: its React and icons are the site's own.
    optimizeDeps: {
      exclude: ["@misty/ui"],
    },
    server: {
      fs: {
        // ../misty-ui, where @misty/ui is linked from during development.
        allow: [
          process.cwd(),
          fileURLToPath(new URL("../misty-docs", import.meta.url)),
          ...Object.values(docsSources),
        ],
      },
      host: "127.0.0.1",
      port: 5176,
      strictPort: false,
      proxy: proxyTarget
        ? {
            "/api": {
              target: proxyTarget,
              changeOrigin: true,
            },
            "/v1": {
              target: proxyTarget,
              changeOrigin: true,
            },
          }
        : undefined,
    },
    resolve: {
      dedupe: ["react", "react-dom", "lucide-react"],
      alias: [
        { find: "@", replacement: fileURLToPath(new URL("./src", import.meta.url)) },
        // One copy of @misty/ui for the site and the docs, whichever folder imports it.
        { find: /^@misty\/ui\/styles\.css$/, replacement: `${docsSources.ui}/styles/index.css` },
        { find: /^@misty\/ui$/, replacement: `${docsSources.ui}/src/index.ts` },
        { find: "@misty/docs", replacement: fileURLToPath(new URL("../misty-docs/src/DocsSite.tsx", import.meta.url)) },
        { find: "@docs-sdk", replacement: `${docsSources.sdk}/docs` },
        { find: "@docs-ui", replacement: docsSources.ui },
      ],
      preserveSymlinks: true,
    },
  };
})
