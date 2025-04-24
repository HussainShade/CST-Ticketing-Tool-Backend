const db = require('../config/db');
const { generateCustomerId } = require('../utils/idGenerator');

exports.addCustomer = (req, res) => {
  const id = generateCustomerId();
  const {
    name, address, phone_number, contact_person, email, city,
    postal_code, district, state, customer_type, customer_category
  } = req.body;

  db.run(`INSERT INTO customers (
    customer_id, name, address, city, postal_code, district, state,
    phone_number, email, contact_person, customer_type, customer_category
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, name, address, city, postal_code, district, state, phone_number,
      email, contact_person, customer_type, customer_category],
    err => {
      if (err) return res.status(500).json({ message: 'Insert failed' });
      res.status(201).json({ customer_id: id });
    });
};

exports.editCustomer = (req, res) => {
  const id = req.params.id;
  const {
    name, address, phone_number, contact_person, email, city,
    postal_code, district, state, customer_type, customer_category
  } = req.body;

  db.run(`UPDATE customers SET name=?, address=?, city=?, postal_code=?, district=?,
          state=?, phone_number=?, email=?, contact_person=?, customer_type=?, customer_category=?
          WHERE customer_id=?`,
    [name, address, city, postal_code, district, state, phone_number, email, contact_person,
      customer_type, customer_category, id],
    function (err) {
      if (err) return res.status(500).json({ message: 'Update failed' });
      res.json({ updated: this.changes > 0 });
    });
};

exports.deleteCustomer = (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM customers WHERE customer_id = ?', [id], function (err) {
    if (err) return res.status(500).json({ message: 'Delete failed' });
    res.json({ deleted: this.changes > 0 });
  });
};

exports.getAllCustomers = (req, res) => {
  db.all('SELECT * FROM customers', [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Fetch error' });
    res.json(rows);
  });
};
