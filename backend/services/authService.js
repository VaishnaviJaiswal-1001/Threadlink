const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/RefreshToken');
const { v4: uuidv4 } = require('uuid');

const hashPassword = async (plain) => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(plain, salt);
};

const comparePasswords = async (plain, hashed) => {
  return bcrypt.compare(plain, hashed);
};

const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m'
  });
};

const generateRefreshToken = (userId) => {
  const token = uuidv4();
  // Parse '7d' logic, typically we'll just set it to 7 days from now
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  return { token, expiresAt };
};

const saveRefreshToken = async (userId, token, expiresAt) => {
  return RefreshToken.create({ userId, token, expiresAt });
};

const revokeRefreshToken = async (token) => {
  await RefreshToken.findOneAndUpdate({ token }, { revoked: true });
};

module.exports = {
  hashPassword,
  comparePasswords,
  generateAccessToken,
  generateRefreshToken,
  saveRefreshToken,
  revokeRefreshToken
};
