const db = require('../config/db');
const { generateTicketId } = require('../utils/idGenerator');

exports.createTicket = (req, res) => {
  const {
    service_type, customer_id, product_type, product_serial_number,
    engineer_id, issue_description
  } = req.body;

  db.get('SELECT * FROM customers WHERE customer_id = ?', [customer_id], (err, customer) => {
    if (err || !customer) return res.status(400).json({ message: 'Customer not found' });

    const ticket_id = generateTicketId();
    const created_on = new Date().toISOString();

    db.run(`INSERT INTO tickets (
      ticket_id, created_on, service_type, customer_id, contact_person,
      phone_number, customer_address, product_type, product_serial_number,
      email, engineer_id, issue_description
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [ticket_id, created_on, service_type, customer_id, customer.contact_person,
        customer.phone_number, customer.address, product_type, product_serial_number,
        customer.email, engineer_id, issue_description],
      err => {
        if (err) return res.status(500).json({ message: 'Ticket insert failed' });
        res.status(201).json({ ticket_id });
      });
  });
};

exports.editTicket = (req, res) => {
  const { ticketId } = req.params;
  const { status, engineer_id, resolution_summary } = req.body;
  const resolved_on = status === 'Closed' ? new Date().toISOString() : null;

  db.run(`UPDATE tickets SET status = ?, engineer_id = ?, resolution_summary = ?, resolved_on = ?
          WHERE ticket_id = ?`,
    [status, engineer_id, resolution_summary, resolved_on, ticketId],
    function (err) {
      if (err) return res.status(500).json({ message: 'Ticket update failed' });
      res.json({ updated: this.changes > 0 });
    });
};

exports.getAllTickets = (req, res) => {
  db.all('SELECT * FROM tickets', [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Fetch error' });
    res.json(rows);
  });
};
