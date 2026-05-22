// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

// Middleware that checks if user has valid token
const authenticateToken = (req, res, next) => {
  // Get token from header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN" → TOKEN

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // Verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    // Token is valid, attach user info to request
    req.user = decoded; // { id: 4, email: "..." }
    next(); // Continue to next handler
  });
};

module.exports = { authenticateToken };