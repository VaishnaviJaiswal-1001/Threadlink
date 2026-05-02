const cron = require('node-cron');
const { getInbox } = require('./gmailService');
const { parseEmailWithAI } = require('./aiService');
const Task = require('../models/Task');
const User = require('../models/User');
const ConnectedApp = require('../models/ConnectedApp');
const logger = require('../utils/logger');
const { sendWhatsAppReminder } = require('./whatsappService');

// Store last processed time per user to avoid duplicate tasks
const lastProcessedMap = new Map();

const processUserInbox = async (userId) => {
  try {
    const connectedApp = await ConnectedApp.findOne({ userId, appId: 'gmail', connected: true });
    if (!connectedApp) return;

    const userDoc = await User.findById(userId);
    const autoReplyEnabled = userDoc?.autoReplyEnabled !== false;

    logger.info(`Mailbot scanning inbox for user ${userId}...`);
    // Fetch recent emails
    const { messages } = await getInbox(userId, null);
    if (!messages || messages.length === 0) return;

    let processedCount = 0;
    const gmailService = require('./gmailService'); // ensure required for markAsRead/sendReply
    
    for (const msg of messages) {
      // Only process emails that are unread
      if (!msg.read) {
        // Check if we already created a task for this email
        const existingTask = await Task.findOne({ userId, externalId: msg.id });
        
        if (!existingTask) {
          logger.info(`Mailbot analyzing email for auto-reply and tasks: ${msg.subject}`);
          const Workflow = require('../models/Workflow');
          const activeWorkflows = await Workflow.find({ userId, on: true });
          const aiAnalysis = await parseEmailWithAI(msg.subject, msg.snippet, msg.from, activeWorkflows);
          
          // 1. If the AI generated an auto-reply, send it immediately!
          if (aiAnalysis.autoReplyDraftText && autoReplyEnabled) {
            try {
              const match = msg.from.match(/<(.+)>/);
              const toAddress = match ? match[1] : msg.from;
              
              await gmailService.sendReply(userId, {
                to: toAddress,
                subject: msg.subject,
                body: aiAnalysis.autoReplyDraftText,
                threadId: msg.threadId,
                messageId: msg.messageIdHeader
              });
              logger.info(`Mailbot sent AI auto-reply to ${toAddress}`);
            } catch (replyErr) {
              logger.error(`Mailbot failed to send auto-reply to ${msg.from}:`, replyErr.message);
            }
          }

          // Important: Mark the email as read so we don't process or reply to it again on the next polling cycle!
          try {
            await gmailService.markAsRead(userId, msg.id);
          } catch (err) {
            logger.error(`Failed to mark email ${msg.id} as read:`, err.message);
          }

          // 2. Task Creation Logic
          // We rely purely on the AI's analysis to determine if the email is actionable
          const contentStr = `${msg.subject || ''} ${msg.snippet || ''}`.toLowerCase();

          if (aiAnalysis.isActionable && aiAnalysis.suggestedTask) {
            const priorityMap = { low: 'Low', medium: 'Normal', high: 'High', urgent: 'Urgent' };
            const p = aiAnalysis.suggestedTask.priority?.toLowerCase();
            
            const newTask = await Task.create({
              userId,
              title: aiAnalysis.suggestedTask.title,
              priority: priorityMap[p] || 'Normal',
              deadline: aiAnalysis.suggestedTask.deadline || null,
              source: 'Gmail',
              done: false,
              externalId: msg.id
            });
            logger.info(`Mailbot created task: ${aiAnalysis.suggestedTask.title}`);
            processedCount++;

            if (aiAnalysis.suggestedTask.deadline && aiAnalysis.suggestedTask.deadline !== 'null') {
              const { createCalendarEvent } = require('./gcalService');
              await createCalendarEvent(userId, {
                title: `Task Deadline: ${aiAnalysis.suggestedTask.title}`,
                description: `Created from Threadlink AI based on email: ${msg.subject}`,
                dateStr: aiAnalysis.suggestedTask.deadline,
                timeStr: aiAnalysis.suggestedTask.time
              });
              logger.info(`Mailbot scheduled calendar event for task: ${aiAnalysis.suggestedTask.title}`);
            }

            // If the actionable email specifically relates to applying, handle it
            if (/apply/i.test(contentStr)) {
              const userDoc = await User.findById(userId);
              if (userDoc) {
                if (userDoc.resumeFileName) {
                  // If they have a resume, trigger Auto-Apply!
                  const { autoApplyForJob } = require('./autoApplyService');
                  // Run async without blocking the mailbot loop
                  autoApplyForJob(userDoc, aiAnalysis.suggestedTask.title).catch(err => logger.error(err));
                } else {
                  // Otherwise, just send a standard manual reminder
                  await sendWhatsAppReminder(userDoc, aiAnalysis.suggestedTask.title);
                }
              }
            }
          }
        }
      }
    }
    if (processedCount > 0) {
      logger.info(`Mailbot finished. Created ${processedCount} new tasks for user ${userId}.`);
    }

  } catch (error) {
    logger.error(`Mailbot error for user ${userId}:`, error.message);
  }
};

const startMailbot = () => {
  const runJob = async () => {
    logger.info('Mailbot job triggered.');
    try {
      // Find users with connected Gmail
      const connectedApps = await ConnectedApp.find({ appId: 'gmail', connected: true });
      const userIds = [...new Set(connectedApps.map(app => app.userId))];
      
      for (const userId of userIds) {
        await processUserInbox(userId);
      }
    } catch (err) {
      logger.error('Mailbot general error:', err);
    }
  };

  // Run immediately on boot for better testing and immediate syncing
  runJob();

  // Run every 10 minutes
  cron.schedule('*/10 * * * *', runJob);
  logger.info('Mailbot background service started. Polling every 10 minutes.');
};

module.exports = { startMailbot, processUserInbox };
