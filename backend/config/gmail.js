const { google } = require('googleapis');
const ConnectedApp = require('../models/ConnectedApp');

const createOAuth2Client = () => {
  return new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    process.env.GMAIL_REDIRECT_URI
  );
};

const getGmailClientForUser = async (userId) => {
  const appConnection = await ConnectedApp.findOne({ userId, appId: 'gmail' });
  if (!appConnection || !appConnection.accessToken) {
    throw new Error('Gmail is not connected for this user');
  }

  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials({
    access_token: appConnection.accessToken,
    refresh_token: appConnection.refreshToken,
    expiry_date: appConnection.expiresAt ? appConnection.expiresAt.getTime() : null,
  });

  // Handle auto-refresh of token
  oauth2Client.on('tokens', async (tokens) => {
    if (tokens.refresh_token) {
      appConnection.refreshToken = tokens.refresh_token;
    }
    appConnection.accessToken = tokens.access_token;
    appConnection.expiresAt = new Date(tokens.expiry_date);
    await appConnection.save();
  });

  return google.gmail({ version: 'v1', auth: oauth2Client });
};

module.exports = { createOAuth2Client, getGmailClientForUser };
