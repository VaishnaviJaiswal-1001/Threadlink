const Task = require('../models/Task');
const Workflow = require('../models/Workflow');
// const gmailService = require('./gmailService'); // would be needed in full implementation

const generateDayTasks = async (userId) => {
  // Stub implementation
  // 1. Fetch recent Gmail messages (last 24h)
  // 2. Fetch active Workflows for user
  // 3. Apply workflow matching rules
  // 4. Create Task docs for matches
  
  // Fake generated tasks for demonstration
  const stubTasks = [
    { title: 'Follow up on Q3 report', priority: 'High', source: 'Gmail', userId },
    { title: 'Prepare slide deck for review', priority: 'Normal', source: 'Drive', userId }
  ];

  const tasks = await Task.insertMany(stubTasks);
  return tasks;
};
const { OpenAI } = require('openai');
const logger = require('../utils/logger');

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

const parseEmailWithAI = async (subject, body, from, workflows = []) => {
  try {
    const prompt = `
    Analyze the following email and determine if it requires action.
    If the email specifies ANY date, deadline, or event, you MUST set "isActionable" to true, and extract that date into "deadline" (in YYYY-MM-DD format) and "time" (in HH:mm 24-hour format if specified, otherwise null).
    
    You must also check if this email triggers any of the user's CUSTOM WORKFLOWS listed below.
    CUSTOM WORKFLOWS:
    ${JSON.stringify(workflows.map(w => ({ condition: w.trigger.condition, action: w.action.type, priority: w.action.priority })))}
    If the email matches a workflow's condition, set "isActionable" to true, and format the "suggestedTask" according to the workflow's action priority.

    Return ONLY a JSON object with the following schema:
    {
      "category": "string (e.g. Task, Newsletter, Urgent, Info)",
      "summary": "string (1 sentence summary)",
      "isActionable": boolean,
      "suggestedTask": {
        "title": "string (short actionable title)",
        "deadline": "string (YYYY-MM-DD or null if no deadline)",
        "time": "string (HH:mm or null if no specific time)",
        "priority": "string (Low, Normal, High, Urgent)"
      },
      "autoReplyDraftText": "string (a professional, concise reply to this email addressing its content. You MUST ALWAYS generate a reply, never null)"
    }

    Email From: ${from}
    Subject: ${subject}
    Body: ${(body || '').substring(0, 1000)}

    Current Date: ${new Date().toISOString()} (IMPORTANT: Use this year/month/date if the email mentions relative dates like "tomorrow" or missing years like "May 15th").
    `;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    const parsed = JSON.parse(response.choices[0].message.content);
    return parsed;
  } catch (error) {
    logger.error('Error parsing email with Groq:', error.message);
    // Fallback to simulation if Groq fails
    return {
      category: 'Task',
      summary: `Email from ${from} regarding ${subject}`,
      isActionable: true,
      suggestedTask: {
        title: `Follow up: ${subject}`,
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: 'high'
      },
      autoReplyDraftText: `Hi there,\n\nThank you for reaching out regarding "${subject}". I have received your message and will get back to you shortly.\n\nBest regards,\nThreadlink AI`
    };
  }
};

module.exports = { generateDayTasks, parseEmailWithAI };
