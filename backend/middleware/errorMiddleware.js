const ApiResponse = require('../utils/ApiResponse');
const { ERROR_CODES } = require('../utils/constants');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let code = ERROR_CODES.INTERNAL_ERROR;
  let message = err.message || 'Internal Server Error';
  let details = null;

  if (err.name === 'ValidationError' || err.name === 'ZodError') {
    statusCode = 422;
    code = ERROR_CODES.VALIDATION_ERROR;
    // Special handling for Zod errors done in validateRequest usually, but catch-all here
  } else if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    code = ERROR_CODES.NOT_FOUND;
    message = 'Resource not found';
  } else if (err.code === 11000) {
    statusCode = 409;
    code = ERROR_CODES.CONFLICT;
    message = 'Duplicate field value entered';
  }

  logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  res.status(statusCode).json(ApiResponse.error(code, message, details));
};

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = { errorHandler, notFound };
