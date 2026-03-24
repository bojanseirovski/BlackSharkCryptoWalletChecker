import axios from 'axios';
import { ENV } from '../config/env';
import { AnomalyApiRequest, AnomalyApiResponse } from '../types';

export async function checkTransaction(
  data: AnomalyApiRequest,
): Promise<AnomalyApiResponse> {
  try {
    const response = await axios.post<AnomalyApiResponse>(ENV.API_URL, data, {
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch {
    return { status: 'error', message: 'Failed to reach anomaly detection API' };
  }
}
