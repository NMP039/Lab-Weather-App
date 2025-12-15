/// <reference types="vite/client" />

// Provide typings for `import.meta.env` used by Vite
interface ImportMetaEnv {
  readonly VITE_BACKEND_URL?: string;
  // add other VITE_... env vars here if needed
  [key: string]: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
