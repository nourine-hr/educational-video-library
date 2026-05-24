const { Pool } = require('pg');
require('dotenv').config();

// Use DATABASE_URL from Railway
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
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