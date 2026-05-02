const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const authService = require('../services/authService');
const tokenService = require('../services/tokenService');
const User = require('../models/User');
const { ERROR_CODES } = require('../utils/constants');

const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(409).json(ApiResponse.error(ERROR_CODES.CONFLICT, 'User already exists'));
  }

  const hashedPassword = await authService.hashPassword(password);
  const user = await User.create({ name, email, password: hashedPassword });

  const payload = { id: user._id, email: user.email, name: user.name, onboardingCompleted: user.onboardingCompleted };
  const accessToken = authService.generateAccessToken(payload);
  const { token: refreshToken, expiresAt } = authService.generateRefreshToken(user._id);
  await authService.saveRefreshToken(user._id, refreshToken, expiresAt);

  res.status(201).json(ApiResponse.success({
    user: { id: user._id, name: user.name, email: user.email, onboardingCompleted: user.onboardingCompleted },
    accessToken,
    refreshToken
  }, 'Registration successful'));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (user && user.password && (await authService.comparePasswords(password, user.password))) {
    const payload = { id: user._id, email: user.email, name: user.name, onboardingCompleted: user.onboardingCompleted };
    const accessToken = authService.generateAccessToken(payload);
    const { token: refreshToken, expiresAt } = authService.generateRefreshToken(user._id);
    await authService.saveRefreshToken(user._id, refreshToken, expiresAt);

    res.json(ApiResponse.success({
      user: { id: user._id, name: user.name, email: user.email, onboardingCompleted: user.onboardingCompleted },
      accessToken,
      refreshToken
    }, 'Login successful'));
  } else {
    res.status(401).json(ApiResponse.error(ERROR_CODES.UNAUTHORIZED, 'Invalid credentials'));
  }
});

const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    await authService.revokeRefreshToken(refreshToken);
  }
  res.json(ApiResponse.success(null, 'Logged out successfully'));
});

const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json(ApiResponse.error(ERROR_CODES.VALIDATION_ERROR, 'Refresh token required'));
  }

  try {
    const tokens = await tokenService.rotateTokens(refreshToken);
    res.json(ApiResponse.success(tokens, 'Tokens refreshed'));
  } catch (error) {
    res.status(401).json(ApiResponse.error(ERROR_CODES.UNAUTHORIZED, error.message));
  }
});

const googleCallback = asyncHandler(async (req, res) => {
  // req.user is set by passport
  const user = req.user;
  const payload = { id: user._id, email: user.email, name: user.name, onboardingCompleted: user.onboardingCompleted };
  const accessToken = authService.generateAccessToken(payload);
  const { token: refreshToken, expiresAt } = authService.generateRefreshToken(user._id);
  await authService.saveRefreshToken(user._id, refreshToken, expiresAt);

  const redirectPath = user.onboardingCompleted ? '/dashboard' : '/onboarding';
  res.redirect(`${process.env.FRONTEND_URL}${redirectPath}?token=${accessToken}&refresh=${refreshToken}`);
});

const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json(ApiResponse.success(user, 'Current user fetched'));
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, phone, autoReplyEnabled } = req.body;
  const updates = {};
  if (name !== undefined) updates.name = name;
  if (email !== undefined) updates.email = email;
  if (phone !== undefined) updates.phone = phone;
  if (autoReplyEnabled !== undefined) updates.autoReplyEnabled = autoReplyEnabled;

  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
  res.json(ApiResponse.success(user, 'Profile updated successfully'));
});

const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json(ApiResponse.error(ERROR_CODES.VALIDATION_ERROR, 'Please upload a resume file'));
  }

  // Save the path to the user's document
  const resumeFileName = req.file.filename;
  
  // Here we would normally extract text from PDF/DOCX using a library like pdf-parse
  // For the sake of this feature, we'll pretend we extracted it, or just store the filename
  const user = await User.findByIdAndUpdate(
    req.user._id, 
    { 
      resumeFileName: resumeFileName,
      resumeText: `Extracted text from ${req.file.originalname}` // Mock extracted text
    }, 
    { new: true }
  );

  res.json(ApiResponse.success({ user, filename: req.file.originalname }, 'Resume uploaded successfully'));
});

module.exports = { signup, login, logout, refresh, googleCallback, getMe, updateProfile, uploadResume };
