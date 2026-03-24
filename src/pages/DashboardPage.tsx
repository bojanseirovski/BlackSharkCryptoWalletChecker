import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllTransactions } from '../db/database';
import { ENV } from '../config/env';
import { Transaction } from '../types';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const load = useCallback(async () => {
    const txs = await getAllTransactions();
    setTransactions(txs);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div style={styles.container}>
      <div style={styles.walletCard}>
        <div style={styles.walletLabel}>Wallet Address (tLTC)</div>
        <div style={styles.walletAddress}>{ENV.WALLET_ADDRESS}</div>
      </div>

      <div style={styles.header}>
        <h2 style={styles.sectionTitle}>Transactions</h2>
        <button style={styles.sendButton} onClick={() => navigate('/send')}>
          Send
        </button>
      </div>

      {transactions.length === 0 ? (
        <div style={styles.empty}>No transactions yet</div>
      ) : (
        <div style={styles.list}>
          {transactions.map(tx => (
            <div key={tx.id} style={styles.txRow}>
              <div style={styles.txInfo}>
                <div style={styles.txAmount}>{tx.amount} tLTC</div>
                <div style={styles.txAddress}>To: {tx.destination_address}</div>
                <div style={styles.txTime}>{tx.timestamp}</div>
                {tx.tx_hash && (
                  <div style={styles.txHash}>Tx: {tx.tx_hash}</div>
                )}
              </div>
              <span
                style={{
                  ...styles.badge,
                  backgroundColor: tx.status === 'ok' ? '#065F46' : '#991B1B',
                }}
              >
                {tx.status === 'ok' ? 'OK' : 'ANOMALOUS'}
              </span>
            </div>
          ))}
        </div>
      )}

      <button style={styles.logoutButton} onClick={logout}>
        Sign Out
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 600,
    margin: '0 auto',
    padding: 16,
    minHeight: '100vh',
  },
  walletCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    border: '1px solid #374151',
  },
  walletLabel: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 4,
  },
  walletAddress: {
    color: '#F9FAFB',
    fontSize: 14,
    fontFamily: 'monospace',
    wordBreak: 'break-all',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#F9FAFB',
    fontSize: 18,
    fontWeight: 600,
    margin: 0,
  },
  sendButton: {
    backgroundColor: '#3B82F6',
    border: 'none',
    borderRadius: 8,
    padding: '8px 20px',
    color: '#fff',
    fontWeight: 600,
    fontSize: 14,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  txRow: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 14,
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #374151',
  },
  txInfo: {
    flex: 1,
    marginRight: 12,
    minWidth: 0,
  },
  txAmount: {
    color: '#F9FAFB',
    fontSize: 16,
    fontWeight: 600,
  },
  txAddress: {
    color: '#9CA3AF',
    fontSize: 13,
    marginTop: 2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  txTime: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 2,
  },
  txHash: {
    color: '#6B7280',
    fontSize: 11,
    marginTop: 2,
    fontFamily: 'monospace',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  badge: {
    borderRadius: 6,
    padding: '4px 10px',
    color: '#fff',
    fontSize: 12,
    fontWeight: 700,
    whiteSpace: 'nowrap',
  },
  empty: {
    color: '#6B7280',
    textAlign: 'center',
    padding: 40,
    fontSize: 16,
  },
  logoutButton: {
    background: 'none',
    border: 'none',
    color: '#EF4444',
    fontSize: 14,
    padding: 12,
    display: 'block',
    margin: '16px auto 0',
  },
};
