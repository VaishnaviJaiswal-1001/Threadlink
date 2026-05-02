const ApiResponse = require('../utils/ApiResponse');
const { ERROR_CODES } = require('../utils/constants');

const validateRequest = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    const details = error.errors ? error.errors.map(e => ({ field: e.path.join('.'), message: e.message })) : null;
    return res.status(422).json(ApiResponse.error(ERROR_CODES.VALIDATION_ERROR, 'Validation failed', details));
  }
};

module.exports = validateRequest;
