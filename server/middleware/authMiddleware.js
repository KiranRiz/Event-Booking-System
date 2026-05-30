const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes - checks if user is authenticated
const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from Authorization header
    if (req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({ 
        message: 'Not authorized, please login' 
      });
    }

    // Verify token using JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user from decoded token id
    req.user = await User.findById(decoded.id).select('-password');

    // Check if user still exists
    if (!req.user) {
      return res.status(401).json({ 
        message: 'User not found' 
      });
    }

    // Move to next middleware
    next();

  } catch (error) {
    return res.status(401).json({ 
      message: 'Not authorized, token failed' 
    });
  }
};

module.exports = { protect };