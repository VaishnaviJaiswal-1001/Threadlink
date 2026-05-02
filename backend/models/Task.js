const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  priority: { type: String, enum: ['Urgent', 'High', 'Normal', 'Low'], default: 'Normal' },
  deadline: { type: String }, // keep as string to match frontend format
  source: { type: String, enum: ['Gmail', 'Slack', 'Calendar', 'Drive', 'Manual'] },
  done: { type: Boolean, default: false },
  time: { type: String }, // e.g. "09:00"
  externalId: { type: String }, // Gmail message ID, Calendar event ID, etc.
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
