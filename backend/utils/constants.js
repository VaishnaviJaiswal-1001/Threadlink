module.exports = {
  PRIORITY_LEVELS: ['Urgent', 'High', 'Normal', 'Low'],
  APP_IDS: ['gmail', 'slack', 'gcal', 'gdrive'],
  SOURCE_NAMES: ['Gmail', 'Slack', 'Calendar', 'Drive', 'Manual', 'AI', 'System'],
  ERROR_CODES: {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    NOT_FOUND: 'NOT_FOUND',
    CONFLICT: 'CONFLICT',
    RATE_LIMITED: 'RATE_LIMITED',
    GMAIL_AUTH_REQUIRED: 'GMAIL_AUTH_REQUIRED',
    INTERNAL_ERROR: 'INTERNAL_ERROR'
  }
};
