const moment = require('moment-timezone');
const db = require('../config/db');
const { generateTicketId } = require('../utils/idGenerator');

// Create Ticket
exports.createTicket = (req, res) => {
  const {
    service_type, customer_id, product_type,
    product_serial_number, issue_description,
    contact_person, phone_number, customer_address, email
  } = req.body;

  try {
    const ticket_id = generateTicketId();
    const created_on = moment().tz('Asia/Kolkata').toISOString();


    db.prepare(`
      INSERT INTO tickets (
        ticket_id, created_on, service_type, customer_id, contact_person,
        phone_number, customer_address, product_type, product_serial_number,
        email, issue_description
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      ticket_id, created_on, service_type, customer_id, contact_person,
      phone_number, customer_address, product_type, product_serial_number,
      email, issue_description
    );

    res.status(201).json({ ticket_id });
  } catch (err) {
    console.error('❌ Create ticket error:', err.message);
    res.status(500).json({ message: 'Ticket insert failed' });
  }
};

// Edit Ticket
exports.editTicket = (req, res) => {
  const { ticketId } = req.params;
  const { status, engineer_id, resolution_summary, resolved_date } = req.body;

  try {
    const result = db.prepare(`
      UPDATE tickets
      SET status = ?, engineer_id = ?, resolution_summary = ?, resolved_on = ?
      WHERE ticket_id = ?
    `).run(
      status,
      engineer_id,
      resolution_summary,
      status === 'Closed' ? resolved_date : null,
      ticketId
    );

    res.json({ updated: result.changes > 0 });
  } catch (err) {
    console.error('❌ Edit ticket error:', err.message);
    res.status(500).json({ message: 'Ticket update failed' });
  }
};

// Get All Tickets
exports.getAllTickets = (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM tickets').all();
    res.json(rows);
  } catch (err) {
    console.error('❌ Fetch tickets error:', err.message);
    res.status(500).json({ message: 'Fetch error' });
  }
};
