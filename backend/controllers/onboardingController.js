const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const User = require('../models/User');
const ConnectedApp = require('../models/ConnectedApp');

const getStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('onboardingCompleted selectedApps');
  const connectedAppsDocs = await ConnectedApp.find({ userId: req.user._id, connected: true }).select('appId');
  const connectedApps = connectedAppsDocs.map(doc => doc.appId);
  
  let step = 0;
  if (!user.selectedApps || user.selectedApps.length === 0) step = 1;
  else if (connectedApps.length < user.selectedApps.length) step = 2;
  else if (!user.phone) step = 3;
  else if (!user.onboardingCompleted) step = 4; // ready to complete

  res.json(ApiResponse.success({
    step,
    selectedApps: user.selectedApps || [],
    connectedApps,
    onboardingCompleted: user.onboardingCompleted,
    phone: user.phone
  }, 'Onboarding status fetched'));
});

const savePhone = asyncHandler(async (req, res) => {
  const { phone } = req.body;
  const user = await User.findByIdAndUpdate(req.user._id, { phone }, { new: true });
  res.json(ApiResponse.success({ phone: user.phone }, 'Phone number saved'));
});

const saveSelectedApps = asyncHandler(async (req, res) => {
  const { apps } = req.body;
  const user = await User.findByIdAndUpdate(req.user._id, { selectedApps: apps }, { new: true });
  res.json(ApiResponse.success({ selectedApps: user.selectedApps }, 'Selected apps saved'));
});

const connectApp = asyncHandler(async (req, res) => {
  const { appId } = req.body;
  if (appId === 'gmail' || appId === 'gcal') {
    const gmailService = require('../services/gmailService');
    const url = gmailService.getGmailAuthUrl(req.user._id);
    return res.json(ApiResponse.success({ url }, 'Redirect to Google OAuth'));
  }
  
  // For other apps, just stub the connection for now
  await ConnectedApp.findOneAndUpdate(
    { userId: req.user._id, appId },
    { accessToken: 'stub_token', connected: true },
    { upsert: true }
  );
  
  res.json(ApiResponse.success({ appId, connected: true }, 'App connected via stub'));
});

const completeOnboarding = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user._id, { onboardingCompleted: true }, { new: true });
  res.json(ApiResponse.success({ onboardingCompleted: user.onboardingCompleted }, 'Onboarding completed'));
});

module.exports = { getStatus, saveSelectedApps, connectApp, savePhone, completeOnboarding };
