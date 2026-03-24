import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkTransaction } from '../services/api';
import { sendTLTC } from '../services/bitgo';
import { insertTransaction } from '../db/database';
import { ENV } from '../config/env';

export default function SendTransactionPage() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!amount || !destinationAddress) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid amount' });
      return;
    }

    setLoading(true);
    const timestamp = new Date().toISOString();

    try {
      const apiResponse = await checkTransaction({
        amount: parsedAmount,
        wallet_address: destinationAddress,
        timestamp,
        wallet_age: ENV.WALLET_AGE_DAYS,
      });

      if (apiResponse.status === 'ok') {
        try {
          const txHash = await sendTLTC(amount, destinationAddress);
          await insertTransaction({
            amount,
            destination_address: destinationAddress,
            timestamp,
            wallet_age: ENV.WALLET_AGE_DAYS,
            status: 'ok',
            tx_hash: txHash,
          });
          setMessage({ type: 'success', text: `Transaction sent! Tx: ${txHash}` });
          setTimeout(() => navigate('/'), 2000);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Failed to send tLTC via BitGo';
          setMessage({ type: 'error', text: msg });
        }
      } else {
        await insertTransaction({
          amount,
          destination_address: destinationAddress,
          timestamp,
          wallet_age: ENV.WALLET_AGE_DAYS,
          status: 'anomalous',
          tx_hash: null,
        });
        setMessage({
          type: 'error',
          text: apiResponse.message || 'Transaction flagged as anomalous',
        });
        setTimeout(() => navigate('/'), 2000);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred';
      setMessage({ type: 'error', text: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Send tLTC</h2>

      <form onSubmit={handleSend} style={styles.form}>
        <label style={styles.label}>Amount (tLTC)</label>
        <input
          type="text"
          placeholder="0.001"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          style={styles.input}
        />

        <label style={styles.label}>Destination Address</label>
        <input
          type="text"
          placeholder="tLTC address"
          value={destinationAddress}
          onChange={e => setDestinationAddress(e.target.value)}
          style={styles.input}
        />

        <div style={styles.infoBox}>
          <div style={styles.infoText}>Sending from: {ENV.WALLET_ADDRESS}</div>
          <div style={styles.infoText}>Wallet age: {ENV.WALLET_AGE_DAYS} days</div>
          <div style={styles.infoText}>Network: tLTC (Testnet)</div>
        </div>

        {message && (
          <div
            style={{
              ...styles.message,
              backgroundColor: message.type === 'success' ? '#065F46' : '#7F1D1D',
              color: message.type === 'success' ? '#6EE7B7' : '#FCA5A5',
            }}
          >
            {message.text}
          </div>
        )}

        <button type="submit" disabled={loading} style={{
          ...styles.sendButton,
          opacity: loading ? 0.6 : 1,
        }}>
          {loading ? 'Processing...' : 'Send Transaction'}
        </button>

        <button type="button" onClick={() => navigate('/')} style={styles.backButton}>
          Back to Dashboard
        </button>
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 500,
    margin: '0 auto',
    padding: 16,
    minHeight: '100vh',
  },
  heading: {
    color: '#F9FAFB',
    fontSize: 24,
    fontWeight: 600,
    margin: '0 0 20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  label: {
    color: '#D1D5DB',
    fontSize: 14,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#1F2937',
    border: '1px solid #374151',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#F9FAFB',
    outline: 'none',
  },
  infoBox: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 14,
    marginTop: 12,
    border: '1px solid #374151',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  infoText: {
    color: '#9CA3AF',
    fontSize: 13,
  },
  message: {
    padding: '10px 14px',
    borderRadius: 8,
    fontSize: 14,
    marginTop: 8,
  },
  sendButton: {
    backgroundColor: '#3B82F6',
    border: 'none',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    fontWeight: 600,
    color: '#fff',
    marginTop: 16,
  },
  backButton: {
    background: 'none',
    border: '1px solid #374151',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#9CA3AF',
  },
};
