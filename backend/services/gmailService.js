const { createOAuth2Client, getGmailClientForUser } = require('../config/gmail');
const ConnectedApp = require('../models/ConnectedApp');

const getGmailAuthUrl = (userId) => {
  const oauth2Client = createOAuth2Client();
  const scopes = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send'
  ];
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    state: userId.toString(), // pass user ID in state
    prompt: 'consent' // force prompt to get refresh token
  });
};

const handleGmailCallback = async (userId, code) => {
  const oauth2Client = createOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);
  
  const connectedApp = await ConnectedApp.findOneAndUpdate(
    { userId, appId: 'gmail' },
    {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
      scope: tokens.scope,
      connected: true,
      connectedAt: new Date()
    },
    { new: true, upsert: true }
  );
  return connectedApp;
};

const getInbox = async (userId, pageToken) => {
  const gmail = await getGmailClientForUser(userId);
  const response = await gmail.users.messages.list({
    userId: 'me',
    maxResults: 20,
    pageToken,
    labelIds: ['INBOX']
  });
  
  const messages = [];
  if (response.data.messages) {
    for (const msg of response.data.messages) {
      const details = await gmail.users.messages.get({
        userId: 'me',
        id: msg.id,
        format: 'metadata',
        metadataHeaders: ['Subject', 'From', 'Date']
      });
      const headers = details.data.payload.headers;
      messages.push({
        id: msg.id,
        subject: headers.find(h => h.name === 'Subject')?.value || 'No Subject',
        from: headers.find(h => h.name === 'From')?.value || 'Unknown',
        date: headers.find(h => h.name === 'Date')?.value,
        snippet: details.data.snippet,
        read: !details.data.labelIds.includes('UNREAD'),
        labels: details.data.labelIds
      });
    }
  }
  
  return {
    messages,
    nextPageToken: response.data.nextPageToken
  };
};

const getMessage = async (userId, messageId) => {
  const gmail = await getGmailClientForUser(userId);
  const res = await gmail.users.messages.get({
    userId: 'me',
    id: messageId,
    format: 'full'
  });
  return res.data;
};

const sendEmail = async (userId, { to, subject, body }) => {
  const gmail = await getGmailClientForUser(userId);
  const rawMessage = [
    `To: ${to}`,
    `Subject: ${subject}`,
    '',
    body
  ].join('\n');
  const encodedMessage = Buffer.from(rawMessage).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  
  const res = await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: encodedMessage
    }
  });
  return { messageId: res.data.id };
};

const syncInbox = async (userId) => {
  // Stub for sync functionality to generate tasks/activities from matching workflows
  return { tasksCreated: 0, activitiesCreated: 0 };
};

module.exports = {
  getGmailAuthUrl,
  handleGmailCallback,
  getInbox,
  getMessage,
  sendEmail,
  syncInbox
};
