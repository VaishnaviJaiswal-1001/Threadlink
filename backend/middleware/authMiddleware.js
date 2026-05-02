const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const { ERROR_CODES } = require('../utils/constants');
const User = require('../models/User');

const verifyJWT = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json(ApiResponse.error(ERROR_CODES.UNAUTHORIZED, 'Not authorized, no token'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json(ApiResponse.error(ERROR_CODES.UNAUTHORIZED, 'Not authorized, user not found'));
    }
    next();
  } catch (error) {
    return res.status(401).json(ApiResponse.error(ERROR_CODES.UNAUTHORIZED, 'Not authorized, token failed'));
  }
});

module.exports = { verifyJWT };
