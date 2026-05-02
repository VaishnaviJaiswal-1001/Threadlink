const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const Activity = require('../models/Activity');
const { ERROR_CODES } = require('../utils/constants');

const getActivities = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const activities = await Activity.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Activity.countDocuments({ userId: req.user._id });
  const pages = Math.ceil(total / limit);

  res.json(ApiResponse.success(activities, 'Activities fetched', { page, limit, total, pages }));
});

const markRead = asyncHandler(async (req, res) => {
  const activity = await Activity.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { read: true },
    { new: true }
  );

  if (!activity) {
    return res.status(404).json(ApiResponse.error(ERROR_CODES.NOT_FOUND, 'Activity not found'));
  }

  // Optionally emit updated unread count via socket.io
  const io = req.app.get('io');
  if (io) {
    const unreadCount = await Activity.countDocuments({ userId: req.user._id, read: false });
    io.to(`user:${req.user._id}`).emit('notification:badge', { count: unreadCount });
  }

  res.json(ApiResponse.success(activity, 'Activity marked as read'));
});

const markAllRead = asyncHandler(async (req, res) => {
  await Activity.updateMany({ userId: req.user._id, read: false }, { read: true });
  
  const io = req.app.get('io');
  if (io) {
    io.to(`user:${req.user._id}`).emit('notification:badge', { count: 0 });
  }

  res.json(ApiResponse.success(null, 'All activities marked as read'));
});

module.exports = { getActivities, markRead, markAllRead };
