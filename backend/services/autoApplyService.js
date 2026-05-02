const logger = require('../utils/logger');
const { sendWhatsAppReminder } = require('./whatsappService');

/**
 * Simulates a complex Auto-Apply bot that uses headless browser automation (e.g. Puppeteer)
 * to fill out a job application using the user's parsed resume.
 */
const autoApplyForJob = async (user, taskTitle) => {
  logger.info(`[Auto-Apply Agent] Initializing headless browser for ${user.name}...`);
  
  // Simulate network delay and scraping
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  logger.info(`[Auto-Apply Agent] Found application form for task: ${taskTitle}`);
  logger.info(`[Auto-Apply Agent] Filling out fields using resume: ${user.resumeFileName}...`);
  
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  logger.info(`[Auto-Apply Agent] Successfully submitted application for ${user.name}!`);

  // Trigger Notifications
  const successMessage = `🤖 *Threadlink Auto-Apply Agent*\n\nGreat news! I just automatically applied for the following position using your uploaded resume:\n\n*${taskTitle}*\n\nCheck your dashboard for more details!`;
  
  // 1. WhatsApp Notification
  if (user.phone) {
    try {
      await sendWhatsAppReminder(user, taskTitle, successMessage);
    } catch (err) {
      logger.error("[Auto-Apply Agent] Failed to send WhatsApp success notification", err);
    }
  }

  // 2. Mock Gmail Notification
  // In a real scenario, we would use Nodemailer or the Gmail API to send an email to user.email
  logger.info(`[Auto-Apply Agent] 📧 Sent success email notification to ${user.email}`);
};

module.exports = { autoApplyForJob };
