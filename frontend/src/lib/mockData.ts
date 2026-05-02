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

export const MOCK_TASKS: Task[] = [];

export const MOCK_SUGGESTIONS: string[] = [];

export const MOCK_ACTIVITY: any[] = [];

export const MOCK_WORKFLOWS: any[] = [];