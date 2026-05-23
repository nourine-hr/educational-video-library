const { Pool } = require('pg');
require('dotenv').config();

// Use Railway's variable names (PGUSER, PGHOST, etc.)
// Or fallback to your local names (DB_USER, DB_HOST, etc.)
const pool = new Pool({
  user: process.env.PGUSER || process.env.DB_USER,
  host: process.env.PGHOST || process.env.DB_HOST,
  database: process.env.PGDATABASE || process.env.DB_NAME,
  password: process.env.PGPASSWORD || process.env.DB_PASSWORD,
  port: process.env.PGPORT || process.env.DB_PORT,
});

// Test connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ Connected to PostgreSQL');
  }
});

module.exports = pool;