/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RIO_CHAT_PROXY_URL?: string;
  readonly VITE_APP_RIO_CHAT_PROXY_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
