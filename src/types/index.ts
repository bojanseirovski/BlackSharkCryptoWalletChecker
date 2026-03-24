export interface Transaction {
  id: number;
  amount: string;
  destination_address: string;
  timestamp: string;
  wallet_age: number;
  status: 'ok' | 'anomalous';
  tx_hash: string | null;
}

export interface AnomalyApiRequest {
  amount: number;
  wallet_address: string;
  timestamp: string;
  wallet_age: number;
}

export interface AnomalyApiResponse {
  status: 'ok' | 'error';
  message?: string;
}
