import { Mail, MessageSquare, Calendar, HardDrive } from "lucide-react";

export const BRAND = {
  red: "#E8381A",
  orange: "#F5861A",
  yellow: "#F5C800",
  green: "#2BB74A",
  blue: "#1A6CF5",
  gradient:
    "linear-gradient(90deg, #E8381A 0%, #F5861A 25%, #F5C800 50%, #2BB74A 75%, #1A6CF5 100%)",
};

export const APPS = [
  { id: "gmail", name: "Gmail", color: "#E8381A", icon: Mail, tint: "rgba(232,56,26,0.08)" },
  { id: "slack", name: "Slack", color: "#7C3AED", icon: MessageSquare, tint: "rgba(124,58,237,0.08)" },
  { id: "gcal", name: "Google Calendar", color: "#1A6CF5", icon: Calendar, tint: "rgba(26,108,245,0.08)" },
  { id: "gdrive", name: "Google Drive", color: "#F5C800", icon: HardDrive, tint: "rgba(245,200,0,0.10)" },
];

export const NAV_ITEMS = [
  { label: "Home", href: "/dashboard", icon: "home" as const },
  { label: "Today", href: "/today", icon: "today" as const },
  { label: "Workflows", href: "/workflows", icon: "workflows" as const },
  { label: "AI Suggestions", href: "/dashboard?panel=ai", icon: "ai" as const },
  { label: "Chatbot", href: "/dashboard?panel=chat", icon: "chat" as const },
  { label: "Settings", href: "/settings", icon: "settings" as const },
];