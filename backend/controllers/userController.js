const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const User = require('../models/User');
const ConnectedApp = require('../models/ConnectedApp');

const getProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  const connectedApps = await ConnectedApp.find({ userId: user._id, connected: true }).select('appId connectedAt');
  res.json(ApiResponse.success({ user, connectedApps }, 'Profile fetched'));
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  const user = await User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true });
  res.json(ApiResponse.success(user, 'Profile updated'));
});

const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json(ApiResponse.error('VALIDATION_ERROR', 'No file uploaded'));
  }
  const sharp = require('sharp');
  const path = require('path');
  const fs = require('fs');

  const filename = `avatar-${req.user._id}-${Date.now()}.png`;
  const uploadPath = path.join(__dirname, '../uploads', filename);

  await sharp(req.file.buffer)
    .resize(200, 200, { fit: 'cover' })
    .png()
    .toFile(uploadPath);

  const profilePicUrl = `/uploads/${filename}`;
  const user = await User.findByIdAndUpdate(req.user._id, { profilePic: profilePicUrl }, { new: true });
  
  res.json(ApiResponse.success({ profilePic: profilePicUrl }, 'Avatar uploaded successfully'));
});

const deleteAccount = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.user._id);
  // Optional: delete tasks, workflows, etc.
  res.json(ApiResponse.success(null, 'Account deleted'));
});

module.exports = { getProfile, updateProfile, uploadAvatar, deleteAccount };
