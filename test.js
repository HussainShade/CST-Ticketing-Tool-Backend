// run-script.js
const db = require('./config/db'); // Adjust the path if needed

try {
  const rows = db.prepare('SELECT * FROM service_engineers').all();

  console.log('📋 All Customers:');
  console.table(rows); // Clean tabular display in console
} catch (err) {
  console.error('❌ Error fetching customers:', err.message);
  process.exit(1);
}
