const db = require('../config/db');
const { generateTicketId } = require('../utils/idGenerator');

exports.createTicket = (req, res) => {
  const {
    service_type, customer_id, product_type,
    product_serial_number, engineer_id, issue_description
  } = req.body;

  try {
    const customer = db.prepare('SELECT * FROM customers WHERE customer_id = ?').get(customer_id);
    if (!customer) return res.status(400).json({ message: 'Customer not found' });

    const ticket_id = generateTicketId();
    const created_on = new Date().toISOString();

    db.prepare(`
      INSERT INTO tickets (
        ticket_id, created_on, service_type, customer_id, contact_person,
        phone_number, customer_address, product_type, product_serial_number,
        email, engineer_id, issue_description
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      ticket_id, created_on, service_type, customer_id, customer.contact_person,
      customer.phone_number, customer.address, product_type, product_serial_number,
      customer.email, engineer_id, issue_description
    );

    res.status(201).json({ ticket_id });
  } catch (err) {
    console.error('Create ticket error:', err.message);
    res.status(500).json({ message: 'Ticket insert failed' });
  }
};

exports.editTicket = (req, res) => {
  const { ticketId } = req.params;
  const { status, engineer_id, resolution_summary } = req.body;
  const resolved_on = status === 'Closed' ? new Date().toISOString() : null;

  try {
    const result = db.prepare(`
      UPDATE tickets SET status = ?, engineer_id = ?, resolution_summary = ?, resolved_on = ?
      WHERE ticket_id = ?
    `).run(status, engineer_id, resolution_summary, resolved_on, ticketId);

    res.json({ updated: result.changes > 0 });
  } catch (err) {
    console.error('Edit ticket error:', err.message);
    res.status(500).json({ message: 'Ticket update failed' });
  }
};

exports.getAllTickets = (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM tickets').all();
    res.json(rows);
  } catch (err) {
    console.error('Fetch tickets error:', err.message);
    res.status(500).json({ message: 'Fetch error' });
  }
};
