const rateLimit = require('express-rate-limit');

// General rate limiter for all API routes
const rateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // Maximum 5 requests per 5 minutes
  message: {
    message: 'Too many requests, please try again after 5 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Strict rate limiter for authentication routes
const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // Maximum 3 login attempts per 5 minutes
  message: {
    message: 'Too many login attempts, please try again after 5 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = { rateLimiter, authLimiter };