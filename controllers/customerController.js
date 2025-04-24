const db = require('../config/db');
const { generateCustomerId } = require('../utils/idGenerator');

exports.addCustomer = (req, res) => {
  const id = generateCustomerId();
  const {
    name, address, phone_number, contact_person, email, city,
    postal_code, district, state, customer_type, customer_category
  } = req.body;

  try {
    const stmt = db.prepare(`INSERT INTO customers (
      customer_id, name, address, city, postal_code, district, state,
      phone_number, email, contact_person, customer_type, customer_category
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    
    stmt.run(id, name, address, city, postal_code, district, state,
      phone_number, email, contact_person, customer_type, customer_category);
    
    res.status(201).json({ customer_id: id });
  } catch (err) {
    console.error('Insert error:', err.message);
    res.status(500).json({ message: 'Insert failed' });
  }
};

exports.editCustomer = (req, res) => {
  const id = req.params.id;
  const {
    name, address, phone_number, contact_person, email, city,
    postal_code, district, state, customer_type, customer_category
  } = req.body;

  try {
    const stmt = db.prepare(`UPDATE customers SET 
      name = ?, address = ?, city = ?, postal_code = ?, district = ?, state = ?,
      phone_number = ?, email = ?, contact_person = ?, customer_type = ?, customer_category = ?
      WHERE customer_id = ?`);
    
    const result = stmt.run(
      name, address, city, postal_code, district, state,
      phone_number, email, contact_person, customer_type, customer_category, id
    );

    res.json({ updated: result.changes > 0 });
  } catch (err) {
    console.error('Update error:', err.message);
    res.status(500).json({ message: 'Update failed' });
  }
};

exports.deleteCustomer = (req, res) => {
  const id = req.params.id;

  try {
    const stmt = db.prepare('DELETE FROM customers WHERE customer_id = ?');
    const result = stmt.run(id);
    res.json({ deleted: result.changes > 0 });
  } catch (err) {
    console.error('Delete error:', err.message);
    res.status(500).json({ message: 'Delete failed' });
  }
};

exports.getAllCustomers = (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM customers');
    const rows = stmt.all();
    res.json(rows);
  } catch (err) {
    console.error('Fetch error:', err.message);
    res.status(500).json({ message: 'Fetch error' });
  }
};
