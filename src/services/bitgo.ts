import axios from 'axios';
import { ENV } from '../config/env';

const BITGO_TEST_URL = 'https://test.bitgo.com/api/v2';

export async function sendTLTC(
  amount: string,
  destinationAddress: string,
): Promise<string> {
  const amountInLitoshis = Math.round(parseFloat(amount) * 1e8).toString();

  const response = await axios.post(
    `${BITGO_TEST_URL}/tltc/wallet/${ENV.BITGO_WALLET_ID}/sendcoins`,
    {
      address: destinationAddress,
      amount: amountInLitoshis,
      walletPassphrase: ENV.BITGO_WALLET_PASSPHRASE,
    },
    {
      headers: {
        Authorization: `Bearer ${ENV.BITGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    },
  );

  return response.data.txid;
}
