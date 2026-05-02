const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  source: { type: String, enum: ['Gmail', 'Slack', 'Calendar', 'Drive', 'AI', 'System'] },
  color: { type: String }, // hex colour from BRAND constants
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  metadata: { type: Map, of: String }, // e.g. { emailId, threadId }
  createdAt: { type: Date, default: Date.now, index: true }
});

module.exports = mongoose.model('Activity', activitySchema);
