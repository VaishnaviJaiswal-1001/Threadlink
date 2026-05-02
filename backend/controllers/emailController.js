const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const gmailService = require('../services/gmailService');
const { ERROR_CODES } = require('../utils/constants');

const getInbox = asyncHandler(async (req, res) => {
  const { pageToken, q } = req.query;
  try {
    const inbox = await gmailService.getInbox(req.user._id, pageToken, q);
    res.json(ApiResponse.success(inbox, 'Inbox fetched'));
  } catch (error) {
    if (error.message.includes('not connected')) {
      return res.status(403).json(ApiResponse.error(ERROR_CODES.GMAIL_AUTH_REQUIRED, error.message));
    }
    throw error;
  }
});

const getMessage = asyncHandler(async (req, res) => {
  const message = await gmailService.getMessage(req.user._id, req.params.id);
  res.json(ApiResponse.success(message, 'Message fetched'));
});

const sendEmail = asyncHandler(async (req, res) => {
  const { to, subject, body } = req.body;
  const result = await gmailService.sendEmail(req.user._id, { to, subject, body });
  res.json(ApiResponse.success(result, 'Email sent successfully'));
});

const { processUserInbox } = require('../services/mailbotService');

const syncInbox = asyncHandler(async (req, res) => {
  // Trigger mailbot sync on-demand for this user
  await processUserInbox(req.user._id);
  res.json(ApiResponse.success(null, 'Mailbot sync triggered and completed'));
});

const getOAuthUrl = asyncHandler(async (req, res) => {
  const url = gmailService.getGmailAuthUrl(req.user._id);
  res.json(ApiResponse.success({ url }, 'Auth URL generated'));
});

const oauthCallback = asyncHandler(async (req, res) => {
  const { code, state } = req.query; // state contains userId
  if (!code || !state) {
    return res.status(400).json(ApiResponse.error(ERROR_CODES.VALIDATION_ERROR, 'Code and state required'));
  }
  
  await gmailService.handleGmailCallback(state, code);
  
  // Redirect back to frontend onboarding
  res.redirect(`${process.env.FRONTEND_URL}/onboarding`);
});

module.exports = { getInbox, getMessage, sendEmail, syncInbox, getOAuthUrl, oauthCallback };
