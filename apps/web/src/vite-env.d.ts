/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_ENV?: string;
  readonly VITE_SERVER_URL?: string;
  readonly VITE_APP_TITLE?: string;
  readonly VITE_LOG_LEVEL?: string;
  readonly VITE_ENABLE_DEV_TOOLS?: string;
  readonly VITE_MOCK_DELAY_MS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
