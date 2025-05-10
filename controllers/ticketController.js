const moment = require('moment-timezone');
const pool = require('../config/db'); // pg Pool instance
const { generateTicketId } = require('../utils/idGenerator');

// 🧾 Create Ticket
exports.createTicket = async (req, res) => {
  try {
    const {
      service_type, customer_id, product_type,
      product_serial_number, issue_description,
      contact_person, phone_number, customer_address, email
    } = req.body;

    const ticket_id = await generateTicketId();
    const created_on = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');

    const serialNumber = product_serial_number?.trim() || 'NO SERIAL NUMBER';

    const sql = `
      INSERT INTO tickets (
        ticket_id, created_on, service_type, customer_id, contact_person,
        phone_number, customer_address, product_type, product_serial_number,
        email, issue_description
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `;

    await pool.query(sql, [
      ticket_id, created_on, service_type, customer_id, contact_person,
      phone_number, customer_address, product_type, serialNumber,
      email, issue_description
    ]);

    res.status(201).json({ ticket_id });
  } catch (err) {
    console.error('❌ Create ticket error:', err.message);
    res.status(500).json({ message: 'Ticket insert failed' });
  }
};

// ✏️ Edit Ticket
exports.editTicket = async (req, res) => {
  const { ticketId } = req.params;
  const {
    status, engineer_id, resolution_summary,
    resolved_date, product_serial_number
  } = req.body;

  try {
    const resolvedOnValue = status === 'Closed' ? resolved_date : null;

    const sql = `
      UPDATE tickets SET
        status = $1,
        engineer_id = $2,
        resolution_summary = $3,
        resolved_on = $4,
        product_serial_number = $5
      WHERE ticket_id = $6
    `;

    const serialNumber = product_serial_number?.trim() || 'NO SERIAL NUMBER';

    const result = await pool.query(sql, [
      status, engineer_id, resolution_summary, resolvedOnValue, serialNumber, ticketId
    ]);

    res.json({ updated: result.rowCount > 0 });
  } catch (err) {
    console.error('❌ Edit ticket error:', err.message);
    res.status(500).json({ message: 'Ticket update failed' });
  }
};

// 📋 Get All Tickets
exports.getAllTickets = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tickets');
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Fetch tickets error:', err.message);
    res.status(500).json({ message: 'Fetch error' });
  }
};
