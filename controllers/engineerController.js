const db = require('../config/db');
const { generateEngineerId } = require('../utils/idGenerator');

exports.addEngineer = (req, res) => {
  const id = generateEngineerId();
  const { name, phone_number, email, category } = req.body;

  try {
    db.prepare(`
      INSERT INTO service_engineers (engineer_id, name, phone_number, email, category)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, name, phone_number, email, category);

    res.status(201).json({ engineer_id: id });
  } catch (err) {
    console.error('Add engineer error:', err.message);
    res.status(500).json({ message: 'Insert failed' });
  }
};

exports.editEngineer = (req, res) => {
  const id = req.params.id;
  const { name, phone_number, email, category } = req.body;

  try {
    const result = db.prepare(`
      UPDATE service_engineers 
      SET name = ?, phone_number = ?, email = ?, category = ? 
      WHERE engineer_id = ?
    `).run(name, phone_number, email, category, id);

    res.json({ updated: result.changes > 0 });
  } catch (err) {
    console.error('Edit engineer error:', err.message);
    res.status(500).json({ message: 'Update failed' });
  }
};

exports.deleteEngineer = (req, res) => {
  const id = req.params.id;

  try {
    const result = db.prepare('DELETE FROM service_engineers WHERE engineer_id = ?').run(id);
    res.json({ deleted: result.changes > 0 });
  } catch (err) {
    console.error('Delete engineer error:', err.message);
    res.status(500).json({ message: 'Delete failed' });
  }
};

exports.getAllEngineers = (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM service_engineers').all();
    res.json(rows);
  } catch (err) {
    console.error('Fetch engineers error:', err.message);
    res.status(500).json({ message: 'Fetch error' });
  }
};
