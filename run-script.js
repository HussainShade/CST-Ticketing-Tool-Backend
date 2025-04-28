const db = require('./config/db'); // Ensure correct path
const fs = require('fs');
const path = require('path');

const counterFile = path.join(__dirname, 'utils', 'counters.json'); // Path to your counters file

// Initialize counters file if it does not exist
function initializeCounters() {
  if (!fs.existsSync(counterFile)) {
    const initialCounters = { ticket: 1, cust: 1, eng: 1 };
    fs.writeFileSync(counterFile, JSON.stringify(initialCounters, null, 2));
  }
}

// Read counters from the file
function readCounters() {
  initializeCounters();
  const data = fs.readFileSync(counterFile, 'utf-8');
  return JSON.parse(data);
}

// Write updated counters back to the file
function writeCounters(counters) {
  fs.writeFileSync(counterFile, JSON.stringify(counters, null, 2));
}

try {
  db.transaction(() => {
    // Disable foreign key constraints temporarily
    db.prepare('PRAGMA foreign_keys = OFF').run();

    db.prepare('DELETE FROM tickets').run(); // Deleting from tickets first
    db.prepare('DELETE FROM service_engineers').run(); // Then service_engineers
    db.prepare('DELETE FROM customers').run(); // Finally, delete from customers

    // Reset auto-increment IDs in SQLite sequence
    db.prepare("DELETE FROM sqlite_sequence WHERE name = 'tickets'").run();
    db.prepare("DELETE FROM sqlite_sequence WHERE name = 'service_engineers'").run();
    db.prepare("DELETE FROM sqlite_sequence WHERE name = 'customers'").run();

    // Reset custom counters in counters.json
    const counters = { ticket: 1, cust: 1, eng: 1 };
    writeCounters(counters);

    // Re-enable foreign key constraints
    db.prepare('PRAGMA foreign_keys = ON').run();

    console.log('✅ All records deleted, auto-increment IDs reset, and counters refreshed successfully.');
  })();
} catch (err) {
  //console.error('❌ Failed to clear tables and reset counters:', err.message);
}
