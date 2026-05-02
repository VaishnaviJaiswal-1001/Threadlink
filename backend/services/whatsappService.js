const logger = require('../utils/logger');
const axios = require('axios');

// Initialize Twilio client if credentials are provided in .env
let twilioClient = null;
if (process.env.TWILIO_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
}

const sendWhatsAppReminder = async (user, taskTitle, customMessage = null) => {
  const dashboardUrl = `${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard`;
  
  const defaultMessage = `🔔 *Threadlink Reminder*\n\nYou have an actionable email asking you to apply! \n\n*Task:* ${taskTitle}\n\nPlease check your dashboard to apply:\n👉 ${dashboardUrl}`;
  const message = customMessage || defaultMessage;
  
  if (twilioClient) {
    try {
      const targetPhone = user.phone || process.env.MY_PHONE_NUMBER;
      logger.info(`[WhatsApp Service] Attempting to send to: ${targetPhone} (user.phone: ${user.phone}, env.MY_PHONE_NUMBER: ${process.env.MY_PHONE_NUMBER})`);
      
      await twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886', 
        to: `whatsapp:${targetPhone}` 
      });
      logger.info(`[WhatsApp Service] Reminder sent successfully via Twilio to ${targetPhone}.`);
    } catch (error) {
      logger.error("[WhatsApp Service] Failed to send Twilio message:", error.message);
    }
  } else {
    // Mock sending behavior if no Twilio config is in the .env yet
    logger.info(`[WhatsApp Service - MOCK] Sending message to ${user.name || user.email}: ${message.replace(/\n/g, ' ')}`);
  }
};

module.exports = { sendWhatsAppReminder };
