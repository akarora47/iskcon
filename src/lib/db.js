import mysql from 'mysql2/promise';

// Singleton pool — prevents "Too many connections" on Next.js hot reloads
const globalForDb = globalThis;

if (!globalForDb._mysqlPool) {
  globalForDb._mysqlPool = mysql.createPool({
    host:               process.env.DB_HOST     || 'localhost',
    user:               process.env.DB_USER     || 'root',
    password:           process.env.DB_PASSWORD || '',
    database:           process.env.DB_NAME     || 'iskcon_ayodhya',
    waitForConnections: true,
    connectionLimit:    3,
    queueLimit:         10,
    charset:            'utf8mb4',
    enableKeepAlive:    true,
    keepAliveInitialDelay: 0,
  });
}

const pool = globalForDb._mysqlPool;

export default pool;
