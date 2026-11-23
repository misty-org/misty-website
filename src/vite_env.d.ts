/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MISTY_PUBLIC_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
