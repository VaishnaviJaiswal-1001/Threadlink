const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const gcalService = require('../services/gcalService');

const getEvents = asyncHandler(async (req, res) => {
  try {
    const events = await gcalService.listCalendarEvents(req.user._id);
    res.json(ApiResponse.success(events, 'Calendar events fetched successfully'));
  } catch (error) {
    if (error.message.includes('not connected')) {
      return res.status(403).json(ApiResponse.error('GCAL_AUTH_REQUIRED', error.message));
    }
    throw error;
  }
});

module.exports = {
  getEvents
};
