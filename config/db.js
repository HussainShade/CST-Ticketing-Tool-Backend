const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Use your Neon connection string
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;
