export const ENV = {
  BITGO_ACCESS_TOKEN: import.meta.env.VITE_BITGO_ACCESS_TOKEN ?? '',
  BITGO_WALLET_ID: import.meta.env.VITE_BITGO_WALLET_ID ?? '',
  BITGO_WALLET_PASSPHRASE: import.meta.env.VITE_BITGO_WALLET_PASSPHRASE ?? '',
  API_URL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/check',
  WALLET_ADDRESS: import.meta.env.VITE_WALLET_ADDRESS ?? '',
  WALLET_AGE_DAYS: parseInt(import.meta.env.VITE_WALLET_AGE_DAYS ?? '30', 10),
};
