const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const createAdmin = async (userId, plainPassword) => {
  try {
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const query = `
      INSERT INTO admin (user_id, password)
      VALUES ($1, $2)
      RETURNING admin_id;
    `;
    const values = [userId, hashedPassword];
    const res = await pool.query(query, values);
    console.log(`✅ Admin created with ID: ${res.rows[0].admin_id}`);
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await pool.end();
  }
};

// Call function with sample values
createAdmin('admin@caresoft.in', 'Caresoft@Gold123');
