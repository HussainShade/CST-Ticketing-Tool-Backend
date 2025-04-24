const sqlite3 = require('sqlite3').verbose();

// Connect to the database
let db = new sqlite3.Database('issue_ticketing.db');

// Use db.serialize to ensure the queries run sequentially
db.serialize(() => {
  // Delete from service_engineers table
  db.run("DELETE FROM service_engineers WHERE engineer_id IN ('ENG001', 'ENG002')", function(err) {
    if (err) {
      return console.error('Error deleting from service_engineers:', err.message);
    }
    console.log('Deleted engineers successfully');
  });

  // Delete from customers table
  db.run("DELETE FROM customers WHERE customer_id IN ('CUST001', 'CUST002')", function(err) {
    if (err) {
      return console.error('Error deleting from customers:', err.message);
    }
    console.log('Deleted customers successfully');
  });

  // Close the database after all queries have been executed
  db.run("DELETE FROM tickets WHERE ticket_id IN ('TICKET001', 'TICKET002')", function(err) {
    if (err) {
      return console.error('Error deleting from tickets:', err.message);
    }
    console.log('Deleted tickets successfully');
    db.close(); // Close only after all operations are complete
  });
});
