const Activity = require('../models/Activity');

const createActivity = async (req, userId, { source, message, metadata = {}, color }) => {
  const activity = await Activity.create({
    userId,
    source,
    message,
    metadata,
    color
  });

  const io = req.app.get('io');
  if (io) {
    io.to(`user:${userId}`).emit('activity:new', activity);
    
    // Also emit updated unread count
    const unreadCount = await Activity.countDocuments({ userId, read: false });
    io.to(`user:${userId}`).emit('notification:badge', { count: unreadCount });
  }

  return activity;
};

module.exports = { createActivity };
