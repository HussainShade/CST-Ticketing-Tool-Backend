const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' }); // If no token, return 401
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token using JWT_SECRET
    req.user = decoded; // Attach user data to request object for further use in the route handlers
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error('JWT verification error:', err); // Log error details for debugging
    res.status(403).json({ message: 'Invalid or expired token' }); // Return 403 for invalid token
  }
};
