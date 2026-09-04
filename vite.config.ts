import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
import { sites } from './build/sites-vite-plugin'

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
    plugins: [react(), tailwindcss(), sites()],
    define: {
      "import.meta.env.MISTY_PUBLIC_API_URL": JSON.stringify(apiBase ?? ""),
    },
    server: {
      port: 5174,
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
      preserveSymlinks: true,
    },
  };
})
