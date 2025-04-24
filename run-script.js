const sqlite3 = require('sqlite3').verbose();

// Connect to the database
let db = new sqlite3.Database('issue_ticketing.db');

// Insert into customers table (All Tamil Nadu-based)
db.run(`
  INSERT INTO customers (customer_id, name, address, city, postal_code, district, state, phone_number, email, contact_person, customer_type, customer_category)
  VALUES 
    ('CUSTTN001', 'Chennai InfoTech', '22 Mount Road', 'Chennai', '600002', 'Chennai', 'Tamil Nadu', '9840011122', 'support@chennaitech.in', 'Arun Kumar', 'Business - GSTIN901TN', 'AMC'),
    ('CUSTTN002', 'Madurai Agro Systems', '5 Theni Main Road', 'Madurai', '625020', 'Madurai', 'Tamil Nadu', '9003456789', 'info@maduraiagro.com', 'Lakshmi Narayan', 'Business - GSTIN902TN', 'Percall'),
    ('CUSTTN003', 'Coimbatore Robotics Pvt Ltd', '18 Avinashi Rd', 'Coimbatore', '641004', 'Coimbatore', 'Tamil Nadu', '9786054321', 'service@cberobotics.com', 'Siva Ranjani', 'Business - GSTIN903TN', 'On-Demand'),
    ('CUSTTN004', 'Trichy InfraTech', '7 Rockfort Ln', 'Tiruchirappalli', '620002', 'Tiruchirappalli', 'Tamil Nadu', '9626223344', 'admin@trichyinfra.in', 'Ganesh M', 'Business - GSTIN904TN', 'AMC')
`);

// Insert into service_engineers table (Tamil Nadu based)
db.run(`
  INSERT INTO service_engineers (engineer_id, name, phone_number, email, category)
  VALUES 
    ('ENGTN001', 'Ravi Shankar', '9444467890', 'ravi@tnservices.com', 'L1'),
    ('ENGTN002', 'Divya Balan', '9789078654', 'divya@tnservices.com', 'L2'),
    ('ENGTN003', 'Sathish Kumar', '9551234987', 'sathish@tnservices.com', 'L1'),
    ('ENGTN004', 'Priya D', '9361187462', 'priya@tnservices.com', 'L2')
`);

// Insert into tickets table (All linked to TN customers and engineers)
db.run(`
  INSERT INTO tickets (ticket_id, service_type, customer_id, contact_person, phone_number, customer_address, product_type, product_serial_number, email, engineer_id, issue_description, status)
  VALUES 
    ('TKTN001', 'Contract', 'CUSTTN001', 'Arun Kumar', '9840011122', '22 Mount Road, Chennai', 'Laptop', 'CHN-LTP-001', 'arun.kumar@chennaitech.in', 'ENGTN001', 'Battery draining quickly', 'Created'),
    ('TKTN002', 'Percall', 'CUSTTN002', 'Lakshmi Narayan', '9003456789', '5 Theni Main Road, Madurai', 'Tractor Control Unit', 'MDU-TRC-789', 'lakshmi@maduraiagro.com', 'ENGTN002', 'Sensor not responding', 'Allocated'),
    ('TKTN003', 'On-Demand', 'CUSTTN003', 'Siva Ranjani', '9786054321', '18 Avinashi Rd, Coimbatore', 'Robotic Arm', 'CBE-RBA-004', 'ranjani@cberobotics.com', 'ENGTN003', 'Motor malfunction', 'In Progress'),
    ('TKTN004', 'AMC', 'CUSTTN004', 'Ganesh M', '9626223344', '7 Rockfort Ln, Tiruchirappalli', 'Surveillance System', 'TRY-SVS-321', 'ganesh@trichyinfra.in', 'ENGTN004', 'Camera feed loss', 'Created')
`, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Tamil Nadu sample data inserted successfully');
  db.close(); // Close only after last query completes
});
