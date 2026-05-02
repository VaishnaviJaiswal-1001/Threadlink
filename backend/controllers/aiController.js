const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const Task = require('../models/Task');
const Workflow = require('../models/Workflow');
const ConnectedApp = require('../models/ConnectedApp');

const { OpenAI } = require('openai');

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

const chatWithAI = asyncHandler(async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json(ApiResponse.error(400, 'Message is required'));
  }

  // Gather context for the AI
  const tasks = await Task.find({ userId: req.user._id, done: false });
  const workflows = await Workflow.find({ userId: req.user._id, on: true });
  const apps = await ConnectedApp.find({ userId: req.user._id, connected: true });

  const contextStr = `
USER DATA CONTEXT:
Active Tasks: ${tasks.length}
Workflows: ${workflows.length} active
Connected Apps: ${apps.map(a => a.appId).join(', ')}

Here are some details about their tasks:
${JSON.stringify(tasks.slice(0, 5).map(t => t.title))}

Here are some details about their workflows:
${JSON.stringify(workflows.map(w => ({ name: w.name, trigger: w.trigger.app, action: w.action.type })))}
  `;

  const prompt = `
You are Threadlink AI, the helpful, intelligent assistant for the Threadlink platform. 
Threadlink is an AI-powered automation engine that connects Gmail and Google Calendar to extract tasks and automate workflows.
Your job is to answer user queries, act as an assistant, and help them understand their data or the platform.

${contextStr}

User Query: "${message}"

Keep your response concise, friendly, and helpful. Do NOT output JSON, just conversational text.
  `;

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const aiRes = response.choices[0].message.content;
    return res.json(ApiResponse.success({ reply: aiRes }));
  } catch (error) {
    console.error('AI Chat Error:', error);
    return res.status(500).json(ApiResponse.error(500, 'AI Service Unavailable'));
  }
});

module.exports = { chatWithAI };
