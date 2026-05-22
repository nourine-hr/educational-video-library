// src/config/database.js
const { Pool } = require('pg');
require('dotenv').config();

// Create a connection pool
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',        
  host: process.env.DB_HOST || 'localhost',        
  database: process.env.DB_NAME || 'educational_app',    
  password: process.env.DB_PASSWORD || '',         
  port: process.env.DB_PORT || 5432,              
});

// Test connection immediately
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    console.error('Check your .env file settings');
  } else {
    console.log('✅ Connected to PostgreSQL database at', res.rows[0].now);
  }
});

// Handle errors after initial connection
pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
});

module.exports = pool;