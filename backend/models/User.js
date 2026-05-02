const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, select: false }, // null for Google-only users
  googleId: { type: String, sparse: true },
  profilePic: { type: String, default: null }, // Cloudinary URL or /uploads path
  onboardingCompleted: { type: Boolean, default: false },
  selectedApps: [{ type: String, enum: ['gmail', 'slack', 'gcal', 'gdrive'] }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
