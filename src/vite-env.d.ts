/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BITGO_ACCESS_TOKEN: string;
  readonly VITE_BITGO_WALLET_ID: string;
  readonly VITE_BITGO_WALLET_PASSPHRASE: string;
  readonly VITE_API_URL: string;
  readonly VITE_WALLET_ADDRESS: string;
  readonly VITE_WALLET_AGE_DAYS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
