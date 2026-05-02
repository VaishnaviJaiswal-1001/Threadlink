const RefreshToken = require('../models/RefreshToken');
const authService = require('./authService');
const User = require('../models/User');

const rotateTokens = async (oldRefreshTokenStr) => {
  const oldTokenDoc = await RefreshToken.findOne({ token: oldRefreshTokenStr });
  
  if (!oldTokenDoc || oldTokenDoc.revoked || oldTokenDoc.expiresAt < new Date()) {
    throw new Error('Invalid or expired refresh token');
  }

  // Revoke old
  await authService.revokeRefreshToken(oldRefreshTokenStr);

  const user = await User.findById(oldTokenDoc.userId);
  if (!user) throw new Error('User not found');

  const payload = { id: user._id, email: user.email, name: user.name };
  const newAccessToken = authService.generateAccessToken(payload);
  const { token: newRefreshStr, expiresAt } = authService.generateRefreshToken(user._id);

  await authService.saveRefreshToken(user._id, newRefreshStr, expiresAt);

  return { accessToken: newAccessToken, refreshToken: newRefreshStr };
};

module.exports = { rotateTokens };
