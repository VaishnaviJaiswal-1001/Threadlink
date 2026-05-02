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
  res.json(ApiResponse.success(req.user, 'Current user fetched'));
});

module.exports = { signup, login, logout, refresh, googleCallback, getMe };
