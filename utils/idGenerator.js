const fs = require('fs');
const path = require('path');

const counterFile = path.join(__dirname, 'counters.json');

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

exports.generateTicketId = () => {
  const counters = readCounters();
  const id = `CST${String(counters.ticket).padStart(4, '0')}`;
  counters.ticket += 1;
  writeCounters(counters);
  return id;
};

exports.generateCustomerId = () => {
  const counters = readCounters();
  const id = `CUST${String(counters.cust).padStart(4, '0')}`;
  counters.cust += 1;
  writeCounters(counters);
  return id;
};

exports.generateEngineerId = () => {
  const counters = readCounters();
  const id = `ENG${String(counters.eng).padStart(4, '0')}`;
  counters.eng += 1;
  writeCounters(counters);
  return id;
};
