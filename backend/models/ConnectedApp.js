const mongoose = require('mongoose');

const connectedAppSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  appId: { type: String, enum: ['gmail', 'slack', 'gcal', 'gdrive'], required: true },
  accessToken: { type: String, required: true },
  refreshToken: { type: String },
  expiresAt: { type: Date },
  scope: { type: String },
  connected: { type: Boolean, default: true },
  connectedAt: { type: Date, default: Date.now }
});

connectedAppSchema.index({ userId: 1, appId: 1 }, { unique: true });

module.exports = mongoose.model('ConnectedApp', connectedAppSchema);
