const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const pool = require('./config/db'); // import DB pool
const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const customerRoutes = require('./routes/customerRoutes');
const engineerRoutes = require('./routes/engineerRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/engineers', engineerRoutes);

// Test DB connection before starting server
(async () => {
  try {
    await pool.query('SELECT 1');
    console.log('✅ Database connected successfully!');
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error('❌ Database connection failed:');
    console.error(err);
    process.exit(1); // Exit if DB not connected
  }
})();
