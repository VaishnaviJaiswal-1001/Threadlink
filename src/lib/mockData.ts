export type Priority = "Urgent" | "High" | "Normal" | "Low";
export type Source = "Gmail" | "Slack" | "Calendar" | "Drive";

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  deadline: string;
  source: Source;
  done?: boolean;
  time?: string;
}

export const MOCK_TASKS: Task[] = [
  { id: "1", title: "Reply to Sarah about Q2 roadmap proposal", priority: "Urgent", deadline: "Today, 2:00 PM", source: "Gmail", time: "09:00" },
  { id: "2", title: "Review design handoff in #product-design", priority: "High", deadline: "Today, 4:00 PM", source: "Slack", time: "10:30" },
  { id: "3", title: "Prep agenda for client sync", priority: "High", deadline: "Tomorrow", source: "Calendar", time: "13:00" },
  { id: "4", title: "Sign off on contract revision v3", priority: "Normal", deadline: "Fri", source: "Drive", time: "15:00" },
  { id: "5", title: "Send follow-up to investor intro", priority: "Normal", deadline: "Fri", source: "Gmail", time: "16:30" },
  { id: "6", title: "Archive old onboarding docs", priority: "Low", deadline: "Next week", source: "Drive", time: "17:00" },
];

export const MOCK_SUGGESTIONS = [
  "You have 3 urgent tasks. Start with “Reply to Sarah about Q2 roadmap proposal.”",
  "Your 2pm meeting has no agenda. Want to draft one?",
  "Inbox spiked 38% today — batch-process at 4pm?",
];

export const MOCK_ACTIVITY = [
  { id: "a1", source: "Gmail", color: "#E8381A", message: "New email from Sarah Chen — “Re: Q2 roadmap”", time: "2m ago" },
  { id: "a2", source: "Slack", color: "#7C3AED", message: "Mentioned in #product-design by Maya", time: "12m ago" },
  { id: "a3", source: "AI", color: "#1A6CF5", message: "Generated 6 tasks for today", time: "32m ago" },
  { id: "a4", source: "Calendar", color: "#2BB74A", message: "Event created: Client sync — Thu 1pm", time: "1h ago" },
  { id: "a5", source: "Drive", color: "#F5C800", message: "Contract_v3.pdf shared with you", time: "3h ago" },
];

export const MOCK_WORKFLOWS = [
  { id: "w1", name: "Auto-task urgent emails", trigger: "Gmail · contains “urgent”", action: "Create task · Today", on: true },
  { id: "w2", name: "Slack mentions → tasks", trigger: "Slack · mentioned in channel", action: "Create task · Normal", on: true },
  { id: "w3", name: "Meeting prep", trigger: "Calendar · 30min before event", action: "Summarize · Notify", on: false },
  { id: "w4", name: "Drive sign-offs", trigger: "Drive · shared with me", action: "Create task · High", on: true },
];