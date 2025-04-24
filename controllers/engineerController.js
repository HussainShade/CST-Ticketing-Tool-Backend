const db = require('../config/db');
const { generateEngineerId } = require('../utils/idGenerator');

exports.addEngineer = (req, res) => {
  const id = generateEngineerId();
  const { name, phone_number, email, category } = req.body;

  db.run(`INSERT INTO service_engineers (engineer_id, name, phone_number, email, category)
          VALUES (?, ?, ?, ?, ?)`,
    [id, name, phone_number, email, category],
    err => {
      if (err) return res.status(500).json({ message: 'Insert failed' });
      res.status(201).json({ engineer_id: id });
    });
};

exports.editEngineer = (req, res) => {
  const id = req.params.id;
  const { name, phone_number, email, category } = req.body;

  db.run(`UPDATE service_engineers SET name=?, phone_number=?, email=?, category=? WHERE engineer_id=?`,
    [name, phone_number, email, category, id],
    function (err) {
      if (err) return res.status(500).json({ message: 'Update failed' });
      res.json({ updated: this.changes > 0 });
    });
};

exports.deleteEngineer = (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM service_engineers WHERE engineer_id = ?', [id], function (err) {
    if (err) return res.status(500).json({ message: 'Delete failed' });
    res.json({ deleted: this.changes > 0 });
  });
};

exports.getAllEngineers = (req, res) => {
  db.all('SELECT * FROM service_engineers', [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Fetch error' });
    res.json(rows);
  });
};
