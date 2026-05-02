const { google } = require('googleapis');
const { createOAuth2Client } = require('../config/gmail');
const ConnectedApp = require('../models/ConnectedApp');
const logger = require('../utils/logger');

const getGcalClientForUser = async (userId) => {
  // We use the gmail ConnectedApp since we requested both scopes during the Gmail OAuth flow
  const appConnection = await ConnectedApp.findOne({ userId, appId: 'gmail', connected: true });
  if (!appConnection || !appConnection.accessToken) {
    throw new Error('Google Account is not connected for this user');
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

  return google.calendar({ version: 'v3', auth: oauth2Client });
};

const createCalendarEvent = async (userId, { title, description, dateStr, timeStr }) => {
  try {
    const calendar = await getGcalClientForUser(userId);
    
    const isAllDay = !timeStr || timeStr.toLowerCase() === 'null';
    // Parse dateStr and timeStr using a space which is more forgiving for formats like '2:00 PM'
    const eventStart = isAllDay ? new Date(dateStr) : new Date(`${dateStr} ${timeStr}`);
    if (isNaN(eventStart.getTime())) {
      logger.warn(`Invalid date/time string for calendar event: ${dateStr} ${timeStr}`);
      return null;
    }

    let startObj, endObj;

    if (isAllDay) {
      startObj = { date: eventStart.toISOString().split('T')[0] };
      endObj = { date: eventStart.toISOString().split('T')[0] };
    } else {
      // 1 hour event duration
      const eventEnd = new Date(eventStart.getTime() + 60 * 60 * 1000);
      startObj = { dateTime: eventStart.toISOString() };
      endObj = { dateTime: eventEnd.toISOString() };
    }

    const res = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: title,
        description: description || 'Created by Threadlink AI Mailbot',
        start: startObj,
        end: endObj,
      },
    });

    return res.data;
  } catch (error) {
    logger.error(`Failed to create Google Calendar event for user ${userId}:`, error.message);
    return null;
  }
};

const listCalendarEvents = async (userId) => {
  try {
    const calendar = await getGcalClientForUser(userId);
    
    // Fetch events from today onwards
    const res = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 50,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return res.data.items;
  } catch (error) {
    logger.error(`Failed to fetch Google Calendar events for user ${userId}:`, error.message);
    throw error;
  }
};

module.exports = {
  createCalendarEvent,
  listCalendarEvents
};
