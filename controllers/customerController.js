const pool = require('../config/db');
const { generateCustomerId } = require('../utils/idGenerator');

// ➕ Add Customer
exports.addCustomer = async (req, res) => {
  const customer_id = generateCustomerId();
  const {
    name, address, phone_number, contact_person, email, city,
    postal_code, district, state, customer_type, customer_category
  } = req.body;

  try {
    const sql = `
      INSERT INTO customers (
        customer_id, name, address, city, postal_code, district, state,
        phone_number, email, contact_person, customer_type, customer_category
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12
      )
    `;
    await pool.query(sql, [
      customer_id, name, address, city, postal_code, district, state,
      phone_number, email, contact_person, customer_type, customer_category
    ]);

    res.status(201).json({ customer_id });
  } catch (err) {
    console.error('Insert error:', err.message);
    res.status(500).json({ message: 'Insert failed' });
  }
};

// ✏️ Edit Customer
exports.editCustomer = async (req, res) => {
  const customer_id = req.params.id;
  const {
    name, address, phone_number, contact_person, email, city,
    postal_code, district, state, customer_type, customer_category
  } = req.body;

  try {
    const sql = `
      UPDATE customers SET 
        name = $1, address = $2, city = $3, postal_code = $4,
        district = $5, state = $6, phone_number = $7, email = $8,
        contact_person = $9, customer_type = $10, customer_category = $11
      WHERE customer_id = $12
    `;

    const result = await pool.query(sql, [
      name, address, city, postal_code, district, state,
      phone_number, email, contact_person, customer_type, customer_category, customer_id
    ]);

    res.json({ updated: result.rowCount > 0 });
  } catch (err) {
    console.error('Update error:', err.message);
    res.status(500).json({ message: 'Update failed' });
  }
};

// 🗑️ Delete Customer
exports.deleteCustomer = async (req, res) => {
  const customer_id = req.params.id;

  try {
    const { rows } = await pool.query(
      'SELECT COUNT(*) FROM tickets WHERE customer_id = $1', [customer_id]
    );

    if (parseInt(rows[0].count) > 0) {
      return res.status(400).json({ message: 'Cannot delete customer. Linked tickets exist.' });
    }

    const result = await pool.query(
      'DELETE FROM customers WHERE customer_id = $1', [customer_id]
    );

    res.json({ deleted: result.rowCount > 0 });
  } catch (err) {
    console.error('Delete error:', err.message);
    res.status(500).json({ message: 'Delete failed' });
  }
};

// 📥 Get All Customers
exports.getAllCustomers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customers');
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch error:', err.message);
    res.status(500).json({ message: 'Fetch failed' });
  }
};
