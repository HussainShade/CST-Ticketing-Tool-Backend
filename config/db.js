const Database = require('better-sqlite3');
const path = require('path');

// Resolve DB file path
const dbPath = path.resolve(__dirname, '../issue_ticketing.db');

// Connect to the SQLite DB
let db;
try {
  db = new Database(dbPath);
  console.log('SQLite connected using better-sqlite3');
} catch (err) {
  console.error('SQLite connection error:', err.message);
  process.exit(1); // Exit the process if DB connection fails
}

module.exports = db;
