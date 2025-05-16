require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'booking_app',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

// Test database connection
async function testConnection() {
  try {
    const client = await pool.connect();
    client.release();
    return true;
  } catch (error) {
    console.log(error);
    console.error('Error connecting to the database:', error.message);
    return false;
  }
}

module.exports = {
  pool,
  testConnection,
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'booking_app',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
};