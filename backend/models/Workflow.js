const mongoose = require('mongoose');

const workflowSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  trigger: {
    app: { type: String, enum: ['gmail', 'gcal'] },
    condition: { type: String } // e.g. 'contains "urgent"', 'mentioned in channel'
  },
  action: {
    type: { type: String, enum: ['create_task', 'summarize', 'notify'] },
    priority: { type: String, enum: ['Urgent', 'High', 'Normal', 'Low'] }
  },
  on: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Workflow', workflowSchema);
