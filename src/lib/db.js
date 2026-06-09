import mysql from 'mysql2/promise';
import dns from 'dns';

// Force Node.js to prefer IPv4 — prevents mysql2 connecting via ::1 (IPv6)
dns.setDefaultResultOrder('ipv4first');

// Singleton pool — prevents "Too many connections" on Next.js hot reloads
const globalForDb = globalThis;

if (!globalForDb._mysqlPool) {
  const poolConfig = {
    user:               process.env.DB_USER     || 'root',
    password:           process.env.DB_PASSWORD || '',
    database:           process.env.DB_NAME     || 'iskcon_ayodhya',
    waitForConnections: true,
    connectionLimit:    3,
    queueLimit:         10,
    charset:            'utf8mb4',
    enableKeepAlive:    true,
    keepAliveInitialDelay: 0,
  };

  // Use Unix socket if DB_SOCKET is set (Hostinger shared hosting)
  // otherwise fall back to TCP host
  if (process.env.DB_SOCKET) {
    poolConfig.socketPath = process.env.DB_SOCKET;
  } else {
    poolConfig.host = process.env.DB_HOST || '127.0.0.1';
    poolConfig.port = parseInt(process.env.DB_PORT || '3306');
  }

  globalForDb._mysqlPool = mysql.createPool(poolConfig);
}

const pool = globalForDb._mysqlPool;

export default pool;
