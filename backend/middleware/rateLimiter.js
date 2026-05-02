const rateLimit = require('express-rate-limit');
const ApiResponse = require('../utils/ApiResponse');
const { ERROR_CODES } = require('../utils/constants');

const authLimiter = rateLimit({
  windowMs: process.env.AUTH_RATE_LIMIT_WINDOW_MS ? parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS) : 15 * 60 * 1000,
  max: process.env.AUTH_RATE_LIMIT_MAX ? parseInt(process.env.AUTH_RATE_LIMIT_MAX) : 10,
  message: ApiResponse.error(ERROR_CODES.RATE_LIMITED, 'Too many login attempts, please try again later'),
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.GENERAL_RATE_LIMIT_MAX ? parseInt(process.env.GENERAL_RATE_LIMIT_MAX) : 100,
  message: ApiResponse.error(ERROR_CODES.RATE_LIMITED, 'Too many requests, please try again later'),
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { authLimiter, apiLimiter };
