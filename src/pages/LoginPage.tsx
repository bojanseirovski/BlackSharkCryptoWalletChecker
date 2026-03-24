import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      login(email, password);
    } catch {
      setError('Invalid email or password');
    }
  };

  const handleRegister = () => {
    register();
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h1 style={styles.title}>WalletChecker</h1>
        <p style={styles.subtitle}>tLTC Wallet Monitor</p>

        {error && <div style={styles.error}>{error}</div>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={styles.input}
        />

        <button type="submit" style={styles.loginButton}>
          Sign In
        </button>

        <button type="button" onClick={handleRegister} style={styles.registerButton}>
          Register
        </button>
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#111827',
    padding: 16,
  },
  form: {
    width: '100%',
    maxWidth: 400,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F9FAFB',
    textAlign: 'center',
    margin: 0,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    margin: '0 0 24px',
  },
  error: {
    backgroundColor: '#7F1D1D',
    color: '#FCA5A5',
    padding: '10px 14px',
    borderRadius: 8,
    fontSize: 14,
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
  loginButton: {
    backgroundColor: '#3B82F6',
    border: 'none',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    fontWeight: 600,
    color: '#fff',
  },
  registerButton: {
    backgroundColor: 'transparent',
    border: '1px solid #374151',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#9CA3AF',
  },
};
