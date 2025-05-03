// run-script.js
const moment = require('moment-timezone');
const db = require('./config/db');
const { generateTicketId } = require('./utils/idGenerator');

try {
  const customers = db.prepare('SELECT customer_id, name, address, phone_number, email, contact_person FROM customers LIMIT 3').all();
  const engineers = db.prepare('SELECT engineer_id FROM service_engineers LIMIT 3').all();

  if (customers.length === 0 || engineers.length === 0) {
    throw new Error('Insufficient customers or engineers in the database.');
  }

  const tickets = [
    {
      service_type: 'Repair',
      product_type: 'Printer',
      product_serial_number: 'PRN123456',
      issue_description: 'Paper jam frequently.',
      customer: customers[0],
      engineer_id: engineers[0].engineer_id
    },
    {
      service_type: 'Installation',
      product_type: 'Router',
      product_serial_number: 'RTR789654',
      issue_description: 'Need configuration and setup.',
      customer: customers[1],
      engineer_id: engineers[1].engineer_id
    },
    {
      service_type: 'Maintenance',
      product_type: 'CCTV',
      product_serial_number: 'CCTV456321',
      issue_description: 'Poor video quality in night mode.',
      customer: customers[2],
      engineer_id: engineers[2].engineer_id
    }
  ];

  const stmt = db.prepare(`
    INSERT INTO tickets (
      ticket_id, created_on, service_type, customer_id, contact_person,
      phone_number, customer_address, product_type, product_serial_number,
      email, issue_description, engineer_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction((ticketsList) => {
    for (const ticket of ticketsList) {
      const ticket_id = generateTicketId();
      const created_on = moment().tz('Asia/Kolkata').toISOString();

      stmt.run(
        ticket_id,
        created_on,
        ticket.service_type,
        ticket.customer.customer_id,
        ticket.customer.contact_person,
        ticket.customer.phone_number,
        ticket.customer.address,
        ticket.product_type,
        ticket.product_serial_number,
        ticket.customer.email,
        ticket.issue_description,
        ticket.engineer_id
      );

      console.log(`✅ Ticket inserted: ${ticket_id} for customer ${ticket.customer.name}`);
    }
  });

  insertMany(tickets);
} catch (err) {
  console.error('❌ Error inserting tickets:', err.message);
}
