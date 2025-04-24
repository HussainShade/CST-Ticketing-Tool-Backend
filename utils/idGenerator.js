let ticket = 1, cust = 1, eng = 1;

exports.generateTicketId = () => `CST${String(ticket++).padStart(4, '0')}`;
exports.generateCustomerId = () => `CUST${String(cust++).padStart(4, '0')}`;
exports.generateEngineerId = () => `ENG${String(eng++).padStart(4, '0')}`;