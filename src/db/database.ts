import initSqlJs, { Database } from 'sql.js';
import { Transaction } from '../types';

let db: Database | null = null;

export async function initDB(): Promise<Database> {
  if (db) return db;

  const SQL = await initSqlJs({
    locateFile: (file: string) =>
      `https://sql.js.org/dist/${file}`,
  });

  const saved = localStorage.getItem('walletchecker_db');
  if (saved) {
    const buf = Uint8Array.from(atob(saved), (c) => c.charCodeAt(0));
    db = new SQL.Database(buf);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount TEXT NOT NULL,
      destination_address TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      wallet_age INTEGER NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('ok', 'anomalous')),
      tx_hash TEXT
    );
  `);

  persist();
  return db;
}

function persist() {
  if (!db) return;
  const data = db.export();
  const binary = String.fromCharCode(...data);
  localStorage.setItem('walletchecker_db', btoa(binary));
}

export async function insertTransaction(
  tx: Omit<Transaction, 'id'>,
): Promise<number> {
  const database = await initDB();
  database.run(
    `INSERT INTO transactions (amount, destination_address, timestamp, wallet_age, status, tx_hash)
     VALUES (?, ?, ?, ?, ?, ?);`,
    [tx.amount, tx.destination_address, tx.timestamp, tx.wallet_age, tx.status, tx.tx_hash],
  );
  const result = database.exec('SELECT last_insert_rowid() as id;');
  persist();
  return result[0].values[0][0] as number;
}

export async function getAllTransactions(): Promise<Transaction[]> {
  const database = await initDB();
  const result = database.exec('SELECT * FROM transactions ORDER BY id DESC;');
  if (result.length === 0) return [];

  const columns = result[0].columns;
  return result[0].values.map((row: unknown[]) => {
    const obj: Record<string, unknown> = {};
    columns.forEach((col: string, i: number) => {
      obj[col] = row[i];
    });
    return obj as unknown as Transaction;
  });
}
