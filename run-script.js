const db = require('./config/db'); // Adjust path if needed

try {
  db.transaction(() => {
    db.prepare('DELETE FROM customers').run();
    console.log('✅ All service_engineers records deleted successfully.');
  })();
} catch (err) {
  console.error('❌ Failed to clear service_engineers:', err.message);
}
