const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.loginAdmin = async (req, res) => {
  const { user_id, password } = req.body;

  try {
    const row = db.prepare('SELECT * FROM admin WHERE user_id = ?').get(user_id);

    if (!row) return res.status(401).json({ message: 'Invalid credentials' });

    const isValid = await bcrypt.compare(password, row.password);
    if (!isValid) return res.status(401).json({ message: 'Wrong password' });

    const token = jwt.sign(
      { id: row.admin_id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error during login' });
  }
};
