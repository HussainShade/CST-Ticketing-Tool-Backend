const pool = require('../config/db'); // PostgreSQL Pool using DATABASE_URL
const { generateEngineerId } = require('../utils/idGenerator');

// ➕ Add Engineer
exports.addEngineer = async (req, res) => {
  const engineer_id = generateEngineerId();
  const { name, phone_number, email, category } = req.body;

  try {
    const sql = `
      INSERT INTO service_engineers (
        engineer_id, name, phone_number, email, category
      ) VALUES ($1, $2, $3, $4, $5)
    `;

    await pool.query(sql, [engineer_id, name, phone_number, email, category]);
    res.status(201).json({ engineer_id });
  } catch (err) {
    console.error('Add engineer error:', err.message);
    res.status(500).json({ message: 'Insert failed' });
  }
};

// ✏️ Edit Engineer
exports.editEngineer = async (req, res) => {
  const engineer_id = req.params.id;
  const { name, phone_number, email, category } = req.body;

  try {
    const sql = `
      UPDATE service_engineers SET
        name = $1, phone_number = $2, email = $3, category = $4
      WHERE engineer_id = $5
    `;

    const result = await pool.query(sql, [name, phone_number, email, category, engineer_id]);
    res.json({ updated: result.rowCount > 0 });
  } catch (err) {
    console.error('Edit engineer error:', err.message);
    res.status(500).json({ message: 'Update failed' });
  }
};

// 🗑️ Delete Engineer
exports.deleteEngineer = async (req, res) => {
  const engineer_id = req.params.id;

  try {
    const { rows } = await pool.query(
      'SELECT COUNT(*) FROM tickets WHERE engineer_id = $1', [engineer_id]
    );

    if (parseInt(rows[0].count) > 0) {
      return res.status(400).json({ message: 'Cannot delete engineer. Linked tickets exist.' });
    }

    const result = await pool.query(
      'DELETE FROM service_engineers WHERE engineer_id = $1', [engineer_id]
    );

    res.json({ deleted: result.rowCount > 0 });
  } catch (err) {
    console.error('Delete engineer error:', err.message);
    res.status(500).json({ message: 'Delete failed' });
  }
};

// 📥 Get All Engineers
exports.getAllEngineers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM service_engineers');
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch engineers error:', err.message);
    res.status(500).json({ message: 'Fetch error' });
  }
};
